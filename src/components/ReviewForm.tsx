'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Star, 
    Upload, 
    X, 
    CheckCircle2, 
    Loader2, 
    Camera, 
    Film,
    ChevronRight,
    MessageSquare
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { cn } from '@/lib/utils';

export function ReviewForm() {
    const [step, setStep] = useState(1);
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [content, setContent] = useState('');
    const [name, setName] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [fileType, setFileType] = useState<'image' | 'video' | 'none'>('none');
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const supabase = createClient();

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selected = e.target.files?.[0];
        if (selected) {
            setFile(selected);
            setFileType(selected.type.startsWith('video/') ? 'video' : 'image');
            const reader = new FileReader();
            reader.onloadend = () => setPreview(reader.result as string);
            reader.readAsDataURL(selected);
        }
    };

    const handleSubmit = async () => {
        if (!rating || !content || !name) return;
        setLoading(true);

        let media_url = null;
        if (file) {
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random()}.${fileExt}`;
            const { data: uploadData, error: uploadError } = await supabase.storage
                .from('review-media')
                .upload(fileName, file);

            if (!uploadError) {
                const { data: { publicUrl } } = supabase.storage
                    .from('review-media')
                    .getPublicUrl(fileName);
                media_url = publicUrl;
            }
        }

        const { error } = await supabase.from('reviews').insert({
            user_name: name,
            rating,
            content,
            media_url,
            media_type: fileType,
            status: 'pending'
        });

        if (!error) {
            setSubmitted(true);
        }
        setLoading(false);
    };

    if (submitted) {
        return (
            <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-navy text-white p-12 rounded-[40px] text-center space-y-6"
            >
                <div className="w-20 h-20 bg-gold rounded-full flex items-center justify-center mx-auto shadow-2xl">
                    <CheckCircle2 size={40} className="text-navy" />
                </div>
                <h3 className="text-3xl font-heading font-bold">Thank You!</h3>
                <p className="text-gray-400 max-w-sm mx-auto">
                    Your story has been submitted for moderation. We'll review and post it shortly.
                </p>
                <button 
                    onClick={() => {
                        setStep(1);
                        setSubmitted(false);
                        setRating(0);
                        setContent('');
                        setName('');
                        setFile(null);
                        setPreview(null);
                    }}
                    className="text-gold font-bold hover:underline"
                >
                    Write another review
                </button>
            </motion.div>
        );
    }

    return (
        <div className="bg-white rounded-[40px] shadow-2xl p-8 md:p-12 border border-gray-100 overflow-hidden relative">
            <AnimatePresence mode="wait">
                {step === 1 && (
                    <motion.div 
                        key="step1"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-8"
                    >
                        <div className="text-center">
                            <h3 className="text-2xl font-heading font-bold text-navy mb-2">Share Your Experience</h3>
                            <p className="text-gray-500">How would you rate your visit to Tawakkal Paint House?</p>
                        </div>

                        <div className="flex justify-center gap-3">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    onMouseEnter={() => setHoverRating(star)}
                                    onMouseLeave={() => setHoverRating(0)}
                                    onClick={() => setRating(star)}
                                    className="p-1 transition-transform active:scale-90 hover:scale-110"
                                >
                                    <Star 
                                        size={48} 
                                        fill={(hoverRating || rating) >= star ? "#D4AF37" : "none"}
                                        className={(hoverRating || rating) >= star ? "text-gold" : "text-gray-200"}
                                    />
                                </button>
                            ))}
                        </div>

                        <button 
                            disabled={!rating}
                            onClick={() => setStep(2)}
                            className="w-full bg-navy text-white h-16 rounded-2xl font-bold flex items-center justify-center gap-2 disabled:opacity-50 transition-all hover:bg-gold hover:text-navy group"
                        >
                            Next Step
                            <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    </motion.div>
                )}

                {step === 2 && (
                    <motion.div 
                        key="step2"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-6"
                    >
                        <div className="space-y-4">
                            <div className="relative group">
                                <textarea
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    placeholder="Tell us about the project you painted..."
                                    className="w-full h-40 bg-gray-50 rounded-2xl p-6 text-navy placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gold/50 border-none resize-none transition-all"
                                />
                                <div className="absolute top-6 left-6 -translate-x-full -translate-y-1/2 opacity-0 group-focus-within:opacity-10 shadow-xl pointer-events-none">
                                    <MessageSquare size={100} className="text-navy" />
                                </div>
                            </div>

                            <div className="relative">
                                <input
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Your Full Name"
                                    className="w-full bg-gray-50 h-14 rounded-2xl px-6 text-navy placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gold/50 border-none transition-all"
                                />
                            </div>

                            <div className="flex gap-4">
                                <button 
                                    onClick={() => fileInputRef.current?.click()}
                                    className="flex-1 h-14 bg-gold/10 text-gold rounded-2xl border border-gold/20 flex items-center justify-center gap-2 font-bold hover:bg-gold/20 transition-all"
                                >
                                    {fileType === 'video' ? <Film size={20} /> : <Camera size={20} />}
                                    {file ? 'Change Media' : 'Add Photo/Video'}
                                </button>
                                {file && (
                                    <button 
                                        onClick={() => { setFile(null); setPreview(null); }}
                                        className="w-14 h-14 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center border border-red-100 hover:bg-red-100 transition-all"
                                    >
                                        <X size={20} />
                                    </button>
                                )}
                            </div>
                            <input 
                                type="file" 
                                hidden 
                                ref={fileInputRef} 
                                onChange={handleFileChange}
                                accept="image/*,video/*"
                            />

                            {preview && (
                                <motion.div 
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="rounded-2xl overflow-hidden aspect-video bg-gray-100"
                                >
                                    {fileType === 'video' ? (
                                        <video src={preview} className="w-full h-full object-cover" controls />
                                    ) : (
                                        <img src={preview} className="w-full h-full object-cover" />
                                    )}
                                </motion.div>
                            )}
                        </div>

                        <div className="flex gap-4">
                            <button 
                                onClick={() => setStep(1)}
                                className="h-16 px-6 border-2 border-navy/10 text-navy font-bold rounded-2xl hover:bg-gray-50 transition-all"
                            >
                                Back
                            </button>
                            <button 
                                disabled={loading || !content || !name}
                                onClick={handleSubmit}
                                className="flex-1 bg-navy text-white h-16 rounded-2xl font-bold flex items-center justify-center gap-3 shadow-xl shadow-navy/20 hover:bg-gold hover:text-navy transition-all active:scale-95 disabled:opacity-50"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="animate-spin" size={20} />
                                        Submitting...
                                    </>
                                ) : (
                                    <>
                                        <Upload size={20} />
                                        Post Feedback
                                    </>
                                )}
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
