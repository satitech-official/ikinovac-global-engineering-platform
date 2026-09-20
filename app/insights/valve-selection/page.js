import Link from 'next/link';
import PublicPage from '@/components/PublicPage';

export const metadata = {
  title: 'Industrial Valve Selection Guide for Project Buyers',
  description: 'A practical IKINOVAC GLOBAL guide to preparing an industrial valve enquiry: service, pressure, temperature, material, actuation, standards, quantity and documentation requirements.',
  alternates: { canonical: '/insights/valve-selection' },
  keywords: ['industrial valve selection guide','valve procurement checklist','valve RFQ guide','industrial valves sourcing','ball valve gate valve butterfly valve procurement'],
  openGraph: {
    title: 'Industrial Valve Selection Guide | IKINOVAC GLOBAL',
    description: 'Prepare a clearer valve RFQ with the technical and commercial information global suppliers need.',
    url: '/insights/valve-selection',
    images: ['/og.png']
  }
};

export default function Page() {
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Industrial Valve Selection Guide for Project Buyers',
    datePublished: '2026-09-20',
    dateModified: '2026-09-20',
    author: { '@type': 'Organization', name: 'IKINOVAC GLOBAL' },
    publisher: { '@type': 'Organization', name: 'IKINOVAC GLOBAL' },
    mainEntityOfPage: 'https://satitech-official.github.io/ikinovac-global-engineering-platform/insights/valve-selection'
  };
  return <PublicPage>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
    <section className="insights-hero"><p className="eyebrow light">ENGINEERING KNOWLEDGE / VALVES</p><h1>BUILD A BETTER<br /><em>VALVE RFQ.</em></h1><p>A practical checklist for industrial buyers preparing valve sourcing and project enquiries.</p></section>
    <section className="insights-grid">
      <article><b>01 / SERVICE</b><h2>Start with the application</h2><p>State the process medium, operating purpose and whether the valve is for isolation, throttling, non-return or automated control. Application context helps suppliers narrow the correct product family without guessing.</p></article>
      <article><b>02 / CONDITIONS</b><h2>Pressure and temperature</h2><p>Include normal and design pressure and temperature, plus any known pressure class or project specification. These values materially affect body, trim, seat and end-connection choices.</p></article>
      <article><b>03 / CONNECTION</b><h2>Size and end connection</h2><p>Specify nominal size and required connection such as flanged, threaded, socket-weld or butt-weld where applicable. Include the relevant piping standard when known.</p></article>
      <article><b>04 / MATERIAL</b><h2>Material requirements</h2><p>Provide approved material specifications from the project documentation rather than relying on generic descriptions. Body, trim, seat and seal requirements may differ by service.</p></article>
      <article><b>05 / AUTOMATION</b><h2>Manual or actuated operation</h2><p>Indicate whether operation is manual, pneumatic or electric and include fail position, control signal, accessories and hazardous-area requirements when they are part of the project brief.</p></article>
      <article><b>06 / COMMERCIAL</b><h2>Quantity, documentation and delivery</h2><p>Include quantity, destination, required inspection or documentation, target delivery window and any approved-vendor or certification constraints to make the RFQ commercially usable.</p></article>
    </section>
    <section className="insights-cta"><p className="eyebrow">PROJECT REQUIREMENT</p><h2>Have a valve requirement?<br /><em>Send the documented brief.</em></h2><Link href="/contact" className="button button-dark">Request a technical RFQ <span>→</span></Link></section>
  </PublicPage>;
}
