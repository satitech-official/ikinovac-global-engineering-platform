import PublicPage from '@/components/PublicPage';
import { CompanyPage } from '@/components/ContentPages';

export const metadata = {
  title: 'Global Industrial Sourcing & Engineering Procurement Company',
  description: 'Learn how IKINOVAC GLOBAL supports international industrial buyers with engineering-led sourcing, global procurement, project supply, MRO and technical coordination.',
  alternates: { canonical: '/company' },
  keywords: [
    'global industrial sourcing company',
    'engineering procurement company',
    'industrial project supply company',
    'global MRO supplier',
    'international industrial supplier',
    'IKINOVAC Global'
  ],
  openGraph: {
    title: 'Global Industrial Sourcing & Engineering Procurement | IKINOVAC GLOBAL',
    description: 'Engineering-led industrial sourcing, procurement and project supply support for international buyers and project teams.',
    url: '/company',
    images: ['/og.png']
  }
};

export default function Page() { return <PublicPage><CompanyPage /></PublicPage>; }
