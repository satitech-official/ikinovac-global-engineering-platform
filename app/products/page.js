import PublicPage from '@/components/PublicPage';
import CataloguePage from '@/components/CataloguePage';

export const metadata = {
  title: 'Industrial Products & Engineering Supply Directory',
  description: 'Explore IKINOVAC GLOBAL industrial products for valves, automation, piping, instrumentation, process equipment, rotating equipment, MRO and project requirements worldwide.',
  alternates: { canonical: '/products' },
  keywords: [
    'industrial products supplier',
    'global industrial equipment supplier',
    'valves and automation supplier',
    'pipe fittings flanges supplier',
    'industrial instrumentation supplier',
    'MRO supplier',
    'engineering procurement supplier'
  ],
  openGraph: {
    title: 'Industrial Products & Global Engineering Supply | IKINOVAC GLOBAL',
    description: 'Explore industrial product families and start an RFQ for international sourcing, procurement and project supply.',
    url: '/products',
    images: ['/og.png']
  }
};

export default function ProductsPage() { return <PublicPage><CataloguePage /></PublicPage>; }
