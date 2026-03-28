'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Trash2, Minus, Plus, MessageCircle, ArrowRight, Truck, Wrench, Check, Gift } from 'lucide-react';
import { useCartStore } from '@/lib/store';
import { useDiscountRules, useLabourSettings } from '@/lib/hooks/useSettings';

export default function CartPage() {
  const { items, updateQuantity, removeItem, getTotal, getLabourSubtotals, refreshItems, getRemainingCredit } = useCartStore();
  const { getNextToolTier, labourFreeMin, labourFreeMax } = useLabourSettings();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    refreshItems();
    window.scrollTo(0, 0);
  }, []);

  if (!mounted) return null;

  const { withLabourSubtotal, withoutLabourSubtotal } = getLabourSubtotals();
  const subtotal = getTotal(); // total after per-item without-labour discounts
  const hasAnyWithoutLabour = withoutLabourSubtotal > 0;
  const hasAnyWithLabour = withLabourSubtotal > 0;

  const total = subtotal;

  const getItemBasePrice = (item: typeof items[0]) => {
    if (!item.product) return 0;
    const units = item.product.units || [];
    const unit = units.find((u: any) => u.label === item.size) || units[0];
    return unit?.price || 0;
  };

  const getItemEffectivePrice = (item: typeof items[0]) => {
    const base = getItemBasePrice(item);
    if (item.labourMode === 'without') {
      const d = item.labourDiscount || 0;
      return Math.round(base * (1 - d / 100));
    }
    return base;
  };

  return (
    <div className="min-h-screen pt-[70px] bg-off-white">
      <div className="max-w-7xl mx-auto px-3 xs:px-4 sm:px-6 lg:px-8 py-8 xs:py-12">
        <h1 className="font-heading text-2xl xs:text-3xl md:text-4xl font-bold text-navy mb-6 xs:mb-8">Cart</h1>

        {items.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg mb-4">Your cart is empty</p>
            <Link
              href="/#categories"
              className="inline-flex items-center gap-2 bg-gold text-navy px-8 py-4 rounded-lg font-semibold hover:bg-gold-light transition-colors"
            >
              Start Shopping <ArrowRight size={20} />
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => {
                const basePrice = getItemBasePrice(item);
                const effectivePrice = item.isGift ? 0 : getItemEffectivePrice(item);
                const isWithout = item.labourMode === 'without' && !item.isGift;
                const discount = item.labourDiscount || 0;

                // Gift items: can only increase if remaining credit covers one more unit
                const canIncreaseGift = item.isGift
                  ? (item.originalPrice || 0) <= getRemainingCredit()
                  : true;

                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`bg-white rounded-xl p-4 shadow-md flex flex-col sm:flex-row gap-4 border-2 transition-all ${
                      item.isGift ? 'border-green-300 bg-green-50/30' : isWithout ? 'border-amber-100' : 'border-transparent'
                    }`}
                  >
                    {/* Image */}
                    <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={item.product?.image_url || 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200'}
                        alt={item.product?.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <p className="text-gold text-xs uppercase tracking-wider font-semibold">
                        {item.product?.brand}
                      </p>
                      <h3 className="font-heading text-base font-semibold text-navy truncate">
                        {item.product?.name}
                      </h3>

                      <div className="flex flex-wrap items-center gap-2 text-sm mb-2 mt-1">
                        <p className="text-navy font-bold uppercase text-[10px] tracking-widest bg-gray-50 px-2 py-1 rounded">
                          {item.size}
                        </p>

                        {/* Gift badge */}
                        {item.isGift ? (
                          <span className="text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-full flex items-center gap-1 bg-green-100 text-green-700">
                            <Gift size={9} /> Free Gift
                          </span>
                        ) : (
                          <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-full flex items-center gap-1 ${
                            isWithout
                              ? 'bg-amber-100 text-amber-700'
                              : 'bg-green-50 text-green-700'
                          }`}>
                            {isWithout ? <Wrench size={9} /> : <Truck size={9} />}
                            {isWithout ? 'Without Labour' : 'With Labour'}
                          </span>
                        )}

                        {item.selectedShade && (
                          <div className="flex items-center gap-1.5 border-l border-gray-200 pl-2">
                            <div
                              className="w-3 h-3 rounded-full shadow-sm border border-gray-100"
                              style={{ backgroundColor: item.selectedShade.hex }}
                            />
                            <span className="text-navy font-medium text-xs">
                              {item.selectedShade.name}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Without Labour discount info */}
                      {isWithout && discount > 0 && (
                        <p className="text-[10px] text-green-600 font-bold mb-1.5">
                          {discount}% product discount applied · No service included · Delivery charges apply
                        </p>
                      )}
                      {item.isGift && (
                        <p className="text-[10px] text-green-600 font-bold mb-1.5">
                          ✦ Complimentary — Included in your saving pack
                        </p>
                      )}
                      {!isWithout && !item.isGift && (
                        <p className="text-[10px] text-green-600 font-bold mb-1.5">
                          Includes free service &amp; delivery · Eligible for service discount
                        </p>
                      )}

                      <div className="flex flex-wrap items-center justify-between gap-y-3">
                        {/* Quantity */}
                        <div className="flex items-center gap-1.5 xs:gap-2">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-7 h-7 xs:w-8 xs:h-8 rounded-lg bg-gray-100 flex items-center justify-center hover:bg-gold-pale transition-colors"
                          >
                            <Minus size={14} className="xs:w-4 xs:h-4" />
                          </button>
                          <span className="w-6 text-center font-medium text-sm xs:text-base">{item.quantity}</span>
                          <button
                            onClick={() => canIncreaseGift && updateQuantity(item.id, item.quantity + 1)}
                            disabled={!canIncreaseGift}
                            className={`w-7 h-7 xs:w-8 xs:h-8 rounded-lg flex items-center justify-center transition-colors ${
                              canIncreaseGift
                                ? 'bg-gray-100 hover:bg-gold-pale'
                                : 'bg-gray-100 opacity-40 cursor-not-allowed'
                            }`}
                          >
                            <Plus size={14} className="xs:w-4 xs:h-4" />
                          </button>
                        </div>

                        {/* Price */}
                        <div className="text-right">
                          {item.isGift ? (
                            <p className="font-heading text-base xs:text-lg font-bold text-green-600 whitespace-nowrap">
                              FREE
                            </p>
                          ) : (
                            <>
                              {isWithout && discount > 0 && (
                                <p className="text-xs text-gray-400 line-through">
                                  Rs. {(basePrice * item.quantity).toLocaleString()}
                                </p>
                              )}
                              <p className="font-heading text-base xs:text-lg font-bold text-navy whitespace-nowrap">
                                Rs. {(effectivePrice * item.quantity).toLocaleString()}
                              </p>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Remove */}
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                      aria-label="Remove item"
                    >
                      <Trash2 size={20} />
                    </button>
                  </motion.div>
                );
              })}
            </div>

            {/* Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl p-6 shadow-md sticky top-24 space-y-4">
                <h2 className="font-heading text-xl font-semibold text-navy">Order Summary</h2>

                {/* Mixed cart info removed for cleaner UI */}


                {/* Totals */}
                <div className="space-y-3 border-t border-gray-100 pt-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span>Rs. {subtotal.toLocaleString()}</span>
                  </div>


                  <div className="flex justify-between text-gray-600">
                    <span>Delivery</span>
                    <span>{hasAnyWithoutLabour ? 'Calculated at checkout' : 'FREE'}</span>
                  </div>

                  <div className="flex justify-between font-heading text-xl font-bold text-navy pt-3 border-t">
                    <span>Total</span>
                    <span>Rs. {total.toLocaleString()}</span>
                  </div>


                  {/* Delivery info per labour mode */}
                  <div className="space-y-1.5 pt-2">
                    {hasAnyWithLabour && (
                      <div className="flex items-center gap-2 text-xs text-green-600">
                        <Truck size={12} />
                        <span>With-Labour items: Free delivery included</span>
                      </div>
                    )}
                    {hasAnyWithoutLabour && (
                      <div className="flex items-center gap-2 text-xs text-amber-600">
                        <Wrench size={12} />
                        <span>Without-Labour: {subtotal >= (labourFreeMin || 6000) && subtotal < ((labourFreeMax || 39999) + 1) ? 'Free delivery unlocked' : 'Rs. 300 delivery fee applies'}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* WhatsApp */}
                <a
                  href={`https://wa.me/923475658761?text=Hi! I have ${items.length} items in my cart totaling Rs. ${total}. Can you help me with my order?`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-3 border-2 border-green-500 text-green-500 rounded-lg font-medium hover:bg-green-500 hover:text-white transition-colors"
                >
                  <MessageCircle size={18} />
                  Enquire on WhatsApp
                </a>

                {/* Checkout Button */}
                <Link
                  href="/checkout"
                  className="block w-full text-center py-4 rounded-lg font-semibold bg-navy text-white hover:bg-navy/90 transition-colors"
                >
                  Proceed to Checkout
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
