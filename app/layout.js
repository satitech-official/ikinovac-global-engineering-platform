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

const siteUrl = 'https://satitech-official.github.io/ikinovac-global-engineering-platform';
const gaId = process.env.NEXT_PUBLIC_GA_ID || '';
const googleVerification = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || 'Ll23eOSzockpTSudW43vD072a5hGrlKU1leX8s1SZP8';
const bingVerification = process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION || '';
const socialProfiles = [
  'https://www.linkedin.com/in/ikinovac-global/',
  'https://www.instagram.com/ikinovacglobal/',
  'https://www.facebook.com/ikinovacglobal'
];

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'IKINOVAC GLOBAL | Industrial Supply & Engineering Procurement Africa',
    template: '%s | IKINOVAC GLOBAL'
  },
  description: 'IKINOVAC GLOBAL supports African industrial buyers with engineering procurement, valves, automation, piping, instrumentation, rotating equipment, MRO and project supply, backed by global sourcing capability.',
  applicationName: 'IKINOVAC GLOBAL',
  authors: [{ name: 'IKINOVAC GLOBAL' }],
  creator: 'IKINOVAC GLOBAL',
  publisher: 'IKINOVAC GLOBAL',
  category: 'Industrial Engineering and Global Procurement',
  icons: {
    icon: '/assets/ikinovac-logo.jpeg',
    shortcut: '/assets/ikinovac-logo.jpeg',
    apple: '/assets/ikinovac-logo.jpeg'
  },
  keywords: [
    'industrial engineering supplier',
    'global industrial supplier',
    'engineering procurement',
    'global sourcing company',
    'industrial procurement services',
    'project supply company',
    'valve supplier',
    'industrial valves',
    'actuation and automation',
    'pipe fittings and flanges',
    'industrial instrumentation',
    'industrial equipment supplier',
    'MRO supplier',
    'oil and gas procurement',
    'petrochemical procurement',
    'power generation equipment sourcing',
    'mining equipment sourcing',
    'industrial supply Africa',
    'engineering procurement Africa',
    'industrial equipment supplier Africa',
    'oil and gas supplier Africa',
    'mining equipment supplier Africa',
    'MRO supplier Africa',
    'valves supplier Africa',
    'industrial supply Middle East',
    'industrial supply Europe',
    'industrial supply USA',
    'IKINOVAC Global'
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
    url: siteUrl,
    siteName: 'IKINOVAC GLOBAL',
    title: 'IKINOVAC GLOBAL | Industrial Supply & Engineering Procurement Africa',
    description: 'Africa-focused industrial sourcing, engineering procurement and project supply across South Africa, Nigeria, Kenya, Egypt, Ghana, Tanzania, Morocco, Angola and Mozambique.',
    images: [{ url: '/og.png', width: 1200, height: 630, alt: 'IKINOVAC GLOBAL industrial engineering and procurement' }]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'IKINOVAC GLOBAL | Industrial Supply & Procurement Africa',
    description: 'Industrial sourcing, engineering procurement and project supply for African industrial markets, supported by a global sourcing network.',
    images: ['/og.png']
  },
  verification: {
    ...(googleVerification ? { google: googleVerification } : {}),
    ...(bingVerification ? { other: { 'msvalidate.01': bingVerification } } : {})
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1
    }
  }
};

export default function RootLayout({ children }) {
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${siteUrl}/#organization`,
    name: 'IKINOVAC GLOBAL',
    url: siteUrl,
    logo: `${siteUrl}/assets/ikinovac-logo.jpeg`,
    image: `${siteUrl}/og.png`,
    description: 'Africa-focused industrial sourcing, engineering procurement and project supply solutions supported by global sourcing capability.',
    email: 'info@ikinovac.com',
    sameAs: socialProfiles,
    areaServed: [
      'Worldwide',
      'United States',
      'Canada',
      'United Kingdom',
      'Germany',
      'Netherlands',
      'France',
      'Italy',
      'Spain',
      'United Arab Emirates',
      'Saudi Arabia',
      'Qatar',
      'Oman',
      'Bahrain',
      'Kuwait',
      'India',
      'Singapore',
      'Malaysia',
      'Indonesia',
      'South Africa',
      'Nigeria',
      'Kenya',
      'Egypt',
      'Ghana',
      'Tanzania',
      'Morocco',
      'Angola',
      'Mozambique'
    ],
    knowsAbout: [
      'Industrial engineering',
      'Global sourcing',
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
    url: siteUrl,
    name: 'IKINOVAC GLOBAL',
    publisher: { '@id': `${siteUrl}/#organization` },
    inLanguage: 'en'
  };

  return <html lang="en"><body>{children}
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
