import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, MessageCircle, CheckCircle, Gift, Wrench, ShoppingCart, Palette } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import dynamic from 'next/dynamic';
import { HomeHero } from '@/components/HomeHero';

// Dynamic imports for below-the-fold components
const PaintCalculator = dynamic(() => import('@/components/PaintCalculator').then(mod => mod.PaintCalculator), { ssr: true });
const FAQ = dynamic(() => import('@/components/FAQ').then(mod => mod.FAQ), { ssr: true });
const TestimonialSlider = dynamic(() => import('@/components/TestimonialSlider').then(mod => mod.TestimonialSlider), { ssr: true });
const ReviewForm = dynamic(() => import('@/components/ReviewForm').then(mod => mod.ReviewForm), { ssr: true });
const BrandSection = dynamic(() => import('@/components/BrandSection').then(mod => mod.BrandSection), { ssr: true });

import { ProductCard } from '@/components/ProductCard';

const whyChooseUs = [
  { icon: 'Clock', title: '20+ Years in Business', description: 'Serving Karachi since 2004' },
  { icon: 'Users', title: '5,000+ Happy Customers', description: 'Satisfied clients across Karachi' },
  { icon: 'Award', title: '10+ Premium Brands', description: 'Authorized dealer for top brands' },
  { icon: 'CheckCircle', title: '100% Original Sealed', description: 'No fakes, no refills. Ever.' },
  { icon: 'Star', title: 'Authorized Dealer', description: 'Official partner for all premium paint brands' },
  { icon: 'Award', title: 'Exclusive Distributor', description: 'Rozzilac exclusive partnership' },
  { icon: 'Palette', title: 'Free Color Consultation', description: 'Expert advice on color selection' }
];

export const revalidate = 3600; // Revalidate every hour

export default async function HomePage() {
  const supabase = await createClient();
  
  // Fetch data on server
  const [productsRes, categoriesRes, settingsRes] = await Promise.all([
    supabase
      .from('products')
      .select('*')
      .in('brand', ['Rozzilac', "Gobi's", 'Reliable'])
      .or('name.ilike.%Matt%,name.ilike.%Weather%,name.ilike.%Enamel%,name.ilike.%Emulsion%')
      .order('created_at', { ascending: false })
      .limit(10),
    supabase
      .from('categories')
      .select('*')
      .order('name', { ascending: true }),
    supabase
      .from('settings')
      .select('*')
      .single()
  ]);

  const products = productsRes.data || [];
  const categories = categoriesRes.data || [];
  const settings = settingsRes.data || {};

  return (
    <div className="flex flex-col min-h-screen">
      <HomeHero settings={settings} />

      {/* Brand Section */}
      <BrandSection />

      {/* Why Choose Us Section */}
      <section id="why-choose-us" className="py-20 bg-off-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-navy mb-4">
              Why Choose Tawakkal?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Experience excellence in every stroke with our premium quality products and unmatched service.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {whyChooseUs.map((item, i) => (
              <div
                key={i}
                className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-gold/10 group"
              >
                <div className="w-14 h-14 bg-gold-pale rounded-full flex items-center justify-center mb-4 group-hover:bg-gold group-hover:scale-110 transition-all duration-300">
                  {/* Icon rendering logic simplified for server component */}
                  <span className="text-gold group-hover:text-white transition-colors font-bold text-xl">✓</span>
                </div>
                <h3 className="font-heading text-lg font-semibold text-navy mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.description}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              href={`https://wa.me/${settings?.contact?.whatsapp || '923475658761'}?text=Hi! I need colour consultation.`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-green-500 text-white px-8 py-4 rounded-lg font-semibold hover:bg-green-400 transition-colors"
            >
              <MessageCircle size={20} /> Get Free Color Consultation
            </Link>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section id="categories" className="py-20 bg-navy">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-white mb-4">
              Explore Our Collections
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Premium paints for every need — from home makeovers to industrial projects.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {categories.filter(c => c.slug !== 'paint-tools').map((cat) => (
              <div
                key={cat.slug}
                className="group relative overflow-hidden rounded-2xl aspect-[16/9] md:aspect-[2/1]"
              >
                <Image
                  src={cat.image_url || cat.image || '/images/placeholder.jpg'}
                  alt={cat.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
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
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Free Paint Tools Promo Banner */}
      <section className="py-16 bg-gradient-to-br from-amber-50 to-amber-100 border-y border-amber-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-10">
            <div className="flex-1 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-amber-400/20 border border-amber-300 px-4 py-1.5 rounded-full mb-4">
                <Gift size={14} className="text-amber-600" />
                <span className="text-amber-700 text-xs font-bold uppercase tracking-widest">Exclusive Offer</span>
              </div>
              <h2 className="font-heading text-3xl md:text-4xl font-black text-navy mb-4 leading-tight">
                Get Paint Tools <span className="text-amber-500 italic">Absolutely Free</span>
              </h2>
              <p className="text-gray-600 text-lg mb-6 max-w-lg">
                Choose the <span className="font-bold text-navy">"Without Labour"</span> option on any paint product and claim professional paint tools as complimentary gifts.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                <div className="flex items-center gap-2 text-sm font-semibold text-amber-700 bg-amber-100 border border-amber-200 px-4 py-2 rounded-xl">
                  <CheckCircle size={16} className="text-amber-500" />
                  No Service Charges
                </div>
                <div className="flex items-center gap-2 text-sm font-semibold text-amber-700 bg-amber-100 border border-amber-200 px-4 py-2 rounded-xl">
                  <Gift size={16} className="text-amber-500" />
                  Free Tools Included
                </div>
              </div>
            </div>

            <div className="flex-1 bg-white border border-amber-200 rounded-2xl p-6 shadow-lg shadow-amber-100 max-w-md w-full">
              <h3 className="font-bold text-navy text-base mb-4 flex items-center gap-2">
                How it Works
              </h3>
              {[
                { step: '1', text: 'Browse any paint product' },
                { step: '2', text: 'Select "Without Labour" option' },
                { step: '3', text: 'Add paint to cart' },
                { step: '4', text: 'Claim free tools from the Savings Pack!' }
              ].map(({ step, text }) => (
                <div key={step} className="flex items-center gap-3 py-2.5 border-b border-amber-50 last:border-0">
                  <div className="w-7 h-7 rounded-full bg-amber-400 text-white font-black text-xs flex items-center justify-center shrink-0">{step}</div>
                  <span className="text-sm font-medium text-gray-700">{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Paint Calculator Section */}
      <section id="calculator" className="py-20 bg-white">
        <PaintCalculator />
      </section>

      {/* Testimonials Section */}
      <TestimonialSlider />

      {/* Review Submission Section */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <ReviewForm />
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-off-white">
        <FAQ />
      </section>
    </div>
  );
}
