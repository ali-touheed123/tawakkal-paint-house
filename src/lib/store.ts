import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem, ItemSize } from '@/types';

interface CartStore {
  items: CartItem[];
  addItem: (productId: string, size: ItemSize, quantity: number, product?: CartItem['product'], selectedShade?: CartItem['selectedShade']) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  updateSize: (itemId: string, size: ItemSize) => void;
  clearCart: () => void;
  getTotal: () => number;
  refreshItems: () => Promise<void>;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (productId, size, quantity, product, selectedShade) => {
        const items = get().items;
        const existingItem = items.find(
          item => 
            item.product_id === productId && 
            item.size === size && 
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
                selectedShade
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
          const price = item.size === 'quarter'
            ? item.product.price_quarter
            : item.size === 'gallon'
              ? item.product.price_gallon
              : item.product.price_drum;
          return total + (price * item.quantity);
        }, 0);
      },
      refreshItems: async () => {
        const items = get().items;
        if (items.length === 0) return;

        try {
          const { createClient } = await import('@/lib/supabase/client');
          const supabase = createClient();
          const productIds = Array.from(new Set(items.map(item => item.product_id)));

          const { data: latestProducts, error } = await supabase
            .from('products')
            .select('*')
            .in('id', productIds);

          if (error) throw error;

          if (latestProducts) {
            const updatedItems = items.map(item => {
              const latestProduct = latestProducts.find(p => p.id === item.product_id);
              if (latestProduct) {
                return { ...item, product: latestProduct };
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
