import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-forest-900 text-cream py-12 mt-20">
      <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="text-center md:text-left">
          <h2 className="text-xl font-bold mb-2">Gulliver Guide</h2>
          <p className="text-forest-200 text-sm">© {new Date().getFullYear()} Gulliver Guide. Alle Rechte vorbehalten.</p>
        </div>
        
        <div className="flex items-center gap-6 text-sm text-forest-200">
          <Link to="/impressum" className="hover:text-amber-400 transition-colors">Impressum</Link>
          <Link to="/datenschutz" className="hover:text-amber-400 transition-colors">Datenschutz</Link>
        </div>
        
        <div className="text-sm text-forest-300">
          Built with ❤️ for sustainable travel
        </div>
      </div>
    </footer>
  );
}
