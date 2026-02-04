// Vercel Serverless Function: /api/cleanup - Cleanup past matches
// This can be called periodically via Vercel Cron Jobs
import { cleanupPastMatches } from './lib/matches.js';

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    if (req.method === 'POST') {
      const result = await cleanupPastMatches();
      return res.status(200).json({ 
        success: true, 
        deletedCount: result.deletedCount 
      });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: 'Internal server error', message: error.message });
  }
}
