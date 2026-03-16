'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';

const testimonials = [
    {
        name: "Arsalan Ahmed",
        role: "Homeowner, DHA Phase 8",
        content: "Tawakkal Paint House provided exceptional service. The Rozzilac Matt finish we chose for our lounge is absolutely stunned. Smooth, rich, and exactly the shade we wanted.",
        image: "/images/testimonials/user1.png",
        rating: 5
    },
    {
        name: "Sana Malik",
        role: "Interior Designer",
        content: "As a designer, I'm very picky about color accuracy. Tawakkal is the only store in Karachi I trust for perfect color mixing and genuine sealed products. Their customer support is top-notch.",
        image: "/images/testimonials/user2.png",
        rating: 5
    },
    {
        name: "Zubair Khan",
        role: "Contractor",
        content: "I've been buying bulk industrial paint from them for years. Reliable prices, fast delivery to site, and always 100% original brands. They are my go-to partner for all projects.",
        image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop",
        rating: 5
    }
];

export function TestimonialSlider() {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setIndex((prev) => (prev + 1) % testimonials.length);
        }, 8000);
        return () => clearInterval(timer);
    }, []);

    const next = () => setIndex((prev) => (prev + 1) % testimonials.length);
    const prev = () => setIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);

    return (
        <section className="py-24 bg-white relative overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-gold/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-navy/5 rounded-full blur-3xl translate-x-1/3 translate-y-1/3" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center mb-16">
                    <motion.span 
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="text-gold font-medium tracking-widest uppercase text-sm mb-4 block"
                    >
                        Customer Stories
                    </motion.span>
                    <motion.h2 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-5xl font-heading font-bold text-navy"
                    >
                        Trusted by <span className="text-gold">Thousands.</span>
                    </motion.h2>
                </div>

                <div className="relative max-w-5xl mx-auto">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -50 }}
                            transition={{ duration: 0.6, ease: "easeInOut" }}
                            className="bg-off-white/50 backdrop-blur-sm rounded-[40px] p-8 md:p-16 border border-gray-100 shadow-xl shadow-navy/5"
                        >
                            <div className="grid md:grid-cols-5 gap-12 items-center">
                                {/* Image */}
                                <div className="md:col-span-2">
                                    <div className="relative aspect-square rounded-[30px] overflow-hidden shadow-2xl group">
                                        <img 
                                            src={testimonials[index].image} 
                                            alt={testimonials[index].name}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-navy/40 to-transparent" />
                                        <div className="absolute -bottom-2 -left-2 w-16 h-16 bg-gold rounded-2xl flex items-center justify-center text-white shadow-lg">
                                            <Quote size={32} />
                                        </div>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="md:col-span-3 space-y-8">
                                    <div className="flex gap-1 text-gold">
                                        {[...Array(testimonials[index].rating)].map((_, i) => (
                                            <Star key={i} size={20} fill="currentColor" />
                                        ))}
                                    </div>
                                    <p className="text-2xl md:text-3xl font-heading italic text-navy leading-relaxed">
                                        "{testimonials[index].content}"
                                    </p>
                                    <div>
                                        <h4 className="text-xl font-bold text-navy">{testimonials[index].name}</h4>
                                        <p className="text-gold font-medium">{testimonials[index].role}</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </AnimatePresence>

                    {/* Navigation */}
                    <div className="flex justify-center gap-6 mt-12">
                        <button 
                            onClick={prev}
                            className="w-14 h-14 rounded-full border-2 border-navy/10 flex items-center justify-center text-navy hover:bg-gold hover:border-gold hover:text-white transition-all duration-300"
                        >
                            <ChevronLeft size={24} />
                        </button>
                        <button 
                            onClick={next}
                            className="w-14 h-14 rounded-full border-2 border-navy/10 flex items-center justify-center text-navy hover:bg-gold hover:border-gold hover:text-white transition-all duration-300"
                        >
                            <ChevronRight size={24} />
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}
