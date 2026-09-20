import { notFound } from 'next/navigation';
import PublicPage from '@/components/PublicPage';
import { CategoryView } from '@/components/ProductViews';
import { catalogueCategories, getCategory, getProductsForCategory } from '@/lib/catalogue';

export function generateStaticParams() {
  return catalogueCategories.map(category => ({ category: category.slug }));
}

export function generateMetadata({ params }) {
  const category = getCategory(params.category);
  if (!category) return {};
  return {
    title: `${category.name} | Global Industrial Supply & Procurement`,
    description: `Source ${category.name.toLowerCase()} for industrial projects through IKINOVAC GLOBAL. Explore product families and submit an RFQ for global sourcing, procurement and project supply support.`,
    alternates: { canonical: `/products/${category.slug}` },
    openGraph: {
      title: `${category.name} | IKINOVAC GLOBAL`,
      description: `${category.summary} Global sourcing and project procurement support available on request.`,
      url: `/products/${category.slug}`
    }
  };
}

export default function CategoryPage({ params }) {
  const category = getCategory(params.category);
  if (!category) notFound();
  return <PublicPage><CategoryView category={category} products={getProductsForCategory(category.slug)} /></PublicPage>;
}
