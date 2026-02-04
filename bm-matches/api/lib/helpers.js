// Helper functions for API routes

/**
 * Parse request body from Vercel serverless function
 * @param {Request} req - Request object
 * @returns {Promise<Object>} Parsed JSON body
 */
export async function parseBody(req) {
  try {
    // For Vercel serverless functions, body might be a stream or already parsed
    if (req.body) {
      // If already parsed (Vercel sometimes does this)
      return typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    }
    // Try to read as text and parse
    const text = await req.text();
    return text ? JSON.parse(text) : {};
  } catch (error) {
    console.error('Error parsing body:', error);
    return {};
  }
}
