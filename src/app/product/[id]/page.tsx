'use client';

import { useEffect, useState, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ChevronLeft,
    ShoppingCart,
    MessageCircle,
    ShieldCheck,
    Truck,
    Package,
    Info,
    ArrowRight,
    Search,
    Maximize2
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { Product, ItemSize, Shade } from '@/types';
import { useCartStore } from '@/lib/store';
import { ShadeSelector } from '@/components/ShadeSelector';
import { SimpleVisualizer } from '@/components/SimpleVisualizer';
import Link from 'next/link';
import { BRIGHTO_SHADES } from '@/constants/shades';


export default function ProductDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedSize, setSelectedSize] = useState<ItemSize>('gallon');
    const [quantity, setQuantity] = useState(1);
    const [shades, setShades] = useState<Shade[]>(BRIGHTO_SHADES);
    const [selectedShade, setSelectedShade] = useState<Shade | null>(null);
    const [addingToCart, setAddingToCart] = useState(false);

    const { addItem } = useCartStore();

    useEffect(() => {
        const fetchProduct = async () => {
            setLoading(true);
            const supabase = createClient();

            const { data: productData, error: productError } = await supabase
                .from('products')
                .select('*')
                .eq('id', id)
                .single();

            if (productData) {
                setProduct(productData);

                // Fetch shades from DB, fallback to local if empty
                const { data: shadeData } = await supabase
                    .from('product_shades')
                    .select('*')
                    .eq('product_id', id)
                    .order('name');

                if (shadeData && shadeData.length > 0) {
                    setShades(shadeData);
                }
            }
            setLoading(false);
        };

        if (id) fetchProduct();
    }, [id]);

    const price = selectedSize === 'quarter'
        ? product?.price_quarter
        : selectedSize === 'gallon'
            ? product?.price_gallon
            : product?.price_drum;

    const handleAddToCart = () => {
        if (!product) return;
        setAddingToCart(true);
        addItem(product.id, selectedSize, quantity, {
            ...product,
            selectedShade: selectedShade ? {
                name: selectedShade.name,
                code: selectedShade.code,
                hex: selectedShade.hex
            } : undefined
        });
        setTimeout(() => setAddingToCart(false), 500);
    };

    if (loading) {
        return (
            <div className="min-h-screen pt-32 flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-gold border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (!product) return <div className="min-h-screen pt-32 text-center text-gray-500">Product not found.</div>;

    const isBrightoSuperEmulsion = product.name === 'Brighto Super Emulsion';

    return (
        <div className="min-h-screen pt-[70px] bg-white">
            {/* Breadcrumbs */}
            <div className="bg-gray-50 border-b border-gray-100 py-3">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-4">
                    <button onClick={() => router.back()} className="p-2 hover:bg-gray-200 rounded-lg transition-colors text-navy">
                        <ChevronLeft size={20} />
                    </button>
                    <div className="flex items-center gap-2 text-xs font-medium text-gray-400 overflow-hidden">
                        <Link href="/" className="hover:text-gold uppercase tracking-tighter">Home</Link>
                        <ArrowRight size={10} className="shrink-0" />
                        <Link href={`/category/${product.category}`} className="hover:text-gold uppercase tracking-tighter truncate">{product.category}</Link>
                        <ArrowRight size={10} className="shrink-0" />
                        <span className="text-navy uppercase tracking-tighter font-bold truncate">{product.name}</span>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-16">
                <div className="grid lg:grid-cols-2 gap-16 items-start">

                    {/* LEFT COLUMN: Visualizer & Thumbnails */}
                    <div className="space-y-8 lg:sticky lg:top-[140px]">
                        <div className="relative group rounded-3xl overflow-hidden bg-gray-50 shadow-2xl">
                            {isBrightoSuperEmulsion ? (
                                <SimpleVisualizer
                                    color={selectedShade?.hex || '#FFFFFF'}
                                    name={selectedShade?.name || 'Standard'}
                                    onSelect={(s) => setSelectedShade(s)}
                                />
                            ) : (
                                <div className="aspect-[16/9] flex items-center justify-center p-8">
                                    <img src={product.image_url || ''} className="max-h-full object-contain" />
                                </div>
                            )}
                            <button className="absolute top-4 right-4 p-3 bg-white/80 backdrop-blur-sm rounded-full shadow-lg text-navy hover:bg-white transition-all scale-0 group-hover:scale-100">
                                <Maximize2 size={20} />
                            </button>
                        </div>

                        {/* Thumbnails */}
                        <div className="flex gap-4">
                            <div className="w-24 h-24 rounded-2xl border-2 border-gold p-2 bg-white flex items-center justify-center shadow-md">
                                <img src={product.image_url || ''} className="w-full h-full object-contain" />
                            </div>
                            {selectedShade && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="w-24 h-24 rounded-2xl border-2 border-gray-100 overflow-hidden shadow-md"
                                >
                                    <div className="w-full h-full" style={{ backgroundColor: selectedShade.hex }} />
                                </motion.div>
                            )}
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Details & Controls */}
                    <div className="space-y-10">
                        <div>
                            <div className="flex items-center gap-3 mb-4">
                                <span className="px-3 py-1 bg-navy text-white rounded-full text-[10px] font-bold uppercase tracking-widest">
                                    {product.brand}
                                </span>
                                <span className="bg-gold/10 text-gold px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest leading-none border border-gold/20">
                                    {product.category}
                                </span>
                            </div>
                            <h1 className="font-heading text-4xl lg:text-5xl font-bold text-navy leading-tight mb-4 tracking-tight">
                                {isBrightoSuperEmulsion ? 'Plastic Emulsion Paint' : product.name}
                            </h1>
                            <p className="text-gray-400 font-medium text-sm leading-relaxed max-w-xl">
                                {product.brand} {product.name} (color) : <span className="text-navy font-bold">{selectedShade?.name || 'Select a shade'}</span>
                            </p>
                        </div>

                        {/* Color Selector (Grid) */}
                        {isBrightoSuperEmulsion && (
                            <ShadeSelector
                                shades={shades}
                                selectedSize={selectedSize}
                                onSelect={(s) => setSelectedShade(s)}
                            />
                        )}

                        {/* Size Selection */}
                        <div className="space-y-4">
                            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Stock Size</label>
                            <div className="flex flex-wrap gap-3">
                                {(['quarter', 'gallon', 'drum'] as ItemSize[]).map((size) => {
                                    const sizePrice = size === 'quarter' ? product.price_quarter : size === 'gallon' ? product.price_gallon : product.price_drum;
                                    if (sizePrice === 0) return null;
                                    return (
                                        <button
                                            key={size}
                                            onClick={() => setSelectedSize(size)}
                                            className={`px-8 py-3 rounded-xl text-sm font-bold transition-all border-2 ${selectedSize === size
                                                ? 'bg-navy border-navy text-white shadow-xl shadow-navy/20'
                                                : 'bg-white border-gray-100 text-gray-500 hover:border-gray-200'
                                                }`}
                                        >
                                            {size.charAt(0).toUpperCase() + size.slice(1)}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Price & POS */}
                        <div className="space-y-8 pt-4">
                            <div className="flex items-baseline gap-4">
                                <div className="text-4xl font-bold text-navy">Rs. {price?.toLocaleString()}</div>
                                <span className="text-green-500 text-sm font-bold">In Stock ({product.in_stock ? '40' : '0'})</span>
                            </div>

                            <div className="flex items-center gap-6">
                                <div className="flex items-center border-2 border-gray-100 rounded-xl bg-gray-50 p-1">
                                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-12 h-12 flex items-center justify-center text-navy font-bold hover:bg-white rounded-lg transition-colors">-</button>
                                    <span className="w-10 text-center font-bold text-navy">{quantity}</span>
                                    <button onClick={() => setQuantity(quantity + 1)} className="w-12 h-12 flex items-center justify-center text-navy font-bold hover:bg-white rounded-lg transition-colors">+</button>
                                </div>
                                <button
                                    onClick={handleAddToCart}
                                    disabled={addingToCart || !product.in_stock}
                                    className="flex-1 max-w-xs h-14 bg-navy text-white font-bold rounded-xl shadow-2xl shadow-navy/30 hover:bg-gold hover:shadow-gold/30 transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
                                >
                                    <ShoppingCart size={20} />
                                    {addingToCart ? 'Success!' : 'Add to Cart'}
                                </button>
                            </div>

                            <Link
                                href={`https://wa.me/923475658761?text=Hi! I want to order ${product.name} (${selectedSize}) with shade ${selectedShade?.name || 'Standard'}.`}
                                target="_blank"
                                className="flex items-center gap-2 text-green-500 font-bold hover:underline"
                            >
                                <MessageCircle size={18} />
                                Chat with Us on WhatsApp
                            </Link>
                        </div>

                        {/* Feature Badges */}
                        <div className="grid grid-cols-3 gap-4 pt-10 border-t border-gray-100">
                            {[
                                { icon: ShieldCheck, label: '100% Original' },
                                { icon: Truck, label: 'Standard Delivery' },
                                { icon: Package, label: 'Secure Packing' }
                            ].map((b, i) => (
                                <div key={i} className="flex flex-col items-center gap-2 text-center grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all cursor-default">
                                    <b.icon size={20} className="text-navy" />
                                    <span className="text-[9px] font-bold uppercase tracking-widest text-navy">{b.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
