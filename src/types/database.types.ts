export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          user_id: string
          twitter_id: string | null
          twitter_username: string | null
          twitter_name: string | null
          twitter_profile_image: string | null
          total_points: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          twitter_id?: string | null
          twitter_username?: string | null
          twitter_name?: string | null
          twitter_profile_image?: string | null
          total_points?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          twitter_id?: string | null
          twitter_username?: string | null
          twitter_name?: string | null
          twitter_profile_image?: string | null
          total_points?: number
          created_at?: string
          updated_at?: string
        }
      }
      tweets: {
        Row: {
          id: string
          profile_id: string
          twitter_tweet_id: string
          content: string
          analysis_score: number | null
          analysis_details: Json | null
          status: string
          created_at: string
          analyzed_at: string | null
        }
        Insert: {
          id?: string
          profile_id: string
          twitter_tweet_id: string
          content: string
          analysis_score?: number | null
          analysis_details?: Json | null
          status?: string
          created_at?: string
          analyzed_at?: string | null
        }
        Update: {
          id?: string
          profile_id?: string
          twitter_tweet_id?: string
          content?: string
          analysis_score?: number | null
          analysis_details?: Json | null
          status?: string
          created_at?: string
          analyzed_at?: string | null
        }
      }
    }
  }
}