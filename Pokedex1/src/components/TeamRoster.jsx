import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

/* A component that creates a team roster box on the screen which uses local storage to store up to 3 pokemon objects */
const TeamRoster = () => {
	const [team, setTeam] = useState([]);

	useEffect(() => {
		// Try to load team from localStorage
		const loadTeam = () => {
			const storedTeam = localStorage.getItem('pokemonTeam');
			if (storedTeam) {
				setTeam(JSON.parse(storedTeam));
			} else {
				setTeam([]);
			}
		};
		loadTeam();
		// Listen for custom event to update team
		window.addEventListener('teamUpdated', loadTeam);
		return () => {
			window.removeEventListener('teamUpdated', loadTeam);
		};
	}, []);

	return (
		<div className="team-roster">
			<h2>Your Pokémon Team</h2>
      {/* Clear team button */}
			<button
				onClick={() => {
					setTeam([]);
					localStorage.removeItem('pokemonTeam');
				}}
				style={{ marginBottom: '10px' }}
			>Clear Team</button>
      {/* List of team pokemon */}
			<ul>
				{team && team.length > 0 ? (
					team.map((pokemon, idx) => (
						<li key={idx}>
							  <span>{pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</span>
							{/* Add more details or images here */}
						</li>
					))
				) : (
					<li>No Pokémon in your team yet!</li>
				)}
			</ul>
		</div>
	);
};

export default TeamRoster;