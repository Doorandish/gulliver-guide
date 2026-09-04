import { Train, ArrowRight } from 'lucide-react';
import { generateBahnLink, generateOmioLink } from '../utils/deeplinks';

interface TrainBookingCardProps {
  from?: string;
  to: string;
  saturday: string;
  sunday: string;
}

export default function TrainBookingCard({ from = "Berlin Hbf", to, saturday, sunday }: TrainBookingCardProps) {
  const bahnOutbound = generateBahnLink(from, to, saturday, "08:00");
  const omioOutbound = generateOmioLink(from, to, saturday);
  
  return (
    <div className="bg-gradient-to-br from-forest-50 to-cream rounded-2xl p-6 md:p-8 border border-forest-200 shadow-sm max-w-3xl mx-auto my-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-amber-100 p-3 rounded-full text-amber-600">
          <Train size={24} />
        </div>
        <h3 className="text-2xl font-bold text-forest-800">Zug buchen</h3>
      </div>
      
      <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-8 bg-white p-4 rounded-xl border border-slate-100">
        <div className="text-center md:text-right flex-1">
          <div className="text-sm text-slate-500 mb-1">Von</div>
          <div className="font-bold text-lg text-slate-800">{from}</div>
        </div>
        <ArrowRight size={24} className="text-forest-300 hidden md:block" />
        <div className="text-center md:text-left flex-1">
          <div className="text-sm text-slate-500 mb-1">Nach</div>
          <div className="font-bold text-lg text-slate-800">{to}</div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <a 
          href={bahnOutbound} 
          target="_blank" 
          rel="noopener noreferrer"
          className="bg-[#FF0000] hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-xl text-center transition-colors shadow-sm flex items-center justify-center gap-2"
        >
          <span>Bei der DB buchen</span>
        </a>
        <a 
          href={omioOutbound} 
          target="_blank" 
          rel="noopener noreferrer"
          className="bg-[#5E64FF] hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl text-center transition-colors shadow-sm flex items-center justify-center gap-2"
        >
          <span>Bei Omio buchen</span>
        </a>
      </div>
      <p className="text-xs text-slate-500 text-center mt-4">
        Hinreise: Samstag ({new Date(saturday).toLocaleDateString('de-DE')}) | 
        Rückreise: Sonntag ({new Date(sunday).toLocaleDateString('de-DE')})
      </p>
    </div>
  );
}
