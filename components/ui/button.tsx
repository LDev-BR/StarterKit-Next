'use client';

import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { motion, type HTMLMotionProps } from 'motion/react';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-lg text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-neutral-800 dark:hover:bg-neutral-200 shadow-sm active:scale-98',
        outline: 'border border-border bg-transparent hover:bg-muted text-foreground active:scale-98',
        secondary: 'bg-muted text-foreground hover:bg-neutral-200 dark:hover:bg-neutral-800 active:scale-98',
        ghost: 'hover:bg-muted hover:text-foreground text-muted-foreground',
        glass: 'glass-effect text-foreground hover:bg-white/10 dark:hover:bg-black/20 active:scale-98',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-8 rounded-md px-3 text-xs',
        lg: 'h-12 rounded-lg px-8 text-base',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends Omit<HTMLMotionProps<'button'>, 'children'>,
    VariantProps<typeof buttonVariants> {
  children?: React.ReactNode;
  isLoading?: boolean;
}

export function Button({
  className,
  variant,
  size,
  children,
  isLoading,
  id,
  type = 'button',
  ...props
}: ButtonProps) {
  return (
    <motion.button
      id={id ?? 'btn-generic'}
      type={type}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      className={cn(buttonVariants({ variant, size, className }))}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? (
        <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
      ) : null}
      {children}
    </motion.button>
  );
}
export { buttonVariants };
