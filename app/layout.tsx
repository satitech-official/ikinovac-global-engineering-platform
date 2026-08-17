import type { Metadata } from "next";
import "./globals.css";
import "./catalog.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.ikinovac.com"),
  title: {
    default: "IKINOVAC Global | Engineering Solutions. Global Impact.",
    template: "%s | IKINOVAC Global",
  },
  description: "Engineering-led industrial products, global sourcing and procurement support for critical industries.",
  keywords: ["industrial supply", "engineering procurement", "global sourcing", "industrial valves", "MRO supply"],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    title: "IKINOVAC Global | Engineering Solutions. Global Impact.",
    description: "Engineering-led industrial products, global sourcing and procurement support for critical industries.",
    url: "/",
    images: [{ url: "/images/ikinovac-global-supply-cover.png", width: 1672, height: 928, alt: "IKINOVAC Global industrial supply network" }],
  },
  twitter: { card: "summary_large_image", title: "IKINOVAC Global", description: "Engineering Solutions. Global Impact.", images: ["/images/ikinovac-global-supply-cover.png"] },
  icons: { icon: "/favicon.svg" },
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "IKINOVAC Global",
  url: "https://www.ikinovac.com",
  email: "sales@ikinovac.com",
  description: "Engineering-led industrial products, global sourcing and procurement support for critical industries.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }} /></body></html>;
}
