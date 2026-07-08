'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { EmptyState, type EmptyStateProps } from './empty-state';

export interface DataColumn<T> {
  key: string;
  header: React.ReactNode;
  render: (row: T) => React.ReactNode;
  align?: 'left' | 'center' | 'right';
  className?: string;
  headerClassName?: string;
}

export interface ResponsiveDataViewProps<T> {
  rows: ReadonlyArray<T>;
  columns: ReadonlyArray<DataColumn<T>>;
  getRowKey: (row: T) => string;
  ariaLabel: string;
  emptyState: EmptyStateProps;
  renderMobileCard: (row: T) => React.ReactNode;
  className?: string;
  tableClassName?: string;
}

const alignClasses = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
};

export function ResponsiveDataView<T>({
  rows,
  columns,
  getRowKey,
  ariaLabel,
  emptyState,
  renderMobileCard,
  className,
  tableClassName,
}: ResponsiveDataViewProps<T>) {
  if (rows.length === 0) {
    return <EmptyState {...emptyState} className={cn('max-w-none', emptyState.className)} />;
  }

  return (
    <div className={cn('min-w-0', className)}>
      <div className="hidden overflow-x-auto md:block">
        <table aria-label={ariaLabel} className={cn('w-full min-w-[44rem] border-collapse', tableClassName)}>
          <thead>
            <tr className="border-b border-border bg-muted/30">
              {columns.map((column) => (
                <th
                  key={column.key}
                  scope="col"
                  className={cn(
                    'px-4 py-3 text-xs font-bold uppercase tracking-[0.12em] text-muted-foreground',
                    alignClasses[column.align ?? 'left'],
                    column.headerClassName
                  )}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border/70">
            {rows.map((row) => (
              <tr key={getRowKey(row)} className="transition-colors hover:bg-muted/20">
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className={cn(
                      'px-4 py-3 text-sm text-foreground',
                      alignClasses[column.align ?? 'left'],
                      column.className
                    )}
                  >
                    {column.render(row)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid gap-3 md:hidden">
        {rows.map((row) => (
          <div key={getRowKey(row)} className="min-w-0">
            {renderMobileCard(row)}
          </div>
        ))}
      </div>
    </div>
  );
}
