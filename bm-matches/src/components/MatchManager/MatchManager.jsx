import { useState, useEffect } from 'react';
import AddMatchForm from './AddMatchForm';
import MatchList from './MatchList';
import { getMatches, saveMatches } from '../../utils/localStorage';

const MatchManager = ({ players }) => {
  const [matches, setMatches] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);

  // Load matches from localStorage on mount
  useEffect(() => {
    const loadedMatches = getMatches();
    // Sort by date ascending
    const sortedMatches = loadedMatches.sort(
      (a, b) => new Date(a.matchDate) - new Date(b.matchDate)
    );
    setMatches(sortedMatches);
  }, []);

  // When players are added/removed, update all matches to include new players
  useEffect(() => {
    if (players.length >= 0) {
      setMatches((currentMatches) => {
        const updatedMatches = currentMatches.map((match) => {
          const updatedAvailability = { ...match.availability };
          // Add new players to availability (default: null/Not Marked)
          players.forEach((player) => {
            if (!(player.id in updatedAvailability)) {
              updatedAvailability[player.id] = null;
            }
          });
          // Remove deleted players from availability
          const playerIds = new Set(players.map((p) => p.id));
          Object.keys(updatedAvailability).forEach((playerId) => {
            if (!playerIds.has(playerId)) {
              delete updatedAvailability[playerId];
            }
          });
          return {
            ...match,
            availability: updatedAvailability,
          };
        });
        // Only update if there are actual changes
        const hasChanges = updatedMatches.some((updatedMatch, index) => {
          const currentMatch = currentMatches[index];
          return (
            JSON.stringify(updatedMatch.availability) !==
            JSON.stringify(currentMatch?.availability)
          );
        });
        if (hasChanges) {
          saveMatches(updatedMatches);
          return updatedMatches;
        }
        return currentMatches;
      });
    }
  }, [players]);

  const handleAddMatch = (matchDate) => {
    const newMatch = {
      matchId: `m${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      matchDate: matchDate,
      createdAt: new Date().toISOString(),
      availability: {},
    };

    // Initialize availability for all existing players
    players.forEach((player) => {
      newMatch.availability[player.id] = null;
    });

    const updatedMatches = [...matches, newMatch].sort(
      (a, b) => new Date(a.matchDate) - new Date(b.matchDate)
    );
    setMatches(updatedMatches);
    saveMatches(updatedMatches);
  };

  const handleUpdateAvailability = (matchId, playerId, status) => {
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
    saveMatches(updatedMatches);
  };

  const handleEditMatch = (matchId, newDate) => {
    const updatedMatches = matches.map((match) => {
      if (match.matchId === matchId) {
        return {
          ...match,
          matchDate: newDate,
        };
      }
      return match;
    });
    // Re-sort after edit
    const sortedMatches = updatedMatches.sort(
      (a, b) => new Date(a.matchDate) - new Date(b.matchDate)
    );
    setMatches(sortedMatches);
    saveMatches(sortedMatches);
  };

  const handleDeleteMatch = (matchId) => {
    const updatedMatches = matches.filter((match) => match.matchId !== matchId);
    setMatches(updatedMatches);
    saveMatches(updatedMatches);
  };

  const handleAddMatchWithClose = (matchDate) => {
    handleAddMatch(matchDate);
    setShowAddForm(false);
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
      {showAddForm && (
        <AddMatchForm 
          onAddMatch={handleAddMatchWithClose} 
          existingMatches={matches}
          onCancel={() => setShowAddForm(false)}
        />
      )}
      <MatchList
        matches={matches}
        players={players}
        onUpdateAvailability={handleUpdateAvailability}
        onEditMatch={handleEditMatch}
        onDeleteMatch={handleDeleteMatch}
      />
    </div>
  );
};

export default MatchManager;
