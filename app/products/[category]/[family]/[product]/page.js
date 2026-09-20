import { notFound } from 'next/navigation';
import PublicPage from '@/components/PublicPage';
import { ProductDetailView } from '@/components/ProductViews';
import { catalogueProducts, getCategory, getProduct, productHref, slugify } from '@/lib/catalogue';

const siteUrl = 'https://satitech-official.github.io/ikinovac-global-engineering-platform';

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
    description: `Source ${product.name} for industrial project requirements through IKINOVAC GLOBAL. Request technical review, global sourcing, procurement and project supply support across international markets.`,
    alternates: { canonical: href },
    openGraph: {
      title: `${product.name} | IKINOVAC GLOBAL`,
      description: `${product.name} industrial sourcing and procurement support for global projects. Technical configuration is reviewed against your requirement.`,
      url: href,
      images: product.cardImage ? [{ url: product.cardImage, alt: product.imageAlt || product.name }] : undefined
    }
  };
}

export default function DetailPage({ params }) {
  const category = getCategory(params.category);
  const product = getProduct(params.category, params.product);
  if (!category || !product || slugify(product.family) !== params.family) notFound();

  const href = productHref(product);
  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    '@id': `${siteUrl}${href}#product`,
    name: product.name,
    description: product.description,
    category: category.name,
    url: `${siteUrl}${href}`,
    image: (product.images || []).map(image => image.startsWith('http') ? image : `${siteUrl}${image}`)
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${siteUrl}/` },
      { '@type': 'ListItem', position: 2, name: 'Products', item: `${siteUrl}/products` },
      { '@type': 'ListItem', position: 3, name: category.name, item: `${siteUrl}/products/${category.slug}` },
      { '@type': 'ListItem', position: 4, name: product.name, item: `${siteUrl}${href}` }
    ]
  };

  return <PublicPage>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }} />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
    <ProductDetailView product={product} category={category} />
  </PublicPage>;
}
