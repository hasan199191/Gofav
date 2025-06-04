import { useState, useEffect } from 'react';
import { Shield, Star, Award, TrendingUp, Users, Calendar } from 'lucide-react';
import { Card, CardContent } from '../components/ui/Card';
import { useAuthStore } from '../store/authStore';
import { supabase } from '../utils/supabase';
import { formatNumber } from '../utils/format';

interface LoyaltyStats {
  weeklyTweets: number;
  averageScore: number;
  totalEngagement: number;
  consistencyStreak: number;
  qualityScore: number;
  level: 'bronze' | 'silver' | 'gold';
  multiplier: number;
}

const Loyalty = () => {
  const { user } = useAuthStore();
  const [stats, setStats] = useState<LoyaltyStats>({
    weeklyTweets: 0,
    averageScore: 0,
    totalEngagement: 0,
    consistencyStreak: 0,
    qualityScore: 0,
    level: 'bronze',
    multiplier: 1,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLoyaltyStats = async () => {
      if (!user?.id) return;

      try {
        // Get tweets from the last 7 days
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const { data: tweets, error } = await supabase
          .from('tweets')
          .select(`
            *,
            tweet_analysis (*)
          `)
          .eq('profile_id', user.id)
          .gte('created_at', sevenDaysAgo.toISOString());

        if (error) throw error;

        // Calculate stats
        const weeklyTweets = tweets?.length || 0;
        const averageScore = tweets?.reduce((sum, tweet) => sum + (tweet.score || 0), 0) / weeklyTweets || 0;
        const qualityScore = tweets?.filter(tweet => tweet.score >= 70).length / weeklyTweets * 100 || 0;

        // Determine level based on quality score
        let level: 'bronze' | 'silver' | 'gold' = 'bronze';
        let multiplier = 1;

        if (qualityScore >= 80) {
          level = 'gold';
          multiplier = 1.5;
        } else if (qualityScore >= 60) {
          level = 'silver';
          multiplier = 1.2;
        }

        setStats({
          weeklyTweets,
          averageScore: Math.round(averageScore),
          totalEngagement: weeklyTweets * 10, // Mock engagement metric
          consistencyStreak: Math.min(weeklyTweets, 7),
          qualityScore: Math.round(qualityScore),
          level,
          multiplier,
        });
      } catch (error) {
        console.error('Error fetching loyalty stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLoyaltyStats();
  }, [user?.id]);

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'gold':
        return 'text-yellow-600 bg-yellow-50';
      case 'silver':
        return 'text-neutral-600 bg-neutral-50';
      default:
        return 'text-amber-600 bg-amber-50';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-pulse text-primary-500">Loading loyalty stats...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-neutral-900 mb-2">
          Loyalty Program
        </h1>
        <p className="text-neutral-600">
          Track your engagement and earn multipliers for consistent quality content.
        </p>
      </div>

      {/* Current Level */}
      <div className="bg-white rounded-lg shadow-soft p-6">
        <div className="flex flex-col md:flex-row md:items-center gap-6">
          <div className={`p-4 rounded-lg ${getLevelColor(stats.level)}`}>
            <Shield className="w-12 h-12" />
          </div>
          <div className="flex-grow">
            <div className="flex items-center gap-2 mb-2">
              <h2 className="text-2xl font-bold text-neutral-900 capitalize">
                {stats.level} Level
              </h2>
              <span className="text-primary-600 font-medium">
                {stats.multiplier}x Multiplier
              </span>
            </div>
            <p className="text-neutral-600">
              {stats.level === 'gold' 
                ? 'Elite contributor with consistently high-quality content'
                : stats.level === 'silver'
                ? 'Regular contributor with good quality content'
                : 'New contributor building reputation'}
            </p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="p-3 bg-primary-100 rounded-full mr-4">
                <Star className="w-6 h-6 text-primary-600" />
              </div>
              <div>
                <p className="text-sm text-neutral-500">Quality Score</p>
                <p className="text-xl font-bold text-neutral-900">
                  {stats.qualityScore}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="p-3 bg-primary-100 rounded-full mr-4">
                <Calendar className="w-6 h-6 text-primary-600" />
              </div>
              <div>
                <p className="text-sm text-neutral-500">Weekly Tweets</p>
                <p className="text-xl font-bold text-neutral-900">
                  {stats.weeklyTweets}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="p-3 bg-primary-100 rounded-full mr-4">
                <TrendingUp className="w-6 h-6 text-primary-600" />
              </div>
              <div>
                <p className="text-sm text-neutral-500">Consistency Streak</p>
                <p className="text-xl font-bold text-neutral-900">
                  {stats.consistencyStreak} days
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Level Requirements */}
      <div className="bg-white rounded-lg shadow-soft p-6">
        <h2 className="text-xl font-bold text-neutral-900 mb-6">
          Level Requirements
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 rounded-lg bg-amber-50">
            <div className="flex items-center gap-3 mb-3">
              <Shield className="w-6 h-6 text-amber-600" />
              <h3 className="font-semibold text-amber-900">Bronze Level</h3>
            </div>
            <ul className="space-y-2 text-sm text-amber-800">
              <li>• New contributors start here</li>
              <li>• 1x reward multiplier</li>
              <li>• Minimum 3 tweets per week</li>
            </ul>
          </div>

          <div className="p-4 rounded-lg bg-neutral-50">
            <div className="flex items-center gap-3 mb-3">
              <Shield className="w-6 h-6 text-neutral-600" />
              <h3 className="font-semibold text-neutral-900">Silver Level</h3>
            </div>
            <ul className="space-y-2 text-sm text-neutral-700">
              <li>• 60%+ quality score</li>
              <li>• 1.2x reward multiplier</li>
              <li>• Minimum 5 tweets per week</li>
            </ul>
          </div>

          <div className="p-4 rounded-lg bg-yellow-50">
            <div className="flex items-center gap-3 mb-3">
              <Shield className="w-6 h-6 text-yellow-600" />
              <h3 className="font-semibold text-yellow-900">Gold Level</h3>
            </div>
            <ul className="space-y-2 text-sm text-yellow-800">
              <li>• 80%+ quality score</li>
              <li>• 1.5x reward multiplier</li>
              <li>• Minimum 7 tweets per week</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Tips */}
      <div className="bg-neutral-50 rounded-lg p-6">
        <h2 className="text-xl font-bold text-neutral-900 mb-4">
          Tips to Level Up
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-neutral-800 mb-3">Quality Content</h3>
            <ul className="space-y-2 text-neutral-600">
              <li>• Share unique insights about Algorand</li>
              <li>• Include relevant data and examples</li>
              <li>• Engage with community responses</li>
              <li>• Use appropriate hashtags</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-neutral-800 mb-3">Consistency</h3>
            <ul className="space-y-2 text-neutral-600">
              <li>• Tweet regularly throughout the week</li>
              <li>• Maintain high quality standards</li>
              <li>• Build a consistent theme or focus</li>
              <li>• Stay updated with Algorand news</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Loyalty;