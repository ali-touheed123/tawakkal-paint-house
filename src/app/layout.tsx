import type { Metadata, Viewport } from "next";
import "./globals.css";
import { LocationPopup } from "@/components/LocationPopup";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SearchOverlay } from "@/components/SearchOverlay";
import { CartToast } from "@/components/CartToast";
import { CartSyncListener } from "@/components/CartSyncListener";
import { LiveOrderToast } from "@/components/LiveOrderToast";
import { Playfair_Display, DM_Sans } from 'next/font/google';

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
    "@type": "LocalBusiness",
    "name": "Tawakkal Paint House",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Karachi",
      "addressRegion": "Sindh",
      "addressCountry": "PK"
    },
    "telephone": "+923475658761",
    "areaServed": {
      "@type": "City",
      "name": "Karachi"
    },
    "priceRange": "$$",
    "openingHours": "Mo-Sat 09:00-20:00",
    "image": "https://kadkryylyzfwtxknvcic.supabase.co/storage/v1/object/public/products/logo.png",
    "description": "Karachi's most trusted paint house since 2004. Authorized dealer for Gobi's, Berger, Diamond, Saasi, Brighto, Choice, and exclusive distributor for Rozzilac."
  };

  return (
    <html lang="en" className={`${playfair.variable} ${dmSans.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
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
