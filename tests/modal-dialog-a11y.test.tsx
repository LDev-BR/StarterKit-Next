import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Modal } from '@/components/ui/modal';
import { Dialog } from '@/components/ui/dialog';

describe('Modal and Dialog accessibility', () => {
  it('exposes modal name, description, aria-modal and a named close button', () => {
    const handleClose = vi.fn();

    render(
      <Modal
        isOpen
        onClose={handleClose}
        title="Preferências"
        description="Ajustes visuais do starter kit."
      >
        Conteúdo do modal
      </Modal>
    );

    const dialog = screen.getByRole('dialog', { name: /preferências/i });
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(dialog).toHaveAccessibleDescription(/ajustes visuais/i);

    fireEvent.click(screen.getByRole('button', { name: /fechar modal/i }));
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('keeps confirmation dialogs labelled by their visible title and description', () => {
    render(
      <Dialog
        isOpen
        onClose={vi.fn()}
        onConfirm={vi.fn()}
        title="Confirmar sincronização"
        description="Ação simulada para validar o fluxo de confirmação."
        confirmText="Confirmar"
        cancelText="Voltar"
      />
    );

    const dialog = screen.getByRole('dialog', { name: /confirmar sincronização/i });
    expect(dialog).toHaveAccessibleDescription(/ação simulada/i);
    expect(screen.getByRole('button', { name: /confirmar/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /voltar/i })).toBeInTheDocument();
  });
});
