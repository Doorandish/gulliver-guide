import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SeoHead from '../components/SeoHead';
import Hero from '../components/Hero';
import Footer from '../components/Footer';
import { DiscoverySuggestion } from '../types/trip';

const POPULAR_DESTINATIONS = [
  'Berlin', 'Hamburg', 'München', 'Köln', 'Dresden', 'Leipzig'
];

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(false);
  const [discoveries, setDiscoveries] = useState<DiscoverySuggestion[]>([]);
  const [discoverOrigin, setDiscoverOrigin] = useState('');
  const navigate = useNavigate();

  // Tab 1: Plan a known destination
  const handlePlan = async (origin: string, destination: string, budget?: string, style?: string, hasDt?: boolean, fridayStart?: string) => {
    setIsLoading(true);
    setDiscoveries([]);
    try {
      const res = await fetch('/api/trips/plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ origin, destination, budget, style, hasDt, fridayStart }),
      });
      if (res.ok) {
        const data = await res.json();
        navigate(`/wochenendtrip/${data.slug}`);
      } else {
        alert('Ein Fehler ist aufgetreten. Bitte versuche es später erneut.');
      }
    } catch (error) {
      console.error(error);
      alert('Ein Fehler ist aufgetreten. Bitte versuche es später erneut.');
    } finally {
      setIsLoading(false);
    }
  };

  // Tab 2: Discover destinations
  const handleDiscover = (origin: string, weekend: string, budget?: string, style?: string, hasDt?: boolean, fridayStart?: string) => {
    const params = new URLSearchParams({ from: origin, when: weekend });
    if (budget) params.append('budget', budget);
    if (style) params.append('style', style);
    if (hasDt) params.append('dticket', 'true');
    if (fridayStart) params.append('friday', fridayStart);
    navigate(`/entdecken?${params.toString()}`);
  };

  // When user clicks a discovery card, plan the full trip
  const handleDiscoverySelect = async (destination: string) => {
    await handlePlan(discoverOrigin || 'Berlin Hbf', destination);
  };

  // Quick destination from the grid
  const handleQuickSearch = async (destination: string) => {
    await handlePlan('Berlin Hbf', destination);
  };

  return (
    <>
      <SeoHead
        title="Gulliver Guide — Dein KI-Wochenendtrip mit der Bahn"
        description="Plane deinen perfekten Wochenendtrip innerhalb Deutschlands. KI-gestützt, nachhaltig und genau auf dein Budget abgestimmt."
      />
      <div className="min-h-screen flex flex-col">
        <Hero onPlan={handlePlan} onDiscover={handleDiscover} isLoading={isLoading} />

        {/* Popular Destinations */}
        <main className="flex-grow max-w-6xl mx-auto w-full px-4 py-16">
          <h2 className="text-3xl font-bold text-center text-forest-800 mb-12">Beliebte Reiseziele</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {POPULAR_DESTINATIONS.map(dest => (
              <button
                key={dest}
                onClick={() => handleQuickSearch(dest)}
                disabled={isLoading}
                className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md hover:border-amber-200 transition-all text-left group disabled:opacity-50 flex items-center justify-between"
              >
                <span className="text-xl font-bold text-slate-800 group-hover:text-amber-600 transition-colors">{dest}</span>
                <span className="text-forest-400 group-hover:text-amber-500 group-hover:translate-x-1 transition-all">→</span>
              </button>
            ))}
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}
