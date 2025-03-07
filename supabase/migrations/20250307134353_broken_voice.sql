/*
  # Add RLS policies for Bridge of Hope centers and children

  1. Security
    - Enable RLS on bridge_of_hope_centers table
    - Enable RLS on children table
    - Add policies for administrators to read all data
    - Add policies for missionaries to read their assigned center and children
    - Add policies for sponsors to read their sponsored child
*/

-- Bridge of Hope Centers RLS
ALTER TABLE bridge_of_hope_centers ENABLE ROW LEVEL SECURITY;

-- Administrators can read all centers
CREATE POLICY "Administrators can read all centers"
  ON bridge_of_hope_centers
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM authenticated_users
      WHERE authenticated_users.id = auth.uid()
        AND authenticated_users.is_administrator = true
        AND authenticated_users.approved = true
    )
  );

-- Missionaries can read their assigned center
CREATE POLICY "Missionaries can read their assigned center"
  ON bridge_of_hope_centers
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM authenticated_users
      WHERE authenticated_users.id = auth.uid()
        AND authenticated_users.is_missionary = true
        AND authenticated_users.approved = true
        AND authenticated_users.bridge_of_hope_id = bridge_of_hope_centers.center_id
    )
  );

-- Children RLS
ALTER TABLE children ENABLE ROW LEVEL SECURITY;

-- Administrators can read all children
CREATE POLICY "Administrators can read all children"
  ON children
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM authenticated_users
      WHERE authenticated_users.id = auth.uid()
        AND authenticated_users.is_administrator = true
        AND authenticated_users.approved = true
    )
  );

-- Missionaries can read children in their center
CREATE POLICY "Missionaries can read children in their center"
  ON children
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM authenticated_users
      WHERE authenticated_users.id = auth.uid()
        AND authenticated_users.is_missionary = true
        AND authenticated_users.approved = true
        AND authenticated_users.bridge_of_hope_id = children.bridge_of_hope_center_id
    )
  );

-- Sponsors can read their sponsored child
CREATE POLICY "Sponsors can read their sponsored child"
  ON children
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM authenticated_users
      WHERE authenticated_users.id = auth.uid()
        AND authenticated_users.is_sponsor = true
        AND authenticated_users.approved = true
        AND authenticated_users.sponsor_id = children.sponsor_id
    )
  );