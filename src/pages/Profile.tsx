import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Wallet, Twitter, Award, ArrowUpRight, ChevronRight, Clock } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useWallet } from '../contexts/WalletContext';
import Button from '../components/ui/Button';
import { Card, CardHeader, CardContent } from '../components/ui/Card';
import { supabase } from '../utils/supabase';
import { Tweet } from '../types';
import { formatDate, formatNumber, truncateAddress } from '../utils/format';
import WalletConnect from '../components/wallet/WalletConnect';

// Profil resim kalitesini artıran fonksiyon
const getHighQualityProfileImage = (imageUrl: string) => {
  if (!imageUrl) return imageUrl;
  
  // Twitter profil resmi ise kaliteyi artır
  if (imageUrl.includes('pbs.twimg.com/profile_images/')) {
    // _normal veya _bigger'ı kaldır ve yüksek kalite suffix ekle
    return imageUrl
      .replace('_normal.jpg', '_400x400.jpg')
      .replace('_bigger.jpg', '_400x400.jpg')
      .replace('_normal.png', '_400x400.png')
      .replace('_bigger.png', '_400x400.png');
  }
  
  return imageUrl;
};

const Profile = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { connected, address } = useWallet();
  const [userTweets, setUserTweets] = useState<Tweet[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user?.id) return;

      try {
        // Fetch user's tweets
        const { data: tweets, error: tweetsError } = await supabase
          .from('tweets')
          .select(`
            *,
            tweet_analysis (*)
          `)
          .eq('profile_id', user.id)
          .order('created_at', { ascending: false });

        if (tweetsError) throw tweetsError;

        setUserTweets(tweets || []);
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();

    // Subscribe to tweet changes
    const tweetsSubscription = supabase
      .channel('tweets_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'tweets',
          filter: `profile_id=eq.${user?.id}`,
        },
        fetchUserData
      )
      .subscribe();

    return () => {
      tweetsSubscription.unsubscribe();
    };
  }, [user?.id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-pulse text-primary-500">Loading profile data...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-10">
        <div className="text-error-500 mb-4">Please sign in to view your profile</div>
        <Link to="/login" className="text-primary-600 hover:underline">
          Sign In
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      {/* Profile Header */}
      <div className="bg-white rounded-lg shadow-soft p-6 mb-8">
        <div className="flex flex-col md:flex-row md:items-center">
          <div className="flex-shrink-0 mb-4 md:mb-0 md:mr-6">
            <img
              src={getHighQualityProfileImage(user.twitterProfileImage)}
              alt={user.twitterName}
              className="w-24 h-24 rounded-full object-cover"
            />
          </div>
          
          <div className="flex-grow">
            <h1 className="text-2xl font-bold text-neutral-900">
              {user.twitterName}
            </h1>
            <a
              href={`https://twitter.com/${user.twitterHandle}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-600 hover:underline flex items-center"
            >
              <Twitter className="w-4 h-4 mr-1" />
              @{user.twitterHandle}
            </a>
            
            <div className="mt-4 flex flex-wrap gap-4">
              <div className="bg-neutral-100 px-4 py-2 rounded-md">
                <p className="text-sm text-neutral-600">Total Score</p>
                <p className="text-lg font-bold text-neutral-900">{formatNumber(user.totalPoints ?? 0)}</p>
              </div>
            </div>
          </div>
          
          {/* Wallet Section */}
          <div className="mt-6 md:mt-0 md:ml-6 flex-shrink-0">
            {connected && address ? (
              <div className="bg-neutral-100 p-4 rounded-md">
                <div className="flex items-center mb-2">
                  <Wallet className="w-4 h-4 text-neutral-700 mr-2" />
                  <h3 className="text-sm font-medium text-neutral-700">Wallet</h3>
                </div>
                <p className="text-xs text-neutral-600 mb-1">
                  {truncateAddress(address, 6)}
                </p>
                <a
                  href={`https://explorer.perawallet.app/accounts/${address}/`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-primary-600 hover:underline flex items-center"
                >
                  View on Explorer
                  <ArrowUpRight className="w-3 h-3 ml-1" />
                </a>
              </div>
            ) : (
              <div>
                <p className="text-sm text-neutral-600 mb-2">Connect your Algorand wallet to receive rewards</p>
                <WalletConnect />
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Participation History */}
      <h2 className="text-xl font-bold text-neutral-900 mb-4">Participation History</h2>
      <div className="bg-white rounded-lg shadow-soft p-6">
        {userTweets.length > 0 ? (
          <div className="space-y-4">
            {userTweets.map((tweet) => (
              <Card key={tweet.id}>
                <CardHeader className="bg-neutral-50 p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <Link 
                        to={`/campaigns/${tweet.campaignId}`}
                        className="text-lg font-medium text-primary-600 hover:underline"
                      >
                        Campaign #{tweet.campaignId}
                        <ChevronRight className="w-4 h-4 inline ml-1" />
                      </Link>
                      <div className="flex items-center mt-1 text-sm text-neutral-500">
                        <Clock className="w-4 h-4 mr-1" />
                        {formatDate(tweet.createdAt)}
                      </div>
                    </div>
                    <div>
                      {tweet.status === 'pending' ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-neutral-100 text-neutral-800">
                          Pending Review
                        </span>
                      ) : tweet.status === 'approved' ? (
                        <div className="text-right">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-success-100 text-success-800 mb-1">
                            Approved
                          </span>
                          <p className="text-sm font-medium">Score: {tweet.score}/100</p>
                        </div>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-error-100 text-error-800">
                          Rejected
                        </span>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-neutral-800 mb-3">
                    {tweet.content}
                  </p>
                  <div className="flex justify-between items-center">
                    <a 
                      href={`https://twitter.com/user/status/${tweet.twitterId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-primary-600 hover:underline"
                    >
                      <Twitter className="w-4 h-4 mr-1" />
                      View on Twitter
                    </a>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-6">
            <p className="text-neutral-600 mb-4">You haven't participated in any campaigns yet.</p>
            <Button 
              onClick={() => navigate('/campaigns')}
              variant="outline"
            >
              Browse Campaigns
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;