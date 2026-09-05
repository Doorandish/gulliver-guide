import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Clock, Wallet, Leaf, CloudSun, Printer } from 'lucide-react';
import SeoHead from '../components/SeoHead';
import Timeline from '../components/Timeline';
import MobilityHub from '../components/MobilityHub';
import Footer from '../components/Footer';
import { TripPlan } from '../types/trip';
import { getNextWeekendDates } from '../utils/deeplinks';

interface WeatherData {
  temp: number;
  description: string;
  icon: string;
  main: string;
}

export default function PlanDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [trip, setTrip] = useState<TripPlan | null>(null);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchTrip = async () => {
      try {
        const res = await fetch(`/api/trips/${slug}`);
        if (!res.ok) throw new Error('Not found');
        const data = await res.json();
        setTrip(data);
        
        // Fetch weather
        try {
          const wRes = await fetch(`/api/weather/${encodeURIComponent(data.destination)}`);
          if (wRes.ok) {
            const wData = await wRes.json();
            setWeather(wData);
          }
        } catch (wErr) {
          console.warn('Weather fetch failed', wErr);
        }
      } catch (err) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    if (slug) fetchTrip();
  }, [slug]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-forest-600 font-medium text-lg bg-slate-50">Lade Wochenendplan...</div>;
  }

  if (error || !trip) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center p-4 bg-slate-50">
        <h1 className="text-3xl font-bold text-slate-800 mb-4">Trip nicht gefunden</h1>
        <p className="text-slate-600 mb-8">Dieser Wochenendtrip konnte leider nicht geladen werden.</p>
        <Link to="/" className="text-forest-600 hover:underline font-medium">Zurück zur Startseite</Link>
      </div>
    );
  }

  const { saturday, sunday } = getNextWeekendDates();
  const heroBgUrl = trip ? `/api/places/photo?query=${encodeURIComponent(trip.destination + ' germany')}` : '';

  const calculatedBudget = trip ? trip.days.reduce((total, day) => {
    return total + day.activities.reduce((sum, act) => sum + (act.estimatedPrice || 0), 0);
  }, 0) : 0;

  return (
    <>
      <SeoHead 
        title={trip.metaTitle || `Wochenendtrip nach ${trip.destination} | Gulliver Guide`}
        description={trip.metaDescription || `Dein KI-generierter Reiseplan für ein Wochenende in ${trip.destination}.`}
        tripData={trip}
      />
      
      <div className="bg-slate-50 min-h-screen font-sans">
        {/* Modern Hero Section with Image Background */}
        <div 
          className="relative text-white pb-24 pt-12 overflow-hidden shadow-inner bg-forest-900 bg-cover bg-center"
          style={{ backgroundImage: `url("${heroBgUrl}")` }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/50 to-transparent"></div>
          
          <div className="max-w-4xl mx-auto px-4 relative z-10">
            <Link to="/" className="inline-flex items-center gap-2 text-forest-200 hover:text-white transition-colors mb-8 text-sm font-medium bg-forest-800/50 py-1.5 px-3 rounded-full border border-forest-700/50 backdrop-blur-sm">
              <ArrowLeft size={16} /> Zurück zur Suche
            </Link>
            
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
              <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight drop-shadow-md">{trip.destination}</h1>
              
              {/* Weather Widget */}
              {weather && (
                <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-3 shadow-lg self-start md:self-auto">
                  <img 
                    src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`} 
                    alt={weather.description}
                    className="w-12 h-12 drop-shadow-md"
                  />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-2xl font-bold">{weather.temp}°C</span>
                    </div>
                    <p className="text-xs text-forest-100 font-medium capitalize flex items-center gap-1">
                      <CloudSun size={12} /> Wochenend-Prognose
                    </p>
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex flex-wrap items-center justify-between gap-4 mt-8">
              <div className="flex flex-wrap gap-3 text-sm font-medium">
                <div className="bg-forest-800/60 backdrop-blur-sm px-4 py-2 rounded-lg flex items-center gap-2 border border-forest-600/50 shadow-sm">
                  <Clock size={16} className="text-amber-400" />
                  <span>{trip.durationDays} Tage</span>
                </div>
                <div className="bg-forest-800/60 backdrop-blur-sm px-4 py-2 rounded-lg flex items-center gap-2 border border-forest-600/50 shadow-sm">
                  <Wallet size={16} className="text-amber-400" />
                  <span>Aktivitäten: {Math.round(calculatedBudget)} €</span>
                </div>
                <div className="bg-forest-800/60 backdrop-blur-sm px-4 py-2 rounded-lg flex items-center gap-2 border border-forest-600/50 shadow-sm">
                  <Leaf size={16} className="text-green-400" />
                  <span>{trip.co2SavedPercent}% CO₂ gespart</span>
                </div>
              </div>

              <button 
                onClick={() => window.print()}
                className="bg-white text-forest-800 hover:bg-forest-50 px-4 py-2 rounded-lg flex items-center gap-2 font-bold shadow-md transition-all text-sm print:hidden"
              >
                <Printer size={16} /> Offline-Plan als PDF
              </button>
            </div>
          </div>
        </div>

        <main className="max-w-4xl mx-auto px-4 -mt-12 relative z-20 pb-20">
          <MobilityHub 
            to={trip.destination} 
            saturday={saturday} 
            sunday={sunday} 
          />
          <Timeline days={trip.days} destination={trip.destination} />
        </main>
        
        <Footer />
      </div>
    </>
  );
}
