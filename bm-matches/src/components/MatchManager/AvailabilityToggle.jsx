const AvailabilityToggle = ({ playerId, availability, onToggle }) => {
  const getButtonClass = (status) => {
    const baseClass = 'availability-btn';
    if (availability === status) {
      return `${baseClass} ${baseClass}-${status.toLowerCase()} ${baseClass}-active`;
    }
    return `${baseClass} ${baseClass}-${status.toLowerCase()}`;
  };

  return (
    <div className="availability-toggle">
      <button
        type="button"
        onClick={() => onToggle(playerId, 'IN')}
        className={getButtonClass('IN')}
        aria-label={`Mark ${availability === 'IN' ? 'as not IN' : 'as IN'}`}
      >
        IN
      </button>
      <button
        type="button"
        onClick={() => onToggle(playerId, 'OUT')}
        className={getButtonClass('OUT')}
        aria-label={`Mark ${availability === 'OUT' ? 'as not OUT' : 'as OUT'}`}
      >
        OUT
      </button>
    </div>
  );
};

export default AvailabilityToggle;
