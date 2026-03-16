'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { 
    Star, 
    Check, 
    X, 
    Trash2, 
    Image as ImageIcon, 
    Video, 
    Plus,
    Clock,
    User,
    ShieldCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Review {
    id: string;
    created_at: string;
    user_name: string;
    rating: number;
    content: string;
    media_url: string | null;
    media_type: 'image' | 'video' | 'none';
    status: 'pending' | 'approved' | 'rejected';
    is_shop_review: boolean;
}

export default function AdminReviewsPage() {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({ pending: 0, approved: 0 });
    const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

    const supabase = createClient();

    useEffect(() => {
        fetchReviews();
    }, []);

    async function fetchReviews() {
        setLoading(true);
        const { data, error } = await supabase
            .from('reviews')
            .select('*')
            .order('created_at', { ascending: false });

        if (data) {
            setReviews(data);
            setStats({
                pending: data.filter(r => r.status === 'pending').length,
                approved: data.filter(r => r.status === 'approved').length
            });
        }
        setLoading(false);
    }

    async function updateStatus(id: string, status: 'approved' | 'rejected') {
        const { error } = await supabase
            .from('reviews')
            .update({ status })
            .eq('id', id);

        if (!error) fetchReviews();
    }

    async function deleteReview(id: string) {
        if (!confirm('Are you sure you want to delete this review?')) return;
        const { error } = await supabase
            .from('reviews')
            .delete()
            .eq('id', id);

        if (!error) fetchReviews();
    }

    const filteredReviews = reviews.filter(r => filter === 'all' || r.status === filter);

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-heading font-bold text-navy">Customer Reviews</h1>
                    <p className="text-gray-500">Moderate feedback and manage shop-captured testimonials.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button 
                        onClick={() => window.location.href = '#add-shop-review'}
                        className="bg-gold text-navy font-bold px-6 py-3 rounded-xl flex items-center gap-2 hover:bg-navy hover:text-white transition-all shadow-lg shadow-gold/20"
                    >
                        <Plus size={20} />
                        Add Shop Review
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="w-12 h-12 bg-gold/10 text-gold rounded-xl flex items-center justify-center">
                        <Star size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-gray-400 font-bold uppercase tracking-wider">Total Reviews</p>
                        <p className="text-2xl font-bold text-navy">{reviews.length}</p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="w-12 h-12 bg-amber-50 text-amber-500 rounded-xl flex items-center justify-center">
                        <Clock size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-gray-400 font-bold uppercase tracking-wider">Pending</p>
                        <p className="text-2xl font-bold text-navy">{stats.pending}</p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="w-12 h-12 bg-green-50 text-green-500 rounded-xl flex items-center justify-center">
                        <Check size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-gray-400 font-bold uppercase tracking-wider">Approved</p>
                        <p className="text-2xl font-bold text-navy">{stats.approved}</p>
                    </div>
                </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex bg-gray-200/50 p-1 rounded-xl w-fit">
                {['all', 'pending', 'approved', 'rejected'].map((f) => (
                    <button
                        key={f}
                        onClick={() => setFilter(f as any)}
                        className={`px-6 py-2 rounded-lg text-xs font-bold capitalize transition-all ${
                            filter === f ? 'bg-white text-navy shadow-sm' : 'text-gray-500'
                        }`}
                    >
                        {f}
                    </button>
                ))}
            </div>

            {/* Reviews Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <AnimatePresence mode="popLayout">
                    {filteredReviews.map((review) => (
                        <motion.div
                            key={review.id}
                            layout
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 space-y-4 hover:shadow-xl transition-all"
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-navy rounded-full flex items-center justify-center text-white">
                                        <User size={24} />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h4 className="font-bold text-navy">{review.user_name}</h4>
                                            {review.is_shop_review && (
                                                <span className="flex items-center gap-1 text-[10px] bg-gold/10 text-gold px-2 py-0.5 rounded-full font-bold uppercase tracking-tighter">
                                                    <ShieldCheck size={10} /> Verified Shop Review
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex gap-0.5 mt-1">
                                            {[...Array(review.rating)].map((_, i) => (
                                                <Star key={i} size={14} fill="#D4AF37" className="text-gold" />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                                    review.status === 'approved' ? 'bg-green-50 text-green-600' :
                                    review.status === 'pending' ? 'bg-amber-50 text-amber-600' :
                                    'bg-red-50 text-red-600'
                                }`}>
                                    {review.status}
                                </div>
                            </div>

                            <p className="text-gray-600 text-sm italic leading-relaxed">
                                "{review.content}"
                            </p>

                            {review.media_url && (
                                <div className="rounded-2xl overflow-hidden bg-gray-100 max-h-48 flex items-center justify-center relative group">
                                    {review.media_type === 'video' ? (
                                        <div className="aspect-video w-full flex items-center justify-center bg-black">
                                            <Video className="text-white opacity-50" size={48} />
                                            <video 
                                                src={review.media_url} 
                                                className="absolute inset-0 w-full h-full object-cover"
                                                muted
                                                loop
                                                onMouseOver={(e) => e.currentTarget.play()}
                                                onMouseOut={(e) => e.currentTarget.pause()}
                                            />
                                        </div>
                                    ) : (
                                        <img src={review.media_url} className="w-full h-full object-cover" alt="Review Media" />
                                    )}
                                </div>
                            )}

                            <div className="pt-4 flex items-center justify-between border-t border-gray-50">
                                <div className="text-[10px] text-gray-400 font-medium">
                                    {new Date(review.created_at).toLocaleDateString(undefined, {
                                        day: 'numeric',
                                        month: 'short',
                                        year: 'numeric'
                                    })}
                                </div>
                                <div className="flex items-center gap-2">
                                    {review.status !== 'approved' && (
                                        <button 
                                            onClick={() => updateStatus(review.id, 'approved')}
                                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors border border-green-100"
                                            title="Approve"
                                        >
                                            <Check size={18} />
                                        </button>
                                    )}
                                    {review.status !== 'rejected' && (
                                        <button 
                                            onClick={() => updateStatus(review.id, 'rejected')}
                                            className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors border border-amber-100"
                                            title="Reject"
                                        >
                                            <X size={18} />
                                        </button>
                                    )}
                                    <button 
                                        onClick={() => deleteReview(review.id)}
                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-red-100"
                                        title="Delete Permanently"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {loading && (
                <div className="flex items-center justify-center py-20">
                    <Clock className="animate-spin text-gray-300" size={32} />
                </div>
            )}
            
            {filteredReviews.length === 0 && !loading && (
                <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
                    <Star className="mx-auto text-gray-200 mb-4" size={48} />
                    <p className="text-gray-400 font-medium">No reviews found matching this filter.</p>
                </div>
            )}
        </div>
    );
}
