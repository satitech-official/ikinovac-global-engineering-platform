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
    sitemap: 'https://www.ikinovac.com/sitemap.xml',
    host: 'https://www.ikinovac.com'
  };
}
