// Database connection utility for Vercel Postgres
import { sql } from '@vercel/postgres';

export { sql };

// Helper function to get today's date at midnight
export const getTodayAtMidnight = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
};

// Check if a match date is in the future or today
export const isFutureOrToday = (matchDate) => {
  try {
    const matchDateObj = new Date(matchDate);
    matchDateObj.setHours(0, 0, 0, 0);
    const today = getTodayAtMidnight();
    return matchDateObj >= today;
  } catch (error) {
    console.error('Error checking date:', error);
    return false;
  }
};
