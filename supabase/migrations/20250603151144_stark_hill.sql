/*
  # Create tweets table for analysis

  1. New Tables
    - tweets
      - id (uuid, primary key)
      - profile_id (references profiles)
      - twitter_tweet_id (text)
      - content (text)
      - analysis_score (integer)
      - analysis_details (jsonb)
      - status (text)
      - created_at (timestamp)
      - analyzed_at (timestamp)

  2. Security
    - Enable RLS
    - Add policies for authenticated users
*/

-- Create tweets table
CREATE TABLE IF NOT EXISTS tweets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid REFERENCES profiles NOT NULL,
  twitter_tweet_id text NOT NULL,
  content text NOT NULL,
  analysis_score integer,
  analysis_details jsonb,
  status text DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  analyzed_at timestamptz,
  UNIQUE(twitter_tweet_id)
);

-- Enable RLS
ALTER TABLE tweets ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can read own tweets"
  ON tweets
  FOR SELECT
  TO authenticated
  USING (
    profile_id IN (
      SELECT id FROM profiles WHERE user_id = auth.uid()
    )
  );

-- Create index for faster lookups
CREATE INDEX tweets_profile_id_idx ON tweets(profile_id);
CREATE INDEX tweets_status_idx ON tweets(status);