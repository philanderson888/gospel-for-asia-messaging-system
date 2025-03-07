/*
  # Add Bridge of Hope Center support

  1. Changes
    - Add `is_bridge_of_hope` column to `authenticated_users` table
    - Set default value to false
    - Add check constraint to ensure at least one role is selected

  2. Security
    - No changes to RLS policies needed
*/

-- Add is_bridge_of_hope column with default value false
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'authenticated_users' AND column_name = 'is_bridge_of_hope'
  ) THEN
    ALTER TABLE authenticated_users ADD COLUMN is_bridge_of_hope boolean DEFAULT false;
  END IF;
END $$;

-- Add check constraint to ensure at least one role is selected
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.constraint_column_usage
    WHERE constraint_name = 'at_least_one_role'
  ) THEN
    ALTER TABLE authenticated_users
    ADD CONSTRAINT at_least_one_role
    CHECK (
      is_administrator = true OR 
      is_missionary = true OR 
      is_sponsor = true OR 
      is_bridge_of_hope = true
    );
  END IF;
END $$;