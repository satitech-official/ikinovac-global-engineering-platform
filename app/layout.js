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

const defaultTitle = 'IKINOVAC GLOBAL | Industrial Supply & Global Procurement';
const defaultDescription = 'Global industrial sourcing and engineering procurement for valves, automation, piping, instrumentation, rotating equipment, MRO and project supply.';

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
      {
        url: '/favicon.png',
        type: 'image/png',
        sizes: '512x512'
      }
    ],
    shortcut: [
      {
        url: '/favicon.png',
        type: 'image/png'
      }
    ],
    apple: [
      {
        url: '/favicon.png',
        type: 'image/png',
        sizes: '180x180'
      }
    ]
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
    'IKINOVAC GLOBAL'
  ],
  alternates: {
    canonical: '/',
    languages: {
      'en': '/',
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
    'content-language': 'en',
    'google': 'notranslate'
  }
};

export default function RootLayout({ children }) {
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${siteUrl}/#organization`,
    name: 'IKINOVAC GLOBAL',
    alternateName: 'IKINOVAC',
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
    alternateName: 'IKINOVAC',
    description: defaultDescription,
    publisher: { '@id': `${siteUrl}/#organization` },
    inLanguage: 'en'
  };

  const homePageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${siteUrl}/#webpage`,
    url: `${siteUrl}/`,
    name: defaultTitle,
    description: defaultDescription,
    isPartOf: { '@id': `${siteUrl}/#website` },
    about: { '@id': `${siteUrl}/#organization` },
    inLanguage: 'en'
  };

  return <html lang="en" dir="ltr"><body>
    <Script id="clean-index-html-url" strategy="beforeInteractive">{`
      (function () {
        try {
          var path = window.location.pathname;
          if (/\\/index\\.html$/i.test(path)) {
            var cleanPath = path.replace(/index\\.html$/i, '');
            window.history.replaceState(null, '', cleanPath + window.location.search + window.location.hash);
          }
        } catch (e) {}
      })();
    `}</Script>
    {children}
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }} />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }} />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(homePageSchema) }} />
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
