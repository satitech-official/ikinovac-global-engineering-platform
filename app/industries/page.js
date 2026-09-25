import PublicPage from '@/components/PublicPage';
import { IndustriesPage } from '@/components/ContentPages';
import { industries } from '@/lib/content';

export const metadata = {
  title: 'Industrial Supply for Oil & Gas, Power, Mining & Manufacturing',
  description: 'IKINOVAC GLOBAL supports oil & gas, petrochemical, refining, power, LNG, marine, mining and manufacturing requirements with industrial sourcing and project procurement.',
  alternates: { canonical: '/industries/' },
  keywords: [
    'oil and gas equipment supplier',
    'petrochemical procurement',
    'power generation equipment supplier',
    'mining equipment sourcing',
    'industrial manufacturing supplier',
    'LNG equipment sourcing',
    'global industrial procurement'
  ],
  openGraph: {
    title: 'Industries Served | Industrial Supply & Procurement | IKINOVAC GLOBAL',
    description: 'Industrial sourcing and project procurement for oil & gas, petrochemical, power, mining, manufacturing and other critical sectors.',
    url: '/industries/',
    images: ['/og.png']
  }
};

export default function Page() {
  const siteUrl = 'https://www.ikinovac.com';
  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Industries Served by IKINOVAC GLOBAL',
    url: `${siteUrl}/industries`,
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: industries.map((industry, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: industry.name,
        url: `${siteUrl}/industries#industry-${industry.id}`
      }))
    }
  };
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${siteUrl}/` },
      { '@type': 'ListItem', position: 2, name: 'Industries', item: `${siteUrl}/industries` }
    ]
  };
  return <PublicPage>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }} />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
    <IndustriesPage />
  </PublicPage>;
}
