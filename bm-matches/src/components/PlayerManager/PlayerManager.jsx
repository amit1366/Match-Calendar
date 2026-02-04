import { useState, useEffect, useCallback } from 'react';
import AddPlayerForm from './AddPlayerForm';
import PlayerList from './PlayerList';
import { getPlayers, createPlayer, updatePlayer, deletePlayer } from '../../utils/api';

const PlayerManager = ({ onPlayersChange }) => {
  const [players, setPlayers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load players from API
  const loadPlayers = useCallback(async () => {
    try {
      setError(null);
      const loadedPlayers = await getPlayers();
      setPlayers(loadedPlayers);
    } catch (err) {
      console.error('Error loading players:', err);
      setError('Failed to load players. Please refresh the page.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    loadPlayers();
  }, [loadPlayers]);

  // Poll for updates every 30 seconds (near real-time)
  useEffect(() => {
    const pollInterval = setInterval(() => {
      loadPlayers();
    }, 30000); // Poll every 30 seconds

    // Also reload when page becomes visible
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        loadPlayers();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearInterval(pollInterval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [loadPlayers]);

  // Notify parent when players change
  useEffect(() => {
    if (onPlayersChange) {
      onPlayersChange(players);
    }
  }, [players, onPlayersChange]);

  const handleAddPlayer = async (name) => {
    try {
      setError(null);
      const newPlayer = await createPlayer(name);
      // Reload to get latest data (including availability initialization)
      await loadPlayers();
    } catch (err) {
      console.error('Error creating player:', err);
      setError('Failed to create player. Please try again.');
    }
  };

  const handleEditPlayer = async (playerId, newName) => {
    try {
      setError(null);
      // Optimistically update UI
      setPlayers(players.map((player) =>
        player.id === playerId ? { ...player, name: newName } : player
      ));
      
      await updatePlayer(playerId, newName);
      // Reload to ensure consistency
      await loadPlayers();
    } catch (err) {
      console.error('Error updating player:', err);
      setError('Failed to update player. Please try again.');
      // Reload on error
      await loadPlayers();
    }
  };

  const handleDeletePlayer = async (playerId) => {
    if (window.confirm('Are you sure you want to delete this player? This will remove them from all matches.')) {
      try {
        setError(null);
        await deletePlayer(playerId);
        // Remove from local state immediately
        setPlayers(players.filter((player) => player.id !== playerId));
      } catch (err) {
        console.error('Error deleting player:', err);
        setError('Failed to delete player. Please try again.');
        // Reload on error
        await loadPlayers();
      }
    }
  };

  // Filter players based on search query
  const filteredPlayers = players.filter((player) =>
    player.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="player-manager">
      <h2>Player Management</h2>
      {error && (
        <div className="error-message" style={{ margin: '10px 0', padding: '10px', background: '#fee', color: '#c33', borderRadius: '4px' }}>
          {error}
        </div>
      )}
      {loading && (
        <div style={{ padding: '20px', textAlign: 'center' }}>Loading players...</div>
      )}
      <div className="search-container">
        <input
          type="text"
          placeholder="Search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
        <span className="search-icon">🔍</span>
      </div>
      <AddPlayerForm onAddPlayer={handleAddPlayer} existingPlayers={players} />
      {!loading && (
        <PlayerList
          players={filteredPlayers}
          onEditPlayer={handleEditPlayer}
          onDeletePlayer={handleDeletePlayer}
        />
      )}
    </div>
  );
};

export default PlayerManager;
