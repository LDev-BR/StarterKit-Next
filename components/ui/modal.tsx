'use client';

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './button';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  id?: string;
}

export function Modal({ isOpen, onClose, title, description, children, className, id }: ModalProps) {
  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Esc key closure
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <AnimatePresence>
      {isOpen ? (
        <div id={id ?? 'modal-wrapper'} className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-neutral-950/40 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className={cn(
              'relative w-full max-w-lg rounded-xl border border-border bg-card p-6 shadow-xl z-10 overflow-hidden',
              className
            )}
          >
            {/* Close Button */}
            <Button
              variant="ghost"
              size="icon"
              id="modal-close-btn"
              onClick={onClose}
              className="absolute right-4 top-4 h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted/80 rounded-md"
            >
              <X className="h-4 w-4" />
            </Button>

            {/* Header */}
            {title || description ? (
              <div className="flex flex-col space-y-1.5 text-left mb-4">
                {title ? (
                  <h2 className="text-lg font-semibold text-foreground tracking-tight">
                    {title}
                  </h2>
                ) : null}
                {description ? (
                  <p className="text-sm text-muted-foreground">
                    {description}
                  </p>
                ) : null}
              </div>
            ) : null}

            {/* Content Slot */}
            <div className="text-left text-foreground">
              {children}
            </div>
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>
  );
}
export default Modal;
