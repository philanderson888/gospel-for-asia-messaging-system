/*
  # Basic Administrators Table Setup
  
  Creates a simple administrators table without RLS or complex policies
  for initial stable setup.
*/

-- Drop existing table if it exists
DROP TABLE IF EXISTS administrators;

-- Create administrators table
CREATE TABLE administrators (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS administrators_email_idx ON administrators(email);