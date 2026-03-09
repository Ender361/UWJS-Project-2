import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import PokemonList from './PokemonList';

describe('PokemonList', () => {
  it('renders the input prompt and load button initially', () => {
    render(
      <MemoryRouter>
        <PokemonList />
      </MemoryRouter>,
    );

    expect(screen.getByText(/How many Pokémon would you like to see/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Load Pokémon' })).toBeInTheDocument();
  });

  it('shows validation message for invalid input', async () => {
    render(
      <MemoryRouter>
        <PokemonList />
      </MemoryRouter>,
    );

    fireEvent.change(screen.getByRole('spinbutton'), { target: { value: '0' } });
    fireEvent.submit(screen.getByRole('button', { name: 'Load Pokémon' }).closest('form'));

    expect(await screen.findByText(/Please enter a number between 1 and 1025/)).toBeInTheDocument();
  });
});