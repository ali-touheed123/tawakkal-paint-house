'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Trash2, Minus, Plus, MessageCircle, ArrowRight } from 'lucide-react';
import { useCartStore } from '@/lib/store';
import { useDiscountRules } from '@/lib/hooks/useSettings';

export default function CartPage() {
  const { items, updateQuantity, removeItem, getTotal } = useCartStore();
  const { calculateDiscount, getNextTier } = useDiscountRules();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const subtotal = getTotal();
  const discountPercent = calculateDiscount(subtotal);
  const discountAmount = subtotal * (discountPercent / 100);
  const total = subtotal - discountAmount;
  const nextTier = getNextTier(subtotal);

  const getPrice = (item: typeof items[0]) => {
    if (!item.product) return 0;
    return item.size === 'quarter'
      ? item.product.price_quarter
      : item.size === 'gallon'
        ? item.product.price_gallon
        : item.product.price_drum;
  };

  return (
    <div className="min-h-screen pt-[70px] bg-off-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="font-heading text-3xl md:text-4xl font-bold text-navy mb-8">Shopping Cart</h1>

        {items.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg mb-4">Your cart is empty</p>
            <Link
              href="/category/decorative"
              className="inline-flex items-center gap-2 bg-gold text-navy px-8 py-4 rounded-lg font-semibold hover:bg-gold-light transition-colors"
            >
              Start Shopping <ArrowRight size={20} />
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-xl p-4 shadow-md flex gap-4"
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
                    <p className="text-gray-500 text-sm capitalize mb-2">{item.size}</p>

                    <div className="flex items-center justify-between">
                      {/* Quantity */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center hover:bg-gold-pale transition-colors"
                        >
                          <Minus size={16} />
                        </button>
                        <span className="w-8 text-center font-medium">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center hover:bg-gold-pale transition-colors"
                        >
                          <Plus size={16} />
                        </button>
                      </div>

                      {/* Price */}
                      <p className="font-heading text-lg font-semibold text-navy">
                        Rs. {(getPrice(item) * item.quantity).toLocaleString()}
                      </p>
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
              ))}
            </div>

            {/* Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl p-6 shadow-md sticky top-24">
                <h2 className="font-heading text-xl font-semibold text-navy mb-6">Order Summary</h2>


                {/* Totals */}
                <div className="space-y-3 border-t border-gray-100 pt-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">Rs. {subtotal.toLocaleString()}</span>
                  </div>

                  {discountPercent > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount ({discountPercent}%)</span>
                      <span>- Rs. {discountAmount.toLocaleString()}</span>
                    </div>
                  )}

                  {discountAmount > 0 && (
                    <div className="flex items-center gap-2 bg-green-50 px-3 py-2 rounded-lg">
                      <span className="text-green-700 text-sm">You save Rs. {discountAmount.toLocaleString()}</span>
                    </div>
                  )}

                  <div className="flex justify-between font-heading text-xl font-bold text-navy pt-3 border-t">
                    <span>Total</span>
                    <span>Rs. {total.toLocaleString()}</span>
                  </div>
                </div>

                {/* WhatsApp */}
                <a
                  href={`https://wa.me/923475658761?text=Hi! I have ${items.length} items in my cart totaling Rs. ${total}. Can you help me with my order?`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-3 mt-6 border-2 border-green-500 text-green-500 rounded-lg font-medium hover:bg-green-500 hover:text-white transition-colors"
                >
                  <MessageCircle size={18} />
                  Enquire on WhatsApp
                </a>

                {/* Checkout Button */}
                <Link
                  href="/checkout"
                  className="block w-full text-center mt-4 py-4 rounded-lg font-semibold bg-navy text-white hover:bg-navy/90 transition-colors"
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
