// Vercel Serverless Function: /api/matches/:id/availability
import { updateAvailability } from '../../../lib/matches.js';
import { parseBody } from '../../../lib/helpers.js';

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'PATCH, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { id: matchId } = req.query;

  if (!matchId) {
    return res.status(400).json({ error: 'Match id is required' });
  }

  try {
    if (req.method === 'PATCH') {
      const body = await parseBody(req);
      const { playerId, status } = body;
      if (!playerId) {
        return res.status(400).json({ error: 'playerId is required' });
      }
      // status can be 'IN', 'OUT', or null
      await updateAvailability(matchId, playerId, status);
      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: 'Internal server error', message: error.message });
  }
}
