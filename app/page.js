import PublicPage from '@/components/PublicPage';
import HomePage from '@/components/HomePage';

const siteUrl = 'https://www.ikinovac.com';

export default function Page() {
  const homePageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${siteUrl}/#webpage`,
    url: `${siteUrl}/`,
    name: 'IKINOVAC GLOBAL | Industrial Supply & Global Procurement',
    description: 'Global industrial sourcing and engineering procurement for valves, automation, piping, instrumentation, rotating equipment, MRO and project supply.',
    isPartOf: { '@id': `${siteUrl}/#website` },
    about: { '@id': `${siteUrl}/#organization` },
    inLanguage: 'en'
  };

  return <PublicPage>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(homePageSchema) }} />
    <HomePage />
  </PublicPage>;
}
