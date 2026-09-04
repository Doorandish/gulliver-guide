import { useState } from 'react';
import { Train, MapPin, Sparkles } from 'lucide-react';

interface HeroProps {
  onSearch: (destination: string) => void;
  isLoading: boolean;
}

export default function Hero({ onSearch, isLoading }: HeroProps) {
  const [destination, setDestination] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (destination.trim()) {
      onSearch(destination.trim());
    }
  };

  return (
    <div className="bg-gradient-to-br from-forest-600 to-forest-800 text-white py-20 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 flex flex-col items-center justify-center gap-4">
          <Train size={48} className="text-amber-500" />
          <span>Entdecke Deutschland</span>
          <span className="text-2xl md:text-4xl text-forest-200">Ein Wochenende mit der Bahn</span>
        </h1>
        <p className="text-lg md:text-xl text-forest-100 mb-10 max-w-2xl mx-auto">
          Lass dir von KI in Sekunden den perfekten, nachhaltigen Wochenendtrip zusammenstellen. Gib einfach dein Wunschziel ein.
        </p>
        
        <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4 max-w-2xl mx-auto">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MapPin className="text-gray-400" size={20} />
            </div>
            <input
              type="text"
              className="w-full pl-10 pr-4 py-4 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500 text-lg shadow-lg"
              placeholder="z.B. Berlin, Hamburg, München..."
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              disabled={isLoading}
            />
          </div>
          <button
            type="submit"
            disabled={isLoading || !destination.trim()}
            className="bg-amber-500 hover:bg-amber-600 disabled:opacity-70 disabled:cursor-not-allowed text-white px-8 py-4 rounded-lg font-semibold text-lg flex items-center justify-center gap-2 shadow-lg transition-colors"
          >
            {isLoading ? (
              <span className="animate-spin">⌛</span>
            ) : (
              <Sparkles size={20} />
            )}
            <span>Wochenendtrip planen</span>
          </button>
        </form>
      </div>
    </div>
  );
}
