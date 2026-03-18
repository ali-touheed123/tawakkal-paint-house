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
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

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
                        onClick={() => setIsAddModalOpen(true)}
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

            {/* Add Shop Review Modal */}
            <AddShopReviewModal 
                isOpen={isAddModalOpen} 
                onClose={() => setIsAddModalOpen(false)}
                onSuccess={() => {
                    setIsAddModalOpen(false);
                    fetchReviews();
                }}
            />
        </div>
    );
}

function AddShopReviewModal({ isOpen, onClose, onSuccess }: { isOpen: boolean, onClose: () => void, onSuccess: () => void }) {
    const [loading, setLoading] = useState(false);
    const [rating, setRating] = useState(5);
    const [userName, setUserName] = useState('');
    const [content, setContent] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);

    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        if (isOpen) {
            window.addEventListener('keydown', handleEsc);
        }
        return () => window.removeEventListener('keydown', handleEsc);
    }, [isOpen, onClose]);

    const supabase = createClient();

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selected = e.target.files?.[0];
        if (selected) {
            setFile(selected);
            const reader = new FileReader();
            reader.onloadend = () => setPreview(reader.result as string);
            reader.readAsDataURL(selected);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        let media_url = null;
        let media_type: 'image' | 'video' | 'none' = 'none';

        if (file) {
            const fileExt = file.name.split('.').pop();
            const fileName = `admin_${Math.random()}.${fileExt}`;
            const { error: uploadError } = await supabase.storage
                .from('review-media')
                .upload(fileName, file);

            if (!uploadError) {
                const { data: { publicUrl } } = supabase.storage
                    .from('review-media')
                    .getPublicUrl(fileName);
                media_url = publicUrl;
                media_type = file.type.startsWith('video/') ? 'video' : 'image';
            }
        }

        const { error } = await supabase.from('reviews').insert({
            user_name: userName,
            rating,
            content,
            media_url,
            media_type,
            status: 'approved', // Auto-approve shop reviews
            is_shop_review: true
        });

        if (!error) {
            onSuccess();
            setUserName('');
            setContent('');
            setFile(null);
            setPreview(null);
        }
        setLoading(false);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onClick={onClose}
                className="absolute inset-0 bg-navy/80 backdrop-blur-sm"
            />
            <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-white rounded-[40px] w-full max-w-xl relative z-10 overflow-hidden shadow-2xl"
            >
                <div className="bg-navy p-8 text-white flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-heading font-bold">Add Shop Review</h2>
                        <p className="text-gray-400 text-sm">Enter a review captured at the shop.</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-400 uppercase">Customer Name</label>
                            <input 
                                required
                                value={userName}
                                onChange={e => setUserName(e.target.value)}
                                className="w-full bg-gray-50 border-none rounded-xl h-12 px-4 focus:ring-2 focus:ring-gold/50"
                                placeholder="e.g. Ali Khan"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-400 uppercase">Rating</label>
                            <select 
                                value={rating}
                                onChange={e => setRating(Number(e.target.value))}
                                className="w-full bg-gray-50 border-none rounded-xl h-12 px-4 focus:ring-2 focus:ring-gold/50"
                            >
                                {[5, 4, 3, 2, 1].map(n => (
                                    <option key={n} value={n}>{n} Stars</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase">Review Content</label>
                        <textarea 
                            required
                            value={content}
                            onChange={e => setContent(e.target.value)}
                            className="w-full bg-gray-50 border-none rounded-2xl p-4 h-32 resize-none focus:ring-2 focus:ring-gold/50"
                            placeholder="What did the customer say?"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase">Attach Media (Photo/Video)</label>
                        <div className="flex gap-4 items-center">
                            <button 
                                type="button"
                                onClick={() => document.getElementById('admin-file')?.click()}
                                className="flex-1 bg-gold/10 text-gold border border-gold/20 h-14 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-gold/20 transition-all"
                            >
                                <ImageIcon size={20} />
                                Upload File
                            </button>
                            {preview && (
                                <div className="w-14 h-14 rounded-xl overflow-hidden border border-gray-100">
                                    {file?.type.startsWith('video/') ? (
                                        <div className="w-full h-full bg-navy flex items-center justify-center">
                                            <Video size={16} className="text-gold" />
                                        </div>
                                    ) : (
                                        <img src={preview} className="w-full h-full object-cover" />
                                    )}
                                </div>
                            )}
                        </div>
                        <input id="admin-file" type="file" hidden accept="image/*,video/*" onChange={handleFileChange} />
                    </div>

                    <button 
                        disabled={loading}
                        className="w-full bg-navy text-white h-16 rounded-2xl font-bold text-lg hover:bg-gold hover:text-navy transition-all shadow-xl shadow-navy/20 flex items-center justify-center gap-3"
                    >
                        {loading ? <Loader2 className="animate-spin" /> : <Plus size={24} />}
                        Save Verified Review
                    </button>
                </form>
            </motion.div>
        </div>
    );
}

function Loader2({ className }: { className?: string }) {
    return <Clock className={`animate-spin ${className}`} size={20} />;
}
