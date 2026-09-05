import PublicPage from '@/components/PublicPage';
import ProductComparePage from '@/components/ProductComparePage';

export const metadata = { title: 'Product Directory', description: 'Explore industrial product families and send a direct requirement to IKINOVAC Global.' };
export default function Page() { return <PublicPage><ProductComparePage /></PublicPage>; }
