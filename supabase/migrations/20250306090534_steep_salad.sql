/*
  # Create test table with sample data

  1. New Tables
    - `test_items`
      - `id` (integer, primary key)
      - `text` (text)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS
    - Add policy for authenticated users to read all records
*/

-- Create the test table
CREATE TABLE IF NOT EXISTS test_items (
  id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  text text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Insert some sample data
INSERT INTO test_items (text) VALUES
  ('some'),
  ('data'),
  ('here');

-- Enable RLS
ALTER TABLE test_items ENABLE ROW LEVEL SECURITY;

-- Create a simple policy that allows any authenticated user to read
CREATE POLICY "Authenticated users can read test items"
  ON test_items
  FOR SELECT
  TO authenticated
  USING (true);