import Link from 'next/link';
import PublicPage from '@/components/PublicPage';
import { globalMarkets } from '@/lib/markets';

const siteUrl = 'https://satitech-official.github.io/ikinovac-global-engineering-platform';

export const metadata = {
  title: 'Industrial Supply Africa | Engineering Procurement & Project Supply',
  description: 'IKINOVAC GLOBAL supports African industrial buyers with valves, pumps, piping, automation, instrumentation, MRO and project procurement across South Africa, Nigeria, Kenya, Egypt, Ghana, Tanzania, Morocco, Angola and Mozambique.',
  alternates: { canonical: '/global-presence/africa' },
  keywords: [
    'industrial supplier Africa',
    'engineering procurement Africa',
    'industrial equipment supplier Africa',
    'oil and gas supplier Africa',
    'mining equipment supplier Africa',
    'MRO supplier Africa',
    'valves supplier Africa',
    'project supply Africa'
  ],
  openGraph: {
    title: 'Industrial Supply & Engineering Procurement Across Africa | IKINOVAC GLOBAL',
    description: 'Requirement-led industrial sourcing and project supply support for major African industrial markets.',
    url: '/global-presence/africa',
    images: ['/og.png']
  }
};

export default function AfricaPage() {
  const africaMarkets = globalMarkets.filter(market => market.region === 'Africa');

  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'Industrial supply and engineering procurement across Africa',
    provider: { '@id': `${siteUrl}/#organization` },
    areaServed: africaMarkets.map(market => ({ '@type': 'Country', name: market.name })),
    serviceType: ['Industrial sourcing','Engineering procurement','Project supply','MRO supply'],
    url: `${siteUrl}/global-presence/africa`
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${siteUrl}/` },
      { '@type': 'ListItem', position: 2, name: 'Global Presence', item: `${siteUrl}/global-presence` },
      { '@type': 'ListItem', position: 3, name: 'Africa', item: `${siteUrl}/global-presence/africa` }
    ]
  };

  return <PublicPage>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
    <section className="presence-hero">
      <p className="eyebrow light">AFRICA / INDUSTRIAL PROCUREMENT</p>
      <h1>ENGINEERING SUPPLY<br />FOR <em>AFRICA.</em></h1>
      <p>IKINOVAC GLOBAL supports industrial sourcing, engineering procurement, MRO and project supply requirements across key African industrial markets, with a focus on documented specifications, quality context and delivery requirements.</p>
    </section>

    <section className="presence-statements">
      <article><b>01</b><h2>Mining &amp; Minerals</h2><p>Machinery, valves, pumps, bearings, piping and maintenance requirements for mining and mineral-processing applications.</p></article>
      <article><b>02</b><h2>Oil, Gas &amp; LNG</h2><p>Valves, piping, instrumentation, automation and process equipment for energy and hydrocarbon projects.</p></article>
      <article><b>03</b><h2>Power, Water &amp; Infrastructure</h2><p>Industrial equipment and project supply requirements for utilities, infrastructure and manufacturing environments.</p></article>
    </section>

    <section className="industry-page-grid" aria-label="African industrial markets">
      {africaMarkets.map(market => <Link href={`/global-presence/${market.slug}`} key={market.slug} style={{ backgroundImage: 'linear-gradient(180deg,rgba(13,23,20,.18),rgba(13,23,20,.92)),url(/ikinovac-global-engineering-platform/assets/industry/procurement.jpg)' }}>
        <b>{market.region}</b>
        <h2>{market.name}</h2>
        <p>{market.description}</p>
        <span>Explore {market.name} sourcing →</span>
      </Link>)}
    </section>

    <section className="company-page-story">
      <div><p className="eyebrow">AFRICA / RFQ READINESS</p><h2>Clear specifications.<br /><em>Better sourcing.</em></h2></div>
      <div><p>For African project and MRO requirements, share the product specification, quantity, required documentation, final destination, delivery schedule and any approved-manufacturer or inspection constraints.</p><Link href="/contact" className="text-arrow">Start an Africa RFQ <span>→</span></Link></div>
    </section>
  </PublicPage>;
}
