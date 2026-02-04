# Quick Fix: "Internal Server Error" in Production

## 🚨 Most Common Cause: Database Not Set Up

If you're seeing "Internal server error" when trying to create players or matches, **the database hasn't been set up yet**.

## ✅ Quick Fix (5 minutes)

### Step 1: Create Vercel Postgres Database

1. Go to **Vercel Dashboard**: https://vercel.com/dashboard
2. Click on your project
3. Go to **Storage** tab (in the top menu)
4. Click **Create Database**
5. Select **Postgres**
6. Name it (e.g., `bm-matches-db`)
7. Choose a region
8. Click **Create**

### Step 2: Run Database Schema

1. In the **Storage** tab, click on your newly created database
2. Go to **SQL Editor** tab
3. Open the file `api/schema.sql` from your project
4. Copy **ALL** the contents
5. Paste into the SQL Editor
6. Click **Run** (or press Cmd/Ctrl + Enter)

You should see: "Success. No rows returned"

### Step 3: Verify Tables Were Created

In the SQL Editor, run this query to verify:

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public';
```

You should see:
- `players`
- `matches`
- `player_availability`

### Step 4: Redeploy (if needed)

If you just created the database, Vercel should automatically reconnect. But if errors persist:

1. Go to **Deployments** tab
2. Click the **⋯** menu on latest deployment
3. Click **Redeploy**

Or push a new commit to trigger redeploy.

## ✅ Test It

Try creating a player or match again. It should work now!

## 🔍 Check Function Logs (if still not working)

1. Go to **Deployments** tab
2. Click on latest deployment
3. Click **Functions** tab
4. Click on `/api/players` or `/api/matches`
5. Check the **Logs** tab for detailed error messages

Common errors you might see:
- `relation "players" does not exist` → Schema not run
- `connection refused` → Database not created
- `permission denied` → Database not linked to project

## 📋 Checklist

Before reporting issues, verify:

- [ ] Vercel Postgres database is created
- [ ] Database is linked to your project (should be automatic)
- [ ] Schema has been run (check SQL Editor)
- [ ] Tables exist (run the verification query above)
- [ ] Application has been redeployed after database setup

## 🆘 Still Not Working?

1. **Check Function Logs** (see above)
2. **Verify Environment Variables**: 
   - Go to **Settings** → **Environment Variables**
   - You should see `POSTGRES_URL` (automatic with Vercel Postgres)
3. **Check Database Connection**:
   - In SQL Editor, try: `SELECT 1;` (should return 1)
4. **Contact Support**: Share the error logs from Functions tab

---

**The error message should now be more helpful** - it will tell you if it's a database setup issue!
