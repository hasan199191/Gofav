/*
  # Add INSERT policy for profiles table

  1. Changes
    - Add new RLS policy to allow authenticated users to insert their own profile

  2. Security
    - Only allows users to insert a profile with their own user_id
    - Maintains existing SELECT and UPDATE policies
*/

CREATE POLICY "Users can insert own profile"
ON public.profiles
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);