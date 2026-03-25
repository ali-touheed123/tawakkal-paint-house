'use client';

import { motion } from 'framer-motion';
import { Percent, ShieldCheck, ArrowRight, Sparkles } from 'lucide-react';
import { useLabourSettings } from '@/lib/hooks/useSettings';
import Link from 'next/link';

export function ValuePromotion() {
    const { tiers, loading } = useLabourSettings();

    if (loading) return null;

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl relative"
        >
            {/* Background Glow Effect */}
            <div className="absolute -inset-4 bg-gold/5 blur-2xl rounded-full opacity-50" />

            {/* Savings Mode Card */}
            <div className="relative group bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-500 hover:border-gold/30">
                <div className="absolute top-0 right-0 p-3 opacity-20 group-hover:opacity-100 transition-opacity">
                    <Percent className="text-gold" size={40} />
                </div>
                <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-3">
                        <div className="bg-gold/20 p-2 rounded-lg">
                            <Percent className="text-gold" size={16} />
                        </div>
                        <h3 className="text-white font-bold text-xs uppercase tracking-widest">Savings Mode</h3>
                    </div>
                    <p className="text-gray-300 text-[11px] leading-relaxed mb-4 font-medium">
                        Direct wholesale rates. Save up to <span className="text-gold font-bold">25% OFF</span> on bulk orders.
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                        {tiers.length > 0 ? tiers.slice(0, 3).map((tier, i) => (
                            <span key={i} className="text-[9px] font-black bg-white/5 text-gold border border-gold/20 px-2 py-1 rounded-md">
                                {tier.discount_value}{tier.discount_type === 'percent' ? '%' : ' OFF'}
                            </span>
                        )) : (
                            <span className="text-[9px] font-black bg-white/5 text-gold border border-gold/20 px-2 py-1 rounded-md">
                                UP TO 25% OFF
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {/* Service Mode Card */}
            <div className="relative group bg-navy-light/40 backdrop-blur-xl border border-gold/20 rounded-2xl p-6 hover:bg-navy-light/60 transition-all duration-500 hover:border-gold shadow-2xl overflow-hidden">
                {/* Subtle highlight animation */}
                <div className="absolute inset-0 bg-gradient-to-tr from-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                
                <div className="absolute -top-3 -right-3 bg-green-500 text-white text-[9px] font-black px-4 py-1.5 rounded-full shadow-lg uppercase tracking-tighter flex items-center gap-1.5 z-20">
                    <Sparkles size={10} className="animate-pulse" /> Verified Premium
                </div>

                <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-3">
                        <div className="bg-green-500/20 p-2 rounded-lg">
                            <ShieldCheck className="text-green-400" size={16} />
                        </div>
                        <h3 className="text-white font-bold text-xs uppercase tracking-widest">Service Mode</h3>
                    </div>
                    <p className="text-gray-300 text-[11px] leading-relaxed mb-4 font-medium">
                        Hassle-free professional application. <br />
                        <span className="text-green-400 font-bold italic">Expert Labour & Delivery Free.</span>
                    </p>
                    <Link 
                        href="/#categories"
                        className="inline-flex items-center gap-2 text-[10px] font-bold text-gold hover:text-white transition-all group-hover:gap-3"
                    >
                        How it works <ArrowRight size={12} />
                    </Link>
                </div>
            </div>
        </motion.div>
    );
}
