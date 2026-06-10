-- ============================================================
-- Fix: "new row violates row-level security policy for table profiles"
-- This happens during signup when the trigger tries to insert a profile
-- but the profiles_insert RLS policy blocks it.
--
-- The handle_new_user() trigger runs as SECURITY DEFINER so it bypasses
-- RLS — but the INSERT policy still needs to allow the row.
-- The fix: allow INSERT when either auth.uid() = id (user self-insert)
-- OR when the inserting role is service_role (trigger/backend).
-- ============================================================

-- Drop the restrictive policy
DROP POLICY IF EXISTS "profiles_insert" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;

-- Allow insert when:
--   1. User is inserting their own profile (normal signup flow)
--   2. Service role is inserting (trigger on new user creation)
CREATE POLICY "profiles_insert" ON public.profiles
  FOR INSERT
  WITH CHECK (
    auth.uid() = id
    OR auth.role() = 'service_role'
  );
