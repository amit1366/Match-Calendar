// API service layer to replace localStorage
// This handles all communication with the Vercel backend API

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

// Helper function for API requests
async function apiRequest(endpoint, options = {}) {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      // Check if it's a 404 (likely means API routes don't exist locally)
      if (response.status === 404) {
        const isLocalDev = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
        if (isLocalDev) {
          throw new Error('API routes not available. Vercel serverless functions only work when deployed or with "vercel dev". Please run "vercel dev" instead of "npm run dev" to test locally.');
        }
      }
      
      // Try to get error details from response
      const errorData = await response.json().catch(() => ({ error: 'Request failed' }));
      
      // Use the error message from API if available, otherwise use status
      const errorMessage = errorData.error || errorData.message || `HTTP error! status: ${response.status}`;
      
      // Create error with more context
      const error = new Error(errorMessage);
      error.status = response.status;
      error.details = errorData;
      
      throw error;
    }

    return await response.json();
  } catch (error) {
    console.error(`API request failed for ${endpoint}:`, error);
    // Check if it's a network error (likely local dev issue)
    if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
      const isLocalDev = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
      if (isLocalDev) {
        throw new Error('Cannot connect to API. Vercel serverless functions require "vercel dev" for local testing. Run "vercel dev" instead of "npm run dev".');
      }
    }
    throw error;
  }
}

// ==================== MATCHES API ====================

/**
 * Get all future matches from the API
 * @returns {Promise<Array>} Array of match objects
 */
export const getMatches = async () => {
  try {
    const matches = await apiRequest('/matches');
    // Sort by date ascending (earliest first)
    return matches.sort((a, b) => new Date(a.matchDate) - new Date(b.matchDate));
  } catch (error) {
    console.error('Error fetching matches:', error);
    return [];
  }
};

/**
 * Create a new match
 * @param {string} matchDate - Date in YYYY-MM-DD format
 * @returns {Promise<Object>} Created match object
 */
export const createMatch = async (matchDate) => {
  return await apiRequest('/matches', {
    method: 'POST',
    body: JSON.stringify({ matchDate }),
  });
};

/**
 * Update a match date
 * @param {string} matchId - Match ID
 * @param {string} newDate - New date in YYYY-MM-DD format
 * @returns {Promise<Object>} Success response
 */
export const updateMatch = async (matchId, newDate) => {
  return await apiRequest(`/matches/${matchId}`, {
    method: 'PUT',
    body: JSON.stringify({ newDate }),
  });
};

/**
 * Delete a match
 * @param {string} matchId - Match ID
 * @returns {Promise<Object>} Success response
 */
export const deleteMatch = async (matchId) => {
  return await apiRequest(`/matches/${matchId}`, {
    method: 'DELETE',
  });
};

/**
 * Update player availability for a match
 * @param {string} matchId - Match ID
 * @param {string} playerId - Player ID
 * @param {string|null} status - 'IN', 'OUT', or null
 * @returns {Promise<Object>} Success response
 */
export const updateAvailability = async (matchId, playerId, status) => {
  return await apiRequest(`/matches/${matchId}/availability`, {
    method: 'PATCH',
    body: JSON.stringify({ playerId, status }),
  });
};

// ==================== PLAYERS API ====================

/**
 * Get all players from the API
 * @returns {Promise<Array>} Array of player objects
 */
export const getPlayers = async () => {
  try {
    return await apiRequest('/players');
  } catch (error) {
    console.error('Error fetching players:', error);
    return [];
  }
};

/**
 * Create a new player
 * @param {string} name - Player name
 * @returns {Promise<Object>} Created player object
 */
export const createPlayer = async (name) => {
  return await apiRequest('/players', {
    method: 'POST',
    body: JSON.stringify({ name }),
  });
};

/**
 * Update a player name
 * @param {string} playerId - Player ID
 * @param {string} newName - New player name
 * @returns {Promise<Object>} Success response
 */
export const updatePlayer = async (playerId, newName) => {
  return await apiRequest(`/players/${playerId}`, {
    method: 'PUT',
    body: JSON.stringify({ newName }),
  });
};

/**
 * Delete a player
 * @param {string} playerId - Player ID
 * @returns {Promise<Object>} Success response
 */
export const deletePlayer = async (playerId) => {
  return await apiRequest(`/players/${playerId}`, {
    method: 'DELETE',
  });
};

// ==================== UTILITY FUNCTIONS ====================

/**
 * Check if a match date is in the future or today
 * @param {string} matchDate - Date string in YYYY-MM-DD format
 * @returns {boolean} True if the date is today or in the future
 */
export const isFutureOrToday = (matchDate) => {
  try {
    const matchDateObj = new Date(matchDate);
    matchDateObj.setHours(0, 0, 0, 0);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return matchDateObj >= today;
  } catch (error) {
    console.error('Error checking date:', error);
    return false;
  }
};

/**
 * Filter out past matches, keeping only today and future dates
 * @param {Array} matches - Array of match objects
 * @returns {Array} Filtered array with only future/current matches
 */
export const filterPastMatches = (matches) => {
  if (!Array.isArray(matches)) {
    return [];
  }
  return matches.filter((match) => {
    if (!match || !match.matchDate) {
      return false;
    }
    return isFutureOrToday(match.matchDate);
  });
};
