import Script from 'next/script';
import './globals.css';
import './editorial-refresh.css';
import './reference-motion.css';
import './logo-clarity.css';
import './section-layout-fixes.css';
import './reference-video-refresh.css';
import './rfq-workflow.css';
import './client-ready.css';
import './typography-refinement.css';
import './products-portfolio.css';
import './product-image-fit.css';
import './contact-project-desk.css';
import './mobile-homepage-fixes.css';
import './homepage-density-refinement.css';
import './footer-redesign.css';

const siteUrl = 'https://www.ikinovac.com';
const gaId = process.env.NEXT_PUBLIC_GA_ID || '';
const googleVerification = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || 'Ll23eOSzockpTSudW43vD072a5hGrlKU1leX8s1SZP8';
const bingVerification = process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION || '';
const socialProfiles = [
  'https://www.linkedin.com/in/ikinovac-global/',
  'https://www.instagram.com/ikinovacglobal/',
  'https://www.facebook.com/ikinovacglobal'
];

const defaultTitle = 'IKINOVAC GLOBAL | Official Industrial Sourcing Website';
const defaultDescription = 'Official website of IKINOVAC GLOBAL (IG). Explore industrial equipment sourcing, engineering procurement, valves, piping, automation, instrumentation and global project supply.';

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: defaultTitle,
    template: '%s | IKINOVAC GLOBAL'
  },
  description: defaultDescription,
  applicationName: 'IKINOVAC GLOBAL',
  authors: [{ name: 'IKINOVAC GLOBAL', url: siteUrl }],
  creator: 'IKINOVAC GLOBAL',
  publisher: 'IKINOVAC GLOBAL',
  category: 'Industrial Engineering, Procurement and Global Supply',
  referrer: 'origin-when-cross-origin',
  formatDetection: {
    email: false,
    address: false,
    telephone: false
  },
  icons: {
    icon: [
      { url: '/favicon.ico', type: 'image/x-icon', sizes: 'any' },
      { url: '/favicon-48.png', type: 'image/png', sizes: '48x48' },
      { url: '/favicon-96.png', type: 'image/png', sizes: '96x96' },
      { url: '/favicon-192.png', type: 'image/png', sizes: '192x192' }
    ],
    shortcut: [{ url: '/favicon.ico', type: 'image/x-icon' }],
    apple: [{ url: '/apple-touch-icon.png', type: 'image/png', sizes: '180x180' }]
  },
  keywords: [
    'global industrial supplier',
    'industrial sourcing company',
    'engineering procurement company',
    'global sourcing company',
    'industrial procurement services',
    'project supply company',
    'industrial valves supplier',
    'valve supplier worldwide',
    'actuation and automation supplier',
    'pipe fittings and flanges supplier',
    'industrial instrumentation supplier',
    'rotating equipment supplier',
    'MRO supplier',
    'oil and gas procurement',
    'petrochemical procurement',
    'power generation equipment sourcing',
    'mining equipment sourcing',
    'industrial supply Middle East',
    'industrial supply Africa',
    'industrial supply Europe',
    'industrial supply North America',
    'industrial supply Asia Pacific',
    'IKINOVAC GLOBAL',
    'IKINOVAC',
    'IG IKINOVAC',
    'IG industrial sourcing'
  ],
  alternates: {
    canonical: '/',
    languages: {
      en: '/',
      'x-default': '/'
    }
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    siteName: 'IKINOVAC GLOBAL',
    title: defaultTitle,
    description: defaultDescription,
    images: [{
      url: '/og.png',
      width: 1200,
      height: 630,
      alt: 'IKINOVAC GLOBAL industrial sourcing, engineering procurement and global supply'
    }]
  },
  twitter: {
    card: 'summary_large_image',
    title: defaultTitle,
    description: defaultDescription,
    images: ['/og.png']
  },
  verification: {
    ...(googleVerification ? { google: googleVerification } : {}),
    ...(bingVerification ? { other: { 'msvalidate.01': bingVerification } } : {})
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1
    }
  },
  other: {
    'content-language': 'en'
  }
};

const legacyGithubPagesRedirect = String.raw\`
  (function () {
    try {
      // Only handle this repository's old github.io preview URL.
      // Never redirect or deindex the official custom domain.
      if (window.location.hostname.toLowerCase() !== 'satitech-official.github.io') return;
      var base = '/ikinovac-global-engineering-platform';
      var path = window.location.pathname;
      if (path !== base && path.indexOf(base + '/') !== 0) return;
      var officialPath = path.slice(base.length) || '/';
      officialPath = officialPath.replace(/\/index\.html$/i, '/');
      window.location.replace('https://www.ikinovac.com' + officialPath +
        window.location.search + window.location.hash);
    } catch (e) {}
  })();
\`;

export default function RootLayout({ children }) {
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${siteUrl}/#organization`,
    name: 'IKINOVAC GLOBAL',
    alternateName: ['IKINOVAC', 'IG', 'IKINOVAC Global Engineering'],
    url: siteUrl,
    logo: `${siteUrl}/assets/ikinovac-logo-enhanced-v2.png`,
    image: `${siteUrl}/og.png`,
    description: defaultDescription,
    email: 'info@ikinovac.com',
    sameAs: socialProfiles,
    areaServed: 'Worldwide',
    knowsAbout: [
      'Industrial engineering',
      'Global industrial sourcing',
      'Engineering procurement',
      'Project supply',
      'Industrial valves',
      'Actuation and automation',
      'Pipe fittings and flanges',
      'Instrumentation',
      'Rotating equipment',
      'MRO supply',
      'Oil and gas',
      'Petrochemical',
      'Power generation',
      'Mining and minerals'
    ],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Industrial sourcing and engineering procurement capabilities',
      itemListElement: [
        'Industrial product supply',
        'Global sourcing',
        'Engineering procurement',
        'Project procurement',
        'MRO supply',
        'Inspection coordination',
        'Logistics and delivery support'
      ].map(name => ({
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name
        }
      }))
    },
    contactPoint: [{
      '@type': 'ContactPoint',
      contactType: 'sales',
      email: 'info@ikinovac.com',
      availableLanguage: ['English'],
      areaServed: 'Worldwide'
    }]
  };

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${siteUrl}/#website`,
    url: `${siteUrl}/`,
    name: 'IKINOVAC GLOBAL',
    alternateName: ['IKINOVAC', 'IG'],
    description: defaultDescription,
    publisher: { '@id': `${siteUrl}/#organization` },
    inLanguage: 'en'
  };

  return <html lang="en" dir="ltr">
    <head>
      <script id="legacy-ikinovac-pages-redirect" dangerouslySetInnerHTML={{ __html: legacyGithubPagesRedirect }} />
    </head>
    <body>
      <Script id="clean-index-html-url" strategy="beforeInteractive">{String.raw\`
        (function () {
          try {
            if (window.location.hostname.toLowerCase() !== 'www.ikinovac.com') return;
            if (/\/index\.html$/i.test(window.location.pathname)) {
              var clean = window.location.pathname.replace(/index\.html$/i, '');
              window.history.replaceState(null, '', clean + window.location.search + window.location.hash);
            }
          } catch (e) {}
        })();
      \`}</Script>
    {children}
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }} />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }} />
    {gaId && <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} strategy="afterInteractive" />
      <Script id="ikinovac-ga4" strategy="afterInteractive">{`
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        window.gtag = gtag;
        gtag('js', new Date());
        gtag('config', '${gaId}', { anonymize_ip: true });
      `}</Script>
    </>}
  </body></html>;
}
