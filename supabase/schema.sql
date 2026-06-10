-- Swastika Interlocking Complete Supabase Schema

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Helper function to check if current user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND role IN ('admin', 'staff')
  );
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

-- ==========================================
-- TABLE 1: profiles
-- ==========================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name text,
  full_name_hindi text,
  phone text UNIQUE,
  email text,
  city text,
  state text,
  pincode text,
  address text,
  role text DEFAULT 'customer' CHECK (role IN ('customer', 'admin', 'staff')),
  preferred_language text DEFAULT 'hi',
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- RLS Policies for profiles - FIXED (NO INFINITE RECURSION!)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id OR public.is_admin());
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins can manage all profiles" ON public.profiles
  FOR ALL USING (public.is_admin());

-- Trigger to update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger to auto-create profile when a new user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, role, preferred_language, is_active)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', 'User'),
    NEW.email,
    'customer',
    'hi',
    true
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- ==========================================
-- TABLE 2: categories
-- ==========================================
CREATE TABLE IF NOT EXISTS public.categories (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  name_en text NOT NULL,
  name_hi text NOT NULL,
  slug text UNIQUE,
  division text CHECK (division IN ('building_materials', 'shuttering', 'rcc')),
  icon text,
  is_active boolean DEFAULT true,
  sort_order integer,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Everyone can view active categories" ON public.categories FOR SELECT USING (is_active = true);
CREATE POLICY "Service role can do all on categories" ON public.categories FOR ALL USING (true);


-- ==========================================
-- TABLE 3: products
-- ==========================================
CREATE TABLE IF NOT EXISTS public.products (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  name_en text NOT NULL,
  name_hi text NOT NULL,
  description_en text,
  description_hi text,
  category_id uuid REFERENCES public.categories(id) ON DELETE SET NULL,
  division text CHECK (division IN ('building_materials', 'shuttering', 'rcc')),
  product_type text CHECK (product_type IN ('sale', 'rent', 'both')),
  price_min numeric(10,2),
  price_max numeric(10,2),
  price_unit text CHECK (price_unit IN ('piece', 'ton', 'bag', 'meter', 'sqft', 'day')),
  rent_price_per_day numeric(10,2),
  stock_quantity integer DEFAULT 0,
  min_stock_alert integer DEFAULT 10,
  images text[],
  specifications jsonb,
  tags text[],
  is_active boolean DEFAULT true,
  is_featured boolean DEFAULT false,
  sort_order integer,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Everyone can view active products" ON public.products FOR SELECT USING (is_active = true);
CREATE POLICY "Service role can do all on products" ON public.products FOR ALL USING (true);
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON public.products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Indexes for products
CREATE INDEX idx_products_category_id ON public.products(category_id);
CREATE INDEX idx_products_division ON public.products(division);
CREATE INDEX idx_products_is_active ON public.products(is_active);
CREATE INDEX idx_products_is_featured ON public.products(is_featured);


-- ==========================================
-- TABLE 4: orders
-- ==========================================
CREATE TABLE IF NOT EXISTS public.orders (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  order_number text UNIQUE,
  customer_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  customer_name text,
  customer_phone text,
  delivery_address text,
  delivery_city text,
  delivery_pincode text,
  items jsonb NOT NULL,
  subtotal numeric(12,2),
  delivery_charge numeric(10,2) DEFAULT 0,
  total_amount numeric(12,2),
  status text DEFAULT 'new' CHECK (status IN ('new','confirmed','processing','dispatched','delivered','cancelled')),
  payment_status text DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid')),
  payment_method text CHECK (payment_method IN ('cash', 'upi', 'bank_transfer')),
  admin_notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own orders" ON public.orders FOR SELECT USING (auth.uid() = customer_id OR public.is_admin());
CREATE POLICY "Users can insert own orders" ON public.orders FOR INSERT WITH CHECK (auth.uid() = customer_id);
CREATE POLICY "Users can update own orders" ON public.orders FOR UPDATE USING (auth.uid() = customer_id);
CREATE POLICY "Admins can manage all orders" ON public.orders FOR ALL USING (public.is_admin());
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON public.orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Indexes for orders
CREATE INDEX idx_orders_customer_id ON public.orders(customer_id);
CREATE INDEX idx_orders_status ON public.orders(status);
CREATE INDEX idx_orders_created_at ON public.orders(created_at);
CREATE INDEX idx_orders_order_number ON public.orders(order_number);


-- ==========================================
-- TABLE 5: shuttering_rentals
-- ==========================================
CREATE TABLE IF NOT EXISTS public.shuttering_rentals (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  rental_number text UNIQUE,
  customer_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  customer_name text,
  customer_phone text,
  site_address text,
  city text,
  items jsonb NOT NULL,
  rental_type text CHECK (rental_type IN ('rent', 'sale')),
  start_date date,
  end_date date,
  total_days integer,
  total_amount numeric(12,2),
  deposit_amount numeric(12,2),
  status text DEFAULT 'active' CHECK (status IN ('active', 'overdue', 'returned', 'cancelled')),
  return_date date,
  admin_notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.shuttering_rentals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own rentals" ON public.shuttering_rentals FOR SELECT USING (auth.uid() = customer_id OR public.is_admin());
CREATE POLICY "Users can insert own rentals" ON public.shuttering_rentals FOR INSERT WITH CHECK (auth.uid() = customer_id);
CREATE POLICY "Users can update own rentals" ON public.shuttering_rentals FOR UPDATE USING (auth.uid() = customer_id);
CREATE POLICY "Admins can manage all rentals" ON public.shuttering_rentals FOR ALL USING (public.is_admin());
CREATE TRIGGER update_shuttering_rentals_updated_at BEFORE UPDATE ON public.shuttering_rentals FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Indexes for shuttering_rentals
CREATE INDEX idx_shuttering_rentals_customer_id ON public.shuttering_rentals(customer_id);
CREATE INDEX idx_shuttering_rentals_status ON public.shuttering_rentals(status);
CREATE INDEX idx_shuttering_rentals_end_date ON public.shuttering_rentals(end_date);


-- ==========================================
-- TABLE 6: rcc_projects
-- ==========================================
CREATE TABLE IF NOT EXISTS public.rcc_projects (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  project_number text UNIQUE,
  client_name text,
  organization text,
  client_phone text,
  client_email text,
  location text,
  district text,
  pincode text,
  road_length_meters numeric(10,2),
  road_width_meters numeric(10,2),
  concrete_grade text CHECK (concrete_grade IN ('M20', 'M25', 'M30', 'Other')),
  road_type text CHECK (road_type IN ('new', 'repair', 'widening')),
  contract_value numeric(14,2),
  status text DEFAULT 'enquiry' CHECK (status IN ('enquiry','site_visit','contract_signed','under_construction','completed','cancelled')),
  start_date date,
  expected_completion date,
  actual_completion date,
  milestones jsonb,
  payments_received jsonb,
  total_paid numeric(14,2) DEFAULT 0,
  progress_percentage integer DEFAULT 0,
  photos text[],
  admin_notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.rcc_projects ENABLE ROW LEVEL SECURITY;
-- RCC projects are typically handled directly by admins.
CREATE POLICY "Service role can do all on rcc_projects" ON public.rcc_projects FOR ALL USING (true);
CREATE TRIGGER update_rcc_projects_updated_at BEFORE UPDATE ON public.rcc_projects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Indexes for rcc_projects
CREATE INDEX idx_rcc_projects_status ON public.rcc_projects(status);
CREATE INDEX idx_rcc_projects_district ON public.rcc_projects(district);
CREATE INDEX idx_rcc_projects_created_at ON public.rcc_projects(created_at);


-- ==========================================
-- TABLE 7: inquiries
-- ==========================================
CREATE TABLE IF NOT EXISTS public.inquiries (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  customer_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  customer_name text,
  customer_phone text,
  customer_email text,
  city text,
  source text CHECK (source IN ('chatbot', 'contact_form', 'whatsapp', 'rcc_enquiry', 'shuttering_enquiry')),
  division text CHECK (division IN ('building_materials', 'shuttering', 'rcc')),
  subject text,
  message text,
  product_interested text,
  budget_range text,
  status text DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'converted', 'closed')),
  admin_reply text,
  is_read boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can insert own inquiries" ON public.inquiries FOR INSERT WITH CHECK (auth.uid() = customer_id);
CREATE POLICY "Users can view own inquiries" ON public.inquiries FOR SELECT USING (auth.uid() = customer_id OR public.is_admin());
CREATE POLICY "Users can update own inquiries" ON public.inquiries FOR UPDATE USING (auth.uid() = customer_id);
CREATE POLICY "Admins can manage all inquiries" ON public.inquiries FOR ALL USING (public.is_admin());
CREATE TRIGGER update_inquiries_updated_at BEFORE UPDATE ON public.inquiries FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Indexes for inquiries
CREATE INDEX idx_inquiries_status ON public.inquiries(status);
CREATE INDEX idx_inquiries_source ON public.inquiries(source);
CREATE INDEX idx_inquiries_is_read ON public.inquiries(is_read);
CREATE INDEX idx_inquiries_created_at ON public.inquiries(created_at);


-- ==========================================
-- TABLE 8: inventory_logs
-- ==========================================
CREATE TABLE IF NOT EXISTS public.inventory_logs (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  product_id uuid REFERENCES public.products(id) ON DELETE CASCADE,
  action text CHECK (action IN ('add', 'remove', 'adjust', 'damage')),
  quantity_change integer NOT NULL,
  previous_quantity integer,
  new_quantity integer,
  reason text,
  admin_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.inventory_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role can do all on inventory_logs" ON public.inventory_logs FOR ALL USING (true);


-- ==========================================
-- TABLE 9: reviews
-- ==========================================
CREATE TABLE IF NOT EXISTS public.reviews (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  customer_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  order_id uuid REFERENCES public.orders(id) ON DELETE SET NULL,
  product_id uuid REFERENCES public.products(id) ON DELETE CASCADE,
  rating integer CHECK (rating >= 1 AND rating <= 5),
  review_text text,
  is_approved boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Everyone can view approved reviews" ON public.reviews FOR SELECT USING (is_approved = true);
CREATE POLICY "Users can view own reviews" ON public.reviews FOR SELECT USING (auth.uid() = customer_id OR public.is_admin());
CREATE POLICY "Users can insert own reviews" ON public.reviews FOR INSERT WITH CHECK (auth.uid() = customer_id);
CREATE POLICY "Admins can manage all reviews" ON public.reviews FOR ALL USING (public.is_admin());


-- ==========================================
-- TABLE 10: site_settings
-- ==========================================
CREATE TABLE IF NOT EXISTS public.site_settings (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  key text UNIQUE NOT NULL,
  value text,
  description text,
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Everyone can read site settings" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "Service role can do all on site_settings" ON public.site_settings FOR ALL USING (true);
CREATE TRIGGER update_site_settings_updated_at BEFORE UPDATE ON public.site_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();


-- ==========================================
-- DEFAULT DATA SEEDING
-- ==========================================

-- Seed categories
INSERT INTO public.categories (name_en, name_hi, slug, division, sort_order) VALUES
('Interlocking Paver Blocks', 'इंटरलॉकिंग पेवर ब्लॉक', 'interlocking-paver-blocks', 'building_materials', 1),
('Bricks & Blocks', 'ईंटें और ब्लॉक', 'bricks-blocks', 'building_materials', 2),
('Raw Materials', 'कच्चा माल', 'raw-materials', 'building_materials', 3),
('Scaffolding', 'मचान (Scaffolding)', 'scaffolding', 'shuttering', 1),
('Props & Jacks', 'प्रॉप्स और जैक', 'props-jacks', 'shuttering', 2),
('Plates & Boards', 'प्लेट्स और बोर्ड', 'plates-boards', 'shuttering', 3),
('Road Construction', 'सड़क निर्माण', 'road-construction', 'rcc', 1),
('Drainage Work', 'जल निकासी कार्य', 'drainage-work', 'rcc', 2),
('Repairs & Widening', 'मरम्मत और चौड़ीकरण', 'repairs-widening', 'rcc', 3)
ON CONFLICT (slug) DO NOTHING;

-- Seed Site Settings
INSERT INTO public.site_settings (key, value, description) VALUES
('business_name', 'Swastika Interlocking', 'Official business name'),
('business_phone', '+919999999999', 'Main contact phone number'),
('business_whatsapp', '+919999999999', 'WhatsApp contact number'),
('business_address', 'Ahmedabad, Gujarat', 'Main office address')
ON CONFLICT (key) DO NOTHING;
