import React from 'react';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { BillingShowcase } from '@/features/showcase/billing/billing-showcase';
import { useAppStore } from '@/lib/store';
import { resetAppStore } from './store-test-utils';

describe('BillingShowcase', () => {
  beforeEach(() => {
    resetAppStore();
    useAppStore.getState().login('admin@starterkit.io', 'Admin Starter');
  });

  afterEach(() => {
    resetAppStore();
  });

  it('exposes billing cycle controls and usage meters to assistive technologies', () => {
    render(<BillingShowcase />);

    const cycleGroup = screen.getByRole('group', { name: /ciclo de cobranca/i });
    expect(within(cycleGroup).getByRole('button', { name: /mensal/i })).toHaveAttribute('aria-pressed', 'true');
    expect(within(cycleGroup).getByRole('button', { name: /anual/i })).toHaveAttribute('aria-pressed', 'false');

    const apiMeter = screen.getByRole('progressbar', { name: /uso de api requests/i });
    expect(apiMeter).toHaveAttribute('aria-valuemin', '0');
    expect(apiMeter).toHaveAttribute('aria-valuemax', '100');
    expect(apiMeter).toHaveAttribute('aria-valuenow', '100');
    expect(apiMeter).toHaveAttribute('aria-valuetext', '42500 de 10000 requisicoes mensais');

    const storageMeter = screen.getByRole('progressbar', { name: /uso de storage simulado/i });
    expect(storageMeter).toHaveAttribute('aria-valuenow', '100');
    expect(storageMeter).toHaveAttribute('aria-valuetext', '1.2 de 1 GB');

    expect(screen.getByText(/assentos ativos/i)).toBeInTheDocument();

    const seatsMeter = screen.getByRole('progressbar', { name: /uso de assentos ativos/i });
    expect(seatsMeter).toHaveAttribute('aria-valuenow', '100');
    expect(seatsMeter).toHaveAttribute('aria-valuetext', '1 de 1 assentos ativos');
  });

  it('updates billing cycle and subscription through the mock store', async () => {
    const user = userEvent.setup();

    render(<BillingShowcase />);

    await user.click(screen.getByRole('button', { name: /anual/i }));

    expect(screen.getByText('$8.00')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /upgrade para pro/i }));

    expect(useAppStore.getState().subscription).toBe('pro');
    expect(screen.getByRole('button', { name: /plano ativo/i })).toBeInTheDocument();
    expect(screen.getByRole('progressbar', { name: /uso de api requests/i })).toHaveAttribute('aria-valuenow', '43');
  });
});
