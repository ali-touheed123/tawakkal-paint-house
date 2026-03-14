-- Fix checkout issues: Seed payment methods and update RLS for guest orders

-- 1. Seed Payment Methods
INSERT INTO public.payment_methods (name, type, details, is_active)
VALUES 
('Cash on Delivery', 'cod', 'Pay when you receive your order', true),
('Bank Transfer', 'bank', 'Transfer to Bank Al Habib (Details provided after order)', true)
ON CONFLICT DO NOTHING;

-- 2. Update Order Policies for Guest Checkout
DROP POLICY IF EXISTS "Users can view their own orders" ON public.orders;
DROP POLICY IF EXISTS "Users can insert their own orders" ON public.orders;
DROP POLICY IF EXISTS "Public can insert orders" ON public.orders;
DROP POLICY IF EXISTS "Public can view orders" ON public.orders;

CREATE POLICY "Public can insert orders" ON public.orders
FOR INSERT TO public
WITH CHECK (true);

CREATE POLICY "Public can view orders" ON public.orders
FOR SELECT TO public
USING (true);

-- 3. Update Payment Methods Policies
DROP POLICY IF EXISTS "Public can view payments" ON public.payment_methods;
DROP POLICY IF EXISTS "Public can view payment methods" ON public.payment_methods;

CREATE POLICY "Public can view payment methods" ON public.payment_methods
FOR SELECT TO public
USING (is_active = true);
