import { useState } from 'react';
import { Trophy } from 'lucide-react';
import { Card, CardContent } from '../components/ui/Card';
import { formatDate, formatNumber } from '../utils/format';
import { useCampaignStore } from '../store/campaignStore';

const Campaigns = () => {
  const { campaign } = useCampaignStore();

  return (
    <div>
      <h1 className="text-3xl font-bold text-neutral-900 mb-8">
        Active Campaign
      </h1>

      <Card className="overflow-hidden">
        <CardContent className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <Trophy className="w-12 h-12 text-primary-600" />
            <div>
              <h2 className="text-2xl font-bold text-neutral-900">
                {campaign.title}
              </h2>
              <p className="text-neutral-600">
                {campaign.description}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-neutral-50 p-4 rounded-lg">
              <h3 className="font-medium text-neutral-700 mb-2">Campaign Period</h3>
              <p className="text-neutral-800">
                {formatDate(campaign.startDate)} - {formatDate(campaign.endDate)}
              </p>
            </div>

            <div className="bg-primary-50 p-4 rounded-lg">
              <h3 className="font-medium text-primary-700 mb-2">Total Reward Pool</h3>
              <p className="text-2xl font-bold text-primary-800">
                ${formatNumber(campaign.rewardPool)}
              </p>
            </div>
          </div>

          <div className="bg-neutral-100 p-4 rounded-lg">
            <p className="text-neutral-700">
              The reward pool will be distributed among the top 100 participants based on their ranking.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Campaigns;