import PublicPage from '@/components/PublicPage';
import { ContactPage } from '@/components/ContentPages';

export const metadata = {
  title: 'Industrial RFQ & Global Procurement Enquiry',
  description: 'Send IKINOVAC GLOBAL your industrial product, sourcing, MRO or project procurement requirement. Include specifications, quantity, destination and delivery context for review.',
  alternates: { canonical: '/contact/' },
  keywords: [
    'industrial RFQ',
    'engineering procurement enquiry',
    'industrial sourcing request',
    'global supplier RFQ',
    'MRO procurement enquiry',
    'industrial project quotation'
  ],
  openGraph: {
    title: 'Industrial RFQ & Procurement Enquiry | IKINOVAC GLOBAL',
    description: 'Submit an industrial sourcing, engineering procurement or project supply requirement to the IKINOVAC project desk.',
    url: '/contact/',
    images: ['/og.png']
  }
};

export default function Page() {
  const contactSchema = {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name: 'IKINOVAC GLOBAL Industrial RFQ & Procurement Enquiry',
    url: 'https://www.ikinovac.com/contact/',
    about: { '@id': 'https://www.ikinovac.com/#organization' }
  };
  return <PublicPage>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(contactSchema) }} />
    <ContactPage />
  </PublicPage>;
}
