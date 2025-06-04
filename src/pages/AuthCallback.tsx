import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '../utils/supabase';
import { useAuthStore } from '../store/authStore';

const AuthCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { setUser } = useAuthStore();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Get the code from URL
        const code = searchParams.get('code');
        
        if (!code) {
          throw new Error('No code provided');
        }

        // Exchange code for session
        const { data: { session }, error } = await supabase.auth.exchangeCodeForSession(code);

        if (error || !session) {
          throw error || new Error('No session found');
        }

        // Get user profile
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
          navigate('/profile');
        } else {
          navigate('/login');
        }
      } catch (error) {
        console.error('Auth callback error:', error);
        navigate('/login');
      }
    };

    handleCallback();
  }, [navigate, searchParams, setUser]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-pulse text-primary-500">
        Completing authentication...
      </div>
    </div>
  );
};

export default AuthCallback;