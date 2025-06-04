// User and AuthState interfaces
export interface User {
  id: string;
  email: string | undefined;
  twitterId: string | null;
  twitterHandle: string | null;
  twitterName: string | null;
  twitterProfileImage: string | null;
  totalPoints: number;
  isProjectOwner: boolean;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

export interface Campaign {
  id: string;
  projectId: string;
  projectName: string;
  projectLogo: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  rewardPool: number;
  status: 'upcoming' | 'active' | 'completed';
  participantCount: number;
  minScore?: number;
  dailyTweetLimit?: number;
  pointsPerApprovedTweet?: number;
  requiredHashtags: string[];
}

export interface Tweet {
  id: string;
  campaignId: string;
  userId: string;
  twitterId: string;
  content: string;
  createdAt: string;
  score: number;
  scoreDetails: {
    relevance: number;
    originality: number;
    technicalAccuracy: number;
    isSpam: boolean;
  };
  status: 'pending' | 'approved' | 'rejected';
  rewardAmount: number;
  txId: string | null;
}

export interface TokenBalance {
  tokenId: number;
  symbol: string;
  name: string;
  balance: number;
  decimals: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}