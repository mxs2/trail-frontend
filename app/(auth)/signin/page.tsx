'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Alert from '@mui/material/Alert';
import Link from 'next/link';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useStore } from '../../../store/useStore';
import { api } from '../../../services/api';
import AuthShell from '../../../components/auth/AuthShell';
import PasswordField from '../../../components/auth/PasswordField';
import { tokens } from '../../../lib/tokens';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function SignInPage() {
  const router = useRouter();
  const setUser = useStore((s) => s.setUser);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [emailError, setEmailError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setEmailError('');
    if (!EMAIL_RE.test(email)) {
      setEmailError('E-mail inválido.');
      return;
    }
    setLoading(true);
    try {
      const user = await api.login(email, password);
      setUser(user);
      router.push('/dashboard');
    } catch {
      setError('E-mail ou senha inválidos.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell>
      {/* Eyebrow */}
      <Typography
        variant="caption"
        sx={{ color: 'primary.main', letterSpacing: '0.12em', display: 'block', mb: 1 }}
      >
        ENTRAR
      </Typography>

      {/* Heading */}
      <Typography
        component="h1"
        sx={{
          fontFamily: 'var(--f-serif)',
          fontSize: { xs: '2rem', md: '2.5rem' },
          fontWeight: 400,
          lineHeight: 1.1,
          mb: 1.25,
        }}
      >
        Bem-vindo de volta.
      </Typography>

      {/* Subtitle */}
      <Typography sx={{ color: 'text.disabled', fontSize: '0.9rem', mb: 3.75 }}>
        Continue de onde você parou.
      </Typography>

      {/* Form */}
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
        noValidate
      >
        {error && (
          <Alert severity="error" sx={{ borderRadius: 2 }}>
            {error}
          </Alert>
        )}

        <TextField
          label="E-mail"
          type="email"
          value={email}
          onChange={(e) => { setEmail(e.target.value); setEmailError(''); }}
          error={!!emailError}
          helperText={emailError}
          fullWidth
          required
          autoComplete="email"
        />

        <Box>
          <PasswordField
            label="Senha"
            value={password}
            onChange={setPassword}
            required
            autoComplete="current-password"
          />
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 0.75 }}>
            <Typography
              component="span"
              variant="caption"
              sx={{
                color: 'primary.main',
                cursor: 'default',
                fontFamily: 'var(--f-sans)',
                fontSize: '0.75rem',
              }}
            >
              Esqueci minha senha
            </Typography>
          </Box>
        </Box>

        <Button
          type="submit"
          variant="contained"
          color="primary"
          size="large"
          fullWidth
          disabled={loading}
          endIcon={<ArrowForwardIcon sx={{ fontSize: '14px !important' }} />}
          sx={{ mt: 1 }}
        >
          {loading ? 'Entrando…' : 'Entrar'}
        </Button>
      </Box>

      {/* OR divider */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, my: 3 }}>
        <Divider sx={{ flex: 1 }} />
        <Typography
          variant="caption"
          sx={{ color: tokens.text[3], letterSpacing: '0.1em', fontFamily: 'var(--f-mono)' }}
        >
          OU
        </Typography>
        <Divider sx={{ flex: 1 }} />
      </Box>

      {/* Social buttons */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.25 }}>
        <Button variant="outlined" fullWidth>
          Continuar com Google
        </Button>
        <Button variant="outlined" fullWidth>
          Continuar com GitHub
        </Button>
      </Box>

      {/* Switch link */}
      <Typography
        sx={{ textAlign: 'center', mt: 4, fontSize: '0.8125rem', color: 'text.secondary' }}
      >
        Novo por aqui?{' '}
        <Box
          component={Link}
          href="/signup"
          sx={{ color: 'primary.main', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
        >
          Criar conta
        </Box>
      </Typography>
    </AuthShell>
  );
}
