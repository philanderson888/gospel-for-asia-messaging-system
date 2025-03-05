/*
  # Set up pending table without RLS

  1. Changes
    - Drop existing pending table if it exists
    - Create new pending table without RLS
    - Remove all existing policies
  
  2. Security
    - No RLS restrictions for development
*/

-- Drop the existing table and its policies
DROP TABLE IF EXISTS pending CASCADE;

-- Create the pending table without RLS
CREATE TABLE pending (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now(),
  administrator boolean DEFAULT false,
  missionary boolean DEFAULT false,
  sponsor boolean DEFAULT false
);