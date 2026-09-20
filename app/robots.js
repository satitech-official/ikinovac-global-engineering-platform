export const dynamic = 'force-static';

export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/api/']
      }
    ],
    sitemap: 'https://satitech-official.github.io/ikinovac-global-engineering-platform/sitemap.xml',
    host: 'https://satitech-official.github.io/ikinovac-global-engineering-platform'
  };
}
