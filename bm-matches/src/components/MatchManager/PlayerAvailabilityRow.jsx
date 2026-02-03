import AvailabilityToggle from './AvailabilityToggle';

const PlayerAvailabilityRow = ({ player, availability, onToggle }) => {
  return (
    <div className="player-availability-row">
      <span className="player-name-row">{player.name}</span>
      <AvailabilityToggle
        playerId={player.id}
        availability={availability}
        onToggle={onToggle}
      />
    </div>
  );
};

export default PlayerAvailabilityRow;
