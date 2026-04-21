import React from 'react';
import { render, screen } from '@testing-library/react';
import { VenueMap } from '@/components/ui/VenueMap';

// Mock contexts since VenueMap uses useQueues
jest.mock('@/lib/providers', () => ({
  useQueues: () => ({
    queues: []
  })
}));

describe('VenueMap Component', () => {
  it('renders the interactive filters', () => {
    render(<VenueMap />);
    expect(screen.getByText('food')).toBeInTheDocument();
    expect(screen.getByText('beverage')).toBeInTheDocument();
  });

  it('renders the HUD legend', () => {
    render(<VenueMap />);
    expect(screen.getByText('FIELD UNITS')).toBeInTheDocument();
  });
});
