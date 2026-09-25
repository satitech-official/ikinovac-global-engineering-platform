import PublicPage from '@/components/PublicPage';
import { SolutionsPage } from '@/components/ContentPages';

export const metadata = {
  title: 'Engineering Procurement, Global Sourcing & Project Supply Solutions',
  description: 'IKINOVAC GLOBAL provides engineering support, global sourcing, project procurement, inspection coordination, logistics and industrial supply support for international projects.',
  alternates: { canonical: '/solutions/' },
  keywords: [
    'engineering procurement services',
    'global industrial sourcing',
    'project procurement services',
    'industrial supply chain solutions',
    'MRO procurement services',
    'inspection and expediting',
    'industrial logistics support'
  ],
  openGraph: {
    title: 'Engineering Procurement & Global Sourcing Solutions | IKINOVAC GLOBAL',
    description: 'A connected route from technical review through global sourcing, procurement, inspection and delivery coordination.',
    url: '/solutions/',
    images: ['/og.png']
  }
};

export default function Page() {
  const siteUrl = 'https://www.ikinovac.com';
  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'Engineering Procurement, Global Sourcing and Project Supply',
    serviceType: ['Engineering procurement','Global sourcing','Project supply','MRO procurement','Inspection coordination','Industrial logistics support'],
    provider: { '@id': `${siteUrl}/#organization` },
    areaServed: 'Worldwide',
    url: `${siteUrl}/solutions`
  };
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${siteUrl}/` },
      { '@type': 'ListItem', position: 2, name: 'Solutions', item: `${siteUrl}/solutions` }
    ]
  };
  return <PublicPage>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
    <SolutionsPage />
  </PublicPage>;
}
