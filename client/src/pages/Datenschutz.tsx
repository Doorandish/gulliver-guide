import SeoHead from '../components/SeoHead';
import Footer from '../components/Footer';

export default function Datenschutz() {
  return (
    <>
      <SeoHead 
        title="Datenschutzerklärung — Gulliver Guide"
        description="Datenschutzerklärung von Gulliver Guide."
      />
      <div className="min-h-screen flex flex-col">
        <main className="flex-grow max-w-3xl mx-auto px-4 py-16 w-full">
          <h1 className="text-3xl font-bold text-forest-800 mb-8">Datenschutzerklärung</h1>
          
          <div className="prose prose-slate max-w-none">
            <h2 className="text-xl font-semibold mt-6 mb-4">1. Datenschutz auf einen Blick</h2>
            <h3 className="text-lg font-medium mt-4 mb-2">Allgemeine Hinweise</h3>
            <p className="mb-4">
              Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren personenbezogenen Daten passiert, wenn Sie diese Website besuchen.
            </p>

            <h2 className="text-xl font-semibold mt-6 mb-4">2. Hosting und Content Delivery Networks (CDN)</h2>
            <h3 className="text-lg font-medium mt-4 mb-2">Externes Hosting</h3>
            <p className="mb-4">
              Diese Website wird bei einem externen Dienstleister gehostet (Hoster). Die personenbezogenen Daten, die auf dieser Website erfasst werden, werden auf den Servern des Hosters gespeichert.
            </p>

            <h2 className="text-xl font-semibold mt-6 mb-4">3. Allgemeine Hinweise und Pflichtinformationen</h2>
            <h3 className="text-lg font-medium mt-4 mb-2">Datenschutz</h3>
            <p className="mb-4">
              Die Betreiber dieser Seiten nehmen den Schutz Ihrer persönlichen Daten sehr ernst. Wir behandeln Ihre personenbezogenen Daten vertraulich und entsprechend der gesetzlichen Datenschutzvorschriften sowie dieser Datenschutzerklärung.
            </p>

            <h3 className="text-lg font-medium mt-4 mb-2">Hinweis zur verantwortlichen Stelle</h3>
            <p className="mb-4">
              Die verantwortliche Stelle für die Datenverarbeitung auf dieser Website ist:<br /><br />
              [BITTE ERGÄNZEN: Name / Firma]<br />
              [BITTE ERGÄNZEN: Straße und Hausnummer]<br />
              [BITTE ERGÄNZEN: PLZ Ort]<br />
              E-Mail: [BITTE ERGÄNZEN]
            </p>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
}
