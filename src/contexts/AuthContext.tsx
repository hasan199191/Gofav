import React, { createContext, useContext, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../utils/supabase';
import { useAuthStore } from '../store/authStore';

interface AuthContextType {
  login: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const { setUser, logout: clearUser } = useAuthStore();

  useEffect(() => {
    const initAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          // Get user profile from Supabase
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('user_id', session.user.id)
            .single();

          if (profile) {
            setUser({
              id: profile.id,
              email: session.user.email,
              twitterId: profile.twitter_id,
              twitterHandle: profile.twitter_username,
              twitterName: profile.twitter_name,
              twitterProfileImage: profile.twitter_profile_image,
              totalPoints: profile.total_points,
              isProjectOwner: false,
            });
          }
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      }
    };

    initAuth();
  }, [setUser]);

  const login = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'twitter',
        options: {
          redirectTo: `${window.location.origin}/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent'
          }
        }
      });

      if (error) {
        console.error('Login error:', error);
      }
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      clearUser();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}