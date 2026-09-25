import Link from 'next/link';
import PublicPage from '@/components/PublicPage';

export const metadata = {
  title: 'Oil & Gas Procurement Checklist',
  description: 'A practical oil and gas sourcing checklist covering specifications, approved vendors, inspection, documentation, logistics and delivery requirements.',
  alternates: { canonical: '/insights/oil-gas-procurement-checklist/', languages: { en: '/insights/oil-gas-procurement-checklist/', 'x-default': '/insights/oil-gas-procurement-checklist/' } },
  keywords: ['oil and gas procurement checklist','oil gas equipment sourcing','project procurement oil and gas','industrial RFQ oil gas','global oil gas supplier'],
  openGraph: { title: 'Oil & Gas Procurement Checklist | IKINOVAC GLOBAL', description: 'Structure oil and gas sourcing requirements around technical, quality, documentation and delivery context.', url: '/insights/oil-gas-procurement-checklist/', images: ['/og.png'] }
};

export default function Page() {
  const schema = { '@context':'https://schema.org','@type':'Article', headline:'Oil & Gas Procurement Checklist for International Projects', datePublished:'2026-09-20', dateModified:'2026-09-25', image:'https://www.ikinovac.com/og.png', author:{'@type':'Organization',name:'IKINOVAC GLOBAL',url:'https://www.ikinovac.com/',logo:{'@type':'ImageObject',url:'https://www.ikinovac.com/assets/ikinovac-logo-enhanced-v2.png'}}, publisher:{'@type':'Organization',name:'IKINOVAC GLOBAL',url:'https://www.ikinovac.com/',logo:{'@type':'ImageObject',url:'https://www.ikinovac.com/assets/ikinovac-logo-enhanced-v2.png'}}, mainEntityOfPage:'https://www.ikinovac.com/insights/oil-gas-procurement-checklist/' };
  return <PublicPage><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(schema)}} />
    <section className="insights-hero"><p className="eyebrow light">ENGINEERING KNOWLEDGE / OIL &amp; GAS</p><h1>PROCUREMENT<br /><em>WITHOUT GAPS.</em></h1><p>A structured checklist for international oil and gas sourcing and project supply enquiries.</p></section>
    <section className="insights-grid">
      <article><b>01 / SCOPE</b><h2>Lock the technical scope</h2><p>Use issued specifications, datasheets, line lists, drawings and tag references so the sourcing process starts from controlled project information.</p></article>
      <article><b>02 / AVL</b><h2>State approved-vendor constraints</h2><p>If the project limits manufacturers, countries of origin or certifications, include those restrictions before commercial sourcing begins.</p></article>
      <article><b>03 / QUALITY</b><h2>Define inspection requirements</h2><p>Identify inspection plans, witness points, third-party inspection and required testing early so they are reflected in the supply route.</p></article>
      <article><b>04 / DOCUMENTS</b><h2>List the documentation package</h2><p>Material certificates, test reports, drawings, manuals, data books and traceability expectations should be part of the RFQ rather than an afterthought.</p></article>
      <article><b>05 / COMMERCIAL</b><h2>Align the commercial basis</h2><p>Quantity, currency, Incoterm or delivery basis, quotation validity and packaging requirements should be clear enough for comparable offers.</p></article>
      <article><b>06 / DELIVERY</b><h2>Connect procurement to the schedule</h2><p>State destination, required-on-site date and project milestones so lead time, inspection and logistics can be reviewed together.</p></article>
    </section>
    <section className="insights-cta"><p className="eyebrow">PROJECT PROCUREMENT</p><h2>Bring the controlled requirement.<br /><em>Keep sourcing accountable.</em></h2><Link href="/contact" className="button button-dark">Start an oil &amp; gas RFQ <span>→</span></Link></section>
  </PublicPage>;
}
