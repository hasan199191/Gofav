/*
  # Add daily tweet tracking

  1. New Tables
    - daily_tweet_counts
      - id (uuid, primary key)
      - profile_id (references profiles)
      - date (date)
      - tweet_count (integer)
      - points_earned (integer)

  2. Security
    - Enable RLS
    - Add policies for authenticated users
*/

-- Create daily tweet counts table
CREATE TABLE IF NOT EXISTS daily_tweet_counts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid REFERENCES profiles NOT NULL,
  date date NOT NULL DEFAULT CURRENT_DATE,
  tweet_count integer NOT NULL DEFAULT 0,
  points_earned integer NOT NULL DEFAULT 0,
  UNIQUE(profile_id, date)
);

-- Enable RLS
ALTER TABLE daily_tweet_counts ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can read own daily counts"
  ON daily_tweet_counts
  FOR SELECT
  TO authenticated
  USING (
    profile_id IN (
      SELECT id FROM profiles WHERE user_id = auth.uid()
    )
  );

-- Function to check daily limit
CREATE OR REPLACE FUNCTION check_daily_tweet_limit(
  p_profile_id uuid
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  daily_limit integer;
  current_count integer;
BEGIN
  -- Get daily limit from active campaign
  SELECT daily_tweet_limit INTO daily_limit
  FROM campaigns
  WHERE status = 'active'
  LIMIT 1;

  -- Get current count for today
  SELECT tweet_count INTO current_count
  FROM daily_tweet_counts
  WHERE profile_id = p_profile_id
  AND date = CURRENT_DATE;

  -- Return true if under limit
  RETURN COALESCE(current_count, 0) < COALESCE(daily_limit, 3);
END;
$$;