import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Twitter, BarChart2, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader } from '../components/ui/Card';
import { useAuthStore } from '../store/authStore';
import { supabase } from '../utils/supabase';
import { Tweet } from '../types';
import { formatDate } from '../utils/format';

const Mindshare = () => {
  const { user } = useAuthStore();
  const [tweets, setTweets] = useState<Tweet[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTweets = async () => {
      if (!user?.id) return;

      try {
        const { data, error } = await supabase
          .from('tweets')
          .select(`
            *,
            tweet_analysis (*)
          `)
          .eq('profile_id', user.id)
          .order('created_at', { ascending: false })
          .limit(10);

        if (error) throw error;
        setTweets(data || []);
      } catch (error) {
        console.error('Error fetching tweets:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTweets();
  }, [user?.id]);

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-success-600';
    if (score >= 60) return 'text-primary-600';
    if (score >= 40) return 'text-warning-600';
    return 'text-error-600';
  };

  const getScoreBackground = (score: number) => {
    if (score >= 80) return 'bg-success-50';
    if (score >= 60) return 'bg-primary-50';
    if (score >= 40) return 'bg-warning-50';
    return 'bg-error-50';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-pulse text-primary-500">Loading tweet analysis...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-neutral-900">
          Tweet Analysis
        </h1>
        <Link
          to="/campaigns"
          className="text-primary-600 hover:text-primary-700 font-medium"
        >
          View Campaign
        </Link>
      </div>

      {/* Performance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="p-3 bg-primary-100 rounded-full mr-4">
                <BarChart2 className="h-6 w-6 text-primary-600" />
              </div>
              <div>
                <p className="text-sm text-neutral-500">Average Score</p>
                <p className="text-xl font-bold text-neutral-900">
                  {tweets.length > 0
                    ? Math.round(
                        tweets.reduce((sum, tweet) => sum + (tweet.score || 0), 0) /
                          tweets.length
                      )
                    : 0}
                  /100
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="p-3 bg-primary-100 rounded-full mr-4">
                <Twitter className="h-6 w-6 text-primary-600" />
              </div>
              <div>
                <p className="text-sm text-neutral-500">Analyzed Tweets</p>
                <p className="text-xl font-bold text-neutral-900">{tweets.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="p-3 bg-primary-100 rounded-full mr-4">
                <TrendingUp className="h-6 w-6 text-primary-600" />
              </div>
              <div>
                <p className="text-sm text-neutral-500">Success Rate</p>
                <p className="text-xl font-bold text-neutral-900">
                  {tweets.length > 0
                    ? Math.round(
                        (tweets.filter((t) => t.score >= 70).length / tweets.length) *
                          100
                      )
                    : 0}
                  %
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Tweets Analysis */}
      <div>
        <h2 className="text-xl font-bold text-neutral-900 mb-4">Recent Tweets</h2>
        <div className="space-y-4">
          {tweets.length > 0 ? (
            tweets.map((tweet) => (
              <Card key={tweet.id}>
                <CardHeader className={`${getScoreBackground(tweet.score)} p-4`}>
                  <div className="flex justify-between items-start">
                    <div className="flex items-center">
                      {tweet.score >= 70 ? (
                        <CheckCircle className="w-5 h-5 text-success-600 mr-2" />
                      ) : (
                        <AlertTriangle className="w-5 h-5 text-warning-600 mr-2" />
                      )}
                      <div>
                        <p className={`text-lg font-medium ${getScoreColor(tweet.score)}`}>
                          Score: {tweet.score}/100
                        </p>
                        <p className="text-sm text-neutral-500">
                          Posted on {formatDate(tweet.createdAt)}
                        </p>
                      </div>
                    </div>
                    <a
                      href={`https://twitter.com/user/status/${tweet.twitterId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary-600 hover:text-primary-700"
                    >
                      <Twitter className="w-5 h-5" />
                    </a>
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <p className="text-neutral-800 mb-4">{tweet.content}</p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm text-neutral-500">Relevance</p>
                      <p className="font-medium text-neutral-900">
                        {tweet.scoreDetails?.relevance || 0}/100
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-neutral-500">Quality</p>
                      <p className="font-medium text-neutral-900">
                        {tweet.scoreDetails?.quality || 0}/100
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-neutral-500">Originality</p>
                      <p className="font-medium text-neutral-900">
                        {tweet.scoreDetails?.originality || 0}/100
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-neutral-500">Engagement</p>
                      <p className="font-medium text-neutral-900">
                        {tweet.scoreDetails?.engagement || 0}/100
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center py-8 bg-neutral-50 rounded-lg">
              <p className="text-neutral-600 mb-2">No tweets analyzed yet.</p>
              <p className="text-sm text-neutral-500">
                Start tweeting about Algorand to see your analysis here.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Mindshare;