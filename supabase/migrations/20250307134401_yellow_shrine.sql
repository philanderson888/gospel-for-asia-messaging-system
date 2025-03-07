/*
  # Add sample data for Bridge of Hope centers and children

  1. Sample Data
    - Add Bridge of Hope center with ID 57890123
    - Add child with ID 1234567891 linked to sponsor 12345678
*/

-- Insert Bridge of Hope center
INSERT INTO bridge_of_hope_centers (center_id, name)
VALUES ('57890123', 'Bridge of Hope Center 02')
ON CONFLICT (center_id) DO NOTHING;

-- Insert child
INSERT INTO children (child_id, name, date_of_birth, bridge_of_hope_center_id, sponsor_id)
VALUES (
  '1234567891',
  'John Smith',
  '2015-06-15',
  '57890123',
  '12345678'
)
ON CONFLICT (child_id) DO NOTHING;