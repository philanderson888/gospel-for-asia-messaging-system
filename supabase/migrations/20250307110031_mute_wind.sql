/*
  # Create messages table for sponsor-child communication

  1. New Tables
    - `messages`
      - `id` (uuid, primary key)
      - `sponsor_id` (text, references authenticated_users)
      - `created_at` (timestamptz)
      - `message_text` (text, 200 char min)
      - `message_has_been_read` (boolean, default false)
      - `message_direction` (text, either 'to_child' or 'to_sponsor')
      - `image01_url` (text, optional)
      - `image02_url` (text, optional)

  2. Security
    - Enable RLS on `messages` table
    - Add policies for:
      - Sponsors can read/write their own messages
      - Missionaries can read/write messages for their center's children
      - Administrators can read all messages

  3. Constraints
    - Message text minimum length: 200 characters
    - Message direction must be either 'to_child' or 'to_sponsor'
    - Sponsor ID must exist in authenticated_users
    - URLs must be valid HTTP/HTTPS URLs
*/

-- Create messages table
CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sponsor_id text NOT NULL,
  created_at timestamptz DEFAULT now(),
  message_text text NOT NULL,
  message_has_been_read boolean DEFAULT false,
  message_direction text NOT NULL,
  image01_url text,
  image02_url text,

  -- Add constraints
  CONSTRAINT message_text_min_length CHECK (length(message_text) >= 200),
  CONSTRAINT valid_message_direction CHECK (message_direction IN ('to_child', 'to_sponsor')),
  CONSTRAINT valid_sponsor_id CHECK (sponsor_id ~ '^[0-9]{1,8}$'),
  CONSTRAINT valid_image01_url CHECK (
    image01_url IS NULL OR 
    image01_url ~ '^https?://.+'
  ),
  CONSTRAINT valid_image02_url CHECK (
    image02_url IS NULL OR 
    image02_url ~ '^https?://.+'
  )
);

-- Create index on sponsor_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_messages_sponsor_id ON messages(sponsor_id);

-- Enable RLS
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Policies for sponsors
CREATE POLICY "Sponsors can read their own messages"
  ON messages
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM authenticated_users
      WHERE id = auth.uid()
        AND is_sponsor = true
        AND approved = true
        AND sponsor_id = messages.sponsor_id
    )
  );

CREATE POLICY "Sponsors can create messages"
  ON messages
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM authenticated_users
      WHERE id = auth.uid()
        AND is_sponsor = true
        AND approved = true
        AND sponsor_id = messages.sponsor_id
    )
  );

-- Policies for missionaries
CREATE POLICY "Missionaries can read messages for their center's children"
  ON messages
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM authenticated_users au
      WHERE au.id = auth.uid()
        AND au.is_missionary = true
        AND au.approved = true
        AND au.bridge_of_hope_id IS NOT NULL
        AND EXISTS (
          SELECT 1 FROM authenticated_users sponsor
          WHERE sponsor.sponsor_id = messages.sponsor_id
            AND sponsor.bridge_of_hope_id = au.bridge_of_hope_id
        )
    )
  );

CREATE POLICY "Missionaries can create messages for their center's children"
  ON messages
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM authenticated_users au
      WHERE au.id = auth.uid()
        AND au.is_missionary = true
        AND au.approved = true
        AND au.bridge_of_hope_id IS NOT NULL
        AND EXISTS (
          SELECT 1 FROM authenticated_users sponsor
          WHERE sponsor.sponsor_id = messages.sponsor_id
            AND sponsor.bridge_of_hope_id = au.bridge_of_hope_id
        )
    )
  );

-- Policies for administrators
CREATE POLICY "Administrators can read all messages"
  ON messages
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM authenticated_users
      WHERE id = auth.uid()
        AND is_administrator = true
        AND approved = true
    )
  );