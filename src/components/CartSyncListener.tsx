'use client';

import { useEffect } from 'react';
import { useCartStore } from '@/lib/store';

export function CartSyncListener() {
    const { refreshItems, items } = useCartStore();

    useEffect(() => {
        // If there are no items in the cart, no need to sync
        if (items.length === 0) return;

        // 1. Sync on Window Focus
        const onFocus = () => {
            refreshItems();
        };
        window.addEventListener('focus', onFocus);

        // 2. Sync Periodically (every 30 seconds to catch active background changes)
        const intervalId = setInterval(() => {
            refreshItems();
        }, 30000);

        return () => {
            window.removeEventListener('focus', onFocus);
            clearInterval(intervalId);
        };
    }, [items.length, refreshItems]);

    return null;
}
