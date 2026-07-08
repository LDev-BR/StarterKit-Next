'use client';

import React from 'react';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card } from './card';

export interface MetricCardProps {
  label: React.ReactNode;
  value: React.ReactNode;
  description?: React.ReactNode;
  icon?: LucideIcon;
  tone?: 'neutral' | 'success' | 'warning' | 'danger' | 'info';
  progress?: {
    value: number;
    max?: number;
    label?: string;
    valueText?: string;
  };
  footer?: React.ReactNode;
  className?: string;
}

const toneClasses = {
  neutral: 'text-foreground bg-muted/70',
  success: 'text-emerald-700 bg-emerald-500/10 dark:text-emerald-300',
  warning: 'text-amber-700 bg-amber-500/10 dark:text-amber-300',
  danger: 'text-rose-700 bg-rose-500/10 dark:text-rose-300',
  info: 'text-blue-700 bg-blue-500/10 dark:text-blue-300',
};

export function MetricCard({
  label,
  value,
  description,
  icon: Icon,
  tone = 'neutral',
  progress,
  footer,
  className,
}: MetricCardProps) {
  const max = progress?.max ?? 100;
  const rawProgress = progress ? (progress.value / max) * 100 : 0;
  const progressPercent = Math.min(100, Math.max(0, rawProgress));

  return (
    <Card className={cn('p-4 sm:p-5', className)} isGlass>
      <div className="flex min-w-0 items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="break-anywhere text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            {label}
          </p>
          <div className="mt-2 break-anywhere text-2xl font-black tracking-tight text-foreground">
            {value}
          </div>
        </div>
        {Icon ? (
          <div
            className={cn('flex h-10 w-10 shrink-0 items-center justify-center rounded-lg', toneClasses[tone])}
            aria-hidden="true"
          >
            <Icon className="h-5 w-5" />
          </div>
        ) : null}
      </div>

      {description ? (
        <p className="mt-3 break-anywhere text-sm leading-relaxed text-muted-foreground">
          {description}
        </p>
      ) : null}

      {progress ? (
        <div className="mt-4 space-y-2">
          <div
            role="progressbar"
            aria-label={progress.label}
            aria-valuemin={0}
            aria-valuemax={max}
            aria-valuenow={progress.value}
            aria-valuetext={progress.valueText ?? progress.label}
            className="h-2 w-full overflow-hidden rounded-full bg-muted"
          >
            <div className="h-full rounded-full bg-primary" style={{ width: `${progressPercent}%` }} />
          </div>
        </div>
      ) : null}

      {footer ? (
        <div className="mt-4 break-anywhere text-xs font-medium text-muted-foreground">
          {footer}
        </div>
      ) : null}
    </Card>
  );
}
