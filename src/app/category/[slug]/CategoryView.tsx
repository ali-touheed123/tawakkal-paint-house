'use client';

import { ProductCard } from '@/components/ProductCard';
import { Product, BRANDS, BRAND_LOGOS } from '@/types';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';
import { BulkInquiry } from '@/components/BulkInquiry';

const subCategories = [
  { id: 'all', label: 'All' },
  { id: 'interior', label: 'Interior' },
  { id: 'exterior', label: 'Exterior' },
  { id: 'wood_metal', label: 'Wood & Metal' },
  { id: 'primers_fillers', label: 'Primers & Fillers' },
  { id: 'waterproofing', label: 'Waterproofing' },
  { id: 'accessories', label: 'Accessories' }
];


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
  const [selectedFinish, setSelectedFinish] = useState('All');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 50000]);
  const [maxPrice, setMaxPrice] = useState(50000);
  const [categoryDetails, setCategoryDetails] = useState<{ title: string; description: string; hero: string } | null>(null);

  useEffect(() => {
    // Determine the max price in the current category to set slider limits
    async function fetchMaxPrice() {
      const supabase = createClient();
      const { data } = await supabase
        .from('products')
        .select('price_gallon')
        .eq('category', category)
        .order('price_gallon', { ascending: false })
        .limit(1);
      
      if (data && data.length > 0) {
        const foundMax = Math.ceil(Number(data[0].price_gallon) || 50000);
        setMaxPrice(foundMax);
        setPriceRange([0, foundMax]);
      }
    }
    fetchMaxPrice();
  }, [category]);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const supabase = createClient();
        let supabaseQuery = supabase.from('products').select('*').eq('category', category);

        if (selectedBrand && selectedBrand !== 'all') {
          const exactBrand = BRANDS.find(b => 
            b.toLowerCase().replace(/['\s\.]/g, '') === selectedBrand.toLowerCase().replace(/['\s\.]/g, '')
          );
          supabaseQuery = supabaseQuery.eq('brand', exactBrand || selectedBrand);
        }

        if (selectedSub && selectedSub !== 'all') {
          supabaseQuery = supabaseQuery.eq('sub_category', selectedSub);
        }

        // Apply price filter (using price_gallon as the standard comparison price)
        supabaseQuery = supabaseQuery.gte('price_gallon', priceRange[0]).lte('price_gallon', priceRange[1]);

        const { data } = await supabaseQuery;
        if (data) {
          let filtered = data as Product[];
          
          // Apply finish filter (fuzzy)
          if (selectedFinish !== 'All') {
            filtered = filtered.filter(p => 
              p.name.toLowerCase().includes(selectedFinish.toLowerCase()) || 
              p.description?.toLowerCase().includes(selectedFinish.toLowerCase())
            );
          }
          
          setProducts(filtered);
        }
      } catch (err) {
        console.error('Fetch error:', err);
      }
      setLoading(false);
    };

    fetchProducts();
  }, [category, selectedBrand, selectedSub, priceRange, selectedFinish]);

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
        
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          style={{ opacity: heroOpacity }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="text-[10px] text-white/30 uppercase tracking-[0.3em] font-bold">Scroll</span>
          <div className="w-[1px] h-12 bg-gradient-to-b from-gold to-transparent" />
        </motion.div>
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
                {BRANDS.map((brand, i) => {
                  const logoUrl = BRAND_LOGOS[brand];
                  const brandValue = brand.toLowerCase().replace(/['\s]/g, '');
                  const isActive = selectedBrand === brandValue;

                  return (
                    <motion.button
                      key={brand}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.05 }}
                      onClick={() => handleBrandChange(brandValue)}
                      className={`snap-start shrink-0 h-10 xs:h-12 w-20 xs:w-24 px-2 xs:px-3 rounded-xl border-2 transition-all flex items-center justify-center bg-white ${isActive
                        ? 'border-gold shadow-lg shadow-gold/10 scale-105 z-10'
                        : 'border-gray-100 hover:border-gold/30 grayscale opacity-60 hover:grayscale-0 hover:opacity-100'
                        }`}
                      title={brand}
                    >
                      {logoUrl ? (
                        <img
                          src={logoUrl}
                          alt={brand}
                          className={`h-full w-auto object-contain pointer-events-none p-1.5 xs:p-2 ${brand === 'Dior' || brand === 'Rozzilac' ? 'scale-110' : ''}`}
                        />
                      ) : (
                        <span className="text-[10px] xs:text-sm font-bold text-navy/60">{brand}</span>
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>

            {/* Sub-category Filter */}
            {category === 'decorative' && (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="space-y-2"
              >
                <h3 className="text-[10px] font-bold text-navy/30 uppercase tracking-[0.2em] pl-1">Categories</h3>
                <div className="flex overflow-x-auto pb-1 -mx-3 xs:-mx-4 px-3 xs:px-4 sm:mx-0 sm:px-0 scrollbar-hide snap-x gap-2">
                  {subCategories.map((sub, i) => (
                    <motion.button
                      key={sub.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      onClick={() => handleSubChange(sub.id)}
                      className={`snap-start shrink-0 px-4 xs:px-5 py-2 xs:py-2.5 rounded-xl text-xs xs:text-sm font-bold whitespace-nowrap transition-all border-2 ${selectedSub === sub.id
                        ? 'bg-navy border-navy text-white shadow-lg shadow-navy/20'
                        : 'bg-white border-gray-100 text-gray-500 hover:border-navy/30 hover:text-navy'
                        }`}
                    >
                      {sub.label}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Advanced Filters: Price & Finish */}
            <div className="grid md:grid-cols-2 gap-8 pt-4 border-t border-gray-50 mt-2">
              {/* Price Range */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-[10px] font-bold text-navy/30 uppercase tracking-[0.2em]">Price Range</h3>
                  <p className="text-xs font-bold text-navy">
                    Rs. {priceRange[0].toLocaleString()} — Rs. {priceRange[1].toLocaleString()}
                  </p>
                </div>
                <div className="relative h-2 bg-gray-100 rounded-full group">
                  <input
                    type="range"
                    min="0"
                    max={maxPrice}
                    step="500"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                    className="absolute inset-0 w-full h-full appearance-none bg-transparent cursor-pointer z-20 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:bg-gold [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-4 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow-lg"
                  />
                  <div 
                    className="absolute inset-y-0 left-0 bg-gold rounded-full transition-all duration-300"
                    style={{ width: `${(priceRange[1] / maxPrice) * 100}%` }}
                  />
                </div>
              </div>

              {/* Finish Filter (Only for relevant categories) */}
              {['decorative', 'industrial', 'auto'].includes(category) && (
                <div className="space-y-3">
                  <h3 className="text-[10px] font-bold text-navy/30 uppercase tracking-[0.2em]">Surface Finish</h3>
                  <div className="flex flex-wrap gap-2">
                    {['All', 'Matt', 'Gloss', 'Silk', 'Semi-Gloss', 'Textured'].map((finish) => (
                      <button
                        key={finish}
                        onClick={() => setSelectedFinish(finish)}
                        className={`px-3 py-1.5 rounded-full border text-[10px] font-bold uppercase tracking-wider transition-all ${
                          selectedFinish === finish 
                            ? 'bg-gold border-gold text-navy shadow-md shadow-gold/20' 
                            : 'border-gray-100 text-gray-400 hover:border-gold hover:text-gold'
                        }`}
                      >
                        {finish}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
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
