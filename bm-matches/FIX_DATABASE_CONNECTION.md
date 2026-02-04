# Fix: "POSTGRES_URL already exists" Error

## Problem

When trying to connect a database, you see:
> "This project already has an existing environment variable with name POSTGRES_URL in one of the chosen environments"

This means your project already has a database connected or a `POSTGRES_URL` environment variable.

## Solution Options

### Option 1: Use the Existing Database (Recommended)

If you already have a database connected, **use it instead of creating a new one**:

1. **Cancel** the connection dialog
2. Go to **Storage** tab in your Vercel project
3. You should see an existing database listed (e.g., "neon-violet-chair")
4. Click on that database
5. Go to **SQL Editor** tab
6. Check if tables exist by running:
   ```sql
   SELECT table_name 
   FROM information_schema.tables 
   WHERE table_schema = 'public';
   ```

**If tables don't exist:**
- Copy contents from `api/schema.sql`
- Paste into SQL Editor
- Click **Run**

**If tables exist:**
- Your database is already set up! Just redeploy your app.

### Option 2: Remove Old Database and Connect New One

If you want to use a different database:

#### Step 1: Remove Old Environment Variables

1. Go to **Settings** → **Environment Variables**
2. Look for:
   - `POSTGRES_URL`
   - `POSTGRES_PRISMA_URL`
   - `POSTGRES_URL_NON_POOLING`
3. Delete these variables (click **⋯** → **Remove**)

#### Step 2: Unlink Old Database (Optional)

1. Go to **Storage** tab
2. If you see an old database, you can:
   - Keep it (if it has data you need)
   - Or delete it (if it's empty/not needed)

#### Step 3: Connect New Database

1. Go to **Storage** tab
2. Click **Create Database** → **Postgres**
3. Name it and create
4. Now connect it (should work without the error)

### Option 3: Use Custom Prefix (Advanced)

If you want to keep both databases:

1. In the connection dialog, set **Custom Prefix** to something like:
   - `MATCH_DB` (instead of leaving it empty)
2. This will create `MATCH_DB_POSTGRES_URL` instead of `POSTGRES_URL`
3. **But you'll need to update your code** to use the new variable name

**Not recommended** unless you really need multiple databases.

## ✅ Recommended: Use Existing Database

**Most likely, you already have a database connected!** Here's what to do:

### Quick Check:

1. Go to **Storage** tab
2. Do you see a database listed? (e.g., "neon-violet-chair")
3. If YES → Use that database (Option 1 above)
4. If NO → Follow Option 2 to remove old variables

### If Database Exists But No Tables:

1. Click on the database in **Storage** tab
2. Go to **SQL Editor**
3. Copy and paste this (from `api/schema.sql`):

```sql
-- Players table
CREATE TABLE IF NOT EXISTS players (
  id VARCHAR(255) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Matches table
CREATE TABLE IF NOT EXISTS matches (
  id VARCHAR(255) PRIMARY KEY,
  match_date DATE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(match_date)
);

-- Player availability table
CREATE TABLE IF NOT EXISTS player_availability (
  id VARCHAR(255) PRIMARY KEY,
  match_id VARCHAR(255) NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
  player_id VARCHAR(255) NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  status VARCHAR(20) CHECK (status IN ('IN', 'OUT', NULL)),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(match_id, player_id)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_matches_date ON matches(match_date);
CREATE INDEX IF NOT EXISTS idx_availability_match ON player_availability(match_id);
CREATE INDEX IF NOT EXISTS idx_availability_player ON player_availability(player_id);
CREATE INDEX IF NOT EXISTS idx_players_created ON players(created_at);
```

4. Click **Run**
5. Redeploy your app

## 🔍 Verify Setup

After fixing, verify:

1. **Check Environment Variables:**
   - Settings → Environment Variables
   - Should see `POSTGRES_URL` (one instance, not duplicates)

2. **Check Database:**
   - Storage tab → Click database
   - SQL Editor → Run: `SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';`
   - Should see 3 tables

3. **Test Your App:**
   - Go to https://match-calendar.vercel.app/
   - Try creating a player or match
   - Should work now!

## 📝 Summary

**Easiest solution:** Use the existing database that's already connected. Just run the schema SQL if tables don't exist.

**If you need a fresh start:** Remove old environment variables, then connect a new database.

---

**The error is just telling you a database is already connected - use it!** ✅
