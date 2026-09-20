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
const googleVerification = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || '';
const bingVerification = process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION || '';
const socialProfiles = [
  'https://www.linkedin.com/in/ikinovac-global/',
  'https://www.instagram.com/ikinovacglobal/',
  'https://www.facebook.com/ikinovacglobal'
];

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'IKINOVAC GLOBAL | Industrial Supply, Engineering Procurement & Global Sourcing',
    template: '%s | IKINOVAC GLOBAL'
  },
  description: 'IKINOVAC GLOBAL supports industrial sourcing, engineering procurement and project supply for valves, automation, piping, instrumentation, rotating equipment, MRO and critical industry requirements worldwide.',
  applicationName: 'IKINOVAC GLOBAL',
  authors: [{ name: 'IKINOVAC GLOBAL' }],
  creator: 'IKINOVAC GLOBAL',
  publisher: 'IKINOVAC GLOBAL',
  category: 'Industrial Engineering and Global Procurement',
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
    title: 'IKINOVAC GLOBAL | Industrial Supply, Engineering Procurement & Global Sourcing',
    description: 'Engineering-led industrial sourcing, procurement and project supply across North America, Europe, the Middle East, Africa and Asia-Pacific.'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'IKINOVAC GLOBAL | Industrial Supply & Global Sourcing',
    description: 'Industrial sourcing, engineering procurement and project supply across Western, Eastern, Middle Eastern and African industrial markets.'
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
    logo: `${siteUrl}/assets/ikinovac-logo-enhanced-v2.png`,
    description: 'Engineering-led industrial sourcing, procurement and project supply solutions for North America, Europe, the Middle East, Africa and Asia-Pacific.',
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
