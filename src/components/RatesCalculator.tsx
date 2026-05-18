'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Check, Ruler, HardHat, Building2, Paintbrush, 
    Sparkles, Shield, Coins, CheckCircle2 
} from 'lucide-react';
import { useSettings } from '@/lib/hooks/useSettings';

const PROPERTY_PACKAGES = [
    {
        gaz: 80,
        pricing: { local: 50000, normal: 100000, best: 200000, premium: 370000 }
    },
    {
        gaz: 120,
        pricing: { local: 75000, normal: 150000, best: 300000, premium: 555000 }
    },
    {
        gaz: 160,
        pricing: { local: 100000, normal: 200000, best: 400000, premium: 740000 }
    },
    {
        gaz: 180,
        pricing: { local: 112500, normal: 225000, best: 450000, premium: 832500 }
    },
    {
        gaz: 200,
        pricing: { local: 125000, normal: 250000, best: 500000, premium: 925000 }
    },
    {
        gaz: 300,
        pricing: { local: 187500, normal: 375000, best: 750000, premium: 1387500 }
    },
    {
        gaz: 400,
        pricing: { local: 250000, normal: 500000, best: 1000000, premium: 1850000 }
    }
];

const CUSTOM_SERVICES = [
    {
        id: 'emulsion',
        name: 'Emulsion Paint',
        description: 'Smooth decorative interior wall paint',
        material: 8,
        labour: 4,
        total: 12
    },
    {
        id: 'primer',
        name: 'Primer Coat',
        description: 'Undercoat for better paint adhesion',
        material: 8,
        labour: 4,
        total: 12
    },
    {
        id: 'filling',
        name: 'Filling (2-3 Coats)',
        description: 'Wall putty for flawless crack-free finish',
        material: 15,
        labour: 10,
        total: 25
    },
    {
        id: 'water_matt',
        name: 'Water Matt Finish',
        description: 'Elegant non-reflective wash-resistant coating',
        material: 25,
        labour: 7,
        total: 32
    },
    {
        id: 'oil_matt',
        name: 'Oil Matt Finish',
        description: 'Ultra-durable stain-proof solvent coating',
        material: 28,
        labour: 7,
        total: 35
    },
    {
        id: 'weather',
        name: 'Weather Shield',
        description: 'Sun, rain, and moisture resistant exterior paint',
        material: 25,
        labour: 5,
        total: 30
    }
];

const PACKAGE_METADATA = [
    {
        id: 'local',
        name: 'Local Quality',
        description: 'Budget-friendly basic finish',
        includes: ['Emulsion Paint', 'Oil Paint'],
        badgeColor: 'bg-gray-100 text-gray-700 border-gray-200',
        borderColor: 'border-gray-200 hover:border-gray-400',
        glowColor: 'group-hover:shadow-gray-200/50'
    },
    {
        id: 'normal',
        name: 'Normal Quality',
        description: 'Good durability for regular homes',
        includes: ['Emulsion Paint', 'Oil Paint (Better Grade)'],
        badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
        borderColor: 'border-blue-200 hover:border-blue-400',
        glowColor: 'group-hover:shadow-blue-200/50'
    },
    {
        id: 'best',
        name: 'Best Quality',
        description: 'High protection & beautiful sheen',
        includes: ['Weather Shield', 'Emulsion Paint', 'Oil Paint'],
        badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
        borderColor: 'border-gold/30 hover:border-gold',
        glowColor: 'group-hover:shadow-gold/20'
    },
    {
        id: 'premium',
        name: 'Premium Quality',
        description: 'Super-premium flawless luxury look',
        includes: ['Wall Putty / Filling', 'Matt Paint', 'Weather Shield', 'Emulsion Paint', 'Oil Paint', 'Primer Coat'],
        badgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
        borderColor: 'border-purple-200 hover:border-purple-400',
        glowColor: 'group-hover:shadow-purple-200/50'
    }
];

export function RatesCalculator() {
    const { settings } = useSettings();
    const [activeTab, setActiveTab] = useState<'packages' | 'custom'>('packages');
    
    // Package Tab State
    const [selectedSizeIndex, setSelectedSizeIndex] = useState(1); // 120 Gaz default
    const activeSize = PROPERTY_PACKAGES[selectedSizeIndex];

    // Custom Tab State
    const [customArea, setCustomArea] = useState<number>(1000);
    const [selectedServices, setSelectedServices] = useState<string[]>(['emulsion', 'primer', 'filling']);

    // Toggle dynamic service selection
    const toggleService = (id: string) => {
        setSelectedServices(prev => 
            prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
        );
    };

    // Calculate Custom totals
    const customTotals = selectedServices.reduce((totals, id) => {
        const service = CUSTOM_SERVICES.find(s => s.id === id);
        if (service) {
            totals.material += service.material * customArea;
            totals.labour += service.labour * customArea;
            totals.total += service.total * customArea;
        }
        return totals;
    }, { material: 0, labour: 0, total: 0 });

    const whatsappContact = settings?.contact?.whatsapp || '923475658761';

    return (
        <div className="max-w-7xl mx-auto space-y-8">
            {/* Rates Switcher Tabs */}
            <div className="flex justify-center p-1 bg-gray-100 rounded-2xl max-w-lg mx-auto border border-gray-200/50">
                <button
                    onClick={() => setActiveTab('packages')}
                    className={`flex-1 py-3 px-6 rounded-xl font-bold transition-all text-center flex items-center justify-center gap-2 ${
                        activeTab === 'packages'
                            ? 'bg-navy text-white shadow-md'
                            : 'text-gray-500 hover:text-navy'
                    }`}
                >
                    <Building2 size={18} />
                    Packages by Gaz
                </button>
                <button
                    onClick={() => setActiveTab('custom')}
                    className={`flex-1 py-3 px-6 rounded-xl font-bold transition-all text-center flex items-center justify-center gap-2 ${
                        activeTab === 'custom'
                            ? 'bg-navy text-white shadow-md'
                            : 'text-gray-500 hover:text-navy'
                    }`}
                >
                    <Ruler size={18} />
                    Custom Sq.ft Rates
                </button>
            </div>

            {/* TAB CONTENT */}
            <AnimatePresence mode="wait">
                {activeTab === 'packages' ? (
                    <motion.div
                        key="packages"
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -15 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-8"
                    >
                        {/* Size Selection Box */}
                        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100 space-y-6">
                            <div className="space-y-2">
                                <h2 className="text-2xl font-bold text-navy flex items-center gap-2">
                                    <Ruler className="text-gold" />
                                    Choose Property Size
                                </h2>
                                <p className="text-gray-500 text-sm">Select your property size to estimate full home painting job costs (Labour + Material).</p>
                            </div>
                            
                            <div className="flex flex-wrap gap-2.5 sm:gap-3">
                                {PROPERTY_PACKAGES.map((size, index) => (
                                    <button
                                        key={size.gaz}
                                        onClick={() => setSelectedSizeIndex(index)}
                                        className={`px-5 py-3.5 rounded-xl border transition-all font-semibold flex items-center justify-center min-w-[90px] ${
                                            selectedSizeIndex === index
                                                ? 'border-gold bg-gold/5 text-navy shadow-sm ring-1 ring-gold'
                                                : 'border-gray-200 text-gray-500 hover:border-gold/50 hover:bg-gray-50'
                                        }`}
                                    >
                                        <span className="text-sm sm:text-base">{size.gaz} Gaz</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Complete Packages Grid */}
                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {PACKAGE_METADATA.map((pkg, idx) => {
                                const packagePrice = (activeSize.pricing as any)[pkg.id] || 0;

                                return (
                                    <motion.div
                                        initial={{ opacity: 0, y: 15 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.05 }}
                                        key={pkg.id}
                                        className={`bg-white rounded-3xl p-6 shadow-sm border flex flex-col relative overflow-hidden group hover:shadow-xl transition-all duration-300 ${pkg.borderColor} ${pkg.glowColor}`}
                                    >
                                        <div className="space-y-4 mb-6 flex-1">
                                            {/* Tag */}
                                            <div className="flex justify-between items-start">
                                                <span className={`px-3 py-1 rounded-full text-xs font-bold border ${pkg.badgeColor}`}>
                                                    {pkg.name}
                                                </span>
                                            </div>

                                            <div>
                                                <h3 className="text-lg font-bold text-navy">{pkg.name}</h3>
                                                <p className="text-xs text-gray-500 leading-relaxed min-h-[32px] mt-1">{pkg.description}</p>
                                            </div>

                                            {/* Cost Summary */}
                                            <div className="pt-4 border-t border-gray-100">
                                                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Estimated Package Cost</div>
                                                <div className="text-2xl font-black text-navy flex items-baseline gap-1">
                                                    <span className="text-sm">Rs.</span>
                                                    {packagePrice.toLocaleString()}
                                                </div>
                                            </div>

                                            {/* Inclusions */}
                                            <div className="pt-4 space-y-2">
                                                <div className="text-xs font-bold text-navy">Included Services:</div>
                                                {pkg.includes.map((inc, i) => (
                                                    <div key={i} className="flex items-center gap-2 text-xs text-gray-600">
                                                        <CheckCircle2 size={14} className="text-gold shrink-0" />
                                                        <span>{inc}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <a
                                            href={`https://wa.me/${whatsappContact}?text=Hi! I am interested in booking the *${pkg.name}* package for my *${activeSize.gaz} Gaz* property.\n\nEstimated Cost: Rs. ${packagePrice.toLocaleString()}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className={`w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 text-sm transition-all ${
                                                pkg.id === 'best' 
                                                    ? 'bg-gold text-navy hover:bg-gold-light'
                                                    : 'bg-navy text-white hover:bg-navy-light'
                                            }`}
                                        >
                                            Book on WhatsApp
                                        </a>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="custom"
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -15 }}
                        transition={{ duration: 0.3 }}
                        className="grid lg:grid-cols-3 gap-8"
                    >
                        {/* Configurator Box (Left & Mid) */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Area Input & Slider */}
                            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100 space-y-6">
                                <div className="flex justify-between items-center">
                                    <div className="space-y-1">
                                        <h2 className="text-2xl font-bold text-navy flex items-center gap-2">
                                            <Ruler className="text-gold" />
                                            Enter Wall Area
                                        </h2>
                                        <p className="text-gray-500 text-sm">Enter or slide the estimated total surface area of your walls in Square Feet.</p>
                                    </div>
                                    <div className="bg-gray-50 border border-gray-200 px-4 py-2 rounded-xl flex items-center gap-1.5 shrink-0">
                                        <input
                                            type="number"
                                            value={customArea}
                                            onChange={(e) => setCustomArea(Math.max(0, Number(e.target.value)))}
                                            className="w-20 bg-transparent text-right font-bold text-navy outline-none border-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                        />
                                        <span className="font-semibold text-gray-500 text-sm">Sq.ft</span>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <input
                                        type="range"
                                        min="100"
                                        max="15000"
                                        step="100"
                                        value={customArea}
                                        onChange={(e) => setCustomArea(Number(e.target.value))}
                                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-gold"
                                    />
                                    <div className="flex justify-between text-xs text-gray-400 font-semibold">
                                        <span>100 Sq.ft</span>
                                        <span>7,500 Sq.ft</span>
                                        <span>15,000 Sq.ft</span>
                                    </div>
                                </div>
                            </div>

                            {/* Service Selector List */}
                            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100 space-y-4">
                                <h3 className="text-xl font-bold text-navy flex items-center gap-2">
                                    <Paintbrush className="text-gold" />
                                    Select Services Needed
                                </h3>
                                
                                <div className="grid sm:grid-cols-2 gap-3">
                                    {CUSTOM_SERVICES.map((service) => {
                                        const isSelected = selectedServices.includes(service.id);

                                        return (
                                            <div
                                                key={service.id}
                                                onClick={() => toggleService(service.id)}
                                                className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-start gap-3 select-none ${
                                                    isSelected
                                                        ? 'border-gold bg-gold/5 shadow-sm'
                                                        : 'border-gray-200 hover:border-gray-300 bg-white'
                                                }`}
                                            >
                                                <div className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                                                    isSelected ? 'bg-gold border-gold text-navy' : 'border-gray-300'
                                                }`}>
                                                    {isSelected && <Check size={14} strokeWidth={3} />}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="font-bold text-navy text-sm sm:text-base leading-tight mb-0.5 flex justify-between gap-1 items-baseline">
                                                        <span className="truncate">{service.name}</span>
                                                        <span className="text-xs text-gold shrink-0">Rs.{service.total}/sf</span>
                                                    </div>
                                                    <p className="text-[11px] text-gray-400 leading-tight truncate">{service.description}</p>
                                                    <div className="flex gap-2.5 mt-2 text-[10px] text-gray-500 font-medium">
                                                        <span>Mat: Rs.{service.material}</span>
                                                        <span className="text-gray-300">|</span>
                                                        <span>Lab: Rs.{service.labour}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* Sticky Cost Calculation Summary Box (Right) */}
                        <div className="space-y-6">
                            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-lg border border-gray-100 space-y-6 sticky top-24">
                                <div className="space-y-1">
                                    <h3 className="text-xl font-bold text-navy">Calculation Summary</h3>
                                    <p className="text-gray-400 text-xs font-medium">Calculations based on standard rates card per Square Foot.</p>
                                </div>

                                <div className="space-y-4">
                                    <div className="bg-gray-50 p-4 rounded-2xl space-y-3.5">
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-gray-500 font-semibold flex items-center gap-1.5">
                                                <Ruler size={16} className="text-gray-400" />
                                                Wall Area
                                            </span>
                                            <span className="font-bold text-navy">{customArea.toLocaleString()} Sq.ft</span>
                                        </div>
                                        
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-gray-500 font-semibold flex items-center gap-1.5">
                                                <Sparkles size={16} className="text-gray-400" />
                                                Services Selected
                                            </span>
                                            <span className="font-bold text-navy">{selectedServices.length} Selected</span>
                                        </div>

                                        <div className="border-t border-gray-200/70 pt-3.5 space-y-2 text-xs">
                                            <div className="flex justify-between items-center text-gray-500">
                                                <span>Material Cost Estimate</span>
                                                <span className="font-semibold text-navy">Rs. {customTotals.material.toLocaleString()}</span>
                                            </div>
                                            <div className="flex justify-between items-center text-gray-500">
                                                <span>Labour Cost Estimate</span>
                                                <span className="font-semibold text-navy">Rs. {customTotals.labour.toLocaleString()}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Total Box */}
                                    <div className="bg-gold/10 p-5 rounded-2xl border border-gold/20 flex flex-col items-center justify-center text-center space-y-1">
                                        <span className="text-xs font-bold text-navy/70 uppercase tracking-wider">Estimated Total</span>
                                        <span className="text-3xl font-black text-navy flex items-baseline gap-1">
                                            <span className="text-sm font-bold">Rs.</span>
                                            {customTotals.total.toLocaleString()}
                                        </span>
                                        <span className="text-[10px] text-gray-400 font-semibold leading-none pt-1">Material + Labour Included</span>
                                    </div>
                                </div>

                                <a
                                    href={`https://wa.me/${whatsappContact}?text=Hi! I used your online Cost Estimator to calculate custom painting rates.\n\nWall Area: ${customArea} Sq.ft\nServices Selected: ${selectedServices.map(id => CUSTOM_SERVICES.find(s => s.id === id)?.name).join(', ')}\n\nEstimated Total: Rs. ${customTotals.total.toLocaleString()}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full py-4 bg-navy hover:bg-navy-light text-white font-bold rounded-2xl flex items-center justify-center gap-2.5 transition-all text-base shadow-md"
                                >
                                    <HardHat size={18} />
                                    Book Job on WhatsApp
                                </a>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="bg-navy/5 border border-navy/10 rounded-2xl p-5 text-sm text-navy/80 space-y-2">
                <p className="font-bold flex items-center gap-1.5 text-navy">
                    <Coins size={16} />
                    Calculations Info & Disclaimer:
                </p>
                <ul className="list-disc list-inside space-y-1 text-xs text-gray-600 font-medium">
                    <li>Package estimates represent a complete interior + exterior paint job based on standard home dimensions in Gaz.</li>
                    <li>Custom calculations are based on exact surface area in Square Feet. Material and labour costs are derived from Tawakkal Paint's standard rate card.</li>
                    <li>Actual site costs may vary slightly based on actual wall inspection, cracks, dampness, and coat requirements.</li>
                </ul>
            </div>
        </div>
    );
}
