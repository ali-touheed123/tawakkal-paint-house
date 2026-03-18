'use client';

import { ProductCard } from '@/components/ProductCard';
import { Product, BRANDS, BRAND_LOGOS } from '@/types';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';
import { BulkInquiry } from '@/components/BulkInquiry';

// Removed hardcoded constraints and constants


const categoryInfo: Record<string, { title: string; description: string; hero: string }> = {
  decorative: {
    title: 'Decorative Paints',
    description: 'Premium interior & exterior wall paints for homes & offices',
    hero: '/images/categories/decorative.jpg'
  },
  industrial: {
    title: 'Industrial Paints',
    description: 'Heavy-duty protective coatings for industrial applications',
    hero: '/images/categories/industrial.jpg'
  },
  auto: {
    title: 'Automotive Paints',
    description: 'Professional automotive & vehicle refinishing paints',
    hero: '/images/categories/auto.jpg'
  },
  projects: {
    title: 'Bulk Projects',
    description: 'Bulk supply for construction projects at competitive prices',
    hero: '/images/categories/projects.jpg'
  }
};

export function CategoryView({ initialCategory }: { initialCategory: string }) {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const category = (params.slug as string) || initialCategory;
  const heroRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });

  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBrand, setSelectedBrand] = useState(searchParams.get('brand') || 'all');
  const [selectedSub, setSelectedSub] = useState(searchParams.get('sub') || 'all');
  const [categoryDetails, setCategoryDetails] = useState<any | null>(null);
  const [dynamicBrands, setDynamicBrands] = useState<any[]>([]);
  const [dynamicSubs, setDynamicSubs] = useState<any[]>([]);

  useEffect(() => {
    async function fetchCategoryData() {
      const supabase = createClient();

      // 1. Fetch Category Details
      const { data: catData } = await supabase
        .from('categories')
        .select('*')
        .eq('slug', category)
        .single();

      if (catData) {
        setCategoryDetails({
          ...catData,
          title: catData.name,
          hero: catData.image_url || '/images/categories/decorative.jpg'
        });

        // 2. Fetch Associated Brands
        const { data: associations } = await supabase
          .from('category_brands')
          .select('brand_id')
          .eq('category_id', catData.id);

        if (associations && associations.length > 0) {
          const brandIds = associations.map(a => a.brand_id);
          const { data: brandsRes } = await supabase
            .from('brands')
            .select('*')
            .in('id', brandIds)
            .eq('is_active', true)
            .order('name');
          if (brandsRes) setDynamicBrands(brandsRes);
        } else {
          setDynamicBrands([]);
        }

        // 3. Fetch Sub-categories
        const { data: subsRes } = await supabase
          .from('sub_categories')
          .select('*')
          .eq('category_id', catData.id)
          .eq('is_active', true)
          .order('name');
        if (subsRes) setDynamicSubs(subsRes);
      }
    }
    fetchCategoryData();
  }, [category]);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const supabase = createClient();
        let supabaseQuery = supabase.from('products').select('*').eq('category', category);

        if (selectedBrand && selectedBrand !== 'all') {
          const exactBrand = dynamicBrands.find(b =>
            b.name.toLowerCase().replace(/['\s\.]/g, '') === selectedBrand.toLowerCase().replace(/['\s\.]/g, '')
          );
          supabaseQuery = supabaseQuery.eq('brand', exactBrand?.name || selectedBrand);
        }

        if (selectedSub && selectedSub !== 'all') {
          supabaseQuery = supabaseQuery.eq('sub_category', selectedSub);
        }

        const { data } = await supabaseQuery;
        if (data) setProducts(data as Product[]);
      } catch (err) {
        console.error('Fetch error:', err);
      }
      setLoading(false);
    };

    fetchProducts();
  }, [category, selectedBrand, selectedSub]);

  const handleBrandChange = (brand: string) => {
    setSelectedBrand(brand);
    const params = new URLSearchParams(searchParams.toString());
    if (brand === 'all') {
      params.delete('brand');
    } else {
      params.set('brand', brand);
    }
    router.push(`/category/${category}?${params.toString()}`);
  };

  const handleSubChange = (sub: string) => {
    setSelectedSub(sub);
    const params = new URLSearchParams(searchParams.toString());
    if (sub === 'all') {
      params.delete('sub');
    } else {
      params.set('sub', sub);
    }
    router.push(`/category/${category}?${params.toString()}`);
  };

  const info = categoryDetails || categoryInfo.decorative;

  return (
    <div className="min-h-screen overflow-x-hidden">
      {/* Hero */}
      <section ref={heroRef} className="relative h-[40vh] xs:h-[50vh] flex items-center overflow-hidden">
        <motion.div
          style={{ y: heroY, scale: heroScale }}
          className="absolute inset-0"
        >
          <img
            src={info.hero}
            alt={`${info.title} - Tawakkal Paint House Karachi`}
            className="w-full h-full object-cover"
          />
          <motion.div
            style={{ opacity: useTransform(scrollYProgress, [0, 0.5], [0.8, 0.95]) }}
            className="absolute inset-0 bg-navy"
          />
        </motion.div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <motion.div
            style={{ opacity: heroOpacity }}
            className="text-center"
          >
            <div className="overflow-hidden mb-4">
              <motion.h1
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className="font-heading text-4xl xs:text-5xl md:text-6xl font-black text-white"
              >
                {info.title}
              </motion.h1>
            </div>
            <div className="overflow-hidden">
              <motion.p
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                className="text-gray-300 text-sm xs:text-xl max-w-2xl mx-auto font-medium"
              >
                {info.description}
              </motion.p>
            </div>
          </motion.div>
        </div>


      </section>

      {/* Filters */}
      <section className="relative z-30 bg-white shadow-md border-b border-gold/10">
        <div className="max-w-7xl mx-auto px-3 xs:px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex flex-col gap-4">
            {/* Brand Filter */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-2"
            >
              <h3 className="text-[10px] font-bold text-navy/30 uppercase tracking-[0.2em] pl-1">Brands</h3>
              <div className="flex overflow-x-auto pb-3 -mx-3 xs:-mx-4 px-3 xs:px-4 sm:mx-0 sm:px-0 scrollbar-hide snap-x gap-2 xs:gap-2.5">
                <button
                  onClick={() => handleBrandChange('all')}
                  className={`snap-start shrink-0 h-10 xs:h-12 px-4 xs:px-6 rounded-xl text-xs xs:text-sm font-bold transition-all border-2 flex items-center justify-center whitespace-nowrap ${selectedBrand === 'all'
                    ? 'bg-gold border-gold text-navy shadow-lg shadow-gold/20 scale-105'
                    : 'bg-white border-gray-100 text-gray-400 hover:border-gold/30 hover:text-gold'
                    }`}
                >
                  All Brands
                </button>
                {dynamicBrands.map((brand, i) => {
                  const brandValue = brand.name.toLowerCase().replace(/['\s]/g, '');
                  const isActive = selectedBrand === brandValue;

                  return (
                    <motion.button
                      key={brand.id}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.05 }}
                      onClick={() => handleBrandChange(brandValue)}
                      className={`snap-start shrink-0 h-10 xs:h-12 w-20 xs:w-24 px-2 xs:px-3 rounded-xl border-2 transition-all flex items-center justify-center bg-white ${isActive
                        ? 'border-gold shadow-lg shadow-gold/10 scale-105 z-10'
                        : 'border-gray-100 hover:border-gold/30 grayscale opacity-60 hover:grayscale-0 hover:opacity-100'
                        }`}
                      title={brand.name}
                    >
                      {brand.logo_url ? (
                        <img
                          src={brand.logo_url}
                          alt={brand.name}
                          className={`h-full w-auto object-contain pointer-events-none p-1.5 xs:p-2`}
                        />
                      ) : (
                        <span className="text-[10px] xs:text-xs font-black text-navy uppercase text-center px-1">
                          {brand.name}
                        </span>
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>

            {/* Sub-category Filter */}
            {dynamicSubs.length > 0 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="space-y-2"
              >
                <h3 className="text-[10px] font-bold text-navy/30 uppercase tracking-[0.2em] pl-1">Categories</h3>
                <div className="flex overflow-x-auto pb-1 -mx-3 xs:-mx-4 px-3 xs:px-4 sm:mx-0 sm:px-0 scrollbar-hide snap-x gap-2">
                  <button
                    onClick={() => handleSubChange('all')}
                    className={`snap-start shrink-0 px-4 xs:px-5 py-2 xs:py-2.5 rounded-xl text-xs xs:text-sm font-bold whitespace-nowrap transition-all border-2 ${selectedSub === 'all'
                      ? 'bg-navy border-navy text-white shadow-lg shadow-navy/20'
                      : 'bg-white border-gray-100 text-gray-500 hover:border-navy/30 hover:text-navy'
                      }`}
                  >
                    All
                  </button>
                  {dynamicSubs.map((sub, i) => (
                    <motion.button
                      key={sub.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      onClick={() => handleSubChange(sub.slug)}
                      className={`snap-start shrink-0 px-4 xs:px-5 py-2 xs:py-2.5 rounded-xl text-xs xs:text-sm font-bold whitespace-nowrap transition-all border-2 ${selectedSub === sub.slug
                        ? 'bg-navy border-navy text-white shadow-lg shadow-navy/20'
                        : 'bg-white border-gray-100 text-gray-500 hover:border-navy/30 hover:text-navy'
                        }`}
                    >
                      {sub.name}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}

          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-12 bg-off-white min-h-[50vh]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-5 gap-3 sm:gap-4"
              >
                {[...Array(10)].map((_, i) => (
                  <div key={i} className="bg-white rounded-xl h-80 animate-pulse border border-gray-100" />
                ))}
              </motion.div>
            ) : products.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-20"
              >
                <p className="text-gray-500 text-lg">No products found matching your criteria.</p>
                <button
                  onClick={() => {
                    handleBrandChange('all');
                    handleSubChange('all');
                  }}
                  className="mt-4 text-gold hover:underline font-bold"
                >
                  Clear Filters
                </button>
              </motion.div>
            ) : (
              <motion.div
                key="grid"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-5 gap-3 sm:gap-4 relative"
              >
                {products.map((product, k) => (
                  <ProductCard key={product.id} product={product} index={k} />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Bulk Inquiry Lead Capture */}
      <BulkInquiry />
    </div>
  );
}
