/*
  # Initial Schema Setup

  1. New Tables
    - `administrators`
      - `id` (uuid, primary key): References auth.users
      - `email` (text, unique): Administrator's email
      - `created_at` (timestamptz): When the administrator was added

  2. Security
    - Enable RLS on administrators table
    - Policies:
      - Anyone can view administrators list
      - Only existing administrators can add new administrators
      - Only existing administrators can remove administrators
*/

-- Create administrators table
CREATE TABLE IF NOT EXISTS administrators (
  id uuid PRIMARY KEY REFERENCES auth.users(id),
  email text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE administrators ENABLE ROW LEVEL SECURITY;

-- Policies for administrators table
CREATE POLICY "Anyone can view administrators"
  ON administrators
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Only administrators can insert"
  ON administrators
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM administrators a
      WHERE a.id = auth.uid()
    ) OR
    NOT EXISTS (
      SELECT 1 FROM administrators
    )
  );

CREATE POLICY "Only administrators can delete"
  ON administrators
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM administrators a
      WHERE a.id = auth.uid()
    )
  );