'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check } from 'lucide-react';

export interface Shade {
    id: string;
    name: string;
    code: string;
    hex: string;
    is_drum_available: boolean;
}

interface ShadeSelectorProps {
    shades: Shade[];
    selectedSize: 'quarter' | 'gallon' | 'drum';
    onSelect: (shade: Shade) => void;
}

export function ShadeSelector({ shades, selectedSize, onSelect }: ShadeSelectorProps) {
    const [selectedShadeId, setSelectedShadeId] = useState<string | null>(null);

    const filteredShades = useMemo(() => {
        if (selectedSize === 'drum') {
            return shades.filter(s => s.is_drum_available);
        }
        return shades;
    }, [shades, selectedSize]);

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

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-baseline gap-2">
                    <h3 className="text-sm font-bold text-navy uppercase tracking-widest">
                        Choose Color
                    </h3>
                    {selectedShade && (
                        <span className="text-sm font-medium text-gray-500">: {selectedShade.name}</span>
                    )}
                </div>
                {selectedSize === 'drum' && (
                    <span className="text-[10px] font-bold text-gold uppercase bg-gold/10 px-2 py-1 rounded">
                        Only 3 Shades for Drum
                    </span>
                )}
            </div>

            <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 gap-2.5 max-h-[400px] overflow-y-auto pr-2 scrollbar-hide py-2">
                <AnimatePresence mode="popLayout">
                    {filteredShades.map((shade) => (
                        <motion.button
                            key={shade.id}
                            layout
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            onClick={() => handleSelect(shade)}
                            className={`relative aspect-square rounded-full border-2 transition-all p-0.5 ${selectedShadeId === shade.id
                                ? 'border-navy shadow-lg scale-110 z-10'
                                : 'border-transparent hover:border-navy/20'
                                }`}
                            title={`${shade.name} (${shade.code})`}
                        >
                            <div
                                className="w-full h-full rounded-full flex items-center justify-center"
                                style={{ backgroundColor: shade.hex }}
                            >
                                {selectedShadeId === shade.id && (
                                    <Check size={12} className="text-white drop-shadow-md" />
                                )}
                            </div>
                        </motion.button>
                    ))}
                </AnimatePresence>
            </div>

            <AnimatePresence>
                {selectedShade && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="bg-gray-50 rounded-xl p-4 border border-gray-100 shadow-sm"
                    >
                        <div className="flex items-center gap-4">
                            <div
                                className="w-12 h-12 rounded-lg border border-gray-200 shadow-inner"
                                style={{ backgroundColor: selectedShade.hex }}
                            />
                            <div>
                                <p className="text-sm font-bold text-navy">{selectedShade.name}</p>
                                <p className="text-xs text-gray-500 font-medium">{selectedShade.code}</p>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
