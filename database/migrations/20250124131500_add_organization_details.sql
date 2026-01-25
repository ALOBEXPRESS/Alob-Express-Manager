-- Migration: Add missing columns to organizations table
-- Date: 2025-01-24

ALTER TABLE public.organizations 
ADD COLUMN IF NOT EXISTS email text,
ADD COLUMN IF NOT EXISTS phone text,
ADD COLUMN IF NOT EXISTS country text,
ADD COLUMN IF NOT EXISTS city text,
ADD COLUMN IF NOT EXISTS state text,
ADD COLUMN IF NOT EXISTS zip text,
ADD COLUMN IF NOT EXISTS address text,
ADD COLUMN IF NOT EXISTS emergency_reserve numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS working_capital numeric DEFAULT 0;
