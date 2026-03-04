'use client';

import { motion } from 'framer-motion';

interface SimpleVisualizerProps {
    color: string;
    name: string;
}

export function SimpleVisualizer({ color, name }: SimpleVisualizerProps) {
    return (
        <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-gray-100 aspect-[16/9]">
            {/* Base Room Image */}
            <img
                src="/images/visualizer/living-room-base.jpg"
                alt="Room preview"
                className="w-full h-full object-cover"
            />

            {/* Wall Color Overlay */}
            {/* We use a div with mix-blend-mode to apply the color realistically */}
            <motion.div
                initial={false}
                animate={{ backgroundColor: color }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0"
                style={{
                    mixBlendMode: 'multiply',
                    opacity: 0.75,
                    // Precise wall clip-path excluding furniture and left pillar
                    clipPath: 'polygon(5% 0%, 100% 0%, 100% 74%, 82% 74%, 82% 58%, 18% 58%, 18% 74%, 5% 74%)',
                }}
            />

            {/* Overlay Label */}
            <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg">
                <div className="flex items-center gap-2">
                    <div
                        className="w-3 h-3 rounded-full border border-gray-200"
                        style={{ backgroundColor: color }}
                    />
                    <span className="text-xs font-bold text-navy uppercase tracking-wider">
                        {name}
                    </span>
                </div>
            </div>

            {/* Premium Badge */}
            <div className="absolute top-4 right-4 bg-gold text-navy text-[10px] font-bold px-3 py-1 rounded-full shadow-lg uppercase tracking-tighter">
                Brighto Visualizer
            </div>
        </div>
    );
}
