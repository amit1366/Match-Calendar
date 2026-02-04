// Business logic for matches
import { sql, isFutureOrToday } from '../db.js';

// GET /api/matches - Get all future matches
export async function getMatches() {
  try {
    // Get all matches with their availability data
    const matches = await sql`
      SELECT 
        m.id,
        m.match_date,
        m.created_at,
        json_agg(
          json_build_object(
            'player_id', pa.player_id,
            'status', pa.status
          )
        ) FILTER (WHERE pa.player_id IS NOT NULL) as availability
      FROM matches m
      LEFT JOIN player_availability pa ON m.id = pa.match_id
      WHERE m.match_date >= CURRENT_DATE
      GROUP BY m.id, m.match_date, m.created_at
      ORDER BY m.match_date ASC
    `;

    // Transform the data to match frontend format
    const formattedMatches = matches.rows.map((match) => {
      const availability = {};
      
      // Parse availability array if it exists (json_agg returns null if no rows)
      if (match.availability && Array.isArray(match.availability)) {
        match.availability.forEach((item) => {
          if (item && item.player_id) {
            availability[item.player_id] = item.status;
          }
        });
      }

      return {
        matchId: match.id,
        matchDate: match.match_date,
        createdAt: match.created_at,
        availability: availability,
      };
    });

    return formattedMatches;
  } catch (error) {
    console.error('Error fetching matches:', error);
    throw error;
  }
}

// POST /api/matches - Create a new match
export async function createMatch(matchDate) {
  try {
    // Check if match already exists
    const existing = await sql`
      SELECT id FROM matches WHERE match_date = ${matchDate}
    `;
    
    if (existing.rows.length > 0) {
      throw new Error('A match on this date already exists');
    }
    
    const matchId = `m${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    // Insert match
    const result = await sql`
      INSERT INTO matches (id, match_date, created_at)
      VALUES (${matchId}, ${matchDate}, NOW())
      RETURNING id, match_date, created_at
    `;

    if (result.rows.length === 0) {
      throw new Error('Failed to create match');
    }

    // Get all players to initialize availability
    const players = await sql`SELECT id FROM players`;
    
    // Initialize availability for all players (null status)
    if (players.rows.length > 0) {
      const availabilityInserts = players.rows.map((player) => {
        const availabilityId = `a${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        return sql`
          INSERT INTO player_availability (id, match_id, player_id, status, updated_at)
          VALUES (${availabilityId}, ${matchId}, ${player.id}, NULL, NOW())
          ON CONFLICT (match_id, player_id) DO NOTHING
        `;
      });
      
      await Promise.all(availabilityInserts);
    }

    return { 
      matchId, 
      matchDate, 
      createdAt: result.rows[0].created_at || new Date().toISOString(), 
      availability: {} 
    };
  } catch (error) {
    console.error('Error creating match:', error);
    // Re-throw with more context
    if (error.message.includes('relation') || error.message.includes('does not exist')) {
      throw new Error('Database tables not found. Please run the schema.sql file in your Vercel Postgres database.');
    }
    throw error;
  }
}

// PUT /api/matches/:id - Update a match (change date)
export async function updateMatch(matchId, newDate) {
  try {
    await sql`
      UPDATE matches
      SET match_date = ${newDate}
      WHERE id = ${matchId}
    `;

    return { success: true };
  } catch (error) {
    console.error('Error updating match:', error);
    throw error;
  }
}

// DELETE /api/matches/:id - Delete a match
export async function deleteMatch(matchId) {
  try {
    await sql`
      DELETE FROM matches
      WHERE id = ${matchId}
    `;

    return { success: true };
  } catch (error) {
    console.error('Error deleting match:', error);
    throw error;
  }
}

// PATCH /api/matches/:id/availability - Update player availability
export async function updateAvailability(matchId, playerId, status) {
  try {
    const availabilityId = `a${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    if (status === null) {
      // Delete availability record
      await sql`
        DELETE FROM player_availability
        WHERE match_id = ${matchId} AND player_id = ${playerId}
      `;
    } else {
      // Insert or update availability
      await sql`
        INSERT INTO player_availability (id, match_id, player_id, status, updated_at)
        VALUES (${availabilityId}, ${matchId}, ${playerId}, ${status}, NOW())
        ON CONFLICT (match_id, player_id)
        DO UPDATE SET status = ${status}, updated_at = NOW()
      `;
    }

    return { success: true };
  } catch (error) {
    console.error('Error updating availability:', error);
    throw error;
  }
}

// Cleanup past matches (can be called periodically)
export async function cleanupPastMatches() {
  try {
    const result = await sql`
      DELETE FROM matches
      WHERE match_date < CURRENT_DATE
      RETURNING id
    `;

    return { deletedCount: result.rows.length };
  } catch (error) {
    console.error('Error cleaning up past matches:', error);
    throw error;
  }
}
