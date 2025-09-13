/*
  # Fix handle_new_user trigger function

  This migration fixes the trigger function that creates a user record in the public.users table
  when a new user signs up via Supabase Auth. The issue was that the trigger wasn't properly
  handling the email field which is required (NOT NULL) in the users table.

  1. Updates
    - Recreate the handle_new_user function to properly handle user creation
    - Ensure all required fields are populated from auth.users metadata
    - Add proper error handling

  2. Security
    - Maintains existing RLS policies
    - No changes to security model
*/

-- Drop the existing trigger first
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Recreate the handle_new_user function with proper error handling
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (id, email, name, phone, pin_code, loyalty_points, total_purchases, is_admin)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
    COALESCE(NEW.raw_user_meta_data->>'phone', ''),
    COALESCE(NEW.raw_user_meta_data->>'pin_code', ''),
    0,
    0,
    false
  );
  RETURN NEW;
EXCEPTION
  WHEN others THEN
    -- Log the error but don't fail the auth process
    RAISE LOG 'Error creating user profile for %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();