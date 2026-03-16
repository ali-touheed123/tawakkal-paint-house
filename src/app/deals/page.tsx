'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { DealsCalculator } from '@/components/DealsCalculator';

export default function DealsPage() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end start"]
    });

    const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
    const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
    const scale = useTransform(scrollYProgress, [0, 0.5], [1, 1.1]);

    return (
        <div ref={containerRef} className="min-h-screen bg-off-white pb-16">
            {/* Cinematic Hero Section */}
            <section className="relative h-[70vh] flex items-center justify-center overflow-hidden">
                <motion.div 
                    style={{ y, scale }}
                    className="absolute inset-0 z-0"
                >
                    <div className="absolute inset-0 bg-navy/40 z-10" />
                    <img
                        src="/deals_hero_bg.png"
                        alt="Premium Project Showcase"
                        className="w-full h-full object-cover"
                    />
                </motion.div>

                <div className="relative z-20 text-center space-y-6 max-w-4xl px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        <span className="inline-block px-4 py-1.5 bg-gold/20 text-gold rounded-full text-sm font-medium tracking-wider uppercase mb-4 backdrop-blur-md border border-gold/30">
                            Transparent Packages
                        </span>
                        <h1 className="text-5xl md:text-7xl font-heading font-bold text-white mb-6 leading-tight">
                            Your Vision, <br />
                            <span className="text-gold">Our Expertise.</span>
                        </h1>
                        <p className="text-white/90 text-xl md:text-2xl max-w-2xl mx-auto font-light leading-relaxed">
                            Discover tailored paint solutions for every property size. 
                            From local finishes to premium luxury coatings.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5, duration: 1 }}
                        className="absolute bottom-10 left-1/2 -translate-x-1/2"
                    >
                        <div className="flex flex-col items-center gap-2">
                            <span className="text-white/60 text-xs font-medium tracking-widest uppercase">Scroll to Explore</span>
                            <div className="w-px h-12 bg-gradient-to-b from-gold to-transparent" />
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Content Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-30">
                <motion.div 
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="bg-white rounded-3xl shadow-2xl shadow-navy/5 p-8 md:p-12 mb-16 border border-gray-100"
                >
                    <div className="grid md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-gray-100">
                        <div className="space-y-2 py-4 md:py-0">
                            <h3 className="text-3xl font-heading font-bold text-navy">Proportional</h3>
                            <p className="text-gray-500">Pricing based on property size</p>
                        </div>
                        <div className="space-y-2 py-4 md:py-0">
                            <h3 className="text-3xl font-heading font-bold text-navy">All-Inclusive</h3>
                            <p className="text-gray-500">Material + Professional Labour</p>
                        </div>
                        <div className="space-y-2 py-4 md:py-0">
                            <h3 className="text-3xl font-heading font-bold text-navy">Quality First</h3>
                            <p className="text-gray-500">Verified authentic products only</p>
                        </div>
                    </div>
                </motion.div>

                <div className="space-y-24">
                    {/* Calculator Component */}
                    <div id="calculator">
                        <DealsCalculator />
                    </div>

                    {/* How it Works / Storytelling */}
                    <section className="grid lg:grid-cols-2 gap-16 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="space-y-8"
                        >
                            <h2 className="text-4xl font-heading font-bold text-navy leading-tight">
                                A Streamlined Process for <br />
                                <span className="text-gold italic">Exceptional Results.</span>
                            </h2>
                            <div className="space-y-6">
                                {[
                                    { step: "01", title: "Select Package", desc: "Choose the quality level and property size that fits your budget and vision." },
                                    { step: "02", title: "Site Measurement", desc: "Our experts visit your site to verify dimensions and assess wall conditions." },
                                    { step: "03", title: "Professional Execution", desc: "Our skilled team applies the selected products with precision and care." }
                                ].map((item, idx) => (
                                    <div key={idx} className="flex gap-6 group">
                                        <div className="text-4xl font-heading font-bold text-gold/20 group-hover:text-gold transition-colors duration-500 shrink-0">
                                            {item.step}
                                        </div>
                                        <div className="space-y-1">
                                            <h4 className="text-xl font-bold text-navy">{item.title}</h4>
                                            <p className="text-gray-600">{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1 }}
                            className="relative aspect-square rounded-2xl overflow-hidden shadow-2xl"
                        >
                            <img 
                                src="https://images.unsplash.com/photo-1562664377-709f2c337eb2?q=80&w=1000&auto=format&fit=crop" 
                                alt="Professional Painting"
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-navy/60 to-transparent" />
                            <div className="absolute bottom-8 left-8 right-8 text-white">
                                <p className="text-lg font-medium italic">"The process was seamless. From estimation to the final coat, Tawakkal Paint House delivered beyond expectations."</p>
                                <p className="text-sm mt-2 opacity-80">— Residential Client, DHA Phase 6</p>
                            </div>
                        </motion.div>
                    </section>
                </div>
            </div>
        </div>
    );
}
