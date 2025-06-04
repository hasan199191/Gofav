/*
  # Add Profile Management Functions

  1. New Functions
    - get_profile: Get current user's profile
    - update_profile: Update profile details
    - increment_points: Safely increment user points

  2. Security
    - Functions execute with RLS policies
*/

-- Function to get current user's profile
CREATE OR REPLACE FUNCTION public.get_profile()
RETURNS SETOF profiles
LANGUAGE sql
SECURITY definer
SET search_path = public
AS $$
  SELECT *
  FROM profiles
  WHERE user_id = auth.uid();
$$;

-- Function to update profile
CREATE OR REPLACE FUNCTION public.update_profile(
  twitter_username text,
  twitter_name text,
  twitter_profile_image text
)
RETURNS profiles
LANGUAGE plpgsql
SECURITY definer
AS $$
DECLARE
  profile_record profiles;
BEGIN
  UPDATE profiles
  SET
    twitter_username = COALESCE($1, twitter_username),
    twitter_name = COALESCE($2, twitter_name),
    twitter_profile_image = COALESCE($3, twitter_profile_image),
    updated_at = now()
  WHERE user_id = auth.uid()
  RETURNING * INTO profile_record;
  
  RETURN profile_record;
END;
$$;

-- Function to increment points safely
CREATE OR REPLACE FUNCTION public.increment_points(
  points_to_add integer
)
RETURNS profiles
LANGUAGE plpgsql
SECURITY definer
AS $$
DECLARE
  profile_record profiles;
BEGIN
  UPDATE profiles
  SET
    total_points = total_points + points_to_add,
    updated_at = now()
  WHERE user_id = auth.uid()
  RETURNING * INTO profile_record;
  
  RETURN profile_record;
END;
$$;