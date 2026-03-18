'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MessageCircle, Instagram, Facebook, Phone, MapPin, Music2, ArrowRight, ChevronUp } from 'lucide-react';
import { useLocationStore, useUIStore } from '@/lib/store';
import { useSettings } from '@/lib/hooks/useSettings';
import { createClient } from '@/lib/supabase/client';
import { Category } from '@/types';

export function Footer() {
  const pathname = usePathname();
  const { setLocationPopupOpen } = useUIStore();
  const { settings } = useSettings();
  const [categories, setCategories] = useState<any[]>([]);

  // Hide footer on admin dashboard
  if (pathname?.startsWith('/admin-7392-dashboard')) return null;

  useEffect(() => {
    async function fetchCategories() {
      const supabase = createClient();
      const { data } = await supabase
        .from('categories')
        .select('*')
        .eq('is_active', true)
        .order('name');
      
      if (data) {
        const dbHasDeals = data.some((c: any) => c.slug === 'deals');
        const finalCats = dbHasDeals 
          ? data 
          : [...data, { name: 'Deals & Projects', slug: 'deals' }];
        setCategories(finalCats);
      }
    }
    fetchCategories();
  }, []);

  const handleChangeArea = () => {
    if (typeof window !== 'undefined' && (window as any).openLocationPopup) {
      (window as any).openLocationPopup();
    } else {
      setLocationPopupOpen(true);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-navy relative overflow-hidden pt-20 pb-8 text-gray-300 selection:bg-gold selection:text-navy">
      {/* Subtle top border accent */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-navy via-gold/50 to-navy opacity-50"></div>
      
      {/* Decorative background blur */}
      <div className="absolute top-0 right-0 w-[250px] md:w-[500px] h-[250px] md:h-[500px] bg-gold/5 rounded-full blur-[80px] md:blur-[120px] pointer-events-none -translate-y-1/2" />
      <div className="absolute bottom-0 left-0 w-[250px] md:w-[500px] h-[250px] md:h-[500px] bg-blue-900/10 rounded-full blur-[80px] md:blur-[120px] pointer-events-none translate-y-1/2" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-10 xs:gap-8 lg:gap-8 mb-16">
          
          {/* Column 1: Brand & Desc */}
          <div className="lg:pr-8 space-y-6 col-span-1 xs:col-span-2 lg:col-span-1">
            <Link href="/" className="inline-block">
              <img
                src={settings?.logo || "/logo.png"}
                alt="Tawakkal Paint House"
                className="h-10 xs:h-12 w-auto drop-shadow-lg"
              />
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed pr-4 max-w-sm">
              Providing premium quality paints, industrial coatings, and painting solutions since 2004. Your trusted partner in color across the whole of Karachi.
            </p>
            <div className="flex flex-wrap items-center gap-2 xs:gap-3 pt-2">
              <a
                href={`https://wa.me/${settings?.contact?.whatsapp || '923475658761'}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 xs:w-10 xs:h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:bg-[#25D366] hover:text-white hover:border-[#25D366] hover:scale-110 active:scale-95 transition-all duration-300"
                aria-label="WhatsApp"
              >
                <MessageCircle size={16} className="xs:w-4.5 xs:h-4.5" />
              </a>
              <a
                href={settings?.socials?.facebook || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 xs:w-10 xs:h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:bg-[#1877F2] hover:text-white hover:border-[#1877F2] hover:scale-110 active:scale-95 transition-all duration-300"
                aria-label="Facebook"
              >
                <Facebook size={16} className="xs:w-4.5 xs:h-4.5" />
              </a>
              <a
                href={settings?.socials?.instagram || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 xs:w-10 xs:h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:bg-gradient-to-tr hover:from-[#f09433] hover:via-[#dc2743] hover:to-[#bc1888] hover:text-white hover:border-transparent hover:scale-110 active:scale-95 transition-all duration-300"
                aria-label="Instagram"
              >
                <Instagram size={16} className="xs:w-4.5 xs:h-4.5" />
              </a>
              <a
                href={settings?.socials?.tiktok || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 xs:w-10 xs:h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:bg-black hover:text-white hover:border-white/20 hover:scale-110 active:scale-95 transition-all duration-300"
                aria-label="TikTok"
              >
                <Music2 size={16} className="xs:w-4.5 xs:h-4.5" />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="col-span-1">
            <h3 className="text-white font-bold tracking-widest uppercase text-[10px] xs:text-xs mb-6 after:content-[''] after:block after:w-8 after:h-0.5 after:bg-gold after:mt-3">Quick Links</h3>
            <ul className="space-y-3">
              {[
                { name: 'Home', path: '/' },
                { name: 'Track Order', path: '/track' },
                { name: 'About Us', path: '/about' },
                { name: 'Calculator', path: '/#calculator' },
                { name: 'Why Choose Us', path: '/#why-choose-us' },
                { name: 'Contact Us', path: '/contact' },
              ].map((link) => (
                <li key={link.name}>
                  <Link href={link.path} className="group flex items-center text-xs xs:text-sm text-gray-400 hover:text-gold transition-colors">
                    <ArrowRight size={14} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-gold mr-2 hidden xs:block" />
                    <span className="group-hover:translate-x-1 transition-transform duration-300">{link.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Categories */}
          <div className="col-span-1">
            <h3 className="text-white font-bold tracking-widest uppercase text-[10px] xs:text-xs mb-6 after:content-[''] after:block after:w-8 after:h-0.5 after:bg-gold after:mt-3">Categories</h3>
            <ul className="space-y-3">
              {categories.map((cat: any) => {
                const isSpecial = cat.slug === 'deals';
                const href = isSpecial ? '/deals' : `/category/${cat.slug}`;
                return (
                  <li key={cat.slug}>
                    <Link href={href} className={`group flex items-center text-xs xs:text-sm transition-colors ${isSpecial ? 'text-gold font-semibold' : 'text-gray-400 hover:text-gold'}`}>
                      <ArrowRight size={14} className={`opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 mr-2 hidden xs:block ${isSpecial ? 'text-gold opacity-100 translate-x-0' : 'text-gold'}`} />
                      <span className="group-hover:translate-x-1 transition-transform duration-300">{cat.name}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Column 4: Contact Us */}
          <div className="col-span-1 xs:col-span-2 lg:col-span-1">
            <h3 className="text-white font-bold tracking-widest uppercase text-[10px] xs:text-xs mb-6 after:content-[''] after:block after:w-8 after:h-0.5 after:bg-gold after:mt-3">Contact Info</h3>
            <ul className="space-y-5">
              <li className="flex items-start gap-3 xs:gap-4">
                <div className="w-8 h-8 rounded-full bg-white/5 flex flex-shrink-0 items-center justify-center text-gold mt-1">
                  <MapPin size={14} />
                </div>
                <div className="min-w-0">
                  <p className="text-xs xs:text-sm text-white font-medium mb-1">Location</p>
                  <p className="text-xs xs:text-sm text-gray-400 leading-relaxed mb-2 break-words">Karachi, Pakistan</p>
                  <button onClick={handleChangeArea} className="text-[10px] xs:text-xs font-bold text-gold hover:text-white uppercase tracking-wider transition-colors border-b border-gold/30 hover:border-white pb-0.5">
                    Change Area
                  </button>
                </div>
              </li>
              <li className="flex items-start gap-3 xs:gap-4">
                <div className="w-8 h-8 rounded-full bg-white/5 flex flex-shrink-0 items-center justify-center text-gold mt-1">
                  <Phone size={14} />
                </div>
                <div className="min-w-0">
                  <p className="text-xs xs:text-sm text-white font-medium mb-1">Phone</p>
                  <a href={`tel:${settings?.contact?.phone || '0347-5658761'}`} className="block text-xs xs:text-sm text-gray-400 hover:text-gold transition-colors mb-0.5 break-words">{settings?.contact?.phone || '0347-5658761'}</a>
                  <a href={`https://wa.me/${settings?.contact?.whatsapp || '923475658761'}`} className="block text-xs xs:text-sm text-[#25D366] hover:text-white transition-colors">WhatsApp Us</a>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="relative border-t border-white/10 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-500 tracking-wide">
            &copy; {new Date().getFullYear()} <span className="text-gray-300 font-medium tracking-normal">Tawakkal Paint House</span>. All Rights Reserved.
          </p>
          
          <button 
            onClick={scrollToTop}
            className="group absolute -top-5 left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-navy border border-white/10 hover:border-gold flex items-center justify-center transition-all duration-300 hover:-translate-y-1 shadow-xl text-gray-400 hover:text-gold"
            aria-label="Scroll to top"
          >
            <ChevronUp size={20} className="group-hover:-translate-y-0.5 transition-transform duration-300" />
          </button>

          <p className="text-xs text-gray-500 tracking-wide flex items-center gap-1.5">
            Designed with <span className="text-red-500 text-sm animate-pulse">❤</span> in Karachi
          </p>
        </div>
      </div>
    </footer>
  );
}
