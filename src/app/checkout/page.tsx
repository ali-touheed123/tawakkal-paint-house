'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Loader2, Lock, Check, CreditCard, Smartphone, Building } from 'lucide-react';
import { useCartStore, useLocationStore } from '@/lib/store';
import { createClient } from '@/lib/supabase/client';
import { useDiscountRules, useShippingRates, usePaymentMethods } from '@/lib/hooks/useSettings';
import { type OrderItem } from '@/types';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getTotal, clearCart, refreshItems } = useCartStore();
  const { area: globalArea, setArea: setGlobalArea } = useLocationStore();

  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const { calculateDiscount } = useDiscountRules();
  const { getRateForArea, rates } = useShippingRates();
  const { methods: paymentMethods } = usePaymentMethods();
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    deliveryArea: globalArea || '',
    deliveryAddress: ''
  });
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('cod');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    setMounted(true);
    refreshItems();
  }, []);

  // Sync global area to form if it changes externally
  useEffect(() => {
    if (globalArea && globalArea !== formData.deliveryArea) {
      setFormData(prev => ({ ...prev, deliveryArea: globalArea }));
    }
  }, [globalArea]);



  if (!mounted) {
    return (
      <div className="min-h-screen pt-[70px] flex items-center justify-center">
        <Loader2 className="animate-spin text-gold" size={40} />
      </div>
    );
  }

  if (orderId) {
    return (
      <div className="min-h-screen pt-[70px] bg-off-white flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md mx-auto text-center p-8 bg-white rounded-2xl shadow-xl"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="w-20 h-20 bg-gold rounded-full flex items-center justify-center mx-auto mb-6 animate-shimmer"
          >
            <Check className="text-navy" size={40} />
          </motion.div>
          <h1 className="font-heading text-3xl font-bold text-navy mb-4">Order Placed!</h1>
          <p className="text-gray-600 mb-2">Your order has been confirmed.</p>
          <p className="text-gold font-semibold text-xl mb-6">Order ID: {orderId}</p>

          <a
            href={`https://wa.me/923475658761?text=Hi! My order ID is ${orderId}. Please update me on my delivery status.`}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full py-3 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-400 transition-colors mb-4"
          >
            Track on WhatsApp
          </a>

          <Link
            href="/"
            className="block w-full py-3 border-2 border-navy text-navy rounded-lg font-semibold hover:bg-navy hover:text-white transition-colors"
          >
            Continue Shopping
          </Link>
        </motion.div>
      </div>
    );
  }

  const subtotal = getTotal();
  const discountPercent = calculateDiscount(subtotal);
  const discountAmount = subtotal * (discountPercent / 100);
  const shippingCharge = formData.deliveryArea ? (getRateForArea(formData.deliveryArea, subtotal) || 0) : 0;
  const total = subtotal - discountAmount + shippingCharge;

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    else if (!/^03\d{9}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Phone must be 03XXXXXXXXX format';
    }
    if (!formData.deliveryArea) newErrors.deliveryArea = 'Please select delivery area';
    if (!formData.deliveryAddress.trim()) newErrors.deliveryAddress = 'Delivery address is required';

    setErrors(newErrors);
    
    // Auto-scroll to top of form if there are errors
    if (Object.keys(newErrors).length > 0) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);

    try {
      const supabase = createClient();

      const orderItems: OrderItem[] = items.map(item => ({
        product_id: item.product_id,
        name: item.product?.name || '',
        brand: item.product?.brand || '',
        size: item.size,
        quantity: item.quantity,
        price: item.size === 'quarter'
          ? item.product?.price_quarter || 0
          : item.size === 'gallon'
            ? item.product?.price_gallon || 0
            : item.product?.price_drum || 0,
        image_url: item.product?.image_url || null,
        selectedShade: item.selectedShade
      }));

      const { data, error } = await supabase
        .from('orders')
        .insert({
          user_id: null,
          customer_name: formData.fullName,
          items: orderItems,
          subtotal,
          discount_percent: discountPercent,
          discount_amount: discountAmount,
          shipping_amount: shippingCharge,
          total,
          payment_method: selectedPaymentMethod,
          status: 'pending',
          delivery_area: formData.deliveryArea,
          delivery_address: formData.deliveryAddress,
          phone: formData.phone
        })
        .select('id')
        .single();

      if (error) throw error;

      clearCart();
      setOrderId(data.id);
    } catch (err) {
      console.error('Order error:', err);
      setErrors({ submit: 'Failed to place order. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const deliveryAreas = Array.from(new Set(rates.map(r => r.area)));

  return (
    <div className="min-h-screen pt-[70px] bg-off-white">
      <div className="max-w-7xl mx-auto px-2 xs:px-4 sm:px-6 lg:px-8 py-6 xs:py-12">
        <h1 className="font-heading text-xl xs:text-3xl md:text-4xl font-bold text-navy mb-4 xs:mb-8 px-2 xs:px-0">Checkout</h1>

        <form onSubmit={handleSubmit} className="grid lg:grid-cols-2 gap-8">
          {/* Form */}
          <div className="space-y-4 xs:space-y-6">
            <div className="bg-white rounded-xl p-3 xs:p-6 shadow-md border border-gray-100">
              <h2 className="font-heading text-base xs:text-xl font-semibold text-navy mb-3 xs:mb-6 flex items-center gap-2">
                <div className="w-6 h-6 bg-gold/10 rounded-full flex items-center justify-center">
                  <span className="text-gold text-[10px] font-bold">1</span>
                </div>
                Delivery Details
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 ${errors.fullName ? 'border-red-500' : 'border-gray-200 focus:border-gold'
                      }`}
                    placeholder="John Doe"
                  />
                  {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 ${errors.phone ? 'border-red-500' : 'border-gray-200 focus:border-gold'
                      }`}
                    placeholder="03XXXXXXXXX"
                  />
                  {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email (Optional)</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full p-3 border border-gray-200 rounded-lg focus:border-gold focus:outline-none"
                    placeholder="john@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Area *</label>
                  <select
                    value={formData.deliveryArea}
                    onChange={(e) => {
                      const newArea = e.target.value;
                      setFormData({ ...formData, deliveryArea: newArea });
                      setGlobalArea(newArea);
                    }}
                    className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 ${errors.deliveryArea ? 'border-red-500' : 'border-gray-200 focus:border-gold'
                      }`}
                  >
                    <option value="">Select area</option>
                    {deliveryAreas.map(area => (
                      <option key={area} value={area}>{area}</option>
                    ))}
                  </select>
                  {errors.deliveryArea && <p className="text-red-500 text-sm mt-1">{errors.deliveryArea}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Address *</label>
                  <textarea
                    value={formData.deliveryAddress}
                    onChange={(e) => setFormData({ ...formData, deliveryAddress: e.target.value })}
                    rows={3}
                    className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 ${errors.deliveryAddress ? 'border-red-500' : 'border-gray-200 focus:border-gold'
                      }`}
                    placeholder="House #, Street #, Area..."
                  />
                  {errors.deliveryAddress && <p className="text-red-500 text-sm mt-1">{errors.deliveryAddress}</p>}
                </div>
              </div>
            </div>

            {/* Payment Methods */}
            <div className="bg-white rounded-xl p-3 xs:p-6 shadow-md border border-gray-100">
              <h2 className="font-heading text-base xs:text-xl font-semibold text-navy mb-3 xs:mb-6 flex items-center gap-2">
                <div className="w-6 h-6 bg-gold/10 rounded-full flex items-center justify-center">
                  <span className="text-gold text-[10px] font-bold">2</span>
                </div>
                Payment Method
              </h2>

              <div className="space-y-3">
                {paymentMethods.map((method) => (
                  <label
                    key={method.id}
                    className={`flex items-center gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all ${selectedPaymentMethod === method.type
                        ? 'border-gold bg-gold/5 shadow-sm'
                        : 'border-gray-100 hover:border-gold/30 hover:bg-gray-50'
                      }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      className="hidden"
                      checked={selectedPaymentMethod === method.type}
                      onChange={() => setSelectedPaymentMethod(method.type)}
                    />
                    
                    <div className={`flex items-center justify-center h-5 w-5 rounded-full border-2 ${
                      selectedPaymentMethod === method.type ? 'border-gold bg-gold' : 'border-gray-300'
                    }`}>
                      {selectedPaymentMethod === method.type && <div className="h-2 w-2 rounded-full bg-white" />}
                    </div>

                    <div className="flex-1">
                      <p className="font-semibold text-navy">
                        {method.name}
                      </p>
                      {method.details && (
                        <p className="text-xs text-gray-500 mt-0.5">{method.details}</p>
                      )}
                    </div>

                    <div className="p-2 bg-gray-50 rounded-lg">
                      {method.type === 'cod' ? (
                        <CreditCard className="text-navy/70" size={20} />
                      ) : (
                        <Smartphone className="text-navy/70" size={20} />
                      )}
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:sticky lg:top-24 h-fit">
            <div className="bg-white rounded-xl p-3 xs:p-6 shadow-md border border-gold/10">
              <h2 className="font-heading text-base xs:text-xl font-semibold text-navy mb-3 xs:mb-6">Order Summary</h2>

              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between items-start gap-4 text-sm pb-4 border-b border-gray-50 last:border-0 last:pb-0">
                    <div className="flex flex-col flex-1 min-w-0">
                      <span className="text-gray-600 font-medium leading-tight mb-1">
                        {item.product?.name} ({item.size}) <span className="text-navy font-bold whitespace-nowrap ml-1">x {item.quantity}</span>
                      </span>
                      {item.selectedShade && (
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <div 
                            className="w-2 h-2 rounded-full shrink-0" 
                            style={{ backgroundColor: item.selectedShade.hex }}
                          />
                          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">
                            Shade: {item.selectedShade.name}
                          </span>
                        </div>
                      )}
                    </div>
                    <span className="font-bold text-navy shrink-0 text-right min-w-[80px]">
                      Rs. {(((item.size === 'quarter'
                        ? item.product?.price_quarter
                        : item.size === 'gallon'
                          ? item.product?.price_gallon
                          : item.product?.price_drum) || 0) * item.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-100 pt-4 space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span>Rs. {subtotal.toLocaleString()}</span>
                </div>

                {discountPercent > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount ({discountPercent}%)</span>
                    <span>- Rs. {discountAmount.toLocaleString()}</span>
                  </div>
                )}

                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span>{shippingCharge === 0 ? 'FREE' : `Rs. ${shippingCharge.toLocaleString()}`}</span>
                </div>

                <div className="flex justify-between font-heading text-xl font-bold text-navy pt-3 border-t">
                  <span>Total</span>
                  <span>Rs. {total.toLocaleString()}</span>
                </div>

                {discountPercent > 0 && (
                  <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg animate-fade-in">
                    <p className="text-green-700 text-sm font-medium flex items-center gap-2">
                      <Check size={16} />
                      Congratulations! You have received a discount of {discountPercent}% (Rs. {discountAmount.toLocaleString()}) on your order.
                    </p>
                  </div>
                )}
              </div>

              {errors.submit && (
                <p className="text-red-500 text-sm mt-4 text-center">{errors.submit}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-6 py-4 bg-navy text-white rounded-lg font-semibold hover:bg-navy/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    Processing...
                  </>
                ) : (
                  'Place Order'
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
