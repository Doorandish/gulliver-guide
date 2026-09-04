# 🧳 Gulliver Guide

> **Dein KI-Wochenendtrip mit der Bahn** — AI-powered weekend travel platform for the DACH market.

[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-61dafb.svg)](https://react.dev/)

## Overview

Gulliver Guide generates AI-powered weekend trip itineraries for destinations across Germany. Users enter a destination, and the platform creates a detailed 2-day travel plan with real attractions, estimated costs, and direct train booking links to Deutsche Bahn and Omio.

### Key Features

- 🤖 **AI Itinerary Generation** — Powered by Google Gemini 2.5 Flash
- 🚆 **Train-First Travel** — Deep links to Deutsche Bahn & Omio for instant booking
- 💰 **Budget-Friendly** — Real price estimates for each activity
- 🌱 **Eco-Conscious** — CO₂ savings vs. car travel
- 🇩🇪 **DACH-Optimized** — German UI, legal pages (Impressum/Datenschutz), SEO
- ⚡ **Intelligent Caching** — Redis + MongoDB for fast responses, minimal API costs

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, Vite, TypeScript, TailwindCSS, Lucide Icons |
| Backend | Express 5, TypeScript |
| Database | MongoDB (Mongoose) |
| Cache | Redis (ioredis) |
| AI | Google Gemini 2.5 Flash (REST API) |
| Deployment | Heroku |

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)
- Redis (local or cloud)
- Google Gemini API Key

### Installation

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/gulliver-guide.git
cd gulliver-guide

# Install all dependencies (root, client, server)
npm install

# Configure environment
cp .env.example .env
# Edit .env with your API keys and connection strings

# Build the project
npm run build

# Start the production server
npm start
```

### Development

```bash
# Run client and server concurrently
npm run dev
```

The client runs on `http://localhost:5173` and proxies API requests to the server on `http://localhost:3001`.

## Project Structure

```
gulliver-guide/
├── client/                  # React + Vite + TailwindCSS
│   ├── src/
│   │   ├── components/      # Hero, Timeline, TripCard, TrainBookingCard
│   │   ├── pages/           # HomePage, PlanDetailPage, Impressum, Datenschutz
│   │   ├── types/           # TypeScript interfaces
│   │   └── utils/           # Deep-link helpers
├── server/                  # Express 5 + MongoDB + Redis
│   ├── src/
│   │   ├── config/          # DB & Redis connections
│   │   ├── controllers/     # Trip generation & retrieval
│   │   ├── models/          # Mongoose schemas
│   │   ├── routes/          # API endpoints
│   │   ├── services/        # Gemini API & deep-link generator
│   │   └── middleware/      # Security, rate-limiting, errors
├── Procfile                 # Heroku process file
├── package.json             # Root monorepo orchestration
└── .env.example             # Environment variable template
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/trips` | Generate a new trip itinerary |
| GET | `/api/trips/:slug` | Retrieve a cached trip by slug |
| GET | `/api/health` | Health check |

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `MONGODB_URI` | MongoDB connection string | ✅ |
| `REDIS_URL` | Redis connection URL | ✅ |
| `GEMINI_API_KEY` | Google Gemini API key | ✅ |
| `CLIENT_URL` | Frontend URL for CORS | ❌ |
| `PORT` | Server port (auto-set by Heroku) | ❌ |

## License

MIT
