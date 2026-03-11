'use client';

import { useEffect, useState } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ProductCard } from '@/components/ProductCard';
import { createClient } from '@/lib/supabase/client';
import { Product, BRANDS, BRAND_LOGOS } from '@/types';

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

export default function CategoryPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const category = params.slug as string;

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBrand, setSelectedBrand] = useState(searchParams.get('brand') || 'all');
  const [selectedSub, setSelectedSub] = useState(searchParams.get('sub') || 'all');

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const supabase = createClient();
        console.log('Fetching products for category:', category, 'brand:', selectedBrand);

        let supabaseQuery = supabase.from('products').select('*').eq('category', category);

        if (selectedBrand && selectedBrand !== 'all') {
          const exactBrand = BRANDS.find(b =>
            b.toLowerCase().replace(/['\s]/g, '') === selectedBrand.toLowerCase().replace(/['\s]/g, '')
          );
          console.log('Filtering by brand:', exactBrand || selectedBrand);
          supabaseQuery = supabaseQuery.eq('brand', exactBrand || selectedBrand);
        }

        if (selectedSub && selectedSub !== 'all') {
          console.log('Filtering by sub-category:', selectedSub);
          supabaseQuery = supabaseQuery.eq('sub_category', selectedSub);
        }

        const { data, error } = await supabaseQuery;
        console.log('Query result products count:', data?.length, 'Error:', error);
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

  const info = categoryInfo[category] || categoryInfo.decorative;

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative h-[40vh] flex items-center">
        <div className="absolute inset-0">
          <img
            src={info.hero}
            alt={info.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-navy/80" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-white mb-4">
              {info.title}
            </h1>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              {info.description}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filters */}
      <section className="z-30 bg-white shadow-md border-b border-gold/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex flex-col gap-4">
            {/* Brand Filter */}
            <div className="space-y-2">
              <h3 className="text-[10px] font-bold text-navy/30 uppercase tracking-[0.2em] pl-1">Filter by Brand</h3>
              <div className="flex overflow-x-auto pb-3 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-hide snap-x gap-2.5">
                <button
                  onClick={() => handleBrandChange('all')}
                  className={`snap-start shrink-0 h-12 px-6 rounded-xl text-sm font-semibold transition-all border-2 flex items-center justify-center ${selectedBrand === 'all'
                    ? 'bg-gold border-gold text-navy shadow-lg shadow-gold/20 scale-105'
                    : 'bg-white border-gray-100 text-gray-400 hover:border-gold/30 hover:text-gold'
                    }`}
                >
                  All Brands
                </button>
                {BRANDS.map((brand) => {
                  const logoUrl = BRAND_LOGOS[brand];
                  const isActive = selectedBrand === brand.toLowerCase().replace("'", '');

                  return (
                    <button
                      key={brand}
                      onClick={() => handleBrandChange(brand.toLowerCase().replace("'", ''))}
                      className={`snap-start shrink-0 h-12 w-24 px-3 rounded-xl border-2 transition-all flex items-center justify-center bg-white ${isActive
                        ? 'border-gold shadow-lg shadow-gold/10 scale-105 z-10'
                        : 'border-gray-100 hover:border-gold/30 grayscale opacity-60 hover:grayscale-0 hover:opacity-100'
                        }`}
                      title={brand}
                    >
                      {logoUrl ? (
                        <img
                          src={logoUrl}
                          alt={brand}
                          className={`h-full w-auto object-contain pointer-events-none p-2 ${brand === 'Dior' ? 'scale-110' : ''}`}
                        />
                      ) : (
                        <span className="text-sm font-bold text-navy/60">{brand}</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Sub-category Filter - Only for Decorative */}
            {category === 'decorative' && (
              <div className="space-y-2">
                <h3 className="text-[10px] font-bold text-navy/30 uppercase tracking-[0.2em] pl-1">Filter by Category</h3>
                <div className="flex overflow-x-auto pb-1 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-hide snap-x gap-2">
                  {subCategories.map((sub) => (
                    <button
                      key={sub.id}
                      onClick={() => handleSubChange(sub.id)}
                      className={`snap-start shrink-0 px-5 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all border-2 ${selectedSub === sub.id
                        ? 'bg-navy border-navy text-white shadow-lg shadow-navy/20'
                        : 'bg-white border-gray-100 text-gray-500 hover:border-navy/30 hover:text-navy'
                        }`}
                    >
                      {sub.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-12 bg-off-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-5 gap-3 sm:gap-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl h-80 animate-pulse" />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-500 text-lg">No products found matching your criteria.</p>
              <button
                onClick={() => {
                  setSelectedBrand('all');
                  setSelectedSub('all');
                }}
                className="mt-4 text-gold hover:underline"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-5 gap-3 sm:gap-4">
              {products.map((product, i) => (
                <ProductCard key={product.id} product={product} index={i} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
