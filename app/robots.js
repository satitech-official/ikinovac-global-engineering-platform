export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/api/']
      }
    ],
    sitemap: 'https://ikinovac.com/sitemap.xml',
    host: 'https://ikinovac.com'
  };
}
