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

export const generateItinerary = async (destination: string): Promise<TripPlanData> => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not set');
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

  const prompt = `Act as an expert German travel planner. Generate a weekend trip itinerary for ${destination}. All content in German. Only real, authentic landmarks and attractions. Budget in EUR. Include train recommendation. Return JSON.`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      systemInstruction: {
        parts: [{ text: 'Act as an expert German travel planner. Generate a weekend trip itinerary. All content in German. Only real, authentic landmarks and attractions. Budget in EUR. Include train recommendation.' }],
      },
      generationConfig: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: 'OBJECT',
          properties: {
            destination: { type: 'STRING' },
            durationDays: { type: 'NUMBER' },
            totalBudget: { type: 'NUMBER' },
            co2SavedPercent: { type: 'NUMBER' },
            recommendedTrain: { type: 'STRING' },
            metaTitle: { type: 'STRING' },
            metaDescription: { type: 'STRING' },
            days: {
              type: 'ARRAY',
              items: {
                type: 'OBJECT',
                properties: {
                  dayNumber: { type: 'NUMBER' },
                  title: { type: 'STRING' },
                  activities: {
                    type: 'ARRAY',
                    items: {
                      type: 'OBJECT',
                      properties: {
                        timeSlot: { type: 'STRING', enum: ['Morgen', 'Nachmittag', 'Abend'] },
                        title: { type: 'STRING' },
                        description: { type: 'STRING' },
                        estimatedPrice: { type: 'NUMBER' },
                        category: { type: 'STRING' }
                      },
                      required: ['timeSlot', 'title', 'description', 'estimatedPrice', 'category']
                    }
                  }
                },
                required: ['dayNumber', 'title', 'activities']
              }
            }
          },
          required: ['destination', 'durationDays', 'totalBudget', 'co2SavedPercent', 'recommendedTrain', 'days', 'metaTitle', 'metaDescription']
        }
      }
    }),
  });

  if (!response.ok) {
    throw new Error(`Gemini API error: ${response.statusText}`);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data: any = await response.json();
  let text: string = data.candidates[0].content.parts[0].text;
  
  // Sanitize markdown backticks if present
  text = text.replace(/^```json/m, '').replace(/^```/m, '').trim();
  
  return JSON.parse(text) as TripPlanData;
};

export interface DiscoverySuggestion {
  destination: string;
  tagline: string;
  travelTimeHours: number;
  highlights: string[];
  estimatedBudget: number;
  category: string;
}

export const discoverDestinations = async (
  origin: string,
  weekend: string,
  budget?: string,
  style?: string
): Promise<DiscoverySuggestion[]> => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error('GEMINI_API_KEY is not set');
    throw new Error('GEMINI_API_KEY is missing');
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

  const budgetHint = budget ? ` Budget-Niveau: ${budget}.` : '';
  const styleHint = style ? ` Reisestil: ${style}.` : '';

  const prompt = `Schlage ein JSON Array mit 3 perfekten Wochenendzielen vor für eine Zugreise ab ${origin} (z.B. ab München -> Salzburg, Regensburg, Garmisch-Partenkirchen). Zeitraum: ${weekend}.${budgetHint}${styleHint} Nur echte deutsche Städte und Attraktionen. Alles auf Deutsch.`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        systemInstruction: {
          parts: [{ text: 'Du bist ein Experte für Wochenendreisen in Deutschland per Bahn. Schlage ein JSON Array mit genau 3 unterschiedlichen Reisezielen vor, die per Zug vom Abfahrtsort gut erreichbar sind. Antworte nur mit echten Städten und authentischen Sehenswürdigkeiten.' }],
        },
        generationConfig: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: 'OBJECT',
            properties: {
              suggestions: {
                type: 'ARRAY',
                items: {
                  type: 'OBJECT',
                  properties: {
                    destination: { type: 'STRING' },
                    title: { type: 'STRING' },
                    description: { type: 'STRING' },
                    trainDuration: { type: 'STRING' },
                    estimatedBudget: { type: 'NUMBER' },
                    highlightActivity: { type: 'STRING' }
                  },
                  required: ['destination', 'title', 'description', 'trainDuration', 'estimatedBudget', 'highlightActivity']
                }
              }
            },
            required: ['suggestions']
          }
        }
      }),
    });

    if (!response.ok) {
      console.error(`Gemini API error: ${response.statusText}`);
      throw new Error(`Gemini API error: ${response.statusText}`);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data: any = await response.json();
    let text: string = data.candidates[0].content.parts[0].text;
    text = text.replace(/^```json/m, '').replace(/^```/m, '').trim();
    const parsed = JSON.parse(text);
    return parsed.suggestions as DiscoverySuggestion[];
  } catch (error) {
    console.error('Error in discoverDestinations:', error);
    throw error;
  }
};
