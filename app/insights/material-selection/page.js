import Link from 'next/link';
import PublicPage from '@/components/PublicPage';

export const metadata = {
  title: 'Material Specification Checklist for Industrial Sourcing',
  description: 'A practical checklist for communicating industrial material requirements clearly during global sourcing and engineering procurement without substituting supplier assumptions for project specifications.',
  alternates: { canonical: '/insights/material-selection/', languages: { en: '/insights/material-selection/', 'x-default': '/insights/material-selection/' } },
  keywords: ['industrial material specification checklist','engineering material sourcing','material procurement guide','industrial procurement documentation','global engineering sourcing'],
  openGraph: {
    title: 'Industrial Material Specification Checklist | IKINOVAC GLOBAL',
    description: 'Structure material-related industrial sourcing enquiries around documented project requirements.',
    url: '/insights/material-selection/',
    images: ['/og.png']
  }
};

export default function Page() {
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Material Specification Checklist for Industrial Sourcing',
    datePublished: '2026-09-20',
    dateModified: '2026-09-20',
    author: { '@type': 'Organization', name: 'IKINOVAC GLOBAL', url: 'https://www.ikinovac.com/', logo: { '@type': 'ImageObject', url: 'https://www.ikinovac.com/assets/ikinovac-logo-enhanced-v2.png' } },
    publisher: { '@type': 'Organization', name: 'IKINOVAC GLOBAL', logo: { '@type': 'ImageObject', url: 'https://www.ikinovac.com/assets/ikinovac-logo-enhanced-v2.png' } },
    image: 'https://www.ikinovac.com/og.png',
    mainEntityOfPage: 'https://www.ikinovac.com/insights/material-selection/'
  };
  return <PublicPage>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
    <section className="insights-hero"><p className="eyebrow light">ENGINEERING KNOWLEDGE / MATERIALS</p><h1>SPECIFY THE<br /><em>MATERIAL BRIEF.</em></h1><p>How industrial buyers can reduce ambiguity when sourcing products against project material requirements.</p></section>
    <section className="insights-grid">
      <article><b>01 / STANDARD</b><h2>Use the exact specification</h2><p>Share the project-approved material grade, standard and revision where available. Avoid replacing a documented specification with a broad material family such as “stainless steel” or “carbon steel.”</p></article>
      <article><b>02 / SERVICE</b><h2>Provide service conditions</h2><p>Temperature, pressure, process medium, corrosion environment and mechanical duty can affect suitability. These conditions should accompany the material request rather than being inferred later.</p></article>
      <article><b>03 / TRACEABILITY</b><h2>State documentation needs</h2><p>Identify whether material certificates, inspection documents, heat-number traceability, test reports or third-party inspection are required by the project.</p></article>
      <article><b>04 / DIMENSIONS</b><h2>Connect material to product geometry</h2><p>For pipes, fittings, flanges, fasteners and fabricated components, include size, schedule, rating, thickness, dimensions and applicable dimensional standards.</p></article>
      <article><b>05 / APPROVAL</b><h2>List approved constraints</h2><p>Where the project has an approved-vendor list, origin restriction, certification requirement or customer-specific specification, include it in the initial enquiry.</p></article>
      <article><b>06 / REVIEW</b><h2>Keep substitutions explicit</h2><p>Any proposed alternative should be clearly identified for technical review and approval. A sourcing workflow should not silently treat a commercial alternative as technically equivalent.</p></article>
    </section>
    <section className="insights-cta"><p className="eyebrow">MATERIAL REQUIREMENT</p><h2>Source against the documented specification.<br /><em>Keep the technical context attached.</em></h2><Link href="/contact" className="button button-dark">Start a sourcing enquiry <span>→</span></Link></section>
  </PublicPage>;
}
