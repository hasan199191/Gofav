/*
  # Create Campaigns Table

  1. New Tables
    - `campaigns`
      - `id` (uuid, primary key)
      - `project_id` (text)
      - `project_name` (text)
      - `project_logo` (text)
      - `title` (text)
      - `description` (text)
      - `topic` (text)
      - `start_date` (timestamptz)
      - `end_date` (timestamptz)
      - `reward_pool` (integer)
      - `required_hashtags` (text[])
      - `status` (text)
      - `participant_count` (integer)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `campaigns` table
    - Add policy for public read access
    - Add policy for authenticated users to create campaigns
*/

-- Create campaigns table
CREATE TABLE IF NOT EXISTS campaigns (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id text NOT NULL,
  project_name text NOT NULL,
  project_logo text NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  topic text NOT NULL,
  start_date timestamptz NOT NULL,
  end_date timestamptz NOT NULL,
  reward_pool integer NOT NULL DEFAULT 0,
  required_hashtags text[] NOT NULL DEFAULT '{}',
  status text NOT NULL DEFAULT 'upcoming',
  participant_count integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow public read access"
  ON campaigns
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow authenticated users to create campaigns"
  ON campaigns
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Create updated_at trigger
CREATE TRIGGER update_campaigns_updated_at
  BEFORE UPDATE ON campaigns
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();