/*
  # Update functions with secure search_path

  This migration updates existing functions to use a secure search_path
  and proper security settings.
*/

-- Update handle_new_user function with secure search_path
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY definer
SET search_path = public
AS $$
DECLARE
  twitter_metadata json;
BEGIN
  -- Extract Twitter metadata
  twitter_metadata := NEW.raw_user_meta_data;

  -- Create profile for new user
  INSERT INTO public.profiles (
    user_id,
    twitter_id,
    twitter_username,
    twitter_name,
    twitter_profile_image,
    total_points
  ) VALUES (
    NEW.id,
    twitter_metadata->>'provider_id',
    twitter_metadata->>'preferred_username',
    twitter_metadata->>'full_name',
    twitter_metadata->>'picture',
    0
  );

  RETURN NEW;
END;
$$;

-- Update update_profile function with secure search_path
CREATE OR REPLACE FUNCTION public.update_profile(
  twitter_username text,
  twitter_name text,
  twitter_profile_image text
)
RETURNS profiles
LANGUAGE plpgsql
SECURITY definer
SET search_path = public
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

-- Update increment_points function with secure search_path
CREATE OR REPLACE FUNCTION public.increment_points(
  points_to_add integer
)
RETURNS profiles
LANGUAGE plpgsql
SECURITY definer
SET search_path = public
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

-- Update updated_at trigger function with secure search_path
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SECURITY definer
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;