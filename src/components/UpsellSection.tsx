'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Sparkles, ArrowRight, Wrench } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useCartStore } from '@/lib/store';
import type { Product } from '@/types';
import Link from 'next/link';

interface UpsellSectionProps {
    labourMode: 'with' | 'without';
    upsellItemIds: string[];
    currentProductId: string;
}

export function UpsellSection({ labourMode, upsellItemIds, currentProductId }: UpsellSectionProps) {
    const [upsellProducts, setUpsellProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [addingId, setAddingId] = useState<string | null>(null);
    const sectionRef = useRef<HTMLDivElement>(null);
    const hasScrolled = useRef(false);
    const { addItem } = useCartStore();

    useEffect(() => {
        async function fetchUpsell() {
            const supabase = createClient();
            let query = supabase.from('products').select('*').eq('in_stock', true).neq('id', currentProductId);

            if (upsellItemIds.length > 0) {
                // Show admin-configured upsell items
                query = query.in('id', upsellItemIds).limit(4);
            } else {
                // Fallback: show paint tools / brushes / related items
                query = query
                    .or('category.eq.projects,sub_category.ilike.%tool%,sub_category.ilike.%brush%')
                    .limit(4);
            }

            const { data } = await query;
            if (data && data.length > 0) {
                setUpsellProducts(data);
            } else {
                // Second fallback: any 4 products
                const { data: anyProducts } = await supabase
                    .from('products')
                    .select('*')
                    .eq('in_stock', true)
                    .neq('id', currentProductId)
                    .limit(4);
                setUpsellProducts(anyProducts || []);
            }
            setLoading(false);
        }
        fetchUpsell();
    }, [upsellItemIds, currentProductId]);

    // Auto-scroll into view when Without Labour is selected (only once per page load)
    useEffect(() => {
        if (labourMode === 'without' && !hasScrolled.current && sectionRef.current && upsellProducts.length > 0) {
            hasScrolled.current = true;
            setTimeout(() => {
                sectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }, 400);
        }
        if (labourMode === 'with') {
            hasScrolled.current = false;
        }
    }, [labourMode, upsellProducts.length]);

    const handleAddToCart = (product: Product) => {
        const firstUnit = product.units?.[0];
        if (!firstUnit) return;
        setAddingId(product.id);
        addItem(product.id, firstUnit.label, 1, product, undefined, 'with', 0);
        setTimeout(() => setAddingId(null), 800);
    };

    const getItemPrice = (product: Product) => {
        const unit = product.units?.[0];
        return unit?.price || 0;
    };

    const isHighlighted = labourMode === 'without';

    return (
        <motion.div
            ref={sectionRef}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className={`mt-12 rounded-2xl border-2 transition-all duration-500 overflow-hidden ${
                isHighlighted
                    ? 'border-amber-300 shadow-[0_0_30px_rgba(251,191,36,0.25)] bg-amber-50/40'
                    : 'border-gray-100 bg-gray-50/50'
            }`}
        >
            {/* Header */}
            <div className={`px-6 py-5 border-b transition-all duration-500 ${
                isHighlighted ? 'border-amber-200 bg-amber-50' : 'border-gray-100 bg-white'
            }`}>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-500 ${
                            isHighlighted ? 'bg-amber-400 text-white' : 'bg-navy/10 text-navy'
                        }`}>
                            {isHighlighted ? <Sparkles size={18} /> : <Wrench size={18} />}
                        </div>
                        <div>
                            <h3 className={`font-heading font-bold text-base transition-colors duration-500 ${
                                isHighlighted ? 'text-amber-800' : 'text-navy'
                            }`}>
                                Recommended Tools for Best Results
                            </h3>
                            <AnimatePresence mode="wait">
                                {isHighlighted ? (
                                    <motion.p
                                        key="without"
                                        initial={{ opacity: 0, y: -4 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 4 }}
                                        className="text-xs text-amber-600 font-medium mt-0.5"
                                    >
                                        ✦ Recommended when you choose no labour
                                    </motion.p>
                                ) : (
                                    <motion.p
                                        key="with"
                                        initial={{ opacity: 0, y: -4 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 4 }}
                                        className="text-xs text-gray-400 mt-0.5"
                                    >
                                        Add these tools to your order
                                    </motion.p>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                    {isHighlighted && (
                        <motion.span
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="text-[9px] font-black uppercase tracking-widest px-2 py-1 bg-amber-400 text-white rounded-full"
                        >
                            DIY Tools
                        </motion.span>
                    )}
                </div>
            </div>

            {/* Products Grid */}
            <div className="p-4">
                {loading ? (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="bg-white rounded-xl p-3 animate-pulse h-44" />
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {upsellProducts.map((product, idx) => (
                            <motion.div
                                key={product.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.08 }}
                                className={`bg-white rounded-xl p-3 flex flex-col items-center gap-2 border-2 transition-all duration-300 group hover:shadow-lg hover:-translate-y-1 ${
                                    isHighlighted
                                        ? 'border-amber-100 hover:border-amber-300'
                                        : 'border-gray-50 hover:border-gold/30'
                                }`}
                            >
                                {/* Image */}
                                <Link href={`/product/${product.id}`} className="w-full">
                                    <div className="w-full aspect-square bg-gray-50 rounded-lg overflow-hidden flex items-center justify-center">
                                        <img
                                            src={product.image_url || 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200'}
                                            alt={product.name}
                                            className="w-full h-full object-contain p-1 group-hover:scale-105 transition-transform duration-300"
                                        />
                                    </div>
                                </Link>

                                {/* Info */}
                                <div className="w-full text-center">
                                    <p className="text-[9px] text-gold font-bold uppercase tracking-widest">{product.brand}</p>
                                    <Link href={`/product/${product.id}`}>
                                        <p className="text-xs font-semibold text-navy leading-tight line-clamp-2 hover:text-gold transition-colors">
                                            {product.name}
                                        </p>
                                    </Link>
                                    <p className="text-sm font-bold text-navy mt-1">
                                        Rs. {getItemPrice(product).toLocaleString()}
                                    </p>
                                </div>

                                {/* Add to Cart */}
                                <button
                                    onClick={() => handleAddToCart(product)}
                                    disabled={addingId === product.id}
                                    className={`w-full py-1.5 rounded-lg text-[10px] font-bold flex items-center justify-center gap-1 transition-all active:scale-95 ${
                                        addingId === product.id
                                            ? 'bg-green-500 text-white'
                                            : isHighlighted
                                            ? 'bg-amber-400 text-white hover:bg-amber-500'
                                            : 'bg-navy text-white hover:bg-gold hover:text-navy'
                                    }`}
                                >
                                    <ShoppingCart size={12} />
                                    {addingId === product.id ? 'Added!' : 'Add to Cart'}
                                </button>
                            </motion.div>
                        ))}
                    </div>
                )}

                {/* See More Button */}
                <div className="mt-4 flex justify-center">
                    <Link
                        href="/category/decorative"
                        className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold transition-all ${
                            isHighlighted
                                ? 'bg-amber-400/20 text-amber-700 hover:bg-amber-400/40 border border-amber-300'
                                : 'bg-gray-100 text-navy hover:bg-gray-200 border border-gray-200'
                        }`}
                    >
                        See More Items <ArrowRight size={14} />
                    </Link>
                </div>
            </div>
        </motion.div>
    );
}
