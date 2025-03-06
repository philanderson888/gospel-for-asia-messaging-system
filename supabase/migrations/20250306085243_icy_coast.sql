/*
  # Update pending table policies

  1. Changes
    - Enable RLS on pending table
    - Add policies to match administrators table security model
    - Allow authenticated users to view their own pending records
    - Allow administrators to view all pending records

  2. Security
    - Enable RLS
    - Add policies for:
      - Authenticated users to view their own records
      - Administrators to view all records
      - Authenticated users to insert records
*/

-- First, enable RLS if not already enabled
ALTER TABLE pending ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to ensure clean state
DROP POLICY IF EXISTS "Users can view their own pending records" ON pending;
DROP POLICY IF EXISTS "Administrators can view all pending records" ON pending;
DROP POLICY IF EXISTS "Allow authenticated users to insert pending requests" ON pending;
DROP POLICY IF EXISTS "Users can insert pending requests" ON pending;

-- Create new policies

-- Allow users to view their own pending records
CREATE POLICY "Users can view their own pending records"
ON pending
FOR SELECT
TO authenticated
USING (email = auth.jwt()->>'email');

-- Allow administrators to view all pending records
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

-- Allow authenticated users to insert pending requests
CREATE POLICY "Allow authenticated users to insert pending requests"
ON pending
FOR INSERT
TO authenticated
WITH CHECK (true);