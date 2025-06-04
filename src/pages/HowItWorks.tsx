import { Twitter, Award, Wallet, BarChart2, CheckCircle } from 'lucide-react';
import { Card, CardContent } from '../components/ui/Card';

const HowItWorks = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold text-neutral-900 mb-8">
        How It Works
      </h1>

      <div className="space-y-8">
        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mb-4">
                  <Twitter className="w-6 h-6 text-primary-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">1. Connect Twitter</h3>
                <p className="text-neutral-600">
                  Sign in with your Twitter account to get started
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mb-4">
                  <Wallet className="w-6 h-6 text-primary-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">2. Link Wallet</h3>
                <p className="text-neutral-600">
                  Connect your Algorand wallet to receive rewards
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mb-4">
                  <Award className="w-6 h-6 text-primary-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">3. Create Content</h3>
                <p className="text-neutral-600">
                  Tweet about Algorand using the required hashtags
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mb-4">
                  <BarChart2 className="w-6 h-6 text-primary-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">4. Earn Rewards</h3>
                <p className="text-neutral-600">
                  Get ranked and earn your share of the reward pool
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Scoring System */}
        <div className="bg-white rounded-lg shadow-soft p-8">
          <h2 className="text-2xl font-bold text-neutral-900 mb-6">
            Scoring System
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">How Tweets Are Scored</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-primary-600 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-neutral-600">
                    AI analyzes tweet content for relevance to Algorand
                  </span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-primary-600 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-neutral-600">
                    Quality and originality of content is evaluated
                  </span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-primary-600 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-neutral-600">
                    Engagement metrics like likes and retweets are considered
                  </span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-primary-600 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-neutral-600">
                    Points are awarded based on overall tweet performance
                  </span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Reward Distribution</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-primary-600 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-neutral-600">
                    Top 100 participants share the reward pool
                  </span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-primary-600 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-neutral-600">
                    Rewards are distributed based on final ranking
                  </span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-primary-600 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-neutral-600">
                    Rewards are automatically sent to connected wallets
                  </span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-primary-600 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-neutral-600">
                    Campaign results are finalized after end date
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Rules */}
        <div className="bg-neutral-50 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-neutral-900 mb-6">
            Campaign Rules
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Requirements</h3>
              <ul className="list-disc list-inside space-y-2 text-neutral-600">
                <li>Must include #Algorand hashtag in tweets</li>
                <li>Maximum 3 qualifying tweets per day</li>
                <li>Content must be original and relevant</li>
                <li>No spam or automated posting</li>
                <li>Must maintain Twitter community guidelines</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Tips for Success</h3>
              <ul className="list-disc list-inside space-y-2 text-neutral-600">
                <li>Share unique insights and perspectives</li>
                <li>Include relevant media when possible</li>
                <li>Engage with the Algorand community</li>
                <li>Focus on quality over quantity</li>
                <li>Stay active throughout the campaign</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;