import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { MainContent } from '@/components/layouts/main-content';
import { ThemeProvider } from '@/providers/theme-provider';
import { useAppStore } from '@/lib/store';
import { resetAppStore } from './store-test-utils';

function renderMainContent() {
  return render(
    <ThemeProvider>
      <MainContent>
        <section>Conteúdo validado</section>
      </MainContent>
    </ThemeProvider>
  );
}

describe('Application layout accessibility', () => {
  beforeEach(() => {
    resetAppStore();
    useAppStore.getState().login('admin@starterkit.io', 'Admin Starter');
  });

  afterEach(() => {
    resetAppStore();
  });

  it('exposes header menu triggers with button semantics and expanded state', async () => {
    const user = userEvent.setup();

    renderMainContent();

    expect(await screen.findByRole('button', { name: /ir para o painel/i })).toBeInTheDocument();

    const notificationsTrigger = screen.getByRole('button', { name: /notificações/i });
    expect(notificationsTrigger).toHaveAttribute('aria-expanded', 'false');

    const profileTrigger = screen.getByRole('button', { name: /menu do usuário/i });
    expect(profileTrigger).toHaveAttribute('aria-expanded', 'false');

    await user.click(profileTrigger);

    expect(profileTrigger).toHaveAttribute('aria-expanded', 'true');
    expect(screen.queryByText(/dark mode/i)).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /alternar modo escuro/i })).not.toBeInTheDocument();
  });

  it('exposes the mobile notifications drawer as a named modal dialog', async () => {
    useAppStore.getState().setMobileNotificationsOpen(true);

    renderMainContent();

    const dialog = await screen.findByRole('dialog', { name: /avisos operacionais/i });
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(screen.getByRole('button', { name: /fechar avisos operacionais/i })).toBeInTheDocument();
  });
});
