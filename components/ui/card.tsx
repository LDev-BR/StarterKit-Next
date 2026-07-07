'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'motion/react';

type CardProps = React.ComponentPropsWithoutRef<typeof motion.div> & {
  id?: string;
  isHoverable?: boolean;
  isGlass?: boolean;
};

export function Card({ className, id, isHoverable = false, isGlass = false, ...props }: CardProps) {
  return (
    <motion.div
      id={id ?? 'card-container'}
      whileHover={isHoverable ? { y: -2, transition: { duration: 0.2 } } : undefined}
      className={cn(
        'rounded-xl border border-border bg-card text-card-foreground shadow-sm overflow-hidden',
        isGlass ? 'glass-effect' : '',
        isHoverable ? 'hover:shadow-md transition-shadow' : '',
        className
      )}
      {...props}
    />
  );
}

export function CardHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('flex flex-col space-y-1.5 p-6', className)} {...props} />;
}

export function CardTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={cn('text-lg font-semibold leading-none tracking-tight text-foreground', className)} {...props} />;
}

export function CardDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn('text-sm text-muted-foreground', className)} {...props} />;
}

export function CardContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('p-6 pt-0', className)} {...props} />;
}

export function CardFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('flex items-center p-6 pt-0 border-t border-border/40 mt-4', className)} {...props} />;
}
