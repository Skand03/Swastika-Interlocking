-- New Database RPC (to be executed in Supabase SQL editor)
CREATE OR REPLACE FUNCTION public.check_email_exists(lookup_email text)
RETURNS boolean AS $$
BEGIN
  -- We check auth.users directly to see if the email is registered
  RETURN EXISTS (SELECT 1 FROM auth.users WHERE email = lookup_email);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
