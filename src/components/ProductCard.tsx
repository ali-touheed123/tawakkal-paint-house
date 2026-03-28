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

  // Get price from units array (priority) or legacy column
  const unitPrice = (product.units && product.units.length > 0) 
    ? product.units[0].price 
    : (product.price_quarter || 0);
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
        <div className="mb-3">
          {isSavingActive ? (
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-amber-600 font-bold bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200 text-[9px] uppercase tracking-wider">
                  <Gift size={11} />
                  <span>Free Gift</span>
                </div>
                <div className={`text-[10px] font-black ${
                  claimStatus === 'claimed' ? 'text-green-600' :
                  (claimStatus === 'rejected' || isLimitReached) ? 'text-red-500 underline decoration-dotted cursor-help' :
                  'text-amber-600'
                }`}
                title={isLimitReached ? "Click 'How to Claim' below for details" : ""}
                >
                  {claimStatus === 'claimed' ? '✓ Claimed' :
                   (claimStatus === 'rejected' || isLimitReached) ? '✗ Not Eligible' :
                   '✦ Eligible'}
                </div>
              </div>

              {/* Compact Quantity Selector — integrated above main action */}
              <div className={`flex items-center gap-2 bg-gray-50/80 p-1.5 rounded-lg justify-between border border-gray-100 ${
                (claimStatus === 'rejected' || isLimitReached) ? 'opacity-50 pointer-events-none' : ''
              }`}>
                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => { e.preventDefault(); setQuantity(q => Math.max(1, q - 1)); }}
                    className="w-6 h-6 rounded bg-white border border-gray-200 flex items-center justify-center text-navy hover:bg-gold hover:text-white transition-all active:scale-95"
                  >
                    <Minus size={12} />
                  </button>
                  <span className="font-bold text-navy text-xs w-4 text-center">{quantity}</span>
                  <button
                    onClick={(e) => { e.preventDefault(); setQuantity(q => q + 1); }}
                    className="w-6 h-6 rounded bg-white border border-gray-200 flex items-center justify-center text-navy hover:bg-gold hover:text-white transition-all active:scale-95"
                  >
                    <Plus size={12} />
                  </button>
                </div>
                <span className="text-[9px] text-gray-400 font-bold uppercase">Qty</span>
              </div>
            </div>
          ) : (
            <div className="bg-amber-50/50 border border-amber-200 p-2 rounded-lg flex items-center gap-2">
              <Gift size={15} className="text-amber-500 shrink-0" />
              <div className="text-left">
                <p className="text-[10px] font-black text-amber-700 leading-none">Complimentary Gift</p>
                <p className="text-[8px] text-amber-600 mt-1">Available with "Without Labour" orders</p>
              </div>
            </div>
          )}
        </div>
      ) : null}

      {/* Actions */}
      <div className="flex flex-col xs:flex-row gap-1.5 mt-auto">
        {isPaintTool ? (
          <div className="flex gap-1.5 flex-1 relative">
            {isSavingActive ? (
              <>
                <button
                  onClick={handleAddToCart}
                  disabled={!product.in_stock || claimStatus === 'rejected' || isLimitReached}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg text-[11px] font-black transition-all cursor-pointer whitespace-nowrap disabled:cursor-not-allowed group/btn ${
                    claimStatus === 'claimed' ? 'bg-green-600 text-white' :
                    (claimStatus === 'rejected' || isLimitReached) ? 'bg-gray-100 text-gray-400' :
                    'bg-amber-400 text-white hover:bg-amber-500 shadow-md hover:shadow-lg active:scale-95'
                  }`}
                >
                  <Gift size={14} className={cn("shrink-0", claimStatus === 'claimed' ? "animate-bounce" : "")} />
                  <span>
                    {claimStatus === 'claimed' ? 'Claimed!' :
                     (claimStatus === 'rejected' || isLimitReached) ? 'Not Eligible' :
                     'Claim Gift'}
                  </span>
                </button>
                
                {/* Slim Inquiry Button */}
                <Link
                  href={`https://wa.me/923475658761?text=Hi! I interested in ${product.name}`}
                  target="_blank"
                  className="w-10 flex items-center justify-center rounded-lg border-2 border-green-500 text-green-500 hover:bg-green-500 hover:text-white transition-all shadow-sm"
                  title="Inquiry"
                >
                  <MessageCircle size={16} />
                </Link>
              </>
            ) : (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  alert("Select 'Without Labour' on any paint product to claim these tools!");
                }}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-black bg-amber-400 text-white hover:bg-amber-500 shadow-md transition-all active:scale-95"
              >
                <Gift size={15} className="shrink-0" />
                <span>How to Claim</span>
              </button>
            )}
            
            {/* If limit is reached, show a small "?" badge */}
            {isSavingActive && (claimStatus === 'rejected' || isLimitReached) && (
              <button 
                onClick={(e) => {
                  e.preventDefault();
                  alert("Your free tool credit is finished. Add more 'Without Labour' paint products to get more credit!");
                }}
                className="absolute -top-12 right-0 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-[10px] font-bold shadow-lg animate-pulse border-2 border-white"
                title="How to get more credit?"
              >
                ?
              </button>
            )}
          </div>
        ) : (
          <>
            <Link
              href={`https://wa.me/923475658761?text=Hi! I interested in ${product.name}`}
              target="_blank"
              className="flex-1 flex items-center justify-center gap-1.5 py-2 px-1 rounded-lg text-xs font-bold border-2 border-green-500 text-green-500 hover:bg-green-500 hover:text-white transition-colors"
            >
              <MessageCircle size={14} />
              <span>Inquiry</span>
            </Link>
            <Link
              href={`/product/${product.slug}`}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 px-1 rounded-lg text-xs font-bold bg-navy text-white hover:bg-gold transition-colors"
            >
              <FileText size={14} />
              <span>Details</span>
            </Link>
          </>
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
        <Link href={`/product/${product.slug}`} className="relative aspect-square overflow-hidden bg-white border-b border-gray-100 block">
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
