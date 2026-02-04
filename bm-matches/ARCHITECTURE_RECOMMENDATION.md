# Architecture Recommendation: Multi-User Match Scheduling System

## Current State
- **Storage**: Browser localStorage (per-user, isolated)
- **Data Model**: 
  - Players: `{ id, name }`
  - Matches: `{ matchId, matchDate, createdAt, availability: { playerId: status } }`
- **Features**: Match scheduling, player availability tracking, automatic past match filtering

## Requirements
1. ✅ Shared database accessible by all users
2. ✅ Real-time or refresh-based updates
3. ✅ Automatic removal/hiding of past matches
4. ✅ All users see the same data

---

## Recommended Solutions (Ranked)

### 🥇 **Option 1: Supabase (Recommended)**

**Why Supabase?**
- ✅ Real-time subscriptions built-in
- ✅ PostgreSQL database (robust, scalable)
- ✅ Auto-generated REST API
- ✅ Built-in authentication (for future use)
- ✅ Generous free tier (500MB database, 2GB bandwidth)
- ✅ Easy to set up and deploy
- ✅ Open source

**Architecture:**
```
Frontend (React) 
    ↓
Supabase Client SDK
    ↓
Supabase (PostgreSQL + Real-time + REST API)
```

**Database Schema:**
```sql
-- Players table
CREATE TABLE players (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Matches table
CREATE TABLE matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  match_date DATE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(match_date)
);

-- Player availability table (many-to-many)
CREATE TABLE player_availability (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id UUID REFERENCES matches(id) ON DELETE CASCADE,
  player_id UUID REFERENCES players(id) ON DELETE CASCADE,
  status VARCHAR(20) CHECK (status IN ('available', 'unavailable', NULL)),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(match_id, player_id)
);

-- Index for performance
CREATE INDEX idx_matches_date ON matches(match_date);
CREATE INDEX idx_availability_match ON player_availability(match_id);
CREATE INDEX idx_availability_player ON player_availability(player_id);
```

**Implementation Steps:**
1. Create Supabase project at https://supabase.com
2. Run SQL schema in Supabase SQL editor
3. Install `@supabase/supabase-js` in frontend
4. Replace localStorage calls with Supabase API calls
5. Set up real-time subscriptions for live updates

**Pros:**
- Real-time updates automatically
- No backend code needed
- PostgreSQL is production-ready
- Easy to add auth later
- Good documentation

**Cons:**
- Vendor lock-in (though open source)
- Requires internet connection

---

### 🥈 **Option 2: Firebase/Firestore**

**Why Firebase?**
- ✅ Real-time updates out of the box
- ✅ No backend code required
- ✅ Google infrastructure (reliable)
- ✅ Free tier: 1GB storage, 10GB/month transfer
- ✅ Very easy to set up

**Architecture:**
```
Frontend (React)
    ↓
Firebase SDK
    ↓
Firestore Database
```

**Database Structure:**
```javascript
// Collections:
players: {
  [playerId]: {
    name: string,
    createdAt: timestamp
  }
}

matches: {
  [matchId]: {
    matchDate: string (YYYY-MM-DD),
    createdAt: timestamp,
    availability: {
      [playerId]: 'available' | 'unavailable' | null
    }
  }
}
```

**Implementation Steps:**
1. Create Firebase project at https://firebase.google.com
2. Enable Firestore Database
3. Install `firebase` package
4. Replace localStorage with Firestore calls
5. Set up real-time listeners

**Pros:**
- Easiest setup
- Excellent real-time support
- Good free tier
- Google reliability

**Cons:**
- NoSQL (less structured queries)
- Vendor lock-in
- Pricing can scale up

---

### 🥉 **Option 3: Node.js + Express + PostgreSQL**

**Why Custom Backend?**
- ✅ Full control over API
- ✅ Can add custom business logic
- ✅ Easy to add authentication/authorization
- ✅ No vendor lock-in
- ✅ Can deploy anywhere (Vercel, Railway, Render, etc.)

**Architecture:**
```
Frontend (React)
    ↓
REST API / WebSocket
    ↓
Node.js + Express
    ↓
PostgreSQL Database
```

**Tech Stack:**
- **Backend**: Node.js + Express
- **Database**: PostgreSQL (or SQLite for simple deployments)
- **ORM**: Prisma or Sequelize
- **Real-time**: Socket.io (optional) or polling
- **Hosting**: Railway, Render, Fly.io, or Vercel (serverless functions)

**API Endpoints:**
```
GET    /api/matches          - Get all future matches
POST   /api/matches          - Create match
PUT    /api/matches/:id      - Update match
DELETE /api/matches/:id     - Delete match
PATCH  /api/matches/:id/availability - Update player availability

GET    /api/players          - Get all players
POST   /api/players          - Create player
PUT    /api/players/:id      - Update player
DELETE /api/players/:id     - Delete player
```

**Implementation Steps:**
1. Set up Node.js + Express project
2. Set up PostgreSQL database
3. Create database schema
4. Build REST API endpoints
5. Add automatic cleanup job for past matches (cron)
6. Update frontend to use API instead of localStorage
7. Optionally add Socket.io for real-time updates

**Pros:**
- Complete control
- Can customize everything
- Good for learning
- No vendor dependencies

**Cons:**
- More setup work
- Need to host backend
- Need to handle real-time yourself
- More maintenance

---

### **Option 4: Supabase Edge Functions (Serverless)**

Similar to Option 1, but with serverless functions for custom logic if needed.

---

## My Recommendation: **Supabase**

For your use case, **Supabase** offers the best balance:
1. **Quick setup** - Get running in 30 minutes
2. **Real-time** - Built-in subscriptions
3. **PostgreSQL** - Robust, relational database
4. **Free tier** - Sufficient for most teams
5. **Future-proof** - Easy to add auth, file storage, etc.

---

## Implementation Plan (Supabase)

### Phase 1: Setup (30 min)
1. Create Supabase account and project
2. Create database tables (run SQL schema)
3. Install Supabase client: `npm install @supabase/supabase-js`
4. Create Supabase client configuration file

### Phase 2: Replace localStorage (2-3 hours)
1. Create API service layer to replace `localStorage.js`
2. Update `MatchManager.jsx` to use Supabase
3. Update `PlayerManager.jsx` to use Supabase
4. Add real-time subscriptions for live updates

### Phase 3: Past Match Cleanup (1 hour)
1. Set up database function/trigger to auto-hide past matches
2. Or use Supabase Edge Function (cron job)
3. Update queries to filter past matches

### Phase 4: Testing & Deployment (1 hour)
1. Test with multiple browser tabs/users
2. Verify real-time updates work
3. Deploy frontend (already on Vercel)

---

## Database Cleanup Strategy

### Option A: Query-time Filtering (Recommended)
Always filter past matches in queries:
```sql
SELECT * FROM matches 
WHERE match_date >= CURRENT_DATE 
ORDER BY match_date ASC;
```

### Option B: Scheduled Cleanup
Run a daily cron job (Supabase Edge Function or pg_cron):
```sql
DELETE FROM matches WHERE match_date < CURRENT_DATE;
```

### Option C: Soft Delete
Add `is_active` flag, mark past matches as inactive:
```sql
UPDATE matches 
SET is_active = false 
WHERE match_date < CURRENT_DATE;
```

**Recommendation**: Use Option A (query-time filtering) for simplicity.

---

## Real-time Updates Strategy

### Supabase Real-time:
```javascript
// Subscribe to matches changes
supabase
  .channel('matches')
  .on('postgres_changes', 
    { event: '*', schema: 'public', table: 'matches' },
    (payload) => {
      // Update UI
    }
  )
  .subscribe();
```

### Polling Alternative (if real-time not needed):
Refresh data every 30-60 seconds or on user actions.

---

## Cost Comparison

| Solution | Free Tier | Paid Starts At |
|----------|-----------|----------------|
| Supabase | 500MB DB, 2GB bandwidth | $25/month |
| Firebase | 1GB storage, 10GB transfer | Pay-as-you-go |
| Custom Backend | Varies by host | $5-20/month |

---

## Next Steps

1. **Choose your solution** (I recommend Supabase)
2. **I can help implement** the chosen solution
3. **Set up the database schema**
4. **Replace localStorage with API calls**
5. **Add real-time subscriptions**

Would you like me to proceed with implementing the Supabase solution?
