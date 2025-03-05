/*
  # Remove security from pending table

  1. Changes
    - Disable Row Level Security on pending table
    - Drop all existing policies
  
  2. Security
    - Temporarily removes all RLS restrictions for development
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Users can create their own pending requests" ON pending;
DROP POLICY IF EXISTS "Users can read their own pending requests" ON pending;
DROP POLICY IF EXISTS "Administrators can manage pending requests" ON pending;

-- Disable RLS on the pending table
ALTER TABLE pending DISABLE ROW LEVEL SECURITY;