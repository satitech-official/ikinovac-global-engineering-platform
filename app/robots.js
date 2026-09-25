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
    sitemap: 'https://www.ikinovacglobal.com/sitemap.xml',
    host: 'https://www.ikinovacglobal.com'
  };
}
