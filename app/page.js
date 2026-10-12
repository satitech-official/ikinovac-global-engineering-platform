import PublicPage from '@/components/PublicPage';
import HomePage from '@/components/HomePage';

const siteUrl = 'https://www.ikinovac.com';

export default function Page() {
  const homePageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${siteUrl}/#webpage`,
    url: `${siteUrl}/`,
    name: 'IKINOVAC GLOBAL | Official Industrial Sourcing Website',
    description: 'Official website of IKINOVAC GLOBAL (IG), providing industrial equipment sourcing, engineering procurement, valves, automation, piping, instrumentation, MRO and worldwide project supply.',
    isPartOf: { '@id': `${siteUrl}/#website` },
    about: { '@id': `${siteUrl}/#organization` },
    inLanguage: 'en'
  };

  return <PublicPage>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(homePageSchema) }} />
    <HomePage />
  </PublicPage>;
}
