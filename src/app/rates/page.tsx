import { Metadata } from 'next';
import Image from 'next/image';
import { RatesCalculator } from '@/components/RatesCalculator';

export const metadata: Metadata = {
    title: 'Painting Rates & Cost Estimator | Tawakkal Paint House',
    description: 'Calculate professional painting rates per Sq.ft in Karachi, Pakistan. Standardized package estimates for 80, 120, 200, and 400 Gaz properties. Get instant material and labour cost estimates.',
    openGraph: {
        title: 'Painting Cost Estimator & Rate Card | Tawakkal Paint House',
        description: 'Instant, transparent painting rates for homes and commercial projects in Karachi. Get customized estimates based on Sq.ft.',
        url: 'https://tawakkalpainthouse.com/rates',
    }
};

export default function RatesPage() {
    return (
        <div className="min-h-screen bg-off-white pb-16">
            {/* Cinematic Parallax Hero Section */}
            <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-navy/60 z-10" />
                    <Image
                        src="https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=1800&auto=format&fit=crop"
                        alt="Premium Professional Painting Estimator"
                        fill
                        priority
                        className="w-full h-full object-cover"
                    />
                </div>

                <div className="relative z-20 text-center space-y-6 max-w-4xl px-4">
                    <div>
                        <span className="inline-block px-4 py-1.5 bg-gold/20 text-gold rounded-full text-sm font-medium tracking-wider uppercase mb-4 backdrop-blur-md border border-gold/30">
                            Transparent Estimations
                        </span>
                        <h1 className="text-4xl md:text-6xl font-heading font-bold text-white mb-6 leading-tight">
                            Standardized Painting <br />
                            <span className="text-gold">Rates &amp; Estimator</span>
                        </h1>
                        <p className="text-white/90 text-lg md:text-xl max-w-2xl mx-auto font-light leading-relaxed">
                            No hidden costs. Calculate detailed material and labour rates per square foot or select package estimates by property size.
                        </p>
                    </div>
                </div>
            </section>

            {/* Main Interactive Estimator Container */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-30">
                {/* Visual Trust Badges */}
                <div className="bg-white rounded-3xl shadow-2xl shadow-navy/5 p-8 md:p-12 mb-12 border border-gray-100">
                    <div className="grid md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-gray-100">
                        <div className="space-y-2 py-4 md:py-0">
                            <h3 className="text-2xl font-heading font-bold text-navy">Transparent Pricing</h3>
                            <p className="text-gray-500 text-sm">Calculated by exact Square Footage</p>
                        </div>
                        <div className="space-y-2 py-4 md:py-0">
                            <h3 className="text-2xl font-heading font-bold text-navy">Authentic Material</h3>
                            <p className="text-gray-500 text-sm">100% factory-sealed original paints</p>
                        </div>
                        <div className="space-y-2 py-4 md:py-0">
                            <h3 className="text-2xl font-heading font-bold text-navy">Standardized Labour</h3>
                            <p className="text-gray-500 text-sm">Standard painter cost cards used</p>
                        </div>
                    </div>
                </div>

                <div className="space-y-20">
                    {/* Interactive Estimator Component */}
                    <div id="estimator-section">
                        <RatesCalculator />
                    </div>

                    {/* How It Works section */}
                    <section className="grid lg:grid-cols-2 gap-16 items-center">
                        <div className="space-y-8">
                            <h2 className="text-3xl md:text-4xl font-heading font-bold text-navy leading-tight">
                                Simple &amp; Honest <br />
                                <span className="text-gold italic">Estimation Process.</span>
                            </h2>
                            <div className="space-y-6">
                                {[
                                    { step: "01", title: "Select Mode", desc: "Choose between standard home size packages (Gaz) or calculate a custom custom-fit quote." },
                                    { step: "02", title: "Review Cost Breakdown", desc: "Verify itemized material and painter labour estimates calculated in real-time." },
                                    { step: "03", title: "Instantly Book on WhatsApp", desc: "Share your quote dynamically over WhatsApp to schedule a free on-site verification." }
                                ].map((item, idx) => (
                                    <div key={idx} className="flex gap-6 group">
                                        <div className="text-3xl font-heading font-bold text-gold/20 group-hover:text-gold transition-colors duration-500 shrink-0">
                                            {item.step}
                                        </div>
                                        <div className="space-y-1">
                                            <h4 className="text-lg font-bold text-navy">{item.title}</h4>
                                            <p className="text-gray-600 text-sm leading-relaxed">{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl">
                            <Image 
                                src="https://images.unsplash.com/photo-1562664377-709f2c337eb2?q=80&w=1000&auto=format&fit=crop" 
                                alt="Professional Painting Site Work"
                                fill
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-navy/60 to-transparent" />
                            <div className="absolute bottom-8 left-8 right-8 text-white">
                                <p className="text-base font-medium italic">"Tawakkal Paint House made estimating our project so easy. The per-sqft breakdown matched the actual invoice perfectly!"</p>
                                <p className="text-xs mt-2 opacity-80">— Commercial Project, SITE Area Karachi</p>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}
