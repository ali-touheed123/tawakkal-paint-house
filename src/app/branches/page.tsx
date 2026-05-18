import { Metadata } from 'next';
import Image from 'next/image';
import { BranchesHub } from '@/components/BranchesHub';

export const metadata: Metadata = {
    title: 'Store Locator & Authorized Branches | Tawakkal Paint House',
    description: 'Find authorized Tawakkal Paint branches and stores in Karachi, Balkassar (Talagang Road), and Dera Ismail Khan. Find maps, directions, and direct phone/WhatsApp numbers.',
    openGraph: {
        title: 'Tawakkal Paint Store Locator & Branches',
        description: 'Locate our 7 retail & B2B distribution branches across Pakistan. Get instant directions, branch timings, and manager contacts.',
        url: 'https://tawakkalpainthouse.com/branches',
    }
};

export default function BranchesPage() {
    return (
        <div className="min-h-screen bg-off-white pb-16">
            {/* Cinematic Hero Section */}
            <section className="relative h-[55vh] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-navy/60 z-10" />
                    <Image
                        src="https://images.unsplash.com/photo-1562664377-709f2c337eb2?q=80&w=1800&auto=format&fit=crop"
                        alt="Authorized Paint Store Dealer Network"
                        fill
                        priority
                        className="w-full h-full object-cover"
                    />
                </div>

                <div className="relative z-20 text-center space-y-6 max-w-4xl px-4">
                    <div>
                        <span className="inline-block px-4 py-1.5 bg-gold/20 text-gold rounded-full text-sm font-medium tracking-wider uppercase mb-4 backdrop-blur-md border border-gold/30">
                            Authorized Dealer Network
                        </span>
                        <h1 className="text-4xl md:text-6xl font-heading font-bold text-white mb-6 leading-tight">
                            Store Locator &amp; <br />
                            <span className="text-gold">Our Branches</span>
                        </h1>
                        <p className="text-white/90 text-lg md:text-xl max-w-2xl mx-auto font-light leading-relaxed">
                            Discover official Tawakkal Paint House branches and verified dealer stores across Karachi, Punjab, and KPK.
                        </p>
                    </div>
                </div>
            </section>

            {/* Content Container */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-30">
                {/* Stats / Value Banner */}
                <div className="bg-white rounded-3xl shadow-2xl shadow-navy/5 p-8 md:p-12 mb-12 border border-gray-100">
                    <div className="grid md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-gray-100">
                        <div className="space-y-2 py-4 md:py-0">
                            <h3 className="text-3xl font-heading font-black text-navy">7</h3>
                            <p className="text-gray-500 text-sm">Active Authorized Locations</p>
                        </div>
                        <div className="space-y-2 py-4 md:py-0">
                            <h3 className="text-3xl font-heading font-black text-navy">3</h3>
                            <p className="text-gray-500 text-sm">Cities Serviced Across Pakistan</p>
                        </div>
                        <div className="space-y-2 py-4 md:py-0">
                            <h3 className="text-3xl font-heading font-black text-navy">100%</h3>
                            <p className="text-gray-500 text-sm">Genuine Sealed Paints Stocked</p>
                        </div>
                    </div>
                </div>

                {/* Branches Hub Client component */}
                <div className="space-y-16">
                    <BranchesHub />
                </div>
            </div>
        </div>
    );
}
