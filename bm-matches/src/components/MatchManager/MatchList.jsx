import MatchCard from './MatchCard';

const MatchList = ({ matches, players, onUpdateAvailability, onEditMatch, onDeleteMatch }) => {
  if (matches.length === 0) {
    return (
      <div className="empty-state">
        <p>No matches scheduled yet. Add your first match above!</p>
      </div>
    );
  }

  return (
    <div className="match-list">
      {matches.map((match) => (
        <MatchCard
          key={match.matchId}
          match={match}
          players={players}
          onUpdateAvailability={onUpdateAvailability}
          onEditMatch={onEditMatch}
          onDeleteMatch={onDeleteMatch}
        />
      ))}
    </div>
  );
};

export default MatchList;
