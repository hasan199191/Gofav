import { Award, Shield, Zap, RefreshCw } from 'lucide-react';
import { Card, CardContent } from '../components/ui/Card';

const AboutToken = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold text-neutral-900 mb-8">
        About GOFAV Token
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <Award className="w-8 h-8 text-primary-600" />
              <h2 className="text-xl font-bold text-neutral-900">
                Reward Token
              </h2>
            </div>
            <p className="text-neutral-600">
              GOFAV is the native reward token of the GoFav platform. It's used to reward users for creating quality content about Algorand projects.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <Shield className="w-8 h-8 text-primary-600" />
              <h2 className="text-xl font-bold text-neutral-900">
                Algorand Standard Asset
              </h2>
            </div>
            <p className="text-neutral-600">
              GOFAV is an ASA (Algorand Standard Asset) token, which means it's secure, fast, and has minimal transaction fees on the Algorand blockchain.
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="bg-white rounded-lg shadow-soft p-8 mb-12">
        <h2 className="text-2xl font-bold text-neutral-900 mb-6">
          Token Distribution
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-neutral-50 p-4 rounded-lg">
            <p className="text-2xl font-bold text-primary-600 mb-2">50%</p>
            <p className="text-neutral-700">Campaign Rewards</p>
          </div>
          <div className="bg-neutral-50 p-4 rounded-lg">
            <p className="text-2xl font-bold text-primary-600 mb-2">20%</p>
            <p className="text-neutral-700">Community Growth</p>
          </div>
          <div className="bg-neutral-50 p-4 rounded-lg">
            <p className="text-2xl font-bold text-primary-600 mb-2">20%</p>
            <p className="text-neutral-700">Project Development</p>
          </div>
          <div className="bg-neutral-50 p-4 rounded-lg">
            <p className="text-2xl font-bold text-primary-600 mb-2">10%</p>
            <p className="text-neutral-700">Team & Advisors</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <Zap className="w-8 h-8 text-primary-600" />
              <h2 className="text-xl font-bold text-neutral-900">
                Instant Rewards
              </h2>
            </div>
            <p className="text-neutral-600">
              Earn GOFAV tokens instantly when your content is approved. Tokens are automatically sent to your connected Algorand wallet.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <RefreshCw className="w-8 h-8 text-primary-600" />
              <h2 className="text-xl font-bold text-neutral-900">
                Token Utility
              </h2>
            </div>
            <p className="text-neutral-600">
              Use GOFAV tokens to access premium features, participate in governance, and receive exclusive benefits in the Algorand ecosystem.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AboutToken;