import React from 'react';
import { render, screen, within } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { ShowcaseDashboard } from '@/features/showcase/dashboard/showcase-dashboard';
import { useAppStore } from '@/lib/store';
import { resetAppStore } from './store-test-utils';

describe('ShowcaseDashboard', () => {
  beforeEach(() => {
    resetAppStore();
    useAppStore.getState().login('admin@starterkit.io', 'Admin Starter');
  });

  afterEach(() => {
    resetAppStore();
  });

  it('labels segmented controls and keeps dashboard copy aligned with SaaS projects', () => {
    render(<ShowcaseDashboard />);

    const periodGroup = screen.getByRole('group', { name: /intervalo do dashboard/i });
    expect(within(periodGroup).getByRole('button', { name: /hoje/i })).toHaveAttribute('aria-pressed', 'false');
    expect(within(periodGroup).getByRole('button', { name: /semana/i })).toHaveAttribute('aria-pressed', 'true');

    const budgetGroup = screen.getByRole('group', { name: /tipo de orçamento/i });
    expect(within(budgetGroup).getByRole('button', { name: /receita projetada/i })).toHaveAttribute('aria-pressed', 'true');
    expect(within(budgetGroup).getByRole('button', { name: /despesa estimada/i })).toHaveAttribute('aria-pressed', 'false');

    expect(screen.getByRole('button', { name: /criar novo projeto/i })).toBeInTheDocument();
    expect(screen.getByText(/projetos recentes/i)).toBeInTheDocument();
    expect(screen.queryByText(/pedidos/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/loja física/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/cliente/i)).not.toBeInTheDocument();
  });
});
