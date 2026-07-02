'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg';
}

export function Spinner({ className, size = 'md', ...props }: SpinnerProps) {
  const sizeMap = {
    sm: 'h-4 w-4 border-2',
    md: 'h-8 w-8 border-3',
    lg: 'h-12 w-12 border-4',
  };

  return (
    <div className={cn('flex items-center justify-center p-4', className)} {...props}>
      <div
        className={cn(
          'animate-spin rounded-full border-solid border-muted border-t-primary border-r-transparent',
          sizeMap[size]
        )}
        role="status"
        aria-label="Carregando..."
      />
    </div>
  );
}
export default Spinner;
