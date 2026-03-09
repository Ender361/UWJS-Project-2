import './App.css';
import PokemonList from './components/PokemonList';
import PokemonDetails from './components/PokemonDetails';
import TeamQuickView from './components/TeamQuickView';
import TeamDetails from './components/TeamDetails';
import { Routes, Route, Link, useLocation } from 'react-router-dom';

function App() {
  /* The JSX returned */
  const location = useLocation();
  return (
    <div className="App">
      <h1>Pokedex & My Team</h1>
      <nav style={{ marginBottom: '20px' }}>
        <Link to="/">Home</Link> | <Link to="/team">Team Details</Link>
      </nav>
      {location.pathname !== '/team' && <TeamQuickView />}
      <Routes>
        <Route path="/" element={<PokemonList />} />
        <Route path="/pokemon/:name" element={<PokemonDetails />} />
        <Route path="/team" element={<TeamDetails />} />
      </Routes>
    </div>
  );
}

export default App;
