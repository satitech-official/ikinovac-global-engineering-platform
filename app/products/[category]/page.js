import { notFound } from 'next/navigation';
import PublicPage from '@/components/PublicPage';
import { CategoryView } from '@/components/ProductViews';
import { catalogueCategories, getCategory, getProductsForCategory } from '@/lib/catalogue';

export function generateStaticParams() { return catalogueCategories.map(category => ({ category: category.slug })); }
export function generateMetadata({ params }) { const category = getCategory(params.category); return category ? { title: category.name, description: category.summary } : {}; }
export default function CategoryPage({ params }) { const category = getCategory(params.category); if (!category) notFound(); return <PublicPage><CategoryView category={category} products={getProductsForCategory(category.slug)} /></PublicPage>; }
