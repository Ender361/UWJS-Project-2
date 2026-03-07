import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

/* A component that creates a small page with details on a pokemon selected from PokemonList */
const PokemonDetails = () => {
  /* Initialize state variables */
  const { name } = useParams();
  const [pokemon, setPokemon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPokemonDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
        if (!response.ok) {
          throw new Error('Pokemon not found');
        }
        const data = await response.json();
        setPokemon(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (name) {
      fetchPokemonDetails();
    }
  }, [name]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{color: 'red'}}>Error: {error}</p>;
  if (!pokemon) return <p>No Pokemon found</p>;

  return (
    <div className='pokemon-details'>
      <Link to="/">← Back to List</Link>
      <h2>{pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</h2>
      {pokemon.sprites.front_default && (
        <img src={pokemon.sprites.front_default} alt={pokemon.name} style={{ width: '200px', height: '200px' }} />
      )}
      <div className='pokemon-info'>
        <p><strong>Height:</strong> {pokemon.height / 10} m</p>
        <p><strong>Weight:</strong> {pokemon.weight / 10} kg</p>
        <p><strong>Base Experience:</strong> {pokemon.base_experience}</p>
        <p><strong>Types:</strong> {pokemon.types.map(type => type.type.name).join(', ')}</p>
        <p><strong>Abilities:</strong> {pokemon.abilities.map(ability => ability.ability.name).join(', ')}</p>
      </div>
    </div>
  );
}

export default PokemonDetails;