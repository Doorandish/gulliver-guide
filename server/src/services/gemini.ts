import { GoogleGenerativeAI } from '@google/generative-ai';

export interface TripPlanData {
  slug?: string;
  destination: string;
  durationDays: number;
  totalBudget: number;
  co2SavedPercent: number;
  recommendedTrain: string;
  days: {
    dayNumber: number;
    title: string;
    activities: {
      timeSlot: 'Morgen' | 'Nachmittag' | 'Abend';
      title: string;
      description: string;
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
  title: string;
  description: string;
  trainDuration: string;
  estimatedBudget: number;
  highlightActivity: string;
}

const CANDIDATE_MODELS = [
  'gemini-1.5-flash-latest',
  'gemini-2.0-flash',
  'gemini-1.5-flash',
  'gemini-1.5-pro',
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
      const model = genAI.getGenerativeModel(
        { model: modelName, systemInstruction },
        { apiVersion: 'v1beta' }
      );

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
      // Try next model if 404
      if (err?.status === 404 || err?.message?.includes('not found')) {
        continue;
      }
      throw err;
    }
  }

  throw lastError || new Error('No compatible Gemini model found for this API key.');
}

export const generateItinerary = async (destination: string): Promise<TripPlanData> => {
  const schemaStr = `{
    "destination": "string",
    "durationDays": "number",
    "totalBudget": "number",
    "co2SavedPercent": "number",
    "recommendedTrain": "string",
    "metaTitle": "string",
    "metaDescription": "string",
    "days": [
      {
        "dayNumber": "number",
        "title": "string",
        "activities": [
          {
            "timeSlot": "Morgen|Nachmittag|Abend",
            "title": "string",
            "description": "string",
            "estimatedPrice": "number",
            "category": "string"
          }
        ]
      }
    ]
  }`;

  const systemInstruction = 'Act as an expert German travel planner. Generate a weekend trip itinerary. All content in German. Only real, authentic landmarks and attractions. Budget in EUR. Include train recommendation.';
  const prompt = `Act as an expert German travel planner. Generate a weekend trip itinerary for ${destination}. All content in German. Only real, authentic landmarks and attractions. Budget in EUR. Include train recommendation. MUST RETURN STRICT JSON MATCHING THIS SCHEMA: ${schemaStr}`;

  const geminiResponse = await generateWithGemini(prompt, systemInstruction);
  let text = geminiResponse.text.replace(/^```json/m, '').replace(/^```/m, '').trim();
  
  return JSON.parse(text) as TripPlanData;
};

export const discoverDestinations = async (
  origin: string,
  weekend: string,
  budget?: string,
  style?: string
): Promise<DiscoverySuggestion[]> => {
  const budgetHint = budget ? ` Budget-Niveau: ${budget}.` : '';
  const styleHint = style ? ` Reisestil: ${style}.` : '';

  const schemaStr = `{
    "suggestions": [
      {
        "destination": "string",
        "title": "string",
        "description": "string",
        "trainDuration": "string",
        "estimatedBudget": "number",
        "highlightActivity": "string"
      }
    ]
  }`;

  const systemInstruction = 'Du bist ein Experte für Wochenendreisen in Deutschland per Bahn. Schlage ein JSON Array mit genau 3 unterschiedlichen Reisezielen vor, die per Zug vom Abfahrtsort gut erreichbar sind. Antworte nur mit echten Städten und authentischen Sehenswürdigkeiten.';
  const prompt = `Schlage ein JSON Array mit 3 perfekten Wochenendzielen vor für eine Zugreise ab ${origin} (z.B. ab München -> Salzburg, Regensburg, Garmisch-Partenkirchen). Zeitraum: ${weekend}.${budgetHint}${styleHint} Nur echte deutsche Städte und Attraktionen. Alles auf Deutsch. MUST RETURN STRICT JSON MATCHING THIS SCHEMA: ${schemaStr}`;

  const geminiResponse = await generateWithGemini(prompt, systemInstruction);
  let text = geminiResponse.text.replace(/^```json/m, '').replace(/^```/m, '').trim();
  const parsed = JSON.parse(text);
  
  return parsed.suggestions as DiscoverySuggestion[];
};
