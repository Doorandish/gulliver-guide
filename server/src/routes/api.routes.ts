import { Router } from 'express';
import { generateTrip, getTripBySlug, getHealth, planTrip, discoverTrips } from '../controllers/trip.controller';

const router = Router();

router.post('/trips', generateTrip);
router.post('/trips/plan', planTrip);
router.post('/trips/discover', discoverTrips);
router.get('/trips/:slug', getTripBySlug);
router.get('/health', getHealth);

export default router;
