'use client';

import { useState, useRef, useEffect } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import InputBase from '@mui/material/InputBase';
import CircularProgress from '@mui/material/CircularProgress';
import Collapse from '@mui/material/Collapse';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import SendIcon from '@mui/icons-material/Send';
import CloseIcon from '@mui/icons-material/Close';
import { api, type ChatMessage } from '../../services/api';
import { tokens } from '../../lib/tokens';

interface Props {
  challengeId: string;
  challengeTitle: string;
}

/**
 * Inline Socratic AI tutor.
 *
 * - Conversation history is held client-side (no backend session).
 * - Each request sends the full history so the model has context.
 * - Backend system prompt enforces zero-code-output — the tutor never reveals solutions.
 * - Max message length: 500 chars enforced on client.
 */
export function SocraticChat({ challengeId, challengeTitle }: Props) {
  const [open, setOpen] = useState(false);
  const [history, setHistory] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history, open]);

  async function sendMessage() {
    const trimmed = input.trim();
    if (!trimmed || loading) return;

    const userMsg: ChatMessage = { role: 'user', content: trimmed };
    setHistory((h) => [...h, userMsg]);
    setInput('');
    setLoading(true);
    setError('');

    try {
      const { reply } = await api.socraticChat({
        challengeId,
        history,
        newMessage: trimmed,
      });
      setHistory((h) => [...h, { role: 'assistant', content: reply }]);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erro ao conectar com o tutor.';
      setError(
        msg.includes('503') || msg.includes('not configured')
          ? 'O tutor IA não está configurado ainda. Peça ao administrador para adicionar a chave da API.'
          : msg
      );
      setHistory((h) => h.slice(0, -1));
    } finally {
      setLoading(false);
    }
  }

  return (
    <Box>
      <Button
        size="small"
        startIcon={
          <AutoAwesomeIcon sx={{ fontSize: '14px !important', color: tokens.violet.main }} />
        }
        onClick={() => setOpen((v) => !v)}
        sx={{
          textTransform: 'none',
          color: tokens.violet.main,
          fontSize: '0.8125rem',
          pl: 0,
          '&:hover': { bgcolor: 'transparent', opacity: 0.8 },
        }}
      >
        {open ? 'Fechar tutor' : 'Pedir ajuda ao Tutor IA'}
      </Button>

      <Collapse in={open}>
        <Box
          sx={{
            mt: 1.5,
            borderRadius: '12px',
            border: `1px solid ${tokens.violet.ring}`,
            bgcolor: tokens.violet.soft,
            overflow: 'hidden',
          }}
        >
          {/* Header */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              px: 2,
              py: 1.25,
              borderBottom: `1px solid ${tokens.violet.ring}`,
            }}
          >
            <AutoAwesomeIcon sx={{ fontSize: 14, color: tokens.violet.main }} />
            <Typography
              sx={{ fontSize: '0.8125rem', fontWeight: 600, color: tokens.violet.main, flex: 1 }}
            >
              Tutor IA — {challengeTitle}
            </Typography>
            <IconButton
              size="small"
              onClick={() => setOpen(false)}
              sx={{ color: tokens.text[2], p: 0.5 }}
            >
              <CloseIcon sx={{ fontSize: 14 }} />
            </IconButton>
          </Box>

          {/* Message history */}
          <Box
            sx={{
              maxHeight: 300,
              overflowY: 'auto',
              px: 2,
              py: 1.5,
              display: 'flex',
              flexDirection: 'column',
              gap: 1.25,
            }}
          >
            {history.length === 0 && (
              <Typography
                sx={{ fontSize: '0.8125rem', color: tokens.text[2], fontStyle: 'italic' }}
              >
                Olá! Estou aqui para te guiar — mas não vou escrever o código por você. O que você
                está tentando entender?
              </Typography>
            )}

            {history.map((msg, i) => (
              <Box
                key={i}
                sx={{
                  alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '85%',
                  px: 1.5,
                  py: 1,
                  borderRadius: msg.role === 'user' ? '12px 12px 4px 12px' : '12px 12px 12px 4px',
                  bgcolor: msg.role === 'user' ? `${tokens.violet.main}33` : tokens.bg[3],
                  border: `1px solid ${msg.role === 'user' ? tokens.violet.ring : tokens.line.default}`,
                }}
              >
                <Typography
                  sx={{
                    fontSize: '0.8125rem',
                    color: 'text.primary',
                    lineHeight: 1.55,
                    whiteSpace: 'pre-wrap',
                  }}
                >
                  {msg.content}
                </Typography>
              </Box>
            ))}

            {loading && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CircularProgress size={14} sx={{ color: tokens.violet.main }} />
                <Typography sx={{ fontSize: '0.75rem', color: tokens.text[2] }}>
                  Tutor digitando…
                </Typography>
              </Box>
            )}

            {error && (
              <Typography
                sx={{
                  fontSize: '0.75rem',
                  color: 'error.main',
                  p: 1,
                  bgcolor: 'rgba(248,113,113,0.08)',
                  borderRadius: '8px',
                }}
              >
                {error}
              </Typography>
            )}

            <div ref={bottomRef} />
          </Box>

          {/* Input */}
          <Box
            component="form"
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage();
            }}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              px: 2,
              py: 1.25,
              borderTop: `1px solid ${tokens.violet.ring}`,
            }}
          >
            <InputBase
              value={input}
              onChange={(e) => setInput(e.target.value.slice(0, 500))}
              placeholder="Pergunte algo… (max 500 chars)"
              fullWidth
              disabled={loading}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
              sx={{
                fontSize: '0.8125rem',
                color: 'text.primary',
                '& input::placeholder': { color: tokens.text[2] },
              }}
            />
            <IconButton
              type="submit"
              size="small"
              disabled={!input.trim() || loading}
              sx={{ color: tokens.violet.main, '&:disabled': { color: tokens.text[3] } }}
            >
              <SendIcon sx={{ fontSize: 16 }} />
            </IconButton>
          </Box>
        </Box>
      </Collapse>
    </Box>
  );
}
