# Troubleshooting Guide

## Common Issues and Solutions

### Issue: "Failed to create player/match. Please try again."

This error can occur for several reasons:

#### 1. **Database Not Set Up** (Most Common)

**Symptoms:**
- Error when creating players or matches
- API calls return 500 errors

**Solution:**
1. Go to your Vercel dashboard
2. Navigate to your project → **Storage** tab
3. Create a Postgres database if you haven't already
4. Go to the **SQL Editor** in your database
5. Copy and paste the contents of `api/schema.sql`
6. Click **Run** to execute the SQL
7. Redeploy your application

#### 2. **Running Locally Without Vercel Dev**

**Symptoms:**
- API calls fail when running `npm run dev`
- 404 errors on `/api/*` endpoints

**Solution:**
Vercel serverless functions only work when:
- Deployed to Vercel, OR
- Running with `vercel dev`

To test locally:
```bash
npm install -g vercel
vercel dev
```

This will:
- Start a local server that simulates Vercel's environment
- Connect to your Vercel Postgres database
- Make API routes work locally

#### 3. **Database Connection Issues**

**Symptoms:**
- Error messages mentioning "relation does not exist" or "connection"
- Functions work but database queries fail

**Solution:**
1. Verify your Postgres database is created in Vercel
2. Check that environment variables are set (automatic with Vercel Postgres)
3. Verify the schema has been run (check tables exist in SQL Editor)
4. Check Vercel function logs for detailed error messages

#### 4. **Request Body Parsing Issues**

**Symptoms:**
- API receives requests but body is empty
- "matchDate is required" or "name is required" errors

**Solution:**
- Check browser console for network errors
- Verify `Content-Type: application/json` header is sent
- Check Vercel function logs for request details

## How to Check Vercel Function Logs

1. Go to Vercel dashboard
2. Select your project
3. Go to **Deployments** tab
4. Click on the latest deployment
5. Click on **Functions** tab
6. Click on the function that's failing (e.g., `/api/matches`)
7. View the logs to see detailed error messages

## Testing the API Directly

You can test the API endpoints directly using curl:

```bash
# Test creating a player
curl -X POST https://your-app.vercel.app/api/players \
  -H "Content-Type: application/json" \
  -d '{"name": "Test Player"}'

# Test creating a match
curl -X POST https://your-app.vercel.app/api/matches \
  -H "Content-Type: application/json" \
  -d '{"matchDate": "2024-12-25"}'

# Test getting players
curl https://your-app.vercel.app/api/players

# Test getting matches
curl https://your-app.vercel.app/api/matches
```

## Quick Checklist

Before reporting issues, verify:

- [ ] Vercel Postgres database is created
- [ ] Database schema (`api/schema.sql`) has been run
- [ ] Application is deployed to Vercel (not just running locally)
- [ ] `@vercel/postgres` is installed (`npm install`)
- [ ] No errors in browser console
- [ ] No errors in Vercel function logs

## Getting More Detailed Errors

The API now includes better error messages. Check:

1. **Browser Console** - For frontend errors
2. **Vercel Function Logs** - For backend errors
3. **Network Tab** - To see the actual API request/response

If you see "Database tables not found" error, that means the schema hasn't been run yet.
