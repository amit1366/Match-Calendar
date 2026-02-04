// Helper functions for API routes

/**
 * Parse request body from Vercel serverless function
 * Vercel automatically parses JSON bodies when Content-Type is application/json
 * @param {Object} req - Request object
 * @returns {Promise<Object>} Parsed JSON body
 */
export async function parseBody(req) {
  try {
    // Vercel typically auto-parses JSON bodies, so req.body should be an object
    if (req.body) {
      // If it's already a plain object, return it
      if (typeof req.body === 'object' && req.body.constructor === Object) {
        return req.body;
      }
      // If it's a string, parse it
      if (typeof req.body === 'string') {
        return JSON.parse(req.body);
      }
      // If it's a buffer, convert and parse
      if (Buffer.isBuffer(req.body)) {
        const text = req.body.toString('utf8');
        return text ? JSON.parse(text) : {};
      }
    }
    
    // If body is not available, return empty object
    // (This shouldn't happen with Vercel, but handle gracefully)
    console.warn('Request body not found or in unexpected format');
    return {};
  } catch (error) {
    console.error('Error parsing body:', error);
    return {};
  }
}
