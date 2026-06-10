-- Run this single statement in Supabase SQL Editor
-- Fixes the "violates row-level security policy" error on inquiries

DROP POLICY IF EXISTS "inquiries_insert" ON public.inquiries;

CREATE POLICY "inquiries_insert" ON public.inquiries
  FOR INSERT
  WITH CHECK (true);
