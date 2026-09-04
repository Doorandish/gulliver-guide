import mongoose, { Schema, Document } from 'mongoose';

export interface ITripPlan extends Document {
  slug: string;
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
  createdAt: Date;
  updatedAt: Date;
}

const TripPlanSchema: Schema = new Schema(
  {
    slug: { type: String, required: true, unique: true, index: true },
    destination: { type: String, required: true },
    durationDays: { type: Number, default: 2 },
    totalBudget: { type: Number },
    co2SavedPercent: { type: Number },
    recommendedTrain: { type: String },
    days: [
      {
        dayNumber: { type: Number },
        title: { type: String },
        activities: [
          {
            timeSlot: {
              type: String,
              enum: ['Morgen', 'Nachmittag', 'Abend'],
            },
            title: { type: String },
            description: { type: String },
            estimatedPrice: { type: Number },
            category: { type: String },
            bookingDeepLink: { type: String, required: false },
          },
        ],
      },
    ],
    metaTitle: { type: String },
    metaDescription: { type: String },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<ITripPlan>('TripPlan', TripPlanSchema);
