import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { HfInference } from 'npm:@huggingface/inference@2.6.4';
import { createClient } from 'npm:@supabase/supabase-js@2.39.3';

const hf = new HfInference(Deno.env.get('HUGGINGFACE_API_KEY'));
const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface TweetAnalysis {
  relevanceScore: number;
  qualityScore: number;
  originalityScore: number;
  engagementScore: number;
  totalScore: number;
}

async function analyzeTweet(text: string): Promise<TweetAnalysis> {
  try {
    // Use HuggingFace for sentiment and topic analysis
    const [sentiment, topic] = await Promise.all([
      hf.textClassification({
        model: 'finiteautomata/bertweet-base-sentiment-analysis',
        inputs: text,
      }),
      hf.textClassification({
        model: 'facebook/bart-large-mnli',
        inputs: text,
        parameters: {
          candidate_labels: ['algorand', 'blockchain', 'cryptocurrency', 'technology'],
        },
      }),
    ]);

    // Calculate scores based on AI analysis
    const relevanceScore = topic.scores[0] * 100;
    const qualityScore = sentiment.score * 100;
    const originalityScore = 70; // Base score, would need comparison
    const engagementScore = 50; // Base score, would need social metrics

    // Calculate total weighted score
    const totalScore = Math.round(
      (relevanceScore * 0.4) +
      (qualityScore * 0.3) +
      (originalityScore * 0.2) +
      (engagementScore * 0.1)
    );

    return {
      relevanceScore: Math.round(relevanceScore),
      qualityScore: Math.round(qualityScore),
      originalityScore,
      engagementScore,
      totalScore,
    };
  } catch (error) {
    console.error('Error analyzing tweet:', error);
    throw error;
  }
}

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { tweets } = await req.json();

    if (!Array.isArray(tweets)) {
      throw new Error('Invalid input: tweets must be an array');
    }

    const results = await Promise.all(
      tweets.map(async (tweet) => {
        const analysis = await analyzeTweet(tweet.text);
        
        // Store analysis results
        const { data, error } = await supabase
          .from('tweet_analysis')
          .insert({
            tweet_id: tweet.id,
            relevance_score: analysis.relevanceScore,
            quality_score: analysis.qualityScore,
            originality_score: analysis.originalityScore,
            engagement_score: analysis.engagementScore,
            total_score: analysis.totalScore,
          })
          .select()
          .single();

        if (error) throw error;

        return {
          tweetId: tweet.id,
          analysis,
        };
      })
    );

    return new Response(
      JSON.stringify({ success: true, data: results }),
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