/*
  # Cleanup unused tables

  1. Changes
    - Drop unused tables that are now handled via local storage
    - Keep only the authenticated_users table which is actively used
    - Remove tables:
      - bridge_of_hope_centers
      - authorised_users
      - children
      - messages
      - pending
      - test_items
      - test_2

  2. Notes
    - This is a cleanup migration to remove tables that are now handled via local storage
    - The authenticated_users table remains as the only active table
*/

-- Drop unused tables
DROP TABLE IF EXISTS bridge_of_hope_centers CASCADE;
DROP TABLE IF EXISTS authorised_users CASCADE;
DROP TABLE IF EXISTS children CASCADE;
DROP TABLE IF EXISTS messages CASCADE;
DROP TABLE IF EXISTS pending CASCADE;
DROP TABLE IF EXISTS test_items CASCADE;
DROP TABLE IF EXISTS test_2 CASCADE;