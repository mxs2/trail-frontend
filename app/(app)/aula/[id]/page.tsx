'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import TextField from '@mui/material/TextField';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutlined';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import SendIcon from '@mui/icons-material/Send';
import PlayCircleOutlinedIcon from '@mui/icons-material/PlayCircleOutlined';
import CodeIcon from '@mui/icons-material/Code';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { useStore } from '../../../../store/useStore';
import { tokens } from '../../../../lib/tokens';
import type { Lesson, Trail, TrailModule } from '../../../../types';

const TYPE_ICON: Record<string, React.ReactNode> = {
  video: <PlayCircleOutlinedIcon sx={{ fontSize: 14 }} />,
  code: <CodeIcon sx={{ fontSize: 14 }} />,
  doc: <DescriptionOutlinedIcon sx={{ fontSize: 14 }} />,
};
const TYPE_LABEL: Record<string, string> = {
  video: 'VÍDEO',
  code: 'EXERCÍCIO',
  doc: 'LEITURA',
};

const CONTENT_MOCK = `Context API é uma ferramenta nativa do React que permite compartilhar dados entre componentes sem precisar passar props manualmente em cada nível da árvore — o que é chamado de prop drilling.

O padrão básico envolve três partes: criar o contexto com createContext, prover o valor com um componente Provider e consumir o valor com o hook useContext. O grande benefício é que qualquer componente dentro da árvore pode acessar o valor diretamente, independentemente da profundidade.

Uma boa prática é isolar o contexto em um hook customizado — por exemplo, useTheme ou useAuth — para evitar que os componentes consumidores precisem importar o contexto diretamente. Isso também facilita futuras mudanças de implementação sem impactar os consumidores.`;

const TRANSCRIPT_MOCK = `[00:00] Nessa aula vamos entender o Context API, por que ele existe e como usá-lo na prática.

[02:15] Primeiro, vamos criar um contexto simples com createContext. Repare que o valor padrão serve como fallback quando não há Provider acima na árvore.

[08:42] Agora vem a parte importante: o Provider. Ele envolve a árvore e distribui o valor para todos os componentes filhos que consumirem esse contexto.

[14:30] O useContext é o hook que você vai usar para consumir o contexto. Ele recebe o objeto retornado por createContext e devolve o valor atual.

[20:00] Dica final: quando o contexto mudar, todos os componentes que o consomem vão re-renderizar. Por isso, pense bem no que colocar dentro do contexto.`;

const RESOURCES_MOCK = [
  { title: 'Documentação oficial — useContext', url: '#', type: 'doc' },
  { title: 'Artigo: When to use Context vs. state lifting', url: '#', type: 'doc' },
  { title: 'Repositório de exemplos da aula', url: '#', type: 'code' },
  { title: 'Vídeo complementar: Zustand vs Context', url: '#', type: 'video' },
];

const INITIAL_MESSAGES = [
  {
    role: 'ai' as const,
    text: 'Oi! Percebi que você está na aula sobre Context API. Posso ajudar com alguma dúvida antes de começar?',
  },
  {
    role: 'user' as const,
    text: 'Qual a diferença entre useState e useContext?',
  },
  {
    role: 'ai' as const,
    text: 'Boa pergunta! useState armazena estado local de um componente. useContext acessa um valor compartilhado que foi provido mais acima na árvore — não armazena estado em si, apenas consome. Você costuma combinar os dois: o Provider tem um useState interno e distribui o valor pelo contexto.',
  },
  {
    role: 'user' as const,
    text: 'Então Context sozinho não armazena estado?',
  },
  {
    role: 'ai' as const,
    text: 'Exatamente. Context é só o canal de distribuição. O estado em si fica no componente que wrapa o Provider — normalmente com useState ou useReducer. O Context apenas evita que você precise passar esse estado como prop por vários níveis.',
  },
];

function findLesson(trails: Trail[], lessonId: string) {
  for (const trail of trails) {
    for (let mi = 0; mi < trail.modules.length; mi++) {
      const mod = trail.modules[mi];
      for (let li = 0; li < mod.lessons.length; li++) {
        if (mod.lessons[li].id === lessonId) {
          return { trail, module: mod, moduleIdx: mi, lesson: mod.lessons[li], lessonIdx: li };
        }
      }
    }
  }
  return null;
}

function flatLessons(trail: Trail): { lesson: Lesson; mod: TrailModule }[] {
  return trail.modules.flatMap((m) => m.lessons.map((l) => ({ lesson: l, mod: m })));
}

export default function AulaPage() {
  const params = useParams();
  const router = useRouter();
  const lessonId = params?.id as string;

  const trails = useStore((s) => s.trails);
  const toggleLesson = useStore((s) => s.toggleLesson);

  const found = findLesson(trails, lessonId);

  const [tab, setTab] = useState(0);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [chatMsg, setChatMsg] = useState('');
  const [messages, setMessages] =
    useState<{ role: 'ai' | 'user'; text: string }[]>(INITIAL_MESSAGES);

  if (!found) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: 2 }}>
        <Typography sx={{ fontFamily: 'var(--f-serif)', fontSize: 28 }}>Aula não encontrada</Typography>
        <Typography sx={{ color: tokens.text[2] }}>O ID <code>{lessonId}</code> não corresponde a nenhuma aula.</Typography>
        <Button variant="contained" onClick={() => router.push('/dashboard')}>Voltar ao dashboard</Button>
      </Box>
    );
  }

  const { trail, module: mod, moduleIdx, lesson, lessonIdx } = found;
  const flat = flatLessons(trail);
  const flatIdx = flat.findIndex((x) => x.lesson.id === lessonId);
  const prevLesson = flat[flatIdx - 1]?.lesson ?? null;
  const nextLesson = flat[flatIdx + 1]?.lesson ?? null;

  const handleToggle = () => toggleLesson(trail.id, lesson.id);

  const handleSendMsg = () => {
    const text = chatMsg.trim();
    if (!text) return;
    setMessages((prev) => [
      ...prev,
      { role: 'user', text },
      { role: 'ai', text: 'Entendido! Essa é uma ótima observação. Vou elaborar melhor quando você terminar essa seção da aula.' },
    ]);
    setChatMsg('');
  };

  const FEEDBACKS = [
    { key: 'dificil', label: '😤 Difícil' },
    { key: 'medida', label: '👍 Na medida' },
    { key: 'facil', label: '🚀 Fácil' },
  ];

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', md: '1fr 380px' },
        gap: 3,
        alignItems: 'flex-start',
      }}
    >
      {/* ── COLUNA PRINCIPAL ── */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>

        {/* Breadcrumb */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
          <Link href={`/trilha/${trail.id}`} style={{ textDecoration: 'none' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
              <ArrowBackIcon sx={{ fontSize: 12, color: tokens.text[2] }} />
              <Typography
                sx={{
                  fontSize: 11,
                  color: tokens.text[2],
                  fontFamily: 'var(--f-mono)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  '&:hover': { color: 'text.primary' },
                }}
              >
                {trail.title}
              </Typography>
            </Box>
          </Link>
          <Typography sx={{ fontSize: 11, color: tokens.text[3] }}>·</Typography>
          <Typography
            sx={{
              fontSize: 11,
              color: tokens.text[2],
              fontFamily: 'var(--f-mono)',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
            }}
          >
            Módulo {moduleIdx + 1} · {mod.title}
          </Typography>
          <Typography sx={{ fontSize: 11, color: tokens.text[3] }}>·</Typography>
          <Typography
            sx={{
              fontSize: 11,
              color: tokens.text[3],
              fontFamily: 'var(--f-mono)',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
            }}
          >
            Aula {lessonIdx + 1} de {mod.lessons.length}
          </Typography>
        </Box>

        {/* Video player mock */}
        <Box
          sx={{
            position: 'relative',
            aspectRatio: '16 / 9',
            background: `linear-gradient(135deg, ${tokens.bg[0]} 0%, ${tokens.bg[3]} 100%)`,
            borderRadius: '16px',
            border: `1px solid ${tokens.line.default}`,
            overflow: 'hidden',
          }}
        >
          {/* Background watermark */}
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: 'var(--f-mono)',
              color: tokens.text[3],
              fontSize: 11,
              flexDirection: 'column',
              gap: 1,
              userSelect: 'none',
            }}
          >
            <Typography sx={{ fontSize: 48, lineHeight: 1, opacity: 0.3 }}>{'<>'}</Typography>
            <Typography sx={{ fontFamily: 'var(--f-mono)', fontSize: 11, color: tokens.text[3], opacity: 0.5 }}>
              vídeo placeholder · {lesson.duration}
            </Typography>
          </Box>

          {/* Play button */}
          <Box
            sx={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
              width: 72,
              height: 72,
              borderRadius: '50%',
              bgcolor: 'primary.main',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 16px 48px rgba(255,98,0,0.4)',
              cursor: 'pointer',
              transition: 'transform 0.15s',
              '&:hover': { transform: 'translate(-50%, -50%) scale(1.08)' },
            }}
          >
            <PlayArrowIcon sx={{ fontSize: 36, color: '#fff' }} />
          </Box>

          {/* Overlay info */}
          <Box
            sx={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              p: 2,
              background: 'linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.75) 100%)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
            }}
          >
            <Typography sx={{ fontSize: 13, fontWeight: 600, color: '#fff' }}>{lesson.title}</Typography>
            <Typography sx={{ fontFamily: 'var(--f-mono)', fontSize: 11, color: 'rgba(255,255,255,0.6)' }}>
              {lesson.duration}
            </Typography>
          </Box>
        </Box>

        {/* Lesson header */}
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: tokens.text[2] }}>
              {TYPE_ICON[lesson.type]}
            </Box>
            <Typography
              sx={{
                fontSize: 10,
                fontFamily: 'var(--f-mono)',
                letterSpacing: '0.1em',
                color: tokens.text[2],
                textTransform: 'uppercase',
              }}
            >
              {TYPE_LABEL[lesson.type]} · {lesson.duration}
            </Typography>
          </Box>
          <Typography
            component="h1"
            sx={{
              fontFamily: 'var(--f-serif)',
              fontSize: { xs: '1.5rem', md: '2rem' },
              fontWeight: 400,
              lineHeight: 1.2,
              mb: 1,
            }}
          >
            {lesson.title}
          </Typography>
          <Typography sx={{ color: tokens.text[2], fontSize: '0.875rem', lineHeight: 1.6, maxWidth: 640 }}>
            Compartilhe estado entre componentes sem prop drilling. Nesta aula, vamos criar um ThemeContext do zero e entender quando Context é a ferramenta certa — e quando não é.
          </Typography>
        </Box>

        {/* Tabs */}
        <Box>
          <Tabs
            value={tab}
            onChange={(_, v) => setTab(v)}
            sx={{
              borderBottom: `1px solid ${tokens.line.default}`,
              minHeight: 40,
              '& .MuiTab-root': {
                fontSize: 13,
                fontWeight: 500,
                textTransform: 'none',
                minHeight: 40,
                py: 0,
                color: tokens.text[2],
              },
              '& .Mui-selected': { color: 'text.primary !important' },
              '& .MuiTabs-indicator': { bgcolor: 'primary.main' },
            }}
          >
            <Tab label="Conteúdo" />
            <Tab label="Transcrição" />
            <Tab label="Recursos" />
          </Tabs>

          <Box sx={{ pt: 2.5 }}>
            {tab === 0 && (
              <Typography
                sx={{
                  fontSize: '0.9rem',
                  lineHeight: 1.75,
                  color: 'text.primary',
                  whiteSpace: 'pre-line',
                }}
              >
                {CONTENT_MOCK}
              </Typography>
            )}

            {tab === 1 && (
              <Typography
                sx={{
                  fontSize: '0.875rem',
                  lineHeight: 1.8,
                  color: tokens.text[2],
                  fontFamily: 'var(--f-mono)',
                  whiteSpace: 'pre-line',
                }}
              >
                {TRANSCRIPT_MOCK}
              </Typography>
            )}

            {tab === 2 && (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.25 }}>
                {RESOURCES_MOCK.map((r, i) => (
                  <Box
                    key={i}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1.5,
                      p: 1.75,
                      bgcolor: tokens.bg[3],
                      border: `1px solid ${tokens.line.default}`,
                      borderRadius: '10px',
                      cursor: 'pointer',
                      '&:hover': { borderColor: tokens.line.strong, bgcolor: tokens.bg[4] },
                    }}
                  >
                    <Box sx={{ color: tokens.text[2] }}>{TYPE_ICON[r.type]}</Box>
                    <Typography sx={{ fontSize: 13, fontWeight: 500, flex: 1 }}>{r.title}</Typography>
                    <ArrowForwardIcon sx={{ fontSize: 14, color: tokens.text[3] }} />
                  </Box>
                ))}
              </Box>
            )}
          </Box>
        </Box>

        {/* Feedback */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            p: 2,
            bgcolor: tokens.bg[3],
            border: `1px solid ${tokens.line.default}`,
            borderRadius: '12px',
            flexWrap: 'wrap',
          }}
        >
          <Typography sx={{ fontSize: 13, color: tokens.text[2], mr: 0.5 }}>Como foi essa aula?</Typography>
          {FEEDBACKS.map((f) => (
            <Button
              key={f.key}
              size="small"
              onClick={() => setFeedback(f.key)}
              sx={{
                fontSize: 12,
                textTransform: 'none',
                borderRadius: '20px',
                px: 1.75,
                py: 0.5,
                border: '1px solid',
                borderColor: feedback === f.key ? 'primary.main' : tokens.line.default,
                color: feedback === f.key ? 'primary.main' : tokens.text[2],
                bgcolor: feedback === f.key ? tokens.orange.soft : 'transparent',
                '&:hover': {
                  bgcolor: feedback === f.key ? tokens.orange.soft : tokens.bg[4],
                  borderColor: feedback === f.key ? 'primary.main' : tokens.line.strong,
                },
              }}
            >
              {f.label}
            </Button>
          ))}
        </Box>

        {/* Bottom navigation */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            pt: 1,
            borderTop: `1px solid ${tokens.line.default}`,
          }}
        >
          <Button
            variant="outlined"
            startIcon={<NavigateBeforeIcon />}
            disabled={!prevLesson}
            onClick={() => prevLesson && router.push(`/aula/${prevLesson.id}`)}
            sx={{
              textTransform: 'none',
              borderColor: tokens.line.default,
              color: tokens.text[2],
              fontSize: 13,
              '&:hover': { borderColor: tokens.line.strong, bgcolor: tokens.bg[4] },
              '&.Mui-disabled': { opacity: 0.35 },
            }}
          >
            Anterior
          </Button>

          <Button
            variant="contained"
            startIcon={lesson.done ? <CheckCircleIcon /> : <CheckCircleOutlineIcon />}
            onClick={handleToggle}
            sx={{
              flex: 1,
              textTransform: 'none',
              fontWeight: 600,
              fontSize: 13,
              ...(lesson.done && {
                bgcolor: tokens.success.soft,
                color: '#5EEAD4',
                boxShadow: 'none',
                border: '1px solid rgba(94,234,212,0.3)',
                '&:hover': { bgcolor: 'rgba(94,234,212,0.18)', boxShadow: 'none' },
              }),
            }}
          >
            {lesson.done ? 'Concluída ✓' : 'Marcar como concluída'}
          </Button>

          <Button
            variant="outlined"
            endIcon={<NavigateNextIcon />}
            disabled={!nextLesson}
            onClick={() => nextLesson && router.push(`/aula/${nextLesson.id}`)}
            sx={{
              textTransform: 'none',
              borderColor: tokens.line.default,
              color: tokens.text[2],
              fontSize: 13,
              '&:hover': { borderColor: tokens.line.strong, bgcolor: tokens.bg[4] },
              '&.Mui-disabled': { opacity: 0.35 },
            }}
          >
            Próxima
          </Button>
        </Box>
      </Box>

      {/* ── COLUNA DIREITA: Chat IA ── */}
      <Box
        sx={{
          position: { md: 'sticky' },
          top: { md: 80 },
          bgcolor: tokens.bg[3],
          border: `1px solid ${tokens.violet.ring}`,
          borderRadius: '16px',
          display: 'flex',
          flexDirection: 'column',
          height: { md: 'calc(100vh - 112px)' },
          maxHeight: { md: 680 },
          overflow: 'hidden',
        }}
      >
        {/* Chat header */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.25,
            p: 2,
            borderBottom: `1px solid ${tokens.line.default}`,
            flexShrink: 0,
          }}
        >
          <Box
            sx={{
              width: 34,
              height: 34,
              borderRadius: '10px',
              bgcolor: tokens.violet.soft,
              border: `1px solid ${tokens.violet.ring}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <AutoAwesomeIcon sx={{ fontSize: 16, color: tokens.violet.main }} />
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography sx={{ fontSize: 14, fontWeight: 600 }}>Tutor IA</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Box
                sx={{
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  bgcolor: '#5EEAD4',
                  boxShadow: '0 0 6px #5EEAD4',
                }}
              />
              <Typography sx={{ fontSize: 11, color: '#5EEAD4', fontFamily: 'var(--f-mono)' }}>
                Online agora
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Messages */}
        <Box
          sx={{
            flex: 1,
            overflowY: 'auto',
            p: 2,
            display: 'flex',
            flexDirection: 'column',
            gap: 1.5,
            '&::-webkit-scrollbar': { width: 4 },
            '&::-webkit-scrollbar-thumb': { bgcolor: tokens.line.default, borderRadius: 2 },
          }}
        >
          {messages.map((msg, i) => (
            <Box
              key={i}
              sx={{
                display: 'flex',
                justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
              }}
            >
              <Box
                sx={{
                  maxWidth: '85%',
                  px: 1.75,
                  py: 1.25,
                  borderRadius: msg.role === 'ai' ? '4px 14px 14px 14px' : '14px 14px 4px 14px',
                  bgcolor: msg.role === 'ai' ? tokens.violet.soft : tokens.bg[0],
                  border: `1px solid ${msg.role === 'ai' ? tokens.violet.ring : tokens.line.default}`,
                }}
              >
                <Typography
                  sx={{
                    fontSize: 13,
                    lineHeight: 1.55,
                    color: msg.role === 'ai' ? 'text.primary' : tokens.text[2],
                  }}
                >
                  {msg.text}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>

        {/* Input */}
        <Box
          sx={{
            p: 1.5,
            borderTop: `1px solid ${tokens.line.default}`,
            display: 'flex',
            gap: 1,
            alignItems: 'flex-end',
            flexShrink: 0,
          }}
        >
          <TextField
            fullWidth
            multiline
            maxRows={3}
            size="small"
            placeholder="Pergunte ao Tutor IA..."
            value={chatMsg}
            onChange={(e) => setChatMsg(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMsg();
              }
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                fontSize: 13,
                bgcolor: tokens.bg[0],
                '& fieldset': { borderColor: tokens.line.default },
                '&:hover fieldset': { borderColor: tokens.line.strong },
                '&.Mui-focused fieldset': { borderColor: tokens.violet.ring },
              },
            }}
          />
          <IconButton
            onClick={handleSendMsg}
            sx={{
              bgcolor: tokens.violet.soft,
              border: `1px solid ${tokens.violet.ring}`,
              color: tokens.violet.main,
              borderRadius: '10px',
              width: 38,
              height: 38,
              flexShrink: 0,
              '&:hover': { bgcolor: 'rgba(167,139,250,0.22)' },
            }}
          >
            <SendIcon sx={{ fontSize: 16 }} />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
}
