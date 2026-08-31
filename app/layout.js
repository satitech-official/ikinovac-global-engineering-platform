import './globals.css';
import './editorial-refresh.css';
import './reference-motion.css';
import './logo-clarity.css';
import './section-layout-fixes.css';
import './reference-video-refresh.css';
import './rfq-workflow.css';
import './client-ready.css';

export const metadata = {
  metadataBase: new URL('https://ikinovac.com'),
  title: { default: 'IKINOVAC GLOBAL | Engineering Solutions. Global Impact.', template: '%s | IKINOVAC GLOBAL' },
  description: 'Global engineering, industrial supply and procurement solutions for critical industries.',
  keywords: ['industrial engineering', 'global procurement', 'valves', 'piping', 'industrial supply', 'IKINOVAC Global'],
  openGraph: { type: 'website', siteName: 'IKINOVAC GLOBAL', title: 'IKINOVAC GLOBAL | Engineering Solutions. Global Impact.', description: 'Engineering-led industrial products, global sourcing and project supply solutions.' },
  twitter: { card: 'summary_large_image', title: 'IKINOVAC GLOBAL', description: 'Engineering solutions. Global impact.' }
};

export default function RootLayout({ children }) {
  const organizationSchema = { '@context': 'https://schema.org', '@type': 'Organization', name: 'IKINOVAC GLOBAL', description: 'Engineering-led industrial product, procurement and project supply solutions.', email: 'info@ikinovac.com' };
  return <html lang="en"><body>{children}<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }} /></body></html>;
}
