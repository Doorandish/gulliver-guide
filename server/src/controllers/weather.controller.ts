import { Request, Response } from 'express';

export const getWeather = async (req: Request, res: Response) => {
  try {
    const { city } = req.params;
    const apiKey = process.env.OPENWEATHER_API_KEY;
    
    if (!apiKey) {
      return res.status(400).json({ error: 'OPENWEATHER_API_KEY is missing' });
    }
    
    if (!city) {
      return res.status(400).json({ error: 'City parameter is required' });
    }

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city as string)}&units=metric&lang=de&appid=${apiKey}`;
    
    const response = await fetch(url);
    if (!response.ok) {
      if (response.status === 404) {
         return res.status(404).json({ error: 'City not found' });
      }
      throw new Error(`OpenWeather API error: ${response.statusText}`);
    }

    const data: any = await response.json();
    
    return res.json({
      temp: Math.round(data.main.temp),
      description: data.weather[0]?.description || '',
      icon: data.weather[0]?.icon || '01d',
      main: data.weather[0]?.main || 'Clear'
    });
  } catch (error: any) {
    console.error('Error fetching weather:', error);
    return res.status(500).json({ error: 'Failed to fetch weather data' });
  }
};
