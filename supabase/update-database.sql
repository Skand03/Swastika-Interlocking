-- ==========================================
-- SWastika Interlocking DB Fixes - Final
-- ==========================================

-- Step 1: Add customer_id to inquiries if missing
ALTER TABLE public.inquiries 
ADD COLUMN IF NOT EXISTS customer_id uuid 
REFERENCES public.profiles(id) ON DELETE SET NULL;

-- Step 2: Drop all existing policies on all tables to avoid conflicts
DO $$ 
DECLARE
  r RECORD;
BEGIN
  -- Drop policies on profiles
  FOR r IN (SELECT schemaname, tablename, policyname FROM pg_policies WHERE tablename = 'profiles') LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON %I.%I', r.policyname, r.schemaname, r.tablename);
  END LOOP;
  
  -- Drop policies on inquiries
  FOR r IN (SELECT schemaname, tablename, policyname FROM pg_policies WHERE tablename = 'inquiries') LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON %I.%I', r.policyname, r.schemaname, r.tablename);
  END LOOP;
  
  -- Drop policies on orders
  FOR r IN (SELECT schemaname, tablename, policyname FROM pg_policies WHERE tablename = 'orders') LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON %I.%I', r.policyname, r.schemaname, r.tablename);
  END LOOP;
  
  -- Drop policies on products
  FOR r IN (SELECT schemaname, tablename, policyname FROM pg_policies WHERE tablename = 'products') LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON %I.%I', r.policyname, r.schemaname, r.tablename);
  END LOOP;
  
  -- Drop policies on categories
  FOR r IN (SELECT schemaname, tablename, policyname FROM pg_policies WHERE tablename = 'categories') LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON %I.%I', r.policyname, r.schemaname, r.tablename);
  END LOOP;
  
  -- Drop policies on shuttering_rentals
  FOR r IN (SELECT schemaname, tablename, policyname FROM pg_policies WHERE tablename = 'shuttering_rentals') LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON %I.%I', r.policyname, r.schemaname, r.tablename);
  END LOOP;
  
  -- Drop policies on rcc_projects
  FOR r IN (SELECT schemaname, tablename, policyname FROM pg_policies WHERE tablename = 'rcc_projects') LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON %I.%I', r.policyname, r.schemaname, r.tablename);
  END LOOP;
  
  -- Drop policies on inventory_logs
  FOR r IN (SELECT schemaname, tablename, policyname FROM pg_policies WHERE tablename = 'inventory_logs') LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON %I.%I', r.policyname, r.schemaname, r.tablename);
  END LOOP;
  
  -- Drop policies on reviews
  FOR r IN (SELECT schemaname, tablename, policyname FROM pg_policies WHERE tablename = 'reviews') LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON %I.%I', r.policyname, r.schemaname, r.tablename);
  END LOOP;
  
  -- Drop policies on site_settings
  FOR r IN (SELECT schemaname, tablename, policyname FROM pg_policies WHERE tablename = 'site_settings') LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON %I.%I', r.policyname, r.schemaname, r.tablename);
  END LOOP;
END $$;

-- Step 3: Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shuttering_rentals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rcc_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Step 4: Create helper function to check admin status
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid()
    AND role = 'admin'
    AND is_active = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 5: Add proper policies
-- ==========================================
-- PROFILES TABLE POLICIES
-- ==========================================
-- Users can view and edit their own profiles
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);
-- Admins can manage all profiles
CREATE POLICY "Admins can manage all profiles" ON public.profiles
  FOR ALL USING (public.is_admin());
-- We need a policy to allow inserting profiles (for the trigger or new users)
CREATE POLICY "Service role can insert profiles" ON public.profiles
  FOR INSERT WITH CHECK (true);

-- ==========================================
-- INQUIRIES TABLE POLICIES
-- ==========================================
-- Logged-in users can create inquiries (with their customer_id)
CREATE POLICY "Users can create inquiries" ON public.inquiries
  FOR INSERT WITH CHECK (auth.uid() = customer_id OR customer_id IS NULL);
-- Logged-in users can view their own inquiries
CREATE POLICY "Users can view own inquiries" ON public.inquiries
  FOR SELECT USING (auth.uid() = customer_id OR customer_id IS NULL);
-- Admins can view and manage all inquiries
CREATE POLICY "Admins can manage all inquiries" ON public.inquiries
  FOR ALL USING (public.is_admin());

-- ==========================================
-- ORDERS TABLE POLICIES
-- ==========================================
-- Logged-in users can create orders (with their customer_id)
CREATE POLICY "Users can create orders" ON public.orders
  FOR INSERT WITH CHECK (auth.uid() = customer_id);
-- Logged-in users can view their own orders
CREATE POLICY "Users can view own orders" ON public.orders
  FOR SELECT USING (auth.uid() = customer_id);
-- Admins can view and manage all orders
CREATE POLICY "Admins can manage all orders" ON public.orders
  FOR ALL USING (public.is_admin());

-- ==========================================
-- PRODUCTS & CATEGORIES TABLE POLICIES
-- ==========================================
-- Everyone can view active products and categories
CREATE POLICY "Everyone can view active products" ON public.products
  FOR SELECT USING (is_active = true);
CREATE POLICY "Everyone can view active categories" ON public.categories
  FOR SELECT USING (is_active = true);
-- Admins can manage products and categories
CREATE POLICY "Admins can manage products" ON public.products
  FOR ALL USING (public.is_admin());
CREATE POLICY "Admins can manage categories" ON public.categories
  FOR ALL USING (public.is_admin());

-- ==========================================
-- SHUTTERING RENTALS POLICIES
-- ==========================================
-- Users can view their own rentals
CREATE POLICY "Users can view own rentals" ON public.shuttering_rentals
  FOR SELECT USING (auth.uid() = customer_id);
-- Users can create their own rentals
CREATE POLICY "Users can create rentals" ON public.shuttering_rentals
  FOR INSERT WITH CHECK (auth.uid() = customer_id);
-- Admins can manage all rentals
CREATE POLICY "Admins can manage all rentals" ON public.shuttering_rentals
  FOR ALL USING (public.is_admin());

-- ==========================================
-- RCC PROJECTS POLICIES
-- ==========================================
-- Only admins can manage RCC projects
CREATE POLICY "Admins can manage all projects" ON public.rcc_projects
  FOR ALL USING (public.is_admin());

-- ==========================================
-- INVENTORY LOGS POLICIES
-- ==========================================
-- Only admins can manage inventory logs
CREATE POLICY "Admins can manage inventory logs" ON public.inventory_logs
  FOR ALL USING (public.is_admin());

-- ==========================================
-- REVIEWS POLICIES
-- ==========================================
-- Everyone can view approved reviews
CREATE POLICY "Everyone can view approved reviews" ON public.reviews
  FOR SELECT USING (is_approved = true);
-- Users can view their own reviews
CREATE POLICY "Users can view own reviews" ON public.reviews
  FOR SELECT USING (auth.uid() = customer_id);
-- Users can create their own reviews
CREATE POLICY "Users can create reviews" ON public.reviews
  FOR INSERT WITH CHECK (auth.uid() = customer_id);
-- Admins can manage all reviews
CREATE POLICY "Admins can manage all reviews" ON public.reviews
  FOR ALL USING (public.is_admin());

-- ==========================================
-- SITE SETTINGS POLICIES
-- ==========================================
-- Everyone can view site settings
CREATE POLICY "Everyone can view site settings" ON public.site_settings
  FOR SELECT USING (true);
-- Admins can update site settings
CREATE POLICY "Admins can update site settings" ON public.site_settings
  FOR ALL USING (public.is_admin());

-- Step 6: Add unique constraint on phone column
ALTER TABLE public.profiles 
ADD CONSTRAINT IF NOT EXISTS profiles_phone_key UNIQUE (phone);

-- Step 7: Make sure the auto-profile trigger exists
-- Drop trigger if exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Drop function if exists
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Create the handle_new_user function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (
    id, 
    full_name, 
    email, 
    phone, 
    role, 
    preferred_language, 
    is_active, 
    created_at, 
    updated_at
  )
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', 'User'),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'phone', ''),
    'customer',
    'hi',
    true,
    NOW(),
    NOW()
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Done!
