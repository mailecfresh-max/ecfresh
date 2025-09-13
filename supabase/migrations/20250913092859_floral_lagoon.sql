/*
  # Create Admin User

  1. New Tables
    - Creates an admin user with email admin@ecfresh.com
  2. Security
    - Sets is_admin to true for the admin user
*/

-- Insert admin user if not exists
INSERT INTO users (email, name, is_admin, loyalty_points, total_purchases)
VALUES ('admin@ecfresh.com', 'Admin User', true, 0, 0)
ON CONFLICT (email) DO UPDATE SET
  is_admin = true,
  name = 'Admin User';