import SeoHead from '../components/SeoHead';
import Footer from '../components/Footer';

export default function Impressum() {
  return (
    <>
      <SeoHead 
        title="Impressum — Gulliver Guide"
        description="Impressum und rechtliche Hinweise von Gulliver Guide."
      />
      <div className="min-h-screen flex flex-col">
        <main className="flex-grow max-w-3xl mx-auto px-4 py-16 w-full">
          <h1 className="text-3xl font-bold text-forest-800 mb-8">Impressum</h1>
          
          <div className="prose prose-slate max-w-none">
            <h2 className="text-xl font-semibold mt-6 mb-4">Angaben gemäß § 5 DDG</h2>
            <p className="mb-4">
              [BITTE ERGÄNZEN: Name / Firmenname]<br />
              [BITTE ERGÄNZEN: Straße und Hausnummer]<br />
              [BITTE ERGÄNZEN: PLZ und Ort]
            </p>

            <h2 className="text-xl font-semibold mt-6 mb-4">Kontakt</h2>
            <p className="mb-4">
              Telefon: [BITTE ERGÄNZEN]<br />
              E-Mail: [BITTE ERGÄNZEN]
            </p>

            <h2 className="text-xl font-semibold mt-6 mb-4">Umsatzsteuer-ID</h2>
            <p className="mb-4">
              Umsatzsteuer-Identifikationsnummer gemäß § 27 a Umsatzsteuergesetz:<br />
              [BITTE ERGÄNZEN, falls vorhanden]
            </p>

            <h2 className="text-xl font-semibold mt-6 mb-4">Verbraucherstreitbeilegung / Universalschlichtungsstelle</h2>
            <p className="mb-4">
              Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.
            </p>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
}
