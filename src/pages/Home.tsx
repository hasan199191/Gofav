import { useNavigate } from 'react-router-dom';
import { Award, Twitter, Wallet, BarChart2, ArrowRight, Users, Trophy } from 'lucide-react';
import Button from '../components/ui/Button';
import { useAuthStore } from '../store/authStore';
import { useCampaignStore } from '../store/campaignStore';
import { formatNumber } from '../utils/format';

const Home = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const { campaign } = useCampaignStore();

  return (
    <div className="space-y-20 pb-8">
      {/* Hero Section */}
      <section className="relative">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-50 to-transparent rounded-3xl" />
        <div className="relative max-w-4xl mx-auto text-center px-4 py-16">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 text-neutral-900 leading-tight">
            Share Your <span className="text-primary-600">Algorand</span> Insights,<br />
            Earn <span className="text-primary-600">Rewards</span>
          </h1>
          <p className="text-xl text-neutral-600 mb-8 max-w-2xl mx-auto">
            Join our campaign to create quality content about Algorand on Twitter. Top contributors share a reward pool of ${formatNumber(campaign.rewardPool)}.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button
              size="lg"
              onClick={() => navigate(isAuthenticated ? '/campaigns' : '/login')}
              rightIcon={<ArrowRight className="w-5 h-5" />}
            >
              {isAuthenticated ? 'View Campaign' : 'Get Started'}
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => navigate('/leaderboard')}
              rightIcon={<Trophy className="w-5 h-5" />}
            >
              View Leaderboard
            </Button>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12 text-neutral-900">
          How It Works
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Twitter className="w-8 h-8 text-primary-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-neutral-800">Connect Twitter</h3>
            <p className="text-neutral-600">Sign in with your Twitter account to get started</p>
          </div>
          <div className="text-center">
            <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Wallet className="w-8 h-8 text-primary-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-neutral-800">Link Wallet</h3>
            <p className="text-neutral-600">Connect your Algorand wallet to receive rewards</p>
          </div>
          <div className="text-center">
            <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Award className="w-8 h-8 text-primary-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-neutral-800">Create Content</h3>
            <p className="text-neutral-600">Share insights about Algorand on Twitter</p>
          </div>
          <div className="text-center">
            <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <BarChart2 className="w-8 h-8 text-primary-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-neutral-800">Earn Rewards</h3>
            <p className="text-neutral-600">Get scored by AI and earn your share of rewards</p>
          </div>
        </div>
      </section>

      {/* Campaign Stats */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-soft p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-primary-50 rounded-lg p-6">
                <Trophy className="w-8 h-8 text-primary-600 mx-auto mb-2" />
                <h3 className="text-2xl font-bold text-neutral-900 mb-1">
                  ${formatNumber(campaign.rewardPool)}
                </h3>
                <p className="text-neutral-600">Total Reward Pool</p>
              </div>
            </div>
            <div className="text-center">
              <div className="bg-primary-50 rounded-lg p-6">
                <Users className="w-8 h-8 text-primary-600 mx-auto mb-2" />
                <h3 className="text-2xl font-bold text-neutral-900 mb-1">
                  Top 100
                </h3>
                <p className="text-neutral-600">Winners Selected</p>
              </div>
            </div>
            <div className="text-center">
              <div className="bg-primary-50 rounded-lg p-6">
                <Award className="w-8 h-8 text-primary-600 mx-auto mb-2" />
                <h3 className="text-2xl font-bold text-neutral-900 mb-1">
                  ${formatNumber(campaign.rewardPool / 100)}
                </h3>
                <p className="text-neutral-600">First Place Prize</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary-600 text-white py-16 px-4 rounded-2xl max-w-6xl mx-auto">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Earning?</h2>
          <p className="text-xl opacity-90 mb-8">
            Join our campaign today and turn your Algorand insights into rewards.
          </p>
          <Button
            variant="outline"
            size="lg"
            className="bg-white text-primary-600 hover:bg-neutral-100 border-white"
            onClick={() => navigate(isAuthenticated ? '/campaigns' : '/login')}
          >
            {isAuthenticated ? 'View Campaign' : 'Join Now'}
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Home;