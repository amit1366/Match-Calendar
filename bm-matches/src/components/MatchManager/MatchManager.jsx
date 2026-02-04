import { useState, useEffect, useCallback } from 'react';
import AddMatchForm from './AddMatchForm';
import MatchList from './MatchList';
import { 
  getMatches, 
  createMatch, 
  updateMatch, 
  deleteMatch, 
  updateAvailability 
} from '../../utils/api';

const MatchManager = ({ players }) => {
  const [matches, setMatches] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load matches from API on mount and set up polling
  const loadMatches = useCallback(async () => {
    try {
      setError(null);
      const loadedMatches = await getMatches();
      setMatches(loadedMatches);
    } catch (err) {
      console.error('Error loading matches:', err);
      setError('Failed to load matches. Please refresh the page.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    loadMatches();
  }, [loadMatches]);

  // Poll for updates every 30 seconds (near real-time)
  useEffect(() => {
    const pollInterval = setInterval(() => {
      loadMatches();
    }, 30000); // Poll every 30 seconds

    // Also reload when page becomes visible (user returns to tab)
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        loadMatches();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearInterval(pollInterval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [loadMatches]);

  const handleAddMatch = async (matchDate) => {
    try {
      setError(null);
      const newMatch = await createMatch(matchDate);
      
      // Reload matches to get the latest data from server
      await loadMatches();
      setShowAddForm(false);
    } catch (err) {
      console.error('Error creating match:', err);
      let errorMessage = err.message || 'Failed to create match. Please try again.';
      
      // Provide helpful messages for common errors
      if (errorMessage.includes('Database not set up') || 
          errorMessage.includes('Database tables not found') ||
          errorMessage.includes('relation') ||
          errorMessage.includes('does not exist')) {
        errorMessage = 'Database not set up. Please: 1) Create Vercel Postgres database in dashboard, 2) Run schema.sql in SQL Editor, 3) Redeploy. See VERCEL_SETUP.md for details.';
      } else if (errorMessage.includes('connection')) {
        errorMessage = 'Database connection failed. Please check your Vercel Postgres database setup.';
      }
      
      setError(errorMessage);
    }
  };

  const handleUpdateAvailability = async (matchId, playerId, status) => {
    try {
      setError(null);
      // Optimistically update UI
      const updatedMatches = matches.map((match) => {
        if (match.matchId === matchId) {
          const updatedAvailability = { ...match.availability };
          if (status === null) {
            delete updatedAvailability[playerId];
          } else {
            updatedAvailability[playerId] = status;
          }
          return {
            ...match,
            availability: updatedAvailability,
          };
        }
        return match;
      });
      setMatches(updatedMatches);

      // Update on server
      await updateAvailability(matchId, playerId, status);
      
      // Reload to ensure consistency (or remove this for faster UX)
      // await loadMatches();
    } catch (err) {
      console.error('Error updating availability:', err);
      setError('Failed to update availability. Please try again.');
      // Reload on error to get correct state
      await loadMatches();
    }
  };

  const handleEditMatch = async (matchId, newDate) => {
    try {
      setError(null);
      await updateMatch(matchId, newDate);
      
      // Reload matches to ensure we only have future ones
      // This handles the case where a match date was edited to a past date
      await loadMatches();
    } catch (err) {
      console.error('Error updating match:', err);
      setError('Failed to update match. Please try again.');
    }
  };

  const handleDeleteMatch = async (matchId) => {
    try {
      setError(null);
      await deleteMatch(matchId);
      
      // Remove from local state immediately
      setMatches(matches.filter((match) => match.matchId !== matchId));
    } catch (err) {
      console.error('Error deleting match:', err);
      setError('Failed to delete match. Please try again.');
      // Reload on error
      await loadMatches();
    }
  };

  const handleAddMatchWithClose = (matchDate) => {
    handleAddMatch(matchDate);
  };

  return (
    <div className="match-manager">
      <div className="match-manager-header">
        <h2>Match Management</h2>
        <button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="btn btn-primary btn-add-match"
        >
          Add Match
        </button>
      </div>
      {error && (
        <div className="error-message" style={{ margin: '10px 0', padding: '10px', background: '#fee', color: '#c33', borderRadius: '4px' }}>
          {error}
        </div>
      )}
      {loading && (
        <div style={{ padding: '20px', textAlign: 'center' }}>Loading matches...</div>
      )}
      {showAddForm && (
        <AddMatchForm 
          onAddMatch={handleAddMatchWithClose} 
          existingMatches={matches}
          onCancel={() => setShowAddForm(false)}
        />
      )}
      {!loading && (
        <MatchList
          matches={matches}
          players={players}
          onUpdateAvailability={handleUpdateAvailability}
          onEditMatch={handleEditMatch}
          onDeleteMatch={handleDeleteMatch}
        />
      )}
    </div>
  );
};

export default MatchManager;
