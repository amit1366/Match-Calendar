import { useState } from 'react';

const PlayerList = ({ players, onEditPlayer, onDeletePlayer }) => {
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');
  const [editError, setEditError] = useState('');

  const handleStartEdit = (player) => {
    setEditingId(player.id);
    setEditName(player.name);
    setEditError('');
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditName('');
    setEditError('');
  };

  const handleSaveEdit = (playerId) => {
    setEditError('');
    const trimmedName = editName.trim();

    if (!trimmedName) {
      setEditError('Player name cannot be empty');
      return;
    }

    // Check for duplicates (excluding current player)
    const isDuplicate = players.some(
      (player) =>
        player.id !== playerId &&
        player.name.toLowerCase() === trimmedName.toLowerCase()
    );

    if (isDuplicate) {
      setEditError('Player name already exists');
      return;
    }

    onEditPlayer(playerId, trimmedName);
    setEditingId(null);
    setEditName('');
    setEditError('');
  };

  if (players.length === 0) {
    return (
      <div className="empty-state">
        <p>No players added yet. Add your first player above!</p>
      </div>
    );
  }

  return (
    <div className="player-list">
      <h3>Players ({players.length})</h3>
      <ul className="player-list-items">
        {players.map((player) => (
          <li key={player.id} className="player-item">
            {editingId === player.id ? (
              <div className="edit-player-form">
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => {
                    setEditName(e.target.value);
                    setEditError('');
                  }}
                  className="input-field input-field-small"
                  maxLength={50}
                  autoFocus
                />
                <div className="edit-actions">
                  <button
                    onClick={() => handleSaveEdit(player.id)}
                    className="btn btn-small btn-success"
                  >
                    Save
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="btn btn-small btn-secondary"
                  >
                    Cancel
                  </button>
                </div>
                {editError && (
                  <div className="error-message error-message-small">
                    {editError}
                  </div>
                )}
              </div>
            ) : (
              <div className="player-item-content">
                <span className="player-name">{player.name}</span>
                <div className="player-actions">
                  <button
                    onClick={() => handleStartEdit(player)}
                    className="btn btn-small btn-secondary"
                    aria-label={`Edit ${player.name}`}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDeletePlayer(player.id)}
                    className="btn btn-small btn-danger"
                    aria-label={`Delete ${player.name}`}
                  >
                    Delete
                  </button>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PlayerList;
