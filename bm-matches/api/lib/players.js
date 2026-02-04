// Business logic for players
import { sql } from '../db.js';

// GET /api/players - Get all players
export async function getPlayers() {
  try {
    const result = await sql`
      SELECT id, name, created_at
      FROM players
      ORDER BY created_at ASC
    `;

    return result.rows.map((player) => ({
      id: player.id,
      name: player.name,
    }));
  } catch (error) {
    console.error('Error fetching players:', error);
    throw error;
  }
}

// POST /api/players - Create a new player
export async function createPlayer(name) {
  try {
    const playerId = `p${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    await sql`
      INSERT INTO players (id, name, created_at)
      VALUES (${playerId}, ${name}, NOW())
    `;

    return { id: playerId, name };
  } catch (error) {
    console.error('Error creating player:', error);
    throw error;
  }
}

// PUT /api/players/:id - Update a player
export async function updatePlayer(playerId, newName) {
  try {
    await sql`
      UPDATE players
      SET name = ${newName}
      WHERE id = ${playerId}
    `;

    return { success: true };
  } catch (error) {
    console.error('Error updating player:', error);
    throw error;
  }
}

// DELETE /api/players/:id - Delete a player
export async function deletePlayer(playerId) {
  try {
    await sql`
      DELETE FROM players
      WHERE id = ${playerId}
    `;

    return { success: true };
  } catch (error) {
    console.error('Error deleting player:', error);
    throw error;
  }
}

// When a player is added, initialize their availability for all existing matches
export async function initializePlayerAvailability(playerId) {
  try {
    const matches = await sql`
      SELECT id FROM matches WHERE match_date >= CURRENT_DATE
    `;

    if (matches.rows.length > 0) {
      const availabilityInserts = matches.rows.map((match) => {
        const availabilityId = `a${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        return sql`
          INSERT INTO player_availability (id, match_id, player_id, status, updated_at)
          VALUES (${availabilityId}, ${match.id}, ${playerId}, NULL, NOW())
          ON CONFLICT (match_id, player_id) DO NOTHING
        `;
      });

      await Promise.all(availabilityInserts);
    }

    return { success: true };
  } catch (error) {
    console.error('Error initializing player availability:', error);
    throw error;
  }
}
