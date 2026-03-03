'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, MessageCircle, Calculator, Palette, CheckCircle, Award, Star, Truck, Users, Clock } from 'lucide-react';
import { PaintCalculator } from '@/components/PaintCalculator';
import { PaintVisualizer } from '@/components/PaintVisualizer';
import { FAQ } from '@/components/FAQ';
import { ProductCard } from '@/components/ProductCard';
import { BrandSection } from '@/components/BrandSection';
import { createClient } from '@/lib/supabase/client';
import { useSettings } from '@/lib/hooks/useSettings';
import { Product } from '@/types';

const categories = [
  {
    slug: 'decorative',
    name: 'Decorative',
    description: 'Interior & exterior wall paints for homes & offices',
    image: '/images/categories/decorative.jpg'
  },
  {
    slug: 'industrial',
    name: 'Industrial',
    description: 'Heavy-duty protective coatings',
    image: '/images/categories/industrial.jpg'
  },
  {
    slug: 'auto',
    name: 'Auto',
    description: 'Automotive & vehicle refinishing paints',
    image: '/images/categories/auto.jpg'
  },
  {
    slug: 'deals',
    name: 'Deals / Projects',
    description: 'Complete paint packages for your 80 to 1000 Gaz property',
    image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800'
  }
];

const whyChooseUs = [
  { icon: Clock, title: '13+ Years in Business', description: 'Serving Karachi since 2011' },
  { icon: Users, title: '5,000+ Happy Customers', description: 'Satisfied clients across Karachi' },
  { icon: Award, title: '10+ Premium Brands', description: 'Authorized dealer for top brands' },
  { icon: CheckCircle, title: '100% Original Sealed', description: 'No fakes, no refills. Ever.' },
  { icon: Star, title: 'Authorized Dealer', description: 'Official partner for all premium paint brands' },
  { icon: Award, title: 'Exclusive Distributor', description: 'Rozzilac exclusive partnership' },
  { icon: Palette, title: 'Free Color Consultation', description: 'Expert advice on color selection' }
];

export default function HomePage() {
  const { settings } = useSettings();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from('products')
        .select('*')
        .or('brand.ilike.%Rozzilac%,brand.ilike.%Gobi%,brand.ilike.%Reliable%')
        .or('name.ilike.%Matt%,name.ilike.%Weather%,name.ilike.%Enamel%,name.ilike.%Emulsion%')
        .limit(10);
      if (data) setProducts(data as Product[]);
      setLoading(false);
    };
    fetchProducts();
  }, []);

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section ref={heroRef} className="relative min-h-screen flex items-center">
        {/* Background Image */}
        <div className="absolute inset-0">
          <div
            className="absolute inset-0 bg-cover bg-center parallax"
            style={{
              backgroundImage: `url(${settings?.banners?.[0] || 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1920'})`,
              transform: 'translateY(0)'
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-navy/90 via-navy/70 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Hero Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            >
              <span className="inline-block text-gold text-sm tracking-[3px] mb-4">
                SINCE 2011 • AUTHORIZED DEALER • KARACHI
              </span>
              <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
                Where Colour Meets Craftsmanship
              </h1>
              <p className="text-gray-300 text-lg md:text-xl mb-8 max-w-lg">
                Karachi&apos;s most trusted paint store. {settings?.contact?.phone ? 'Call us at ' + settings.contact.phone : 'Serving Karachi since 2011.'}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/category/decorative"
                  className="inline-flex items-center justify-center gap-2 bg-gold text-navy px-8 py-4 rounded-lg font-semibold hover:bg-gold-light transition-colors"
                >
                  Shop Now <ArrowRight size={20} />
                </Link>
                <Link
                  href={`https://wa.me/${settings?.contact?.whatsapp || '923475658761'}?text=Hi! I need help with paint.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 border-2 border-green-500 text-green-500 px-8 py-4 rounded-lg font-semibold hover:bg-green-500 hover:text-white transition-colors"
                >
                  <MessageCircle size={20} /> WhatsApp Us
                </Link>
              </div>

              {/* Stats */}
              <div className="flex flex-wrap gap-8 mt-12">
                {[
                  { number: '13+', label: 'Years' },
                  { number: '5,000+', label: 'Customers' },
                  { number: '10+', label: 'Brands' }
                ].map((stat, i) => (
                  <div key={i} className="text-center">
                    <p className="font-heading text-3xl md:text-4xl font-bold text-gold">{stat.number}</p>
                    <p className="text-gray-400 text-sm">{stat.label}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Right: Hero Image (Desktop only visual) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="hidden lg:block"
            >
              <div className="relative">
                <div className="absolute -inset-4 bg-gold/20 rounded-full blur-3xl" />
                <div className="relative w-full aspect-square max-w-lg mx-auto">
                  <div className="w-full h-full rounded-full overflow-hidden border-4 border-gold/30">
                    <img
                      src="https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=800"
                      alt="Premium Paints"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <div className="w-6 h-10 border-2 border-gold/50 rounded-full flex justify-center pt-2">
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="w-1.5 h-1.5 bg-gold rounded-full"
            />
          </div>
        </motion.div>
      </section>

      {/* Brand Section */}
      <BrandSection />

      {/* Why Choose Us Section */}
      <section id="why-choose-us" className="py-20 bg-off-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-navy mb-4">
              Why Choose Tawakkal?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Experience excellence in every stroke with our premium quality products and unmatched service.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {whyChooseUs.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-gold/10 group"
              >
                <div className="w-14 h-14 bg-gold-pale rounded-full flex items-center justify-center mb-4 group-hover:bg-gold group-hover:scale-110 transition-all duration-300">
                  <item.icon className="text-gold group-hover:text-white transition-colors" size={24} />
                </div>
                <h3 className="font-heading text-lg font-semibold text-navy mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.description}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Link
              href={`https://wa.me/${settings?.contact?.whatsapp || '923475658761'}?text=Hi! I need colour consultation.`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-green-500 text-white px-8 py-4 rounded-lg font-semibold hover:bg-green-400 transition-colors"
            >
              <MessageCircle size={20} /> Get Free Color Consultation
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-navy">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-white mb-4">
              Explore Our Collections
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Premium paints for every need — from home makeovers to industrial projects.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {categories.map((cat, i) => (
              <motion.div
                key={cat.slug}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="group relative overflow-hidden rounded-2xl aspect-[16/9] md:aspect-[2/1]"
              >
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/50 to-transparent" />
                <div className="absolute inset-0 flex flex-col justify-end p-8">
                  <h3 className="font-heading text-2xl md:text-3xl font-bold text-white mb-2">
                    {cat.name}
                  </h3>
                  <p className="text-gray-300 mb-4">{cat.description}</p>
                  <Link
                    href={cat.slug === 'deals' ? '/deals' : `/category/${cat.slug}`}
                    className="inline-flex items-center gap-2 text-gold font-semibold group-hover:gap-3 transition-all"
                  >
                    Explore <ArrowRight size={18} />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-off-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-navy mb-4">
              Featured Products
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover our premium selection from top brands.
            </p>
          </motion.div>

          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-5 gap-3 sm:gap-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl h-80 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-5 gap-3 sm:gap-4">
              {products.slice(0, 10).map((product, i) => (
                <ProductCard key={product.id} product={product} index={i} />
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link
              href="/category/decorative"
              className="inline-flex items-center gap-2 bg-navy text-white px-8 py-4 rounded-lg font-semibold hover:bg-navy/90 transition-colors"
            >
              View All Products <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* Paint Calculator Section */}
      <section id="calculator" className="py-20 bg-white">
        <PaintCalculator />
      </section>

      {/* Paint Visualizer Section */}
      <section className="py-20 bg-gold-pale">
        <PaintVisualizer />
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-off-white">
        <FAQ />
      </section>
    </div>
  );
}
