import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import Navbar from '@/components/Navbar';
import { renderWithTheme } from '../../test/test-utils';

describe('Navbar', () => {
  // Teste F4 — O link "Trilhas" deve apontar para /trails.
  it('renderiza o link de Trilhas apontando para /trails', () => {
    renderWithTheme(<Navbar />);

    const link = screen.getByRole('link', { name: 'Trilhas' });
    expect(link).toHaveAttribute('href', '/trails');
  });

  // Teste F5 — O link do Dashboard deve apontar para /dashboard.
  it('renderiza o link do Dashboard apontando para /dashboard', () => {
    renderWithTheme(<Navbar />);

    const link = screen.getByRole('link', { name: 'Dashboard Admin' });
    expect(link).toHaveAttribute('href', '/dashboard');
  });

  // Teste F6 — A marca "TRAIL" deve linkar para a home.
  it('renderiza a marca apontando para a home', () => {
    renderWithTheme(<Navbar />);

    const brand = screen.getByRole('link', { name: /TRAIL/i });
    expect(brand).toHaveAttribute('href', '/');
  });
});
