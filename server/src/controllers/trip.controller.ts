import { Request, Response } from 'express';
import TripPlan from '../models/TripPlan';
import { generateItinerary } from '../services/gemini';
import { redisClient } from '../config/redis';

const generateSlug = (text: string) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');
};

export const generateTrip = async (req: Request, res: Response) => {
  try {
    const { destination } = req.body;
    if (!destination) {
      return res.status(400).json({ error: 'Destination is required' });
    }

    const baseSlug = generateSlug(destination);
    const slug = `${baseSlug}-mit-der-bahn`;

    // 1. Check Redis Cache
    const cachedTrip = await redisClient.get(`trip:${slug}`);
    if (cachedTrip) {
      return res.json(JSON.parse(cachedTrip));
    }

    // 2. Check MongoDB
    let trip = await TripPlan.findOne({ slug });
    if (trip) {
      await redisClient.setex(`trip:${slug}`, 604800, JSON.stringify(trip));
      return res.json(trip);
    }

    // 3. Call Gemini
    const itinerary = await generateItinerary(destination);
    itinerary.slug = slug;

    // 4. Save to MongoDB
    trip = new TripPlan(itinerary);
    await trip.save();

    // 5. Cache in Redis (7 days TTL)
    await redisClient.setex(`trip:${slug}`, 604800, JSON.stringify(trip));

    return res.status(201).json(trip);
  } catch (error) {
    console.error('Error generating trip:', error);
    return res.status(500).json({ error: 'Failed to generate trip' });
  }
};

export const getTripBySlug = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;

    const cachedTrip = await redisClient.get(`trip:${slug}`);
    if (cachedTrip) {
      return res.json(JSON.parse(cachedTrip));
    }

    const trip = await TripPlan.findOne({ slug });
    if (!trip) {
      return res.status(404).json({ error: 'Trip not found' });
    }

    await redisClient.setex(`trip:${slug}`, 604800, JSON.stringify(trip));
    return res.json(trip);
  } catch (error) {
    console.error('Error fetching trip by slug:', error);
    return res.status(500).json({ error: 'Failed to fetch trip' });
  }
};

export const getHealth = (req: Request, res: Response) => {
  return res.json({ status: 'ok', timestamp: new Date().toISOString() });
};
