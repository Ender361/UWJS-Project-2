import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import TeamRoster from './TeamRoster';

describe('TeamRoster', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('shows empty team message when no team exists', () => {
    render(<TeamRoster />);

    expect(screen.getByText('No Pokémon in your team yet!')).toBeInTheDocument();
  });
});