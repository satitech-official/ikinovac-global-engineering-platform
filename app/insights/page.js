import PublicPage from '@/components/PublicPage';
import InsightsPage from '@/components/InsightsPage';

export const metadata = {
  title: 'Industrial Engineering & Procurement Knowledge Hub',
  description: 'Technical resources from IKINOVAC GLOBAL covering industrial valves, engineering procurement, global sourcing, material requirements and project supply for international buyers.',
  alternates: { canonical: '/insights' },
  keywords: [
    'industrial engineering knowledge',
    'engineering procurement guide',
    'industrial valve selection',
    'global sourcing guide',
    'industrial project procurement',
    'international industrial buyers'
  ],
  openGraph: {
    title: 'Industrial Engineering Knowledge Hub | IKINOVAC GLOBAL',
    description: 'Engineering, sourcing and procurement resources for international industrial buyers and project teams.',
    url: '/insights',
    images: ['/og.png']
  }
};

export default function Page() { return <PublicPage><InsightsPage /></PublicPage>; }
