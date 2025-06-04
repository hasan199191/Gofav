/*
  # Set up automated tweet analysis system

  1. New Tables
    - tweet_analysis
      - id (uuid, primary key)
      - tweet_id (uuid, references tweets)
      - relevance_score (integer)
      - quality_score (integer)
      - originality_score (integer)
      - engagement_score (integer)
      - total_score (integer)
      - analyzed_at (timestamptz)

    - daily_tweet_counts
      - id (uuid, primary key)
      - profile_id (uuid, references profiles)
      - date (date)
      - tweet_count (integer)
      - points_earned (integer)

  2. Security
    - Enable RLS
    - Add policies for authenticated users
*/

-- Create tweet analysis table
CREATE TABLE IF NOT EXISTS tweet_analysis (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tweet_id uuid REFERENCES tweets NOT NULL,
  relevance_score integer NOT NULL DEFAULT 0,
  quality_score integer NOT NULL DEFAULT 0,
  originality_score integer NOT NULL DEFAULT 0,
  engagement_score integer NOT NULL DEFAULT 0,
  total_score integer NOT NULL DEFAULT 0,
  analyzed_at timestamptz DEFAULT now(),
  UNIQUE(tweet_id)
);

-- Enable RLS
ALTER TABLE tweet_analysis ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can read own tweet analysis"
  ON tweet_analysis
  FOR SELECT
  TO authenticated
  USING (
    tweet_id IN (
      SELECT t.id FROM tweets t
      JOIN profiles p ON t.profile_id = p.id
      WHERE p.user_id = auth.uid()
    )
  );

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

-- Function to analyze tweet text
CREATE OR REPLACE FUNCTION analyze_tweet_text(tweet_text text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  result jsonb;
BEGIN
  -- Check for Algorand keywords
  IF tweet_text ~* 'algorand|@algorand|#algorand' THEN
    result = jsonb_build_object(
      'relevance_score', 80,
      'quality_score', 70,
      'originality_score', 60,
      'engagement_score', 50,
      'total_score', 65
    );
  ELSE
    result = jsonb_build_object(
      'relevance_score', 0,
      'quality_score', 0,
      'originality_score', 0,
      'engagement_score', 0,
      'total_score', 0
    );
  END IF;

  RETURN result;
END;
$$;