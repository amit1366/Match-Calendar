// Vercel Serverless Function: /api/players
import { getPlayers, createPlayer, updatePlayer, deletePlayer, initializePlayerAvailability } from './lib/players.js';
import { parseBody } from './lib/helpers.js';

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    switch (req.method) {
      case 'GET':
        const players = await getPlayers();
        return res.status(200).json(players);

      case 'POST':
        const body = await parseBody(req);
        const { name } = body;
        if (!name) {
          return res.status(400).json({ error: 'name is required' });
        }
        const newPlayer = await createPlayer(name);
        // Initialize availability for all existing matches
        await initializePlayerAvailability(newPlayer.id);
        return res.status(201).json(newPlayer);

      case 'PUT':
        const putBody = await parseBody(req);
        const { playerId, newName } = putBody;
        if (!playerId || !newName) {
          return res.status(400).json({ error: 'playerId and newName are required' });
        }
        await updatePlayer(playerId, newName);
        return res.status(200).json({ success: true });

      case 'DELETE':
        const { id } = req.query;
        if (!id) {
          return res.status(400).json({ error: 'player id is required' });
        }
        await deletePlayer(id);
        return res.status(200).json({ success: true });

      default:
        return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('API Error:', error);
    console.error('Error stack:', error.stack);
    return res.status(500).json({ 
      error: 'Internal server error', 
      message: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}
