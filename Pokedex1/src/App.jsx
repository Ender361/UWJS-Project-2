import './App.css';
import PokemonList from './components/PokemonList';
import PokemonDetails from './components/PokemonDetails';
import { Routes, Route, Link } from 'react-router-dom';

function App() {


  /* The JSX returned */
  return (
    <div className="App">
      <h1>Pokedex</h1>
      <Routes>
        <Route path="/" element={<PokemonList />} />
        <Route path="/pokemon/:name" element={<PokemonDetails />} />
      </Routes>
    </div>
  );
}

export default App
