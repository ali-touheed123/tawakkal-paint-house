'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Mail, Loader2, AlertCircle, ArrowLeft, UserPlus, LogIn } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export default function AdminLoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [loginType, setLoginType] = useState<'admin' | 'staff'>('admin');
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const supabase = createClient();
            
            const finalEmail = loginType === 'staff' ? 'staff@tawakkal.com' : email;
            const { error: loginError } = await supabase.auth.signInWithPassword({
                email: finalEmail,
                password,
            });
            if (loginError) throw loginError;

            router.push('/admin-7392-dashboard');
        } catch (err: any) {
            console.error('Auth error:', err);
            setError(err.message || 'An error occurred during authentication');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-navy flex items-center justify-center p-4 relative overflow-hidden text-navy">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-gold rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-white rounded-full blur-[120px]" />
            </div>

            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md"
            >
                <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-white/20">
                    <div className="p-8 md:p-10">
                        {/* Logo/Header */}
                        <div className="text-center mb-8">
                            <motion.div 
                                initial={{ scale: 0.5 }}
                                animate={{ scale: 1 }}
                                className="w-16 h-16 bg-gold flex items-center justify-center rounded-2xl mx-auto mb-6 shadow-lg shadow-gold/20"
                            >
                                <Lock className="text-navy" size={32} />
                            </motion.div>
                            <h1 className="text-3xl font-black tracking-tight">Admin Access</h1>
                            <p className="text-gray-400 mt-2 font-medium">
                                Please sign in as {loginType === 'admin' ? 'Admin' : 'Staff'}
                            </p>
                        </div>

                        <div className="flex bg-gray-50 p-1 rounded-xl mb-6">
                                <button
                                    onClick={() => setLoginType('admin')}
                                    className={cn(
                                        "flex-1 py-2 text-xs font-bold rounded-lg transition-all",
                                        loginType === 'admin' ? "bg-white text-navy shadow-sm" : "text-gray-400 hover:text-navy"
                                    )}
                                >
                                    Admin Login
                                </button>
                                <button
                                    onClick={() => setLoginType('staff')}
                                    className={cn(
                                        "flex-1 py-2 text-xs font-bold rounded-lg transition-all",
                                        loginType === 'staff' ? "bg-white text-navy shadow-sm" : "text-gray-400 hover:text-navy"
                                    )}
                                >
                                    Staff Login
                                </button>
                            </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <AnimatePresence mode="wait">
                                {error && (
                                    <motion.div 
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className={`p-4 rounded-xl flex items-center gap-3 text-sm font-medium border ${
                                            error.includes('successful') 
                                                ? 'bg-green-50 border-green-100 text-green-600' 
                                                : 'bg-red-50 border-red-100 text-red-600'
                                        }`}
                                    >
                                        <AlertCircle size={18} />
                                        {error}
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <div className="space-y-4">
                                {loginType === 'admin' && (
                                    <div>
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1 mb-2 block">
                                            Email Address
                                        </label>
                                        <div className="relative group">
                                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-gold transition-colors" size={20} />
                                            <input 
                                                type="email"
                                                required
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:border-gold focus:ring-4 focus:ring-gold/5 transition-all font-medium"
                                                placeholder="admin@tawakkal.com"
                                            />
                                        </div>
                                    </div>
                                )}

                                <div>
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1 mb-2 block">
                                        Password
                                    </label>
                                    <div className="relative group">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-gold transition-colors" size={20} />
                                        <input 
                                            type="password"
                                            required
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:border-gold focus:ring-4 focus:ring-gold/5 transition-all font-medium"
                                            placeholder="••••••••"
                                        />
                                    </div>
                                </div>
                            </div>

                            <button 
                                type="submit"
                                disabled={loading}
                                className="w-full bg-navy text-white font-bold py-4 rounded-2xl hover:bg-navy/90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-xl shadow-navy/20 disabled:opacity-50"
                            >
                                {loading ? (
                                    <Loader2 className="animate-spin" size={20} />
                                ) : (
                                    <span className="flex items-center gap-2">
                                        <LogIn size={20} />
                                        Sign In Securely
                                    </span>
                                )}
                            </button>
                        </form>

                        <div className="mt-8 flex flex-col items-center gap-4">
                            <Link href="/" className="text-sm font-bold text-gray-400 hover:text-navy transition-colors inline-flex items-center gap-2 group">
                                <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                                Back to Website
                            </Link>
                        </div>
                    </div>
                </div>
                
                <p className="text-center text-white/30 text-[10px] mt-8 uppercase tracking-[0.3em] font-black">
                    Authorized Personnel Only
                </p>
            </motion.div>
        </div>
    );
}
