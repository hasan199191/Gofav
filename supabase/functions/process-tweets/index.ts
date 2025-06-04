import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'npm:@supabase/supabase-js@2.39.3';
import { TwitterApi } from 'npm:twitter-api-v2@1.16.0';

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

const twitter = new TwitterApi({
  appKey: Deno.env.get('TWITTER_API_KEY') ?? '',
  appSecret: Deno.env.get('TWITTER_API_SECRET') ?? '',
  accessToken: Deno.env.get('TWITTER_ACCESS_TOKEN') ?? '',
  accessSecret: Deno.env.get('TWITTER_ACCESS_SECRET') ?? '',
});

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Get all profiles
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('*');

    if (profilesError) throw profilesError;

    const results = await Promise.all(
      profiles.map(async (profile) => {
        if (!profile.twitter_id) return null;

        try {
          // Get user's recent tweets
          const tweets = await twitter.v2.userTimeline(profile.twitter_id, {
            'tweet.fields': ['created_at', 'public_metrics'],
            max_results: 100,
          });

          // Filter Algorand-related tweets
          const algorandTweets = tweets.data.data.filter(tweet =>
            tweet.text.toLowerCase().includes('algorand') ||
            tweet.text.toLowerCase().includes('@algorand') ||
            tweet.text.toLowerCase().includes('#algorand')
          );

          // Store new tweets
          for (const tweet of algorandTweets) {
            const { data: existingTweet } = await supabase
              .from('tweets')
              .select()
              .eq('twitter_tweet_id', tweet.id)
              .maybeSingle();

            if (!existingTweet) {
              await supabase
                .from('tweets')
                .insert({
                  profile_id: profile.id,
                  twitter_tweet_id: tweet.id,
                  content: tweet.text,
                  created_at: tweet.created_at,
                });
            }
          }

          return {
            profileId: profile.id,
            tweetsProcessed: algorandTweets.length,
          };
        } catch (error) {
          console.error(`Error processing tweets for profile ${profile.id}:`, error);
          return null;
        }
      })
    );

    return new Response(
      JSON.stringify({
        success: true,
        data: results.filter(Boolean),
      }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
      }),
      {
        status: 400,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  }
});