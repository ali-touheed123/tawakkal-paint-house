import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { 
    MapPin, Phone, MessageCircle, Clock, Navigation, 
    ArrowLeft, ShieldCheck, CheckCircle2, Building 
} from 'lucide-react';
import { BRANCHES_DATA } from '@/data/branches';

interface Props {
    params: Promise<{
        slug: string;
    }>;
}

// Generate Static Params for all branches (enables Next.js static generation)
export async function generateStaticParams() {
    return BRANCHES_DATA.map((branch) => ({
        slug: branch.slug,
    }));
}

// Generate dynamic metadata per branch for hyper-targeted local SEO
export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const resolvedParams = await params;
    const branch = BRANCHES_DATA.find((b) => b.slug === resolvedParams.slug);
    
    if (!branch) {
        return {
            title: 'Branch Not Found | Tawakkal Paint House',
        };
    }

    return {
        title: `${branch.name} | Authorized Dealer in ${branch.city}`,
        description: `Visit ${branch.name} on ${branch.address}. Authentic paint distributor for Berger, Brighto, Gobis and Choice. Landmark: ${branch.landmark || 'Main Road'}. Call: ${branch.phones.join(', ')}.`,
        openGraph: {
            title: `${branch.name} - Paint Store in ${branch.city}`,
            description: `Official distributor branch in ${branch.area}, ${branch.city}. Contact us for bulk paint supply, tinting machines, and wholesale services.`,
            url: `https://tawakkalpainthouse.com/branches/${branch.slug}`,
        }
    };
}

export default async function BranchDetailPage({ params }: Props) {
    const resolvedParams = await params;
    const branch = BRANCHES_DATA.find((b) => b.slug === resolvedParams.slug);

    if (!branch) {
        notFound();
    }

    // JSON-LD PaintStore / LocalBusiness Schema for Google Search
    const schemaMarkup = {
        '@context': 'https://schema.org',
        '@type': 'PaintStore',
        'name': branch.name,
        'description': `Official authorized branch of Tawakkal Paint House serving ${branch.area} and surrounding neighborhoods in ${branch.city}.`,
        'telephone': branch.phones[0],
        'address': {
            '@type': 'PostalAddress',
            'streetAddress': branch.address,
            'addressLocality': branch.city,
            'addressCountry': 'PK'
        },
        'url': `https://tawakkalpainthouse.com/branches/${branch.slug}`,
        'image': 'https://kadkryylyzfwtxknvcic.supabase.co/storage/v1/object/public/products/logo.png',
        'priceRange': '$$',
        'openingHoursSpecification': {
            '@type': 'OpeningHoursSpecification',
            'dayOfWeek': [
                'Monday',
                'Tuesday',
                'Wednesday',
                'Thursday',
                'Friday',
                'Saturday'
            ],
            'opens': '09:00',
            'closes': '20:00'
        }
    };

    return (
        <div className="min-h-screen bg-off-white py-12 md:py-16 selection:bg-gold selection:text-navy">
            {/* Inject JSON-LD local schema */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaMarkup) }}
            />

            <div className="max-w-4xl mx-auto px-4">
                {/* Back Link */}
                <Link 
                    href="/branches"
                    className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-navy font-bold transition-all mb-8 group"
                >
                    <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                    Back to All Branches
                </Link>

                {/* Main Branch Detail Card */}
                <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl shadow-navy/5 border border-gray-100 space-y-8 relative overflow-hidden">
                    {/* Background accent */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 rounded-full blur-2xl" />

                    <div className="space-y-4">
                        <span className="inline-block px-3 py-1.5 bg-gold/10 text-navy font-bold text-xs uppercase rounded-full tracking-wider border border-gold/20">
                            {branch.type}
                        </span>
                        <h1 className="text-3xl md:text-5xl font-heading font-black text-navy leading-tight">
                            {branch.name}
                        </h1>
                        <p className="text-gray-500 text-sm md:text-base max-w-xl">
                            Providing authentic retail and wholesale paints, custom tinting machines, and expert building supplies directly in {branch.city}.
                        </p>
                    </div>

                    <hr className="border-gray-100" />

                    {/* Details Rows */}
                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="space-y-6">
                            <div className="flex gap-4">
                                <div className="w-10 h-10 rounded-full bg-navy/5 flex items-center justify-center text-gold shrink-0">
                                    <MapPin size={18} />
                                </div>
                                <div className="space-y-1">
                                    <h4 className="text-sm font-bold text-navy">Exact Location Address</h4>
                                    <p className="text-sm text-gray-600 leading-relaxed">{branch.address}</p>
                                    {branch.landmark && (
                                        <p className="text-xs font-semibold text-gold mt-1">Landmark: {branch.landmark}</p>
                                    )}
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <div className="w-10 h-10 rounded-full bg-navy/5 flex items-center justify-center text-gold shrink-0">
                                    <Clock size={18} />
                                </div>
                                <div className="space-y-1">
                                    <h4 className="text-sm font-bold text-navy">Working Hours</h4>
                                    <p className="text-sm text-gray-600">{branch.timings}</p>
                                    <p className="text-xs text-gray-400 font-semibold">Sundays Closed</p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="flex gap-4">
                                <div className="w-10 h-10 rounded-full bg-navy/5 flex items-center justify-center text-gold shrink-0">
                                    <Phone size={18} />
                                </div>
                                <div className="space-y-1">
                                    <h4 className="text-sm font-bold text-navy">Phone Contacts</h4>
                                    {branch.phones.map((phone, i) => (
                                        <a 
                                            key={i} 
                                            href={`tel:${phone}`}
                                            className="block text-sm text-gray-600 hover:text-gold transition-colors font-medium"
                                        >
                                            {phone}
                                        </a>
                                    ))}
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <div className="w-10 h-10 rounded-full bg-navy/5 flex items-center justify-center text-gold shrink-0">
                                    <ShieldCheck size={18} />
                                </div>
                                <div className="space-y-1">
                                    <h4 className="text-sm font-bold text-navy">Verified Branch Services</h4>
                                    <div className="flex flex-wrap gap-2 pt-1.5">
                                        {['Tinting Machine', 'Bulk Paint Stock', 'Original Brands Only', 'Home Delivery'].map((srv, idx) => (
                                            <span key={idx} className="flex items-center gap-1 bg-gray-50 border border-gray-100 rounded-md px-2 py-1 text-[10px] text-gray-500 font-semibold">
                                                <CheckCircle2 size={10} className="text-gold" />
                                                {srv}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <hr className="border-gray-100" />

                    {/* Instant Call-To-Action buttons */}
                    <div className="grid sm:grid-cols-3 gap-4 pt-2">
                        <a 
                            href={`https://wa.me/${branch.whatsapp}?text=Hi! I am inquiring about product availability and wholesale prices at the *${branch.name}*.`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-[#25D366] hover:bg-[#1EBE53] text-white py-3.5 px-6 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-md"
                        >
                            <MessageCircle size={18} />
                            WhatsApp Branch
                        </a>

                        <a 
                            href={`tel:${branch.phones[0]}`}
                            className="bg-navy hover:bg-navy-light text-white py-3.5 px-6 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-md"
                        >
                            <Phone size={18} />
                            Call Store Manager
                        </a>

                        <a 
                            href={branch.googleMapsUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="border border-gold text-navy hover:bg-gold/5 py-3.5 px-6 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all"
                        >
                            <Navigation size={18} className="text-gold" />
                            Get Directions
                        </a>
                    </div>
                </div>

                {/* Local Area Content for SEO keyword density */}
                <div className="bg-navy/5 border border-navy/10 rounded-3xl p-8 mt-12 space-y-4 text-sm text-navy/80">
                    <h3 className="text-lg font-bold text-navy flex items-center gap-2">
                        <Building size={18} className="text-gold" />
                        About our {branch.area} Branch
                    </h3>
                    <p className="text-gray-600 text-xs sm:text-sm leading-relaxed font-medium">
                        At <span className="text-navy font-bold">{branch.name}</span>, we stock the absolute best range of original, factory-sealed paint buckets, emulsions, weather shields, primers, and wall puttys. Serving {branch.area}, {branch.city} and surrounding local neighborhoods, our branch features high-speed computer tinting machines capable of mixing over 10,000 custom paint shades on demand. 
                    </p>
                    <p className="text-gray-600 text-xs sm:text-sm leading-relaxed font-medium">
                        Whether you are a homeowner getting estimates or a professional painter looking for B2B paint supply rates, visit our store or contact our store manager directly on WhatsApp for verified inventory status and discount quotes.
                    </p>
                </div>
            </div>
        </div>
    );
}
