import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import LandingNavbar from '@/components/landing/LandingNavbar';
import { renderWithTheme } from '../../test/test-utils';

describe('LandingNavbar', () => {
  // O CTA "Entrar" deve apontar para a tela de login.
  it('renderiza o link "Entrar" apontando para /signin', () => {
    renderWithTheme(<LandingNavbar />);

    const link = screen.getByRole('link', { name: 'Entrar' });
    expect(link).toHaveAttribute('href', '/signin');
  });

  // O CTA "Criar conta" deve apontar para o cadastro.
  it('renderiza o link "Criar conta" apontando para /signup', () => {
    renderWithTheme(<LandingNavbar />);

    const link = screen.getByRole('link', { name: 'Criar conta' });
    expect(link).toHaveAttribute('href', '/signup');
  });

  // Os links de navegação por âncora devem estar presentes.
  it('renderiza os links de navegação da seção', () => {
    renderWithTheme(<LandingNavbar />);

    expect(screen.getByRole('link', { name: 'Plataforma' })).toHaveAttribute('href', '#plataforma');
    expect(screen.getByRole('link', { name: 'Como funciona' })).toHaveAttribute(
      'href',
      '#como-funciona'
    );
  });

  // A marca (logo) deve ser exibida com texto alternativo acessível.
  it('exibe o logo da marca', () => {
    renderWithTheme(<LandingNavbar />);

    expect(screen.getByAltText('Trail')).toBeInTheDocument();
  });
});
