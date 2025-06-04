import { useState, useEffect } from 'react';
import { PlusCircle, BarChart2, Calendar, Users, DollarSign } from 'lucide-react';
import { projectApi } from '../utils/api';
import { Campaign, Project } from '../types';
import Button from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardFooter } from '../components/ui/Card';
import { formatDate, formatNumber } from '../utils/format';

const ProjectDashboard = () => {
  const [project, setProject] = useState<Project | null>(null);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showNewCampaignModal, setShowNewCampaignModal] = useState(false);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await projectApi.getDashboard();
        if (response.success && response.data) {
          setProject(response.data.project as Project);
          setCampaigns(response.data.campaigns as Campaign[]);
        } else {
          setError(response.error || 'Failed to fetch dashboard data');
        }
      } catch (err) {
        setError('An error occurred while fetching dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();

    // Mock data for development
    if (process.env.NODE_ENV === 'development') {
      const mockProject: Project = {
        id: 'folks-finance',
        name: 'Folks Finance',
        logo: 'https://pbs.twimg.com/profile_images/1473058887906037761/w1KMxSdR_400x400.jpg',
        description: 'Folks Finance is a lending and borrowing protocol built on the Algorand blockchain, offering features like Liquid Governance.',
        website: 'https://folks.finance',
        twitterHandle: 'folksfinance',
        ownerWalletAddress: '0x123456789abcdef',
        totalCampaigns: 3,
        activeCampaigns: 1,
        totalRewardsDistributed: 12500,
      };
      
      const mockCampaigns: Campaign[] = [
        {
          id: '1',
          projectId: 'folks-finance',
          projectName: 'Folks Finance',
          projectLogo: 'https://pbs.twimg.com/profile_images/1473058887906037761/w1KMxSdR_400x400.jpg',
          title: 'Liquid Governance Explained',
          description: 'Create engaging content about Folks Finance Liquid Governance and how it benefits Algorand holders.',
          topic: 'Explain how Liquid Governance works on Folks Finance and its advantages over traditional governance.',
          startDate: '2023-11-01T00:00:00Z',
          endDate: '2023-11-30T23:59:59Z',
          rewardPool: 10000,
          requiredHashtags: ['AlgoFi', 'FolksFinance', 'Algorand'],
          status: 'active',
          participantCount: 78
        },
        {
          id: '4',
          projectId: 'folks-finance',
          projectName: 'Folks Finance',
          projectLogo: 'https://pbs.twimg.com/profile_images/1473058887906037761/w1KMxSdR_400x400.jpg',
          title: 'Lending Tutorial',
          description: 'Create a tutorial on lending assets on Folks Finance.',
          topic: 'Step-by-step guide on lending assets on Folks Finance with focus on interest rates and safety features.',
          startDate: '2023-10-01T00:00:00Z',
          endDate: '2023-10-31T23:59:59Z',
          rewardPool: 7500,
          requiredHashtags: ['FolksFinance', 'Algorand', 'DeFi', 'Lending'],
          status: 'completed',
          participantCount: 65
        },
        {
          id: '5',
          projectId: 'folks-finance',
          projectName: 'Folks Finance',
          projectLogo: 'https://pbs.twimg.com/profile_images/1473058887906037761/w1KMxSdR_400x400.jpg',
          title: 'Borrowing Best Practices',
          description: 'Share best practices for borrowing on Folks Finance.',
          topic: 'Best practices for maintaining a healthy collateral ratio when borrowing on Folks Finance.',
          startDate: '2023-12-10T00:00:00Z',
          endDate: '2024-01-10T23:59:59Z',
          rewardPool: 8000,
          requiredHashtags: ['FolksFinance', 'Algorand', 'DeFi', 'Borrowing'],
          status: 'upcoming',
          participantCount: 0
        }
      ];
      
      setProject(mockProject);
      setCampaigns(mockCampaigns);
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-pulse text-primary-500">Loading project data...</div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="text-center py-10">
        <div className="text-error-500 mb-4">Error: {error || 'Project not found'}</div>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Project Header */}
      <div className="bg-white rounded-lg shadow-soft p-6 mb-8">
        <div className="flex flex-col md:flex-row md:items-center gap-6">
          <img
            src={project.logo}
            alt={project.name}
            className="w-20 h-20 rounded-full"
          />
          <div className="flex-grow">
            <h1 className="text-3xl font-bold text-neutral-900 mb-1">
              {project.name}
            </h1>
            <div className="flex flex-wrap gap-3 mb-3">
              <a
                href={project.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-600 hover:underline flex items-center text-sm"
              >
                Website <ArrowUpRight className="w-3 h-3 ml-1" />
              </a>
              <a
                href={`https://twitter.com/${project.twitterHandle}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-600 hover:underline flex items-center text-sm"
              >
                @{project.twitterHandle} <ArrowUpRight className="w-3 h-3 ml-1" />
              </a>
            </div>
            <p className="text-neutral-600">
              {project.description}
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="p-3 bg-primary-100 rounded-full mr-4">
                <Calendar className="h-6 w-6 text-primary-600" />
              </div>
              <div>
                <p className="text-sm text-neutral-500">Total Campaigns</p>
                <p className="text-xl font-bold text-neutral-900">{project.totalCampaigns}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="p-3 bg-accent-100 rounded-full mr-4">
                <Users className="h-6 w-6 text-accent-600" />
              </div>
              <div>
                <p className="text-sm text-neutral-500">Active Campaigns</p>
                <p className="text-xl font-bold text-neutral-900">{project.activeCampaigns}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="p-3 bg-success-100 rounded-full mr-4">
                <DollarSign className="h-6 w-6 text-success-600" />
              </div>
              <div>
                <p className="text-sm text-neutral-500">Total Rewards</p>
                <p className="text-xl font-bold text-neutral-900">
                  {formatNumber(project.totalRewardsDistributed)} GOFAV
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Campaigns Section */}
      <div className="mb-8 flex justify-between items-center">
        <h2 className="text-xl font-bold text-neutral-900">
          Your Campaigns
        </h2>
        <Button
          leftIcon={<PlusCircle className="w-4 h-4" />}
          onClick={() => setShowNewCampaignModal(true)}
        >
          New Campaign
        </Button>
      </div>

      <div className="space-y-4">
        {campaigns.length > 0 ? (
          campaigns.map((campaign) => (
            <Card key={campaign.id} className="overflow-hidden">
              <CardHeader className="bg-neutral-50 p-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center">
                    <div 
                      className={`w-3 h-3 rounded-full mr-3 ${
                        campaign.status === 'active' 
                          ? 'bg-success-500' 
                          : campaign.status === 'upcoming' 
                            ? 'bg-primary-500' 
                            : 'bg-neutral-400'
                      }`}
                    />
                    <h3 className="text-lg font-medium text-neutral-900">
                      {campaign.title}
                    </h3>
                  </div>
                  <div className="flex items-center">
                    <div 
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        campaign.status === 'active' 
                          ? 'bg-success-100 text-success-800' 
                          : campaign.status === 'upcoming' 
                            ? 'bg-primary-100 text-primary-800' 
                            : 'bg-neutral-100 text-neutral-800'
                      }`}
                    >
                      {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-neutral-600 mb-4">
                  {campaign.description}
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                  <div className="bg-neutral-50 p-3 rounded">
                    <p className="text-sm text-neutral-500 mb-1">Duration</p>
                    <p className="text-neutral-700">
                      {formatDate(campaign.startDate)} - {formatDate(campaign.endDate)}
                    </p>
                  </div>
                  
                  <div className="bg-neutral-50 p-3 rounded">
                    <p className="text-sm text-neutral-500 mb-1">Participants</p>
                    <p className="text-neutral-700">
                      {campaign.participantCount} participants
                    </p>
                  </div>
                  
                  <div className="bg-neutral-50 p-3 rounded">
                    <p className="text-sm text-neutral-500 mb-1">Reward Pool</p>
                    <p className="text-neutral-700">
                      {formatNumber(campaign.rewardPool)} GOFAV
                    </p>
                  </div>
                </div>
                
                <div className="bg-neutral-100 p-3 rounded mb-3">
                  <p className="text-sm font-medium text-neutral-700 mb-1">Tweet Topic:</p>
                  <p className="text-neutral-600">{campaign.topic}</p>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-neutral-700 mb-2">Required Hashtags:</p>
                  <div className="flex flex-wrap gap-2">
                    {campaign.requiredHashtags.map((tag, index) => (
                      <span 
                        key={index} 
                        className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <div className="w-full flex flex-col sm:flex-row gap-3 sm:justify-between">
                  <Button variant="outline" className="sm:w-auto justify-center">
                    {campaign.status === 'active' || campaign.status === 'completed' 
                      ? 'View Submissions' 
                      : 'Edit Campaign'
                    }
                  </Button>
                  
                  <div className="flex gap-2">
                    {campaign.status === 'active' && (
                      <Button variant="ghost\" className="sm:w-auto justify-center">
                        End Campaign
                      </Button>
                    )}
                    {campaign.status === 'upcoming' && (
                      <Button className="sm:w-auto justify-center">
                        Start Campaign
                      </Button>
                    )}
                  </div>
                </div>
              </CardFooter>
            </Card>
          ))
        ) : (
          <div className="text-center py-10 bg-neutral-50 rounded-lg border border-neutral-200">
            <p className="text-neutral-600 mb-4">You don't have any campaigns yet.</p>
            <Button 
              onClick={() => setShowNewCampaignModal(true)}
              leftIcon={<PlusCircle className="w-4 h-4" />}
            >
              Create Your First Campaign
            </Button>
          </div>
        )}
      </div>

      {/* New Campaign Modal */}
      {showNewCampaignModal && (
        <div className="fixed inset-0 bg-neutral-900/70 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full p-6 animate-fade-in max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-neutral-900 mb-6">
              Create New Campaign
            </h2>
            
            <form className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Campaign Title
                </label>
                <input
                  type="text"
                  className="w-full p-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  placeholder="E.g., Liquid Governance Explained"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Campaign Description
                </label>
                <textarea
                  rows={3}
                  className="w-full p-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Describe what the campaign is about..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Tweet Topic
                </label>
                <textarea
                  rows={2}
                  className="w-full p-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  placeholder="The specific topic users should tweet about..."
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    className="w-full p-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    End Date
                  </label>
                  <input
                    type="date"
                    className="w-full p-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Reward Pool (GOFAV)
                </label>
                <input
                  type="number"
                  min="1000"
                  className="w-full p-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  placeholder="E.g., 10000"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Required Hashtags
                </label>
                <input
                  type="text"
                  className="w-full p-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  placeholder="E.g., FolksFinance, Algorand, DeFi (comma separated)"
                />
                <p className="text-xs text-neutral-500 mt-1">
                  Separate hashtags with commas. Do not include the # symbol.
                </p>
              </div>
              
              <div className="border-t border-neutral-200 pt-6 flex justify-end gap-4">
                <Button
                  variant="ghost"
                  type="button"
                  onClick={() => setShowNewCampaignModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  onClick={() => {
                    // In a real app, this would submit the form data
                    setShowNewCampaignModal(false);
                  }}
                >
                  Create Campaign
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectDashboard;