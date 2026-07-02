import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Button } from '@/components/ui/button';

describe('Button component', () => {
  it('renders correctly with children', () => {
    render(<Button id="test-btn">Clique Aqui</Button>);
    const button = screen.getByRole('button', { name: /clique aqui/i });
    expect(button).toBeInTheDocument();
  });

  it('handles click events successfully', () => {
    const handleClick = vi.fn();
    render(<Button id="test-btn" onClick={handleClick}>Enviar</Button>);
    const button = screen.getByRole('button', { name: /enviar/i });
    fireEvent.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('disables the button when isLoading is toggled', () => {
    render(<Button id="test-btn" isLoading>Criar</Button>);
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });
});
