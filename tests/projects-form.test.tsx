import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { FormShowcase } from '@/features/showcase/projects/form-showcase';
import { useAppStore } from '@/lib/store';
import { resetAppStore } from './store-test-utils';

describe('FormShowcase project form', () => {
  beforeEach(() => {
    resetAppStore();
  });

  afterEach(() => {
    resetAppStore();
  });

  it('connects validation errors to project fields and terms', async () => {
    const user = userEvent.setup();

    render(<FormShowcase />);

    await user.click(screen.getByRole('button', { name: /provisionar projeto/i }));
    await user.click(screen.getByRole('button', { name: /gravar projeto/i }));

    expect(await screen.findByText(/deve possuir no mínimo 3 caracteres/i)).toBeInTheDocument();

    const description = screen.getByLabelText(/objetivos/i);
    expect(description).toHaveAttribute('aria-invalid', 'true');
    expect(description).toHaveAccessibleDescription(/breve descrição/i);

    const terms = screen.getByRole('checkbox', { name: /governança/i });
    expect(terms).toHaveAttribute('aria-invalid', 'true');
    expect(terms).toHaveAccessibleDescription(/concordar com as regras/i);
  });

  it('creates a valid project through the mock store', async () => {
    const user = userEvent.setup();
    const initialProjectCount = useAppStore.getState().projects.length;

    render(<FormShowcase />);

    await user.click(screen.getByRole('button', { name: /provisionar projeto/i }));
    await user.type(screen.getByLabelText(/nome do projeto saas/i), 'Central de Métricas');
    await user.type(screen.getByLabelText(/e-mail corporativo/i), 'metricas@starterkit.io');
    await user.type(
      screen.getByLabelText(/objetivos/i),
      'Validar fluxo operacional do frontend antes do backend real.'
    );
    await user.clear(screen.getByLabelText(/orçamento usd/i));
    await user.type(screen.getByLabelText(/orçamento usd/i), '3200');
    await user.click(screen.getByRole('checkbox', { name: /governança/i }));
    await user.click(screen.getByRole('button', { name: /gravar projeto/i }));

    await waitFor(() => {
      expect(useAppStore.getState().projects).toHaveLength(initialProjectCount + 1);
    });
    expect(useAppStore.getState().projects[0]).toMatchObject({
      projectName: 'Central de Métricas',
      contactEmail: 'metricas@starterkit.io',
      allocatedBudget: 3200,
    });
    expect(screen.queryByRole('button', { name: /gravar projeto/i })).not.toBeInTheDocument();
  });
});
