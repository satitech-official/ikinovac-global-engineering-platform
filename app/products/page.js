import PublicPage from '@/components/PublicPage';
import CataloguePage from '@/components/CataloguePage';

export const metadata = { title: 'Industrial Product Directory', description: 'Explore IKINOVAC Global industrial product families by category and project requirement.' };

export default function ProductsPage() { return <PublicPage><CataloguePage /></PublicPage>; }
