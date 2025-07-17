# Guide Progress Persistence Setup

This document explains how to set up persistent guide progress tracking in ExpenseTracker.

## Database Setup

### For New Installations

If you're setting up ExpenseTracker from scratch, simply run the main `supabase-setup.sql` file which includes the `guide_progress` column.

### For Existing Installations

If you already have the `user_preferences` table set up, you need to run the migration to add the `guide_progress` column:

1. Open your Supabase dashboard
2. Go to the SQL Editor
3. Run the `guide-progress-migration.sql` file

```sql
-- This will add the guide_progress column to existing tables
ALTER TABLE user_preferences 
ADD COLUMN IF NOT EXISTS guide_progress JSONB DEFAULT '[]';
```

## How It Works

The guide progress system uses a dual-storage approach:

### 1. LocalStorage (Immediate Persistence)
- Progress is saved immediately to browser localStorage
- Persists across browser refreshes
- Works even when offline
- Key: `expensetracker_guide_progress`

### 2. Supabase Database (Cross-Device Sync)
- Progress is synced to the user's profile in Supabase
- Persists across devices and logout/login cycles
- Stored in `user_preferences.guide_progress` as a JSONB array
- Contains guide IDs that have been completed

### Data Flow

1. **On Load**: 
   - First loads from localStorage for immediate display
   - Then fetches from Supabase and syncs with localStorage
   
2. **On Save**: 
   - Immediately saves to localStorage
   - Asynchronously saves to Supabase
   - Updates the UI immediately

3. **On Login**:
   - Loads progress from Supabase
   - Syncs with localStorage
   - Merges any offline progress

## Guide Progress Data Structure

The progress is stored as an array of completed guide IDs:

```json
[1, 3, 4]  // User has completed guides 1, 3, and 4
```

## Development Features

In development mode, a "Reset Progress" button is available to clear all progress for testing purposes.

## Troubleshooting

### If progress isn't persisting:

1. Check browser console for error messages
2. Verify Supabase connection is working
3. Ensure user is properly authenticated
4. Check that the `guide_progress` column exists in the database

### Manual database check:

```sql
-- Check if the column exists
SELECT column_name 
FROM information_schema.columns 
WHERE table_name = 'user_preferences' 
  AND column_name = 'guide_progress';

-- View current progress for a user
SELECT user_id, guide_progress 
FROM user_preferences 
WHERE user_id = 'user-id-here';
```