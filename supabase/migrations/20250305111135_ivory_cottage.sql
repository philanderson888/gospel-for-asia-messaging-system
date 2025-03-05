/*
  # Create administrators table with proper permissions

  1. New Tables
    - `administrators`
      - `id` (uuid, primary key, references auth.users)
      - `email` (text, unique)
      - `created_at` (timestamptz, default now())

  2. Security
    - Enable RLS
    - Grant necessary permissions to authenticated users
    - Add policies for:
      - Select: Allow authenticated users to view administrators
      - Insert: Allow first admin creation or existing admins to add new admins
      - Delete: Allow admins to remove other admins (but not themselves)
*/

-- Drop existing table if it exists
DROP TABLE IF EXISTS administrators;

-- Create administrators table
CREATE TABLE administrators (
  id uuid PRIMARY KEY REFERENCES auth.users(id),
  email text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE administrators ENABLE ROW LEVEL SECURITY;

-- Grant necessary permissions to authenticated users
GRANT SELECT, INSERT, DELETE ON administrators TO authenticated;

-- Create policies
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