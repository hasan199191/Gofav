import { CalendarDays, Users, Award } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter } from '../ui/Card';
import { Campaign } from '../../types';
import { formatDate, formatNumber } from '../../utils/format';

interface CampaignCardProps {
  campaign: Campaign;
}

const CampaignCard = ({ campaign }: CampaignCardProps) => {
  const isActive = campaign.status === 'active';
  
  return (
    <Card 
      hoverable 
      className="h-full flex flex-col transition-all duration-200"
    >
      <CardContent className="flex-grow">
        <div className="flex items-center space-x-3 mb-3">
          <img 
            src={campaign.projectLogo} 
            alt={campaign.projectName}
            className="w-8 h-8 rounded-full" 
          />
          <h3 className="text-sm font-medium text-neutral-500">
            {campaign.projectName}
          </h3>
        </div>
        
        <h2 className="text-xl font-semibold mb-2 text-neutral-900">
          {campaign.title}
        </h2>
        
        <p className="text-neutral-600 text-sm mb-4 line-clamp-2">
          {campaign.description}
        </p>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-neutral-500">
            <CalendarDays className="w-4 h-4 mr-2" />
            <span>
              {formatDate(campaign.startDate)} - {formatDate(campaign.endDate)}
            </span>
          </div>
          
          <div className="flex items-center text-sm text-neutral-500">
            <Users className="w-4 h-4 mr-2" />
            <span>{campaign.participantCount} participants</span>
          </div>
          
          <div className="flex items-center text-sm text-neutral-500">
            <Award className="w-4 h-4 mr-2" />
            <span>{formatNumber(campaign.rewardPool)} GOFAV</span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="bg-white border-t border-neutral-200">
        <div className="w-full flex justify-end">
          <Link 
            to={`/campaigns/${campaign.id}`}
            className="px-4 py-1.5 bg-primary-600 text-white rounded text-sm font-medium hover:bg-primary-700 transition-colors"
          >
            {isActive ? 'Participate' : 'View'}
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
};

export default CampaignCard;