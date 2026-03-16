'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { MessageCircle, FileText } from 'lucide-react';
import { Product } from '@/types';
import { cn } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
  index?: number;
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const [imgError, setImgError] = useState(false);

  const getImageUrl = () => {
    if (!product.image_url || imgError) {
      return `https://placehold.co/400x400/0F1F3D/C9973A?text=${encodeURIComponent(product.brand)}`;
    }
    return product.image_url;
  };



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
      className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow border border-gold/10 group"
    >
      {/* Image */}
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

      {/* Content */}
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
          <Link
            href={`/product/${product.id}`}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 px-1 rounded-lg text-[10px] xs:text-xs font-bold bg-navy text-white hover:bg-gold transition-colors cursor-pointer whitespace-nowrap"
          >
            <FileText size={14} className="shrink-0" />
            <span>Details</span>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
