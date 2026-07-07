import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { AuthShowcase } from '@/features/showcase/auth/auth-showcase';
import { useAppStore } from '@/lib/store';
import { resetAppStore } from './store-test-utils';

describe('AuthShowcase forms', () => {
  beforeEach(() => {
    resetAppStore();
  });

  afterEach(() => {
    resetAppStore();
  });

  it('validates login credentials before starting the mock session', async () => {
    const user = userEvent.setup();
    useAppStore.getState().setAuthView('login');

    render(<AuthShowcase />);

    await user.clear(screen.getByLabelText(/e-mail de trabalho/i));
    await user.clear(screen.getByLabelText(/sua senha de acesso/i));
    await user.click(screen.getByRole('button', { name: /autenticar e entrar/i }));

    expect(await screen.findByText(/e-mail corporativo válido/i)).toBeInTheDocument();
    expect(screen.getByText(/pelo menos 6 caracteres/i)).toBeInTheDocument();
    expect(useAppStore.getState().user).toBeNull();
  });

  it('registers a valid mock account and reports success', async () => {
    const user = userEvent.setup();
    useAppStore.getState().setAuthView('register');

    render(<AuthShowcase />);

    await user.type(screen.getByLabelText(/nome completo/i), 'Ana Starter');
    await user.type(screen.getByLabelText(/e-mail profissional/i), 'ana@starterkit.io');
    await user.type(screen.getByLabelText(/^nova senha/i), 'senha-segura');
    await user.type(screen.getByLabelText(/confirmar senha/i), 'senha-segura');
    await user.click(screen.getByRole('button', { name: /criar conta e iniciar/i }));

    await waitFor(() => {
      expect(useAppStore.getState().user).toMatchObject({
        name: 'Ana Starter',
        email: 'ana@starterkit.io',
      });
    });
    expect(useAppStore.getState().notifications[0]).toMatchObject({
      message: 'Cadastro realizado com sucesso!',
      type: 'success',
    });
  });
});
