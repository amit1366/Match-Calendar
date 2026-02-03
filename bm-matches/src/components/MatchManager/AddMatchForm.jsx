import { useState } from 'react';

const AddMatchForm = ({ onAddMatch, existingMatches, onCancel }) => {
  const [matchDate, setMatchDate] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!matchDate) {
      setError('Please select a match date');
      return;
    }

    // Check for duplicate dates
    const isDuplicate = existingMatches.some(
      (match) => match.matchDate === matchDate
    );

    if (isDuplicate) {
      setError('A match on this date already exists');
      return;
    }

    // Add match
    onAddMatch(matchDate);
    setMatchDate('');
  };

  // Get today's date in YYYY-MM-DD format for min attribute
  const today = new Date().toISOString().split('T')[0];

  return (
    <form onSubmit={handleSubmit} className="add-match-form">
      <div className="form-group">
        <input
          type="date"
          value={matchDate}
          onChange={(e) => {
            setMatchDate(e.target.value);
            setError('');
          }}
          min={today}
          className="input-field"
          required
        />
        <div className="form-actions">
          <button type="submit" className="btn btn-primary">
            Add Match
          </button>
          {onCancel && (
            <button 
              type="button" 
              onClick={onCancel}
              className="btn btn-secondary"
            >
              Cancel
            </button>
          )}
        </div>
      </div>
      {error && <div className="error-message">{error}</div>}
    </form>
  );
};

export default AddMatchForm;
