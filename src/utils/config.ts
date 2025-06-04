export const config = {
  twitter: {
    apiKey: import.meta.env.VITE_TWITTER_API_KEY || '',
    apiKeySecret: import.meta.env.VITE_TWITTER_API_SECRET || '',
    bearerToken: import.meta.env.VITE_TWITTER_BEARER_TOKEN || '',
    clientId: import.meta.env.VITE_TWITTER_CLIENT_ID || '',
    clientSecret: import.meta.env.VITE_TWITTER_CLIENT_SECRET || '',
    callbackUrl: import.meta.env.VITE_TWITTER_CALLBACK_URL || 'https://splendorous-nougat-e9130a.netlify.app/callback'
  },
  huggingface: {
    apiKey: import.meta.env.VITE_HUGGING_FACE_TOKEN || '',
    model: 'distilbert-base-uncased'
  }
};