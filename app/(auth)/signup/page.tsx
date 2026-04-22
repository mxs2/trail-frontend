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

export default function SignUpPage() {
  const router = useRouter();
  const setUser = useStore((s) => s.setUser);
  const [name, setName] = useState('');
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
    if (password.length < 8) {
      setError('A senha precisa ter pelo menos 8 caracteres.');
      return;
    }
    setLoading(true);
    try {
      const user = await api.register(name, email, password);
      setUser(user);
      router.push('/onboarding');
    } catch {
      setError('Não foi possível criar sua conta. Tente novamente.');
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
        CRIAR CONTA
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
        Sua trilha começa aqui.
      </Typography>

      {/* Subtitle */}
      <Typography sx={{ color: 'text.disabled', fontSize: '0.9rem', mb: 3.75 }}>
        Em 3 min você tem sua primeira trilha gerada pela IA.
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
          label="Nome completo"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          fullWidth
          required
          autoComplete="name"
          placeholder="Matheus Silva"
        />

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
          placeholder="voce@email.com"
        />

        <PasswordField
          label="Senha"
          value={password}
          onChange={setPassword}
          required
          autoComplete="new-password"
          hint="8+ caracteres, com uma letra e um número."
        />

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
          {loading ? 'Criando conta…' : 'Criar conta e começar'}
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
        Já tem conta?{' '}
        <Box
          component={Link}
          href="/signin"
          sx={{ color: 'primary.main', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
        >
          Entrar
        </Box>
      </Typography>
    </AuthShell>
  );
}
