-- Migration to add guide_progress column to user_preferences table
-- Run this in your Supabase SQL Editor if you already have the user_preferences table

-- Add the guide_progress column if it doesn't exist
ALTER TABLE user_preferences 
ADD COLUMN IF NOT EXISTS guide_progress JSONB DEFAULT '[]';

-- Ensure user_id has a UNIQUE constraint (required for ON CONFLICT)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint
        WHERE conname = 'user_preferences_user_id_key'
    ) THEN
        ALTER TABLE user_preferences ADD CONSTRAINT user_preferences_user_id_key UNIQUE (user_id);
    END IF;
END $$;

-- Update the handle_new_user function to include guide_progress
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO user_preferences (user_id, guide_progress)
    VALUES (NEW.id, '[]'::jsonb)
    ON CONFLICT (user_id) DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update existing records to have empty guide_progress if they don't have it
UPDATE user_preferences 
SET guide_progress = '[]'::jsonb 
WHERE guide_progress IS NULL;
