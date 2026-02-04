# Vercel Backend Setup Guide

This guide will help you set up the Vercel Postgres database and deploy your application with shared backend storage.

## Prerequisites

- A Vercel account (sign up at https://vercel.com)
- Your project already deployed on Vercel (or ready to deploy)

## Step 1: Create Vercel Postgres Database

1. Go to your Vercel dashboard: https://vercel.com/dashboard
2. Select your project (or create a new one)
3. Go to the **Storage** tab
4. Click **Create Database**
5. Select **Postgres**
6. Choose a name for your database (e.g., `bm-matches-db`)
7. Select a region closest to your users
8. Click **Create**

## Step 2: Set Up Database Schema

1. In your Vercel dashboard, go to your project's **Storage** tab
2. Click on your Postgres database
3. Go to the **SQL Editor** tab
4. Copy and paste the contents of `api/schema.sql` into the editor
5. Click **Run** to execute the SQL

The schema will create:
- `players` table - stores player information
- `matches` table - stores match schedules
- `player_availability` table - stores player availability for each match

## Step 3: Install Dependencies

The required dependency `@vercel/postgres` is already in `package.json`. Install it:

```bash
npm install
```

## Step 4: Environment Variables

Vercel Postgres automatically provides environment variables when you create the database. These are automatically available to your serverless functions:

- `POSTGRES_URL` - Connection string for the database
- `POSTGRES_PRISMA_URL` - Prisma-compatible connection string
- `POSTGRES_URL_NON_POOLING` - Direct connection string

**No manual configuration needed!** Vercel automatically injects these into your serverless functions.

## Step 5: Deploy to Vercel

1. Push your code to GitHub/GitLab/Bitbucket
2. Connect your repository to Vercel (if not already connected)
3. Vercel will automatically detect the changes and deploy

Or deploy manually:

```bash
npm install -g vercel
vercel
```

## Step 6: Verify Deployment

1. After deployment, test the API endpoints:
   - `https://your-app.vercel.app/api/matches` (GET)
   - `https://your-app.vercel.app/api/players` (GET)

2. Test creating a match:
   ```bash
   curl -X POST https://your-app.vercel.app/api/matches \
     -H "Content-Type: application/json" \
     -d '{"matchDate": "2024-12-25"}'
   ```

3. Open your app in multiple browsers/devices to verify shared data

## Step 7: (Optional) Set Up Automatic Cleanup

To automatically remove past matches, you can set up a Vercel Cron Job:

1. Create `vercel.json` cron configuration (already included in project)
2. Or manually trigger cleanup: `POST /api/cleanup`

### Setting up Cron Job

Add to your `vercel.json`:

```json
{
  "crons": [
    {
      "path": "/api/cleanup",
      "schedule": "0 0 * * *"
    }
  ]
}
```

This runs daily at midnight UTC to clean up past matches.

## API Endpoints

### Matches

- `GET /api/matches` - Get all future matches
- `POST /api/matches` - Create a new match
  ```json
  { "matchDate": "2024-12-25" }
  ```
- `PUT /api/matches` - Update match date
  ```json
  { "matchId": "m123", "newDate": "2024-12-26" }
  ```
- `DELETE /api/matches?id=m123` - Delete a match
- `PATCH /api/matches/:id/availability` - Update player availability
  ```json
  { "playerId": "p123", "status": "IN" }
  ```

### Players

- `GET /api/players` - Get all players
- `POST /api/players` - Create a new player
  ```json
  { "name": "John Doe" }
  ```
- `PUT /api/players` - Update player name
  ```json
  { "playerId": "p123", "newName": "Jane Doe" }
  ```
- `DELETE /api/players?id=p123` - Delete a player

## Troubleshooting

### Database Connection Issues

1. Verify the database is created in Vercel dashboard
2. Check that environment variables are set (automatic with Vercel Postgres)
3. Ensure `@vercel/postgres` is installed: `npm install @vercel/postgres`

### API Not Working

1. Check Vercel function logs in the dashboard
2. Verify the API routes are in the `/api` directory
3. Test endpoints directly with curl or Postman

### Data Not Syncing

1. Check browser console for errors
2. Verify API endpoints are accessible
3. Check network tab to see if requests are failing
4. Polling happens every 30 seconds - wait for refresh

## Local Development

For local development, you can use Vercel CLI:

```bash
npm install -g vercel
vercel dev
```

This will:
- Start a local development server
- Connect to your Vercel Postgres database
- Simulate the serverless environment

## Migration from localStorage

The frontend has been updated to use the API instead of localStorage. Old localStorage data will not be migrated automatically. Users will need to:

1. Re-add players (or you can create a migration script)
2. Re-add matches

Alternatively, you can create a one-time migration script to import existing data.

## Support

If you encounter issues:
1. Check Vercel function logs in the dashboard
2. Review the API route handlers in `/api` directory
3. Verify database schema matches `api/schema.sql`

## Next Steps

- ✅ Database is set up
- ✅ API endpoints are created
- ✅ Frontend is updated to use API
- ✅ Polling for real-time updates (30 seconds)
- 🔄 Optional: Set up Vercel Cron for automatic cleanup
- 🔄 Optional: Add authentication for access control
