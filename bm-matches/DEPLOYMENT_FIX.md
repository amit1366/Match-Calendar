# Fix: "Database connection failed" on Live Site

Your app is deployed at: **https://match-calendar.vercel.app/**

The error "Database connection failed" means the Vercel Postgres database needs to be set up.

## 🔧 Step-by-Step Fix

### Step 1: Go to Vercel Dashboard

1. Open: https://vercel.com/dashboard
2. Find and click on your project (likely named `match-calendar` or `bm-matches`)

### Step 2: Create Postgres Database

1. In your project, click the **Storage** tab (top menu)
2. Click **Create Database** button
3. Select **Postgres**
4. Enter a name (e.g., `match-calendar-db`)
5. Choose a region (closest to your users)
6. Click **Create**

**Important:** Vercel will automatically:
- Link the database to your project
- Add environment variables (`POSTGRES_URL`)
- Make it available to your serverless functions

### Step 3: Run Database Schema

1. In the **Storage** tab, click on your newly created database
2. Click the **SQL Editor** tab
3. Open the file `api/schema.sql` from your project
4. Copy **ALL** the SQL code
5. Paste it into the SQL Editor
6. Click **Run** (or press Cmd/Ctrl + Enter)

You should see: ✅ **"Success. No rows returned"**

### Step 4: Verify Tables Were Created

In the SQL Editor, run this query:

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public';
```

You should see 3 tables:
- ✅ `players`
- ✅ `matches`  
- ✅ `player_availability`

### Step 5: Redeploy Your App

After creating the database, you need to redeploy:

**Option A: Automatic (Recommended)**
- Push a new commit to your Git repository
- Vercel will auto-deploy

**Option B: Manual Redeploy**
1. Go to **Deployments** tab
2. Click **⋯** (three dots) on the latest deployment
3. Click **Redeploy**

### Step 6: Test Your App

Go to: https://match-calendar.vercel.app/

Try:
- ✅ Creating a player
- ✅ Creating a match
- ✅ Setting player availability

It should work now! 🎉

## 🔍 Verify Environment Variables

To make sure the database is connected:

1. Go to **Settings** → **Environment Variables**
2. You should see:
   - `POSTGRES_URL`
   - `POSTGRES_PRISMA_URL`
   - `POSTGRES_URL_NON_POOLING`

If these are missing, the database isn't linked. Go back to Step 2.

## 🐛 Check Function Logs (If Still Not Working)

1. Go to **Deployments** tab
2. Click on the latest deployment
3. Click **Functions** tab
4. Click on `/api/players` or `/api/matches`
5. Check the **Logs** tab

Look for errors like:
- `relation "players" does not exist` → Schema not run (go to Step 3)
- `connection refused` → Database not created (go to Step 2)
- `permission denied` → Database not linked (recreate database)

## ✅ Quick Checklist

Before testing, verify:

- [ ] Postgres database created in Storage tab
- [ ] Database schema (`api/schema.sql`) has been run
- [ ] Tables exist (verified with SQL query)
- [ ] Environment variables are present (Settings → Environment Variables)
- [ ] App has been redeployed after database setup

## 📝 Common Issues

### Issue: "Database not found"
**Solution:** Make sure you created the database in the same project where your app is deployed.

### Issue: "Tables don't exist"
**Solution:** Run the schema SQL again in the SQL Editor.

### Issue: "Still getting connection error after setup"
**Solution:** 
1. Wait 1-2 minutes for environment variables to propagate
2. Redeploy your app
3. Check function logs for specific error

## 🆘 Still Having Issues?

1. **Check the exact error** in Function Logs (see above)
2. **Verify database is linked**: Settings → Environment Variables should show `POSTGRES_URL`
3. **Test database connection**: In SQL Editor, run `SELECT 1;` (should return 1)

---

**After completing these steps, your app at https://match-calendar.vercel.app/ should work perfectly!** ✅
