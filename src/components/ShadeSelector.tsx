'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Search, Info } from 'lucide-react';
import Image from 'next/image';

import { Shade } from '@/types';

interface ShadeSelectorProps {
    shades: Shade[];
    selectedSize: string;
    onSelect: (shade: Shade) => void;
}

export function ShadeSelector({ shades, selectedSize, onSelect }: ShadeSelectorProps) {
    const [selectedShadeId, setSelectedShadeId] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    const filteredShades = useMemo(() => {
        let result = shades;
        
        if (selectedSize === 'drum') {
            result = result.filter(s => s.is_drum_available);
        }
        
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            result = result.filter(s => 
                s.name.toLowerCase().includes(query) || 
                s.code.toLowerCase().includes(query)
            );
        }
        
        return result;
    }, [shades, selectedSize, searchQuery]);

    // Ensure selected shade stays valid after filtering
    useMemo(() => {
        if (selectedShadeId && !filteredShades.some(s => s.id === selectedShadeId)) {
            setSelectedShadeId(null);
        }
    }, [filteredShades, selectedShadeId]);

    const handleSelect = (shade: Shade) => {
        setSelectedShadeId(shade.id);
        onSelect(shade);
    };

    const selectedShade = shades.find(s => s.id === selectedShadeId);
    const isImageBased = shades.some(s => s.image_url);

    return (
        <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-start gap-3">
                <Info className="text-blue-500 shrink-0 mt-0.5" size={20} />
                <div className="text-sm text-blue-900 leading-relaxed font-medium">
                    <p className="font-bold mb-1">How to choose your color:</p>
                    <ol className="list-decimal pl-4 space-y-1">
                        <li>Choose your favorite color from the official printed shade card.</li>
                        <li>Search and select that shade's name or code from the list below.</li>
                        <li>Add it to your cart!</li>
                    </ol>
                </div>
            </div>

            <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-baseline gap-2">
                        <h3 className="text-sm font-bold text-navy uppercase tracking-widest">
                            {isImageBased ? 'Choose Shade' : 'Select Shade Name'}
                        </h3>
                        {selectedShade && (
                            <span className="text-sm font-bold text-blue-600">: {selectedShade.name} ({selectedShade.code})</span>
                        )}
                    </div>
                    {selectedSize === 'drum' && (
                        <span className="text-[10px] font-bold text-gold uppercase bg-gold/10 px-2 flex-shrink-0 py-1 rounded">
                            Only 3 Shades for Drum
                        </span>
                    )}
                </div>

                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search shade name or code..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy text-sm font-medium transition-all"
                    />
                </div>
            </div>

            {isImageBased ? (
                /* Image-based swatches — keep as is for actual textures */
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-h-[400px] overflow-y-auto pr-2 scrollbar-hide py-2">
                    <AnimatePresence mode="popLayout">
                        {filteredShades.map((shade) => (
                            <motion.button
                                key={shade.id}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                onClick={() => handleSelect(shade)}
                                className={`relative rounded-xl overflow-hidden border-2 transition-all ${selectedShadeId === shade.id
                                    ? 'border-navy shadow-lg scale-[1.03] z-10'
                                    : 'border-transparent hover:border-navy/30'
                                    }`}
                                title={`${shade.name} (${shade.code})`}
                                aria-pressed={selectedShadeId === shade.id}
                            >
                                <div className="w-full aspect-square relative">
                                    <Image
                                        src={shade.image_url!}
                                        alt={shade.name}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                {selectedShadeId === shade.id && (
                                    <div className="absolute inset-0 bg-navy/20 flex items-center justify-center">
                                        <div className="bg-white rounded-full p-1 shadow-md">
                                            <Check size={14} className="text-navy" />
                                        </div>
                                    </div>
                                )}
                                <div className="bg-white/90 backdrop-blur-sm px-2 py-1.5 text-center absolute bottom-0 left-0 right-0">
                                    <p className="text-[11px] font-bold text-navy leading-tight">{shade.name}</p>
                                    <p className="text-[10px] text-gray-500">{shade.code}</p>
                                </div>
                            </motion.button>
                        ))}
                    </AnimatePresence>
                </div>
            ) : (
                /* Text Pills — replacing hex color circles */
                <div className="flex flex-wrap gap-2.5 max-h-[400px] overflow-y-auto pr-2 scrollbar-hide py-2">
                    <AnimatePresence mode="popLayout">
                        {filteredShades.length > 0 ? (
                            filteredShades.map((shade) => (
                                <motion.button
                                    key={shade.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    onClick={() => handleSelect(shade)}
                                    className={`relative flex items-center gap-2 px-4 py-2.5 rounded-full border transition-all text-sm font-bold ${
                                        selectedShadeId === shade.id
                                            ? 'bg-navy border-navy text-white shadow-md'
                                            : 'bg-white border-gray-200 text-gray-700 hover:border-navy hover:text-navy hover:bg-gray-50'
                                    }`}
                                >
                                    <span>{shade.name}</span>
                                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold tracking-wider ${
                                        selectedShadeId === shade.id 
                                            ? 'bg-white/20 text-white' 
                                            : 'bg-gray-100 text-gray-500'
                                    }`}>
                                        {shade.code}
                                    </span>
                                    {selectedShadeId === shade.id && <Check size={14} className="text-white ml-1" />}
                                </motion.button>
                            ))
                        ) : (
                            <p className="text-sm text-gray-500 py-4 font-medium w-full text-center">No shades found matching your search.</p>
                        )}
                    </AnimatePresence>
                </div>
            )}
        </div>
    );
}
