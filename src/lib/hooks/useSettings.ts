'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { SiteSettings, DiscountRule, ShippingRate, PaymentMethod, LabourCheckoutTier } from '@/types';

export function useSettings() {
    const [settings, setSettings] = useState<SiteSettings | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadSettings() {
            const supabase = createClient();
            const { data } = await supabase.from('site_settings').select('*');

            if (data) {
                const formatted = data.reduce((acc: any, curr: any) => {
                    acc[curr.key] = curr.value;
                    return acc;
                }, {});
                setSettings(formatted);
            }
            setLoading(false);
        }
        loadSettings();
    }, []);

    return { settings, loading };
}

export function useDiscountRules() {
    const [rules, setRules] = useState<DiscountRule[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadRules() {
            const supabase = createClient();
            const { data } = await supabase
                .from('discount_rules')
                .select('*')
                .eq('is_active', true)
                .order('min_amount', { ascending: true });

            if (data) setRules(data);
            setLoading(false);
        }
        loadRules();
    }, []);

    const calculateDiscount = (subtotal: number) => {
        const applicableRule = [...rules].reverse().find(r => subtotal >= r.min_amount);
        return applicableRule ? applicableRule.discount_percent : 0;
    };

    const getNextTier = (subtotal: number) => {
        const nextRule = rules.find(r => r.min_amount > subtotal);
        if (!nextRule) return null;
        return {
            discount: nextRule.discount_percent,
            amountNeeded: nextRule.min_amount - subtotal
        };
    };

    return { rules, loading, calculateDiscount, getNextTier };
}

export function useLabourSettings() {
    const [tiers, setTiers] = useState<LabourCheckoutTier[]>([]);
    const [defaultWithoutDiscount, setDefaultWithoutDiscount] = useState(10);
    const [upsellItemIds, setUpsellItemIds] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            const supabase = createClient();
            const { data } = await supabase
                .from('site_settings')
                .select('key, value')
                .in('key', ['labour_checkout_tiers', 'labour_without_default_discount', 'labour_upsell_items']);

            if (data) {
                data.forEach((row: any) => {
                    if (row.key === 'labour_checkout_tiers') setTiers(row.value || []);
                    if (row.key === 'labour_without_default_discount') setDefaultWithoutDiscount(Number(row.value) || 10);
                    if (row.key === 'labour_upsell_items') setUpsellItemIds(row.value || []);
                });
            }
            setLoading(false);
        }
        load();
    }, []);

    /**
     * Calculates the Tool Credit (Allowance) for Without-Labour items.
     * Returns the amount of free tools the customer can claim.
     */
    const calculateToolCredit = (withoutLabourSubtotal: number): { creditAmount: number; tierLabel: string } => {
        if (tiers.length === 0 || withoutLabourSubtotal <= 0) return { creditAmount: 0, tierLabel: '' };

        // Find the highest qualifying tier
        const qualifyingTiers = tiers.filter(t => withoutLabourSubtotal >= t.min_amount);
        if (qualifyingTiers.length === 0) return { creditAmount: 0, tierLabel: '' };

        const tier = qualifyingTiers[qualifyingTiers.length - 1]; // highest qualifying tier

        let creditAmount = 0;
        if (tier.discount_type === 'flat') {
            creditAmount = tier.discount_value;
        } else {
            // Percentage of the paid subtotal (usually the 90% price)
            creditAmount = withoutLabourSubtotal * (tier.discount_value / 100);
        }

        return { creditAmount: Math.round(creditAmount), tierLabel: tier.label };
    };

    const getNextToolTier = (withoutLabourSubtotal: number): { amountNeeded: number; tierLabel: string; benefit: string } | null => {
        const nextTier = tiers.find(t => t.min_amount > withoutLabourSubtotal);
        if (!nextTier) return null;
        return {
            amountNeeded: nextTier.min_amount - withoutLabourSubtotal,
            tierLabel: nextTier.label,
            benefit: nextTier.discount_type === 'flat'
                ? `Rs. ${nextTier.discount_value} in Free Tools`
                : `${nextTier.discount_value}% in Free Tools`
        };
    };

    return {
        tiers,
        defaultWithoutDiscount,
        upsellItemIds,
        loading,
        calculateToolCredit,
        getNextToolTier
    };
}

export function useShippingRates() {
    const [rates, setRates] = useState<ShippingRate[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadRates() {
            const supabase = createClient();
            const { data } = await supabase
                .from('shipping_rates')
                .select('*')
                .eq('is_active', true);

            if (data) setRates(data);
            setLoading(false);
        }
        loadRates();
    }, []);

    const getRateForArea = (area: string, subtotal: number) => {
        const rate = rates.find(r => r.area === area);
        if (!rate) return null;

        if (rate.min_order_for_free && subtotal >= rate.min_order_for_free) {
            return 0;
        }
        return rate.rate;
    };

    return { rates, loading, getRateForArea };
}

export function usePaymentMethods() {
    const [methods, setMethods] = useState<PaymentMethod[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadMethods() {
            const supabase = createClient();
            const { data } = await supabase
                .from('payment_methods')
                .select('*')
                .eq('is_active', true);

            if (data) setMethods(data);
            setLoading(false);
        }
        loadMethods();
    }, []);

    return { methods, loading };
}
