import { useState } from 'react';

const AddPlayerForm = ({ onAddPlayer, existingPlayers }) => {
  const [playerName, setPlayerName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    const trimmedName = playerName.trim();

    // Validation
    if (!trimmedName) {
      setError('Player name cannot be empty');
      return;
    }

    // Check for duplicates (case-insensitive)
    const isDuplicate = existingPlayers.some(
      (player) => player.name.toLowerCase() === trimmedName.toLowerCase()
    );

    if (isDuplicate) {
      setError('Player name already exists');
      return;
    }

    // Add player
    onAddPlayer(trimmedName);
    setPlayerName('');
  };

  return (
    <form onSubmit={handleSubmit} className="add-player-form">
      <div className="form-group">
        <input
          type="text"
          value={playerName}
          onChange={(e) => {
            setPlayerName(e.target.value);
            setError('');
          }}
          placeholder="Enter player name"
          className="input-field"
          maxLength={50}
        />
        <button type="submit" className="btn btn-primary">
          Add Player
        </button>
      </div>
      {error && <div className="error-message">{error}</div>}
    </form>
  );
};

export default AddPlayerForm;
