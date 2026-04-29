import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ThemeIcon } from '../components/ThemeIcon';

describe('ThemeIcon', () => {
  it('Render_WithIsDarkFalse_RendersSunIcon', () => {
    render(<ThemeIcon isDark={false} />);
    const icon = screen.getByRole('img', { name: 'Light mode icon' });
    expect(icon).toBeDefined();
  });

  it('Render_WithIsDarkTrue_RendersMoonIcon', () => {
    render(<ThemeIcon isDark={true} />);
    const icon = screen.getByRole('img', { name: 'Dark mode icon' });
    expect(icon).toBeDefined();
  });

  it('Interaction_TogglingIsDarkProp_SwitchesIcon', () => {
    const { rerender } = render(<ThemeIcon isDark={false} />);
    expect(screen.getByRole('img', { name: 'Light mode icon' })).toBeDefined();

    rerender(<ThemeIcon isDark={true} />);
    expect(screen.getByRole('img', { name: 'Dark mode icon' })).toBeDefined();
  });

  it('EdgeCase_WithNullLikeProps_RendersWithoutCrashing', () => {
    // isDark is a boolean so passing false (falsy boundary) should not crash
    expect(() => render(<ThemeIcon isDark={false} />)).not.toThrow();
  });
});
