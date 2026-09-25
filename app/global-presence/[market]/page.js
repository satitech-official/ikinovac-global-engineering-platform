import { notFound } from 'next/navigation';
import Link from 'next/link';
import PublicPage from '@/components/PublicPage';
import { getGlobalMarket, globalMarkets } from '@/lib/markets';

const siteUrl = 'https://www.ikinovac.com';

export function generateStaticParams() {
  return globalMarkets.map(market => ({ market: market.slug }));
}

export function generateMetadata({ params }) {
  const market = getGlobalMarket(params.market);
  if (!market) return {};
  const path = `/global-presence/${market.slug}/`;
  return {
    title: market.title,
    description: market.description,
    keywords: market.keywords,
    alternates: { canonical: path, languages: { en: path, 'x-default': path } },
    openGraph: {
      title: market.title,
      description: market.description,
      url: path,
      locale: 'en_US',
      images: ['/og.png']
    },
    twitter: {
      card: 'summary_large_image',
      title: market.title,
      description: market.description,
      images: ['/og.png']
    },
    robots: { index: true, follow: true }
  };
}

export default function MarketPage({ params }) {
  const market = getGlobalMarket(params.market);
  if (!market) notFound();
  const path = `/global-presence/${market.slug}`;

  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: `Industrial sourcing and engineering procurement for ${market.name}`,
    provider: { '@type': 'Organization', '@id': `${siteUrl}/#organization`, name: 'IKINOVAC GLOBAL' },
    areaServed: { '@type': 'Country', name: market.name },
    serviceType: ['Industrial sourcing','Engineering procurement','Project supply','MRO supply'],
    url: `${siteUrl}${path}`
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${siteUrl}/` },
      { '@type': 'ListItem', position: 2, name: 'Global Presence', item: `${siteUrl}/global-presence/` },
      { '@type': 'ListItem', position: 3, name: market.name, item: `${siteUrl}${path}` }
    ]
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: market.faqs.map(([question, answer]) => ({
      '@type': 'Question',
      name: question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: answer
      }
    }))
  };

  return <PublicPage>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
    <section className="presence-hero">
      <p className="eyebrow light">GLOBAL PRESENCE / {market.region.toUpperCase()}</p>
      <h1>INDUSTRIAL SUPPLY<br />FOR <em>{market.name.toUpperCase()}</em>.</h1>
      <p>{market.description}</p>
    </section>
    <section className="presence-statements">
      <article><b>01</b><h2>Engineering-led sourcing</h2><p>Requirement-first sourcing across IKINOVAC&apos;s industrial product directory.</p></article>
      <article><b>02</b><h2>Project procurement</h2><p>Commercial and technical coordination for international project requirements.</p></article>
      <article><b>03</b><h2>Global supply support</h2><p>Product, documentation and delivery context connected through one project desk.</p></article>
    </section>
    <section className="company-page-story">
      <div><p className="eyebrow">{market.name.toUpperCase()} / SOURCING CONTEXT</p><h2>Built around the<br /><em>actual project brief.</em></h2></div>
      <div><p>{market.context}</p><p>{market.deliveryContext}</p><Link href="/contact" className="text-arrow">Send a {market.name} RFQ <span>→</span></Link></div>
    </section>
    <section className="company-principles" aria-label={`Priority industrial requirements in ${market.name}`}>
      {market.buyerNeeds.map((need, index) => <article key={need}><b>{String(index + 1).padStart(2,'0')}</b><h3>{need}</h3><p>Submit the specification, quantity, documentation needs and delivery context for sourcing review.</p></article>)}
    </section>
    <section className="company-principles" aria-label={`Priority industries in ${market.name}`}>
      {market.industries.map((industry, index) => <article key={industry}><b>{String(index + 1).padStart(2,'0')}</b><h3>{industry}</h3><p>Industrial sourcing and project-supply support for documented {industry.toLowerCase()} requirements.</p></article>)}
    </section>
    <section className="related-systems" aria-label={`Industrial supply categories for ${market.name}`}>
      <p className="eyebrow light">GLOBAL SOURCING / PRODUCT CATEGORIES</p>
      <h2>Explore core <em>industrial supply.</em></h2>
      <div>
        <Link href="/products/valves/"><b>01</b><h3>Industrial Valves</h3><p>Flow-control product families for project and maintenance requirements.</p><span>Explore valves →</span></Link>
        <Link href="/products/automation/"><b>02</b><h3>Actuation & Automation</h3><p>Actuation and control components for specified industrial systems.</p><span>Explore automation →</span></Link>
        <Link href="/products/pipe-fittings-flanges/"><b>03</b><h3>Pipe, Fittings & Flanges</h3><p>Industrial piping and connection product families for project supply.</p><span>Explore piping →</span></Link>
        <Link href="/products/instrumentation/"><b>04</b><h3>Instrumentation</h3><p>Measurement and analytical product families for process applications.</p><span>Explore instrumentation →</span></Link>
      </div>
    </section>
    <section className="presence-statements" aria-label={`Frequently asked questions for ${market.name}`}>
      {market.faqs.map(([question, answer], index) => <article key={question}><b>Q{index + 1}</b><h2>{question}</h2><p>{answer}</p></article>)}
    </section>
    <section className="presence-statements">
      <article><b>RFQ</b><h2>Have a requirement in {market.name}?</h2><p>Share the product, specification, quantity and delivery context with the IKINOVAC project desk.</p><Link href="/contact">Request a quote →</Link></article>
    </section>
  </PublicPage>;
}
