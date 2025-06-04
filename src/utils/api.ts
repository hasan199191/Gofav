import axios from 'axios';
import { ApiResponse } from '../types';
import { supabase } from './supabase';

// Create an axios instance with default config
const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Generic API functions
export async function fetchData<T>(endpoint: string): Promise<ApiResponse<T>> {
  try {
    const { data, error } = await supabase
      .from(endpoint)
      .select('*');

    if (error) throw error;

    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error(`Error fetching ${endpoint}:`, error);
    return {
      success: false,
      error: 'An error occurred while fetching data',
    };
  }
}

export async function postData<T, R = T>(
  endpoint: string,
  data: T
): Promise<ApiResponse<R>> {
  try {
    const { data: responseData, error } = await supabase
      .from(endpoint)
      .insert(data)
      .select()
      .single();

    if (error) throw error;

    return {
      success: true,
      data: responseData as R,
    };
  } catch (error) {
    console.error(`Error posting to ${endpoint}:`, error);
    return {
      success: false,
      error: 'An error occurred while saving data',
    };
  }
}

export async function updateData<T, R = T>(
  endpoint: string,
  data: Partial<T>
): Promise<ApiResponse<R>> {
  try {
    const { data: responseData, error } = await supabase
      .from(endpoint)
      .update(data)
      .select()
      .single();

    if (error) throw error;

    return {
      success: true,
      data: responseData as R,
    };
  } catch (error) {
    console.error(`Error updating ${endpoint}:`, error);
    return {
      success: false,
      error: 'An error occurred while updating data',
    };
  }
}

// Specific API endpoints
export const authApi = {
  getProfile: async () => {
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError) throw sessionError;

    if (!session?.user) {
      return { success: false, error: 'No active session' };
    }

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', session.user.id)
      .single();

    if (profileError) {
      return { success: false, error: profileError.message };
    }

    return { success: true, data: profile };
  },
  logout: async () => {
    const { error } = await supabase.auth.signOut();
    return { success: !error, error: error?.message };
  },
};

export const campaignsApi = {
  getAll: () => fetchData('campaigns'),
  getById: async (id: string) => {
    try {
      const { data, error } = await supabase
        .from('campaigns')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      return {
        success: true,
        data,
      };
    } catch (error) {
      console.error(`Error fetching campaign ${id}:`, error);
      return {
        success: false,
        error: 'An error occurred while fetching the campaign',
      };
    }
  },
  participate: (campaignId: string, tweetContent: string) => 
    postData(`campaigns/${campaignId}/participate`, { tweetContent }),
};

export const profileApi = {
  getUserProfile: () => fetchData('profiles'),
  connectWallet: (address: string) => 
    updateData('profiles', { wallet_address: address }),
  getParticipations: () => fetchData('tweets'),
  getTokenBalance: () => fetchData('token_balances'),
};

export const projectApi = {
  getDashboard: () => fetchData('project/dashboard'),
  createCampaign: (campaignData: any) => 
    postData('campaigns', campaignData),
  updateCampaign: (id: string, campaignData: any) => 
    updateData(`campaigns/${id}`, campaignData),
};

export const leaderboardApi = {
  getTopUsers: (limit = 500) => fetchData(`profiles?order=total_points.desc&limit=${limit}`),
};

export default api;