/*
  # Create pending table for user role requests

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
    - Add policy for authenticated users to insert their own requests
    - Add policy for administrators to manage all pending requests
*/

-- Create the pending table
CREATE TABLE IF NOT EXISTS pending (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now(),
  administrator boolean DEFAULT false,
  missionary boolean DEFAULT false,
  sponsor boolean DEFAULT false
);

-- Enable Row Level Security
ALTER TABLE pending ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to insert their own pending requests
CREATE POLICY "Users can create their own pending requests"
  ON pending
  FOR INSERT
  TO authenticated
  WITH CHECK (
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