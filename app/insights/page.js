import PublicPage from '@/components/PublicPage';
import InsightsPage from '@/components/InsightsPage';
import { insights } from '@/lib/content';

export const metadata = {
  title: 'Industrial Engineering & Procurement Knowledge Hub',
  description: 'Technical resources from IKINOVAC GLOBAL covering industrial valves, engineering procurement, global sourcing, material requirements and project supply for international buyers.',
  alternates: { canonical: '/insights' },
  keywords: [
    'industrial engineering knowledge',
    'engineering procurement guide',
    'industrial valve selection',
    'global sourcing guide',
    'industrial project procurement',
    'international industrial buyers'
  ],
  openGraph: {
    title: 'Industrial Engineering Knowledge Hub | IKINOVAC GLOBAL',
    description: 'Engineering, sourcing and procurement resources for international industrial buyers and project teams.',
    url: '/insights',
    images: ['/og.png']
  }
};

export default function Page() {
  const siteUrl = 'https://satitech-official.github.io/ikinovac-global-engineering-platform';
  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'IKINOVAC GLOBAL Industrial Engineering Knowledge Hub',
    url: `${siteUrl}/insights`,
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: insights.map((article, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: article.title,
        url: `${siteUrl}/insights/${article.slug}`
      }))
    }
  };
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${siteUrl}/` },
      { '@type': 'ListItem', position: 2, name: 'Insights', item: `${siteUrl}/insights` }
    ]
  };
  return <PublicPage>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }} />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
    <InsightsPage />
  </PublicPage>;
}
