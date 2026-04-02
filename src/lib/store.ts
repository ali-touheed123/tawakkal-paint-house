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

          // STRICT ENFORCEMENT: Paint tools can ONLY be added as gifts
          const isPaintToolCategory = product?.category?.toLowerCase() === 'paint-tools' || product?.category === 'Paint Tools';
          if (isPaintToolCategory) {
            console.warn('Attempted to add paint tool via addItem. Blocked. Use addGiftItem instead.');
            return state;
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
        const state = get();
        const remaining = state.getRemainingCredit();
        const addedCost = originalPrice * quantity;
        
        if (addedCost > remaining) return false;

        const existing = state.items.find(i => i.product_id === productId && i.isGift);
        
        const uiStore = useUIStore.getState();
        uiStore.setLastAddedItem({
          name: product?.name || 'Free Gift',
          image: product?.image_url || null
        });
        uiStore.setCartToastOpen(true);

        if (existing) {
          set((s) => ({
            items: s.items.map(item =>
              item.id === existing.id
                ? { ...item, quantity: item.quantity + quantity }
                : item
            )
          }));
          return true;
        }

        set((s) => ({
          items: [
            ...s.items,
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
          const withoutLabourSubtotal = filteredItems.reduce((sum, item) => {
            if (!item.product || item.isGift) return sum;
            if (item.labourMode !== 'without') return sum;
            const cat = item.product.category?.toLowerCase();
            if (cat === 'paint-tools' || item.product.category === 'Paint Tools') return sum;
            const units = item.product.units || [];
            const unit = units.find((u: any) => u.label === item.size) || units[0];
            const basePrice = unit?.price || 0;
            const discount = item.labourDiscount || 0;
            const effectivePrice = Math.round(basePrice * (1 - discount / 100));
            return sum + effectivePrice * item.quantity;
          }, 0);

          // Tiered Allowance Calculation
          let allowance = 0;
          if (withoutLabourSubtotal >= 200000) allowance = withoutLabourSubtotal * 0.12;
          else if (withoutLabourSubtotal >= 100000) allowance = withoutLabourSubtotal * 0.10;
          else if (withoutLabourSubtotal >= 40000) allowance = withoutLabourSubtotal * 0.08;
          else if (withoutLabourSubtotal >= 20000) allowance = 1000;
          else if (withoutLabourSubtotal >= 10000) allowance = 400;
          else if (withoutLabourSubtotal >= 6000) allowance = 200;

          // 3. Re-validate gifts
          let usedSoFar = 0;
          const revalidated = filteredItems.map(item => {
            if (!item.isGift) return item;
            const price = item.originalPrice || 0;
            const itemTotalCost = price * item.quantity;
            if (usedSoFar + itemTotalCost <= allowance) {
              usedSoFar += itemTotalCost;
              return item;
            }
            // REMOVE GIFT COMPLETELY instead of reverting to paid
            return null;
          }).filter(Boolean) as CartItem[];

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
          } else if (item.product?.category?.toLowerCase() === 'paint-tools' || item.product?.category === 'Paint Tools') {
            // STRICT ENFORCEMENT: If somehow a non-gift paint tool exists, block any quantity increases
            if (quantity > item.quantity) {
              return state;
            }
          }

          const newItems = state.items.map(i =>
            i.id === itemId ? { ...i, quantity } : i
          );

          // Re-calculate allowance to see if gifts need to be dropped
          const withoutLabourSubtotal = newItems.reduce((sum, item) => {
            if (!item.product || item.isGift) return sum;
            if (item.labourMode !== 'without') return sum;
            if (item.product.category === 'paint-tools' || item.product.category === 'Paint Tools') return sum;
            const units = item.product.units || [];
            const unit = units.find((u: any) => u.label === item.size) || units[0];
            const basePrice = unit?.price || 0;
            const discount = item.labourDiscount || 0;
            const effectivePrice = Math.round(basePrice * (1 - discount / 100));
            return sum + effectivePrice * item.quantity;
          }, 0);

          let newAllowance = 0;
          if (withoutLabourSubtotal >= 200000) newAllowance = withoutLabourSubtotal * 0.12;
          else if (withoutLabourSubtotal >= 100000) newAllowance = withoutLabourSubtotal * 0.10;
          else if (withoutLabourSubtotal >= 40000) newAllowance = withoutLabourSubtotal * 0.08;
          else if (withoutLabourSubtotal >= 20000) newAllowance = 1000;
          else if (withoutLabourSubtotal >= 10000) newAllowance = 400;
          else if (withoutLabourSubtotal >= 6000) newAllowance = 200;

          let usedSoFar = 0;
          const revalidated = newItems.map(item => {
            if (!item.isGift) return item;
            const price = item.originalPrice || 0;
            const itemTotalCost = price * item.quantity;
            if (usedSoFar + itemTotalCost <= newAllowance) {
              usedSoFar += itemTotalCost;
              return item;
            }
            return null; // remove gift
          }).filter(Boolean) as CartItem[];

          return { items: revalidated };
        });
      },
      updateSize: (itemId, size) => {
        set((state) => {
          const newItems = state.items.map(item =>
            item.id === itemId ? { ...item, size } : item
          );

          const withoutLabourSubtotal = newItems.reduce((sum, item) => {
            if (!item.product || item.isGift) return sum;
            if (item.labourMode !== 'without') return sum;
            if (item.product.category === 'paint-tools' || item.product.category === 'Paint Tools') return sum;
            const units = item.product.units || [];
            const unit = units.find((u: any) => u.label === item.size) || units[0];
            const basePrice = unit?.price || 0;
            const discount = item.labourDiscount || 0;
            const effectivePrice = Math.round(basePrice * (1 - discount / 100));
            return sum + effectivePrice * item.quantity;
          }, 0);

          let newAllowance = 0;
          if (withoutLabourSubtotal >= 200000) newAllowance = withoutLabourSubtotal * 0.12;
          else if (withoutLabourSubtotal >= 100000) newAllowance = withoutLabourSubtotal * 0.10;
          else if (withoutLabourSubtotal >= 40000) newAllowance = withoutLabourSubtotal * 0.08;
          else if (withoutLabourSubtotal >= 20000) newAllowance = 1000;
          else if (withoutLabourSubtotal >= 10000) newAllowance = 400;
          else if (withoutLabourSubtotal >= 6000) newAllowance = 200;

          let usedSoFar = 0;
          const revalidated = newItems.map(item => {
            if (!item.isGift) return item;
            const price = item.originalPrice || 0;
            const itemTotalCost = price * item.quantity;
            if (usedSoFar + itemTotalCost <= newAllowance) {
              usedSoFar += itemTotalCost;
              return item;
            }
            return null;
          }).filter(Boolean) as CartItem[];

          return { items: revalidated };
        });
      },
      clearCart: () => set({ items: [] }),
      getSavingAllowance: () => {
        // Tiered Tool Credits calculated based on the total 90% Price (Paid Subtotal) of Without-Labour items
        const withoutLabourSubtotal = get().items.reduce((sum, item) => {
          if (!item.product || item.isGift) return sum;
          if (item.labourMode !== 'without') return sum;
          const cat = item.product.category?.toLowerCase();
          if (cat === 'paint-tools' || item.product.category === 'Paint Tools') return sum;
          const units = item.product.units || [];
          const unit = units.find((u: any) => u.label === item.size) || units[0];
          const basePrice = unit?.price || 0;
          // Apply the 10% DIY discount
          const discount = item.labourDiscount || 0;
          const effectivePrice = Math.round(basePrice * (1 - discount / 100));
          return sum + effectivePrice * item.quantity;
        }, 0);

        // Apply Tiers
        if (withoutLabourSubtotal >= 200000) return withoutLabourSubtotal * 0.12;
        if (withoutLabourSubtotal >= 100000) return withoutLabourSubtotal * 0.10;
        if (withoutLabourSubtotal >= 40000) return withoutLabourSubtotal * 0.08;
        if (withoutLabourSubtotal >= 20000) return 1000;
        if (withoutLabourSubtotal >= 10000) return 400;
        if (withoutLabourSubtotal >= 6000) return 200;
        return 0;
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
          const effectivePrice = Math.round(basePrice * (1 - discount / 100));

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
            const effectivePrice = Math.round(basePrice * (1 - discount / 100));
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
                  // Enforce unit-level labour mode if specified
                  const unit = latestProduct.units?.find((u: any) => u.label === item.size);
                  const unitLabourMode = unit?.labour_mode || 'both';
                  
                  let finalLabourMode = item.labourMode || 'with';
                  if (unitLabourMode === 'with_only') {
                    finalLabourMode = 'with';
                  } else if (unitLabourMode === 'without_only') {
                    finalLabourMode = 'without';
                  }

                  // Recompute the discount based on latest data
                  let updatedDiscount = item.labourDiscount || 0;
                  if (finalLabourMode === 'without') {
                    if (latestProduct.labour_config?.enabled === false) {
                      updatedDiscount = 0;
                    } else if (unit?.discount !== undefined) {
                      // 1. Explicit unit-level discount
                      updatedDiscount = unit.discount;
                    } else if (unitLabourMode !== 'both') {
                      // 2. Restricted mode (With Only / Without Only) defaults to 0%
                      updatedDiscount = 0;
                    } else {
                      // 3. Standard 'Both' mode falls back to product or global default
                      updatedDiscount = latestProduct.labour_config?.without_discount_percent ?? defaultWithoutDiscount;
                    }
                  } else {
                    updatedDiscount = 0;
                  }

                  return {
                    ...item,
                    product: latestProduct,
                    labourMode: finalLabourMode,
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
