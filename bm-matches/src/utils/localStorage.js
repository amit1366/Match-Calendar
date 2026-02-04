// LocalStorage utility functions for persistence

const PLAYERS_KEY = 'bm-matches-players';
const MATCHES_KEY = 'bm-matches-matches';

/**
 * Get today's date at midnight (00:00:00) in local timezone
 * This ensures we compare dates correctly without time components
 * @returns {Date} Today's date at midnight
 */
const getTodayAtMidnight = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
};

/**
 * Check if a match date is in the future or today
 * @param {string} matchDate - Date string in YYYY-MM-DD format
 * @returns {boolean} True if the date is today or in the future
 */
export const isFutureOrToday = (matchDate) => {
  try {
    // Parse the match date (YYYY-MM-DD format)
    const matchDateObj = new Date(matchDate);
    matchDateObj.setHours(0, 0, 0, 0);
    
    const today = getTodayAtMidnight();
    
    // Return true if match date is today or in the future
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
    // Check if match has a valid date
    if (!match || !match.matchDate) {
      return false;
    }
    
    // Keep only future or today's matches
    return isFutureOrToday(match.matchDate);
  });
};

/**
 * Clean up past matches from localStorage
 * This removes matches that have already passed
 * @returns {Array} Array of matches that were removed
 */
export const cleanupPastMatches = () => {
  try {
    const allMatches = getMatches();
    const futureMatches = filterPastMatches(allMatches);
    const pastMatches = allMatches.filter((match) => !isFutureOrToday(match.matchDate));
    
    // Only update if there were past matches to remove
    if (pastMatches.length > 0) {
      saveMatches(futureMatches);
      console.log(`Cleaned up ${pastMatches.length} past match(es)`);
    }
    
    return pastMatches;
  } catch (error) {
    console.error('Error cleaning up past matches:', error);
    return [];
  }
};

// Player management functions
export const getPlayers = () => {
  try {
    const players = localStorage.getItem(PLAYERS_KEY);
    return players ? JSON.parse(players) : [];
  } catch (error) {
    console.error('Error loading players:', error);
    return [];
  }
};

export const savePlayers = (players) => {
  try {
    localStorage.setItem(PLAYERS_KEY, JSON.stringify(players));
  } catch (error) {
    console.error('Error saving players:', error);
  }
};

/**
 * Get all matches from localStorage (including past ones)
 * Use this when you need to access all historical data
 * @returns {Array} All matches stored in localStorage
 */
export const getMatches = () => {
  try {
    const matches = localStorage.getItem(MATCHES_KEY);
    return matches ? JSON.parse(matches) : [];
  } catch (error) {
    console.error('Error loading matches:', error);
    return [];
  }
};

/**
 * Get only future and current matches from localStorage
 * This automatically filters out past matches
 * @returns {Array} Only future/current matches
 */
export const getFutureMatches = () => {
  const allMatches = getMatches();
  return filterPastMatches(allMatches);
};

/**
 * Save matches to localStorage
 * Automatically removes past matches before saving
 * @param {Array} matches - Array of match objects to save
 */
export const saveMatches = (matches) => {
  try {
    // First, filter out any past matches from the array being saved
    const futureMatches = filterPastMatches(matches);
    
    // Save only future matches
    localStorage.setItem(MATCHES_KEY, JSON.stringify(futureMatches));
  } catch (error) {
    console.error('Error saving matches:', error);
  }
};
