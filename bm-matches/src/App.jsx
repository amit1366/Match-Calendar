import { useState } from 'react';
import PlayerManager from './components/PlayerManager/PlayerManager';
import MatchManager from './components/MatchManager/MatchManager';
import './App.css';

function App() {
  const [players, setPlayers] = useState([]);

  const handlePlayersChange = (updatedPlayers) => {
    setPlayers(updatedPlayers);
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>BM Matches</h1>
        <p className="subtitle">Team Match & Player Availability Management</p>
      </header>

      <main className="app-main">
        <div className="content-wrapper">
          <aside className="sidebar">
            <PlayerManager onPlayersChange={handlePlayersChange} />
          </aside>

          <section className="main-content">
            <MatchManager players={players} />
          </section>
        </div>
      </main>

      <footer className="app-footer">
        <p>Built for local team management</p>
      </footer>
    </div>
  );
}

export default App;
