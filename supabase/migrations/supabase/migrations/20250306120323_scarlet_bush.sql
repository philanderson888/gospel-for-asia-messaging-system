/*
  # Add role and approval fields to authenticated_users table

  1. Changes
    - Add role boolean fields:
      - `is_administrator` (boolean, default false)
      - `is_missionary` (boolean, default false)
      - `is_sponsor` (boolean, default false)
    - Add approval tracking fields:
      - `approved` (boolean, default null)
      - `approved_by` (uuid, default null)
      - `approved_date_time` (timestamptz, default null)

  2. Notes
    - All new boolean fields default to false for roles
    - Approval fields are nullable to track pending status
    - approved_by references the user who approved the request
*/

-- Add role boolean fields
ALTER TABLE authenticated_users 
ADD COLUMN IF NOT EXISTS is_administrator boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS is_missionary boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS is_sponsor boolean DEFAULT false;

-- Add approval tracking fields
ALTER TABLE authenticated_users 
ADD COLUMN IF NOT EXISTS approved boolean DEFAULT NULL,
ADD COLUMN IF NOT EXISTS approved_by uuid DEFAULT NULL,
ADD COLUMN IF NOT EXISTS approved_date_time timestamptz DEFAULT NULL;

-- Add foreign key constraint for approved_by
ALTER TABLE authenticated_users
ADD CONSTRAINT fk_approved_by
FOREIGN KEY (approved_by) 
REFERENCES authenticated_users(id)
ON DELETE SET NULL;