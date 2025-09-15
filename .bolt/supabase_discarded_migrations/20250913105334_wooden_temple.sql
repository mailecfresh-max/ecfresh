/*
  # Add Password Authentication Support

  1. Updates
    - Insert admin user with proper credentials
    - Enable email/password authentication

  2. Security
    - Maintains existing RLS policies
    - Adds admin user with specified credentials
*/

-- Insert or update admin user with proper credentials
INSERT INTO auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  role
) VALUES (
  gen_random_uuid(),
  '00000000-0000-0000-0000-000000000000',
  'mail.ecfresh@gmail.com',
  crypt('Signin@66', gen_salt('bf')),
  now(),
  now(),
  now(),
  '{"provider": "email", "providers": ["email"]}',
  '{"name": "Admin User"}',
  false,
  'authenticated'
) ON CONFLICT (email) DO UPDATE SET
  encrypted_password = crypt('Signin@66', gen_salt('bf')),
  updated_at = now();

-- Ensure the admin user exists in the public.users table
INSERT INTO public.users (email, name, is_admin, loyalty_points, total_purchases)
VALUES ('mail.ecfresh@gmail.com', 'Admin User', true, 0, 0)
ON CONFLICT (email) DO UPDATE SET
  is_admin = true,
  name = 'Admin User';