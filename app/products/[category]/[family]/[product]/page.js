import { notFound } from 'next/navigation';
import PublicPage from '@/components/PublicPage';
import { ProductDetailView } from '@/components/ProductViews';
import { catalogueProducts, getCategory, getProduct, slugify } from '@/lib/catalogue';

export function generateStaticParams() { return catalogueProducts.map(product => ({ category: product.categorySlug, family: slugify(product.family), product: product.slug })); }
export function generateMetadata({ params }) { const product = getProduct(params.category, params.product); return product ? { title: product.name, description: product.description } : {}; }
export default function DetailPage({ params }) { const category = getCategory(params.category); const product = getProduct(params.category, params.product); if (!category || !product || slugify(product.family) !== params.family) notFound(); return <PublicPage><ProductDetailView product={product} category={category} /></PublicPage>; }
