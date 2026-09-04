import { Router } from 'express';
import { generateTrip, getTripBySlug, getHealth } from '../controllers/trip.controller';

const router = Router();

router.post('/trips', generateTrip);
router.get('/trips/:slug', getTripBySlug);
router.get('/health', getHealth);

export default router;
