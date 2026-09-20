import PublicPage from '@/components/PublicPage';
import { SolutionsPage } from '@/components/ContentPages';

export const metadata = {
  title: 'Engineering Procurement, Global Sourcing & Project Supply Solutions',
  description: 'IKINOVAC GLOBAL provides engineering support, global sourcing, project procurement, inspection coordination, logistics and industrial supply support for international projects.',
  alternates: { canonical: '/solutions' },
  keywords: [
    'engineering procurement services',
    'global industrial sourcing',
    'project procurement services',
    'industrial supply chain solutions',
    'MRO procurement services',
    'inspection and expediting',
    'industrial logistics support'
  ],
  openGraph: {
    title: 'Engineering Procurement & Global Sourcing Solutions | IKINOVAC GLOBAL',
    description: 'A connected route from technical review through global sourcing, procurement, inspection and delivery coordination.',
    url: '/solutions',
    images: ['/og.png']
  }
};

export default function Page() { return <PublicPage><SolutionsPage /></PublicPage>; }
