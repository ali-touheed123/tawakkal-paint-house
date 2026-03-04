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

// Full list of Brighto Super Emulsion shades (65 total)
const BRIGHTO_SHADES: Shade[] = [
    { id: '9000', product_id: '', name: 'Brilliant White', code: '9000', hex: '#FFFFFF', is_drum_available: true },
    { id: '9012', product_id: '', name: 'Off White', code: '9012', hex: '#FAF9F6', is_drum_available: true },
    { id: '9041', product_id: '', name: 'Ash White', code: '9041', hex: '#F2F2F2', is_drum_available: true },
    { id: '9071', product_id: '', name: 'Lavender White', code: '9071', hex: '#F4F0FF', is_drum_available: false },
    { id: '9805', product_id: '', name: 'Wisteria White', code: '9805', hex: '#FDF5E6', is_drum_available: false },
    { id: '9807', product_id: '', name: 'Twilight', code: '9807', hex: '#E6E6FA', is_drum_available: false },
    { id: '9802', product_id: '', name: 'Kitten White', code: '9802', hex: '#FFF5EE', is_drum_available: false },
    { id: '9141', product_id: '', name: 'New Ash White', code: '9141', hex: '#E8E8E8', is_drum_available: false },
    { id: '9808', product_id: '', name: 'Silver Grey', code: '9808', hex: '#C0C0C0', is_drum_available: false },
    { id: '9809', product_id: '', name: 'Shell Grey', code: '9809', hex: '#D3D3D3', is_drum_available: false },
    { id: '9803', product_id: '', name: 'Dove White', code: '9803', hex: '#F8F8F8', is_drum_available: false },
    { id: '9684', product_id: '', name: 'Goose Wing', code: '9684', hex: '#DCDCDC', is_drum_available: false },
    { id: '9681', product_id: '', name: 'Ice Grey', code: '9681', hex: '#D1D1D1', is_drum_available: false },
    { id: '9070', product_id: '', name: 'Rose White', code: '9070', hex: '#FFF0F5', is_drum_available: false },
    { id: '9043', product_id: '', name: 'Whisper', code: '9043', hex: '#F5F5F5', is_drum_available: false },
    { id: '9046', product_id: '', name: 'Dove Grey', code: '9046', hex: '#A9A9A9', is_drum_available: false },
    { id: '9001', product_id: '', name: 'Cream', code: '9001', hex: '#FFFDD0', is_drum_available: false },
    { id: '9801', product_id: '', name: 'Ivory Silk', code: '9801', hex: '#FFFFF0', is_drum_available: false },
    { id: '9040', product_id: '', name: 'Peach Cream', code: '9040', hex: '#FFEFD5', is_drum_available: false },
    { id: '9306', product_id: '', name: 'Champaign', code: '9306', hex: '#F7E7CE', is_drum_available: false },
    { id: '9048', product_id: '', name: 'Badami', code: '9048', hex: '#EEDC82', is_drum_available: false },
    { id: '9804', product_id: '', name: 'Brazil Nut', code: '9804', hex: '#A67B5B', is_drum_available: false },
    { id: '9042', product_id: '', name: 'Sand Stone', code: '9042', hex: '#C2B280', is_drum_available: false },
    { id: '9017', product_id: '', name: 'Stone', code: '9017', hex: '#8B8680', is_drum_available: false },
    { id: '9305', product_id: '', name: 'Coca Milk', code: '9305', hex: '#D2B48C', is_drum_available: false },
    { id: '9022', product_id: '', name: 'Chocolate', code: '9022', hex: '#7B3F00', is_drum_available: false },
    { id: '9045', product_id: '', name: 'Pale Peach', code: '9045', hex: '#FFDAB9', is_drum_available: false },
    { id: '9050', product_id: '', name: 'Rose Petal', code: '9050', hex: '#F7CAC9', is_drum_available: false },
    { id: '9302', product_id: '', name: 'Palm Peach Pink', code: '9302', hex: '#FFD1DC', is_drum_available: false },
    { id: '9024', product_id: '', name: 'Apricot', code: '9024', hex: '#FBCEB1', is_drum_available: false },
    { id: '9686', product_id: '', name: 'Tea Rose', code: '9686', hex: '#F4C2C2', is_drum_available: false },
    { id: '9221', product_id: '', name: 'Deep Pink', code: '9221', hex: '#FF1493', is_drum_available: false },
    { id: '9688', product_id: '', name: 'Coral Spice', code: '9688', hex: '#E2725B', is_drum_available: false },
    { id: '9015', product_id: '', name: 'Rose Pink', code: '9015', hex: '#FF66CC', is_drum_available: false },
    { id: '9009', product_id: '', name: 'Brighto Pink', code: '9009', hex: '#FF007F', is_drum_available: false },
    { id: '9300', product_id: '', name: 'Summer Pink', code: '9300', hex: '#FFB6C1', is_drum_available: false },
    { id: '9222', product_id: '', name: 'Carnival Pink', code: '9222', hex: '#E4007C', is_drum_available: false },
    { id: '9007', product_id: '', name: 'Brighto Red', code: '9007', hex: '#ED1C24', is_drum_available: false },
    { id: '9690', product_id: '', name: 'Pastle Green', code: '9690', hex: '#77DD77', is_drum_available: false },
    { id: '9506', product_id: '', name: 'Fresh Green', code: '9506', hex: '#90EE90', is_drum_available: false },
    { id: '9689', product_id: '', name: 'Pine Frost', code: '9689', hex: '#E0F2F1', is_drum_available: false },
    { id: '9006', product_id: '', name: 'Lime Green', code: '9006', hex: '#32CD32', is_drum_available: false },
    { id: '9010', product_id: '', name: 'Melody Green', code: '9010', hex: '#98FF98', is_drum_available: false },
    { id: '9027', product_id: '', name: 'Apple Green', code: '9027', hex: '#8DB600', is_drum_available: false },
    { id: '9004', product_id: '', name: 'Brighto Green', code: '9004', hex: '#008000', is_drum_available: false },
    { id: '9510', product_id: '', name: 'Forest Green', code: '9510', hex: '#228B22', is_drum_available: false },
    { id: '9513', product_id: '', name: 'Green Summit', code: '9513', hex: '#004225', is_drum_available: false },
    { id: '9035', product_id: '', name: 'Leaf Green', code: '9035', hex: '#3CB371', is_drum_available: false },
    { id: '9011', product_id: '', name: 'Lilac', code: '9011', hex: '#C8A2C8', is_drum_available: false },
    { id: '9683', product_id: '', name: 'Soothing Lilac', code: '9683', hex: '#E6E6FA', is_drum_available: false },
    { id: '9501', product_id: '', name: 'Purple', code: '9501', hex: '#800080', is_drum_available: false },
    { id: '9014', product_id: '', name: 'Ice Blue', code: '9014', hex: '#AFEEEE', is_drum_available: false },
    { id: '9002', product_id: '', name: 'Light Blue', code: '9002', hex: '#ADD8E6', is_drum_available: false },
    { id: '9008', product_id: '', name: 'Brighto Blue', code: '9008', hex: '#0000FF', is_drum_available: false },
    { id: '9502', product_id: '', name: 'Peacock Plum', code: '9502', hex: '#BDB76B', is_drum_available: false },
    { id: '9503', product_id: '', name: 'Fluorite', code: '9503', hex: '#996515', is_drum_available: false },
    { id: '9508', product_id: '', name: 'Electric Blue', code: '9508', hex: '#7DF9FF', is_drum_available: false },
    { id: '9072', product_id: '', name: 'Cockleshell', code: '9072', hex: '#FFE5B4', is_drum_available: false },
    { id: '9303', product_id: '', name: 'Zephyr', code: '9303', hex: '#778899', is_drum_available: false },
    { id: '9687', product_id: '', name: 'Cameo', code: '9687', hex: '#D2B48C', is_drum_available: false },
    { id: '9692', product_id: '', name: 'Parasol', code: '9692', hex: '#EEDC82', is_drum_available: false },
    { id: '9332', product_id: '', name: 'Classical', code: '9332', hex: '#F5F5DC', is_drum_available: false },
    { id: '9005', product_id: '', name: 'Orange', code: '9005', hex: '#FFA500', is_drum_available: false },
    { id: '9698', product_id: '', name: 'Terracotta', code: '9698', hex: '#E2725B', is_drum_available: false },
    { id: '9810', product_id: '', name: 'Black', code: '9810', hex: '#000000', is_drum_available: false }
];

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
                                onSelect={setSelectedShade}
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
