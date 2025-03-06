/*
  # Add sponsor and child ID fields

  1. Changes
    - Add sponsor_id and child_id columns to authenticated_users table
    - Add check constraints to ensure IDs are numeric only
    - Add indexes for performance

  2. Notes
    - sponsor_id and child_id are only required for sponsor users
    - Both fields must contain only numeric characters
*/

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'authenticated_users' AND column_name = 'sponsor_id'
  ) THEN
    ALTER TABLE authenticated_users 
    ADD COLUMN sponsor_id text,
    ADD COLUMN child_id text,
    ADD CONSTRAINT sponsor_id_numeric CHECK (sponsor_id ~ '^[0-9]*$'),
    ADD CONSTRAINT child_id_numeric CHECK (child_id ~ '^[0-9]*$');
  END IF;
END $$;

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_sponsor_id ON authenticated_users(sponsor_id);
CREATE INDEX IF NOT EXISTS idx_child_id ON authenticated_users(child_id);