'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search as SearchIcon, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useUIStore } from '@/lib/store';
import { createClient } from '@/lib/supabase/client';
import { Product } from '@/types';

export function SearchOverlay() {
  const pathname = usePathname();
  const { isSearchOpen, setSearchOpen } = useUIStore();

  // Hide search overlay on admin dashboard
  if (pathname?.startsWith('/admin-7392-dashboard')) return null;
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSearchOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isSearchOpen]);

  useEffect(() => {
    if (isSearchOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isSearchOpen]);

  useEffect(() => {
    const searchProducts = async () => {
      if (query.length < 2) {
        setResults([]);
        return;
      }

      setLoading(true);
      const supabase = createClient();
      const { data } = await supabase
        .from('products')
        .select('*')
        .ilike('name', `%${query}%`)
        .limit(20);
      
      if (data) setResults(data as Product[]);
      setLoading(false);
    };

    const debounce = setTimeout(searchProducts, 300);
    return () => clearTimeout(debounce);
  }, [query]);

  return (
    <AnimatePresence>
      {isSearchOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-navy/95 backdrop-blur-lg overflow-y-auto pb-20"
        >
          <div className="max-w-4xl mx-auto px-4 pt-24">
            <div className="relative">
              <SearchIcon className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400" size={24} />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search for paints, brands, colors..."
                className="w-full pl-16 pr-16 py-6 bg-white/10 border-2 border-gold/30 rounded-2xl text-white text-xl placeholder-gray-400 focus:border-gold focus:outline-none"
              />
              <button
                onClick={() => {
                  setSearchOpen(false);
                  setQuery('');
                }}
                className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {results.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-8 space-y-2"
              >
                {results.map((product) => (
                  <Link
                    key={product.id}
                    href={`/product/${product.id}`}
                    onClick={() => {
                      setSearchOpen(false);
                      setQuery('');
                    }}
                    className="flex items-center gap-4 p-4 bg-white/10 rounded-xl hover:bg-white/20 transition-colors"
                  >
                    <img
                      src={product.image_url || 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=100'}
                      alt={product.name}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-gold text-xs uppercase">{product.brand}</p>
                      <p className="text-white font-medium truncate">{product.name}</p>
                    </div>
                    <p className="text-gold font-semibold">
                      Rs. {product.units?.[0]?.price?.toLocaleString() || 'N/A'}
                    </p>
                  </Link>
                ))}
              </motion.div>
            )}

            {query.length >= 2 && results.length === 0 && !loading && (
              <div className="mt-8 text-center text-gray-400">
                No products found for &quot;{query}&quot;
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
