import { Train, Bus, Car, ExternalLink } from 'lucide-react';

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

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-12">
      <h2 className="text-2xl font-bold text-slate-800 mb-6 text-center">Multi-Modal Mobility Hub</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Deutsche Bahn */}
        <a 
          href={dbahnUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex flex-col items-center justify-between p-6 rounded-xl border-2 border-slate-100 hover:border-red-500 hover:bg-red-50/50 transition-all cursor-pointer h-full"
        >
          <div className="flex flex-col items-center flex-grow">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4 text-red-600 group-hover:scale-110 transition-transform">
              <Train size={24} />
            </div>
            <h3 className="font-bold text-lg text-slate-800 mb-1">Deutsche Bahn</h3>
            <p className="text-slate-500 text-sm mb-4 text-center">Komfortabel & klimafreundlich</p>
            
            <div className="space-y-2 w-full mt-auto">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Preis:</span>
                <span className="font-semibold text-slate-800">~ 40 - 80 €</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Dauer:</span>
                <span className="font-semibold text-slate-800">Schnell</span>
              </div>
            </div>
          </div>
          <button className="w-full mt-6 py-2 px-4 bg-slate-100 text-slate-700 font-medium rounded-lg group-hover:bg-red-600 group-hover:text-white transition-colors flex items-center justify-center gap-2">
            Zug buchen <ExternalLink size={16} />
          </button>
        </a>

        {/* FlixBus */}
        <a 
          href={flixbusUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex flex-col items-center justify-between p-6 rounded-xl border-2 border-slate-100 hover:border-green-500 hover:bg-green-50/50 transition-all cursor-pointer h-full"
        >
          <div className="flex flex-col items-center flex-grow">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4 text-green-600 group-hover:scale-110 transition-transform">
              <Bus size={24} />
            </div>
            <h3 className="font-bold text-lg text-slate-800 mb-1">FlixBus</h3>
            <p className="text-slate-500 text-sm mb-4 text-center">Günstig & direkt</p>
            
            <div className="space-y-2 w-full mt-auto">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Preis:</span>
                <span className="font-semibold text-slate-800">~ 15 - 35 €</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Dauer:</span>
                <span className="font-semibold text-slate-800">Mittel</span>
              </div>
            </div>
          </div>
          <button className="w-full mt-6 py-2 px-4 bg-slate-100 text-slate-700 font-medium rounded-lg group-hover:bg-green-600 group-hover:text-white transition-colors flex items-center justify-center gap-2">
            Bus buchen <ExternalLink size={16} />
          </button>
        </a>

        {/* BlaBlaCar */}
        <a 
          href={blablacarUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex flex-col items-center justify-between p-6 rounded-xl border-2 border-slate-100 hover:border-blue-500 hover:bg-blue-50/50 transition-all cursor-pointer h-full"
        >
          <div className="flex flex-col items-center flex-grow">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4 text-blue-600 group-hover:scale-110 transition-transform">
              <Car size={24} />
            </div>
            <h3 className="font-bold text-lg text-slate-800 mb-1">BlaBlaCar</h3>
            <p className="text-slate-500 text-sm mb-4 text-center">Flexibel & sozial</p>
            
            <div className="space-y-2 w-full mt-auto">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Preis:</span>
                <span className="font-semibold text-slate-800">~ 18 - 25 €</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Dauer:</span>
                <span className="font-semibold text-slate-800">Auto</span>
              </div>
            </div>
          </div>
          <button className="w-full mt-6 py-2 px-4 bg-slate-100 text-slate-700 font-medium rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-colors flex items-center justify-center gap-2">
            Mitfahrt suchen <ExternalLink size={16} />
          </button>
        </a>
      </div>
    </div>
  );
}
