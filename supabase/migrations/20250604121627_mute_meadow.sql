/*
  # Initial Database Setup

  1. New Tables
    - profiles
      - id (uuid, primary key)
      - user_id (uuid, references auth.users)
      - twitter_id (text)
      - twitter_username (text)
      - twitter_name (text)
      - twitter_profile_image (text)
      - total_points (integer)
      - created_at (timestamptz)
      - updated_at (timestamptz)
    
    - tweets
      - id (uuid, primary key)
      - profile_id (uuid, references profiles)
      - twitter_tweet_id (text)
      - content (text)
      - analysis_score (integer)
      - analysis_details (jsonb)
      - status (text)
      - created_at (timestamptz)
      - analyzed_at (timestamptz)

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users
*/

-- Drop existing tables if they exist
DROP TABLE IF EXISTS tweets;
DROP TABLE IF EXISTS profiles;

-- Create profiles table
CREATE TABLE profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  twitter_id text,
  twitter_username text,
  twitter_name text,
  twitter_profile_image text,
  total_points integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(twitter_id),
  UNIQUE(user_id)
);

-- Create tweets table
CREATE TABLE tweets (
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
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE tweets ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles
CREATE POLICY "Users can read own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create policies for tweets
CREATE POLICY "Users can read own tweets"
  ON tweets
  FOR SELECT
  TO authenticated
  USING (
    profile_id IN (
      SELECT id FROM profiles WHERE user_id = auth.uid()
    )
  );

-- Create indexes
CREATE INDEX tweets_profile_id_idx ON tweets(profile_id);
CREATE INDEX tweets_status_idx ON tweets(status);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for profiles
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE
  ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();