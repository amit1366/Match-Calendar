// LocalStorage utility functions for persistence

const PLAYERS_KEY = 'bm-matches-players';
const MATCHES_KEY = 'bm-matches-matches';

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

export const getMatches = () => {
  try {
    const matches = localStorage.getItem(MATCHES_KEY);
    return matches ? JSON.parse(matches) : [];
  } catch (error) {
    console.error('Error loading matches:', error);
    return [];
  }
};

export const saveMatches = (matches) => {
  try {
    localStorage.setItem(MATCHES_KEY, JSON.stringify(matches));
  } catch (error) {
    console.error('Error saving matches:', error);
  }
};
