import { Request, Response } from 'express';
import { systemLogger } from '../utils/logger';
import mongoose from 'mongoose';
import { redisClient } from '../config/redis';

export const getSystemLogs = async (req: Request, res: Response) => {
  const apiKey = process.env.GEMINI_API_KEY || '';
  const isGeminiConfigured = apiKey.length > 0;
  const geminiPrefix = isGeminiConfigured ? apiKey.substring(0, 4) + '...' : 'None';

  let mongoStatus = 'disconnected';
  if (mongoose.connection.readyState === 1) mongoStatus = 'connected';
  else if (mongoose.connection.readyState === 2) mongoStatus = 'connecting';
  
  const redisStatus = redisClient.status;

  return res.json({
    health: {
      geminiConfigured: isGeminiConfigured,
      geminiKeyPrefix: geminiPrefix,
      mongoDb: mongoStatus,
      redis: redisStatus
    },
    logs: systemLogger.getLogs()
  });
};

export const testGeminiConnection = async (req: Request, res: Response) => {
  try {
    const { generateWithGemini } = await import('../services/gemini');
    const responseText = await generateWithGemini('Respond with JSON: {"ping": "pong"}');
    
    return res.json({
      status: 200,
      ok: true,
      data: JSON.parse(responseText)
    });
  } catch (error: any) {
    return res.status(500).json({
      error: true,
      message: error.message,
      stack: error.stack
    });
  }
};
