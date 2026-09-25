import Link from 'next/link';
import PublicPage from '@/components/PublicPage';

export const metadata = {
  title: 'Piping & Flange RFQ Guide',
  description: 'Prepare piping RFQs with size, schedule, material, pressure class, fittings, flange details, standards, documentation and delivery requirements.',
  alternates: { canonical: '/insights/piping-flange-rfq-guide/', languages: { en: '/insights/piping-flange-rfq-guide/', 'x-default': '/insights/piping-flange-rfq-guide/' } },
  keywords: ['pipe fittings flange RFQ','industrial piping procurement','flange sourcing guide','pipe fittings supplier RFQ','piping material requisition'],
  openGraph: { title: 'Pipe, Fittings & Flange RFQ Guide | IKINOVAC GLOBAL', description: 'A practical checklist for industrial piping, fittings and flange sourcing enquiries.', url: '/insights/piping-flange-rfq-guide/', images: ['/og.png'] }
};

export default function Page() {
  const schema = { '@context':'https://schema.org','@type':'Article', headline:'Pipe, Fittings & Flange RFQ Guide for Industrial Buyers', datePublished:'2026-09-20', dateModified:'2026-09-25', image:'https://www.ikinovac.com/og.png', author:{'@type':'Organization',name:'IKINOVAC GLOBAL',url:'https://www.ikinovac.com/',logo:{'@type':'ImageObject',url:'https://www.ikinovac.com/assets/ikinovac-logo-enhanced-v2.png'}}, publisher:{'@type':'Organization',name:'IKINOVAC GLOBAL',url:'https://www.ikinovac.com/',logo:{'@type':'ImageObject',url:'https://www.ikinovac.com/assets/ikinovac-logo-enhanced-v2.png'}}, mainEntityOfPage:'https://www.ikinovac.com/insights/piping-flange-rfq-guide/' };
  return <PublicPage><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(schema)}} />
    <section className="insights-hero"><p className="eyebrow light">ENGINEERING KNOWLEDGE / PIPING</p><h1>A CLEARER<br /><em>PIPING RFQ.</em></h1><p>The data points industrial buyers should align before requesting pipe, fitting and flange quotations.</p></section>
    <section className="insights-grid">
      <article><b>01 / SIZE</b><h2>Specify size and quantity</h2><p>List nominal sizes, lengths or piece quantities by line item. Mixed-size packages should remain separated enough to avoid ambiguity.</p></article>
      <article><b>02 / WALL</b><h2>Include schedule or thickness</h2><p>Pipe wall schedule or specified thickness is a core requirement. Fittings should be tied to the applicable dimensional and wall-thickness requirement.</p></article>
      <article><b>03 / MATERIAL</b><h2>Use exact material standards</h2><p>Provide the project material grade and standard for pipe, fittings and flanges rather than relying on broad material descriptions.</p></article>
      <article><b>04 / RATING</b><h2>Define flange class and facing</h2><p>Where flanges are involved, include pressure class, type, facing, bore and any required dimensional standard or project-specific requirement.</p></article>
      <article><b>05 / DOCUMENTS</b><h2>State traceability needs</h2><p>Material certificates, heat-number traceability, testing, inspection and marking requirements should be defined at RFQ stage.</p></article>
      <article><b>06 / DELIVERY</b><h2>Connect the MTO to delivery</h2><p>Include destination, packaging expectations, required delivery timing and whether partial shipments are acceptable.</p></article>
    </section>
    <section className="insights-cta"><p className="eyebrow">PIPING REQUIREMENT</p><h2>Have a piping MTO or requisition?<br /><em>Send the documented scope.</em></h2><Link href="/contact" className="button button-dark">Request a piping RFQ <span>→</span></Link></section>
  </PublicPage>;
}
