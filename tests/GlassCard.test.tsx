import React from 'react';
import { render, screen } from '@testing-library/react';
import { GlassCard } from '@/components/ui/GlassCard';

describe('GlassCard Component', () => {
  it('renders correctly with child content', () => {
    render(<GlassCard>Test Content</GlassCard>);
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('applies the glow class when glow prop is passed', () => {
    const { container } = render(<GlassCard glow>Glowing Card</GlassCard>);
    const elm = container.firstChild as HTMLElement;
    expect(elm.className).toMatch(/shadow-\[0_0_40px_rgba\(50,184,198,0\.2\)\]/);
  });

  it('should have proper ARIA attributes', () => {
    render(<GlassCard>Accessible</GlassCard>);
    const region = screen.getByRole('region');
    expect(region).toBeInTheDocument();
    expect(region).toHaveAttribute('aria-label', 'Interactive Command Module');
  });
});
