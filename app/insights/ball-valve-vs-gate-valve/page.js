import Link from 'next/link';
import PublicPage from '@/components/PublicPage';

export const metadata = {
  title: 'Ball Valve vs Gate Valve: Industrial Selection Guide',
  description: 'Compare ball valves and gate valves by operating function, shut-off behavior, pressure loss, actuation, maintenance and RFQ requirements for industrial projects.',
  alternates: { canonical: '/insights/ball-valve-vs-gate-valve' },
  keywords: ['ball valve vs gate valve','industrial valve comparison','ball valve selection','gate valve selection','valve procurement guide'],
  openGraph: { title: 'Ball Valve vs Gate Valve | IKINOVAC GLOBAL', description: 'A practical industrial buyer guide to comparing ball and gate valve requirements before RFQ.', url: '/insights/ball-valve-vs-gate-valve', images: ['/og.png'] }
};

export default function Page() {
  const schema = { '@context':'https://schema.org','@type':'Article', headline:'Ball Valve vs Gate Valve: Industrial Selection Guide', datePublished:'2026-09-20', dateModified:'2026-09-20', author:{'@type':'Organization',name:'IKINOVAC GLOBAL'}, publisher:{'@type':'Organization',name:'IKINOVAC GLOBAL'}, mainEntityOfPage:'https://www.ikinovac.com/insights/ball-valve-vs-gate-valve' };
  return <PublicPage><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(schema)}} />
    <section className="insights-hero"><p className="eyebrow light">ENGINEERING KNOWLEDGE / VALVES</p><h1>BALL VALVE<br />VS <em>GATE VALVE.</em></h1><p>A practical comparison for industrial buyers preparing a valve requirement.</p></section>
    <section className="insights-grid">
      <article><b>01 / FUNCTION</b><h2>Start with the duty</h2><p>Ball valves are commonly considered for quick quarter-turn isolation, while gate valves are commonly used where a full-bore isolation path and linear operation are required. Final selection depends on the project specification and service conditions.</p></article>
      <article><b>02 / OPERATION</b><h2>Quarter-turn vs linear travel</h2><p>Ball valves typically move through a quarter turn. Gate valves use linear stem travel. That difference affects operating speed, actuator selection, space and maintenance planning.</p></article>
      <article><b>03 / FLOW</b><h2>Review pressure-loss requirements</h2><p>Full-bore designs can reduce restriction when fully open, but the exact valve construction, bore and piping arrangement should be reviewed against the process requirement.</p></article>
      <article><b>04 / SERVICE</b><h2>Pressure, temperature and medium matter</h2><p>Body, trim, seat, seal and pressure-class requirements should come from the documented service conditions rather than from valve type alone.</p></article>
      <article><b>05 / AUTOMATION</b><h2>Include actuation early</h2><p>If automation is required, include fail position, operating torque context, control signal, accessories and hazardous-area requirements with the RFQ.</p></article>
      <article><b>06 / RFQ</b><h2>Specify before comparing price</h2><p>A useful comparison requires size, rating, end connection, material, service conditions, standards, quantity and documentation requirements to be aligned.</p></article>
    </section>
    <section className="insights-cta"><p className="eyebrow">VALVE SOURCING</p><h2>Have a defined valve requirement?<br /><em>Send the specification.</em></h2><Link href="/contact" className="button button-dark">Request a valve RFQ <span>→</span></Link></section>
  </PublicPage>;
}
