'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    MapPin, Phone, MessageCircle, Navigation, 
    ChevronRight, Info, Search, Building2 
} from 'lucide-react';
import { BRANCHES_DATA, Branch } from '@/data/branches';

export function BranchesHub() {
    const [selectedCity, setSelectedCity] = useState<string>('All');
    const [searchQuery, setSearchQuery] = useState<string>('');

    // Extract unique cities
    const cities = ['All', 'Karachi', 'Balkassar', 'Dera Ismail Khan'];

    // Filter branches based on city and search query
    const filteredBranches = BRANCHES_DATA.filter((branch) => {
        const matchesCity = selectedCity === 'All' || branch.city === selectedCity;
        const matchesSearch = 
            branch.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            branch.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
            branch.area.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCity && matchesSearch;
    });

    return (
        <div className="space-y-8">
            {/* Filter and Search Bar */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-6">
                {/* Cities Tabs */}
                <div className="flex flex-wrap gap-2 order-2 md:order-1">
                    {cities.map((city) => (
                        <button
                            key={city}
                            onClick={() => setSelectedCity(city)}
                            className={`px-5 py-3 rounded-xl border transition-all font-semibold text-sm ${
                                selectedCity === city
                                    ? 'border-gold bg-gold/5 text-navy ring-1 ring-gold shadow-sm'
                                    : 'border-gray-200 text-gray-500 hover:border-gold/50 hover:bg-gray-50'
                            }`}
                        >
                            {city} {city === 'All' ? `(${BRANCHES_DATA.length})` : `(${BRANCHES_DATA.filter(b => b.city === city).length})`}
                        </button>
                    ))}
                </div>

                {/* Search Box */}
                <div className="relative order-1 md:order-2 w-full md:max-w-xs">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search branches, areas..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 outline-none text-navy font-semibold focus:border-gold transition-colors text-sm"
                    />
                </div>
            </div>

            {/* Dynamic Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence mode="popLayout">
                    {filteredBranches.map((branch, idx) => (
                        <motion.div
                            layout
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                            key={branch.slug}
                            className="bg-white rounded-3xl p-6 shadow-sm hover:shadow-xl border border-gray-100 hover:border-gold/30 transition-all duration-300 flex flex-col group"
                        >
                            <div className="space-y-4 mb-6 flex-1">
                                {/* Badge and type */}
                                <div className="flex justify-between items-start">
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold border ${
                                        branch.type === 'Head Office'
                                            ? 'bg-red-50 text-red-700 border-red-200'
                                            : branch.type === 'Authorized Branch'
                                            ? 'bg-blue-50 text-blue-700 border-blue-200'
                                            : 'bg-gray-50 text-gray-700 border-gray-200'
                                    }`}>
                                        {branch.type}
                                    </span>
                                    <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">{branch.city}</span>
                                </div>

                                {/* Title */}
                                <div>
                                    <h3 className="text-lg font-bold text-navy group-hover:text-gold transition-colors leading-snug">
                                        {branch.name}
                                    </h3>
                                    {branch.landmark && (
                                        <p className="text-[11px] text-gold font-bold mt-0.5">Landmark: {branch.landmark}</p>
                                    )}
                                </div>

                                <div className="space-y-3 pt-3 border-t border-gray-50">
                                    {/* Address */}
                                    <div className="flex items-start gap-2.5 text-xs text-gray-500">
                                        <MapPin size={15} className="text-gold shrink-0 mt-0.5" />
                                        <span className="leading-relaxed line-clamp-2">{branch.address}</span>
                                    </div>

                                    {/* Phone */}
                                    <div className="flex items-center gap-2.5 text-xs text-gray-500">
                                        <Phone size={15} className="text-gold shrink-0" />
                                        <span>{branch.phones.join(' / ')}</span>
                                    </div>
                                </div>
                            </div>

                            {/* CTAs */}
                            <div className="space-y-3 pt-2">
                                <Link
                                    href={`/branches/${branch.slug}`}
                                    className="w-full py-3 bg-navy text-white hover:bg-navy-light rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-sm"
                                >
                                    <Info size={14} />
                                    View Store Details
                                </Link>

                                <div className="grid grid-cols-2 gap-2">
                                    <a
                                        href={`https://wa.me/${branch.whatsapp}?text=Hi! I am looking for paint prices at your *${branch.name}* branch.`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="py-2.5 bg-gray-50 hover:bg-[#25D366]/10 text-gray-700 hover:text-[#25D366] border border-gray-100 rounded-xl font-bold text-[11px] flex items-center justify-center gap-1.5 transition-all"
                                    >
                                        <MessageCircle size={13} />
                                        WhatsApp
                                    </a>
                                    <a
                                        href={branch.googleMapsUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="py-2.5 bg-gray-50 hover:bg-gold/10 text-gray-700 hover:text-navy border border-gray-100 rounded-xl font-bold text-[11px] flex items-center justify-center gap-1.5 transition-all"
                                    >
                                        <Navigation size={13} className="text-gold" />
                                        Directions
                                    </a>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {filteredBranches.length === 0 && (
                    <div className="col-span-full py-16 text-center space-y-3">
                        <Building2 size={48} className="text-gray-300 mx-auto" />
                        <p className="font-bold text-navy text-lg">No branches found matching your search</p>
                        <p className="text-gray-500 text-sm">Try clearing your filters or typing different keywords.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
