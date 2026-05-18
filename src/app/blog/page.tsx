import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Clock, User, Calendar, ArrowRight, Sparkles, BookOpen } from 'lucide-react';
import { BLOG_POSTS } from '@/data/blog';

export const metadata: Metadata = {
    title: 'Expert Painting Guides & Home Advice | Tawakkal Paint House',
    description: 'Read expert advice on wall dampness (seelan), wall preparation, and exterior paints in Pakistan. Recommending verified premium brands like Brighto, Gobis, and Reliable.',
    openGraph: {
        title: 'Tawakkal Paint House Expert Advice Hub',
        description: 'Professional step-by-step wall repair and paint selection guides written by Karachi\'s paint house experts.',
        url: 'https://tawakkalpainthouse.com/blog',
    }
};

export default function BlogHubPage() {
    return (
        <div className="min-h-screen bg-off-white pb-20 selection:bg-gold selection:text-navy">
            {/* Cinematic Hero */}
            <section className="relative h-[50vh] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-navy/60 z-10" />
                    <Image
                        src="https://images.unsplash.com/photo-1562664377-709f2c337eb2?q=80&w=1800&auto=format&fit=crop"
                        alt="Expert Wall Painting Advice Pakistan"
                        fill
                        priority
                        className="w-full h-full object-cover"
                    />
                </div>

                <div className="relative z-20 text-center space-y-6 max-w-4xl px-4">
                    <div>
                        <span className="inline-block px-4 py-1.5 bg-gold/20 text-gold rounded-full text-sm font-medium tracking-wider uppercase mb-4 backdrop-blur-md border border-gold/30">
                            Expert Knowledge Hub
                        </span>
                        <h1 className="text-4xl md:text-6xl font-heading font-bold text-white mb-6 leading-tight">
                            Painting Guides <br />
                            <span className="text-gold">&amp; Home Advice</span>
                        </h1>
                        <p className="text-white/90 text-lg md:text-xl max-w-2xl mx-auto font-light leading-relaxed">
                            Professional guidance, waterproofing strategies, and color selection guides written by store experts featuring Brighto, Gobis, and Reliable.
                        </p>
                    </div>
                </div>
            </section>

            {/* Main Articles Grid Container */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-30">
                {/* Visual Banner */}
                <div className="bg-white rounded-3xl shadow-2xl shadow-navy/5 p-6 md:p-8 mb-12 border border-gray-100 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-gold/10 flex items-center justify-center text-gold shrink-0">
                        <BookOpen size={22} />
                    </div>
                    <div className="space-y-0.5">
                        <h2 className="text-lg font-bold text-navy">Verified Homeowner Guides</h2>
                        <p className="text-xs text-gray-500 font-medium">Protect your home, save materials cost, and choose the correct paint finishes.</p>
                    </div>
                </div>

                {/* Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {BLOG_POSTS.map((post, idx) => (
                        <article 
                            key={post.slug}
                            className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl border border-gray-100 hover:border-gold/30 transition-all duration-300 flex flex-col group"
                        >
                            {/* Card Image */}
                            <div className="relative aspect-[16/10] overflow-hidden">
                                <Image
                                    src={post.image}
                                    alt={post.title}
                                    fill
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute top-4 left-4 z-20">
                                    <span className="px-3.5 py-1.5 bg-navy/95 border border-gold/30 text-gold rounded-full text-xs font-bold backdrop-blur-sm">
                                        {post.category}
                                    </span>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-6 md:p-8 flex-1 flex flex-col justify-between space-y-6">
                                <div className="space-y-3">
                                    {/* Author & Read Time Info */}
                                    <div className="flex flex-wrap items-center gap-4 text-xs text-gray-400 font-semibold">
                                        <div className="flex items-center gap-1.5">
                                            <User size={13} className="text-gold" />
                                            <span>{post.author}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <Clock size={13} className="text-gold" />
                                            <span>{post.readTime}</span>
                                        </div>
                                    </div>

                                    {/* Title */}
                                    <h3 className="text-xl font-bold text-navy leading-snug group-hover:text-gold transition-colors">
                                        <Link href={`/blog/${post.slug}`}>
                                            {post.title}
                                        </Link>
                                    </h3>

                                    {/* Description */}
                                    <p className="text-xs sm:text-sm text-gray-500 leading-relaxed font-medium line-clamp-3">
                                        {post.description}
                                    </p>
                                </div>

                                <div className="pt-4 border-t border-gray-50 flex items-center justify-between">
                                    <span className="text-xs text-gray-400 font-bold flex items-center gap-1">
                                        <Calendar size={12} className="text-gold" />
                                        {post.publishDate}
                                    </span>

                                    <Link
                                        href={`/blog/${post.slug}`}
                                        className="text-xs font-bold text-navy hover:text-gold flex items-center gap-1 group/btn transition-colors"
                                    >
                                        Read Full Guide
                                        <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                                    </Link>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </div>
    );
}
