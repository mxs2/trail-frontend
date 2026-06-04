import { screen } from '@testing-library/react';
import PasswordField from '@/components/auth/PasswordField';
import { renderWithProviders } from '../../utils/renderWithProviders';

function Harness(props: { value?: string; onChange?: (v: string) => void }) {
  return (
    <PasswordField
      label="Senha"
      value={props.value ?? ''}
      onChange={props.onChange ?? (() => {})}
    />
  );
}

describe('PasswordField', () => {
  it('renders a masked password input by default', () => {
    renderWithProviders(<Harness />);
    expect(screen.getByLabelText('Senha')).toHaveAttribute('type', 'password');
  });

  it('reveals and hides the password when the toggle is pressed', async () => {
    const { user } = renderWithProviders(<Harness value="hunter2" />);

    await user.click(screen.getByRole('button', { name: 'Mostrar senha' }));
    expect(screen.getByLabelText('Senha')).toHaveAttribute('type', 'text');

    await user.click(screen.getByRole('button', { name: 'Ocultar senha' }));
    expect(screen.getByLabelText('Senha')).toHaveAttribute('type', 'password');
  });

  it('forwards typed characters to onChange', async () => {
    const onChange = jest.fn();
    const { user } = renderWithProviders(<Harness onChange={onChange} />);

    await user.type(screen.getByLabelText('Senha'), 'ab');
    expect(onChange).toHaveBeenCalledTimes(2);
    expect(onChange).toHaveBeenLastCalledWith('b');
  });
});
