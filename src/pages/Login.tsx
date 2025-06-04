import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Twitter } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useAuthStore } from '../store/authStore';
import Button from '../components/ui/Button';

const Login = () => {
  const { login } = useAuth();
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/profile');
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-medium">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">Welcome to GoFav</h1>
          <p className="text-neutral-600">
            Create social media content for Algorand projects and earn rewards.
          </p>
        </div>
        
        <div className="space-y-6">
          <div className="bg-primary-50 p-4 rounded-lg border border-primary-100">
            <h2 className="text-lg font-medium text-primary-900 mb-2">How it works</h2>
            <ol className="list-decimal list-inside space-y-2 text-sm text-neutral-700">
              <li>Sign in with your Twitter account</li>
              <li>Connect your Algorand wallet</li>
              <li>Browse active campaigns</li>
              <li>Create Twitter content about Algorand projects</li>
              <li>Get your content AI-scored and earn rewards</li>
            </ol>
          </div>
          
          <div className="flex flex-col space-y-4">
            <Button
              onClick={login}
              className="w-full justify-center"
              leftIcon={<Twitter className="w-5 h-5" />}
            >
              Sign in with Twitter
            </Button>
            
            <p className="text-xs text-center text-neutral-500">
              By signing in, you agree to our Terms of Service and Privacy Policy.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;