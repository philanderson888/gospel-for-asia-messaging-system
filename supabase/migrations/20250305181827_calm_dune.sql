/*
  # Add RLS policies for pending table

  1. Security Changes
    - Enable RLS on pending table
    - Add policies to allow:
      - Authenticated users to insert their own records
      - Administrators to view all pending records
*/

-- Enable RLS
ALTER TABLE pending ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to insert their own records
CREATE POLICY "Users can insert their own pending requests"
  ON pending
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid()::text = id::text);

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
  USING (auth.uid()::text = id::text);