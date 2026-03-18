import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { createClient } from '@/lib/supabase/client';

export function BrandSection() {
    const [brands, setBrands] = useState<any[]>([]);

    useEffect(() => {
        async function fetchBrands() {
            const supabase = createClient();
            const { data } = await supabase
                .from('brands')
                .select('*')
                .eq('is_active', true)
                .order('name');
            if (data) setBrands(data);
        }
        fetchBrands();
    }, []);

    const logos = brands.map(brand => ({
        name: brand.name,
        url: brand.logo_url
    }));

    // Duplicate logos for a seamless marquee
    const displayLogos = [...logos, ...logos, ...logos];

    return (
        <section className="py-12 bg-white border-b border-gray-100 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row items-center gap-10 md:gap-16">
                    {/* Header */}
                    <div className="flex items-center gap-6 shrink-0 relative">
                        <h2 className="font-heading text-xl md:text-2xl font-bold text-navy whitespace-nowrap">
                            Trusted Partners
                        </h2>
                        <div className="hidden md:block w-px h-12 bg-gradient-to-b from-transparent via-gray-200 to-transparent" />
                        <motion.div
                            className="absolute -top-1 -right-1 w-2 h-2 bg-gold rounded-full"
                            animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                            transition={{ duration: 2, repeat: Infinity }}
                        />
                    </div>

                    {/* Marquee */}
                    <div className="w-full overflow-hidden relative">
                        <motion.div
                            className="flex items-center gap-16 md:gap-24"
                            animate={{
                                x: [0, -100 * logos.length],
                            }}
                            transition={{
                                duration: logos.length * 2, // Faster marquee (was length * 3)
                                repeat: Infinity,
                                ease: "linear",
                            }}
                        >
                            {displayLogos.map((logo, i) => (
                                <motion.div
                                    key={`${logo.name}-${i}`}
                                    whileHover={{ scale: 1.15, y: -5 }}
                                    className="shrink-0 grayscale hover:grayscale-0 transition-all duration-500 opacity-50 hover:opacity-100 cursor-pointer"
                                >
                                    {logo.url ? (
                                        <img
                                            src={logo.url}
                                            alt={logo.name}
                                            className={`h-10 md:h-14 w-auto object-contain pointer-events-none drop-shadow-sm ${logo.name === 'Dior' ? 'scale-125 p-1' : ''}`}
                                        />
                                    ) : (
                                        <span className="text-xl md:text-2xl font-black text-navy uppercase tracking-tighter whitespace-nowrap">
                                            {logo.name}
                                        </span>
                                    )}
                                </motion.div>
                            ))}
                        </motion.div>

                        {/* Premium edge fades */}
                        <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-white via-white/80 to-transparent z-10" />
                        <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-white via-white/80 to-transparent z-10" />
                    </div>
                </div>
            </div>
        </section>
    );
}
