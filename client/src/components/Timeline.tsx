import { Sunrise, Sun, Moon } from 'lucide-react';
import { TripDay } from '../types/trip';

interface TimelineProps {
  days: TripDay[];
}

export default function Timeline({ days }: TimelineProps) {
  const getIcon = (timeSlot: string) => {
    switch (timeSlot) {
      case 'Morgen': return <Sunrise size={20} className="text-amber-500" />;
      case 'Nachmittag': return <Sun size={20} className="text-amber-500" />;
      case 'Abend': return <Moon size={20} className="text-forest-600" />;
      default: return <Sun size={20} />;
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      {days.map((day, dayIndex) => (
        <div key={dayIndex} className="mb-12 last:mb-0">
          <h2 className="text-2xl font-bold text-forest-800 mb-8 border-b-2 border-forest-100 pb-2">
            Tag {day.dayNumber} — {day.title}
          </h2>
          
          <div className="relative border-l-2 border-forest-200 ml-4 md:ml-6 space-y-8">
            {day.activities.map((activity, actIndex) => (
              <div key={actIndex} className="relative pl-8 md:pl-10">
                {/* Timeline Dot with Icon */}
                <div className="absolute -left-[17px] top-1 bg-white border-2 border-forest-300 rounded-full p-1 shadow-sm">
                  {getIcon(activity.timeSlot)}
                </div>
                
                <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-2 mb-2">
                    <div>
                      <span className="inline-block px-2 py-1 bg-forest-50 text-forest-700 text-xs font-semibold rounded-md mb-2">
                        {activity.timeSlot}
                      </span>
                      <h3 className="text-xl font-bold text-slate-800">{activity.title}</h3>
                    </div>
                    {activity.estimatedPrice > 0 && (
                      <span className="text-lg font-semibold text-slate-700 whitespace-nowrap bg-slate-50 px-3 py-1 rounded-full border border-slate-200">
                        €{Math.round(activity.estimatedPrice)}
                      </span>
                    )}
                  </div>
                  
                  <p className="text-slate-600 leading-relaxed mb-4">
                    {activity.description}
                  </p>
                  
                  <div className="flex items-center justify-between mt-4">
                    <span className="text-sm text-slate-500 font-medium">
                      Kategorie: {activity.category}
                    </span>
                    {activity.bookingDeepLink && (
                      <a 
                        href={activity.bookingDeepLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-amber-600 hover:text-amber-700 font-semibold text-sm flex items-center gap-1 transition-colors"
                      >
                        Buchen ↗
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
