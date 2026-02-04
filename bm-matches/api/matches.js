// Vercel Serverless Function: /api/matches
import { getMatches, createMatch, updateMatch, deleteMatch } from './lib/matches.js';
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
        const matches = await getMatches();
        return res.status(200).json(matches);

      case 'POST':
        const body = await parseBody(req);
        const { matchDate } = body;
        if (!matchDate) {
          return res.status(400).json({ error: 'matchDate is required' });
        }
        const newMatch = await createMatch(matchDate);
        return res.status(201).json(newMatch);

      case 'PUT':
        const putBody = await parseBody(req);
        const { matchId, newDate } = putBody;
        if (!matchId || !newDate) {
          return res.status(400).json({ error: 'matchId and newDate are required' });
        }
        await updateMatch(matchId, newDate);
        return res.status(200).json({ success: true });

      case 'DELETE':
        const { id } = req.query;
        if (!id) {
          return res.status(400).json({ error: 'match id is required' });
        }
        await deleteMatch(id);
        return res.status(200).json({ success: true });

      default:
        return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: 'Internal server error', message: error.message });
  }
}
