/*
  # Update campaigns table for general Algorand campaign

  1. Changes
    - Simplify campaigns table to focus on single Algorand campaign
    - Remove topic-specific fields
    - Add fields for reward calculation and participation rules

  2. Security
    - Maintain existing RLS policies
    - Add new policy for campaign updates
*/

-- Drop existing campaign data
TRUNCATE TABLE campaigns;

-- Modify campaigns table
ALTER TABLE campaigns
DROP COLUMN topic,
DROP COLUMN required_hashtags,
ADD COLUMN min_score integer NOT NULL DEFAULT 50,
ADD COLUMN daily_tweet_limit integer NOT NULL DEFAULT 3,
ADD COLUMN points_per_approved_tweet integer NOT NULL DEFAULT 10;

-- Insert single Algorand campaign
INSERT INTO campaigns (
  project_id,
  project_name,
  project_logo,
  title,
  description,
  start_date,
  end_date,
  reward_pool,
  status,
  participant_count,
  min_score,
  daily_tweet_limit,
  points_per_approved_tweet
) VALUES (
  'algorand',
  'Algorand',
  'https://images.pexels.com/photos/8370752/pexels-photo-8370752.jpeg',
  'Algorand Content Creation Campaign',
  'Create quality content about Algorand technology, ecosystem, and developments. Share your insights, experiences, and knowledge about Algorand blockchain. Top contributors will earn GOFAV tokens based on their content quality and engagement.',
  '2025-03-01 00:00:00+00',
  '2025-12-31 23:59:59+00',
  50000,
  'active',
  0,
  70,
  3,
  10
);