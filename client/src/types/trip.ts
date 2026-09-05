export interface Activity {
  time: string; // e.g. "09:30 - 11:00 Uhr"
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

export interface JourneyDetails {
  departureTime: string;
  arrivalTime: string;
  trainType: string;
  transfers: number;
  transferBuffer?: string;
  lastMile?: string;
  arrivalHomeAdvice?: string;
}

export interface TripPlan {
  slug: string;
  destination: string;
  durationDays: number;
  nettoHoursAtDestination?: number;
  totalBudget: number;
  co2SavedPercent: number;
  recommendedTrain: string;
  outboundJourney?: JourneyDetails;
  inboundJourney?: JourneyDetails;
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
