import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ThemeProvider, useTheme } from '@/providers/theme-provider';

function HookConsumer() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  return (
    <div>
      <span data-testid="theme-val">{theme}</span>
      <span data-testid="resolved-val">{resolvedTheme}</span>
      <button onClick={() => setTheme('dark')}>Escuro</button>
      <button onClick={() => setTheme('light')}>Claro</button>
    </div>
  );
}

describe('useTheme hook inside ThemeProvider', () => {
  it('correctly reports system states on default boots', () => {
    render(
      <ThemeProvider>
        <HookConsumer />
      </ThemeProvider>
    );

    const activeTheme = screen.getByTestId('theme-val');
    expect(activeTheme).toHaveTextContent('system');
  });

  it('manages theme toggle callbacks perfectly', async () => {
    render(
      <ThemeProvider>
        <HookConsumer />
      </ThemeProvider>
    );

    const darkBtn = await screen.findByRole('button', { name: /escuro/i });
    fireEvent.click(darkBtn);

    const activeTheme = screen.getByTestId('theme-val');
    expect(activeTheme).toHaveTextContent('dark');
  });
});
