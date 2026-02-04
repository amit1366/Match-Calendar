# Local Development Guide

## ⚠️ Important: Vercel Serverless Functions

**Vercel serverless functions (`/api` routes) do NOT work with `npm run dev`.**

They only work when:
1. ✅ **Deployed to Vercel** (production)
2. ✅ **Running with `vercel dev`** (local testing)

## Why "Request failed" appears locally

When you run `npm run dev`, the Vite dev server starts, but:
- ❌ The `/api` routes are not available
- ❌ API calls to `/api/matches` and `/api/players` will fail
- ❌ You'll see "Request failed" errors

## Solution: Use `vercel dev` for Local Testing

To test the full application locally (including API routes):

### Step 1: Install Vercel CLI (if not already installed)

```bash
npm install -g vercel
```

### Step 2: Run Vercel Dev

```bash
vercel dev
```

This will:
- ✅ Start a local server that simulates Vercel's environment
- ✅ Make `/api` routes work locally
- ✅ Connect to your Vercel Postgres database
- ✅ Show you the local URL (usually `http://localhost:3000`)

### Step 3: Test Your Application

Open the URL shown by `vercel dev` and test:
- Creating players
- Creating matches
- Updating availability

## Alternative: Deploy to Vercel

If you want to test without `vercel dev`:

1. **Push your code to Git** (GitHub, GitLab, etc.)
2. **Deploy to Vercel** (automatic if connected, or run `vercel`)
3. **Test on the live URL**

The API will work perfectly in production! ✅

## Quick Comparison

| Command | Frontend Works? | API Routes Work? | Database Connected? |
|---------|----------------|------------------|---------------------|
| `npm run dev` | ✅ Yes | ❌ No | ❌ No |
| `vercel dev` | ✅ Yes | ✅ Yes | ✅ Yes |
| Deployed to Vercel | ✅ Yes | ✅ Yes | ✅ Yes |

## Troubleshooting

### "Cannot connect to API" error

**Cause:** Running `npm run dev` instead of `vercel dev`

**Solution:** Stop `npm run dev` and run `vercel dev` instead

### "API routes not available" error

**Cause:** Serverless functions not running

**Solution:** 
- Use `vercel dev` for local testing, OR
- Deploy to Vercel for production testing

### Database connection errors

**Cause:** Database not set up or not connected

**Solution:**
1. Create Vercel Postgres database in dashboard
2. Run `api/schema.sql` in SQL Editor
3. Use `vercel dev` (it auto-connects to your database)

## Summary

- **For quick frontend-only testing:** Use `npm run dev` (API won't work)
- **For full local testing:** Use `vercel dev` (everything works)
- **For production testing:** Deploy to Vercel (everything works)

**Your app WILL work in production!** The "Request failed" error is just because serverless functions need `vercel dev` or deployment to work.
