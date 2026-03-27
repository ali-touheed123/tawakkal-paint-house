'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { MessageCircle, FileText, ShoppingCart, Plus, Minus, Gift } from 'lucide-react';
import { Product } from '@/types';
import { cn } from '@/lib/utils';
import { useCartStore, useUIStore } from '@/lib/store';

interface ProductCardProps {
  product: Product;
  index?: number;
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const [imgError, setImgError] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [claimStatus, setClaimStatus] = useState<'idle' | 'claimed' | 'rejected'>('idle');

  const addItem = useCartStore(state => state.addItem);
  const addGiftItem = useCartStore(state => state.addGiftItem);
  const remainingCredit = useCartStore(state => state.getRemainingCredit());
  const savingSessionActive = useUIStore(state => state.savingSessionActive);

  const getImageUrl = () => {
    if (!product.image_url || imgError) {
      return `https://placehold.co/400x400/0F1F3D/C9973A?text=${encodeURIComponent(product.brand)}`;
    }
    return product.image_url;
  };

  const isPaintTool = product.category?.toLowerCase() === 'paint-tools' || 
                      product.category?.toLowerCase() === 'paint tools' || 
                      product.category === 'Paint Tools';
  const hasAllowance = useCartStore(state => state.getSavingAllowance() > 0);
  
  // Activate saving mode for paint tools if global session is active OR if they already have saving allowance in cart
  const isSavingActive = isPaintTool && (savingSessionActive || hasAllowance);

  // Get price from either legacy column or units array
  const unitPrice = product.price_quarter || (product.units && product.units.length > 0 ? product.units[0].price : 0);

  const isLimitReached = isSavingActive && unitPrice > remainingCredit;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // When saving session is active on a paint tool, try to claim as gift
    if (isSavingActive) {
      const price = product.units?.[0]?.price || unitPrice;
      if (price <= remainingCredit) {
        const success = addGiftItem(
          product.id,
          product.units?.[0]?.label || 'Pc',
          quantity,
          product,
          price
        );
        if (success) {
          setClaimStatus('claimed');
          setTimeout(() => setClaimStatus('idle'), 1500);
        } else {
          setClaimStatus('rejected');
          setTimeout(() => setClaimStatus('idle'), 1500);
        }
      } else {
        setClaimStatus('rejected');
        setTimeout(() => setClaimStatus('idle'), 1500);
      }
      return;
    }

    // Normal add to cart
    addItem(
      product.id,
      product.units?.[0]?.label || 'Pc',
      quantity,
      product,
      undefined,
      'with',
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
          const brandBase = brandLower.replace(/[''']/g, '');

          if (nameLower.startsWith(brandLower)) {
            return product.name.slice(product.brand.length).trim();
          }
          if (nameLower.startsWith(brandBase)) {
            return product.name.slice(brandBase.length).trim();
          }
          return product.name;
        })()}
      </h3>

      {isPaintTool ? (
        <div className="mb-4">
          {/* If saving session is active, show eligibility. Otherwise, show general complimentary message */}
          {isSavingActive ? (
            <>
              <div className="flex flex-col gap-1.5 mb-3">
                <div className="flex items-center gap-1.5 text-amber-600 font-bold bg-amber-50 px-2.5 py-1.5 rounded-lg w-fit border border-amber-200">
                  <Gift size={15} />
                  <span className="text-[10px] uppercase tracking-wider">Compiment Pack Item</span>
                </div>
                <p className="text-[10px] text-gray-400 font-semibold tracking-tight">Included in your savings credit</p>
              </div>
              <div className={`font-bold text-sm py-2 text-center rounded-xl border ${
              claimStatus === 'claimed' ? 'bg-green-50 border-green-200 text-green-600' :
              (claimStatus === 'rejected' || isLimitReached) ? 'bg-red-50 border-red-200 text-red-500' :
              'bg-amber-50 border-amber-200 text-amber-600'
            }`}>
              {claimStatus === 'claimed' ? '✓ Claimed as Gift' :
               (claimStatus === 'rejected' || isLimitReached) ? '✗ Not Eligible' :
               '✦ Eligible for Credit'}
            </div>
            
            <div className={`flex items-center gap-3 mt-3 bg-gray-50 p-2 rounded-xl justify-between border border-gray-100 ${
              (claimStatus === 'rejected' || isLimitReached) ? 'opacity-50 pointer-events-none' : ''
            }`}>
              <button
                onClick={(e) => { e.preventDefault(); setQuantity(q => Math.max(1, q - 1)); }}
                className="w-7 h-7 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-navy hover:bg-amber-400 hover:border-amber-400 hover:text-white transition-all active:scale-90"
              >
                <Minus size={14} />
              </button>
              <span className="font-bold text-navy text-sm">{quantity}</span>
              <button
                onClick={(e) => { e.preventDefault(); setQuantity(q => q + 1); }}
                className="w-7 h-7 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-navy hover:bg-amber-400 hover:border-amber-400 hover:text-white transition-all active:scale-90"
              >
                <Plus size={14} />
              </button>
            </div>
          </>
          ) : (
            <div className="bg-amber-50 border border-amber-200 p-2 rounded-xl text-center">
              <Gift size={16} className="text-amber-500 mx-auto mb-1" />
              <p className="text-xs font-bold text-amber-700 leading-tight">
                Complimentary Gift
              </p>
              <p className="text-[9px] text-amber-600 mt-0.5">
                Available with "Without Labour" paint orders
              </p>
            </div>
          )}
        </div>
      ) : unitPrice > 0 && (
        <div className="mb-4">
          <div className="text-gold font-bold text-lg">
            Rs. {unitPrice.toLocaleString()}
          </div>
          <p className="text-[10px] text-gray-500 font-medium">{product.units?.[0]?.label || 'Unit Price'}</p>
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
          isSavingActive ? (
            <button
              onClick={handleAddToCart}
              disabled={!product.in_stock || claimStatus === 'rejected' || isLimitReached}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-1 rounded-lg text-[10px] xs:text-xs font-bold transition-colors cursor-pointer whitespace-nowrap disabled:cursor-not-allowed group/btn ${
                claimStatus === 'claimed' ? 'bg-green-500 text-white' :
                (claimStatus === 'rejected' || isLimitReached) ? 'bg-gray-300 text-gray-500' :
                'bg-amber-400 text-white hover:bg-amber-500'
              }`}
            >
              <Gift size={14} className="shrink-0" />
              <span>
                {claimStatus === 'claimed' ? 'Claimed!' :
                 (claimStatus === 'rejected' || isLimitReached) ? 'Not Eligible' :
                 'Claim Gift'}
              </span>
            </button>
          ) : (
            <button
              onClick={(e) => {
                e.preventDefault();
                alert("These tools are exclusively available as free gifts. Select 'Without Labour' on any paint product to claim them!");
              }}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 px-1 rounded-lg text-[10px] xs:text-xs font-bold bg-amber-400 text-white hover:bg-amber-500 transition-colors cursor-pointer whitespace-nowrap"
            >
              <Gift size={14} className="shrink-0" />
              <span>How to Claim</span>
            </button>
          )
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
        delay: index % 5 * 0.1,
        ease: [0.22, 1, 0.36, 1]
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
