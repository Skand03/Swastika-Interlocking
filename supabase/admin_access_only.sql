-- ============================================================
-- ADMIN ACCESS ONLY
-- Run this in Supabase SQL Editor AFTER remove_guest_access.sql
-- Does NOT touch: orders_insert, orders_select_own,
--                 inquiries_insert, profiles, triggers, auth
-- ============================================================

-- 1. is_admin() helper — reads role from profiles, bypasses RLS
--    Uses named dollar-quote tag $func$ to avoid formatting issues
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $func$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE id = auth.uid()
      AND role = 'admin'
  );
$func$;


-- 2. orders — admin can read ALL orders and update status
DROP POLICY IF EXISTS "new_admin_orders_select" ON public.orders;
CREATE POLICY "new_admin_orders_select" ON public.orders
  FOR SELECT
  USING (public.is_admin());

DROP POLICY IF EXISTS "new_admin_orders_update" ON public.orders;
CREATE POLICY "new_admin_orders_update" ON public.orders
  FOR UPDATE
  USING (public.is_admin());


-- 3. inquiries — admin can read ALL inquiries and reply
DROP POLICY IF EXISTS "new_admin_inquiries_select" ON public.inquiries;
CREATE POLICY "new_admin_inquiries_select" ON public.inquiries
  FOR SELECT
  USING (public.is_admin());

DROP POLICY IF EXISTS "new_admin_inquiries_update" ON public.inquiries;
CREATE POLICY "new_admin_inquiries_update" ON public.inquiries
  FOR UPDATE
  USING (public.is_admin());


-- Set your account as admin (replace email):
-- UPDATE public.profiles SET role = 'admin' WHERE email = 'your@email.com';
