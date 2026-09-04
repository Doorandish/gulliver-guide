import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Clock, Wallet, Leaf } from 'lucide-react';
import SeoHead from '../components/SeoHead';
import Timeline from '../components/Timeline';
import TrainBookingCard from '../components/TrainBookingCard';
import Footer from '../components/Footer';
import { TripPlan } from '../types/trip';
import { getNextWeekendDates } from '../utils/deeplinks';

export default function PlanDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [trip, setTrip] = useState<TripPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchTrip = async () => {
      try {
        const res = await fetch(`/api/trips/${slug}`);
        if (!res.ok) throw new Error('Not found');
        const data = await res.json();
        setTrip(data);
      } catch (err) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    if (slug) fetchTrip();
  }, [slug]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-forest-600 font-medium text-lg">Lade Reiseplan...</div>;
  }

  if (error || !trip) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center p-4">
        <h1 className="text-3xl font-bold text-slate-800 mb-4">Trip nicht gefunden</h1>
        <p className="text-slate-600 mb-8">Dieser Wochenendtrip konnte leider nicht geladen werden.</p>
        <Link to="/" className="text-amber-600 hover:underline">Zurück zur Startseite</Link>
      </div>
    );
  }

  const { saturday, sunday } = getNextWeekendDates();

  return (
    <>
      <SeoHead 
        title={trip.metaTitle || `Wochenendtrip nach ${trip.destination} | Gulliver Guide`}
        description={trip.metaDescription || `Dein KI-generierter Reiseplan für ein Wochenende in ${trip.destination}.`}
        tripData={trip}
      />
      
      <div className="bg-cream min-h-screen">
        <div className="bg-forest-800 text-white pb-20 pt-10">
          <div className="max-w-4xl mx-auto px-4">
            <Link to="/" className="inline-flex items-center gap-2 text-forest-200 hover:text-white transition-colors mb-8 text-sm font-medium">
              <ArrowLeft size={16} /> Zurück zur Suche
            </Link>
            
            <h1 className="text-4xl md:text-5xl font-bold mb-6">{trip.destination}</h1>
            
            <div className="flex flex-wrap gap-4 text-sm font-medium">
              <div className="bg-forest-700/50 px-4 py-2 rounded-full flex items-center gap-2 border border-forest-600">
                <Clock size={16} className="text-amber-400" />
                <span>{trip.durationDays} Tage</span>
              </div>
              <div className="bg-forest-700/50 px-4 py-2 rounded-full flex items-center gap-2 border border-forest-600">
                <Wallet size={16} className="text-amber-400" />
                <span>Budget: {trip.totalBudget} €</span>
              </div>
              <div className="bg-forest-700/50 px-4 py-2 rounded-full flex items-center gap-2 border border-forest-600">
                <Leaf size={16} className="text-green-400" />
                <span>{trip.co2SavedPercent}% CO₂ gespart</span>
              </div>
            </div>
          </div>
        </div>

        <main className="max-w-4xl mx-auto px-4 -mt-10 relative z-10 pb-20">
          <TrainBookingCard 
            to={trip.destination} 
            saturday={saturday} 
            sunday={sunday} 
          />
          <Timeline days={trip.days} />
        </main>
        
        <Footer />
      </div>
    </>
  );
}
