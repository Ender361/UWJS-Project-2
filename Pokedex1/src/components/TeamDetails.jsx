import React, { useState, useEffect } from "react";

/* TeamDetails: Shows detailed info for each Pokémon in the user's team */
const TeamDetails = () => {
  const [team, setTeam] = useState([]);
  const [pokeDetails, setPokeDetails] = useState([]);
  const [pokedexEntries, setPokedexEntries] = useState([]);
  const [showShiny, setShowShiny] = useState({});
  const [battleRating, setBattleRating] = useState(null);
  const [cutenessRating, setCutenessRating] = useState(null);

  const toggleShiny = (pokemonKey) => {
    setShowShiny((prev) => ({
      ...prev,
      [pokemonKey]: !prev[pokemonKey],
    }));
  };

  useEffect(() => {
    const storedTeam = localStorage.getItem('pokemonTeam');
    if (storedTeam) {
      const parsedTeam = JSON.parse(storedTeam);
      setTeam(parsedTeam);
      // Fetch details and pokedex entry for each pokemon
      Promise.all(
        parsedTeam.map(async p => {
          const pokeRes = await fetch(`https://pokeapi.co/api/v2/pokemon/${p.name.toLowerCase()}`);
          const pokeData = await pokeRes.json();
          let entry = "";
          try {
            const speciesRes = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${p.name.toLowerCase()}`);
            const speciesData = await speciesRes.json();
            // Find English flavor text
            const englishEntry = speciesData.flavor_text_entries.find(e => e.language.name === "en");
            entry = englishEntry ? englishEntry.flavor_text.replace(/\n|\f/g, " ") : "No Pokédex entry found.";
          } catch {
            entry = "No Pokédex entry found.";
          }
          return { pokeData, entry };
        })
      ).then(results => {
        setPokeDetails(results.map(r => r.pokeData));
        setPokedexEntries(results.map(r => r.entry));
        // Calculate ratings only if not already stored
        let storedBattle = localStorage.getItem('battleRating');
        let storedCuteness = localStorage.getItem('cutenessRating');
        if (!storedBattle || !storedCuteness) {
          // Calculate Battle Rating
          const totalHP = results.reduce((sum, r) => {
            const hp = r.pokeData.stats.find(s => s.stat.name === 'hp')?.base_stat || 0;
            return sum + hp;
          }, 0);
          const battle = totalHP + Math.floor(Math.random() * 30) + 1;
          const cuteness = Math.floor(Math.random() * 100) + 1;
          localStorage.setItem('battleRating', battle);
          localStorage.setItem('cutenessRating', cuteness);
          setBattleRating(battle);
          setCutenessRating(cuteness);
        } else {
          setBattleRating(Number(storedBattle));
          setCutenessRating(Number(storedCuteness));
        }
      });
    } else {
      setBattleRating(null);
      setCutenessRating(null);
    }
  }, []);

  return (
    <div className="team-view">
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <h2 style={{ marginBottom: 0 }}>Team Details</h2>
        {battleRating !== null && (
          <span style={{ fontWeight: 'bold', color: '#e91e63' }}>Battle Rating: {battleRating}</span>
        )}
        {cutenessRating !== null && (
          <span style={{ fontWeight: 'bold', color: '#1976d2' }}>Cuteness Rating: {cutenessRating}/100</span>
        )}
      </div>
      {team.length === 0 ? (
        <p>No Pokémon in your team yet!</p>
      ) : (
        <ul>
          {pokeDetails.map((poke, idx) => (
            poke ? (
              <li key={idx} style={{ marginBottom: '20px', border: '1px solid #ccc', padding: '10px', borderRadius: '8px' }}>
                <div style={{ fontWeight: 'bold', fontSize: '1.2em' }}>{poke.name.charAt(0).toUpperCase() + poke.name.slice(1)}</div>
                <img
                  src={showShiny[poke.name] ? (poke.sprites.front_shiny || poke.sprites.front_default) : poke.sprites.front_default}
                  alt={showShiny[poke.name] ? `${poke.name} shiny` : poke.name}
                  style={{ width: '80px', margin: '10px 0' }}
                />
                <div>
                  <button onClick={() => toggleShiny(poke.name)}>
                    {showShiny[poke.name] ? 'Show Normal' : 'Show Shiny'}
                  </button>
                </div>
                <div>HP: {poke.stats.find(s => s.stat.name === 'hp')?.base_stat}</div>
                <div>Type: {poke.types.map(t => t.type.name).join(', ')}</div>
                <div>Moves:
                  <ul>
                    {poke.moves.slice(0, 4).map((m, i) => (
                      <li key={i}>{m.move.name}</li>
                    ))}
                  </ul>
                </div>
                <div style={{ marginTop: '10px', fontStyle: 'italic', color: '#fff' }}>
                  Pokédex Entry: {pokedexEntries[idx]}
                </div>
                {/* Add more details as needed */}
              </li>
            ) : (
              <li key={idx}>Error loading details for this Pokémon.</li>
            )
          ))}
        </ul>
      )}
    </div>
  );
};

export default TeamDetails;
