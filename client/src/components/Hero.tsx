import { useState } from 'react';
import {
  Train,
  MapPin,
  Sparkles,
  Compass,
  LocateFixed,
  ChevronDown,
  ChevronUp,
  Wallet,
  Palette,
} from 'lucide-react';

type TabType = 'destination' | 'inspire';
type WeekendOption = 'Dieses Wochenende' | 'Nächstes Wochenende' | 'Langes Wochenende';
type BudgetOption = 'Günstig' | 'Mittel' | 'Komfort';
type StyleOption = 'Kultur' | 'Natur' | 'Entspannung' | 'Party';

interface HeroProps {
  onPlan: (origin: string, destination: string, budget?: string, style?: string) => void;
  onDiscover: (origin: string, weekend: string, budget?: string, style?: string) => void;
  isLoading: boolean;
}

const ORIGIN_PILLS = ['Berlin', 'München', 'Frankfurt', 'Hamburg'];

export default function Hero({ onPlan, onDiscover, isLoading }: HeroProps) {
  const [activeTab, setActiveTab] = useState<TabType>('destination');
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [weekend, setWeekend] = useState<WeekendOption>('Dieses Wochenende');
  const [showOptions, setShowOptions] = useState(false);
  const [budget, setBudget] = useState<BudgetOption | ''>('');
  const [style, setStyle] = useState<StyleOption | ''>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeTab === 'destination') {
      if (origin.trim() && destination.trim()) {
        onPlan(origin.trim(), destination.trim(), budget || undefined, style || undefined);
      }
    } else {
      if (origin.trim()) {
        onDiscover(origin.trim(), weekend, budget || undefined, style || undefined);
      }
    }
  };

  const handleLocate = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        () => {
          setOrigin('Mein Standort');
        },
        () => {
          setOrigin('Berlin Hbf');
        }
      );
    }
  };

  const canSubmit = activeTab === 'destination'
    ? origin.trim() !== '' && destination.trim() !== ''
    : origin.trim() !== '';

  return (
    <div className="bg-gradient-to-br from-forest-600 via-forest-700 to-forest-800 text-white py-12 md:py-20 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 md:mb-10">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Train size={40} className="text-amber-400" />
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight">Gulliver Guide</h1>
          </div>
          <p className="text-forest-200 text-base md:text-lg max-w-xl mx-auto">
            Dein KI-Reiseplaner für das perfekte Wochenende mit der Bahn
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Tab Bar */}
          <div className="flex border-b border-slate-200">
            <button
              type="button"
              onClick={() => setActiveTab('destination')}
              className={`flex-1 py-4 px-4 text-sm md:text-base font-semibold transition-colors flex items-center justify-center gap-2 ${
                activeTab === 'destination'
                  ? 'text-forest-700 border-b-2 border-forest-600 bg-forest-50'
                  : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
              }`}
            >
              <MapPin size={18} />
              Ich habe ein Ziel
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('inspire')}
              className={`flex-1 py-4 px-4 text-sm md:text-base font-semibold transition-colors flex items-center justify-center gap-2 ${
                activeTab === 'inspire'
                  ? 'text-forest-700 border-b-2 border-forest-600 bg-forest-50'
                  : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Compass size={18} />
              Inspiriere mich
            </button>
          </div>

          {/* Form Body */}
          <form onSubmit={handleSubmit} className="p-5 md:p-8 space-y-5">
            {/* Origin Input — shared across both tabs */}
            <div>
              <label className="block text-sm font-semibold text-slate-600 mb-2">Abfahrtsort</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <MapPin className="text-slate-400" size={18} />
                </div>
                <input
                  type="text"
                  className="w-full pl-10 pr-12 py-3.5 rounded-xl border border-slate-200 text-slate-800 focus:outline-none focus:ring-2 focus:ring-forest-400 focus:border-forest-400 text-base transition-shadow"
                  placeholder="Von wo startest du?"
                  value={origin}
                  onChange={(e) => setOrigin(e.target.value)}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={handleLocate}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-forest-500 hover:text-forest-700 transition-colors"
                  title="Standort ermitteln"
                >
                  <LocateFixed size={18} />
                </button>
              </div>
              {/* Quick Pills */}
              <div className="flex flex-wrap gap-2 mt-2.5">
                {ORIGIN_PILLS.map((city) => (
                  <button
                    key={city}
                    type="button"
                    onClick={() => setOrigin(`${city} Hbf`)}
                    className={`px-3 py-1 rounded-full text-xs font-medium border transition-all ${
                      origin === `${city} Hbf`
                        ? 'bg-forest-600 text-white border-forest-600'
                        : 'bg-white text-slate-600 border-slate-200 hover:border-forest-300 hover:text-forest-700'
                    }`}
                  >
                    {city}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab-specific content */}
            {activeTab === 'destination' ? (
              /* === TAB 1: Known Destination === */
              <div>
                <label className="block text-sm font-semibold text-slate-600 mb-2">Reiseziel</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Sparkles className="text-amber-500" size={18} />
                  </div>
                  <input
                    type="text"
                    className="w-full pl-10 pr-4 py-3.5 rounded-xl border border-slate-200 text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 text-base transition-shadow"
                    placeholder="z.B. Dresden, Freiburg, Bamberg..."
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
              </div>
            ) : (
              /* === TAB 2: Inspire Me === */
              <div>
                <label className="block text-sm font-semibold text-slate-600 mb-2">Wann möchtest du reisen?</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {(['Dieses Wochenende', 'Nächstes Wochenende', 'Langes Wochenende'] as WeekendOption[]).map(
                    (opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => setWeekend(opt)}
                        className={`py-3 px-4 rounded-xl text-sm font-semibold border-2 transition-all ${
                          weekend === opt
                            ? 'border-forest-600 bg-forest-50 text-forest-700'
                            : 'border-slate-200 text-slate-500 hover:border-forest-300 hover:text-forest-600'
                        }`}
                      >
                        {opt}
                      </button>
                    )
                  )}
                </div>
              </div>
            )}

            {/* Accordion: Additional Options */}
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <button
                type="button"
                onClick={() => setShowOptions(!showOptions)}
                className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-slate-500 hover:text-slate-700 hover:bg-slate-50 transition-colors"
              >
                <span className="flex items-center gap-2">
                  <Wallet size={16} />
                  Zusätzliche Optionen (Budget & Reisestil)
                </span>
                {showOptions ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>

              {showOptions && (
                <div className="px-4 pb-4 pt-2 space-y-4 border-t border-slate-100 bg-slate-50/50">
                  {/* Budget */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wide">
                      <Wallet size={14} className="inline mr-1" />
                      Budget
                    </label>
                    <div className="flex gap-2">
                      {(['Günstig', 'Mittel', 'Komfort'] as BudgetOption[]).map((opt) => (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => setBudget(budget === opt ? '' : opt)}
                          className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium border transition-all ${
                            budget === opt
                              ? 'border-amber-500 bg-amber-50 text-amber-700'
                              : 'border-slate-200 text-slate-500 hover:border-amber-300'
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Style */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wide">
                      <Palette size={14} className="inline mr-1" />
                      Reisestil
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {(['Kultur', 'Natur', 'Entspannung', 'Party'] as StyleOption[]).map((opt) => (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => setStyle(style === opt ? '' : opt)}
                          className={`py-2 px-4 rounded-lg text-sm font-medium border transition-all ${
                            style === opt
                              ? 'border-forest-500 bg-forest-50 text-forest-700'
                              : 'border-slate-200 text-slate-500 hover:border-forest-300'
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || !canSubmit}
              className="w-full bg-gradient-to-r from-forest-600 to-forest-700 hover:from-forest-700 hover:to-forest-800 disabled:opacity-60 disabled:cursor-not-allowed text-white py-4 rounded-xl font-bold text-base md:text-lg flex items-center justify-center gap-2.5 shadow-lg transition-all active:scale-[0.98]"
            >
              {isLoading ? (
                <span className="inline-block w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : activeTab === 'destination' ? (
                <Sparkles size={20} />
              ) : (
                <Compass size={20} />
              )}
              <span>
                {isLoading
                  ? 'Wird geplant...'
                  : activeTab === 'destination'
                    ? 'Wochenendtrip planen'
                    : 'Ziele entdecken'}
              </span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
