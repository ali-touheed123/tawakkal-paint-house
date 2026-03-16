'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MessageCircle, ShoppingCart, Menu, X, MapPin, ChevronRight,
  ChevronDown
} from 'lucide-react';
import { useCartStore, useLocationStore, useUIStore } from '@/lib/store';
import { createClient } from '@/lib/supabase/client';
import { Category, Brand } from '@/types';
import { useSettings } from '@/lib/hooks/useSettings';

export function Navbar() {
  const pathname = usePathname();
  const { items } = useCartStore();
  const { area } = useLocationStore();
  const { setLocationPopupOpen, isMobileMenuOpen, setMobileMenuOpen, setSearchOpen } = useUIStore();
  const { settings } = useSettings();
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [activeBrand, setActiveBrand] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const fetchNavData = async () => {
      const supabase = createClient();
      const [catsRes, brandsRes] = await Promise.all([
        supabase.from('categories').select('*').order('name'),
        supabase.from('brands').select('*').order('name')
      ]);
      if (catsRes.data) setCategories(catsRes.data);
      if (brandsRes.data) setBrands(brandsRes.data);
    };
    fetchNavData();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname, setMobileMenuOpen]);

  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);

  // Hide navbar on admin dashboard
  if (pathname?.startsWith('/admin-7392-dashboard')) return null;

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '#', label: 'Products', hasDropdown: true },
    { href: '/#why-choose-us', label: 'Why Choose Us' },
    { href: '/#calculator', label: 'Calculator' },
    { href: '/contact', label: 'Contact Us' },
  ];

  const productData = {
    categories: categories.map(c => ({ name: c.name, slug: c.slug })),
    brands: brands.map(b => ({ name: b.name, slug: b.slug })),
    subs: [
      { name: 'Interior', slug: 'interior' },
      { name: 'Exterior', slug: 'exterior' },
      { name: 'Wood & Metal', slug: 'wood_metal' },
      { name: 'Waterproofing', slug: 'waterproofing' },
      { name: 'Accessories', slug: 'accessories' }
    ]
  };


  const handleChangeArea = () => {
    if (typeof window !== 'undefined' && (window as any).openLocationPopup) {
      (window as any).openLocationPopup();
    } else {
      setLocationPopupOpen(true);
    }
  };

  return (
    <>
      <nav
        className={`relative z-40 transition-all duration-300 ${scrolled ? 'glassmorphism border-b border-gold/20' : 'bg-navy'
          }`}
      >
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="max-w-7xl mx-auto px-3 xs:px-4 sm:px-6 lg:px-8"
        >
          <div className="flex items-center justify-between h-[60px] xs:h-[70px] relative">
            {/* Mobile Menu Button - Left on mobile */}
            <button
              onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden text-white p-1"
              aria-label="Menu"
            >
              {isMobileMenuOpen ? <X size={22} className="xs:w-6 xs:h-6" /> : <Menu size={22} className="xs:w-6 xs:h-6" />}
            </button>

            {/* Logo */}
            <Link href="/" className="flex items-center gap-1 xs:gap-2 absolute left-1/2 -translate-x-1/2 lg:static lg:translate-x-0 lg:left-0 max-w-[140px] xs:max-w-none">
              <img
                src={settings?.logo || "/logo.png"}
                alt="Tawakkal Paint House"
                className="h-8 xs:h-10 md:h-12 w-auto object-contain"
              />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-8 self-stretch pl-4">
              {/* ... existing links ... */}
            </div>

            {/* Desktop/Mobile Icons */}
            <div className="flex items-center gap-2 xs:gap-4 relative z-50">
              <button
                onClick={() => setSearchOpen(true)}
                className="text-white/80 hover:text-gold transition-colors p-1"
                aria-label="Search"
              >
                <Search size={18} className="xs:w-5 xs:h-5" />
              </button>

              <Link
                href={`https://wa.me/${settings?.contact?.whatsapp || '923475658761'}?text=Hi! I need help with paint.`}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden lg:flex text-green-400 hover:text-green-300 transition-colors"
                aria-label="WhatsApp"
              >
                <MessageCircle size={20} />
              </Link>

              <Link
                href="/cart"
                className="relative text-white/80 hover:text-gold transition-colors p-1"
                aria-label="Cart"
              >
                <ShoppingCart size={18} className="xs:w-5 xs:h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 xs:-top-2 xs:-right-2 bg-gold text-navy text-[9px] xs:text-xs font-bold w-4 h-4 xs:w-5 xs:h-5 rounded-full flex items-center justify-center border border-navy">
                    {cartCount}
                  </span>
                )}
              </Link>


              {area && (
                <button
                  onClick={handleChangeArea}
                  className="hidden lg:flex items-center gap-1 text-gold text-sm bg-gold/10 px-3 py-1.5 rounded-full hover:bg-gold/20 transition-colors"
                >
                  <MapPin size={14} />
                  <span className="hidden xl:inline">{area}</span>
                  <span className="text-xs opacity-60">✏️</span>
                </button>
              )}
            </div>
          </div>
        </motion.div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden bg-navy border-t border-gold/20"
            >
              <div className="px-4 py-4 space-y-4">
                {navLinks.map((link) => (
                  <div key={link.label}>
                    {link.hasDropdown ? (
                      <div>
                        <button
                          onClick={() => setActiveCategory(activeCategory === 'mobile_products' ? null : 'mobile_products')}
                          className="flex items-center justify-between w-full py-2 text-sm font-medium text-white/80"
                        >
                          {link.label}
                          <ChevronDown size={14} className={`transition-transform ${activeCategory === 'mobile_products' ? 'rotate-180' : ''}`} />
                        </button>

                        <AnimatePresence>
                          {activeCategory === 'mobile_products' && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="overflow-hidden pl-4 space-y-2 mt-2 border-l border-gold/20"
                            >
                              {productData.categories.map((cat) => (
                                <div key={cat.slug}>
                                  {cat.slug === 'decorative' ? (
                                    <>
                                      <button
                                        onClick={() => setActiveBrand(activeBrand === cat.slug ? null : cat.slug)}
                                        className="flex items-center justify-between w-full py-2 text-sm text-white/60"
                                      >
                                        {cat.name}
                                        <ChevronDown size={12} className={`transition-transform ${activeBrand === cat.slug ? 'rotate-180' : ''}`} />
                                      </button>

                                      <AnimatePresence>
                                        {activeBrand === cat.slug && (
                                          <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            className="overflow-hidden pl-4 space-y-1 mt-1 border-l border-gold/10"
                                          >
                                            {productData.brands.map((brand) => (
                                              <Link
                                                key={brand.slug}
                                                href={`/category/${cat.slug}?brand=${brand.name}`}
                                                className="block py-2 text-xs text-white/40 hover:text-gold"
                                                onClick={() => setMobileMenuOpen(false)}
                                              >
                                                {brand.name}
                                              </Link>
                                            ))}
                                          </motion.div>
                                        )}
                                      </AnimatePresence>
                                    </>
                                  ) : (
                                    <Link
                                      href={`/category/${cat.slug}`}
                                      className="block py-2 text-sm text-white/60"
                                      onClick={() => setMobileMenuOpen(false)}
                                    >
                                      {cat.name}
                                    </Link>
                                  )}
                                </div>
                              ))}
                              {/* Static Deals & Projects Link for Mobile */}
                              <Link
                                href="/deals"
                                className="block py-3 text-sm text-white/80 border-t border-white/10 mt-2"
                                onClick={() => setMobileMenuOpen(false)}
                              >
                                Deals & Projects
                              </Link>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ) : (
                      <Link
                        href={link.href}
                        className={`block py-2 text-sm font-medium ${pathname === link.href ? 'text-gold' : 'text-white/80'
                          }`}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {link.label}
                      </Link>
                    )}
                  </div>
                ))}

                <div className="flex items-center gap-4 pt-4 border-t border-white/10">
                  <Link
                    href={`https://wa.me/${settings?.contact?.whatsapp || '923475658761'}?text=Hi! I need help with paint.`}
                    target="_blank"
                    className="text-green-400 flex items-center gap-2"
                  >
                    <MessageCircle size={20} />
                    <span className="text-sm">WhatsApp Inquiry</span>
                  </Link>
                </div>

                {area && (
                  <button
                    onClick={handleChangeArea}
                    className="flex items-center gap-2 text-gold text-sm bg-gold/10 px-3 py-2 rounded-lg w-full mt-4"
                  >
                    <MapPin size={14} />
                    <span>{area}, Karachi</span>
                    <span className="ml-auto">✏️</span>
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

    </>
  );
}
