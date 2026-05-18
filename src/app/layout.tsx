import type { Metadata, Viewport } from "next";
import Script from "next/script";
import "./globals.css";
import { LocationPopup } from "@/components/LocationPopup";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SearchOverlay } from "@/components/SearchOverlay";
import { CartToast } from "@/components/CartToast";
import { CartSyncListener } from "@/components/CartSyncListener";
import { LiveOrderToast } from "@/components/LiveOrderToast";
import { Playfair_Display, DM_Sans } from 'next/font/google';
import { BRANCHES_DATA } from '@/data/branches';

const playfair = Playfair_Display({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-playfair',
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-dm-sans',
});

export const metadata: Metadata = {
  title: "Tawakkal Paint House | Premium Paints in Karachi",
  description: "Karachi's most trusted paint house since 2004. Authorized dealer for Gobi's, Berger, Diamond, Saasi, Brighto, Choice. Premium quality paints with free color consultation.",
  keywords: "paint store, Karachi paints, premium paints, Gobi's, Berger, Diamond, Saasi, Brighto, Choice, Rozzilac, industrial paints, automotive paints, decorative paints",
  authors: [{ name: "Tawakkal Paint House" }],
  openGraph: {
    title: "Tawakkal Paint House | Premium Paints in Karachi",
    description: "Karachi's most trusted paint house since 2004. Authorized dealer for premium paint brands.",
    url: "https://tawakkalpainthouse.com",
    type: "website",
    locale: "en_PK",
    siteName: "Tawakkal Paint House",
    images: [{
      url: 'https://kadkryylyzfwtxknvcic.supabase.co/storage/v1/object/public/products/images/og-main.jpg',
      width: 1200,
      height: 630,
      alt: 'Tawakkal Paint House - Premium Paints Karachi'
    }]
  },
  twitter: {
    card: "summary_large_image",
    title: "Tawakkal Paint House | Premium Paints in Karachi",
    description: "Karachi's most trusted paint house since 2004."
  },
  robots: {
    index: true,
    follow: true
  },
  alternates: {
    canonical: "https://tawakkalpainthouse.com"
  },
  icons: {
    icon: 'https://kadkryylyzfwtxknvcic.supabase.co/storage/v1/object/public/products/favicon-tph.png',
    shortcut: 'https://kadkryylyzfwtxknvcic.supabase.co/storage/v1/object/public/products/favicon-tph.png',
    apple: 'https://kadkryylyzfwtxknvcic.supabase.co/storage/v1/object/public/products/favicon-tph.png',
  },
};

export const viewport: Viewport = {
  themeColor: '#0F1F3D',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "PaintStore",
    "@id": "https://tawakkalpainthouse.com/#organization",
    "name": "Tawakkal Paint House",
    "url": "https://tawakkalpainthouse.com",
    "logo": "https://kadkryylyzfwtxknvcic.supabase.co/storage/v1/object/public/products/logo.png",
    "image": "https://kadkryylyzfwtxknvcic.supabase.co/storage/v1/object/public/products/logo.png",
    "description": "Karachi's most trusted paint house since 2004. Authorized dealer for Gobi's, Berger, Diamond, Saasi, Brighto, Choice, and exclusive distributor for Rozzilac.",
    "telephone": "+923475658761",
    "priceRange": "$$",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Maripur Hawksbay Road",
      "addressLocality": "Karachi",
      "addressRegion": "Sindh",
      "addressCountry": "PK"
    },
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      "opens": "09:00",
      "closes": "20:00"
    },
    "areaServed": [
      { "@type": "AdministrativeArea", "name": "Karachi" },
      { "@type": "AdministrativeArea", "name": "SITE Karachi" },
      { "@type": "AdministrativeArea", "name": "Naval Colony" },
      { "@type": "AdministrativeArea", "name": "Balkassar" },
      { "@type": "AdministrativeArea", "name": "Dera Ismail Khan" }
    ],
    "subOrganization": BRANCHES_DATA.map((branch) => ({
      "@type": "PaintStore",
      "name": branch.name,
      "telephone": branch.phones[0],
      "url": `https://tawakkalpainthouse.com/branches/${branch.slug}`,
      "address": {
        "@type": "PostalAddress",
        "streetAddress": branch.address,
        "addressLocality": branch.city,
        "addressCountry": "PK"
      }
    }))
  };

  return (
    <html lang="en" className={`${playfair.variable} ${dmSans.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      {/* Google Analytics */}
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-V7REN48WLM"
        strategy="lazyOnload"
      />
      <Script id="google-analytics" strategy="lazyOnload">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-V7REN48WLM');
        `}
      </Script>
      <body className="antialiased">
        <LocationPopup />
        <Navbar />
        <SearchOverlay />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
        <CartToast />
        <CartSyncListener />
        <LiveOrderToast />
      </body>
    </html>
  );
}
