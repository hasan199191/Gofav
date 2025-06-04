import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'npm:@supabase/supabase-js@2.39.3';

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

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
        try {
          // Get today's analyzed tweets
          const { data: analyzedTweets, error: tweetsError } = await supabase
            .from('tweets')
            .select(`
              id,
              tweet_analysis (
                total_score
              )
            `)
            .eq('profile_id', profile.id)
            .eq('created_at::date', new Date().toISOString().split('T')[0]);

          if (tweetsError) throw tweetsError;

          // Calculate total points for today
          const totalPoints = analyzedTweets.reduce((sum, tweet) => {
            return sum + (tweet.tweet_analysis?.total_score || 0);
          }, 0);

          // Update daily_tweet_counts
          await supabase
            .from('daily_tweet_counts')
            .upsert({
              profile_id: profile.id,
              date: new Date().toISOString().split('T')[0],
              tweet_count: analyzedTweets.length,
              points_earned: totalPoints,
            });

          // Update profile total points
          await supabase
            .from('profiles')
            .update({
              total_points: profile.total_points + totalPoints,
            })
            .eq('id', profile.id);

          return {
            profileId: profile.id,
            pointsEarned: totalPoints,
          };
        } catch (error) {
          console.error(`Error updating scores for profile ${profile.id}:`, error);
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