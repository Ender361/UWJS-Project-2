import React, { useState } from 'react';
import { Link } from 'react-router-dom';

/* A component that fetches a certain number of pokemon from the api, then returns an array of pokemon objects */
const MAX_POKEMON = 1025;

const PokemonList = () => {
  /* Initialize state variables */
  const [pokemon, setPokemon] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [numPokemon, setNumPokemon] = useState('');

  const handleFetchPokemon = async (e) => {
    e.preventDefault();
    const num = parseInt(numPokemon);
    
    if (isNaN(num) || num < 1 || num > MAX_POKEMON) {
      setError(`Please enter a number between 1 and ${MAX_POKEMON}`);
      return;
    }

    setLoading(true);
    setError(null);
    setPokemon([]);
    
    try {
      const promises = [];
      /* For loop that grabs the user-specified amount of pokemon */
      for (let i = 1; i <= num; i++) {
        promises.push(fetch(`https://pokeapi.co/api/v2/pokemon/${i}`).then(res => res.json()));
      }
      const results = await Promise.all(promises);
      setPokemon(results);
      console.log(results);
    } catch (err) {
      setError('Failed to fetch Pokémon.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="pokemon-list-container">
      {error && <p style={{color: 'red'}}>{error}</p>}
      {pokemon.length === 0 ? (
        <div className="pokemon-input-form">
          <h2>How many Pokémon would you like to see? (1-{MAX_POKEMON})</h2>
          <form onSubmit={handleFetchPokemon}>
            <input
              type="number"
              value={numPokemon}
              onChange={(e) => setNumPokemon(e.target.value)}
              placeholder={`Enter number (1-${MAX_POKEMON})`}
              min="1"
              max={MAX_POKEMON}
            />
            <button type="submit">Load Pokémon</button>
          </form>
        </div>
      ) : (
        <div className="pokemon-list">
          {pokemon.map(poke => (
            <Link key={poke.id} to={`/pokemon/${poke.name}`} style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className="pokemon-card">
                <h3>{poke.name.charAt(0).toUpperCase() + poke.name.slice(1)}</h3>
                <img src={poke.sprites.front_default} alt={poke.name} />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default PokemonList;
