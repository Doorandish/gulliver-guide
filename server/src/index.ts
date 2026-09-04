import express from 'express';
import path from 'path';
import './utils/logger';
import { applySecurityMiddleware } from './middleware/security';
import apiRoutes from './routes/api.routes';
import { connectDB } from './config/db';

const app = express();
app.set('trust proxy', 1);
const PORT = process.env.PORT || 3001;

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Apply middleware
applySecurityMiddleware(app);

// Mount API routes
app.use('/api', apiRoutes);

// Serve static client files
app.use(express.static(path.join(__dirname, '../../client/dist')));

// Catch-all route for SPA
app.get('{*path}', (req, res) => {
  res.sendFile(path.join(__dirname, '../../client/dist/index.html'));
});

const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

startServer();
