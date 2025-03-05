/*
  # Fix RLS policies for pending table

  1. Security Changes
    - Drop existing policies
    - Enable RLS
    - Add new policies that:
      - Allow authenticated users to insert their own records
      - Allow administrators to view all records
      - Allow users to view their own records
*/

-- First, drop any existing policies
DROP POLICY IF EXISTS "Users can insert their own pending requests" ON pending;
DROP POLICY IF EXISTS "Administrators can view all pending records" ON pending;
DROP POLICY IF EXISTS "Users can view their own pending records" ON pending;

-- Enable RLS
ALTER TABLE pending ENABLE ROW LEVEL SECURITY;

-- Allow any authenticated user to insert records
CREATE POLICY "Allow authenticated users to insert pending requests"
  ON pending
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Allow administrators to view all records
CREATE POLICY "Administrators can view all pending records"
  ON pending
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM administrators 
      WHERE administrators.id = auth.uid()
    )
  );

-- Allow users to view their own records
CREATE POLICY "Users can view their own pending records"
  ON pending
  FOR SELECT
  TO authenticated
  USING (auth.uid()::text = id::text);