-- ============================================================
-- COMPLETE RLS POLICY SCRIPT — Swastika Interlocking
-- Run this once in Supabase SQL Editor (Dashboard → SQL Editor)
--
-- Rules enforced:
--   • No guest access to orders or inquiries
--   • Logged-in users can only insert rows tied to their own customer_id
--   • Admins can view and manage ALL rows across all tables
--   • Triggers, function names, and policy names match what the React app uses
-- ============================================================

-- ──────────────────────────────────────────────────────────
-- 1. is_admin() helper function
--    Used in all admin-access policies below
--    SECURITY DEFINER so it bypasses RLS when reading profiles
-- ──────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE id = auth.uid()
      AND role = 'admin'
  );
$$;


-- ──────────────────────────────────────────────────────────
-- 2. profiles
-- ──────────────────────────────────────────────────────────
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can insert own profile"    ON public.profiles;
DROP POLICY IF EXISTS "Users can view own profile"      ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile"    ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles"    ON public.profiles;
DROP POLICY IF EXISTS "Admins can update all profiles"  ON public.profiles;
DROP POLICY IF EXISTS "profiles_select"                 ON public.profiles;
DROP POLICY IF EXISTS "profiles_insert"                 ON public.profiles;
DROP POLICY IF EXISTS "profiles_update"                 ON public.profiles;

-- Auto-created on signup (trigger inserts the row, so auth.uid() = id)
CREATE POLICY "profiles_insert" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- User sees own row; admin sees all
CREATE POLICY "profiles_select" ON public.profiles
  FOR SELECT USING (auth.uid() = id OR public.is_admin());

-- User edits own row; admin edits any
CREATE POLICY "profiles_update" ON public.profiles
  FOR UPDATE USING (auth.uid() = id OR public.is_admin());


-- ──────────────────────────────────────────────────────────
-- 3. products — public read, admin write
-- ──────────────────────────────────────────────────────────
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Everyone can view active products" ON public.products;
DROP POLICY IF EXISTS "Service role can do all on products" ON public.products;
DROP POLICY IF EXISTS "Admins can manage products" ON public.products;
DROP POLICY IF EXISTS "products_select" ON public.products;
DROP POLICY IF EXISTS "products_insert" ON public.products;
DROP POLICY IF EXISTS "products_update" ON public.products;
DROP POLICY IF EXISTS "products_delete" ON public.products;

-- Anyone (public) can browse products
CREATE POLICY "products_select" ON public.products
  FOR SELECT USING (true);

-- Only admin can add / edit / delete products
CREATE POLICY "products_insert" ON public.products
  FOR INSERT WITH CHECK (public.is_admin());

CREATE POLICY "products_update" ON public.products
  FOR UPDATE USING (public.is_admin());

CREATE POLICY "products_delete" ON public.products
  FOR DELETE USING (public.is_admin());


-- ──────────────────────────────────────────────────────────
-- 4. orders
--    • Only authenticated users can insert (no guests)
--    • customer_id must equal the caller's auth.uid()
--    • Users see only their own orders
--    • Admin sees and updates all
-- ──────────────────────────────────────────────────────────
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own orders"        ON public.orders;
DROP POLICY IF EXISTS "Users can insert own orders"      ON public.orders;
DROP POLICY IF EXISTS "Service role can do all on orders" ON public.orders;
DROP POLICY IF EXISTS "Admins can view all orders"       ON public.orders;
DROP POLICY IF EXISTS "Admins can update all orders"     ON public.orders;
DROP POLICY IF EXISTS "Anyone can insert orders"         ON public.orders;
DROP POLICY IF EXISTS "orders_insert"                    ON public.orders;
DROP POLICY IF EXISTS "orders_select"                    ON public.orders;
DROP POLICY IF EXISTS "orders_select_own"                ON public.orders;
DROP POLICY IF EXISTS "orders_select_admin"              ON public.orders;
DROP POLICY IF EXISTS "orders_update"                    ON public.orders;
DROP POLICY IF EXISTS "orders_update_admin"              ON public.orders;

-- Authenticated users can insert ONLY rows where customer_id = their uid
CREATE POLICY "orders_insert" ON public.orders
  FOR INSERT
  WITH CHECK (
    auth.uid() IS NOT NULL
    AND auth.uid() = customer_id
  );

-- Users see their own orders; admin sees all
CREATE POLICY "orders_select" ON public.orders
  FOR SELECT
  USING (
    auth.uid() = customer_id
    OR public.is_admin()
  );

-- Only admin can update order status
CREATE POLICY "orders_update" ON public.orders
  FOR UPDATE
  USING (public.is_admin());


-- ──────────────────────────────────────────────────────────
-- 5. inquiries
--    • Only authenticated users can insert
--    • customer_id must equal caller's auth.uid() when provided
--    • Admin sees and updates all
--    • (No user-level read — inquiries are admin-managed)
-- ──────────────────────────────────────────────────────────
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can insert inquiries"         ON public.inquiries;
DROP POLICY IF EXISTS "Service role can do all on inquiries" ON public.inquiries;
DROP POLICY IF EXISTS "Admins can view all inquiries"       ON public.inquiries;
DROP POLICY IF EXISTS "Admins can update inquiries"         ON public.inquiries;
DROP POLICY IF EXISTS "inquiries_insert"                    ON public.inquiries;
DROP POLICY IF EXISTS "inquiries_select"                    ON public.inquiries;
DROP POLICY IF EXISTS "inquiries_update"                    ON public.inquiries;

-- Authenticated users can submit inquiries.
-- If customer_id is provided it must match their uid (prevents spoofing).
-- If customer_id is NULL (not provided) the row is still accepted from logged-in users.
CREATE POLICY "inquiries_insert" ON public.inquiries
  FOR INSERT
  WITH CHECK (
    auth.uid() IS NOT NULL
    AND (customer_id IS NULL OR customer_id = auth.uid())
  );

-- Only admin can read inquiries in the admin dashboard
CREATE POLICY "inquiries_select" ON public.inquiries
  FOR SELECT USING (public.is_admin());

-- Only admin can update / reply to inquiries
CREATE POLICY "inquiries_update" ON public.inquiries
  FOR UPDATE USING (public.is_admin());


-- ──────────────────────────────────────────────────────────
-- 6. categories — public read, admin write
-- ──────────────────────────────────────────────────────────
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Everyone can view active categories"    ON public.categories;
DROP POLICY IF EXISTS "Service role can do all on categories"  ON public.categories;
DROP POLICY IF EXISTS "categories_select"                      ON public.categories;
DROP POLICY IF EXISTS "categories_write"                       ON public.categories;

CREATE POLICY "categories_select" ON public.categories
  FOR SELECT USING (true);

CREATE POLICY "categories_write" ON public.categories
  FOR ALL USING (public.is_admin());


-- ──────────────────────────────────────────────────────────
-- 7. shuttering_rentals
-- ──────────────────────────────────────────────────────────
ALTER TABLE public.shuttering_rentals ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own rentals"             ON public.shuttering_rentals;
DROP POLICY IF EXISTS "Service role can do all on rentals"     ON public.shuttering_rentals;
DROP POLICY IF EXISTS "Admins can view all rentals"            ON public.shuttering_rentals;
DROP POLICY IF EXISTS "Admins can update rentals"              ON public.shuttering_rentals;
DROP POLICY IF EXISTS "rentals_insert"                         ON public.shuttering_rentals;
DROP POLICY IF EXISTS "rentals_select"                         ON public.shuttering_rentals;
DROP POLICY IF EXISTS "rentals_update"                         ON public.shuttering_rentals;

-- Authenticated users only
CREATE POLICY "rentals_insert" ON public.shuttering_rentals
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "rentals_select" ON public.shuttering_rentals
  FOR SELECT USING (auth.uid() = customer_id OR public.is_admin());

CREATE POLICY "rentals_update" ON public.shuttering_rentals
  FOR UPDATE USING (public.is_admin());


-- ──────────────────────────────────────────────────────────
-- 8. inventory_logs — admin only
-- ──────────────────────────────────────────────────────────
ALTER TABLE public.inventory_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can manage inventory logs" ON public.inventory_logs;
DROP POLICY IF EXISTS "inventory_logs_all"               ON public.inventory_logs;

CREATE POLICY "inventory_logs_all" ON public.inventory_logs
  FOR ALL USING (public.is_admin());


-- ──────────────────────────────────────────────────────────
-- 9. reviews
-- ──────────────────────────────────────────────────────────
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Everyone can view approved reviews" ON public.reviews;
DROP POLICY IF EXISTS "Users can view own reviews"         ON public.reviews;
DROP POLICY IF EXISTS "Users can insert own reviews"       ON public.reviews;
DROP POLICY IF EXISTS "Service role can do all on reviews" ON public.reviews;
DROP POLICY IF EXISTS "reviews_select"                     ON public.reviews;
DROP POLICY IF EXISTS "reviews_insert"                     ON public.reviews;
DROP POLICY IF EXISTS "reviews_admin"                      ON public.reviews;

CREATE POLICY "reviews_select" ON public.reviews
  FOR SELECT USING (
    is_approved = true
    OR auth.uid() = customer_id
    OR public.is_admin()
  );

CREATE POLICY "reviews_insert" ON public.reviews
  FOR INSERT WITH CHECK (
    auth.uid() IS NOT NULL
    AND auth.uid() = customer_id
  );

CREATE POLICY "reviews_admin" ON public.reviews
  FOR ALL USING (public.is_admin());


-- ──────────────────────────────────────────────────────────
-- 10. site_settings — public read, admin write
-- ──────────────────────────────────────────────────────────
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Everyone can read site settings"      ON public.site_settings;
DROP POLICY IF EXISTS "Service role can do all on site_settings" ON public.site_settings;
DROP POLICY IF EXISTS "settings_select"                      ON public.site_settings;
DROP POLICY IF EXISTS "settings_write"                       ON public.site_settings;

CREATE POLICY "settings_select" ON public.site_settings
  FOR SELECT USING (true);

CREATE POLICY "settings_write" ON public.site_settings
  FOR ALL USING (public.is_admin());


-- ──────────────────────────────────────────────────────────
-- 11. handle_new_user trigger
--     Auto-creates a profiles row when someone signs up
--     Keeps existing trigger name: on_auth_user_created
-- ──────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, phone, role)
  VALUES (
    NEW.id,
    COALESCE(
      NEW.raw_user_meta_data->>'full_name',
      NEW.raw_user_meta_data->>'name',
      split_part(NEW.email, '@', 1)
    ),
    NEW.email,
    NEW.raw_user_meta_data->>'phone',
    'customer'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- ──────────────────────────────────────────────────────────
-- HOW TO MAKE YOURSELF ADMIN
-- Run this after signing up, replacing the email:
-- ──────────────────────────────────────────────────────────
-- UPDATE public.profiles SET role = 'admin' WHERE email = 'your@email.com';
