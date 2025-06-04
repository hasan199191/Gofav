import { useState, useEffect } from 'react';
import { Trophy, ArrowUpRight } from 'lucide-react';
import { leaderboardApi } from '../utils/api';
import { LeaderboardEntry } from '../types';
import { formatNumber, truncateAddress } from '../utils/format';

const Leaderboard = () => {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await leaderboardApi.getTopUsers();
        if (response.success && response.data) {
          setEntries(response.data as LeaderboardEntry[]);
        } else {
          setError(response.error || 'Failed to fetch leaderboard');
        }
      } catch (err) {
        setError('An error occurred while fetching leaderboard');
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();

    // Mock data for development
    if (process.env.NODE_ENV === 'development') {
      const mockEntries: LeaderboardEntry[] = Array.from({ length: 100 }, (_, i) => ({
        rank: i + 1,
        userId: `user-${i}`,
        twitterHandle: `user${i}`,
        twitterName: `User ${i}`,
        twitterProfileImage: `https://randomuser.me/api/portraits/${i % 2 ? 'men' : 'women'}/${(i % 70) + 1}.jpg`,
        totalPoints: Math.floor(10000 - (i * 80) + Math.random() * 50),
        totalRewards: Math.floor(100000 * (1 - (i / 100))),
        walletAddress: `0x${Math.random().toString(16).substring(2, 14)}...${Math.random().toString(16).substring(2, 6)}`,
      }));
      
      setEntries(mockEntries);
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-pulse text-primary-500">Loading leaderboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <div className="text-error-500 mb-4">Error: {error}</div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-neutral-900 mb-8">
        Campaign Leaderboard
      </h1>

      <div className="bg-white rounded-lg shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-neutral-200">
            <thead className="bg-neutral-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Rank
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Points
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Rewards
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-neutral-200">
              {entries.map((entry) => (
                <tr key={entry.userId} className="hover:bg-neutral-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {entry.rank <= 3 ? (
                        <Trophy className={`w-5 h-5 ${
                          entry.rank === 1 ? 'text-yellow-500' :
                          entry.rank === 2 ? 'text-neutral-400' :
                          'text-amber-600'
                        }`} />
                      ) : (
                        <span className="text-neutral-900 font-medium">{entry.rank}</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <img 
                        className="h-8 w-8 rounded-full mr-3"
                        src={entry.twitterProfileImage} 
                        alt={entry.twitterName}
                      />
                      <div>
                        <div className="text-sm font-medium text-neutral-900">
                          {entry.twitterName}
                        </div>
                        <a
                          href={`https://twitter.com/${entry.twitterHandle}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-primary-600 hover:underline"
                        >
                          @{entry.twitterHandle}
                        </a>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="text-sm text-neutral-900">
                      {formatNumber(entry.totalPoints)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="text-sm font-medium text-primary-600">
                      ${formatNumber(entry.totalRewards)}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;