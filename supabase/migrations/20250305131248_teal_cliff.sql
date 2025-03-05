/*
  # Fix Administrator Table Permissions

  1. Security Changes
    - Enable RLS on administrators table
    - Add policies for:
      - Authenticated users to read administrators
      - Administrators to manage other administrators
      - First user to become administrator when no administrators exist
*/

-- Enable RLS
ALTER TABLE administrators ENABLE ROW LEVEL SECURITY;

-- Allow any authenticated user to read administrators
CREATE POLICY "Anyone can view administrators" 
ON administrators
FOR SELECT 
TO authenticated 
USING (true);

-- Allow administrators to manage other administrators
CREATE POLICY "Administrators can manage other administrators"
ON administrators
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM administrators WHERE id = auth.uid()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM administrators WHERE id = auth.uid()
  )
);

-- Allow first user to become administrator when no administrators exist
CREATE POLICY "First user can become administrator"
ON administrators
FOR INSERT
TO authenticated
WITH CHECK (
  NOT EXISTS (
    SELECT 1 FROM administrators
  )
  AND id = auth.uid()
);