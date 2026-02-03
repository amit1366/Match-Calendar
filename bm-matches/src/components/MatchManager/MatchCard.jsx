import { useState } from 'react';
import PlayerAvailabilityRow from './PlayerAvailabilityRow';

const REQUIRED_PLAYERS = 11; // Minimum players needed for a match

const MatchCard = ({ match, players, onUpdateAvailability, onEditMatch, onDeleteMatch }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editDate, setEditDate] = useState(match.matchDate);
  const [editError, setEditError] = useState('');
  const [showDetails, setShowDetails] = useState(false);

  const handleToggleAvailability = (playerId, status) => {
    const currentStatus = match.availability?.[playerId];
    // Toggle: if clicking the same status, set to null (Not Marked)
    const newStatus = currentStatus === status ? null : status;
    onUpdateAvailability(match.matchId, playerId, newStatus);
  };

  const handleStartEdit = () => {
    setIsEditing(true);
    setEditDate(match.matchDate);
    setEditError('');
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditDate(match.matchDate);
    setEditError('');
  };

  const handleSaveEdit = () => {
    setEditError('');
    if (!editDate) {
      setEditError('Please select a date');
      return;
    }
    onEditMatch(match.matchId, editDate);
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this match?')) {
      onDeleteMatch(match.matchId);
    }
  };

  // Calculate summary statistics and group players by status
  const stats = {
    in: 0,
    out: 0,
    notResponded: 0,
  };

  const playersIn = [];
  const playersOut = [];
  const playersNotResponded = [];

  players.forEach((player) => {
    const status = match.availability?.[player.id];
    if (status === 'IN') {
      stats.in++;
      playersIn.push(player);
    } else if (status === 'OUT') {
      stats.out++;
      playersOut.push(player);
    } else {
      stats.notResponded++;
      playersNotResponded.push(player);
    }
  });

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="match-card">
      <div className="match-card-header">
        {isEditing ? (
          <div className="edit-match-form">
            <input
              type="date"
              value={editDate}
              onChange={(e) => {
                setEditDate(e.target.value);
                setEditError('');
              }}
              className="input-field input-field-small"
              min={new Date().toISOString().split('T')[0]}
            />
            <div className="edit-actions">
              <button
                onClick={handleSaveEdit}
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
              <div className="error-message error-message-small">{editError}</div>
            )}
          </div>
        ) : (
          <>
            <div 
              className="match-date-header"
              onClick={() => setShowDetails(!showDetails)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setShowDetails(!showDetails);
                }
              }}
            >
              <h3 className="match-date">{formatDate(match.matchDate)}</h3>
              <span className={`toggle-icon ${showDetails ? 'toggle-icon-open' : ''}`}>
                ▼
              </span>
            </div>
            <div className="match-actions">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleStartEdit();
                }}
                className="btn btn-small btn-secondary"
                aria-label="Edit match date"
              >
                Edit
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete();
                }}
                className="btn btn-small btn-danger"
                aria-label="Delete match"
              >
                Delete
              </button>
            </div>
          </>
        )}
      </div>

      {/* Progress Bar and Summary */}
      <div className="match-progress-section">
        <div className="match-status-header">
          <div>
            <span className="match-date-short">{formatDate(match.matchDate)}</span>
          </div>
          {stats.in >= REQUIRED_PLAYERS && (
            <span className="confirmed-badge">Confirmed</span>
          )}
        </div>
        
        <div className="progress-bar-container">
          <div className="progress-bar">
            {players.length > 0 && (
              <>
                <div 
                  className="progress-segment progress-in" 
                  style={{ width: `${(stats.in / players.length) * 100}%` }}
                ></div>
                <div 
                  className="progress-segment progress-out" 
                  style={{ width: `${(stats.out / players.length) * 100}%` }}
                ></div>
                <div 
                  className="progress-segment progress-pending" 
                  style={{ width: `${(stats.notResponded / players.length) * 100}%` }}
                ></div>
              </>
            )}
          </div>
        </div>
        
        <div className="match-summary-text">
          <span className="summary-text-item">{stats.in} Going</span>
          <span className="summary-separator">•</span>
          <span className="summary-text-item">{stats.out} Out</span>
          <span className="summary-separator">•</span>
          <span className="summary-text-item">{stats.notResponded} Pending</span>
        </div>
      </div>

      {showDetails && (
        <>
          {/* Player Names by Status */}
          <div className="players-by-status">
            {playersIn.length > 0 && (
              <div className="status-group status-group-in">
                <h4 className="status-group-title">
                  <span className="status-indicator status-indicator-in"></span>
                  Players IN ({playersIn.length})
                </h4>
                <div className="player-names-list">
                  {playersIn.map((player) => (
                    <span key={player.id} className="player-name-badge player-name-badge-in">
                      {player.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {playersOut.length > 0 && (
              <div className="status-group status-group-out">
                <h4 className="status-group-title">
                  <span className="status-indicator status-indicator-out"></span>
                  Players OUT ({playersOut.length})
                </h4>
                <div className="player-names-list">
                  {playersOut.map((player) => (
                    <span key={player.id} className="player-name-badge player-name-badge-out">
                      {player.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {playersNotResponded.length > 0 && (
              <div className="status-group status-group-not-responded">
                <h4 className="status-group-title">
                  <span className="status-indicator status-indicator-not-responded"></span>
                  Not Responded ({playersNotResponded.length})
                </h4>
                <div className="player-names-list">
                  {playersNotResponded.map((player) => (
                    <span key={player.id} className="player-name-badge player-name-badge-not-responded">
                      {player.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {stats.in < REQUIRED_PLAYERS && (
            <div className="warning-message">
              ⚠️ Warning: Only {stats.in} player{stats.in !== 1 ? 's' : ''} IN. 
              Need at least {REQUIRED_PLAYERS} players.
            </div>
          )}

          <div className="player-availability-list">
            {players.length === 0 ? (
              <div className="empty-state">
                <p>No players added yet. Add players in the Player Management section.</p>
              </div>
            ) : (
              players.map((player) => (
                <PlayerAvailabilityRow
                  key={player.id}
                  player={player}
                  availability={match.availability?.[player.id] || null}
                  onToggle={handleToggleAvailability}
                />
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default MatchCard;
