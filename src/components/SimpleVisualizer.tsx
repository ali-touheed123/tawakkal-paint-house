'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shade } from '@/types';
import { Check, Maximize2, Palette } from 'lucide-react';
import Image from 'next/image';

interface SimpleVisualizerProps {
    color: string;
    name: string;
    onSelect?: (shade: Shade) => void;
}

export function SimpleVisualizer({ color: initialColor, name: initialName, onSelect }: SimpleVisualizerProps) {
    const [currentColor, setCurrentColor] = useState(initialColor);
    const [currentName, setCurrentName] = useState(initialName);

    // Sync with external selection
    useEffect(() => {
        setCurrentColor(initialColor);
        setCurrentName(initialName);
    }, [initialColor, initialName]);

    const handleSwatchClick = (shade: Shade) => {
        setCurrentColor(shade.hex);
        setCurrentName(shade.name);
        if (onSelect) onSelect(shade);
    };

    return (
        <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-gray-100 aspect-square group border-4 border-white">
            {/* LAYER 1: Base Image (Wall + Floor + Sofa) */}
            <Image
                src="https://kadkryylyzfwtxknvcic.supabase.co/storage/v1/object/public/products/images/visualizer/back.png"
                alt="Room Base"
                fill
                priority
                className="absolute inset-0 w-full h-full object-cover"
            />

            {/* LAYER 2: Colored Overlay (Multiply) - Clipped to Wall Area */}
            <motion.div
                initial={false}
                animate={{ backgroundColor: currentColor }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="absolute inset-0 z-10"
                style={{
                    mixBlendMode: 'multiply',
                    opacity: 0.8,
                    // Clipping to wall area (avoiding the floor)
                    // Tune the 68% based on back.png alignment
                    clipPath: 'polygon(0% 0%, 100% 0%, 100% 68.5%, 0% 68.5%)'
                }}
            />

            {/* LAYER 3: Foreground (Sofa Only) - Perfectly Aligned */}
            <Image
                src="https://kadkryylyzfwtxknvcic.supabase.co/storage/v1/object/public/products/images/visualizer/front.png"
                alt="Sofa Foreground"
                fill
                priority
                className="absolute inset-0 w-full h-full object-cover z-20 pointer-events-none"
            />

        </div>
    );
}
