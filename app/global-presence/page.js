import PublicPage from '@/components/PublicPage';
import { GlobalPresencePage } from '@/components/ContentPages';
import { globalMarkets } from '@/lib/markets';

export const metadata = {
  title: 'Global Industrial Supply Network',
  description: 'Global industrial sourcing, engineering procurement and project supply across North America, Europe, the Middle East and Africa.',
  alternates: { canonical: '/global-presence/' },
  keywords: [
    'global industrial supply',
    'industrial sourcing USA',
    'engineering procurement Europe',
    'industrial supplier Middle East',
    'industrial sourcing UAE',
    'industrial procurement Saudi Arabia',
    'industrial supplier Africa',
    'oil and gas supplier Africa',
    'industrial equipment South Africa',
    'industrial sourcing Nigeria',
    'industrial supply Kenya',
    'global project procurement'
  ],
  openGraph: {
    title: 'IKINOVAC GLOBAL | Global Industrial Supply & Project Procurement',
    description: 'Industrial sourcing, procurement and project supply support across Western, Eastern and African markets.',
    url: '/global-presence/',
    images: ['/og.png']
  }
};

export default function Page() {
  const siteUrl = 'https://www.ikinovac.com';
  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'IKINOVAC GLOBAL International Industrial Markets',
    url: `${siteUrl}/global-presence`,
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: globalMarkets.map((market, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: market.name,
        url: `${siteUrl}/global-presence/${market.slug}`
      }))
    }
  };
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${siteUrl}/` },
      { '@type': 'ListItem', position: 2, name: 'Global Presence', item: `${siteUrl}/global-presence` }
    ]
  };
  return <PublicPage>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }} />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
    <GlobalPresencePage />
  </PublicPage>;
}
