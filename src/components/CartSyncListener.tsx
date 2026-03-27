'use client';

import { useEffect } from 'react';
import { useCartStore } from '@/lib/store';

export function CartSyncListener() {
    const { refreshItems, items } = useCartStore();

    useEffect(() => {
        // 1. Sync on Window Focus
        const onFocus = () => {
            refreshItems();
        };
        window.addEventListener('focus', onFocus);

        // 2. Cross-Tab Synchronization
        // When another tab updates the cart, rehydrate the store in this tab
        const onStorage = (e: StorageEvent) => {
            if (e.key === 'tawakkal-cart') {
                useCartStore.persist.rehydrate();
            }
        };
        window.addEventListener('storage', onStorage);

        // 3. Sync Periodically (every 30 seconds to catch active background changes)
        const intervalId = setInterval(() => {
            refreshItems();
        }, 30000);

        return () => {
            window.removeEventListener('focus', onFocus);
            window.removeEventListener('storage', onStorage);
            clearInterval(intervalId);
        };
    }, [refreshItems]);

    return null;
}
