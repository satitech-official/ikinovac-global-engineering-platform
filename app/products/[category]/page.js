import { notFound } from 'next/navigation';
import PublicPage from '@/components/PublicPage';
import { CategoryView } from '@/components/ProductViews';
import { catalogueCategories, getCategory, getProductsForCategory } from '@/lib/catalogue';

const siteUrl = 'https://www.ikinovac.com';

// Search-intent descriptions of real catalogue categories (no unverified claims).
const categorySearchTitles = {
  valves: 'Industrial Valves & Flow Control Sourcing',
  automation: 'Valve Actuators & Industrial Automation Supply',
  'pipe-fittings-flanges': 'Industrial Pipes, Fittings & Flanges Supply',
  instrumentation: 'Industrial Instrumentation & Process Instruments',
  equipment: 'Industrial Pumps & Process Equipment Sourcing',
  'sealing-items': 'Industrial Gaskets, Seals & Fasteners Supply',
  'mining-machinery': 'Mining Machinery Parts & Industrial Bearings',
  motors: 'Industrial Motors, Gearboxes & Compressors',
  welding: 'Welding Consumables & Fabrication Equipment',
  safety: 'Industrial Safety Equipment & PPE Procurement',
  'process-utility': 'Industrial Process & Utility Equipment Supply',
  filtration: 'Industrial Filtration & Separation Equipment'
};

export function generateStaticParams() {
  return catalogueCategories.map(category => ({ category: category.slug }));
}

export function generateMetadata({ params }) {
  const category = getCategory(params.category);
  if (!category) return {};
  return {
    title: categorySearchTitles[category.slug] || `${category.name} Industrial Sourcing`,
    description: `${category.summary} Review ${category.items.length} industrial product families, project documentation needs and global sourcing options with IKINOVAC GLOBAL.`,
    alternates: { canonical: `/products/${category.slug}/`, languages: { en: `/products/${category.slug}/`, 'x-default': `/products/${category.slug}/` } },
    openGraph: {
      title: `${category.name} | IKINOVAC GLOBAL`,
      description: `${category.summary} Global sourcing and project procurement support available on request.`,
      url: `/products/${category.slug}/`,
      locale: 'en_US',
      images: ['/og.png']
    },
    twitter: {
      card: 'summary_large_image',
      title: `${category.name} | IKINOVAC GLOBAL`,
      description: `Source ${category.name.toLowerCase()} worldwide through IKINOVAC GLOBAL for engineering procurement and project supply requirements.`,
      images: ['/og.png']
    },
    robots: { index: true, follow: true }
  };
}

export default function CategoryPage({ params }) {
  const category = getCategory(params.category);
  if (!category) notFound();
  const products = getProductsForCategory(category.slug);
  const path = `/products/${category.slug}/`;

  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `${category.name} | IKINOVAC GLOBAL`,
    description: category.summary,
    url: `${siteUrl}${path}`,
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: products.map((product, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: product.name,
        url: `${siteUrl}${path}#product-${product.slug}`
      }))
    }
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${siteUrl}/` },
      { '@type': 'ListItem', position: 2, name: 'Products', item: `${siteUrl}/products/` },
      { '@type': 'ListItem', position: 3, name: category.name, item: `${siteUrl}${path}` }
    ]
  };

  return <PublicPage>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }} />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
    <CategoryView category={category} products={products} />
  </PublicPage>;
}
