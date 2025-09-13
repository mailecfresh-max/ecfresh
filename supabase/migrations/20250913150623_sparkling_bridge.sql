/*
  # Fix infinite recursion in users RLS policy

  1. Security Changes
    - Drop the problematic "Admins can read all users" policy that causes infinite recursion
    - Create a new admin policy that uses auth.jwt() to check admin status without querying users table
    - Keep existing user policies intact

  2. Notes
    - The original policy queried the users table within a policy ON the users table, causing recursion
    - New policy uses JWT claims which are evaluated without database queries
    - Admin users will need to have is_admin=true in their user record and the JWT will contain this info
*/

-- Drop the problematic policy that causes infinite recursion
DROP POLICY IF EXISTS "Admins can read all users" ON users;

-- Create a new admin policy that doesn't cause recursion
-- This policy checks if the user's JWT contains admin privileges
-- Note: This requires that admin status is properly set in the JWT claims
CREATE POLICY "Admins can read all users" ON users
  FOR SELECT
  TO authenticated
  USING (
    -- Check if current user has admin privileges without querying users table
    (auth.jwt() ->> 'is_admin')::boolean = true
    OR
    -- Fallback: allow if the record belongs to the current user
    auth.uid() = id
  );

-- Ensure the policy allows admins to update user data as well
DROP POLICY IF EXISTS "Admins can update all users" ON users;

CREATE POLICY "Admins can update all users" ON users
  FOR UPDATE
  TO authenticated
  USING (
    (auth.jwt() ->> 'is_admin')::boolean = true
    OR
    auth.uid() = id
  );