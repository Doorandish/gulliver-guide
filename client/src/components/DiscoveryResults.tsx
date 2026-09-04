import { Train, Clock, Wallet, MapPin, Sparkles } from 'lucide-react';
import { DiscoverySuggestion } from '../types/trip';

interface DiscoveryResultsProps {
  suggestions: DiscoverySuggestion[];
  onSelect: (destination: string) => void;
  isLoading: boolean;
  origin: string;
}

export default function DiscoveryResults({ suggestions, onSelect, isLoading, origin }: DiscoveryResultsProps) {
  if (suggestions.length === 0) return null;

  return (
    <section className="max-w-5xl mx-auto w-full px-4 py-12">
      <div className="text-center mb-10">
        <h2 className="text-2xl md:text-3xl font-bold text-forest-800 mb-2">
          Deine Reisevorschläge ab {origin}
        </h2>
        <p className="text-slate-500">Klicke auf ein Ziel, um den vollen 48-Stunden-Plan zu sehen</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {suggestions.map((s, i) => (
          <button
            key={i}
            onClick={() => onSelect(s.destination)}
            disabled={isLoading}
            className="group bg-white rounded-2xl shadow-sm border border-slate-100 hover:shadow-lg hover:border-forest-200 transition-all text-left overflow-hidden disabled:opacity-60"
          >
            {/* Color header */}
            <div className="bg-gradient-to-r from-forest-600 to-forest-500 p-5">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">{s.destination}</h3>
                  <p className="text-forest-100 text-sm">{s.tagline}</p>
                </div>
                <span className="bg-white/20 rounded-lg px-2.5 py-1 text-xs font-semibold text-white backdrop-blur-sm">
                  {s.category}
                </span>
              </div>
            </div>

            <div className="p-5 space-y-4">
              {/* Badges */}
              <div className="flex flex-wrap gap-3 text-sm text-slate-600">
                <span className="flex items-center gap-1.5">
                  <Train size={15} className="text-forest-500" />
                  {s.travelTimeHours}h Zugfahrt
                </span>
                <span className="flex items-center gap-1.5">
                  <Wallet size={15} className="text-amber-500" />
                  ca. {s.estimatedBudget} €
                </span>
              </div>

              {/* Highlights */}
              <div className="space-y-1.5">
                {s.highlights.slice(0, 3).map((h, j) => (
                  <div key={j} className="flex items-center gap-2 text-sm text-slate-600">
                    <MapPin size={13} className="text-forest-400 shrink-0" />
                    <span>{h}</span>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-forest-600 font-semibold text-sm group-hover:text-amber-600 transition-colors flex items-center gap-1.5">
                  <Sparkles size={14} />
                  48h-Plan erstellen
                </span>
                <span className="text-forest-400 group-hover:text-amber-500 group-hover:translate-x-1 transition-all text-lg">
                  →
                </span>
              </div>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}
