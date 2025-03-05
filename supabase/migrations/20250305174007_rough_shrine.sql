/*
  # Update pending table permissions

  1. Changes
    - Add policy to allow authenticated users to insert their own pending requests
    - Keep existing policies for administrator management

  2. Security
    - Users can only insert records with their own email
    - Maintains existing administrator access policies
*/

-- Allow any authenticated user to insert their own pending request
CREATE POLICY "Users can create their own pending requests"
  ON pending
  FOR INSERT
  TO authenticated
  WITH CHECK (
    -- User can only insert a record with their own email
    email = auth.current_user()->>'email'
  );

-- Ensure the policy for administrators to manage pending requests exists
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'pending' 
    AND policyname = 'Administrators can manage pending requests'
  ) THEN
    CREATE POLICY "Administrators can manage pending requests"
      ON pending
      FOR ALL
      TO authenticated
      USING (
        EXISTS (
          SELECT 1 FROM administrators 
          WHERE administrators.id = auth.uid()
        )
      );
  END IF;
END $$;