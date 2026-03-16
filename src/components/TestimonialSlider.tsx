'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Star, ChevronLeft, ChevronRight, Quote, Play } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

interface Review {
    id: string;
    user_name: string;
    role?: string;
    content: string;
    media_url: string | null;
    media_type: 'image' | 'video' | 'none';
    rating: number;
    is_shop_review: boolean;
}

const fallbackTestimonials = [
    {
        name: "Arsalan Ahmed",
        role: "Homeowner, DHA Phase 8",
        content: "Tawakkal Paint House provided exceptional service. The Rozzilac Matt finish we chose for our lounge is absolutely stunning. Smooth, rich, and exactly the shade we wanted.",
        image: "/images/testimonials/user1.png",
        rating: 5
    },
    {
        name: "Sana Malik",
        role: "Interior Designer",
        content: "As a designer, I'm very picky about color accuracy. Tawakkal is the only store in Karachi I trust for perfect color mixing and genuine sealed products. Their customer support is top-notch.",
        image: "/images/testimonials/user2.png",
        rating: 5
    }
];

export function TestimonialSlider() {
    const [reviews, setReviews] = useState<any[]>([]);
    const [index, setIndex] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReviews = async () => {
            const supabase = createClient();
            const { data } = await supabase
                .from('reviews')
                .select('*')
                .eq('status', 'approved')
                .order('created_at', { ascending: false });

            if (data && data.length > 0) {
                setReviews(data);
            } else {
                setReviews(fallbackTestimonials.map(t => ({
                    user_name: t.name,
                    role: t.role,
                    content: t.content,
                    media_url: t.image,
                    media_type: 'image',
                    rating: t.rating,
                    is_shop_review: false
                })));
            }
            setLoading(false);
        };
        fetchReviews();
    }, []);

    useEffect(() => {
        if (reviews.length === 0) return;
        const timer = setInterval(() => {
            setIndex((prev) => (prev + 1) % reviews.length);
        }, 8000);
        return () => clearInterval(timer);
    }, [reviews]);

    const next = () => setIndex((prev) => (prev + 1) % reviews.length);
    const prev = () => setIndex((prev) => (prev - 1 + reviews.length) % reviews.length);

    if (loading || reviews.length === 0) return null;

    const current = reviews[index];

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
                                {/* Image/Video */}
                                <div className="md:col-span-2">
                                    <div className="relative aspect-square rounded-[30px] overflow-hidden shadow-2xl group bg-navy">
                                        {current.media_type === 'video' ? (
                                            <div className="w-full h-full relative">
                                                <video 
                                                    src={current.media_url} 
                                                    className="w-full h-full object-cover"
                                                    autoPlay
                                                    muted
                                                    loop
                                                    playsInline
                                                />
                                                <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                                                    <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30">
                                                        <Play size={20} className="text-white fill-current translate-x-0.5" />
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <img 
                                                src={current.media_url || "/images/placeholder.jpg"} 
                                                alt={current.user_name}
                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                            />
                                        )}
                                        <div className="absolute inset-0 bg-gradient-to-t from-navy/40 to-transparent" />
                                        <div className="absolute -bottom-2 -left-2 w-16 h-16 bg-gold rounded-2xl flex items-center justify-center text-white shadow-lg">
                                            <Quote size={32} />
                                        </div>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="md:col-span-3 space-y-8">
                                    <div className="flex gap-1 text-gold">
                                        {[...Array(current.rating)].map((_, i) => (
                                            <Star key={i} size={20} fill="currentColor" />
                                        ))}
                                    </div>
                                    <p className="text-2xl md:text-3xl font-heading italic text-navy leading-relaxed">
                                        "{current.content}"
                                    </p>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h4 className="text-xl font-bold text-navy">{current.user_name}</h4>
                                            {current.is_shop_review && (
                                                <span className="text-[10px] font-bold text-gold bg-gold/10 px-2 py-0.5 rounded-full uppercase tracking-widest border border-gold/10">
                                                    Shop Visit
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-gold font-medium">{current.role || 'Verified Customer'}</p>
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
