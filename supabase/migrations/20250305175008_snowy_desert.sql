/*
  # Fix pending table policies

  1. Changes
    - Drop existing policies
    - Create new policies with correct permissions
    - Add policy for users to read their own pending requests
  
  2. Security
    - Users can create and read their own pending requests
    - Administrators can manage all pending requests
*/

-- First, drop existing policies to start fresh
DROP POLICY IF EXISTS "Users can create their own pending requests" ON pending;
DROP POLICY IF EXISTS "Administrators can manage pending requests" ON pending;

-- Allow users to insert their own pending requests
CREATE POLICY "Users can create their own pending requests"
  ON pending
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.jwt()->>'email' = email
  );

-- Allow users to read their own pending requests
CREATE POLICY "Users can read their own pending requests"
  ON pending
  FOR SELECT
  TO authenticated
  USING (
    auth.jwt()->>'email' = email
  );

-- Allow administrators to manage all pending requests
CREATE POLICY "Administrators can manage pending requests"
  ON pending
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM administrators
      WHERE administrators.id = auth.uid()
    )
  );