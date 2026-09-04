import { Leaf, Clock, Wallet, Train } from 'lucide-react';
import { Link } from 'react-router-dom';
import { TripPlan } from '../types/trip';

interface TripCardProps {
  trip: TripPlan;
  onClick?: () => void;
}

export default function TripCard({ trip, onClick }: TripCardProps) {
  const cardContent = (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 hover:shadow-md transition-shadow h-full flex flex-col">
      <h3 className="text-2xl font-bold text-slate-800 mb-4">{trip.destination}</h3>
      
      <div className="grid grid-cols-2 gap-4 mb-6 text-sm text-slate-600 flex-grow">
        <div className="flex items-center gap-2">
          <Clock size={16} className="text-forest-500" />
          <span>{trip.durationDays} Tage</span>
        </div>
        <div className="flex items-center gap-2">
          <Wallet size={16} className="text-forest-500" />
          <span>ca. {trip.totalBudget} €</span>
        </div>
        <div className="flex items-center gap-2">
          <Leaf size={16} className="text-green-500" />
          <span>{trip.co2SavedPercent}% CO₂ Ersparnis</span>
        </div>
        <div className="flex items-center gap-2">
          <Train size={16} className="text-amber-500" />
          <span className="truncate">{trip.recommendedTrain}</span>
        </div>
      </div>
      
      <div className="mt-auto pt-4 border-t border-slate-100 flex justify-between items-center text-forest-600 font-medium">
        <span>Details ansehen</span>
        <span>→</span>
      </div>
    </div>
  );

  if (onClick) {
    return (
      <button onClick={onClick} className="w-full text-left">
        {cardContent}
      </button>
    );
  }

  return (
    <Link to={`/wochenendtrip/${trip.slug}`} className="block">
      {cardContent}
    </Link>
  );
}
