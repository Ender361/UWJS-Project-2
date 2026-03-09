import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

/* A component that creates a small page with details on a Pokémon selected from PokémonList */
const PokemonDetails = () => {
  /* Initialize state and param variables */
  const { name } = useParams();
  const [pokemon, setPokemon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    /* Async function that grabs details from API based on Pokémon name */
    const fetchPokemonDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
        if (!response.ok) {
          throw new Error('Pokémon not found');
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
  if (!pokemon) return <p>No Pokémon found</p>;

  return (
    /* Div with 'back to list' link, Pokémon name, image, and add-to-team button */
    <div className='pokemon-details'>
      <Link to="/">← Back to List</Link>
      <h2>{pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</h2>
      {pokemon.sprites.front_default && (
        <img src={pokemon.sprites.front_default} alt={pokemon.name} style={{ width: '200px', height: '200px' }} />
      )}
      {/* Div with different lines of Pokémon info */}
      <div className='pokemon-info'>
        <p><strong>Height:</strong> {pokemon.height / 10} m</p>
        <p><strong>Weight:</strong> {pokemon.weight / 10} kg</p>
        <p><strong>Base Experience:</strong> {pokemon.base_experience}</p>
        <p><strong>Types:</strong> {pokemon.types.map(type => type.type.name).join(', ')}</p>
        <p><strong>Abilities:</strong> {pokemon.abilities.map(ability => ability.ability.name).join(', ')}</p>
      </div>
      {/* Add to Team button */}
      <button
        onClick={() => {
          /* Get current team from localStorage */
          const team = JSON.parse(localStorage.getItem('pokemonTeam')) || [];
          /* Only add if not already in team and team has less than 3 */
          if (team.length < 3 && !team.some(p => p.name === pokemon.name)) {
            const newTeam = [...team, { name: pokemon.name }];
            localStorage.setItem('pokemonTeam', JSON.stringify(newTeam));
            window.dispatchEvent(new Event('teamUpdated'));
            alert(`${pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)} added to your team!`);
          } else if (team.some(p => p.name === pokemon.name)) {
            alert('This Pokémon is already in your team!');
          } else {
            alert('Your team is full!');
          }
        }}
      >Add Pokémon to Team</button>
    </div>
  );
}

export default PokemonDetails;