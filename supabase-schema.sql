-- FitBuddy-AI: Supabase PostgreSQL Database Schema
-- Suitable for BSc Computer Science Project Deployment

-- Enable UUID extension if needed
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table
CREATE TABLE IF NOT EXISTS public.users (
  id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
  name VARCHAR(100) NOT NULL,
  age INTEGER NOT NULL CHECK (age > 0 AND age <= 120),
  gender VARCHAR(20) NOT NULL CHECK (gender IN ('Female', 'Male', 'Other')),
  height NUMERIC(5, 2) NOT NULL CHECK (height > 30 AND height < 300), -- in cm
  weight NUMERIC(5, 2) NOT NULL CHECK (weight > 10 AND weight < 500),  -- in kg
  goal VARCHAR(50) NOT NULL,
  activity VARCHAR(50) NOT NULL,
  workout_preference VARCHAR(100),
  dietary_preference VARCHAR(100),
  available_time VARCHAR(50),
  plan JSONB NOT NULL,
  is_demo BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_goal ON public.users(goal);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON public.users(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_users_is_demo ON public.users(is_demo);

-- Row Level Security (RLS) configuration
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Allow public read access to users table (educational & project demonstration)
CREATE POLICY "Allow public read access to fitbuddy users"
  ON public.users
  FOR SELECT
  USING (true);

-- Allow public insert access for creating fitness plans
CREATE POLICY "Allow public insert for fitness plans"
  ON public.users
  FOR INSERT
  WITH CHECK (true);

-- Allow public deletion (or authenticated admin)
CREATE POLICY "Allow deletion of users"
  ON public.users
  FOR DELETE
  USING (true);

-- Sample comment metadata
COMMENT ON TABLE public.users IS 'Stores FitBuddy-AI users, profile metrics, and generated AI fitness plans';
