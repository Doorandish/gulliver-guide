import { Application, Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import cors from 'cors';

export const applySecurityMiddleware = (app: Application) => {
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        fontSrc: ["'self'", 'fonts.googleapis.com', 'fonts.gstatic.com'],
        imgSrc: ["'self'", 'images.unsplash.com', 'data:', 'blob:'],
        styleSrc: ["'self'", "'unsafe-inline'", 'fonts.googleapis.com'],
        scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
        connectSrc: ["'self'", 'api.unsplash.com']
      }
    }
  }));
  
  app.use(compression());
  app.use(morgan('dev'));
  app.use(cors());

  const apiLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 30,
    message: 'Too many requests from this IP, please try again later.',
  });

  app.use('/api', apiLimiter);

  // Global error handler
  app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Internal Server Error' });
  });
};
