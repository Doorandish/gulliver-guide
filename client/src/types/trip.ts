export interface Activity {
  timeSlot: 'Morgen' | 'Nachmittag' | 'Abend';
  title: string;
  description: string;
  rainAlternative?: string;
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
  nettoHoursAtDestination?: number;
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
  category: string;
  trainDuration: string;
  directTrain: boolean;
  estimatedBudget: number;
  photoQuery: string;
}
