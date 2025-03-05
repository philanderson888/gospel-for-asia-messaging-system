/*
  # Fix Administrator Table Permissions

  1. Changes
    - Drop existing policies
    - Add new, properly scoped policies for administrators table
    - Enable RLS on administrators table

  2. Security
    - Enable RLS
    - Add policies for:
      - Select: Allow authenticated users to view administrators
      - Insert: Allow first admin creation or existing admins to add new admins
      - Delete: Allow admins to remove other admins (but not themselves)
*/

-- Enable RLS
ALTER TABLE administrators ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Anyone can view administrators" ON administrators;
DROP POLICY IF EXISTS "Only administrators can delete" ON administrators;
DROP POLICY IF EXISTS "Only administrators can insert" ON administrators;

-- Create new policies
CREATE POLICY "Allow viewing administrators"
  ON administrators
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow first admin or existing admins to insert"
  ON administrators
  FOR INSERT
  TO authenticated
  WITH CHECK (
    -- Allow if no administrators exist (first admin)
    (NOT EXISTS (SELECT 1 FROM administrators))
    OR
    -- Or if the user is already an administrator
    (EXISTS (
      SELECT 1 FROM administrators 
      WHERE id = auth.uid()
    ))
  );

CREATE POLICY "Allow admins to delete other admins"
  ON administrators
  FOR DELETE
  TO authenticated
  USING (
    -- User must be an admin
    EXISTS (
      SELECT 1 FROM administrators 
      WHERE id = auth.uid()
    )
    AND
    -- Cannot delete themselves
    id != auth.uid()
  );