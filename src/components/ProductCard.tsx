'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { MessageCircle, FileText, ShoppingCart, Plus, Minus } from 'lucide-react';
import { Product } from '@/types';
import { cn } from '@/lib/utils';
import { useCartStore } from '@/lib/store';

interface ProductCardProps {
  product: Product;
  index?: number;
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const [imgError, setImgError] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const addItem = useCartStore(state => state.addItem);

  const getImageUrl = () => {
    if (!product.image_url || imgError) {
      return `https://placehold.co/400x400/0F1F3D/C9973A?text=${encodeURIComponent(product.brand)}`;
    }
    return product.image_url;
  };

  const isPaintTool = product.category === 'Paint Tools' || product.category === 'paint-tools';

  // Get price from either legacy column or units array
  const unitPrice = product.price_quarter || (product.units && product.units.length > 0 ? product.units[0].price : 0);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // For tools, we use price_quarter as the unit price and size is 'one-size' or 'quarter'
    // The store should handle null shades and default labour config
    addItem(
      product.id,
      product.units?.[0]?.label || 'Pc', // Use specific label for tools if available
      quantity,
      product,
      undefined, // No shades for tools
      'without', // Tools don't have labour mode Usually
      0
    );
  };

  const cardContent = (
    <div className="p-3">
      <div className="flex items-center justify-between mb-0.5">
        <p className="text-gold text-[10px] uppercase tracking-wider font-semibold">
          {product.brand}
        </p>
        <div className="flex items-center gap-1">
          <div className={cn(
            "w-1.5 h-1.5 rounded-full animate-pulse",
            product.in_stock ? "bg-green-500" : "bg-red-500"
          )} />
          <span className={cn(
            "text-[9px] font-bold uppercase tracking-tight",
            product.in_stock ? "text-green-600" : "text-red-600"
          )}>
            {product.in_stock ? 'In Stock' : 'Out of Stock'}
          </span>
        </div>
      </div>
      <h3 className="font-heading text-base font-semibold text-navy mb-2 line-clamp-2 h-12">
        {(() => {
          const nameLower = product.name.toLowerCase();
          const brandLower = product.brand.toLowerCase();
          const brandBase = brandLower.replace(/[''’]/g, '');

          if (nameLower.startsWith(brandLower)) {
            return product.name.slice(product.brand.length).trim();
          }
          if (nameLower.startsWith(brandBase)) {
            return product.name.slice(brandBase.length).trim();
          }
          return product.name;
        })()}
      </h3>

      {isPaintTool && unitPrice > 0 && (
        <div className="mb-4">
          <div className="text-gold font-bold text-lg">
            Rs. {unitPrice.toLocaleString()}
          </div>
          <p className="text-[10px] text-gray-500 font-medium">{product.units?.[0]?.label || 'Unit Price'}</p>
          
          <div className="flex items-center gap-3 mt-3 bg-gray-50 p-2 rounded-xl justify-between border border-gray-100">
            <button 
              onClick={(e) => { e.preventDefault(); setQuantity(q => Math.max(1, q - 1)); }}
              className="w-7 h-7 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-navy hover:bg-gold hover:border-gold hover:text-white transition-all active:scale-90"
            >
              <Minus size={14} />
            </button>
            <span className="font-bold text-navy text-sm">{quantity}</span>
            <button 
              onClick={(e) => { e.preventDefault(); setQuantity(q => q + 1); }}
              className="w-7 h-7 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-navy hover:bg-gold hover:border-gold hover:text-white transition-all active:scale-90"
            >
              <Plus size={14} />
            </button>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-col xs:flex-row gap-1.5 mt-auto">
        <Link
          href={`https://wa.me/923475658761?text=Hi! I'm interested in ${product.name}. Please share availability and price.`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-1.5 py-2 px-1 rounded-lg text-[10px] xs:text-xs font-bold border-2 border-green-500 text-green-500 hover:bg-green-500 hover:text-white transition-colors cursor-pointer whitespace-nowrap"
        >
          <MessageCircle size={14} className="shrink-0" />
          <span>Inquiry</span>
        </Link>
        
        {isPaintTool ? (
          <button
            onClick={handleAddToCart}
            disabled={!product.in_stock}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 px-1 rounded-lg text-[10px] xs:text-xs font-bold bg-green-600 text-white hover:bg-green-700 transition-colors cursor-pointer whitespace-nowrap disabled:bg-gray-400 disabled:cursor-not-allowed group/btn"
          >
            <ShoppingCart size={14} className="shrink-0 group-hover/btn:scale-110 transition-transform" />
            <span>Add to Cart</span>
          </button>
        ) : (
          <Link
            href={`/product/${product.id}`}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 px-1 rounded-lg text-[10px] xs:text-xs font-bold bg-navy text-white hover:bg-gold transition-colors cursor-pointer whitespace-nowrap"
          >
            <FileText size={14} className="shrink-0" />
            <span>Details</span>
          </Link>
        )}
      </div>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ 
        duration: 0.6, 
        delay: index % 5 * 0.1, // Stagger based on column position
        ease: [0.22, 1, 0.36, 1] // Custom cubic-bezier for premium feel
      }}
      className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow border border-gold/10 group h-full flex flex-col"
    >
      {/* Image */}
      {isPaintTool ? (
        <div className="relative aspect-square overflow-hidden bg-white border-b border-gray-100 block">
          <img
            src={getImageUrl()}
            alt={`${product.brand} ${product.name}`}
            onError={() => setImgError(true)}
            className="w-full h-full object-contain p-2"
          />
          {!product.in_stock && (
            <div className="absolute inset-0 bg-navy/60 flex items-center justify-center">
              <span className="text-white font-semibold">Out of Stock</span>
            </div>
          )}
        </div>
      ) : (
        <Link href={`/product/${product.id}`} className="relative aspect-square overflow-hidden bg-white border-b border-gray-100 block">
          <img
            src={getImageUrl()}
            alt={`${product.brand} ${product.name} - ${product.category} Paint`}
            onError={() => setImgError(true)}
            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500 p-2"
            title={`${product.brand} ${product.name}`}
          />
          {!product.in_stock && (
            <div className="absolute inset-0 bg-navy/60 flex items-center justify-center">
              <span className="text-white font-semibold">Out of Stock</span>
            </div>
          )}
        </Link>
      )}

      {cardContent}
    </motion.div>
  );
}
