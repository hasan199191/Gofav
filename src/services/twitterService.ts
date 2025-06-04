import { TwitterApi } from 'twitter-api-v2';
import { config } from '../utils/config';

const client = new TwitterApi({
  appKey: config.twitter.apiKey,
  appSecret: config.twitter.apiKeySecret,
  accessToken: config.twitter.accessToken,
  accessSecret: config.twitter.accessTokenSecret,
});

export const twitterService = {
  async getUserTweets(userId: string, sinceId?: string) {
    try {
      const tweets = await client.v2.userTimeline(userId, {
        since_id: sinceId,
        exclude: ['retweets', 'replies'],
        'tweet.fields': ['created_at', 'text', 'public_metrics'],
      });

      return tweets;
    } catch (error) {
      console.error('Error fetching tweets:', error);
      throw error;
    }
  },

  async searchAlgorandTweets() {
    try {
      const tweets = await client.v2.search('(#Algorand OR @Algorand) -is:retweet -is:reply', {
        'tweet.fields': ['created_at', 'author_id', 'public_metrics'],
        'user.fields': ['username', 'name', 'profile_image_url'],
        expansions: ['author_id'],
      });

      return tweets;
    } catch (error) {
      console.error('Error searching tweets:', error);
      throw error;
    }
  }
};