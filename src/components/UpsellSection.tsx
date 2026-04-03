'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Sparkles, ArrowRight, Wrench, Gift, Lock, Minus, Plus } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useCartStore } from '@/lib/store';
import type { Product } from '@/types';
import Link from 'next/link';
import Image from 'next/image';

interface UpsellSectionProps {
    labourMode: 'with' | 'without';
    upsellItemIds: string[];
    currentProductId: string;
}

function UpsellCard({ product, idx, isSavingMode, remaining, addItem, addGiftItem, items }: {
    product: Product;
    idx: number;
    isSavingMode: boolean;
    remaining: number;
    addItem: any;
    addGiftItem: any;
    items: any[];
}) {
    const [quantity, setQuantity] = useState(1);
    const [claimingId, setClaimingId] = useState<string | null>(null);
    const [rejectedId, setRejectedId] = useState<string | null>(null);

    const firstUnit = product.units?.[0];
    const price = firstUnit?.price || 0;
    const totalPrice = price * quantity;

    const alreadyClaimed = items.some(i => i.product_id === product.id && i.isGift);
    const limitReached = isSavingMode && totalPrice > remaining && !alreadyClaimed;
    const isClaiming = claimingId === product.id;
    const isRejected = rejectedId === product.id;

    const handleClaimGift = () => {
        if (!firstUnit) return;
        setClaimingId(product.id);
        const success = addGiftItem(product.id, firstUnit.label, quantity, product, price);
        if (!success) {
            setRejectedId(product.id);
            setTimeout(() => setRejectedId(null), 1200);
        }
        setTimeout(() => setClaimingId(null), 800);
    };

    const handleAddToCart = () => {
        if (!firstUnit) return;
        addItem(product.id, firstUnit.label, quantity, product, undefined, 'with', 0);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.08 }}
            className={`bg-white rounded-xl p-3 flex flex-col items-center gap-2 border-2 transition-all duration-300 group hover:shadow-lg hover:-translate-y-1 ${alreadyClaimed
                ? 'border-green-300 bg-green-50/50'
                : isSavingMode
                    ? 'border-amber-100 hover:border-amber-300'
                    : 'border-gray-50 hover:border-gold/30'
                }`}
        >
            {/* Gift Badge */}
            {alreadyClaimed && (
                <div className="w-full flex justify-center -mb-1">
                    <span className="text-[8px] font-black uppercase tracking-widest px-2 py-0.5 bg-green-500 text-white rounded-full">
                        ✓ In Pack
                    </span>
                </div>
            )}

            {/* Image */}
            <div className="w-full">
                <div className="w-full aspect-square bg-gray-50 rounded-lg overflow-hidden relative">
                    <Image
                        src={product.image_url || 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200'}
                        alt={product.name}
                        fill
                        className={`object-contain p-1 group-hover:scale-105 transition-transform duration-300 ${limitReached ? 'opacity-50' : ''}`}
                    />
                </div>
            </div>

            {/* Info */}
            <div className="w-full text-center">
                <p className="text-[9px] text-gold font-bold uppercase tracking-widest">{product.brand}</p>
                <div className="cursor-default">
                    <p className="text-xs font-semibold text-navy leading-tight line-clamp-2 min-h-[2rem]">
                        {product.name}
                    </p>
                </div>

                {/* Price — hidden in saving mode, shown normally otherwise */}
                {!isSavingMode && (
                    <p className="text-sm font-bold text-navy mt-1">
                        Rs. {price.toLocaleString()}
                    </p>
                )}
                {isSavingMode && (
                    <p className={`text-xs font-black mt-1 ${alreadyClaimed ? 'text-green-600' : limitReached ? 'text-red-400' : 'text-amber-600'}`}>
                        {alreadyClaimed ? 'INCLUDED' : limitReached ? 'LIMIT REACHED' : 'COMPLIMENTARY'}
                    </p>
                )}
            </div>

            {/* Quantity Selector — visible when not claimed */}
            {!alreadyClaimed && (
                <div className={`flex items-center gap-2 mt-1 bg-gray-50 p-1 rounded-lg justify-between border border-gray-100 w-full ${limitReached ? 'opacity-50 pointer-events-none' : ''}`}>
                    <button
                        onClick={(e) => { e.preventDefault(); setQuantity(q => Math.max(1, q - 1)); }}
                        className="w-6 h-6 rounded-md bg-white border border-gray-200 flex items-center justify-center text-navy hover:bg-amber-400 hover:border-amber-400 hover:text-white transition-all active:scale-90"
                    >
                        <Minus size={12} />
                    </button>
                    <span className="font-bold text-navy text-xs">{quantity}</span>
                    <button
                        onClick={(e) => { e.preventDefault(); setQuantity(q => q + 1); }}
                        className="w-6 h-6 rounded-md bg-white border border-gray-200 flex items-center justify-center text-navy hover:bg-amber-400 hover:border-amber-400 hover:text-white transition-all active:scale-90"
                    >
                        <Plus size={12} />
                    </button>
                </div>
            )}

            {/* Button */}
            {isSavingMode ? (
                <button
                    onClick={() => !alreadyClaimed && handleClaimGift()}
                    disabled={alreadyClaimed || limitReached || isClaiming}
                    className={`w-full py-1.5 rounded-lg text-[10px] font-bold flex items-center justify-center gap-1 transition-all active:scale-95 ${alreadyClaimed
                        ? 'bg-green-500 text-white cursor-default'
                        : limitReached || isRejected
                            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                            : isClaiming
                                ? 'bg-green-50 text-green-600 border border-green-200'
                                : 'bg-amber-400 text-white hover:bg-amber-500'
                        }`}
                >
                    {alreadyClaimed ? (
                        <><Gift size={11} /> Claimed!</>
                    ) : limitReached ? (
                        <><Lock size={11} /> Limit Reached</>
                    ) : isClaiming ? (
                        <>Added!</>
                    ) : (
                        <><Gift size={11} /> Claim Gift</>
                    )}
                </button>
            ) : (
                <button
                    onClick={() => handleAddToCart()}
                    className="w-full py-1.5 rounded-lg text-[10px] font-bold flex items-center justify-center gap-1 transition-all active:scale-95 bg-navy text-white hover:bg-gold hover:text-navy"
                >
                    <ShoppingCart size={12} />
                    Add to Cart
                </button>
            )}
        </motion.div>
    );
}

export function UpsellSection({ labourMode, upsellItemIds, currentProductId }: UpsellSectionProps) {
    const [upsellProducts, setUpsellProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [claimingId, setClaimingId] = useState<string | null>(null);
    const [rejectedId, setRejectedId] = useState<string | null>(null);
    const sectionRef = useRef<HTMLDivElement>(null);
    const hasScrolled = useRef(false);
    const isFirstRender = useRef(true);
    const { addItem, addGiftItem, items, getRemainingCredit, getSavingAllowance } = useCartStore();

    useEffect(() => {
        async function fetchUpsell() {
            const supabase = createClient();
            let query = supabase.from('products').select('*').eq('in_stock', true).neq('id', currentProductId);

            if (upsellItemIds.length > 0) {
                query = query.in('id', upsellItemIds).limit(4);
            } else {
                query = query.eq('category', 'paint-tools').limit(4);
            }

            const { data } = await query;
            if (data && data.length > 0) {
                setUpsellProducts(data);
            } else {
                setUpsellProducts([]);
            }
            setLoading(false);
        }
        fetchUpsell();
    }, [upsellItemIds, currentProductId]);

    // Auto-scroll into view when Without Labour is selected
    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        if (labourMode === 'without' && !hasScrolled.current && sectionRef.current && upsellProducts.length > 0) {
            hasScrolled.current = true;
            setTimeout(() => {
                sectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 400);
        }
        if (labourMode === 'with') {
            hasScrolled.current = false;
        }
    }, [labourMode, upsellProducts.length]);

    const getItemPrice = (product: Product) => {
        const unit = product.units?.[0];
        return unit?.price || 0;
    };

    const isAlreadyInCart = (productId: string) =>
        items.some(i => i.product_id === productId && i.isGift);

    const handleClaimGift = (product: Product) => {
        const firstUnit = product.units?.[0];
        if (!firstUnit) return;
        const price = firstUnit.price;
        setClaimingId(product.id);
        const success = addGiftItem(product.id, firstUnit.label, 1, product, price);
        if (!success) {
            setRejectedId(product.id);
            setTimeout(() => setRejectedId(null), 1200);
        }
        setTimeout(() => setClaimingId(null), 800);
    };

    const handleAddToCart = (product: Product) => {
        const firstUnit = product.units?.[0];
        if (!firstUnit) return;
        addItem(product.id, firstUnit.label, 1, product, undefined, 'with', 0);
    };

    const isSavingMode = labourMode === 'without';
    const allowance = getSavingAllowance();
    const remaining = getRemainingCredit();

    // STRICT VISIBILITY: Only show when Without Labour is active
    if (!isSavingMode) return null;

    if (!loading && upsellProducts.length === 0) return null;

    return (
        <motion.div
            ref={sectionRef}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className={`mt-12 rounded-2xl border-2 transition-all duration-500 overflow-hidden ${isSavingMode
                    ? 'border-amber-300 shadow-[0_0_30px_rgba(251,191,36,0.25)] bg-amber-50/40'
                    : 'border-gray-100 bg-gray-50/50'
                }`}
        >
            {/* Header */}
            <div className={`px-6 py-5 border-b transition-all duration-500 ${isSavingMode ? 'border-amber-200 bg-amber-50' : 'border-gray-100 bg-white'
                }`}>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-500 ${isSavingMode ? 'bg-amber-400 text-white' : 'bg-navy/10 text-navy'
                            }`}>
                            {isSavingMode ? <Gift size={18} /> : <Wrench size={18} />}
                        </div>
                        <div>
                            <h3 className={`font-heading font-bold text-base transition-colors duration-500 ${isSavingMode ? 'text-amber-800' : 'text-navy'
                                }`}>
                                {isSavingMode ? 'Claim Your Complimentary Tools' : 'Recommended Tools for Best Results'}
                            </h3>
                            <AnimatePresence mode="wait">
                                {isSavingMode ? (
                                    <motion.p
                                        key="without"
                                        initial={{ opacity: 0, y: -4 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 4 }}
                                        className="text-xs text-amber-600 font-medium mt-0.5"
                                    >
                                        ✦ Select tools included in your saving pack
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
                    {isSavingMode && (
                        <motion.span
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="text-[9px] font-black uppercase tracking-widest px-2 py-1 bg-amber-400 text-white rounded-full"
                        >
                            COMPLIMENTARY
                        </motion.span>
                    )}
                </div>

                {/* Credit Progress Bar — visible only in saving mode */}
                {isSavingMode && allowance > 0 && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="mt-3 pt-3 border-t border-amber-200"
                    >
                        <div className="flex justify-between text-[10px] text-amber-700 font-semibold mb-1.5">
                            <span>Pack Credit Used</span>
                            <span>{Math.round(((allowance - remaining) / allowance) * 100)}%</span>
                        </div>
                        <div className="h-1.5 bg-amber-200 rounded-full overflow-hidden">
                            <motion.div
                                className="h-full bg-amber-400 rounded-full"
                                initial={{ width: 0 }}
                                animate={{ width: `${Math.min(100, ((allowance - remaining) / allowance) * 100)}%` }}
                                transition={{ duration: 0.5 }}
                            />
                        </div>
                    </motion.div>
                )}
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
                            <UpsellCard
                                key={product.id}
                                product={product}
                                idx={idx}
                                isSavingMode={isSavingMode}
                                remaining={remaining}
                                addItem={addItem}
                                addGiftItem={addGiftItem}
                                items={items}
                            />
                        ))}
                    </div>
                )}

                <div className="mt-4 flex flex-col sm:flex-row justify-center items-center gap-3">
                    <span className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold bg-gray-50 text-gray-400 border border-gray-100">
                        <Gift size={14} /> Tools are exclusively available as complimentary gifts
                    </span>
                    <Link
                        href="/category/paint-tools"
                        className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold transition-all bg-amber-400/20 text-amber-700 hover:bg-amber-400/40 border border-amber-300"
                    >
                        Browse All Tools <ArrowRight size={14} />
                    </Link>
                </div>
            </div>
        </motion.div>
    );
}
