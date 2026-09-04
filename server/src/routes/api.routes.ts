import { Router } from 'express';
import { generateTrip, getTripBySlug, getHealth, planTrip, discoverTrips } from '../controllers/trip.controller';
import { getSystemLogs, testGeminiConnection } from '../controllers/system.controller';
import { getWeather } from '../controllers/weather.controller';
import { systemLogger } from '../utils/logger';

const router = Router();

// Middleware to track endpoint logs
router.use((req, res, next) => {
  const originalSend = res.json;
  res.json = function(body) {
    if (res.statusCode >= 400) {
      systemLogger.addLog({
        level: 'ERROR',
        endpoint: `${req.method} ${req.originalUrl}`,
        message: `API Error ${res.statusCode}`,
        details: body
      });
    }
    return originalSend.call(this, body);
  };
  next();
});

router.post('/trips', generateTrip);
router.post('/trips/plan', planTrip);
router.post('/trips/discover', discoverTrips);
router.get('/trips/:slug', getTripBySlug);
router.get('/health', getHealth);

router.get('/weather/:city', getWeather);
router.get('/system/logs', getSystemLogs);
router.post('/system/test-gemini', testGeminiConnection);

export default router;
