-- ============================================================
-- Remove guest access from orders and inquiries
-- Keeps all existing policy names, trigger names, function names
-- Does NOT touch profiles policies
-- Run this in Supabase SQL Editor
-- ============================================================

-- ──────────────────────────────────────────────────────────
-- orders_insert
-- Was: WITH CHECK (true)  →  allowed guests
-- Now: requires auth.uid() = customer_id
-- ──────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "orders_insert" ON public.orders;

CREATE POLICY "orders_insert" ON public.orders
  FOR INSERT
  WITH CHECK (
    auth.uid() IS NOT NULL
    AND auth.uid() = customer_id
  );

-- ──────────────────────────────────────────────────────────
-- inquiries_insert
-- Was: WITH CHECK (true)  →  allowed guests
-- Now: 
--   • Public marketing forms (Home quote, Contact page) can submit
--     without login — customer_id must be NULL in that case
--   • Authenticated users can submit with customer_id = auth.uid()
--   This keeps lead-capture forms working while preventing
--   authenticated users from spoofing another user's customer_id
-- ──────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "inquiries_insert" ON public.inquiries;

CREATE POLICY "inquiries_insert" ON public.inquiries
  FOR INSERT
  WITH CHECK (
    -- Unauthenticated (guest) submissions: customer_id must be NULL
    (auth.uid() IS NULL AND customer_id IS NULL)
    OR
    -- Authenticated submissions: customer_id must equal the caller's uid
    (auth.uid() IS NOT NULL AND (customer_id IS NULL OR customer_id = auth.uid()))
  );
