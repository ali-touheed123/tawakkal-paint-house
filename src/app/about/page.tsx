'use client';

import { motion } from 'framer-motion';
import { Award, ShieldCheck, Clock, Users, Building2, PaintBucket, Star, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-white overflow-x-hidden">
            {/* Hero Section */}
            <section className="relative h-[60vh] flex items-center justify-center overflow-hidden bg-navy">
                <div className="absolute inset-0 opacity-40">
                    <img 
                        src="https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=1600&h=900&fit=crop" 
                        alt="Paint detail" 
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-navy/80 via-navy/50 to-white" />
                </div>
                
                <div className="relative z-10 text-center px-4">
                    <motion.span 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-gold font-bold tracking-[0.3em] uppercase text-sm mb-6 block"
                    >
                        Established 2011
                    </motion.span>
                    <motion.h1 
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-7xl font-heading font-bold text-white mb-8"
                    >
                        Our <span className="text-gold">Legacy</span> of Color
                    </motion.h1>
                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-gray-300 max-w-2xl mx-auto text-lg md:text-xl font-medium"
                    >
                        Karachi's premier destination for high-end decorative, industrial, and automotive paints for over a decade.
                    </motion.p>
                </div>
            </section>

            {/* Vision & Mission */}
            <section className="py-24 bg-white relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-10 md:gap-20 items-center">
                        <motion.div 
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            className="space-y-8"
                        >
                            <h2 className="text-3xl md:text-4xl font-heading font-bold text-navy leading-tight">
                                More Than Just a <span className="text-gold">Paint Store.</span>
                            </h2>
                            <p className="text-gray-600 text-lg leading-relaxed">
                                Founded in 2011 in Mauripur, Karachi, Tawakkal Paint House started with a simple belief: 
                                <span className="text-navy font-bold"> quality should never be compromised.</span> 
                                What began as a local shop has evolved into one of Karachi's most trusted authorized dealers for global and national paint giants.
                            </p>
                            <div className="grid grid-cols-2 gap-6 pt-4">
                                <div className="space-y-2">
                                    <h3 className="text-3xl font-bold text-navy">13+</h3>
                                    <p className="text-gold font-bold text-sm uppercase tracking-wider">Years Experience</p>
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-3xl font-bold text-navy">5,000+</h3>
                                    <p className="text-gold font-bold text-sm uppercase tracking-wider">Projects Completed</p>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div 
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            className="relative"
                        >
                            <div className="aspect-square rounded-[40px] overflow-hidden shadow-2xl">
                                <img 
                                    src="https://images.unsplash.com/photo-1560185127-6ed189bf02f4?w=800&h=800&fit=crop" 
                                    alt="Modern interior" 
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="absolute -bottom-10 -left-10 bg-navy p-10 rounded-[30px] shadow-2xl hidden md:block">
                                <ShieldCheck size={48} className="text-gold mb-4" />
                                <h4 className="text-white font-bold text-xl mb-2">Authorized Dealer</h4>
                                <p className="text-gray-400 text-sm">Official partners with Berger, Diamond, <br/>Gobi's, and Rozzilac.</p>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Core Values */}
            <section className="py-12 md:py-24 bg-off-white">
                <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
                    <div className="text-center mb-10 md:mb-16">
                        <h2 className="text-2xl md:text-4xl font-heading font-bold text-navy mb-4">The Tawakkal Standard</h2>
                        <div className="w-24 h-1 bg-gold mx-auto" />
                    </div>

                    <div className="grid md:grid-cols-3 gap-6 md:gap-12">
                        {[
                            {
                                icon: Award,
                                title: "Genuine Products",
                                desc: "Every bucket sold is 100% original, sealed directly from the factory. We never sell loose or expired paint."
                            },
                            {
                                icon: Users,
                                title: "Expert Guidance",
                                desc: "Our staff doesn't just sell paint; they help you choose the right finish for Karachi's unique coastal climate."
                            },
                            {
                                icon: Clock,
                                title: "On-Time Delivery",
                                desc: "We understand site deadlines. Our logistics team ensures your order reaches you when you need it."
                            }
                        ].map((value, i) => (
                            <motion.div 
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="bg-white p-6 md:p-10 rounded-3xl shadow-xl shadow-navy/5 hover:shadow-2xl hover:shadow-gold/10 transition-all border border-gray-50 group"
                            >
                                <div className="w-16 h-16 bg-navy text-white rounded-2xl flex items-center justify-center mb-6 group-hover:bg-gold transition-colors duration-500">
                                    <value.icon size={32} />
                                </div>
                                <h3 className="text-xl md:text-2xl font-bold text-navy mb-3 md:mb-4">{value.title}</h3>
                                <p className="text-gray-500 leading-relaxed text-sm md:text-base">{value.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Why Us / Distribution Section */}
            <section className="py-12 md:py-24 bg-white overflow-hidden">
                <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
                    <div className="bg-navy rounded-[20px] md:rounded-[50px] overflow-hidden relative p-5 sm:p-8 md:p-24">
                        <div className="absolute top-0 right-0 w-[150px] md:w-[600px] h-[150px] md:h-[600px] bg-gold/10 rounded-full blur-3xl opacity-20 -translate-y-1/2" />
                        
                        <div className="grid lg:grid-cols-2 gap-8 md:gap-16 items-center relative z-10">
                            <div className="space-y-5 md:space-y-8 min-w-0">
                                <motion.span 
                                    initial={{ opacity: 0 }}
                                    whileInView={{ opacity: 1 }}
                                    className="px-3 py-1.5 md:px-4 md:py-2 bg-gold/20 border border-gold/30 text-gold rounded-full text-[10px] md:text-xs font-bold uppercase tracking-widest inline-block"
                                >
                                    Exclusive Distributor
                                </motion.span>
                                <h2 className="text-xl sm:text-2xl md:text-5xl font-heading font-bold text-white leading-tight">
                                    A Partner for <span className="text-gold">Every Scale.</span>
                                </h2>
                                <p className="text-gray-400 text-sm md:text-lg leading-relaxed">
                                    Whether you&apos;re painting a single room or managing a 50-story commercial tower, we have the stock and the logistical capacity to support you.
                                </p>
                                <ul className="space-y-3 md:space-y-4">
                                    {[
                                        "Authorized Distributor for Rozzilac Paints",
                                        "Specialized Industrial Coatings for factories",
                                        "Automotive Refinishes (Gobi's Carman Series)",
                                        "Complimentary Color Matching Experts"
                                    ].map((item, i) => (
                                        <li key={i} className="flex items-start gap-2 md:gap-3 text-white text-sm md:text-base font-medium">
                                            <CheckCircle2 size={18} className="text-gold flex-shrink-0 mt-0.5" />
                                            <span className="break-words">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                                <div className="pt-4 md:pt-8">
                                    <Link 
                                        href="/contact"
                                        className="inline-flex items-center gap-2 bg-gold text-navy font-bold px-5 md:px-10 py-3.5 md:py-5 rounded-full hover:bg-white transition-all duration-300 shadow-xl shadow-gold/20 text-sm md:text-base w-full sm:w-auto justify-center"
                                    >
                                        Discuss Your Project
                                        <Building2 size={18} />
                                    </Link>
                                </div>
                            </div>

                            <motion.div 
                                initial={{ scale: 0.8, opacity: 0 }}
                                whileInView={{ scale: 1, opacity: 1 }}
                                className="relative lg:h-[500px] flex items-center justify-center"
                            >
                                <div className="w-36 h-36 md:w-64 md:h-64 bg-gold rounded-full blur-[60px] md:blur-[100px] animate-pulse" />
                                <PaintBucket size={120} className="text-white relative z-10 opacity-10 md:hidden" />
                                <PaintBucket size={300} className="text-white relative z-10 opacity-10 hidden md:block" />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="text-center">
                                        <Star size={36} className="text-gold mx-auto mb-3 md:mb-4 animate-bounce md:w-12 md:h-12" />
                                        <p className="text-2xl md:text-4xl font-bold text-white">Top Rated</p>
                                        <p className="text-gold font-bold tracking-widest uppercase text-xs md:text-sm mt-2">In Karachi West</p>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-12 md:py-24 bg-white text-center">
                <div className="max-w-4xl mx-auto px-3 sm:px-4">
                    <h2 className="text-2xl md:text-4xl font-heading font-bold text-navy mb-4 md:mb-6">Ready to color your world?</h2>
                    <p className="text-gray-500 mb-6 md:mb-10 text-sm md:text-lg">Visit our store in Mauripur or browse our complete collection online.</p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link 
                            href="/category/all" 
                            className="bg-navy text-white px-10 py-5 rounded-xl font-bold hover:bg-gold transition-colors shadow-xl shadow-navy/20"
                        >
                            Browse Products
                        </Link>
                        <Link 
                            href="/contact" 
                            className="bg-white border-2 border-navy text-navy px-10 py-5 rounded-xl font-bold hover:bg-navy hover:text-white transition-all"
                        >
                            Visit Store
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
