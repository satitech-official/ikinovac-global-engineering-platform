import PublicPage from '@/components/PublicPage';
import ProductComparePage from '@/components/ProductComparePage';

export const metadata = { title: 'Compare Products', description: 'Compare selected industrial product families before preparing an RFQ.' };
export default function Page() { return <PublicPage><ProductComparePage /></PublicPage>; }
