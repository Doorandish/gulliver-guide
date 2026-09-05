import { Train, Clock, MapPin } from 'lucide-react';
import { JourneyDetails } from '../types/trip';

interface HinfahrtBoxProps {
  journey: JourneyDetails;
}

export default function HinfahrtBox({ journey }: HinfahrtBoxProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 mb-8 w-full mx-auto relative overflow-hidden">
      <div className="absolute top-0 left-0 w-1 h-full bg-forest-500"></div>
      <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
        <Train size={20} className="text-forest-600" /> Hinfahrt — Freitag, Start ins Wochenende
      </h3>
      
      <div className="flex flex-col md:flex-row items-center justify-between bg-slate-50 rounded-lg p-4 mb-4 gap-4 md:gap-2">
        <div className="flex flex-col items-center md:items-start text-center md:text-left flex-1">
          <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-1">Abfahrt</span>
          <span className="text-xl font-bold text-slate-800">{journey.departureTime}</span>
        </div>

        <div className="flex flex-col items-center flex-1 w-full px-2">
          <div className="flex items-center w-full">
            <div className="h-px bg-slate-300 flex-1"></div>
            <span className="px-3 py-1 bg-white border border-slate-200 rounded-full text-xs font-semibold text-slate-600 shadow-sm mx-2 whitespace-nowrap">
              {journey.transfers}x Umstieg
            </span>
            <div className="h-px bg-slate-300 flex-1"></div>
          </div>
          <span className="text-xs text-slate-500 mt-2 font-medium">{journey.trainType}</span>
        </div>

        <div className="flex flex-col items-center md:items-end text-center md:text-right flex-1">
          <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-1">Ankunft</span>
          <span className="text-xl font-bold text-slate-800">{journey.arrivalTime}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {journey.transferBuffer && (
          <div className="flex items-start gap-2 bg-amber-50/50 p-3 rounded-lg border border-amber-100">
            <Clock size={16} className="text-amber-500 mt-0.5 flex-shrink-0" />
            <div>
              <span className="font-semibold block text-amber-900 text-sm">Umstiegs-Puffer</span>
              <p className="text-amber-800 text-sm">{journey.transferBuffer}</p>
            </div>
          </div>
        )}
        
        {journey.lastMile && (
          <div className="flex items-start gap-2 bg-forest-50/50 p-3 rounded-lg border border-forest-100">
            <MapPin size={16} className="text-forest-600 mt-0.5 flex-shrink-0" />
            <div>
              <span className="font-semibold block text-forest-900 text-sm">Letzte Meile</span>
              <p className="text-forest-800 text-sm">{journey.lastMile}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
