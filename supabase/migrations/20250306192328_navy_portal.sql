/*
  # Update ID length constraints

  1. Changes
    - Add length constraints for sponsor_id and child_id
    - sponsor_id must be 1-8 digits
    - child_id must be 1-10 digits
    - Maintain existing numeric-only constraints

  2. Notes
    - Using CHECK constraints to enforce both numeric and length requirements
    - Allows for IDs shorter than the maximum length for flexibility
    - Maintains existing data integrity
*/

ALTER TABLE authenticated_users
  DROP CONSTRAINT IF EXISTS sponsor_id_numeric,
  DROP CONSTRAINT IF EXISTS child_id_numeric,
  ADD CONSTRAINT sponsor_id_format CHECK (sponsor_id ~ '^[0-9]{1,8}$'),
  ADD CONSTRAINT child_id_format CHECK (child_id ~ '^[0-9]{1,10}$');