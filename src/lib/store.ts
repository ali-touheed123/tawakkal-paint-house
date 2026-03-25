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
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  updateSize: (itemId: string, size: string) => void;
  clearCart: () => void;
  getTotal: () => number;
  getLabourSubtotals: () => { withLabourSubtotal: number; withoutLabourSubtotal: number };
  refreshItems: () => Promise<void>;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (productId, size, quantity, product, selectedShade, labourMode = 'with', labourDiscount = 0) => {
        const items = get().items;
        const existingItem = items.find(
          item =>
            item.product_id === productId &&
            item.size === size &&
            item.labourMode === labourMode &&
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
          set({
            items: items.map(item =>
              item.id === existingItem.id
                ? { ...item, quantity: item.quantity + quantity }
                : item
            )
          });
        } else {
          set({
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
                labourMode,
                labourDiscount
              }
            ]
          });
        }
      },
      removeItem: (itemId) => {
        set({ items: get().items.filter(item => item.id !== itemId) });
      },
      updateQuantity: (itemId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(itemId);
          return;
        }
        set({
          items: get().items.map(item =>
            item.id === itemId ? { ...item, quantity } : item
          )
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
      getTotal: () => {
        return get().items.reduce((total, item) => {
          if (!item.product) return total;

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
             const updatedItems = items.map(item => {
               const latestProduct = latestProducts.find(p => p.id === item.product_id);
               if (latestProduct) {
                 // Recompute the discount based on latest data
                 let updatedDiscount = item.labourDiscount || 0;
                 if (item.labourMode === 'without') {
                    updatedDiscount = latestProduct.labour_config?.without_discount_percent ?? defaultWithoutDiscount;
                 }
                 
                 return { 
                   ...item, 
                   product: latestProduct,
                   labourDiscount: updatedDiscount 
                 };
               }
               return item;
             });
             set({ items: updatedItems });
          }
        } catch (err) {
          console.error('Failed to refresh cart items:', err);
        }
      }
    }),
    {
      name: 'tawakkal-cart'
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
      setLastAddedItem: (item) => set({ lastAddedItem: item })
    }),
    {
      name: 'tawakkal-ui'
    }
  )
);
