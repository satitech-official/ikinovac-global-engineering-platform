import PublicPage from '@/components/PublicPage';
import { IndustriesPage } from '@/components/ContentPages';

export const metadata = {
  title: 'Industrial Supply for Oil & Gas, Power, Mining & Manufacturing',
  description: 'IKINOVAC GLOBAL supports oil & gas, petrochemical, refining, power, LNG, marine, mining and manufacturing requirements with industrial sourcing and project procurement.',
  alternates: { canonical: '/industries' },
  keywords: [
    'oil and gas equipment supplier',
    'petrochemical procurement',
    'power generation equipment supplier',
    'mining equipment sourcing',
    'industrial manufacturing supplier',
    'LNG equipment sourcing',
    'global industrial procurement'
  ],
  openGraph: {
    title: 'Industries Served | Industrial Supply & Procurement | IKINOVAC GLOBAL',
    description: 'Industrial sourcing and project procurement for oil & gas, petrochemical, power, mining, manufacturing and other critical sectors.',
    url: '/industries',
    images: ['/og.png']
  }
};

export default function Page() { return <PublicPage><IndustriesPage /></PublicPage>; }
