import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Train, Wallet, Leaf, ArrowRight } from 'lucide-react';
import SeoHead from '../components/SeoHead';
import Footer from '../components/Footer';
import { DiscoverySuggestion } from '../types/trip';

const generateSlug = (text: string) => {
  return text.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '');
};

const ImageWithShimmer = ({ src, alt, className, categoryBadge }: { src: string, alt: string, className: string, categoryBadge?: React.ReactNode }) => {
  const [loaded, setLoaded] = useState(false);
  return (
    <div className={`relative bg-slate-200 ${className} ${!loaded ? 'animate-pulse' : ''}`}>
      <img 
        src={src} 
        alt={alt} 
        className={`w-full h-full object-cover transition-opacity duration-500 ${loaded ? 'opacity-100' : 'opacity-0'}`}
        onLoad={() => setLoaded(true)}
        loading="lazy"
      />
      {categoryBadge && (
        <div className="absolute top-3 right-3 shadow-md rounded-full">
          {categoryBadge}
        </div>
      )}
    </div>
  );
};

export default function DiscoveryPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const origin = searchParams.get('from') || '';
  const weekend = searchParams.get('when') || 'Dieses Wochenende';
  const budget = searchParams.get('budget') || '';
  const style = searchParams.get('style') || '';
  const hasDt = searchParams.get('dticket') === 'true';
  const fridayStart = searchParams.get('friday') || undefined;

  const [discoveries, setDiscoveries] = useState<DiscoverySuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [planningDest, setPlanningDest] = useState<string | null>(null);

  useEffect(() => {
    if (!origin) {
      navigate('/');
      return;
    }

    const fetchDiscoveries = async () => {
      setIsLoading(true);
      setError(false);
      try {
        const res = await fetch('/api/trips/discover', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ origin, weekend, budget, style, hasDt, fridayStart }),
        });
        if (res.ok) {
          const data = await res.json();
          setDiscoveries(data.suggestions || []);
        } else {
          setError(true);
        }
      } catch (err) {
        setError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDiscoveries();
  }, [origin, weekend, budget, style, navigate]);

  const handleCreatePlan = async (destination: string) => {
    setPlanningDest(destination);
    
    // Open the tab immediately during the click event to bypass popup blockers
    const newWindow = window.open('about:blank', '_blank');
    if (newWindow) {
      newWindow.document.write(`
        <html lang="de">
          <head>
            <meta charset="utf-8">
            <title>Lade Reiseplan...</title>
            <style>
              body { margin: 0; display: flex; justify-content: center; align-items: center; height: 100vh; background: #f8fafc; font-family: system-ui, sans-serif; color: #166534; }
              .loader { font-size: 1.25rem; font-weight: 500; display: flex; flex-direction: column; items-center; gap: 1rem; text-align: center; }
              .spinner { width: 40px; height: 40px; border: 4px solid #dcfce7; border-top-color: #166534; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto; }
              @keyframes spin { to { transform: rotate(360deg); } }
            </style>
          </head>
          <body>
            <div class="loader">
              <div class="spinner"></div>
              <div>Dein 48h-Plan für ${destination} wird generiert...</div>
            </div>
          </body>
        </html>
      `);
    }

    try {
      const res = await fetch('/api/trips/plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ origin, destination, budget, style, hasDt, fridayStart }),
      });
      if (res.ok) {
        const data = await res.json();
        if (newWindow) {
          newWindow.location.href = `/wochenendtrip/${data.slug}`;
        } else {
          window.open(`/wochenendtrip/${data.slug}`, '_blank');
        }
      } else {
        if (newWindow) newWindow.close();
        alert('Ein Fehler ist aufgetreten beim Erstellen des Plans.');
      }
    } catch (err) {
      if (newWindow) newWindow.close();
      alert('Ein Fehler ist aufgetreten.');
    } finally {
      setPlanningDest(null);
    }
  };

  const getCategoryEmoji = (cat?: string) => {
    if (!cat) return '✨';
    if (cat.includes('Kultur')) return '🏛️';
    if (cat.includes('Natur')) return '🌲';
    if (cat.includes('Romantik')) return '❤️';
    if (cat.includes('Wellness')) return '🧖‍♀️';
    return '✨';
  };

  return (
    <>
      <SeoHead 
        title={`Entdecke Ziele ab ${origin} | Gulliver Guide`}
        description="KI-gestützte Reisevorschläge für deinen perfekten Wochenendtrip mit der Bahn."
      />
      <div className="bg-slate-50 min-h-screen font-sans flex flex-col">
        {/* Header */}
        <div className="bg-forest-900 text-white pt-10 pb-16 px-4">
          <div className="max-w-7xl mx-auto">
            <button 
              onClick={() => navigate('/')}
              className="inline-flex items-center gap-2 text-forest-200 hover:text-white transition-colors mb-6 text-sm font-medium"
            >
              <ArrowLeft size={16} /> Zurück zur Suche
            </button>
            <h1 className="text-3xl md:text-5xl font-bold mb-4">
              Wochenendziele ab {origin}
            </h1>
            <p className="text-forest-100 text-lg max-w-2xl">
              Wir haben 8 perfekte Bahn-Reiseziele für dich gefunden, die genau zu deinen Vorlieben passen.
            </p>
          </div>
        </div>

        {/* Content */}
        <main className="flex-grow max-w-7xl mx-auto w-full px-4 -mt-10 relative z-10 pb-20">
          {error ? (
            <div className="bg-white rounded-2xl p-10 text-center shadow-sm">
              <p className="text-red-500 mb-4">Es gab ein Problem beim Laden der Ziele.</p>
              <button onClick={() => navigate('/')} className="text-forest-600 font-medium hover:underline">
                Zurück zur Startseite
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {isLoading ? (
                // Skeletons
                Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 h-96 flex flex-col animate-pulse">
                    <div className="h-48 bg-slate-200 w-full"></div>
                    <div className="p-5 flex-grow flex flex-col gap-3">
                      <div className="h-6 bg-slate-200 rounded w-3/4"></div>
                      <div className="h-4 bg-slate-200 rounded w-1/2"></div>
                      <div className="mt-auto h-4 bg-slate-200 rounded w-full"></div>
                      <div className="h-10 bg-slate-200 rounded w-full mt-2"></div>
                    </div>
                  </div>
                ))
              ) : (
                // Actual Data
                discoveries.map((dest, idx) => (
                  <div key={idx} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-lg transition-shadow flex flex-col h-full group">
                    <div className="relative h-48 overflow-hidden">
                      <ImageWithShimmer 
                        src={`/api/places/photo?query=${encodeURIComponent(dest.photoQuery || dest.destination + ' germany')}`}
                        alt={dest.destination}
                        className="w-full h-full group-hover:scale-105 transition-transform duration-700"
                        categoryBadge={
                          <span className="bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full text-xs font-bold text-slate-700 flex items-center gap-1 shadow-sm">
                            {getCategoryEmoji(dest.category)} {dest.category || 'Trip'}
                          </span>
                        }
                      />
                      <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-md text-white px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5">
                        <Train size={12} className={dest.directTrain ? "text-green-400" : "text-amber-400"} />
                        {dest.trainDuration} {dest.directTrain && "(0 Umstiege)"}
                      </div>
                    </div>

                    <div className="p-5 flex-grow flex flex-col">
                      <h3 className="text-xl font-bold text-slate-800 mb-1">{dest.destination}</h3>
                      <p className="text-slate-500 text-sm mb-4 leading-snug">{dest.tagline || (dest as any).title || (dest as any).description}</p>
                      
                      <div className="mt-auto space-y-2 mb-5">
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <Wallet size={16} className="text-amber-500" />
                          <span>Budget: ~{dest.estimatedBudget} €</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <Leaf size={16} className="text-emerald-500" />
                          <span>🌿 ~75% CO₂-Ersparnis</span>
                        </div>
                      </div>

                      <button 
                        onClick={() => handleCreatePlan(dest.destination)}
                        disabled={planningDest === dest.destination}
                        className="w-full bg-forest-50 text-forest-700 hover:bg-forest-600 hover:text-white transition-colors py-2.5 rounded-xl font-medium text-sm flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        {planningDest === dest.destination ? 'Erstelle...' : '48h-Plan ansehen'} <ArrowRight size={16} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </main>
        
        <Footer />
      </div>
    </>
  );
}
