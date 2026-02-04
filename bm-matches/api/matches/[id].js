// Vercel Serverless Function: /api/matches/:id
import { updateMatch, deleteMatch } from '../../lib/matches.js';
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
    return res.status(400).json({ error: 'Match id is required' });
  }

  try {
    switch (req.method) {
      case 'PUT':
        const body = await parseBody(req);
        const { newDate } = body;
        if (!newDate) {
          return res.status(400).json({ error: 'newDate is required' });
        }
        await updateMatch(id, newDate);
        return res.status(200).json({ success: true });

      case 'DELETE':
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
