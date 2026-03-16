'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Check, ShoppingBag, X } from 'lucide-react';
import { useUIStore } from '@/lib/store';
import { useEffect } from 'react';
import Link from 'next/link';

export function CartToast() {
  const { isCartToastOpen, setCartToastOpen, lastAddedItem } = useUIStore();

  useEffect(() => {
    if (isCartToastOpen) {
      const timer = setTimeout(() => {
        setCartToastOpen(false);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [isCartToastOpen, setCartToastOpen]);

  return (
    <AnimatePresence>
      {isCartToastOpen && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
          className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[9999] w-[90%] max-w-sm"
        >
          <div className="bg-navy border border-gold/30 rounded-2xl shadow-2xl p-4 flex items-center gap-4">
            <div className="w-12 h-12 bg-gold/20 rounded-xl flex-shrink-0 flex items-center justify-center text-gold overflow-hidden">
              {lastAddedItem?.image ? (
                <img src={lastAddedItem.image} alt="" className="w-full h-full object-cover" />
              ) : (
                <ShoppingBag size={24} />
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <h4 className="text-white font-bold text-sm truncate">Added to Cart!</h4>
              <p className="text-gray-400 text-xs truncate">{lastAddedItem?.name || 'Product'}</p>
            </div>

            <div className="flex items-center gap-3">
              <Link 
                href="/cart" 
                onClick={() => setCartToastOpen(false)}
                className="text-gold text-xs font-bold uppercase tracking-wider hover:text-white transition-colors"
              >
                View
              </Link>
              <button 
                onClick={() => setCartToastOpen(false)}
                className="text-gray-500 hover:text-white transition-colors"
              >
                <X size={18} />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
