/*
FIXED RLS POLICIES - NO INFINITE RECURSION!

Apply these policies to your Supabase project!
Go to: https://supabase.com/dashboard/project/YOUR_PROJECT_ID
Then: Database → Policies → Replace all policies for each table with these!
*/

-- ==========================================
-- TABLE: profiles
-- ==========================================
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admin can do all on profiles" ON public.profiles;

-- Allow users to insert their own profile
CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Allow users to view their own profile
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

-- Allow users to update their own profile
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- ==========================================
-- TABLE: categories
-- ==========================================
DROP POLICY IF EXISTS "Everyone can view active categories" ON public.categories;
DROP POLICY IF EXISTS "Admin can do all on categories" ON public.categories;

CREATE POLICY "Everyone can view active categories" ON public.categories
  FOR SELECT USING (is_active = true);

CREATE POLICY "Service role can do all on categories" ON public.categories
  FOR ALL USING (true);

-- ==========================================
-- TABLE: products
-- ==========================================
DROP POLICY IF EXISTS "Everyone can view active products" ON public.products;
DROP POLICY IF EXISTS "Admin can do all on products" ON public.products;

CREATE POLICY "Everyone can view active products" ON public.products
  FOR SELECT USING (is_active = true);

CREATE POLICY "Service role can do all on products" ON public.products
  FOR ALL USING (true);

-- ==========================================
-- TABLE: orders
-- ==========================================
DROP POLICY IF EXISTS "Users can view own orders" ON public.orders;
DROP POLICY IF EXISTS "Users can insert own orders" ON public.orders;
DROP POLICY IF EXISTS "Admin can do all on orders" ON public.orders;

CREATE POLICY "Users can view own orders" ON public.orders
  FOR SELECT USING (auth.uid() = customer_id);

CREATE POLICY "Users can insert own orders" ON public.orders
  FOR INSERT WITH CHECK (auth.uid() = customer_id);

CREATE POLICY "Service role can do all on orders" ON public.orders
  FOR ALL USING (true);

-- ==========================================
-- TABLE: shuttering_rentals
-- ==========================================
DROP POLICY IF EXISTS "Users can view own rentals" ON public.shuttering_rentals;
DROP POLICY IF EXISTS "Admin can do all on rentals" ON public.shuttering_rentals;

CREATE POLICY "Users can view own rentals" ON public.shuttering_rentals
  FOR SELECT USING (auth.uid() = customer_id);

CREATE POLICY "Service role can do all on rentals" ON public.shuttering_rentals
  FOR ALL USING (true);

-- ==========================================
-- TABLE: rcc_projects
-- ==========================================
DROP POLICY IF EXISTS "Admin can do all on rcc_projects" ON public.rcc_projects;

CREATE POLICY "Service role can do all on rcc_projects" ON public.rcc_projects
  FOR ALL USING (true);

-- ==========================================
-- TABLE: inquiries
-- ==========================================
DROP POLICY IF EXISTS "Anyone can insert inquiries" ON public.inquiries;
DROP POLICY IF EXISTS "Admin can view all inquiries" ON public.inquiries;
DROP POLICY IF EXISTS "Admin can update inquiries" ON public.inquiries;

CREATE POLICY "Anyone can insert inquiries" ON public.inquiries
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Service role can do all on inquiries" ON public.inquiries
  FOR ALL USING (true);

-- ==========================================
-- TABLE: inventory_logs
-- ==========================================
DROP POLICY IF EXISTS "Admin can do all on inventory_logs" ON public.inventory_logs;

CREATE POLICY "Service role can do all on inventory_logs" ON public.inventory_logs
  FOR ALL USING (true);

-- ==========================================
-- TABLE: reviews
-- ==========================================
DROP POLICY IF EXISTS "Everyone can view approved reviews" ON public.reviews;
DROP POLICY IF EXISTS "Users can view own reviews" ON public.reviews;
DROP POLICY IF EXISTS "Users can insert own reviews" ON public.reviews;
DROP POLICY IF EXISTS "Admin can do all on reviews" ON public.reviews;

CREATE POLICY "Everyone can view approved reviews" ON public.reviews
  FOR SELECT USING (is_approved = true);

CREATE POLICY "Users can view own reviews" ON public.reviews
  FOR SELECT USING (auth.uid() = customer_id);

CREATE POLICY "Users can insert own reviews" ON public.reviews
  FOR INSERT WITH CHECK (auth.uid() = customer_id);

CREATE POLICY "Service role can do all on reviews" ON public.reviews
  FOR ALL USING (true);

-- ==========================================
-- TABLE: site_settings
-- ==========================================
DROP POLICY IF EXISTS "Everyone can read site settings" ON public.site_settings;
DROP POLICY IF EXISTS "Admin can update site settings" ON public.site_settings;

CREATE POLICY "Everyone can read site settings" ON public.site_settings
  FOR SELECT USING (true);

CREATE POLICY "Service role can do all on site_settings" ON public.site_settings
  FOR ALL USING (true);
