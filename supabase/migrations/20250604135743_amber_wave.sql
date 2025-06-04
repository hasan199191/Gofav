/*
  # Create tweet analysis tables and functions

  1. New Tables
    - tweet_analysis
      - id (uuid, primary key)
      - tweet_id (references tweets)
      - relevance_score (integer)
      - quality_score (integer)
      - originality_score (integer)
      - engagement_score (integer)
      - total_score (integer)
      - analyzed_at (timestamp)

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

-- Function to calculate points from analysis
CREATE OR REPLACE FUNCTION calculate_tweet_points(
  relevance integer,
  quality integer,
  originality integer,
  engagement integer
)
RETURNS integer
LANGUAGE plpgsql
AS $$
DECLARE
  total_score integer;
BEGIN
  -- Calculate weighted score
  total_score := (
    (relevance * 0.4) +    -- 40% weight for relevance
    (quality * 0.3) +      -- 30% weight for quality
    (originality * 0.2) +  -- 20% weight for originality
    (engagement * 0.1)     -- 10% weight for engagement
  )::integer;
  
  RETURN total_score;
END;
$$;