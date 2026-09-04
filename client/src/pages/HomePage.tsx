import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SeoHead from '../components/SeoHead';
import Hero from '../components/Hero';
import Footer from '../components/Footer';

const POPULAR_DESTINATIONS = [
  'Berlin', 'Hamburg', 'München', 'Köln', 'Dresden', 'Leipzig'
];

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSearch = async (destination: string) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/trips', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ destination })
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

  return (
    <>
      <SeoHead 
        title="Gulliver Guide — Dein KI-Wochenendtrip mit der Bahn" 
        description="Plane deinen perfekten Wochenendtrip innerhalb Deutschlands. KI-gestützt, nachhaltig und genau auf dein Budget abgestimmt."
      />
      <div className="min-h-screen flex flex-col">
        <Hero onSearch={handleSearch} isLoading={isLoading} />
        
        <main className="flex-grow max-w-6xl mx-auto w-full px-4 py-16">
          <h2 className="text-3xl font-bold text-center text-forest-800 mb-12">Beliebte Reiseziele</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {POPULAR_DESTINATIONS.map(dest => (
              <button
                key={dest}
                onClick={() => handleSearch(dest)}
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
