/*
  # Enable public access to administrators table
  
  1. Changes
    - Grant public access to administrators table
    - Remove RLS to simplify access control
*/

-- Grant usage on schema
GRANT USAGE ON SCHEMA public TO anon, authenticated;

-- Grant access to administrators table
GRANT ALL ON public.administrators TO anon, authenticated;

-- Disable RLS on administrators table
ALTER TABLE public.administrators DISABLE ROW LEVEL SECURITY;