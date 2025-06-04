import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  CalendarDays, 
  Users, 
  Award, 
  ArrowLeft, 
  Send, 
  AlertCircle,
  Twitter,
  CheckCircle
} from 'lucide-react';
import { campaignsApi } from '../utils/api';
import { Campaign, Tweet } from '../types';
import Button from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';
import { useAuth } from '../contexts/AuthContext';
import { useWallet } from '../contexts/WalletContext';
import { formatDate, formatNumber } from '../utils/format';
import { useToaster } from '../components/ui/Toaster';

const CampaignDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tweetContent, setTweetContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [userTweets, setUserTweets] = useState<Tweet[]>([]);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const { isAuthenticated, user } = useAuth();
  const { connected } = useWallet();
  const { addToast } = useToaster();

  useEffect(() => {
    const fetchCampaign = async () => {
      if (!id) return;
      
      try {
        const response = await campaignsApi.getById(id);
        if (response.success && response.data) {
          setCampaign(response.data as Campaign);
          
          // Fetch user's tweets for this campaign
          // This would normally come from the backend with the campaign data
          // Mock data for now
          if (isAuthenticated) {
            setUserTweets([
              {
                id: '1',
                campaignId: id,
                userId: user?.id || '',
                twitterId: '123456789',
                content: 'Just tried out the liquid governance feature on @FolksFinance. It\'s amazing how you can maintain governance rewards while still having access to your $ALGO! #AlgoFi #FolksFinance #Algorand',
                createdAt: '2023-11-10T14:23:10Z',
                score: 82,
                scoreDetails: {
                  relevance: 90,
                  originality: 75,
                  technicalAccuracy: 85,
                  isSpam: false,
                },
                status: 'approved',
                rewardAmount: 120,
                txId: '0x123456789abcdef',
              }
            ]);
          }
        } else {
          setError(response.error || 'Failed to fetch campaign details');
        }
      } catch (err) {
        setError('An error occurred while fetching campaign details');
      } finally {
        setLoading(false);
      }
    };

    fetchCampaign();

    // Mock data for demo purposes
    if (process.env.NODE_ENV === 'development' && id) {
      const mockCampaign: Campaign = {
        id: id,
        projectId: 'folks-finance',
        projectName: 'Folks Finance',
        projectLogo: 'https://pbs.twimg.com/profile_images/1473058887906037761/w1KMxSdR_400x400.jpg',
        title: 'Liquid Governance Explained',
        description: 'Create engaging content about Folks Finance Liquid Governance and how it benefits Algorand holders. Explain the technical aspects, benefits for users, and why it\'s an innovative solution for the Algorand ecosystem.',
        topic: 'Explain how Liquid Governance works on Folks Finance and its advantages over traditional governance. Focus on how users can maintain liquidity while participating in Algorand governance.',
        startDate: '2023-11-01T00:00:00Z',
        endDate: '2023-11-30T23:59:59Z',
        rewardPool: 10000,
        requiredHashtags: ['AlgoFi', 'FolksFinance', 'Algorand'],
        status: 'active',
        participantCount: 78
      };
      
      setCampaign(mockCampaign);
      setLoading(false);
    }
  }, [id, isAuthenticated, user?.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!connected) {
      addToast('Please connect your wallet first', 'warning');
      return;
    }
    
    if (!tweetContent.trim()) {
      addToast('Please enter tweet content', 'warning');
      return;
    }
    
    setSubmitting(true);
    
    try {
      // Check if all required hashtags are included
      const missingTags = campaign?.requiredHashtags?.filter(tag => 
        !tweetContent.toLowerCase().includes(`#${tag.toLowerCase()}`)
      );
      
      if (missingTags && missingTags.length > 0) {
        addToast(`Please include the following hashtags: ${missingTags.map(t => '#' + t).join(', ')}`, 'warning');
        setSubmitting(false);
        return;
      }
      
      // Submit tweet to backend
      if (id) {
        const response = await campaignsApi.participate(id, tweetContent);
        
        if (response.success) {
          setTweetContent('');
          setShowSuccessModal(true);
          // Refresh user tweets
          // In a real implementation, we'd fetch the updated tweets
          // For now, we'll just mock it
          setUserTweets([
            {
              id: Date.now().toString(),
              campaignId: id,
              userId: user?.id || '',
              twitterId: Date.now().toString(),
              content: tweetContent,
              createdAt: new Date().toISOString(),
              score: 0, // Pending score
              scoreDetails: {
                relevance: 0,
                originality: 0,
                technicalAccuracy: 0,
                isSpam: false,
              },
              status: 'pending',
              rewardAmount: 0,
              txId: null,
            },
            ...userTweets
          ]);
        } else {
          addToast(response.error || 'Failed to submit tweet', 'error');
        }
      }
    } catch (err) {
      console.error('Error submitting tweet:', err);
      addToast('An error occurred while submitting your tweet', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-pulse text-primary-500">Loading campaign details...</div>
      </div>
    );
  }

  if (error || !campaign) {
    return (
      <div className="text-center py-10">
        <div className="text-error-500 mb-4">Error: {error || 'Campaign not found'}</div>
        <Link to="/campaigns" className="text-primary-600 hover:underline">
          Return to campaigns
        </Link>
      </div>
    );
  }

  return (
    <div>
      {/* Back link */}
      <Link 
        to="/campaigns" 
        className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-6"
      >
        <ArrowLeft className="w-4 h-4 mr-1" />
        Back to campaigns
      </Link>
      
      {/* Campaign Header */}
      <div className="bg-white rounded-lg shadow-soft p-6 mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
          <img 
            src={campaign.projectLogo} 
            alt={campaign.projectName}
            className="w-16 h-16 rounded-full" 
          />
          <div>
            <h3 className="text-lg font-medium text-neutral-600">
              {campaign.projectName}
            </h3>
            <h1 className="text-3xl font-bold text-neutral-900">
              {campaign.title}
            </h1>
          </div>
        </div>
        
        <p className="text-neutral-700 mb-6">
          {campaign.description}
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-primary-50 p-4 rounded-lg">
            <div className="flex items-center text-primary-700 mb-2">
              <CalendarDays className="w-5 h-5 mr-2" />
              <h3 className="font-medium">Campaign Duration</h3>
            </div>
            <p className="text-neutral-700">
              {formatDate(campaign.startDate)} - {formatDate(campaign.endDate)}
            </p>
          </div>
          
          <div className="bg-primary-50 p-4 rounded-lg">
            <div className="flex items-center text-primary-700 mb-2">
              <Users className="w-5 h-5 mr-2" />
              <h3 className="font-medium">Participants</h3>
            </div>
            <p className="text-neutral-700">
              {campaign.participantCount} participants
            </p>
          </div>
          
          <div className="bg-primary-50 p-4 rounded-lg">
            <div className="flex items-center text-primary-700 mb-2">
              <Award className="w-5 h-5 mr-2" />
              <h3 className="font-medium">Reward Pool</h3>
            </div>
            <p className="text-neutral-700">
              {formatNumber(campaign.rewardPool)} GOFAV
            </p>
          </div>
        </div>
        
        {/* Tweet Topic */}
        <div className="bg-neutral-100 p-4 rounded-lg mb-6">
          <h3 className="font-medium text-neutral-800 mb-2">Tweet Topic:</h3>
          <p className="text-neutral-700">{campaign.topic}</p>
        </div>
        
        {/* Required Hashtags */}
        <div>
          <h3 className="font-medium text-neutral-800 mb-2">Required Hashtags:</h3>
          <div className="flex flex-wrap gap-2">
            {(campaign.requiredHashtags || []).map((tag, index) => (
              <span 
                key={index} 
                className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-primary-100 text-primary-800"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </div>
      
      {/* Participation Section */}
      {campaign.status === 'active' && isAuthenticated ? (
        <div className="bg-white rounded-lg shadow-soft p-6 mb-8">
          <h2 className="text-xl font-bold text-neutral-900 mb-4">
            Submit Your Tweet
          </h2>
          
          {!connected && (
            <div className="mb-4 p-3 bg-warning-50 border border-warning-200 rounded-md flex items-start">
              <AlertCircle className="w-5 h-5 text-warning-500 mr-2 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-warning-700 text-sm">
                  You need to connect your Algorand wallet before you can participate in this campaign.
                </p>
              </div>
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label 
                htmlFor="tweetContent" 
                className="block text-sm font-medium text-neutral-700 mb-1"
              >
                Tweet Content
              </label>
              <textarea
                id="tweetContent"
                rows={4}
                placeholder="Write your tweet here... Don't forget to include the required hashtags!"
                className="w-full p-3 border border-neutral-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                value={tweetContent}
                onChange={(e) => setTweetContent(e.target.value)}
                maxLength={280}
              />
              <div className="flex justify-between mt-1">
                <p className="text-xs text-neutral-500">
                  Include all required hashtags
                </p>
                <p className={`text-xs ${tweetContent.length > 260 ? 'text-warning-500' : 'text-neutral-500'}`}>
                  {tweetContent.length}/280
                </p>
              </div>
            </div>
            
            <div className="flex justify-end">
              <Button
                type="submit"
                isLoading={submitting}
                disabled={!connected || submitting}
                rightIcon={<Send className="w-4 h-4" />}
              >
                Submit Tweet
              </Button>
            </div>
          </form>
        </div>
      ) : campaign.status === 'upcoming' ? (
        <div className="bg-white rounded-lg shadow-soft p-6 mb-8 text-center">
          <h2 className="text-xl font-bold text-neutral-900 mb-2">
            Campaign Not Started Yet
          </h2>
          <p className="text-neutral-600 mb-4">
            This campaign will start on {formatDate(campaign.startDate)}. Come back then to participate!
          </p>
        </div>
      ) : campaign.status === 'completed' ? (
        <div className="bg-white rounded-lg shadow-soft p-6 mb-8 text-center">
          <h2 className="text-xl font-bold text-neutral-900 mb-2">
            Campaign Has Ended
          </h2>
          <p className="text-neutral-600 mb-4">
            This campaign ended on {formatDate(campaign.endDate)}. Check out other active campaigns!
          </p>
          <Button
            onClick={() => navigate('/campaigns')}
          >
            Browse Active Campaigns
          </Button>
        </div>
      ) : null}
      
      {/* User's Submissions */}
      {isAuthenticated && userTweets.length > 0 && (
        <div className="bg-white rounded-lg shadow-soft p-6">
          <h2 className="text-xl font-bold text-neutral-900 mb-4">
            Your Submissions
          </h2>
          
          <div className="space-y-4">
            {userTweets.map((tweet) => (
              <Card key={tweet.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-grow">
                      <p className="text-neutral-800 mb-3">
                        {tweet.content}
                      </p>
                      <div className="flex items-center text-sm text-neutral-500">
                        <a 
                          href={`https://twitter.com/user/status/${tweet.twitterId}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center text-primary-600 hover:underline mr-4"
                        >
                          <Twitter className="w-4 h-4 mr-1" />
                          View on Twitter
                        </a>
                        <span className="mr-4">Submitted: {formatDate(tweet.createdAt)}</span>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      {tweet.status === 'pending' ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-neutral-100 text-neutral-800">
                          Pending Review
                        </span>
                      ) : tweet.status === 'approved' ? (
                        <div>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-success-100 text-success-800 mb-2">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Approved
                          </span>
                          <div className="text-right">
                            <p className="text-sm font-medium">Score: {tweet.score}/100</p>
                            <p className="text-sm font-medium text-primary-600">
                              +{tweet.rewardAmount} GOFAV
                            </p>
                          </div>
                        </div>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-error-100 text-error-800">
                          Rejected
                        </span>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
      
      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-neutral-900/70 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 animate-fade-in">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-success-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-success-500" />
              </div>
            </div>
            
            <h2 className="text-xl font-bold text-neutral-900 text-center mb-2">
              Tweet Submitted Successfully!
            </h2>
            
            <p className="text-neutral-600 text-center mb-6">
              Your tweet has been submitted for review. Our AI system will analyze your content and score it based on relevance, originality, and technical accuracy.
            </p>
            
            <div className="bg-primary-50 p-3 rounded-md mb-6">
              <p className="text-sm text-primary-700 text-center">
                Check back soon to see your score and earned GOFAV tokens.
              </p>
            </div>
            
            <div className="flex justify-center">
              <Button onClick={() => setShowSuccessModal(false)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CampaignDetails;