'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MessageCircle, Instagram, Facebook, Phone, MapPin, Music2 } from 'lucide-react';
import { useLocationStore, useUIStore } from '@/lib/store';
import { useSettings } from '@/lib/hooks/useSettings';

export function Footer() {
  const pathname = usePathname();
  const { setLocationPopupOpen } = useUIStore();
  const { settings } = useSettings();

  // Hide footer on admin dashboard
  if (pathname?.startsWith('/admin-7392-dashboard')) return null;

  const handleChangeArea = () => {
    if (typeof window !== 'undefined' && (window as any).openLocationPopup) {
      (window as any).openLocationPopup();
    } else {
      setLocationPopupOpen(true);
    }
  };

  return (
    <footer className="bg-navy text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Column 1: Logo & Description */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <img
                src={settings?.logo || "/logo.png"}
                alt="Tawakkal Paint House"
                className="h-12 w-auto"
              />
            </div>
            <p className="text-gray-400 text-sm mb-6">
              Quality You Can Trust Since 2011
            </p>
            <div className="flex items-center gap-4">
              <Link
                href={`https://wa.me/${settings?.contact?.whatsapp || '923475658761'}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-400 hover:text-green-300 transition-colors"
                aria-label="WhatsApp"
              >
                <MessageCircle size={20} />
              </Link>
              <a
                href={settings?.socials?.instagram || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-gold transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={20} />
              </a>
              <a
                href={settings?.socials?.facebook || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-gold transition-colors"
                aria-label="Facebook"
              >
                <Facebook size={20} />
              </a>
              <a
                href={settings?.socials?.tiktok || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-gold transition-colors"
                aria-label="TikTok"
              >
                <Music2 size={20} />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="font-heading text-lg font-semibold mb-4 text-gold">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link href="/" className="text-gray-400 hover:text-gold transition-colors text-sm">Home</Link></li>
              <li><Link href="/category/decorative" className="text-gray-400 hover:text-gold transition-colors text-sm">Products</Link></li>
              <li><Link href="/#why-choose-us" className="text-gray-400 hover:text-gold transition-colors text-sm">Why Choose Us</Link></li>
              <li><Link href="/#calculator" className="text-gray-400 hover:text-gold transition-colors text-sm">Calculator</Link></li>
              <li><Link href="/#contact" className="text-gray-400 hover:text-gold transition-colors text-sm">Contact Us</Link></li>
            </ul>
            <h3 className="font-heading text-lg font-semibold mt-6 mb-4 text-gold">Categories</h3>
            <ul className="space-y-2">
              <li><Link href="/category/decorative" className="text-gray-400 hover:text-gold transition-colors text-sm">Decorative</Link></li>
              <li><Link href="/category/industrial" className="text-gray-400 hover:text-gold transition-colors text-sm">Industrial</Link></li>
              <li><Link href="/category/auto" className="text-gray-400 hover:text-gold transition-colors text-sm">Auto</Link></li>
              <li><Link href="/deals" className="text-gray-400 hover:text-gold transition-colors text-sm font-semibold text-gold">Deals & Projects</Link></li>
            </ul>
          </div>

          {/* Column 3: Contact */}
          <div>
            <h3 className="font-heading text-lg font-semibold mb-4 text-gold">Contact Us</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Phone size={18} className="text-gold mt-0.5" />
                <div>
                  <p className="text-gray-400 text-sm">{settings?.contact?.phone || '0347-5658761'}</p>
                  <p className="text-gray-400 text-sm">WhatsApp: {settings?.contact?.whatsapp || '0347-5658761'}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin size={18} className="text-gold mt-0.5" />
                <div>
                  <p className="text-gray-400 text-sm">Karachi, Pakistan</p>
                  <button
                    onClick={handleChangeArea}
                    className="text-gold text-sm hover:underline mt-1"
                  >
                    Change Delivery Area
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-400 text-sm">
            © 2025 Tawakkal Paint House. All Rights Reserved.
          </p>
          <p className="text-gray-400 text-sm">
            Made with ❤️ in Karachi
          </p>
        </div>
      </div>
    </footer>
  );
}
