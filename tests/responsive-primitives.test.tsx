import React from 'react';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { LayoutDashboard } from 'lucide-react';
import { PageHeader } from '@/components/ui/page-header';
import { SegmentedControl } from '@/components/ui/segmented-control';
import { MetricCard } from '@/components/ui/metric-card';
import { ResponsiveDataView, type DataColumn } from '@/components/ui/responsive-data-view';

type DemoRow = {
  id: string;
  owner: string;
  project: string;
  status: string;
};

const columns: Array<DataColumn<DemoRow>> = [
  {
    key: 'owner',
    header: 'Responsavel',
    render: (row) => row.owner,
  },
  {
    key: 'project',
    header: 'Projeto',
    render: (row) => row.project,
  },
  {
    key: 'status',
    header: 'Status',
    align: 'right',
    render: (row) => row.status,
  },
];

describe('responsive UI primitives', () => {
  it('renders a reusable page header with icon, description and action slot', () => {
    render(
      <PageHeader
        eyebrow="Validacao frontend"
        title="Projetos ativos"
        description="Controle responsivo para operacao SaaS."
        icon={LayoutDashboard}
        actions={<button type="button">Nova acao</button>}
      />
    );

    expect(screen.getByText(/validacao frontend/i)).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /projetos ativos/i })).toBeInTheDocument();
    expect(screen.getByText(/controle responsivo/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /nova acao/i })).toBeInTheDocument();
  });

  it('exposes segmented choices with pressed state and stable accessible label', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    render(
      <SegmentedControl
        ariaLabel="Intervalo"
        value="week"
        onValueChange={handleChange}
        items={[
          { value: 'today', label: 'Hoje' },
          { value: 'week', label: 'Semana' },
        ]}
      />
    );

    const group = screen.getByRole('group', { name: /intervalo/i });
    expect(within(group).getByRole('button', { name: /hoje/i })).toHaveAttribute('aria-pressed', 'false');
    expect(within(group).getByRole('button', { name: /semana/i })).toHaveAttribute('aria-pressed', 'true');

    await user.click(within(group).getByRole('button', { name: /hoje/i }));

    expect(handleChange).toHaveBeenCalledWith('today');
  });

  it('renders metric cards with labelled progress information', () => {
    render(
      <MetricCard
        label="Uso de API"
        value="42.500"
        description="Consumo mensal"
        tone="info"
        progress={{
          value: 43,
          label: 'Uso de API requests',
          valueText: '42500 de 100000 requisicoes mensais',
        }}
        footer="Ciclo reinicia em 12 dias"
      />
    );

    expect(screen.getByText(/uso de api/i)).toBeInTheDocument();
    expect(screen.getByText('42.500')).toBeInTheDocument();
    expect(screen.getByRole('progressbar', { name: /uso de api requests/i })).toHaveAttribute('aria-valuenow', '43');
    expect(screen.getByRole('progressbar', { name: /uso de api requests/i })).toHaveAttribute(
      'aria-valuetext',
      '42500 de 100000 requisicoes mensais'
    );
  });

  it('renders desktop table semantics and mobile cards from the same data contract', () => {
    render(
      <ResponsiveDataView
        ariaLabel="Projetos recentes"
        rows={[
          { id: 'row-1', owner: 'Admin Starter', project: 'Omega Gateway', status: 'OK' },
          { id: 'row-2', owner: 'Equipe Dados', project: 'Nexus Metrics', status: 'Aviso' },
        ]}
        columns={columns}
        getRowKey={(row) => row.id}
        emptyState={{
          title: 'Nenhum projeto',
          description: 'Crie um projeto para iniciar a listagem.',
        }}
        renderMobileCard={(row) => (
          <article aria-label={`Projeto ${row.project}`}>
            <h3>{row.project}</h3>
            <p>{row.owner}</p>
            <strong>{row.status}</strong>
          </article>
        )}
      />
    );

    const table = screen.getByRole('table', { name: /projetos recentes/i });
    expect(within(table).getByRole('columnheader', { name: /responsavel/i })).toBeInTheDocument();
    expect(within(table).getByRole('cell', { name: /omega gateway/i })).toBeInTheDocument();
    expect(screen.getByRole('article', { name: /projeto omega gateway/i })).toBeInTheDocument();
  });

  it('uses the shared empty state when no responsive data is available', () => {
    render(
      <ResponsiveDataView
        ariaLabel="Faturas"
        rows={[]}
        columns={columns}
        getRowKey={(row) => row.id}
        emptyState={{
          title: 'Nenhuma fatura',
          description: 'As faturas futuras aparecem aqui.',
        }}
        renderMobileCard={(row) => <article>{row.project}</article>}
      />
    );

    expect(screen.getByText(/nenhuma fatura/i)).toBeInTheDocument();
    expect(screen.queryByRole('table', { name: /faturas/i })).not.toBeInTheDocument();
  });
});
