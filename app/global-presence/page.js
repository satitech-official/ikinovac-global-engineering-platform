import PublicPage from '@/components/PublicPage';
import { GlobalPresencePage } from '@/components/ContentPages';

export const metadata = {
  title: 'Global Industrial Supply Network | Western, Eastern & African Markets',
  description: 'IKINOVAC GLOBAL supports industrial sourcing, engineering procurement and project supply requirements across Western markets, Eastern and Middle East markets, and key African industrial economies.',
  alternates: { canonical: '/global-presence' },
  keywords: [
    'global industrial supply',
    'industrial sourcing USA',
    'engineering procurement Europe',
    'industrial supplier Middle East',
    'industrial sourcing UAE',
    'industrial procurement Saudi Arabia',
    'industrial supplier Africa',
    'oil and gas supplier Africa',
    'industrial equipment South Africa',
    'industrial sourcing Nigeria',
    'industrial supply Kenya',
    'global project procurement'
  ],
  openGraph: {
    title: 'IKINOVAC GLOBAL | Global Industrial Supply & Project Procurement',
    description: 'Industrial sourcing, procurement and project supply support across Western, Eastern and African markets.',
    url: '/global-presence'
  }
};

export default function Page() {
  return <PublicPage><GlobalPresencePage /></PublicPage>;
}
