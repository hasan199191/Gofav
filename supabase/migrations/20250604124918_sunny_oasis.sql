-- Create function to handle user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
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
$$ language plpgsql security definer;

-- Create trigger for new user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();