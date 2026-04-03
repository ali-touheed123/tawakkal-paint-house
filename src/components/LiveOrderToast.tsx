'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, CheckCircle, MapPin, Clock } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { Order } from '@/types';
import { formatDistanceToNow } from 'date-fns';
import Image from 'next/image';

export function LiveOrderToast() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const fetchRecentOrders = async () => {
            const supabase = createClient();
            // Fetch last 15 confirmed/shipped/delivered orders
            const { data } = await supabase
                .from('orders')
                .select('*')
                .neq('status', 'cancelled')
                .order('created_at', { ascending: false })
                .limit(15);

            if (data && data.length > 0) {
                setOrders(data as Order[]);
            }
        };

        fetchRecentOrders();
        // Refresh every 2 minutes for latest 15
        const interval = setInterval(fetchRecentOrders, 2 * 60 * 1000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (orders.length === 0) return;

        let index = 0;
        const showNextOrder = () => {
            setCurrentOrder(orders[index]);
            setIsVisible(true);

            // Hide after 8 seconds
            setTimeout(() => {
                setIsVisible(false);
            }, 8000);

            // Move to next order
            index = (index + 1) % orders.length;
        };

        // Initial delay
        const initialTimeout = setTimeout(showNextOrder, 5000);

        // Repeat every 1 minute (60,000ms)
        const repeatInterval = setInterval(showNextOrder, 60000);

        return () => {
            clearTimeout(initialTimeout);
            clearInterval(repeatInterval);
        };
    }, [orders]);

    if (!currentOrder) return null;

    // Privacy-safe logic: Show "Someone" if name not available, or first name only
    const location = currentOrder.delivery_area || 'Karachi';
    const firstItem = currentOrder.items?.[0];
    const productName = firstItem?.name || 'Premium Paint';
    const timeAgo = formatDistanceToNow(new Date(currentOrder.created_at), { addSuffix: true });

    return (
        <div className="fixed bottom-6 left-6 z-[100] pointer-events-none">
            <AnimatePresence>
                {isVisible && (
                    <motion.div
                        initial={{ opacity: 0, x: -20, scale: 0.95 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, x: -20, scale: 0.95 }}
                        className="pointer-events-auto bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl border border-gold/20 p-4 max-w-[320px] group"
                    >
                        <div className="flex gap-4">
                            <div className="relative shrink-0">
                                <div className="w-14 h-14 bg-gold-pale rounded-xl flex items-center justify-center overflow-hidden border border-gold/10">
                                    {firstItem?.image_url ? (
                                        <Image 
                                            src={firstItem.image_url} 
                                            alt="" 
                                            fill
                                            className="w-full h-full object-contain p-1 group-hover:scale-110 transition-transform duration-500" 
                                        />
                                    ) : (
                                        <ShoppingBag className="text-gold" size={24} />
                                    )}
                                </div>
                                <div className="absolute -bottom-1 -right-1 bg-green-500 text-white p-1 rounded-full border-2 border-white shadow-sm">
                                    <CheckCircle size={8} />
                                </div>
                            </div>

                            <div className="flex flex-col justify-center min-w-0">
                                <p className="text-[11px] font-bold text-navy uppercase tracking-widest flex items-center gap-1.5 mb-1">
                                    <span className="w-1 h-1 bg-green-500 rounded-full animate-pulse" />
                                    Recent Order
                                </p>
                                <h4 className="text-xs font-bold text-navy truncate mb-1">
                                    Someone from <span className="text-gold capitalize">{location}</span>
                                </h4>
                                <p className="text-[10px] text-gray-500 line-clamp-1 mb-1">
                                    Ordered <span className="font-semibold text-navy">{productName}</span>
                                </p>
                                <div className="flex items-center gap-3 mt-0.5">
                                    <span className="flex items-center gap-1 text-[9px] text-gray-400 font-medium">
                                        <Clock size={10} /> {timeAgo}
                                    </span>
                                    <span className="flex items-center gap-1 text-[9px] text-green-600 font-bold bg-green-50 px-1.5 py-0.5 rounded-full uppercase tracking-tighter">
                                        Verified
                                    </span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
