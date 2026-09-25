import Link from 'next/link';
import PublicPage from '@/components/PublicPage';

export const metadata = {
  title: 'Global Engineering Procurement RFQ Checklist',
  description: 'A practical RFQ checklist for international industrial buyers covering technical scope, quantities, documentation, commercial terms, logistics and delivery context.',
  alternates: { canonical: '/insights/procurement' },
  keywords: ['engineering procurement RFQ checklist','global industrial procurement','industrial sourcing RFQ','project procurement guide','international industrial supplier enquiry'],
  openGraph: {
    title: 'Global Engineering Procurement RFQ Checklist | IKINOVAC GLOBAL',
    description: 'Build a clearer industrial RFQ by connecting technical, commercial, documentation and logistics requirements.',
    url: '/insights/procurement',
    images: ['/og.png']
  }
};

export default function Page() {
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Global Engineering Procurement RFQ Checklist',
    datePublished: '2026-09-20',
    dateModified: '2026-09-20',
    author: { '@type': 'Organization', name: 'IKINOVAC GLOBAL' },
    publisher: { '@type': 'Organization', name: 'IKINOVAC GLOBAL' },
    mainEntityOfPage: 'https://www.ikinovac.com/insights/procurement'
  };
  return <PublicPage>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
    <section className="insights-hero"><p className="eyebrow light">ENGINEERING KNOWLEDGE / PROCUREMENT</p><h1>FROM REQUIREMENT<br />TO <em>RFQ.</em></h1><p>A practical structure for international industrial sourcing and project procurement enquiries.</p></section>
    <section className="insights-grid">
      <article><b>01 / IDENTIFY</b><h2>Define the requested product</h2><p>Use the product name, tag number or line-item reference from the project documents. Attach datasheets, drawings or specifications when they are part of the requirement.</p></article>
      <article><b>02 / TECHNICAL</b><h2>Separate required from preferred</h2><p>Mark mandatory specifications, acceptable ranges and optional preferences clearly so commercial sourcing does not blur the engineering requirement.</p></article>
      <article><b>03 / QUANTITY</b><h2>State quantities and units</h2><p>Include line-item quantities and units of measure. For phased projects, indicate whether the quantity is firm, estimated or split across releases.</p></article>
      <article><b>04 / DOCUMENTS</b><h2>List inspection and documentation</h2><p>Specify certificates, drawings, data books, inspection plans, third-party inspection or documentation formats needed with the supply.</p></article>
      <article><b>05 / COMMERCIAL</b><h2>Clarify quotation expectations</h2><p>Provide requested currency, quotation validity expectations, Incoterm or delivery basis if defined, and any packaging or export documentation requirements.</p></article>
      <article><b>06 / DELIVERY</b><h2>Include destination and schedule</h2><p>Share the final destination, required delivery date and any project milestone that affects the shipment. This helps suppliers assess lead time and logistics realistically.</p></article>
    </section>
    <section className="insights-cta"><p className="eyebrow">GLOBAL PROCUREMENT</p><h2>One clearer requirement.<br /><em>One accountable sourcing conversation.</em></h2><Link href="/contact" className="button button-dark">Send your RFQ <span>→</span></Link></section>
  </PublicPage>;
}
