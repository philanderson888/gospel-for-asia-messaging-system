/*
  # Add Bridge of Hope Center fields

  1. Changes
    - Add `bridge_of_hope_name` column (text, nullable) to authenticated_users table
    - Add `bridge_of_hope_id` column (text, nullable) to authenticated_users table
    - Add constraint to ensure bridge_of_hope_id is numeric and max 8 digits

  2. Notes
    - Fields are optional for initial registration
    - bridge_of_hope_id will be required for sending messages
*/

DO $$
BEGIN
  -- Add bridge_of_hope_name column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'authenticated_users' AND column_name = 'bridge_of_hope_name'
  ) THEN
    ALTER TABLE authenticated_users ADD COLUMN bridge_of_hope_name text;
  END IF;

  -- Add bridge_of_hope_id column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'authenticated_users' AND column_name = 'bridge_of_hope_id'
  ) THEN
    ALTER TABLE authenticated_users ADD COLUMN bridge_of_hope_id text;
  END IF;

  -- Add constraint for bridge_of_hope_id format
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'bridge_of_hope_id_format'
  ) THEN
    ALTER TABLE authenticated_users
    ADD CONSTRAINT bridge_of_hope_id_format
    CHECK (bridge_of_hope_id IS NULL OR bridge_of_hope_id ~ '^[0-9]{1,8}$');
  END IF;
END $$;