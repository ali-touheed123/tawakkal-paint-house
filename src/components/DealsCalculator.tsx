'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Shield, Star, Crown, Construction, Ruler, Building2, HardHat, MapPin } from 'lucide-react';
import { useSettings, useDiscountRules } from '@/lib/hooks/useSettings';
import { DealPackage } from '@/types';

const PROPERTY_SIZES = [
    { gaz: 80, sqft: 720 },
    { gaz: 120, sqft: 1080 },
    { gaz: 160, sqft: 1440 },
    { gaz: 180, sqft: 1620 },
    { gaz: 200, sqft: 1800 },
    { gaz: 300, sqft: 2700 },
    { gaz: 400, sqft: 3600 },
    { gaz: 500, sqft: 4500 },
    { gaz: 1000, sqft: 9000 },
];

const DEFAULT_PACKAGES: DealPackage[] = [
    {
        id: 'local',
        name: 'Local Quality',
        icon: Construction,
        description: 'Budget-friendly standard painting',
        includes: ['Emulsion', 'Oil Paint'],
        color: 'text-gray-500',
        bg: 'bg-gray-100',
        border: 'border-gray-200'
    },
    {
        id: 'normal',
        name: 'Normal Quality',
        icon: Shield,
        description: 'Durable quality for everyday living',
        includes: ['Emulsion', 'Oil Paint'],
        color: 'text-blue-500',
        bg: 'bg-blue-50',
        border: 'border-blue-200'
    },
    {
        id: 'best',
        name: 'Best Quality',
        icon: Star,
        description: 'Premium protection and finish',
        includes: ['Weather', 'Emulsion', 'Oil Paint'],
        color: 'text-gold',
        bg: 'bg-yellow-50',
        border: 'border-gold/30'
    },
    {
        id: 'premium',
        name: 'Premium Quality',
        icon: Crown,
        description: 'The ultimate luxury paint experience',
        includes: ['Filling', 'Matt', 'Weather', 'Emulsion', 'Oil Paint'],
        color: 'text-purple-500',
        bg: 'bg-purple-50',
        border: 'border-purple-200'
    }
];

export function DealsCalculator() {
    const { settings } = useSettings();
    const { calculateDiscount } = useDiscountRules();
    const [selectedSize, setSelectedSize] = useState(PROPERTY_SIZES[0]);
    const [withLabour, setWithLabour] = useState(true);
    const [withVisit, setWithVisit] = useState(true);

    // Get dynamic config from settings or use defaults
    const rawPackages = (settings?.deals_packages_config || DEFAULT_PACKAGES) as DealPackage[];
    const labourDiscount = Number(settings?.deals_labour_discount || 25);
    const visitFee = Number(settings?.deals_visit_fee || 1000);

    // Merge dynamic config with static UI properties (icons/colors)
    const PACKAGES: DealPackage[] = rawPackages.map((pkg: DealPackage) => {
        const defaultPkg = DEFAULT_PACKAGES.find(p => p.id === pkg.id) || DEFAULT_PACKAGES[0];
        return {
            ...defaultPkg,
            ...pkg,
            icon: defaultPkg.icon // Keep icons static as they can't be stored easily in JSON
        };
    });

    // Fallback prices if settings aren't loaded or set yet
    const defaultBasePricing = {
        local: 50000,
        normal: 100000,
        best: 200000,
        premium: 370000
    };

    const basePricing = settings?.deals_base_pricing || defaultBasePricing;

    const calculatePrice = (packageId: string) => {
        const basePrice = (basePricing as any)[packageId] || 0;
        const sizeMultiplier = selectedSize.sqft / 720;
        const rawPrice = basePrice * sizeMultiplier;

        // Labour logic: use dynamic discount %
        let finalPrice = withLabour ? rawPrice : rawPrice * (1 - labourDiscount / 100);

        // Site Visit fee: use dynamic fee
        if (withVisit) {
            finalPrice += visitFee;
        }

        return finalPrice;
    };

    return (
        <div className="max-w-7xl mx-auto space-y-12">
            {/* Configuration Header */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 space-y-8">

                {/* Size Selection */}
                <div className="space-y-4">
                    <h2 className="text-2xl font-bold text-navy flex items-center gap-2">
                        <Ruler className="text-gold" />
                        Select Property Size
                    </h2>
                    <div className="flex flex-wrap gap-3">
                        {PROPERTY_SIZES.map((size) => (
                            <button
                                key={size.gaz}
                                onClick={() => setSelectedSize(size)}
                                className={`px-5 py-3 rounded-xl border transition-all font-medium flex flex-col items-center ${selectedSize.gaz === size.gaz
                                    ? 'border-gold bg-gold/5 text-navy shadow-sm ring-1 ring-gold'
                                    : 'border-gray-200 text-gray-500 hover:border-gold/50'
                                    }`}
                            >
                                <span className="text-lg">{size.gaz} Gaz</span>
                                <span className="text-xs opacity-70">{size.sqft} sq/ft</span>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4 sm:gap-6 pt-6 border-t border-gray-100">
                    {/* Property Details Summary */}
                    <div className="bg-gray-50 rounded-2xl p-4 sm:p-6 flex flex-col justify-center space-y-4 w-full overflow-hidden">
                        <h3 className="font-bold text-gray-600 uppercase tracking-wider text-xs sm:text-sm">Property Details</h3>
                        <div className="flex gap-3 sm:gap-4 items-center">
                            <Building2 className="text-gold flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10" />
                            <div className="min-w-0">
                                <p className="text-xl sm:text-2xl font-bold text-navy truncate">{selectedSize.gaz} Gaz House</p>
                                <p className="text-xs sm:text-sm text-gray-500 break-words leading-relaxed">{selectedSize.sqft} Square Feet • 2 Floors • Inside + Outside</p>
                            </div>
                        </div>
                    </div>

                    {/* Labour Toggle */}
                    <div className="bg-gray-50 rounded-2xl p-4 sm:p-6 flex flex-col justify-center items-start lg:items-end w-full overflow-hidden">
                        <div className="space-y-4 w-full">
                            <h3 className="font-bold text-gray-600 uppercase tracking-wider text-xs sm:text-sm lg:text-right">Service Type</h3>
                            <label className="flex items-center gap-3 sm:gap-4 cursor-pointer p-3 sm:p-4 bg-white rounded-xl border border-gray-200 hover:border-gold transition-colors w-full">
                                <div className={`p-2 sm:p-3 rounded-full flex-shrink-0 ${withLabour ? 'bg-gold/10 text-gold' : 'bg-gray-100 text-gray-600'}`}>
                                    <HardHat className="w-5 h-5 sm:w-6 sm:h-6" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="font-bold text-navy text-sm sm:text-base leading-tight mb-0.5">With Labour & Material</div>
                                    <div className="text-[10px] sm:text-xs text-gray-500 leading-tight">Uncheck for material only (-{labourDiscount}%)</div>
                                </div>
                                <div className="relative flex-shrink-0 ml-1">
                                    <div className={`w-10 h-5 sm:w-12 sm:h-6 rounded-full transition-colors ${withLabour ? 'bg-gold' : 'bg-gray-300'}`}>
                                        <div className={`absolute top-0.5 sm:top-1 w-4 h-4 rounded-full bg-white transition-all ${withLabour ? 'left-[22px] sm:left-7' : 'left-0.5 sm:left-1'}`} />
                                    </div>
                                    <input
                                        type="checkbox"
                                        className="hidden"
                                        checked={withLabour}
                                        onChange={(e) => setWithLabour(e.target.checked)}
                                        aria-label="Include Labour & Material"
                                    />
                                </div>
                            </label>

                            <label className="flex items-center gap-3 sm:gap-4 cursor-pointer p-3 sm:p-4 bg-white rounded-xl border border-gray-200 hover:border-gold transition-colors w-full">
                                <div className={`p-2 sm:p-3 rounded-full flex-shrink-0 ${withVisit ? 'bg-gold/10 text-gold' : 'bg-gray-100 text-gray-600'}`}>
                                    <MapPin className="w-5 h-5 sm:w-6 sm:h-6" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="font-bold text-navy text-sm sm:text-base leading-tight mb-0.5">Site Visit & Measurement</div>
                                    <div className="text-[10px] sm:text-xs text-gray-500 leading-tight">Professional inspection (+Rs. {visitFee.toLocaleString()})</div>
                                </div>
                                <div className="relative flex-shrink-0 ml-1">
                                    <div className={`w-10 h-5 sm:w-12 sm:h-6 rounded-full transition-colors ${withVisit ? 'bg-gold' : 'bg-gray-300'}`}>
                                        <div className={`absolute top-0.5 sm:top-1 w-4 h-4 rounded-full bg-white transition-all ${withVisit ? 'left-[22px] sm:left-7' : 'left-0.5 sm:left-1'}`} />
                                    </div>
                                    <input
                                        type="checkbox"
                                        className="hidden"
                                        checked={withVisit}
                                        onChange={(e) => setWithVisit(e.target.checked)}
                                        aria-label="Include Site Visit & Measurement"
                                    />
                                </div>
                            </label>
                        </div>
                    </div>
                </div>
            </div>

            {/* Packages Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {PACKAGES.map((pkg, index) => {
                    const Icon = pkg.icon;
                    const price = calculatePrice(pkg.id);

                    return (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            key={pkg.id}
                            className={`bg-white rounded-3xl p-6 shadow-sm border ${pkg.border} flex flex-col relative overflow-hidden group hover:shadow-lg transition-all`}
                        >
                            {/* Decorative Background Blob */}
                            <div className={`absolute -right-8 -top-8 w-32 h-32 rounded-full opacity-10 blur-2xl transition-transform group-hover:scale-150 ${pkg.bg?.replace('bg-', 'bg-')}`} />

                            <div className="space-y-4 mb-8 relative">
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${pkg.bg} ${pkg.color}`}>
                                    {Icon && <Icon size={24} />}
                                </div>

                                <div>
                                    <h3 className="text-xl font-bold text-navy">{pkg.name}</h3>
                                    <p className="text-sm text-gray-500 h-10">{pkg.description}</p>
                                </div>

                                <div className="pt-4 border-t border-gray-100">
                                    <div className="text-sm font-bold text-gray-600 uppercase tracking-wider mb-1">Estimated Cost</div>
                                    <div className="text-3xl font-black text-navy flex items-baseline gap-1">
                                        <span className="text-lg">Rs.</span>
                                        {price.toLocaleString()}
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3 flex-1 relative">
                                <div className="text-sm font-bold text-navy mb-2">Includes:</div>
                                {pkg.includes.map((item, i) => (
                                    <div key={i} className="flex items-center gap-2 text-sm text-gray-600">
                                        <Check size={16} className={pkg.color} />
                                        {item}
                                    </div>
                                ))}
                            </div>

                            <a
                                href={`https://wa.me/${settings?.contact?.whatsapp || '923475658761'}?text=Hi! I am interested in booking the *${pkg.name}* package for my *${selectedSize.gaz} Gaz* property.\n\nEstimated Cost: Rs. ${price.toLocaleString()}\nIncludes Labour: ${withLabour ? 'Yes' : 'No'}\nSite Visit Requested: ${withVisit ? 'Yes' : 'No'}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`w-full mt-8 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${pkg.id === 'local' ? 'bg-white border border-gray-200 text-navy hover:bg-gray-50 hover:border-gray-300' :
                                    pkg.id === 'normal' ? 'bg-[#007bff] text-white hover:bg-[#0056b3]' :
                                        pkg.id === 'best' ? 'bg-[#ff7f00] text-white hover:bg-[#cc6600]' :
                                            pkg.id === 'premium' ? 'bg-[#ffd700] text-navy hover:bg-[#e6c200]' :
                                                'bg-gray-100 text-navy hover:bg-gray-200'
                                    }`}
                            >
                                Book on WhatsApp
                            </a>
                        </motion.div>
                    );
                })}
            </div>

            <div className="text-center text-sm text-gray-600 mt-8">
                * Please note that this is an estimated cost based on standard home structures. Actual costs may vary slightly based on property condition and specific requirements.
            </div>
        </div>
    );
}
