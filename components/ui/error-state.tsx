'use client';

import React from 'react';
import { AlertCircle } from 'lucide-react';
import { Button } from './button';
import { cn } from '@/lib/utils';

export interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
  id?: string;
}

export function ErrorState({
  title = 'Ocorreu um erro',
  message = 'Não foi possível carregar os dados. Verifique sua conexão e tente novamente.',
  onRetry,
  className,
  id,
}: ErrorStateProps) {
  return (
    <div
      id={id ?? 'error-state-card'}
      className={cn(
        'flex flex-col items-center justify-center text-center p-8 border border-red-500/10 rounded-xl bg-red-500/5 max-w-sm mx-auto select-none',
        className
      )}
    >
      <div className="p-3 rounded-full bg-red-500/10 text-red-500 mb-4 flex items-center justify-center">
        <AlertCircle className="h-6 w-6 stroke-2" />
      </div>

      <h3 className="text-base font-semibold text-foreground tracking-tight mb-1">
        {title}
      </h3>
      <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
        {message}
      </p>

      {onRetry ? (
        <Button variant="outline" size="sm" onClick={onRetry} className="border-red-500/20 hover:bg-red-500/10 text-red-600 dark:text-red-400">
          Tentar Novamente
        </Button>
      ) : null}
    </div>
  );
}
export default ErrorState;
