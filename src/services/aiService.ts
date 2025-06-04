import { HfInference } from '@huggingface/inference';
import { config } from '../utils/config';

const hf = new HfInference(config.huggingface.apiKey);

export const aiService = {
  async analyzeTweet(tweet: string): Promise<{
    score: number;
    details: {
      originality: number;
      relevance: number;
      quality: number;
      authenticity: number;
      spamProbability: number;
    };
  }> {
    try {
      // Analyze tweet content using DistilBERT
      const response = await hf.textClassification({
        model: 'distilbert-base-uncased',
        inputs: tweet,
      });

      // Process the classification results
      const score = calculateScore(response, tweet);
      
      return {
        score: score.total,
        details: {
          originality: score.originality,
          relevance: score.relevance,
          quality: score.quality,
          authenticity: score.authenticity,
          spamProbability: score.spamProbability,
        },
      };
    } catch (error) {
      console.error('Error analyzing tweet:', error);
      throw error;
    }
  }
};

function calculateScore(
  classification: any,
  tweet: string
): {
  total: number;
  originality: number;
  relevance: number;
  quality: number;
  authenticity: number;
  spamProbability: number;
} {
  // Basic content checks
  const words = tweet.split(/\s+/).filter(word => word.length > 0);
  const hashtagCount = (tweet.match(/#/g) || []).length;
  const mentionCount = (tweet.match(/@/g) || []).length;
  const urlCount = (tweet.match(/https?:\/\/[^\s]+/g) || []).length;

  // Calculate individual scores
  const lengthScore = Math.min(100, (words.length / 20) * 100);
  const spamScore = Math.max(0, 100 - (hashtagCount * 10 + mentionCount * 5 + urlCount * 15));
  
  // Check for Algorand-related keywords
  const algorandKeywords = [
    'algorand',
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
  ];

  const relevanceScore = calculateRelevanceScore(tweet.toLowerCase(), algorandKeywords);
  const originalityScore = 70; // Base score, would need comparison with existing tweets
  const qualityScore = calculateQualityScore(tweet);
  const authenticityScore = calculateAuthenticityScore(tweet);

  // Calculate total score
  const total = Math.round(
    (relevanceScore * 0.3) +
    (originalityScore * 0.2) +
    (qualityScore * 0.25) +
    (authenticityScore * 0.15) +
    (spamScore * 0.1)
  );

  return {
    total,
    originality: originalityScore,
    relevance: relevanceScore,
    quality: qualityScore,
    authenticity: authenticityScore,
    spamProbability: 100 - spamScore,
  };
}

function calculateRelevanceScore(tweet: string, keywords: string[]): number {
  const matchedKeywords = keywords.filter(keyword => tweet.includes(keyword));
  return Math.min(100, (matchedKeywords.length / keywords.length) * 100);
}

function calculateQualityScore(tweet: string): number {
  const sentences = tweet.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const words = tweet.split(/\s+/).filter(word => word.length > 0);
  
  const avgWordLength = words.join('').length / words.length;
  const avgSentenceLength = words.length / sentences.length;
  
  let score = 70; // Base score
  
  if (avgWordLength >= 4 && avgWordLength <= 8) score += 15;
  if (avgSentenceLength >= 5 && avgSentenceLength <= 20) score += 15;
  
  return Math.min(100, score);
}

function calculateAuthenticityScore(tweet: string): number {
  const hasPersonalPronoun = /(i|we|my|our)\s/i.test(tweet);
  const hasOpinion = /(think|believe|feel|consider|opinion|perspective)/i.test(tweet);
  const hasExperience = /(tried|used|tested|experienced|learned|discovered)/i.test(tweet);
  
  let score = 50; // Base score
  
  if (hasPersonalPronoun) score += 15;
  if (hasOpinion) score += 15;
  if (hasExperience) score += 20;
  
  return Math.min(100, score);
}