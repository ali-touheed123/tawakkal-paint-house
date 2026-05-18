import { Metadata } from 'next';
import Link from 'next/link';
import { 
    Calculator, MessageCircle, FileText, 
    CheckCircle2, Printer, AlertTriangle, ShieldCheck 
} from 'lucide-react';

export const metadata: Metadata = {
    title: 'Official Painter\'s Rate Card & Service Guide | Tawakkal Paint House',
    description: 'Access the official, standardized painter rate card issued by Tawakkal Paint House. Transparent per square feet material and labour rates for emulsion, primer, putty, and weather shield.',
    openGraph: {
        title: 'Tawakkal Paint House - Painter\'s Rate Card',
        description: 'Standardized painter rates for Karachi. Verified material + labour costs per square feet to ensure transparency.',
        url: 'https://tawakkalpainthouse.com/rates',
    }
};

export default function RatesCardPage() {
    // Official Section 1 rates from the document (per Sq.ft)
    const ratesData = [
        { name: 'Emulsion Paint', material: 8, labour: 4, total: 12 },
        { name: 'Primer', material: 8, labour: 4, total: 12 },
        { name: 'Filling (2-3 Coats)', material: 15, labour: 10, total: 25 },
        { name: 'Water Matt', material: 25, labour: 7, total: 32 },
        { name: 'Oil Matt', material: 28, labour: 7, total: 35 },
        { name: 'Weather Shield', material: 25, labour: 5, total: 30, surchargeNote: true },
    ];

    return (
        <div className="min-h-screen bg-off-white py-12 md:py-20 selection:bg-gold selection:text-navy">
            <div className="max-w-4xl mx-auto px-4 space-y-12">
                
                {/* Header */}
                <div className="text-center space-y-4">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gold/10 text-navy font-bold text-xs uppercase rounded-full tracking-wider border border-gold/20">
                        <FileText size={12} className="text-gold" />
                        Official Document
                    </span>
                    <h1 className="text-3xl md:text-5xl font-heading font-black text-navy leading-tight">
                        Painter's Rate Card <br />
                        <span className="text-gold">&amp; Service Guide</span>
                    </h1>
                    <p className="text-gray-500 text-sm md:text-base max-w-xl mx-auto font-medium">
                        Standardized and transparent painting rates for authorized painters and contractors, issued by Tawakkal Paint House.
                    </p>
                </div>

                {/* Main Rate Card Container */}
                <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl shadow-navy/5 border border-gray-100 space-y-8 relative overflow-hidden">
                    {/* Background accent */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 rounded-full blur-2xl" />

                    {/* Official Banner */}
                    <div className="bg-navy/5 border border-navy/10 rounded-2xl p-6 flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
                        <div className="w-12 h-12 rounded-xl bg-navy text-gold flex items-center justify-center shrink-0">
                            <ShieldCheck size={24} />
                        </div>
                        <div className="space-y-1">
                            <h4 className="font-bold text-navy text-sm">IMPORTANT PAINTERS ANNOUNCEMENT:</h4>
                            <p className="text-xs text-gray-600 leading-relaxed font-medium">
                                This rate card is issued for transparent and standardized client estimates. All listed rates are in **PKR per Square Feet (Sq.ft)**. Share this layout directly with property owners for pricing trust.
                            </p>
                        </div>
                    </div>

                    {/* Section 1: Rates Table */}
                    <div className="space-y-6">
                        <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                            <h3 className="text-xl font-bold text-navy flex items-center gap-2">
                                <span className="w-2.5 h-2.5 rounded-full bg-gold" />
                                Standard Service Rates (Per Sq.ft)
                            </h3>
                            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Unit: Sq.ft</span>
                        </div>

                        {/* Responsive Table */}
                        <div className="overflow-hidden border border-gray-100 rounded-2xl shadow-sm">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-navy/5 text-navy font-bold text-xs md:text-sm border-b border-gray-100">
                                        <th className="p-4 md:p-5">Paint / Service Type</th>
                                        <th className="p-4 md:p-5 text-center">Material Cost</th>
                                        <th className="p-4 md:p-5 text-center">Labour Cost</th>
                                        <th className="p-4 md:p-5 text-right font-black text-navy">Total Cost</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50 text-xs md:text-sm text-gray-600 font-medium">
                                    {ratesData.map((rate, index) => (
                                        <tr key={index} className="hover:bg-gray-50/50 transition-colors">
                                            <td className="p-4 md:p-5 font-bold text-navy flex flex-col gap-0.5">
                                                {rate.name}
                                                {rate.surchargeNote && (
                                                    <span className="text-[10px] text-gold font-semibold">*Floor labor surcharge applies</span>
                                                )}
                                            </td>
                                            <td className="p-4 md:p-5 text-center">Rs. {rate.material}</td>
                                            <td className="p-4 md:p-5 text-center">Rs. {rate.labour}</td>
                                            <td className="p-4 md:p-5 text-right font-black text-navy">Rs. {rate.total}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Surcharges & Notes Footnotes */}
                    <div className="bg-amber-50/50 border border-amber-200/50 rounded-2xl p-6 space-y-3">
                        <h4 className="text-xs font-bold text-amber-800 uppercase tracking-wider flex items-center gap-1.5">
                            <AlertTriangle size={14} className="text-gold" />
                            * Weather Shield Floor Surcharge Rules:
                        </h4>
                        <p className="text-xs text-amber-700 leading-relaxed font-semibold">
                            Floor Labour Surcharge: Ground floor = Rs. 5/sq.ft. Each additional floor adds Rs. 2/sq.ft. (E.g., 1st Floor = Rs. 7, 2nd Floor = Rs. 9, 3rd Floor = Rs. 11, and so on).
                        </p>
                    </div>

                    <hr className="border-gray-100" />

                    {/* Actions and WhatsApp Binds */}
                    <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                        <div className="space-y-1 text-center sm:text-left">
                            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Authorized Owner</p>
                            <p className="text-sm font-bold text-navy">Asif Khan (Tawakkal Paint House)</p>
                        </div>

                        <div className="flex flex-wrap gap-3 w-full sm:w-auto">
                            <a
                                href="https://wa.me/923452401361?text=Hi Asif! I am looking at the Painter's Rate Card and want to discuss custom pricing estimations."
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex-1 sm:flex-none bg-[#25D366] hover:bg-[#1EBE53] text-white py-3 px-6 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-sm"
                            >
                                <MessageCircle size={15} />
                                WhatsApp Store Owner
                            </a>
                            <button
                                onClick={() => typeof window !== 'undefined' && window.print()}
                                className="flex-1 sm:flex-none border border-navy/20 hover:border-navy text-navy py-3 px-6 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all"
                            >
                                <Printer size={15} />
                                Print Rate Card
                            </button>
                        </div>
                    </div>
                </div>

                {/* Additional Guidelines */}
                <div className="grid md:grid-cols-2 gap-6 text-xs sm:text-sm text-gray-500 font-medium leading-relaxed">
                    <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-2">
                        <h4 className="font-bold text-navy flex items-center gap-1.5">
                            <CheckCircle2 size={16} className="text-gold" />
                            Genuine Paints Only
                        </h4>
                        <p className="text-gray-600 text-xs">
                            Always purchase verified factory-sealed buckets from authorized distributors. We deal directly in high-grade authentic brands like **Brighto**, **Gobi\'s**, and **Reliable** to ensure optimal coverage and durability.
                        </p>
                    </div>
                    <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-2">
                        <h4 className="font-bold text-navy flex items-center gap-1.5">
                            <CheckCircle2 size={16} className="text-gold" />
                            Estimated Quantities
                        </h4>
                        <p className="text-gray-600 text-xs">
                            Exact material requirements can vary depending on wall absorption, coat density, and surface preparation using **Reliable Wall Putty** or standard primers. Contact our store representative for dynamic consults.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
