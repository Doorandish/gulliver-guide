export interface Activity {
  timeSlot: 'Morgen' | 'Nachmittag' | 'Abend';
  title: string;
  description: string;
  estimatedPrice: number;
  category: string;
  bookingDeepLink?: string;
}

export interface TripDay {
  dayNumber: number;
  title: string;
  activities: Activity[];
}

export interface TripPlan {
  slug: string;
  destination: string;
  durationDays: number;
  totalBudget: number;
  co2SavedPercent: number;
  recommendedTrain: string;
  days: TripDay[];
  metaTitle?: string;
  metaDescription?: string;
}

export interface DiscoverySuggestion {
  destination: string;
  tagline: string;
  travelTimeHours: number;
  highlights: string[];
  estimatedBudget: number;
  category: string;
}
