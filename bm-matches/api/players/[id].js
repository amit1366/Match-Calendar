// Vercel Serverless Function: /api/players/:id
import { updatePlayer, deletePlayer } from '../../lib/players.js';
import { parseBody } from '../../lib/helpers.js';

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ error: 'Player id is required' });
  }

  try {
    switch (req.method) {
      case 'PUT':
        const body = await parseBody(req);
        const { newName } = body;
        if (!newName) {
          return res.status(400).json({ error: 'newName is required' });
        }
        await updatePlayer(id, newName);
        return res.status(200).json({ success: true });

      case 'DELETE':
        await deletePlayer(id);
        return res.status(200).json({ success: true });

      default:
        return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: 'Internal server error', message: error.message });
  }
}
