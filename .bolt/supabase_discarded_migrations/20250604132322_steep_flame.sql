/*
  # Create Algorand Campaigns Table

  1. New Tables
    - campaigns
      - id (uuid, primary key)
      - project_id (text)
      - project_name (text)
      - project_logo (text)
      - title (text)
      - description (text)
      - topic (text)
      - start_date (timestamptz)
      - end_date (timestamptz)
      - reward_pool (integer)
      - required_hashtags (text[])
      - status (text)
      - participant_count (integer)
      - created_at (timestamptz)
      - updated_at (timestamptz)

  2. Security
    - Enable RLS
    - Add policies for public read access
    - Add policies for authenticated campaign creation
*/

-- Create campaigns table if it doesn't exist
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

-- Drop existing policies if they exist
DO $$ BEGIN
  DROP POLICY IF EXISTS "Allow public read access" ON campaigns;
  DROP POLICY IF EXISTS "Allow authenticated users to create campaigns" ON campaigns;
EXCEPTION
  WHEN undefined_object THEN
    NULL;
END $$;

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
DO $$ BEGIN
  CREATE OR REPLACE FUNCTION update_updated_at_column()
  RETURNS TRIGGER AS $$
  BEGIN
    NEW.updated_at = now();
    RETURN NEW;
  END;
  $$ language 'plpgsql';
EXCEPTION
  WHEN duplicate_function THEN NULL;
END $$;

DO $$ BEGIN
  DROP TRIGGER IF EXISTS update_campaigns_updated_at ON campaigns;
  CREATE TRIGGER update_campaigns_updated_at
    BEFORE UPDATE ON campaigns
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- Insert initial Algorand campaigns
INSERT INTO campaigns (
  project_id,
  project_name,
  project_logo,
  title,
  description,
  topic,
  start_date,
  end_date,
  reward_pool,
  required_hashtags,
  status,
  participant_count
) VALUES 
(
  'algorand',
  'Algorand',
  'https://images.pexels.com/photos/8370752/pexels-photo-8370752.jpeg',
  'State Proofs Explained',
  'Create engaging content explaining Algorand State Proofs and their importance for blockchain interoperability.',
  'Explain how Algorand State Proofs work and why they are crucial for secure cross-chain communication.',
  '2025-03-01 00:00:00+00',
  '2025-03-31 23:59:59+00',
  15000,
  ARRAY['Algorand', 'StateProofs', 'Blockchain', 'Interoperability'],
  'active',
  45
),
(
  'algorand',
  'Algorand',
  'https://images.pexels.com/photos/8370752/pexels-photo-8370752.jpeg',
  'Pure Proof of Stake',
  'Share insights about Algorand''s Pure Proof of Stake consensus and its benefits for sustainability.',
  'Create content highlighting how Pure Proof of Stake works and its advantages over other consensus mechanisms.',
  '2025-03-15 00:00:00+00',
  '2025-04-15 23:59:59+00',
  12000,
  ARRAY['Algorand', 'PPoS', 'GreenBlockchain', 'Sustainability'],
  'active',
  67
),
(
  'algorand',
  'Algorand',
  'https://images.pexels.com/photos/8370752/pexels-photo-8370752.jpeg',
  'Smart Contract Development',
  'Create tutorials and guides about developing smart contracts on Algorand using PyTeal or TEAL.',
  'Share your experience with Algorand smart contract development, focusing on best practices and unique features.',
  '2025-04-01 00:00:00+00',
  '2025-04-30 23:59:59+00',
  20000,
  ARRAY['Algorand', 'SmartContracts', 'PyTeal', 'TEAL'],
  'upcoming',
  0
),
(
  'algorand',
  'Algorand',
  'https://images.pexels.com/photos/8370752/pexels-photo-8370752.jpeg',
  'AVM 1.1 Features',
  'Explain the new features and improvements in Algorand Virtual Machine (AVM) 1.1.',
  'Create content about AVM 1.1 updates and how they enhance smart contract capabilities on Algorand.',
  '2025-03-10 00:00:00+00',
  '2025-04-10 23:59:59+00',
  18000,
  ARRAY['Algorand', 'AVM', 'SmartContracts', 'Blockchain'],
  'active',
  34
);