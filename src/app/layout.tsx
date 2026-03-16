import type { Metadata } from "next";
import "./globals.css";
import { LocationPopup } from "@/components/LocationPopup";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { WhatsAppBubble } from "@/components/WhatsAppBubble";
import { SearchOverlay } from "@/components/SearchOverlay";
import { CartToast } from "@/components/CartToast";

export const metadata: Metadata = {
  title: "Tawakkal Paint House | Premium Paints in Karachi",
  description: "Karachi's most trusted paint house since 2011. Authorized dealer for Gobi's, Berger, Diamond, Saasi, Brighto, Choice. Premium quality paints with free color consultation.",
  keywords: "paint store, Karachi paints, premium paints, Gobi's, Berger, Diamond, Saasi, Brighto, Choice, Rozzilac, industrial paints, automotive paints, decorative paints",
  authors: [{ name: "Tawakkal Paint House" }],
  openGraph: {
    title: "Tawakkal Paint House | Premium Paints in Karachi",
    description: "Karachi's most trusted paint house since 2011. Authorized dealer for premium paint brands.",
    type: "website",
    locale: "en_PK",
    siteName: "Tawakkal Paint House",
    images: [{
      url: 'https://tawakkalpainthouse.com/images/og-main.jpg',
      width: 1200,
      height: 630,
      alt: 'Tawakkal Paint House - Premium Paints Karachi'
    }]
  },
  twitter: {
    card: "summary_large_image",
    title: "Tawakkal Paint House | Premium Paints in Karachi",
    description: "Karachi's most trusted paint house since 2011."
  },
  robots: {
    index: true,
    follow: true
  },
  alternates: {
    canonical: "https://tawakkalpainthouse.com"
  },
  icons: {
    icon: '/favicon-tph.png',
    shortcut: '/favicon-tph.png',
    apple: '/favicon-tph.png',
  },
  themeColor: '#0F1F3D',
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
    "image": "https://tawakkalpainthouse.com/logo.png",
    "description": "Karachi's most trusted paint house since 2011. Authorized dealer for Gobi's, Berger, Diamond, Saasi, Brighto, Choice, and exclusive distributor for Rozzilac."
  };

  return (
    <html lang="en">
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
        <WhatsAppBubble />
        <CartToast />
      </body>
    </html>
  );
}
