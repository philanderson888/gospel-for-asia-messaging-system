/*
  # Create pending registrations table

  1. New Tables
    - `pending`
      - `id` (uuid, primary key)
      - `email` (text, unique)
      - `created_at` (timestamp)
      - `administrator` (boolean)
      - `missionary` (boolean)
      - `sponsor` (boolean)
  
  2. Security
    - Enable RLS on `pending` table
    - Add policy for authenticated administrators to read and manage pending requests
*/

CREATE TABLE IF NOT EXISTS pending (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now(),
  administrator boolean DEFAULT false,
  missionary boolean DEFAULT false,
  sponsor boolean DEFAULT false
);

ALTER TABLE pending ENABLE ROW LEVEL SECURITY;

-- Allow administrators to read pending requests
CREATE POLICY "Administrators can read pending requests"
  ON pending
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM administrators 
      WHERE administrators.id = auth.uid()
    )
  );

-- Allow administrators to manage pending requests
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