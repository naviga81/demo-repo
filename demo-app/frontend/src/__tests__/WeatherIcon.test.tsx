import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { WeatherIcon } from '../components/WeatherIcon';

describe('WeatherIcon', () => {
  it('render test - renders a span with the correct aria-label for a known condition', () => {
    render(<WeatherIcon condition="sunny" />);
    const icon = screen.getByRole('img', { name: 'sunny' });
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveTextContent('☀️');
  });

  it('interaction test - applies the provided className to the rendered span', () => {
    render(<WeatherIcon condition="cloudy" className="test-class" />);
    const icon = screen.getByRole('img', { name: 'cloudy' });
    expect(icon).toHaveClass('test-class');
  });

  it('edge case - renders the fallback icon when condition is an unrecognised string', () => {
    render(<WeatherIcon condition="not-a-real-condition" />);
    const icon = screen.getByRole('img', { name: 'not-a-real-condition' });
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveTextContent('🌡️');
  });
});
