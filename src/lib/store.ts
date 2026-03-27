import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem } from '@/types';

interface CartStore {
  items: CartItem[];
  addItem: (
    productId: string,
    size: string,
    quantity: number,
    product?: CartItem['product'],
    selectedShade?: CartItem['selectedShade'],
    labourMode?: 'with' | 'without',
    labourDiscount?: number
  ) => void;
  addGiftItem: (
    productId: string,
    size: string,
    quantity: number,
    product: CartItem['product'],
    originalPrice: number
  ) => boolean; // returns false if credit is insufficient
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  updateSize: (itemId: string, size: string) => void;
  clearCart: () => void;
  getTotal: () => number;
  getSavingAllowance: () => number;
  getUsedCredit: () => number;
  getRemainingCredit: () => number;
  getLabourSubtotals: () => { withLabourSubtotal: number; withoutLabourSubtotal: number };
  refreshItems: () => Promise<void>;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (productId, size, quantity, product, selectedShade, labourMode = 'with', labourDiscount = 0) => {
        set((state) => {
          const items = state.items;
          
          // If product disables labour selection, force 'without' mode with NO discount
          let finalLabourMode = labourMode;
          let finalLabourDiscount = labourDiscount;
          if (product?.labour_config?.enabled === false) {
            finalLabourMode = 'without';
            finalLabourDiscount = 0;
          }

          const existingItem = items.find(
            item =>
              item.product_id === productId &&
              item.size === size &&
              item.labourMode === finalLabourMode &&
              !item.isGift &&
              JSON.stringify(item.selectedShade) === JSON.stringify(selectedShade)
          );

          // Update UI Store for Notification
          const uiStore = useUIStore.getState();
          uiStore.setLastAddedItem({
            name: product?.name || 'Product',
            image: product?.image_url || null
          });
          uiStore.setCartToastOpen(true);

          if (existingItem) {
            return {
              items: items.map(item =>
                item.id === existingItem.id
                  ? { ...item, quantity: item.quantity + quantity }
                  : item
              )
            };
          } else {
            return {
              items: [
                ...items,
                {
                  id: crypto.randomUUID(),
                  user_id: '',
                  product_id: productId,
                  size,
                  quantity,
                  created_at: new Date().toISOString(),
                  product,
                  selectedShade,
                  labourMode: finalLabourMode,
                  labourDiscount: finalLabourDiscount,
                  isGift: false
                }
              ]
            };
          }
        });
      },
      addGiftItem: (productId, size, quantity, product, originalPrice) => {
        // Check if there is enough remaining credit
        const remaining = get().getRemainingCredit();
        if (originalPrice > remaining) return false;

        // Don't double-add the same gift
        const existing = get().items.find(i => i.product_id === productId && i.isGift);
        if (existing) return true;

        const uiStore = useUIStore.getState();
        uiStore.setLastAddedItem({
          name: product?.name || 'Free Gift',
          image: product?.image_url || null
        });
        uiStore.setCartToastOpen(true);

        set((state) => ({
          items: [
            ...state.items,
            {
              id: crypto.randomUUID(),
              user_id: '',
              product_id: productId,
              size,
              quantity,
              created_at: new Date().toISOString(),
              product,
              labourMode: 'with',
              labourDiscount: 0,
              isGift: true,
              originalPrice
            }
          ]
        }));
        return true;
      },
      removeItem: (itemId) => {
        set((state) => {
          // 1. Filter out the item
          const filteredItems = state.items.filter(item => item.id !== itemId);
          
          // 2. Re-calculate allowance from scratch (same logic as getSavingAllowance)
          const allowance = filteredItems.reduce((pool, item) => {
            if (!item.product || item.isGift) return pool;
            if (item.labourMode !== 'without') return pool;
            if (item.product.category === 'paint-tools') return pool;
            const units = item.product.units || [];
            const unit = units.find((u: any) => u.label === item.size) || units[0];
            const basePrice = unit?.price || 0;
            const discount = item.labourDiscount || 0;
            const effectivePrice = basePrice * (1 - discount / 100);
            return pool + effectivePrice * item.quantity * 0.10;
          }, 0);

          // 3. Re-validate gifts
          let usedSoFar = 0;
          const revalidated = filteredItems.map(item => {
            if (!item.isGift) return item;
            const price = item.originalPrice || 0;
            if (usedSoFar + price <= allowance) {
              usedSoFar += price;
              return item;
            }
            // Revert to paid
            return { ...item, isGift: false, originalPrice: undefined };
          });

          return { items: revalidated };
        });
      },
      updateQuantity: (itemId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(itemId);
          return;
        }

        set((state) => {
          const item = state.items.find(i => i.id === itemId);
          if (!item) return state;

          // For gift items, ensure the new quantity doesn't exceed credit
          if (item.isGift && quantity > item.quantity) {
            const pricePerUnit = item.originalPrice || 0;
            const addedUnits = quantity - item.quantity;
            const extraCost = pricePerUnit * addedUnits;
            // Calculating remaining credit on the fly to avoid external dependencies
            const allowance = state.getSavingAllowance();
            const used = state.getUsedCredit();
            const remaining = Math.max(0, allowance - used);
            
            if (extraCost > remaining) return state; // silently block
          }

          return {
            items: state.items.map(i =>
              i.id === itemId ? { ...i, quantity } : i
            )
          };
        });
      },
      updateSize: (itemId, size) => {
        set({
          items: get().items.map(item =>
            item.id === itemId ? { ...item, size } : item
          )
        });
      },
      clearCart: () => set({ items: [] }),
      getSavingAllowance: () => {
        // 10% of all Without-Labour paint items (excluding gifts)
        return get().items.reduce((pool, item) => {
          if (!item.product || item.isGift) return pool;
          if (item.labourMode !== 'without') return pool;
          if (item.product.category === 'paint-tools') return pool; // tools don't generate allowance
          const units = item.product.units || [];
          const unit = units.find((u: any) => u.label === item.size) || units[0];
          const basePrice = unit?.price || 0;
          const discount = item.labourDiscount || 0;
          const effectivePrice = basePrice * (1 - discount / 100);
          return pool + effectivePrice * item.quantity * 0.10;
        }, 0);
      },
      getUsedCredit: () => {
        return get().items.reduce((used, item) => {
          if (!item.isGift) return used;
          return used + (item.originalPrice || 0) * item.quantity;
        }, 0);
      },
      getRemainingCredit: () => {
        const state = get();
        return Math.max(0, state.getSavingAllowance() - state.getUsedCredit());
      },
      getTotal: () => {
        return get().items.reduce((total, item) => {
          if (!item.product) return total;
          // Gift items are free
          if (item.isGift) return total;

          const units = item.product.units || [];
          const unit = units.find((u: any) => u.label === item.size) || units[0];
          const basePrice = unit?.price || 0;

          // Apply without-labour discount if applicable
          const discount = item.labourMode === 'without' ? (item.labourDiscount || 0) : 0;
          const effectivePrice = basePrice * (1 - discount / 100);

          return total + effectivePrice * item.quantity;
        }, 0);
      },
      getLabourSubtotals: () => {
        const items = get().items;
        let withLabourSubtotal = 0;
        let withoutLabourSubtotal = 0;

        items.forEach(item => {
          if (!item.product) return;
          const units = item.product.units || [];
          const unit = units.find((u: any) => u.label === item.size) || units[0];
          const basePrice = unit?.price || 0;

          if (item.labourMode === 'without') {
            const discount = item.labourDiscount || 0;
            const effectivePrice = basePrice * (1 - discount / 100);
            withoutLabourSubtotal += effectivePrice * item.quantity;
          } else {
            withLabourSubtotal += basePrice * item.quantity;
          }
        });

        return { withLabourSubtotal, withoutLabourSubtotal };
      },
      refreshItems: async () => {
        const items = get().items;
        if (items.length === 0) return;

        try {
          const { createClient } = await import('@/lib/supabase/client');
          const supabase = createClient();
          const productIds = Array.from(new Set(items.map(item => item.product_id))).filter(id => id && id.length === 36);

          const [productsRes, settingsRes] = await Promise.all([
             supabase.from('products').select('*').in('id', productIds),
             supabase.from('site_settings').select('value').eq('key', 'labour_without_default_discount').single()
          ]);

          const latestProducts = productsRes.data;
          const defaultWithoutDiscount = Number(settingsRes.data?.value) || 10;

          if (latestProducts) {
             set((state) => {
               const updatedItems = state.items.map(item => {
                 const latestProduct = latestProducts.find(p => p.id === item.product_id);
                 if (latestProduct) {
                   // Recompute the discount based on latest data
                   let updatedDiscount = item.labourDiscount || 0;
                   if (item.labourMode === 'without') {
                      if (latestProduct.labour_config?.enabled === false) {
                        updatedDiscount = 0;
                      } else {
                        updatedDiscount = latestProduct.labour_config?.without_discount_percent ?? defaultWithoutDiscount;
                      }
                   }
                   
                   return { 
                     ...item, 
                     product: latestProduct,
                     labourDiscount: updatedDiscount 
                   };
                 }
                 return item;
               });
               return { items: updatedItems };
             });
          }
        } catch (err) {
          console.error('Failed to refresh cart items:', err);
        }
      }
    }),
    {
      name: 'tawakkal-cart',
      version: 2
    }
  )
);

interface LocationStore {
  area: string | null;
  setArea: (area: string) => void;
  hasSelectedArea: boolean;
  setHasSelectedArea: (value: boolean) => void;
}

export const useLocationStore = create<LocationStore>()(
  persist(
    (set) => ({
      area: null,
      hasSelectedArea: false,
      setArea: (area) => set({ area, hasSelectedArea: true }),
      setHasSelectedArea: (value) => set({ hasSelectedArea: value })
    }),
    {
      name: 'tawakkal-location'
    }
  )
);


interface UIStore {
  isLocationPopupOpen: boolean;
  setLocationPopupOpen: (open: boolean) => void;
  isSearchOpen: boolean;
  setSearchOpen: (open: boolean) => void;
  isMobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  isCartToastOpen: boolean;
  setCartToastOpen: (open: boolean) => void;
  lastAddedItem: { name: string; image: string | null } | null;
  setLastAddedItem: (item: { name: string; image: string | null } | null) => void;
  savingSessionActive: boolean; // true when user has selected Without Labour on any product
  setSavingSessionActive: (active: boolean) => void;
}

export const useUIStore = create<UIStore>()(
  persist(
    (set) => ({
      isLocationPopupOpen: false,
      setLocationPopupOpen: (open) => set({ isLocationPopupOpen: open }),
      isSearchOpen: false,
      setSearchOpen: (open) => set({ isSearchOpen: open }),
      isMobileMenuOpen: false,
      setMobileMenuOpen: (open) => set({ isMobileMenuOpen: open }),
      isCartToastOpen: false,
      setCartToastOpen: (open) => set({ isCartToastOpen: open }),
      lastAddedItem: null,
      setLastAddedItem: (item) => set({ lastAddedItem: item }),
      savingSessionActive: false,
      setSavingSessionActive: (active) => set({ savingSessionActive: active })
    }),
    {
      name: 'tawakkal-ui'
    }
  )
);
