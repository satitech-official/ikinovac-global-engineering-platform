import { catalogueCategories, catalogueProducts, productHref } from '@/lib/catalogue';

const siteUrl = 'https://satitech-official.github.io/ikinovac-global-engineering-platform';
const lastModified = new Date('2026-09-20');

export default function sitemap() {
  const staticRoutes = [
    '',
    '/company',
    '/products',
    '/industries',
    '/solutions',
    '/global-presence',
    '/insights',
    '/contact'
  ];

  const categoryRoutes = catalogueCategories.map(category => `/products/${category.slug}`);
  const productRoutes = catalogueProducts.map(product => productHref(product));

  return [...staticRoutes, ...categoryRoutes, ...productRoutes].map((path, index) => ({
    url: `${siteUrl}${path || '/'}`,
    lastModified,
    changeFrequency: index === 0 ? 'weekly' : 'monthly',
    priority: index === 0 ? 1 : path === '/products' || path === '/global-presence' ? 0.9 : path.startsWith('/products/') ? 0.8 : 0.7
  }));
}
