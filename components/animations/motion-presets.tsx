'use client';

import React from 'react';
import { motion, useReducedMotion } from 'motion/react';

export const fadeVariants = {
  hidden: { opacity: 0 },
  visible: (custom: number = 0) => ({
    opacity: 1,
    transition: {
      duration: 0.4,
      ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
      delay: custom * 0.05,
    },
  }),
  exit: {
    opacity: 0,
    transition: { duration: 0.2 },
  },
};

export const slideVariants = {
  hidden: (direction: 'up' | 'down' | 'left' | 'right' = 'up') => ({
    opacity: 0,
    x: direction === 'left' ? -20 : direction === 'right' ? 20 : 0,
    y: direction === 'up' ? 20 : direction === 'down' ? -20 : 0,
  }),
  visible: (custom: { delay?: number; direction?: 'up' | 'down' | 'left' | 'right' } = {}) => ({
    opacity: 1,
    x: 0,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
      delay: custom.delay ?? 0,
    },
  }),
  exit: (direction: 'up' | 'down' | 'left' | 'right' = 'up') => ({
    opacity: 0,
    x: direction === 'left' ? 20 : direction === 'right' ? -20 : 0,
    y: direction === 'up' ? -20 : direction === 'down' ? 20 : 0,
    transition: { duration: 0.25 },
  }),
};

export const scaleVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: (custom: number = 0) => ({
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
      delay: custom * 0.05,
    },
  }),
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: { duration: 0.2 },
  },
};

interface MotionProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  id?: string;
}

export function FadeIn({ children, delay = 0, className, id }: MotionProps) {
  const shouldReduceMotion = useReducedMotion();
  const variants = shouldReduceMotion ? { hidden: { opacity: 0 }, visible: { opacity: 1 } } : fadeVariants;

  return (
    <motion.div
      id={id}
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={variants}
      custom={delay}
      className={className}
    >
      {children}
    </motion.div>
  );
}

interface SlideInProps extends MotionProps {
  direction?: 'up' | 'down' | 'left' | 'right';
}

export function SlideIn({ children, direction = 'up', delay = 0, className, id }: SlideInProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return (
      <FadeIn delay={delay} className={className} id={id}>
        {children}
      </FadeIn>
    );
  }

  return (
    <motion.div
      id={id}
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={slideVariants}
      custom={{ delay, direction }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function ScaleIn({ children, delay = 0, className, id }: MotionProps) {
  const shouldReduceMotion = useReducedMotion();
  const variants = shouldReduceMotion ? { hidden: { opacity: 0 }, visible: { opacity: 1 } } : scaleVariants;

  return (
    <motion.div
      id={id}
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={variants}
      custom={delay}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function PageTransition({ children, className, id }: Omit<MotionProps, 'delay'>) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div id={id} className={className}>{children}</div>;
  }

  return (
    <motion.main
      id={id}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.main>
  );
}
