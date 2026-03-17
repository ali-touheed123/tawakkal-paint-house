'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { useLocationStore, useUIStore } from '@/lib/store';
import { KARACHI_AREAS } from '@/types';
import { X } from 'lucide-react';

export function LocationPopup() {
  const pathname = usePathname();
  const { area, hasSelectedArea, setArea } = useLocationStore();
  const { isLocationPopupOpen, setLocationPopupOpen } = useUIStore();

  // Hide location popup on admin dashboard
  if (pathname?.startsWith('/admin-7392-dashboard')) return null;
  const [isVisible, setIsVisible] = useState(true);
  const [selectedArea, setSelectedArea] = useState<string | null>(area);

  useEffect(() => {
    const storedArea = localStorage.getItem('tawakkal-area');
    if (storedArea && !hasSelectedArea) {
      setArea(storedArea);
      setSelectedArea(storedArea);
    }
  }, [hasSelectedArea, setArea]);

  const handleConfirm = () => {
    if (selectedArea) {
      setArea(selectedArea);
      localStorage.setItem('tawakkal-area', selectedArea);
      setIsVisible(false);
    }
  };

  const handleClose = () => {
    setIsVisible(false);
  };

  const openPopup = () => {
    setIsVisible(true);
  };

  useEffect(() => {
    (window as any).openLocationPopup = openPopup;
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: 'rgba(15, 31, 61, 0.85)', backdropFilter: 'blur(12px)' }}
        >
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-lg shadow-2xl"
          >
            <div className="bg-navy p-6 rounded-t-lg flex items-center justify-between">
              <div className="text-center flex-1">
                <img 
                  src="/logo.png" 
                  alt="Tawakkal Paint House" 
                  className="h-16 w-auto mx-auto mb-3"
                />
                <h2 className="font-heading text-2xl md:text-3xl text-white font-bold">
                  Welcome to Tawakkal Paint House
                </h2>
                <p className="text-gray-300 mt-2">
                  Select your area in Karachi for delivery
                </p>
              </div>
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 text-white hover:text-gold transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {KARACHI_AREAS.map((karachiArea) => (
                  <button
                    key={karachiArea}
                    onClick={() => setSelectedArea(karachiArea)}
                    className={`p-3 rounded-lg border-2 transition-all duration-300 font-medium text-sm ${
                      selectedArea === karachiArea
                        ? 'border-gold bg-gold-pale text-navy'
                        : 'border-gray-200 hover:border-gold text-gray-700 hover:bg-gold-pale/50'
                    }`}
                  >
                    {karachiArea}
                  </button>
                ))}
              </div>

              <button
                onClick={handleConfirm}
                disabled={!selectedArea}
                className={`w-full mt-6 py-4 rounded-lg font-semibold text-lg transition-all duration-300 ${
                  selectedArea
                    ? 'bg-gold text-navy hover:bg-gold-light'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                Confirm Location
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
