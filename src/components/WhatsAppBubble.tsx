'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useSettings } from '@/lib/hooks/useSettings';

export function WhatsAppBubble() {
    const { settings } = useSettings();
    const [isOpen, setIsOpen] = useState(false);
    const [showTooltip, setShowTooltip] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setShowTooltip(true), 5000);
        return () => clearTimeout(timer);
    }, []);

    const whatsappNumber = settings?.contact?.whatsapp || '923475658761';
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent("Hi! I need help with some paint.")}`;

    return (
        <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end gap-4">
            <AnimatePresence>
                {showTooltip && !isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, x: 20 }}
                        animate={{ opacity: 1, scale: 1, x: 0 }}
                        exit={{ opacity: 0, scale: 0.8, x: 20 }}
                        className="bg-white px-4 py-3 rounded-2xl shadow-2xl border border-gray-100 flex items-center gap-3 mb-2"
                    >
                        <div className="relative">
                            <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white">
                                <MessageCircle size={20} />
                            </div>
                            <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white animate-pulse" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-navy">Need help?</p>
                            <p className="text-[10px] text-gray-500 uppercase tracking-wider font-medium">Online - 15m response</p>
                        </div>
                        <button 
                            onClick={() => setShowTooltip(false)}
                            className="p-1 hover:bg-gray-100 rounded-full text-gray-400"
                        >
                            <X size={14} />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="w-16 h-16 bg-[#25D366] rounded-full shadow-2xl flex items-center justify-center text-white relative group"
            >
                <MessageCircle size={32} />
                <div className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-20 group-hover:opacity-0" />
            </motion.a>
        </div>
    );
}
