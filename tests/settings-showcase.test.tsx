import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { SettingsShowcase } from '@/features/showcase/settings/settings-showcase';
import { useAppStore } from '@/lib/store';
import { resetAppStore } from './store-test-utils';
import { ThemeProvider } from '@/providers/theme-provider';

function renderSettingsShowcase() {
  return render(
    <ThemeProvider>
      <SettingsShowcase />
    </ThemeProvider>
  );
}

describe('SettingsShowcase forms', () => {
  beforeEach(() => {
    resetAppStore();
    useAppStore.getState().login('admin@starterkit.io', 'Admin Starter');
  });

  afterEach(() => {
    resetAppStore();
  });

  it('validates and saves profile data', async () => {
    const user = userEvent.setup();

    renderSettingsShowcase();

    await user.clear(screen.getByLabelText(/nome no perfil/i));
    await user.clear(screen.getByLabelText(/e-mail corporativo/i));
    await user.click(screen.getByRole('button', { name: /atualizar perfil/i }));

    expect(await screen.findByText(/pelo menos 2 letras/i)).toBeInTheDocument();
    expect(screen.getByText(/e-mail institucional válido/i)).toBeInTheDocument();

    await user.type(screen.getByLabelText(/nome no perfil/i), 'Admin Validado');
    await user.type(screen.getByLabelText(/e-mail corporativo/i), 'validado@starterkit.io');
    await user.click(screen.getByRole('button', { name: /atualizar perfil/i }));

    await waitFor(() => {
      expect(useAppStore.getState().user).toMatchObject({
        name: 'Admin Validado',
        email: 'validado@starterkit.io',
      });
    });
  });

  it('generates API keys from the infrastructure tab', async () => {
    const user = userEvent.setup();
    const initialKeyCount = useAppStore.getState().apiKeys.length;

    renderSettingsShowcase();

    await user.click(await screen.findByRole('button', { name: /conectores de api/i }));
    await user.type(screen.getByPlaceholderText(/nome do token/i), 'Preview Deploy');
    await user.click(screen.getByRole('button', { name: /gerar chave/i }));

    expect(useAppStore.getState().apiKeys).toHaveLength(initialKeyCount + 1);
    expect(useAppStore.getState().apiKeys[0]).toMatchObject({
      name: 'Preview Deploy',
      lastUsed: 'Nunca',
    });
  });
});
