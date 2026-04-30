import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { SmileyIcon } from '../components/SmileyIcon';

describe('SmileyIcon', () => {
  it('render test - renders an svg with the correct aria-label and default size', () => {
    render(<SmileyIcon />);

    const svg = screen.getByRole('img', { name: 'Smiley face icon' });
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveAttribute('width', '15');
    expect(svg).toHaveAttribute('height', '15');
  });

  it('interaction test - renders with custom size and color props when provided', () => {
    render(<SmileyIcon size={32} color="#FF0000" />);

    const svg = screen.getByRole('img', { name: 'Smiley face icon' });
    expect(svg).toHaveAttribute('width', '32');
    expect(svg).toHaveAttribute('height', '32');
    expect(svg).toHaveAttribute('fill', '#FF0000');
  });

  it('edge case - renders without crashing when no props are provided', () => {
    render(<SmileyIcon />);

    const svg = screen.getByRole('img', { name: 'Smiley face icon' });
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveAttribute('fill', '#FACC15');
  });
});
