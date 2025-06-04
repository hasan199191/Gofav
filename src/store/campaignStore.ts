import { create } from 'zustand';
import { Campaign } from '../types';

interface CampaignStore {
  campaign: Campaign;
}

const defaultCampaign: Campaign = {
  id: '1',
  projectId: 'algorand',
  projectName: 'Algorand',
  projectLogo: 'https://images.pexels.com/photos/8370752/pexels-photo-8370752.jpeg',
  title: 'Algorand Content Creation Campaign',
  description: 'Create quality content about Algorand on Twitter. Top 100 participants will share the reward pool based on their ranking.',
  startDate: '2025-06-15T00:00:00Z',
  endDate: '2025-07-15T23:59:59Z',
  rewardPool: 100000,
  status: 'active',
  participantCount: 0,
  requiredHashtags: ['Algorand']
};

export const useCampaignStore = create<CampaignStore>(() => ({
  campaign: defaultCampaign
}));