'use client';

import { useState, useEffect } from 'react';
import { Product } from '@/types';
import { ProductCard } from './ProductCard';
import { motion } from 'framer-motion';

export function RecentlyViewed() {
    const [recentProducts, setRecentProducts] = useState<Product[]>([]);

    useEffect(() => {
        const stored = localStorage.getItem('recently_viewed');
        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                // Filter out any duplicates and limit to 4
                setRecentProducts(parsed.slice(0, 4));
            } catch (e) {
                console.error("Failed to parse recently viewed products", e);
            }
        }
    }, []);

    if (recentProducts.length === 0) return null;

    return (
        <section className="py-16 border-t border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between mb-8">
                    <motion.h2 
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        className="text-2xl font-heading font-bold text-navy"
                    >
                        Recently Viewed
                    </motion.h2>
                    <button 
                        onClick={() => {
                            localStorage.removeItem('recently_viewed');
                            setRecentProducts([]);
                        }}
                        className="text-xs font-bold text-gray-400 hover:text-red-500 transition-colors uppercase tracking-widest"
                    >
                        Clear History
                    </button>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {recentProducts.map((product, i) => (
                        <ProductCard key={product.id} product={product} index={i} />
                    ))}
                </div>
            </div>
        </section>
    );
}

export function trackProductView(product: Product) {
    if (typeof window === 'undefined') return;
    
    const stored = localStorage.getItem('recently_viewed');
    let recent: Product[] = [];
    
    if (stored) {
        try {
            recent = JSON.parse(stored);
        } catch (e) {}
    }
    
    // Remove if already exists and add to front
    recent = recent.filter(p => p.id !== product.id);
    recent.unshift(product);
    
    // Limit to 8 products
    localStorage.setItem('recently_viewed', JSON.stringify(recent.slice(0, 8)));
}
