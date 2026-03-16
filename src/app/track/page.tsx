'use client';

import { useState, useEffect, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Search, 
    Package, 
    Truck, 
    CheckCircle2, 
    Clock, 
    AlertCircle,
    ChevronRight,
    ArrowLeft
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export default function OrderTrackingPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen pt-[120px] flex items-center justify-center">
                <div className="animate-spin w-8 h-8 border-2 border-gold border-t-transparent rounded-full" />
            </div>
        }>
            <OrderTrackingContent />
        </Suspense>
    );
}

function OrderTrackingContent() {
    const searchParams = useSearchParams();
    const [orderId, setOrderId] = useState('');
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [order, setOrder] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    const supabase = createClient();

    const fetchOrder = async (id: string, searchEmail?: string) => {
        setLoading(true);
        setError(null);
        setOrder(null);

        const cleanId = id.replace(/\D/g, '');

        let query = supabase.from('orders').select('*').eq('id', cleanId);
        
        // Only enforce email check if this is a manual lookup
        if (searchEmail) {
            query = query.ilike('email', searchEmail.trim());
        }

        const { data, error: dbError } = await query.single();

        if (dbError || !data) {
            setError(searchEmail 
                ? 'We couldn\'t find an order with matching details. Please double-check your Order ID and Email.' 
                : 'Order not found or invalid link. Please try entering your details manually.');
        } else {
            setOrder(data);
        }
        setLoading(false);
    };

    useEffect(() => {
        const idFromUrl = searchParams.get('id');
        if (idFromUrl) {
            setOrderId(idFromUrl);
            fetchOrder(idFromUrl);
        }
    }, [searchParams]);

    const handleTrack = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email.trim() && !searchParams.get('id')) {
            setError('Please enter your email address to track your order.');
            return;
        }
        await fetchOrder(orderId, email);
    };


    const statusSteps: { status: OrderStatus; label: string; icon: any; color: string }[] = [
        { status: 'pending', label: 'Order Placed', icon: Clock, color: 'text-amber-500' },
        { status: 'processing', label: 'Processing', icon: Package, color: 'text-blue-500' },
        { status: 'shipped', label: 'On the Way', icon: Truck, color: 'text-gold' },
        { status: 'delivered', label: 'Delivered', icon: CheckCircle2, color: 'text-green-500' }
    ];

    const currentStepIndex = statusSteps.findIndex(s => s.status === order?.status);
    const isCancelled = order?.status === 'cancelled';

    return (
        <div className="min-h-screen bg-off-white pt-24 pb-20">
            <div className="max-w-4xl mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-12">
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-gray-100 shadow-sm text-gold font-bold text-xs uppercase tracking-widest mb-4"
                    >
                        <Search size={14} /> Tracking System
                    </motion.div>
                    <h1 className="text-4xl md:text-5xl font-heading font-bold text-navy mb-4">Track Your <span className="text-gold">Order</span></h1>
                    <p className="text-gray-500">Enter your details below to see the latest status of your paint delivery.</p>
                </div>

                <AnimatePresence mode="wait">
                    {!order ? (
                        <motion.div 
                            key="lookup"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="bg-white rounded-[40px] shadow-2xl p-8 md:p-12 border border-gray-100"
                        >
                            <form onSubmit={handleTrack} className="space-y-6">
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-navy ml-1">Order Number</label>
                                        <input 
                                            required
                                            value={orderId}
                                            onChange={e => setOrderId(e.target.value)}
                                            placeholder="e.g. 1045"
                                            className="w-full bg-gray-50 h-14 rounded-2xl px-6 border-none focus:ring-2 focus:ring-gold/50 transition-all font-medium"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-navy ml-1">Email Address</label>
                                        <input 
                                            required
                                            type="email"
                                            value={email}
                                            onChange={e => setEmail(e.target.value)}
                                            placeholder="your@email.com"
                                            className="w-full bg-gray-50 h-14 rounded-2xl px-6 border-none focus:ring-2 focus:ring-gold/50 transition-all font-medium"
                                        />
                                    </div>
                                </div>

                                {error && (
                                    <motion.div 
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className="bg-red-50 text-red-600 p-4 rounded-xl flex items-center gap-3 text-sm font-medium"
                                    >
                                        <AlertCircle size={20} />
                                        {error}
                                    </motion.div>
                                )}

                                <button 
                                    disabled={loading}
                                    type="submit"
                                    className="w-full bg-navy text-white h-16 rounded-2xl font-bold text-lg hover:bg-gold hover:text-navy transition-all shadow-xl shadow-navy/20 flex items-center justify-center gap-3 relative overflow-hidden group"
                                >
                                    {loading ? (
                                        <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        <>
                                            Find My Order
                                            <ChevronRight size={22} className="group-hover:translate-x-1 transition-transform" />
                                        </>
                                    )}
                                </button>
                            </form>
                        </motion.div>
                    ) : (
                        <motion.div 
                            key="status"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="space-y-8"
                        >
                            {/* Order Info Card */}
                            <div className="bg-navy rounded-[40px] p-8 md:p-12 text-white shadow-2xl relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-gold/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
                                
                                <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
                                    <div className="space-y-2">
                                        <button 
                                            onClick={() => setOrder(null)}
                                            className="text-gold flex items-center gap-2 text-sm font-bold hover:underline mb-4"
                                        >
                                            <ArrowLeft size={16} /> Track another order
                                        </button>
                                        <h2 className="text-gray-400 font-bold uppercase tracking-tighter text-sm">Order Status</h2>
                                        <div className="flex items-center gap-4">
                                            <p className="text-4xl font-heading font-bold text-white">#{order.id}</p>
                                            {!isCancelled && (
                                                <div className="bg-gold text-navy text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full">
                                                    Live
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-gray-400 text-sm font-medium">Estimated Arrival</p>
                                        <p className="text-2xl font-bold text-gold">
                                            {order.status === 'delivered' ? 'Delivered' : 'Within 2-3 Days'}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Tracking Timeline */}
                            <div className="bg-white rounded-[40px] p-8 md:p-16 shadow-xl border border-gray-50">
                                {isCancelled ? (
                                    <div className="text-center py-12">
                                        <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                                            <X size={40} />
                                        </div>
                                        <h3 className="text-2xl font-bold text-navy mb-2">Order Cancelled</h3>
                                        <p className="text-gray-500 max-w-sm mx-auto">This order was cancelled. Please contact support if you believe this is an error.</p>
                                    </div>
                                ) : (
                                    <div className="relative">
                                        {/* Progress Bar Line */}
                                        <div className="absolute top-[28px] left-[40px] right-[40px] h-1 bg-gray-100 hidden md:block">
                                            <motion.div 
                                                initial={{ width: 0 }}
                                                animate={{ width: `${(currentStepIndex / 3) * 100}%` }}
                                                transition={{ duration: 1, ease: "easeOut" }}
                                                className="h-full bg-gold"
                                            />
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-4 relative z-10">
                                            {statusSteps.map((step, i) => {
                                                const Icon = step.icon;
                                                const isCompleted = i <= currentStepIndex;
                                                const isActive = i === currentStepIndex;

                                                return (
                                                    <div key={step.status} className="flex flex-row md:flex-col items-center gap-6 md:gap-4 text-center">
                                                        <div className={cn(
                                                            "w-14 h-14 rounded-full flex items-center justify-center transition-all duration-500 border-4",
                                                            isCompleted ? "bg-gold border-gold text-navy shadow-lg shadow-gold/20" : "bg-white border-gray-100 text-gray-300"
                                                        )}>
                                                            <Icon size={24} className={isActive ? "animate-pulse" : ""} />
                                                        </div>
                                                        <div className="text-left md:text-center">
                                                            <p className={cn(
                                                                "font-bold text-sm uppercase tracking-wider mb-1",
                                                                isCompleted ? "text-navy" : "text-gray-300"
                                                            )}>
                                                                {step.label}
                                                            </p>
                                                            {isActive && (
                                                                <motion.p 
                                                                    initial={{ opacity: 0 }}
                                                                    animate={{ opacity: 1 }}
                                                                    className="text-gold text-[10px] font-black uppercase tracking-tighter"
                                                                >
                                                                    Current Status
                                                                </motion.p>
                                                            )}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}

                                {/* Help Footer */}
                                <div className="mt-16 pt-8 border-t border-gray-50 flex flex-col md:flex-row items-center justify-between gap-6">
                                    <div className="flex items-center gap-4 text-gray-500">
                                        <AlertCircle size={20} className="text-gold" />
                                        <p className="text-sm">Need help? WhatsApp us at <span className="font-bold text-navy">0347-5658761</span></p>
                                    </div>
                                    <Link 
                                        href="/contact"
                                        className="text-navy font-bold text-sm hover:underline"
                                    >
                                        Contact Support
                                    </Link>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}

function X({ size }: { size: number }) {
    return <AlertCircle size={size} className="text-red-500 rotate-45" />;
}

function cn(...classes: any[]) {
    return classes.filter(Boolean).join(' ');
}
