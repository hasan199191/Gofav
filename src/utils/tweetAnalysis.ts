import { Tweet } from '../types';

interface TweetAnalysisResult {
  score: number;
  details: {
    originality: number;
    relevance: number;
    quality: number;
    authenticity: number;
    spamProbability: number;
  };
  feedback: string[];
}

const ALGORAND_KEYWORDS = [
  'algorand',
  '@algorand',
  '#algorand',
  'blockchain',
  'cryptocurrency',
  'defi',
  'web3',
  'crypto',
  'pos',
  'pure proof of stake',
  'carbon negative',
  'sustainable blockchain',
  'tps',
  'transactions per second',
  'finality',
  'smart contracts',
  'layer 1',
  'l1',
];

export async function analyzeTweet(tweet: string): Promise<TweetAnalysisResult> {
  // Normalize tweet text for analysis
  const normalizedTweet = tweet.toLowerCase();
  const words = tweet.split(/\s+/).filter(word => word.length > 0);
  
  // Basic checks
  if (words.length < 10) {
    return {
      score: 0,
      details: {
        originality: 0,
        relevance: 0,
        quality: 0,
        authenticity: 0,
        spamProbability: 100,
      },
      feedback: ['Tweet is too short. Please provide more meaningful content.']
    };
  }

  // Check for spam indicators
  const hashtagCount = (tweet.match(/#/g) || []).length;
  const urlCount = (tweet.match(/https?:\/\/[^\s]+/g) || []).length;
  const mentionCount = (tweet.match(/@/g) || []).length;
  
  if (hashtagCount > 5 || urlCount > 2 || mentionCount > 3) {
    return {
      score: 10,
      details: {
        originality: 20,
        relevance: 30,
        quality: 10,
        authenticity: 10,
        spamProbability: 90,
      },
      feedback: ['Too many hashtags, URLs, or mentions. This appears to be promotional content.']
    };
  }

  // Calculate relevance score based on keyword presence
  const relevantKeywords = ALGORAND_KEYWORDS.filter(keyword => 
    normalizedTweet.includes(keyword)
  );
  
  const relevanceScore = Math.min(
    100,
    (relevantKeywords.length / ALGORAND_KEYWORDS.length) * 100
  );

  // Analyze content quality
  const qualityScore = calculateQualityScore(tweet);
  const originalityScore = calculateOriginalityScore(tweet);
  const authenticityScore = calculateAuthenticityScore(tweet);
  
  // Calculate final score
  const finalScore = Math.round(
    (relevanceScore * 0.3) +
    (qualityScore * 0.3) +
    (originalityScore * 0.2) +
    (authenticityScore * 0.2)
  );

  // Generate feedback
  const feedback = generateFeedback({
    relevanceScore,
    qualityScore,
    originalityScore,
    authenticityScore,
    relevantKeywords
  });

  return {
    score: finalScore,
    details: {
      originality: originalityScore,
      relevance: relevanceScore,
      quality: qualityScore,
      authenticity: authenticityScore,
      spamProbability: Math.max(0, 100 - finalScore),
    },
    feedback
  };
}

function calculateQualityScore(tweet: string): number {
  const words = tweet.split(/\s+/).filter(word => word.length > 0);
  const sentences = tweet.split(/[.!?]+/).filter(s => s.trim().length > 0);
  
  // Basic quality metrics
  const avgWordLength = words.join('').length / words.length;
  const avgSentenceLength = words.length / sentences.length;
  
  // Ideal ranges
  const isGoodWordLength = avgWordLength >= 4 && avgWordLength <= 8;
  const isGoodSentenceLength = avgSentenceLength >= 5 && avgSentenceLength <= 20;
  
  let score = 70; // Base score
  
  if (isGoodWordLength) score += 15;
  if (isGoodSentenceLength) score += 15;
  
  return Math.min(100, score);
}

function calculateOriginalityScore(tweet: string): number {
  // This would typically involve comparing against a database of previous tweets
  // For now, we'll use some basic heuristics
  const hasNumbers = /\d+/.test(tweet);
  const hasQuotes = /"[^"]+"/.test(tweet);
  const hasAnalysis = /(analysis|review|thoughts|perspective|opinion|explain|how|why|what|when)/i.test(tweet);
  
  let score = 60; // Base score
  
  if (hasNumbers) score += 10;
  if (hasQuotes) score += 15;
  if (hasAnalysis) score += 15;
  
  return Math.min(100, score);
}

function calculateAuthenticityScore(tweet: string): number {
  // Check for authentic content indicators
  const hasPersonalPronoun = /(i|we|my|our)\s/i.test(tweet);
  const hasOpinion = /(think|believe|feel|consider|in my opinion|from my perspective)/i.test(tweet);
  const hasExperience = /(tried|used|tested|experienced|learned|discovered)/i.test(tweet);
  
  let score = 50; // Base score
  
  if (hasPersonalPronoun) score += 15;
  if (hasOpinion) score += 15;
  if (hasExperience) score += 20;
  
  return Math.min(100, score);
}

function generateFeedback(scores: {
  relevanceScore: number;
  qualityScore: number;
  originalityScore: number;
  authenticityScore: number;
  relevantKeywords: string[];
}): string[] {
  const feedback: string[] = [];
  
  if (scores.relevanceScore < 50) {
    feedback.push('Try including more Algorand-specific content and technical details.');
  }
  
  if (scores.qualityScore < 50) {
    feedback.push('Consider writing longer, more detailed content with proper sentence structure.');
  }
  
  if (scores.originalityScore < 50) {
    feedback.push('Make your content more unique by adding personal insights or analysis.');
  }
  
  if (scores.authenticityScore < 50) {
    feedback.push('Share your personal experience or perspective to make the content more authentic.');
  }
  
  if (scores.relevantKeywords.length > 0) {
    feedback.push(`Good use of relevant terms: ${scores.relevantKeywords.join(', ')}`);
  }
  
  return feedback;
}