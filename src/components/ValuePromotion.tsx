'use client';

import { motion } from 'framer-motion';
import { Percent, ShieldCheck, ArrowRight } from 'lucide-react';
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
            className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl"
        >
            {/* Savings Mode Card */}
            <div className="relative group bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-5 hover:bg-white/10 transition-all duration-300">
                <div className="absolute top-3 right-3 bg-gold text-navy text-[10px] font-black px-2 py-0.5 rounded-full shadow-lg uppercase tracking-tighter">
                    Best Price
                </div>
                <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-gold/20 rounded-xl flex items-center justify-center shrink-0">
                        <Percent className="text-gold" size={20} />
                    </div>
                    <div>
                        <h3 className="text-white font-bold text-sm mb-1 uppercase tracking-wide">Savings Mode</h3>
                        <p className="text-gray-300 text-[11px] leading-relaxed mb-3">
                            Direct wholesale rates. Save up to <span className="text-gold font-bold">12% OFF</span> on bulk orders.
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {tiers.slice(0, 3).map((tier, i) => (
                                <span key={i} className="text-[9px] font-bold bg-white/5 text-gold border border-gold/20 px-2 py-0.5 rounded-md">
                                    {tier.discount_value}{tier.discount_type === 'percent' ? '%' : ' OFF'}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Service Mode Card */}
            <div className="relative group bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-5 hover:bg-white/10 transition-all duration-300">
                <div className="absolute top-3 right-3 bg-green-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-lg uppercase tracking-tighter">
                    Recommended
                </div>
                <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-green-500/20 rounded-xl flex items-center justify-center shrink-0">
                        <ShieldCheck className="text-green-400" size={20} />
                    </div>
                    <div>
                        <h3 className="text-white font-bold text-sm mb-1 uppercase tracking-wide">Service Mode</h3>
                        <p className="text-gray-300 text-[11px] leading-relaxed mb-3">
                            Hassle-free professional application. <br />
                            <span className="text-green-400 font-bold italic">Labour & Delivery at zero cost.</span>
                        </p>
                        <Link 
                            href="/#categories"
                            className="inline-flex items-center gap-1.5 text-[10px] font-bold text-gold hover:text-white transition-all group-hover:gap-2"
                        >
                            Learn More <ArrowRight size={12} />
                        </Link>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
