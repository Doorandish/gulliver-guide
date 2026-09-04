import { useState } from 'react';
import { Sunrise, Sun, Moon, MapPin, ExternalLink } from 'lucide-react';
import { TripDay } from '../types/trip';

interface TimelineProps {
  days: TripDay[];
  destination: string;
}

const ImageWithShimmer = ({ src, alt, className, categoryBadge }: { src: string, alt: string, className: string, categoryBadge: React.ReactNode }) => {
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
      <div className="absolute top-3 left-3 shadow-md rounded-full">
        {categoryBadge}
      </div>
    </div>
  );
};

export default function Timeline({ days, destination }: TimelineProps) {
  const getIcon = (timeSlot: string) => {
    switch (timeSlot) {
      case 'Morgen': return <Sunrise size={20} className="text-amber-500" />;
      case 'Nachmittag': return <Sun size={20} className="text-amber-500" />;
      case 'Abend': return <Moon size={20} className="text-forest-600" />;
      default: return <Sun size={20} />;
    }
  };

  const getCategoryBadge = (category: string) => {
    let emoji = '📍';
    const lower = category.toLowerCase();
    if (lower.includes('gastronomie') || lower.includes('essen') || lower.includes('restaurant')) emoji = '🍽️';
    else if (lower.includes('kultur') || lower.includes('museum') || lower.includes('historisch')) emoji = '🏛️';
    else if (lower.includes('natur') || lower.includes('park')) emoji = '🌲';
    else if (lower.includes('café') || lower.includes('kaffee')) emoji = '☕';
    else if (lower.includes('nachtleben') || lower.includes('bar') || lower.includes('party')) emoji = '🍹';
    else if (lower.includes('shopping') || lower.includes('einkaufen')) emoji = '🛍️';

    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 text-slate-700 text-xs font-semibold rounded-full border border-slate-200">
        <span>{emoji}</span> {category}
      </span>
    );
  };

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      {days.map((day, dayIndex) => (
        <div key={dayIndex} className="mb-12 last:mb-0">
          <h2 className="text-2xl font-bold text-forest-800 mb-8 border-b-2 border-forest-100 pb-2">
            Tag {day.dayNumber} — {day.title}
          </h2>
          
          <div className="relative border-l-2 border-forest-200 ml-4 md:ml-6 space-y-8">
            {day.activities.map((activity, actIndex) => {
              const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(activity.title + ' ' + destination)}`;
              const googleSearchUrl = `https://www.google.com/search?q=${encodeURIComponent(activity.title + ' ' + destination)}`;

              return (
                <div key={actIndex} className="relative pl-8 md:pl-10 group">
                  {/* Timeline Dot with Icon */}
                  <div className="absolute -left-[17px] top-1 bg-white border-2 border-forest-300 rounded-full p-1 shadow-sm group-hover:border-amber-400 group-hover:scale-110 transition-all">
                    {getIcon(activity.timeSlot)}
                  </div>
                  
                  <div className="bg-white rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow flex flex-col md:flex-row overflow-hidden">
                    <ImageWithShimmer 
                      src={`/api/places/photo?query=${encodeURIComponent(activity.title + ' ' + destination)}`}
                      alt={activity.title}
                      className="md:w-[240px] h-48 md:h-auto flex-shrink-0"
                      categoryBadge={getCategoryBadge(activity.category)}
                    />
                    
                    <div className="p-6 flex flex-col flex-grow">
                      <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-3 mb-3">
                        <div>
                          <span className="inline-block px-2 py-1 bg-forest-50 text-forest-700 text-xs font-bold uppercase tracking-wider rounded mb-2">
                            {activity.timeSlot}
                          </span>
                          <h3 className="text-xl font-bold text-slate-800 leading-tight">{activity.title}</h3>
                        </div>
                        <div className="flex-shrink-0">
                          {activity.estimatedPrice > 0 ? (
                            <span className="inline-block font-semibold text-slate-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                              €{Math.round(activity.estimatedPrice)}
                            </span>
                          ) : (
                            <span className="inline-block font-semibold text-slate-500 bg-slate-50 px-3 py-1 rounded-full border border-slate-200">
                              Kostenlos
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <p className="text-slate-600 leading-relaxed mb-6 flex-grow">
                        {activity.description}
                      </p>
                      
                      <div className="flex flex-wrap items-center justify-end gap-3 mt-auto pt-4 border-t border-slate-100">
                        <a 
                          href={googleSearchUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-slate-500 hover:text-forest-600 font-medium text-sm flex items-center gap-1.5 transition-colors mr-auto"
                        >
                          <ExternalLink size={16} /> Details
                        </a>
                        <a 
                          href={mapsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-white bg-forest-600 hover:bg-forest-700 px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 transition-colors shadow-sm"
                        >
                          <MapPin size={16} /> In Maps öffnen
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
