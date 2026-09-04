import { Request, Response } from 'express';
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

const FALLBACK_URL = 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?auto=format&fit=crop&w=800&q=80';

export const getPlacePhoto = async (req: Request, res: Response) => {
  try {
    const query = req.query.query as string;
    if (!query) {
      return res.redirect(302, FALLBACK_URL);
    }

    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
      console.warn('GOOGLE_MAPS_API_KEY is not set, falling back to Unsplash.');
      return res.redirect(302, FALLBACK_URL);
    }

    const cacheKey = `photo:${generateSlug(query)}`;
    
    let cachedUrl = null;
    try {
      cachedUrl = await redisClient.get(cacheKey);
    } catch (err) {
      console.warn('Redis get failed for photo:', err);
    }

    if (cachedUrl) {
      return res.redirect(302, cachedUrl);
    }

    // Fetch from Google Places API
    const textSearchUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(query)}&key=${apiKey}`;
    const response = await fetch(textSearchUrl);
    const data: any = await response.json();

    let finalUrl = FALLBACK_URL;

    if (data.results && data.results.length > 0 && data.results[0].photos && data.results[0].photos.length > 0) {
      const photoRef = data.results[0].photos[0].photo_reference;
      finalUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photo_reference=${photoRef}&key=${apiKey}`;
    }

    try {
      // 14 days = 1209600 seconds
      await redisClient.setex(cacheKey, 1209600, finalUrl);
    } catch (err) {
      console.warn('Redis set failed for photo:', err);
    }

    return res.redirect(302, finalUrl);
  } catch (error) {
    console.error('Error fetching place photo:', error);
    return res.redirect(302, FALLBACK_URL);
  }
};
