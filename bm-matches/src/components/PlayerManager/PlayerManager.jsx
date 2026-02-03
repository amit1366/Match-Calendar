import { useState, useEffect } from 'react';
import AddPlayerForm from './AddPlayerForm';
import PlayerList from './PlayerList';
import { getPlayers, savePlayers } from '../../utils/localStorage';

const PlayerManager = ({ onPlayersChange }) => {
  const [players, setPlayers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Load players from localStorage on mount
  useEffect(() => {
    const loadedPlayers = getPlayers();
    setPlayers(loadedPlayers);
  }, []);

  // Notify parent when players change
  useEffect(() => {
    if (onPlayersChange) {
      onPlayersChange(players);
    }
  }, [players, onPlayersChange]);

  const handleAddPlayer = (name) => {
    const newPlayer = {
      id: `p${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: name,
    };
    const updatedPlayers = [...players, newPlayer];
    setPlayers(updatedPlayers);
    savePlayers(updatedPlayers);
  };

  const handleEditPlayer = (playerId, newName) => {
    const updatedPlayers = players.map((player) =>
      player.id === playerId ? { ...player, name: newName } : player
    );
    setPlayers(updatedPlayers);
    savePlayers(updatedPlayers);
  };

  const handleDeletePlayer = (playerId) => {
    if (window.confirm('Are you sure you want to delete this player? This will remove them from all matches.')) {
      const updatedPlayers = players.filter((player) => player.id !== playerId);
      setPlayers(updatedPlayers);
      savePlayers(updatedPlayers);
    }
  };

  // Filter players based on search query
  const filteredPlayers = players.filter((player) =>
    player.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="player-manager">
      <h2>Player Management</h2>
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
      <PlayerList
        players={filteredPlayers}
        onEditPlayer={handleEditPlayer}
        onDeletePlayer={handleDeletePlayer}
      />
    </div>
  );
};

export default PlayerManager;
