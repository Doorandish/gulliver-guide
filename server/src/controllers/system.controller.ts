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
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(400).json({ error: 'GEMINI_API_KEY not set' });
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: 'Ping' }] }]
      })
    });

    const data = await response.json();
    return res.json({
      status: response.status,
      ok: response.ok,
      data
    });
  } catch (error: any) {
    return res.status(500).json({
      error: true,
      message: error.message,
      stack: error.stack
    });
  }
};
