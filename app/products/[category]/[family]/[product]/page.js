import { notFound } from 'next/navigation';
import PublicPage from '@/components/PublicPage';
import { ProductDetailView } from '@/components/ProductViews';
import { catalogueProducts, getCategory, getProduct, productHref, slugify } from '@/lib/catalogue';

export function generateStaticParams() {
  return catalogueProducts.map(product => ({
    category: product.categorySlug,
    family: slugify(product.family),
    product: product.slug
  }));
}

export function generateMetadata({ params }) {
  const product = getProduct(params.category, params.product);
  if (!product) return {};
  const href = productHref(product);
  return {
    title: `${product.name} Supplier | Global Industrial Sourcing`,
    description: `Source ${product.name} for industrial project requirements through IKINOVAC GLOBAL. Request technical review, global sourcing, procurement and project supply support.`,
    alternates: { canonical: href },
    openGraph: {
      title: `${product.name} | IKINOVAC GLOBAL`,
      description: `${product.name} industrial sourcing and procurement support. Technical configuration is reviewed against your project requirement.`,
      url: href
    }
  };
}

export default function DetailPage({ params }) {
  const category = getCategory(params.category);
  const product = getProduct(params.category, params.product);
  if (!category || !product || slugify(product.family) !== params.family) notFound();
  return <PublicPage><ProductDetailView product={product} category={category} /></PublicPage>;
}
