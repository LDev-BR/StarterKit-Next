'use client';

import React from 'react';
import { Database } from 'lucide-react';
import { Button } from './button';
import { cn } from '@/lib/utils';

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
  className?: string;
  id?: string;
}

export function EmptyState({
  icon = <Database className="h-10 w-10 text-muted-foreground stroke-1" />,
  title,
  description,
  actionText,
  onAction,
  className,
  id,
}: EmptyStateProps) {
  return (
    <div
      id={id ?? 'empty-state-card'}
      className={cn(
        'flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-border/80 rounded-xl bg-card/10 select-none max-w-md mx-auto',
        className
      )}
    >
      <div className="p-4 rounded-full bg-muted/50 mb-4 flex items-center justify-center">
        {icon}
      </div>

      <h3 className="text-base font-semibold text-foreground tracking-tight mb-1">
        {title}
      </h3>
      <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
        {description}
      </p>

      {actionText && onAction ? (
        <Button variant="outline" size="sm" onClick={onAction}>
          {actionText}
        </Button>
      ) : null}
    </div>
  );
}
export default EmptyState;
