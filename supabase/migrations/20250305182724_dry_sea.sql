/*
  # Add RLS policies for pending table

  1. Changes
    - Enable RLS on pending table
    - Add policies to allow:
      - Authenticated users to insert their own records
      - Administrators to view all pending records
      - Users to view their own pending records

  2. Security
    - Ensures users can only insert and view their own records
    - Administrators can view all pending records
    - Maintains data privacy and access control
*/

-- Enable RLS
ALTER TABLE pending ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to insert records
CREATE POLICY "Users can insert pending requests"
ON pending
FOR INSERT
TO authenticated
WITH CHECK (true);

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

-- Allow users to view their own pending records
CREATE POLICY "Users can view their own pending records"
ON pending
FOR SELECT
TO authenticated
USING (
  email = auth.email()
);