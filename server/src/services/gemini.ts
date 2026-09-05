import { GoogleGenerativeAI } from '@google/generative-ai';

export interface JourneyDetails {
  departureTime: string;
  arrivalTime: string;
  trainType: string;
  transfers: number;
  transferBuffer?: string;
  lastMile?: string;
  arrivalHomeAdvice?: string;
}

export interface TripPlanData {
  slug?: string;
  destination: string;
  durationDays: number;
  nettoHoursAtDestination?: number;
  totalBudget: number;
  co2SavedPercent: number;
  recommendedTrain: string;
  outboundJourney?: JourneyDetails;
  inboundJourney?: JourneyDetails;
  days: {
    dayNumber: number;
    title: string;
    activities: {
      time: string;
      title: string;
      description: string;
      rainAlternative?: string;
      estimatedPrice: number;
      category: string;
      bookingDeepLink?: string;
    }[];
  }[];
  metaTitle: string;
  metaDescription: string;
}

export interface DiscoverySuggestion {
  destination: string;
  tagline: string;
  category: string;
  trainDuration: string;
  directTrain: boolean;
  estimatedBudget: number;
  photoQuery: string;
}

const CANDIDATE_MODELS = [
  'gemini-1.5-flash',
  'gemini-2.0-flash',
  'gemini-1.5-pro',
  'gemini-3.6-flash',
  'gemini-pro'
];

export async function generateWithGemini(prompt: string, systemInstruction?: string): Promise<{ text: string, modelUsed: string }> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not set');
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  let lastError: any = null;

  for (const modelName of CANDIDATE_MODELS) {
    try {
      const modelConfig: any = { model: modelName };
      if (systemInstruction) {
        modelConfig.systemInstruction = systemInstruction;
      }
      const model = genAI.getGenerativeModel(modelConfig);

      const result = await model.generateContent({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: {
          responseMimeType: 'application/json',
          temperature: 0.7
        }
      });

      const text = result.response.text();
      if (text) return { text, modelUsed: modelName };
    } catch (err: any) {
      lastError = err;
      console.warn(`Model ${modelName} failed:`, err.message);
      continue;
    }
  }

  throw lastError || new Error('No compatible Gemini model found for this API key.');
}

export const generateItinerary = async (destination: string, hasDt?: boolean, fridayStart?: string): Promise<TripPlanData> => {
  const schemaStr = `{
    "destination": "string",
    "durationDays": "number",
    "nettoHoursAtDestination": "number",
    "totalBudget": "number",
    "co2SavedPercent": "number",
    "recommendedTrain": "string",
    "outboundJourney": {
      "departureTime": "string",
      "arrivalTime": "string",
      "trainType": "string",
      "transfers": "number",
      "transferBuffer": "string",
      "lastMile": "string"
    },
    "inboundJourney": {
      "departureTime": "string",
      "arrivalTime": "string",
      "trainType": "string",
      "transfers": "number",
      "transferBuffer": "string",
      "arrivalHomeAdvice": "string"
    },
    "metaTitle": "string",
    "metaDescription": "string",
    "days": [
      {
        "dayNumber": "number",
        "title": "string",
        "activities": [
          {
            "time": "string",
            "title": "string",
            "description": "string",
            "rainAlternative": "string",
            "estimatedPrice": "number",
            "category": "string"
          }
        ]
      }
    ]
  }`;

  let systemInstruction = 'Du bist ein Experte für realistische Bahnreisen in Deutschland (r/reisende Niveau). Generiere einen Reiseplan. Berechne nettoHoursAtDestination. Erstelle eine detaillierte outboundJourney (Hinfahrt am Freitag) und inboundJourney (Rückreise am Sonntag). "Last Mile": Erkläre in outboundJourney.lastMile, wie man vom Hbf zur Unterkunft kommt. Regen-Plan B: Outdoor-Aktivitäten brauchen eine rainAlternative. Puffer am Sonntagabend: Plane entspannt in inboundJourney.arrivalHomeAdvice. Der Tag MUSS granular nach Stunden geplant werden (time z.B. "09:30 - 11:00 Uhr"). Tag 1 (Freitag) hat 2 Aktivitäten (Check-in, Abendessen). Tag 2 (Samstag) hat 5 verschiedene Aktivitäten. Tag 3 (Sonntag) hat 4 Aktivitäten bis zur Abfahrt.';
  let prompt = `Plane einen stressfreien Wochenendtrip nach ${destination}.${fridayStart ? ` Abfahrt am Freitag: ${fridayStart}.` : ''} Nur authentische Orte. MUST RETURN STRICT JSON MATCHING THIS SCHEMA: ${schemaStr}`;

  if (hasDt) {
    const dtInstruction = ' Der Nutzer reist mit dem Deutschlandticket. Nutze AUSSCHLIESSLICH Regionalzüge (RE, RB). Zugkosten=0€. Plane längere realistische Fahrzeiten.';
    systemInstruction += dtInstruction;
    prompt += dtInstruction;
  }

  const geminiResponse = await generateWithGemini(prompt, systemInstruction);
  
  let text = geminiResponse.text;
  try {
    text = text.replace(/```json/gi, '').replace(/```/g, '').trim();
    const firstBrace = text.indexOf('{');
    const lastBrace = text.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace !== -1) {
      text = text.substring(firstBrace, lastBrace + 1);
    }
    return JSON.parse(text) as TripPlanData;
  } catch (error) {
    console.error('Failed to parse Gemini JSON response:', geminiResponse.text);
    throw new Error('Failed to parse trip itinerary JSON from AI');
  }
};

export const discoverDestinations = async (
  origin: string,
  weekend: string,
  budget?: string,
  style?: string,
  hasDt?: boolean,
  fridayStart?: string
): Promise<DiscoverySuggestion[]> => {
  const budgetHint = budget ? ` Budget-Niveau: ${budget}.` : '';
  const styleHint = style ? ` Reisestil: ${style}.` : '';

  const schemaStr = `{
    "suggestions": [
      {
        "destination": "string",
        "tagline": "string",
        "category": "Kultur & Geschichte|Natur & Wandern|Romantik & Altstadt|Wellness & Genuss",
        "trainDuration": "string",
        "directTrain": "boolean",
        "estimatedBudget": "number",
        "photoQuery": "string"
      }
    ]
  }`;

  let systemInstruction = 'Du bist ein Experte für Wochenendreisen in Deutschland per Bahn. Schlage ein JSON Array mit genau 8 unterschiedlichen Reisezielen vor. Priorisiere IMMER realistische und kurze Fahrtzeiten vom Abfahrtsort (z.B. von Nürnberg/Ansbach aus: Bamberg, Regensburg, Augsburg, Würzburg). Antworte nur mit echten Städten und authentischen Sehenswürdigkeiten. Alle Budget-Angaben als positive Zahl. photoQuery ist der Name einer ikonischen Sehenswürdigkeit (z.B. "Altes Rathaus Bamberg").';
  let prompt = `Schlage ein JSON Array mit genau 8 perfekten Wochenendzielen vor für eine Zugreise ab ${origin}. Zeitraum: ${weekend}.${fridayStart ? ` Abfahrt am Freitag: ${fridayStart}.` : ''}${budgetHint}${styleHint} Nur echte deutsche Städte. Priorisiere Ziele, die von ${origin} aus schnell und mit wenig Umstiegen erreichbar sind. MUST RETURN STRICT JSON MATCHING THIS SCHEMA: ${schemaStr}`;

  if (hasDt) {
    const dtInstruction = ' Der Nutzer reist mit dem Deutschlandticket. Nutze AUSSCHLIESSLICH Regionalzüge (RE, RB, S-Bahn). Die Fahrtkosten für Züge betragen 0€ im Gesamtbudget. Ziele MÜSSEN in 1-3 Stunden erreichbar sein.';
    systemInstruction += dtInstruction;
    prompt += dtInstruction;
  }

  const geminiResponse = await generateWithGemini(prompt, systemInstruction);
  
  let text = geminiResponse.text;
  try {
    text = text.replace(/```json/gi, '').replace(/```/g, '').trim();
    const firstBrace = text.indexOf('{');
    const lastBrace = text.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace !== -1) {
      text = text.substring(firstBrace, lastBrace + 1);
    }
    const parsed = JSON.parse(text);
    return parsed.suggestions as DiscoverySuggestion[];
  } catch (error) {
    console.error('Failed to parse Gemini JSON response for discovery:', geminiResponse.text);
    throw new Error('Failed to parse discovery JSON from AI');
  }
};
