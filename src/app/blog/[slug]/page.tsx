import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { 
    Clock, Calendar, User, ArrowLeft, MessageCircle, 
    Share2, Calculator, ShieldCheck, Sparkles 
} from 'lucide-react';
import { BLOG_POSTS } from '@/data/blog';

interface Props {
    params: {
        slug: string;
    };
}

// Generate static routes for build-time static generation
export async function generateStaticParams() {
    return BLOG_POSTS.map((post) => ({
        slug: post.slug,
    }));
}

// Generate dynamic metadata for maximum search indexing authority
export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const post = BLOG_POSTS.find((p) => p.slug === params.slug);
    
    if (!post) {
        return {
            title: 'Article Not Found | Tawakkal Paint House',
        };
    }

    return {
        title: `${post.title} | Tawakkal Paint Hub`,
        description: post.description,
        openGraph: {
            title: post.title,
            description: post.description,
            url: `https://tawakkalpainthouse.com/blog/${post.slug}`,
            type: 'article',
            publishedTime: new Date(post.publishDate).toISOString(),
            authors: [post.author],
            tags: post.tags,
            images: [{
                url: post.image,
                width: 800,
                height: 500,
                alt: post.title
            }]
        }
    };
}

export default function BlogPostDetailPage({ params }: Props) {
    const post = BLOG_POSTS.find((p) => p.slug === params.slug);

    if (!post) {
        notFound();
    }

    // BlogPosting JSON-LD Structured Data for Featured Snippets
    const schemaMarkup = {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        'headline': post.title,
        'description': post.description,
        'image': post.image,
        'datePublished': new Date(post.publishDate).toISOString(),
        'author': {
            '@type': 'Person',
            'name': post.author,
            'jobTitle': 'Paint Specialist & Store Manager'
        },
        'publisher': {
            '@type': 'Organization',
            'name': 'Tawakkal Paint House',
            'logo': {
                '@type': 'ImageObject',
                'url': 'https://kadkryylyzfwtxknvcic.supabase.co/storage/v1/object/public/products/logo.png'
            }
        },
        'mainEntityOfPage': {
            '@type': 'WebPage',
            '@id': `https://tawakkalpainthouse.com/blog/${post.slug}`
        }
    };

    // Helper function to render simple markdown formatting
    const renderContent = (contentString: string) => {
        return contentString.split('\n').map((line, idx) => {
            const trimmed = line.trim();
            if (!trimmed) return <div key={idx} className="h-4" />;
            
            // Render Headers
            if (trimmed.startsWith('### ')) {
                return (
                    <h3 key={idx} className="text-xl md:text-2xl font-bold text-navy mt-8 mb-4">
                        {trimmed.substring(4)}
                    </h3>
                );
            }
            if (trimmed.startsWith('## ')) {
                return (
                    <h2 key={idx} className="text-2xl md:text-3xl font-heading font-black text-navy mt-10 mb-6 border-b border-gray-100 pb-2">
                        {trimmed.substring(3)}
                    </h2>
                );
            }

            // Render Bullet Points
            if (trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
                return (
                    <li key={idx} className="ml-6 list-disc text-sm sm:text-base text-gray-600 leading-relaxed my-2 font-medium">
                        {parseBoldText(trimmed.substring(2))}
                    </li>
                );
            }

            // Render ordered list helper or table summaries
            if (trimmed.startsWith('|')) {
                // Return simple grid divider row if it is not markdown table divider
                if (trimmed.includes('---')) return null;
                const cols = trimmed.split('|').map(c => c.trim()).filter(Boolean);
                const isHeader = idx === 0 || contentString.split('\n')[idx - 1]?.trim() === '';
                return (
                    <div key={idx} className={`grid grid-cols-3 gap-4 p-3 border-b border-gray-100 text-xs sm:text-sm ${isHeader ? 'bg-navy/5 font-bold text-navy' : 'text-gray-600 font-medium'}`}>
                        {cols.map((col, cidx) => <span key={cidx}>{parseBoldText(col)}</span>)}
                    </div>
                );
            }

            // Render standard paragraphs
            return (
                <p key={idx} className="text-sm sm:text-base text-gray-600 leading-relaxed my-4 font-medium">
                    {parseBoldText(trimmed)}
                </p>
            );
        });
    };

    // Helper function to parse simple **bold** markdown markers
    const parseBoldText = (text: string) => {
        const parts = text.split(/\*\*(.*?)\*\*/g);
        return parts.map((part, i) => {
            if (i % 2 === 1) {
                // If it was enclosed in asterisks, render bold with gold hue option
                return <strong key={i} className="text-navy font-bold">{part}</strong>;
            }
            return part;
        });
    };

    return (
        <article className="min-h-screen bg-off-white py-12 md:py-16 selection:bg-gold selection:text-navy">
            {/* Inject JSON-LD blog schema */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaMarkup) }}
            />

            <div className="max-w-3xl mx-auto px-4">
                {/* Back Link */}
                <Link 
                    href="/blog"
                    className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-navy font-bold transition-all mb-8 group"
                >
                    <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                    Back to Advice Hub
                </Link>

                {/* Article Header */}
                <div className="space-y-6 mb-8">
                    <span className="inline-block px-3.5 py-1.5 bg-gold/10 text-navy font-bold text-xs uppercase rounded-full tracking-wider border border-gold/20">
                        {post.category}
                    </span>
                    <h1 className="text-3xl md:text-5xl font-heading font-black text-navy leading-tight">
                        {post.title}
                    </h1>

                    {/* Metadata Row */}
                    <div className="flex flex-wrap items-center gap-6 text-xs sm:text-sm text-gray-400 font-bold border-y border-gray-100 py-4">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-gold/10 text-navy flex items-center justify-center font-bold">
                                UK
                            </div>
                            <div className="space-y-0.5">
                                <p className="text-navy leading-none">{post.author}</p>
                                <p className="text-[10px] text-gray-400 font-medium">Store Expert</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                            <Calendar size={15} className="text-gold" />
                            <span>{post.publishDate}</span>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                            <Clock size={15} className="text-gold" />
                            <span>{post.readTime}</span>
                        </div>
                    </div>
                </div>

                {/* Main Article Image */}
                <div className="relative aspect-[16/9] w-full rounded-3xl overflow-hidden shadow-xl shadow-navy/5 mb-10 border border-gray-100">
                    <Image
                        src={post.image}
                        alt={post.title}
                        fill
                        className="w-full h-full object-cover"
                        priority
                    />
                </div>

                {/* Dynamic Styled content body */}
                <div className="bg-white rounded-3xl p-8 md:p-12 border border-gray-100 shadow-sm mb-12">
                    <div className="space-y-2">
                        {renderContent(post.content)}
                    </div>
                </div>

                {/* Side CTA Card: High Converting WhatsApp Action */}
                <div className="bg-navy rounded-3xl p-8 md:p-12 text-white relative overflow-hidden shadow-2xl border border-gold/20 flex flex-col md:flex-row items-center justify-between gap-8">
                    {/* Glowing Accent */}
                    <div className="absolute -bottom-16 -right-16 w-48 h-48 bg-gold/10 rounded-full blur-3xl" />

                    <div className="space-y-4 text-center md:text-left max-w-md relative z-10">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-gold/20 text-gold rounded-full text-xs font-bold border border-gold/30">
                            <Sparkles size={12} />
                            Free Expert Consultation
                        </span>
                        <h3 className="text-2xl md:text-3xl font-heading font-bold text-white">
                            Get Custom Color &amp; Paint Advice
                        </h3>
                        <p className="text-gray-300 text-xs sm:text-sm leading-relaxed">
                            Confused about wall moisture treatment or exterior paint finishes? Talk to our branch manager Asif Khan directly on WhatsApp for customized recommendations.
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row md:flex-col gap-3 w-full sm:w-auto shrink-0 relative z-10">
                        <a
                            href={`https://wa.me/923475658761?text=Hi Asif! I read your guide about "${post.title}" and want a custom paint consultation.`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-[#25D366] hover:bg-[#1EBE53] text-white py-3.5 px-6 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-md text-center"
                        >
                            <MessageCircle size={18} />
                            WhatsApp Expert
                        </a>

                        <Link
                            href="/rates"
                            className="bg-gold hover:bg-gold-light text-navy py-3.5 px-6 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-md text-center"
                        >
                            <Calculator size={18} />
                            Calculate Painting Cost
                        </Link>
                    </div>
                </div>
            </div>
        </article>
    );
}
