import { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';

const theme = createTheme();

/**
 * Renderiza um componente envolto no ThemeProvider do MUI, garantindo que os
 * tokens de tema (cores, tipografia) resolvam como em produção.
 */
export function renderWithTheme(ui: ReactElement, options?: Omit<RenderOptions, 'wrapper'>) {
  return render(ui, {
    wrapper: ({ children }) => <ThemeProvider theme={theme}>{children}</ThemeProvider>,
    ...options,
  });
}

export * from '@testing-library/react';
