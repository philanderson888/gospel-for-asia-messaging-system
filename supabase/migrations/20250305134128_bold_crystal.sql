/*
  # Simplify Administrators Table
  
  Remove all RLS policies and restrictions to establish a stable foundation
*/

-- Disable RLS on administrators table
ALTER TABLE administrators DISABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Anyone can view administrators" ON administrators;
DROP POLICY IF EXISTS "Administrators can manage other administrators" ON administrators;
DROP POLICY IF EXISTS "First user can become administrator" ON administrators;
DROP POLICY IF EXISTS "Allow administrators to delete other administrators" ON administrators;
DROP POLICY IF EXISTS "Allow administrators to insert new administrators" ON administrators;
DROP POLICY IF EXISTS "Allow admins to delete other admins" ON administrators;
DROP POLICY IF EXISTS "Allow authenticated users to read administrators" ON administrators;
DROP POLICY IF EXISTS "Allow first admin or existing admins to insert" ON administrators;
DROP POLICY IF EXISTS "Allow viewing administrators" ON administrators;
DROP POLICY IF EXISTS "Users can read own data" ON administrators;