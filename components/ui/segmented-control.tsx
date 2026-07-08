'use client';

import React from 'react';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface SegmentedControlItem<T extends string> {
  value: T;
  label: React.ReactNode;
  ariaLabel?: string;
  icon?: LucideIcon;
  disabled?: boolean;
}

export interface SegmentedControlProps<T extends string> {
  items: ReadonlyArray<SegmentedControlItem<T>>;
  value: T;
  onValueChange: (value: T) => void;
  ariaLabel: string;
  size?: 'sm' | 'md';
  className?: string;
}

const sizeClasses = {
  sm: 'min-h-9 px-3 text-xs',
  md: 'min-h-10 px-4 text-sm',
};

export function SegmentedControl<T extends string>({
  items,
  value,
  onValueChange,
  ariaLabel,
  size = 'md',
  className,
}: SegmentedControlProps<T>) {
  return (
    <div
      role="group"
      aria-label={ariaLabel}
      className={cn(
        'inline-flex max-w-full flex-wrap items-center gap-1 rounded-xl border border-border bg-muted/50 p-1',
        className
      )}
    >
      {items.map((item) => {
        const Icon = item.icon;
        const isSelected = item.value === value;

        return (
          <button
            key={item.value}
            type="button"
            aria-label={item.ariaLabel}
            aria-pressed={isSelected}
            disabled={item.disabled}
            onClick={() => onValueChange(item.value)}
            className={cn(
              'inline-flex min-w-0 items-center justify-center gap-2 rounded-lg font-semibold transition-colors',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 focus-visible:ring-offset-2 focus-visible:ring-offset-background',
              'disabled:pointer-events-none disabled:opacity-50 motion-reduce:transition-none',
              sizeClasses[size],
              isSelected
                ? 'bg-card text-foreground shadow-sm'
                : 'text-muted-foreground hover:bg-card/60 hover:text-foreground'
            )}
          >
            {Icon ? <Icon className="h-4 w-4 shrink-0" aria-hidden="true" /> : null}
            <span className="truncate">{item.label}</span>
          </button>
        );
      })}
    </div>
  );
}
