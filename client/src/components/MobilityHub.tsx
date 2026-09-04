import { Train, Bus, Car, Bed, ExternalLink } from 'lucide-react';

interface MobilityHubProps {
  to: string;
  saturday: string;
  sunday: string;
}

export default function MobilityHub({ to, saturday, sunday }: MobilityHubProps) {
  const formatGermanDate = (dateString: string) => {
    const [year, month, day] = dateString.split('-');
    return `${day}.${month}.${year}`;
  };

  const formattedDeparture = formatGermanDate(saturday);
  const formattedReturn = formatGermanDate(sunday);
  const departureDateDb = saturday;
  const returnDateDb = sunday;

  // Deep Links
  const dbahnUrl = `https://www.bahn.de/buchung/fahrplan/suche#sts=true&so=München&zo=${encodeURIComponent(to)}&sot=ST&zot=ST&soid=8000261&zoid=&sod=outward&outwardDate=${departureDateDb}&outwardTime=08:00&returnDate=${returnDateDb}&returnTime=15:00`;
  const flixbusUrl = `https://shop.flixbus.de/search?departureCity=Munich&arrivalCity=${encodeURIComponent(to)}&rideDate=${formattedDeparture}`;
  const blablacarUrl = `https://www.blablacar.de/search?fn=München&tn=${encodeURIComponent(to)}&db=${departureDateDb}`;

  const bookingUrl = `https://www.booking.com/searchresults.de.html?ss=${encodeURIComponent(to)}&checkin=${departureDateDb}&checkout=${returnDateDb}`;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 mb-10 w-full mx-auto">
      <h2 className="text-xl font-bold text-slate-800 mb-4 text-center">Anreise & Unterkunft</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Deutsche Bahn */}
        <a 
          href={dbahnUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex flex-col p-4 rounded-xl border border-slate-100 hover:border-red-400 hover:bg-red-50/30 transition-all cursor-pointer h-full shadow-sm hover:shadow"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center text-red-600 group-hover:scale-110 transition-transform flex-shrink-0">
              <Train size={20} />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 leading-tight">Deutsche Bahn</h3>
              <p className="text-slate-500 text-xs">Komfortabel & klimafreundlich</p>
            </div>
          </div>
          
          <div className="space-y-1 w-full mt-auto mb-4 bg-slate-50 p-2 rounded-lg border border-slate-100">
            <div className="flex justify-between text-xs">
              <span className="text-slate-600">Preis:</span>
              <span className="font-semibold text-slate-800">~ 40-80 €</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-600">Dauer:</span>
              <span className="font-semibold text-slate-800">Schnell</span>
            </div>
          </div>
          <button className="w-full mt-auto py-1.5 px-3 bg-red-50 text-red-700 font-medium text-sm rounded-lg group-hover:bg-red-600 group-hover:text-white transition-colors flex items-center justify-center gap-2">
            Zug buchen <ExternalLink size={14} />
          </button>
        </a>

        {/* FlixBus */}
        <a 
          href={flixbusUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex flex-col p-4 rounded-xl border border-slate-100 hover:border-green-400 hover:bg-green-50/30 transition-all cursor-pointer h-full shadow-sm hover:shadow"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600 group-hover:scale-110 transition-transform flex-shrink-0">
              <Bus size={20} />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 leading-tight">FlixBus</h3>
              <p className="text-slate-500 text-xs">Günstig & direkt</p>
            </div>
          </div>
          
          <div className="space-y-1 w-full mt-auto mb-4 bg-slate-50 p-2 rounded-lg border border-slate-100">
            <div className="flex justify-between text-xs">
              <span className="text-slate-600">Preis:</span>
              <span className="font-semibold text-slate-800">~ 15-35 €</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-600">Dauer:</span>
              <span className="font-semibold text-slate-800">Mittel</span>
            </div>
          </div>
          <button className="w-full mt-auto py-1.5 px-3 bg-green-50 text-green-700 font-medium text-sm rounded-lg group-hover:bg-green-600 group-hover:text-white transition-colors flex items-center justify-center gap-2">
            Bus buchen <ExternalLink size={14} />
          </button>
        </a>

        {/* BlaBlaCar */}
        <a 
          href={blablacarUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex flex-col p-4 rounded-xl border border-slate-100 hover:border-blue-400 hover:bg-blue-50/30 transition-all cursor-pointer h-full shadow-sm hover:shadow"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform flex-shrink-0">
              <Car size={20} />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 leading-tight">BlaBlaCar</h3>
              <p className="text-slate-500 text-xs">Flexibel & sozial</p>
            </div>
          </div>
          
          <div className="space-y-1 w-full mt-auto mb-4 bg-slate-50 p-2 rounded-lg border border-slate-100">
            <div className="flex justify-between text-xs">
              <span className="text-slate-600">Preis:</span>
              <span className="font-semibold text-slate-800">~ 18-25 €</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-600">Dauer:</span>
              <span className="font-semibold text-slate-800">Auto</span>
            </div>
          </div>
          <button className="w-full mt-auto py-1.5 px-3 bg-blue-50 text-blue-700 font-medium text-sm rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-colors flex items-center justify-center gap-2">
            Mitfahrt suchen <ExternalLink size={14} />
          </button>
        </a>

        {/* Booking.com */}
        <a 
          href={bookingUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex flex-col p-4 rounded-xl border border-slate-100 hover:border-indigo-400 hover:bg-indigo-50/30 transition-all cursor-pointer h-full shadow-sm hover:shadow"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 group-hover:scale-110 transition-transform flex-shrink-0">
              <Bed size={20} />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 leading-tight">Booking.com</h3>
              <p className="text-slate-500 text-xs">Hotels & Unterkünfte</p>
            </div>
          </div>
          
          <div className="space-y-1 w-full mt-auto mb-4 bg-slate-50 p-2 rounded-lg border border-slate-100">
            <div className="flex justify-between text-xs">
              <span className="text-slate-600">Check-in:</span>
              <span className="font-semibold text-slate-800">{formattedDeparture}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-600">Check-out:</span>
              <span className="font-semibold text-slate-800">{formattedReturn}</span>
            </div>
          </div>
          <button className="w-full mt-auto py-1.5 px-3 bg-indigo-50 text-indigo-700 font-medium text-sm rounded-lg group-hover:bg-indigo-600 group-hover:text-white transition-colors flex items-center justify-center gap-2">
            Hotel buchen <ExternalLink size={14} />
          </button>
        </a>
      </div>
    </div>
  );
}
