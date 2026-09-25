import PublicPage from '@/components/PublicPage';
import { CompanyPage } from '@/components/ContentPages';

export const metadata = {
  title: 'Industrial Sourcing & Procurement Company',
  description: 'IKINOVAC GLOBAL supports international industrial buyers with engineering-led sourcing, procurement, project supply, MRO and technical coordination.',
  alternates: { canonical: '/company/', languages: { en: '/company/', 'x-default': '/company/' } },
  keywords: [
    'global industrial sourcing company',
    'engineering procurement company',
    'industrial project supply company',
    'global MRO supplier',
    'international industrial supplier',
    'IKINOVAC Global'
  ],
  openGraph: {
    title: 'Global Industrial Sourcing & Engineering Procurement | IKINOVAC GLOBAL',
    description: 'Engineering-led industrial sourcing, procurement and project supply support for international buyers and project teams.',
    url: '/company/',
    images: ['/og.png']
  }
};

export default function Page() {
  const siteUrl = 'https://www.ikinovac.com';
  const aboutSchema = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name: 'About IKINOVAC GLOBAL',
    url: `${siteUrl}/company`,
    about: { '@id': `${siteUrl}/#organization` }
  };
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${siteUrl}/` },
      { '@type': 'ListItem', position: 2, name: 'Company', item: `${siteUrl}/company` }
    ]
  };
  return <PublicPage>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutSchema) }} />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
    <CompanyPage />
  </PublicPage>;
}
