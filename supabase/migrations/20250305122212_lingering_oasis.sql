/*
  # Add RLS policies for administrators table

  1. Security Changes
    - Enable RLS on administrators table if not already enabled
    - Add policies for:
      - Authenticated users to read administrators table
      - Existing administrators to manage other administrators
*/

-- Enable RLS
ALTER TABLE administrators ENABLE ROW LEVEL SECURITY;

-- Allow any authenticated user to read the administrators table
CREATE POLICY "Allow authenticated users to read administrators"
  ON administrators
  FOR SELECT
  TO authenticated
  USING (true);

-- Allow administrators to insert new administrators
CREATE POLICY "Allow administrators to insert new administrators"
  ON administrators
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM administrators
      WHERE id = auth.uid()
    ) OR
    NOT EXISTS (
      SELECT 1 FROM administrators
    )
  );

-- Allow administrators to delete other administrators (but not themselves)
CREATE POLICY "Allow administrators to delete other administrators"
  ON administrators
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM administrators
      WHERE id = auth.uid()
    ) AND
    id != auth.uid()
  );