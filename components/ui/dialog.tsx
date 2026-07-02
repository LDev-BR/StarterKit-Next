'use client';

import React from 'react';
import { Modal } from './modal';
import { Button } from './button';
import { AlertCircle, CheckCircle2, HelpCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'success' | 'warning' | 'info';
  isConfirmLoading?: boolean;
}

export function Dialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  type = 'info',
  isConfirmLoading = false,
}: DialogProps) {
  const iconMap = {
    danger: <AlertCircle className="h-6 w-6 text-red-500" />,
    warning: <AlertCircle className="h-6 w-6 text-amber-500" />,
    success: <CheckCircle2 className="h-6 w-6 text-green-500" />,
    info: <HelpCircle className="h-6 w-6 text-blue-500" />,
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} id="dialog-wrapper" className="max-w-md">
      <div className="flex gap-4 items-start">
        <div className={cn(
          'p-2 rounded-full',
          type === 'danger' && 'bg-red-500/10',
          type === 'warning' && 'bg-amber-500/10',
          type === 'success' && 'bg-green-500/10',
          type === 'info' && 'bg-blue-500/10'
        )}>
          {iconMap[type]}
        </div>

        <div className="flex-1 flex flex-col gap-1 text-left align-left">
          <h3 className="text-base font-semibold text-foreground tracking-tight">
            {title}
          </h3>
          <p className="text-sm text-muted-foreground mr-4 leading-relaxed">
            {description}
          </p>
        </div>
      </div>

      <div className="flex justify-end gap-2 mt-6 border-t border-border/40 pt-4">
        <Button variant="ghost" className="text-xs" onClick={onClose} disabled={isConfirmLoading}>
          {cancelText}
        </Button>
        <Button
          variant={type === 'danger' ? 'glass' : 'default'}
          className={cn(
            'text-xs',
            type === 'danger' && 'bg-red-600 hover:bg-red-700 text-white border-transparent'
          )}
          onClick={onConfirm}
          isLoading={isConfirmLoading}
        >
          {confirmText}
        </Button>
      </div>
    </Modal>
  );
}
export default Dialog;
