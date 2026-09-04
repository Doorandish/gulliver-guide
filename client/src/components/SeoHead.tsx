import { Helmet } from 'react-helmet-async';
import { TripPlan } from '../types/trip';

interface SeoHeadProps {
  title: string;
  description: string;
  canonicalUrl?: string;
  tripData?: TripPlan;
}

export default function SeoHead({ title, description, canonicalUrl, tripData }: SeoHeadProps) {
  const jsonLd = tripData ? {
    "@context": "https://schema.org",
    "@type": "TouristTrip",
    "name": tripData.destination,
    "description": description,
    "itinerary": tripData.days.map(day => ({
      "@type": "ItemList",
      "name": day.title,
      "itemListElement": day.activities.map((activity, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "item": {
          "@type": "TouristAttraction",
          "name": activity.title,
          "description": activity.description
        }
      }))
    }))
  } : null;

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
      {jsonLd && (
        <script type="application/ld+json">
          {JSON.stringify(jsonLd)}
        </script>
      )}
    </Helmet>
  );
}
