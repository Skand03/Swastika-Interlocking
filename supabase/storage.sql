-- ============================================================
-- Swastika Interlocking — Supabase Storage Setup
-- Run this in the Supabase SQL Editor
-- ============================================================

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public)
VALUES
  ('products', 'products', true),
  ('projects', 'projects', true),
  ('documents', 'documents', false)
ON CONFLICT (id) DO NOTHING;

-- ──────────────────────────────────────────────────────
-- PRODUCTS bucket — public read, admin write
-- ──────────────────────────────────────────────────────
DROP POLICY IF EXISTS "Products public read" ON storage.objects;
CREATE POLICY "Products public read" ON storage.objects
  FOR SELECT USING (bucket_id = 'products');

DROP POLICY IF EXISTS "Products admin insert" ON storage.objects;
CREATE POLICY "Products admin insert" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'products'
    AND auth.role() = 'authenticated'
  );

DROP POLICY IF EXISTS "Products admin update" ON storage.objects;
CREATE POLICY "Products admin update" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'products'
    AND auth.role() = 'authenticated'
  );

DROP POLICY IF EXISTS "Products admin delete" ON storage.objects;
CREATE POLICY "Products admin delete" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'products'
    AND auth.role() = 'authenticated'
  );

-- ──────────────────────────────────────────────────────
-- PROJECTS bucket — public read, admin write
-- ──────────────────────────────────────────────────────
DROP POLICY IF EXISTS "Projects public read" ON storage.objects;
CREATE POLICY "Projects public read" ON storage.objects
  FOR SELECT USING (bucket_id = 'projects');

DROP POLICY IF EXISTS "Projects admin insert" ON storage.objects;
CREATE POLICY "Projects admin insert" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'projects'
    AND auth.role() = 'authenticated'
  );

DROP POLICY IF EXISTS "Projects admin update" ON storage.objects;
CREATE POLICY "Projects admin update" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'projects'
    AND auth.role() = 'authenticated'
  );

DROP POLICY IF EXISTS "Projects admin delete" ON storage.objects;
CREATE POLICY "Projects admin delete" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'projects'
    AND auth.role() = 'authenticated'
  );

-- ──────────────────────────────────────────────────────
-- DOCUMENTS bucket — admin only
-- ──────────────────────────────────────────────────────
DROP POLICY IF EXISTS "Documents admin all" ON storage.objects;
CREATE POLICY "Documents admin all" ON storage.objects
  FOR ALL USING (
    bucket_id = 'documents'
    AND auth.role() = 'authenticated'
    AND EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
