import { screen } from '@testing-library/react';
import RecuperarSenhaPage from '@/app/(auth)/recuperar-senha/page';
import { api } from '@/services/api';
import { renderWithProviders } from '../../utils/renderWithProviders';

jest.mock('@/services/api');
const mockedApi = jest.mocked(api);

describe('Password recovery flow', () => {
  it('requests a reset link and confirms it was sent', async () => {
    mockedApi.requestPasswordReset.mockResolvedValue({ ok: true });
    const { user } = renderWithProviders(<RecuperarSenhaPage />);

    await user.type(screen.getByLabelText(/e-mail/i), 'matheus.silva@trail.dev');
    await user.click(screen.getByRole('button', { name: 'Enviar link' }));

    expect(await screen.findByRole('status')).toHaveTextContent(
      /link de redefinição já está a caminho/i
    );
    expect(mockedApi.requestPasswordReset).toHaveBeenCalledWith('matheus.silva@trail.dev');
  });

  it('validates the email before calling the API', async () => {
    const { user } = renderWithProviders(<RecuperarSenhaPage />);

    await user.type(screen.getByLabelText(/e-mail/i), 'nope');
    await user.click(screen.getByRole('button', { name: 'Enviar link' }));

    expect(await screen.findByText('E-mail inválido.')).toBeInTheDocument();
    expect(mockedApi.requestPasswordReset).not.toHaveBeenCalled();
  });
});
