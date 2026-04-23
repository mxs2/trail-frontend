'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useStore } from '../../../../store/useStore';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import LinearProgress from '@mui/material/LinearProgress';
import Button from '@mui/material/Button';
import Collapse from '@mui/material/Collapse';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import LockIcon from '@mui/icons-material/Lock';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutlined';
import CodeIcon from '@mui/icons-material/Code';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import FilterListIcon from '@mui/icons-material/FilterList';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { tokens } from '../../../../lib/tokens';
import type { TrailModule, Lesson } from '../../../../types';

const TYPE_ICON: Record<string, React.ReactNode> = {
  video: <PlayCircleOutlineIcon sx={{ fontSize: 13 }} />,
  code: <CodeIcon sx={{ fontSize: 13 }} />,
  doc: <DescriptionOutlinedIcon sx={{ fontSize: 13 }} />,
};
const TYPE_LABEL: Record<string, string> = {
  video: 'Vídeo',
  code: 'Exercício',
  doc: 'Leitura',
};

function LessonRow({
  lesson,
  onToggle,
}: {
  lesson: Lesson;
  onToggle: () => void;
}) {
  const router = useRouter();
  const locked = false;
  const status = lesson.done ? 'done' : lesson.current ? 'current' : 'todo';

  const handleOpen = () => {
    router.push(`/aula/${lesson.id}`);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        py: 1.75,
        borderBottom: `1px solid ${tokens.line.default}`,
        opacity: locked ? 0.45 : 1,
        '&:last-child': { borderBottom: 'none' },
      }}
    >
      <Box
        component="button"
        onClick={onToggle}
        sx={{
          width: 22,
          height: 22,
          border: 'none',
          background: 'transparent',
          p: 0,
          cursor: 'pointer',
          color: lesson.done ? 'primary.main' : tokens.text[2],
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {lesson.done ? (
          <CheckCircleIcon sx={{ fontSize: 20, color: 'primary.main' }} />
        ) : (
          <RadioButtonUncheckedIcon sx={{ fontSize: 20 }} />
        )}
      </Box>

      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography
            sx={{
              fontSize: 14,
              fontWeight: status === 'current' ? 600 : 500,
              color: lesson.done ? tokens.text[2] : 'text.primary',
              textDecoration: lesson.done ? 'line-through' : 'none',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {lesson.title}
          </Typography>
          {lesson.current && (
            <Box
              sx={{
                px: 1,
                py: 0.25,
                borderRadius: '20px',
                bgcolor: tokens.orange.soft,
                border: `1px solid ${tokens.orange.ring}`,
                fontSize: 10,
                fontWeight: 600,
                color: 'primary.main',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                whiteSpace: 'nowrap',
                flexShrink: 0,
              }}
            >
              Atual
            </Box>
          )}
        </Box>
        <Box sx={{ display: 'flex', gap: 1.5, mt: 0.5, color: tokens.text[2], fontSize: 12, alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            {TYPE_ICON[lesson.type]}
            <span>{TYPE_LABEL[lesson.type]}</span>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <AccessTimeIcon sx={{ fontSize: 13 }} />
            <span>{lesson.duration}</span>
          </Box>
        </Box>
      </Box>

      <Button
        onClick={handleOpen}
        size="small"
        variant="text"
        endIcon={<ArrowForwardIosIcon sx={{ fontSize: '10px !important' }} />}
        sx={{
          fontSize: 12,
          color: tokens.text[2],
          textTransform: 'none',
          px: 1.5,
          py: 0.5,
          flexShrink: 0,
          '&:hover': { color: 'text.primary', bgcolor: tokens.bg[4] },
        }}
      >
        {lesson.current ? 'Retomar' : lesson.done ? 'Revisar' : 'Abrir'}
      </Button>
    </Box>
  );
}

function ModuleCard({
  mod,
  idx,
  onToggle,
}: {
  mod: TrailModule;
  idx: number;
  onToggle: (lessonIdx: number) => void;
}) {
  const total = mod.lessons.length;
  const done = mod.lessons.filter((l) => l.done).length;
  const pct = Math.round((done / total) * 100);
  const [open, setOpen] = useState(mod.current || idx === 0);

  return (
    <Box
      sx={{
        bgcolor: tokens.bg[3],
        border: `1px solid ${tokens.line.default}`,
        borderRadius: '14px',
        mb: 1.5,
        overflow: 'hidden',
        opacity: mod.locked ? 0.65 : 1,
      }}
    >
      <Box
        component="button"
        onClick={() => !mod.locked && setOpen(!open)}
        sx={{
          width: '100%',
          p: '18px 22px',
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          textAlign: 'left',
          background: 'transparent',
          border: 'none',
          color: 'inherit',
          cursor: mod.locked ? 'default' : 'pointer',
          '&:hover': !mod.locked
            ? { bgcolor: 'rgba(255,255,255,0.03)' }
            : {},
        }}
      >
        {/* Module number badge */}
        <Box
          sx={{
            width: 42,
            height: 42,
            borderRadius: '10px',
            bgcolor: mod.current ? tokens.orange.soft : tokens.bg[0],
            color: mod.current ? 'primary.main' : tokens.text[2],
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'var(--f-mono)',
            fontSize: 13,
            fontWeight: 600,
            border: `1px solid ${mod.current ? tokens.orange.ring : tokens.line.default}`,
            flexShrink: 0,
          }}
        >
          {mod.locked ? (
            <LockIcon sx={{ fontSize: 16 }} />
          ) : (
            String(idx + 1).padStart(2, '0')
          )}
        </Box>

        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
            <Typography sx={{ fontSize: 15, fontWeight: 600 }}>{mod.title}</Typography>
            {mod.current && (
              <Box
                sx={{
                  px: 1,
                  py: 0.25,
                  borderRadius: '20px',
                  bgcolor: tokens.orange.soft,
                  border: `1px solid ${tokens.orange.ring}`,
                  fontSize: 10,
                  fontWeight: 600,
                  color: 'primary.main',
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                }}
              >
                Módulo atual
              </Box>
            )}
            {mod.locked && (
              <Box
                sx={{
                  px: 1,
                  py: 0.25,
                  borderRadius: '20px',
                  bgcolor: tokens.bg[4],
                  border: `1px solid ${tokens.line.default}`,
                  fontSize: 10,
                  fontWeight: 600,
                  color: tokens.text[2],
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                }}
              >
                Bloqueado
              </Box>
            )}
          </Box>
          <Typography sx={{ fontSize: 12, color: tokens.text[2], mt: 0.5 }}>
            {done} de {total} aulas · {pct}% concluído
          </Typography>
        </Box>

        <Box sx={{ width: 100, flexShrink: 0 }}>
          <LinearProgress
            variant="determinate"
            value={pct}
            sx={{
              height: 4,
              borderRadius: 2,
              bgcolor: tokens.bg[0],
              '& .MuiLinearProgress-bar': { borderRadius: 2 },
            }}
          />
        </Box>

        {!mod.locked && (
          <Box sx={{ color: tokens.text[2], flexShrink: 0 }}>
            {open ? <ExpandLessIcon sx={{ fontSize: 18 }} /> : <ExpandMoreIcon sx={{ fontSize: 18 }} />}
          </Box>
        )}
      </Box>

      <Collapse in={open && !mod.locked}>
        <Box sx={{ px: '22px', pb: '14px', borderTop: `1px solid ${tokens.line.default}`, pt: 0.5 }}>
          {mod.lessons.map((l, li) => (
            <LessonRow
              key={l.id}
              lesson={l}
              onToggle={() => onToggle(li)}
            />
          ))}
        </Box>
      </Collapse>
    </Box>
  );
}

export default function TrilhaPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const trails = useStore((s) => s.trails);
  const toggleLesson = useStore((s) => s.toggleLesson);
  const trail = trails.find((t) => t.id === id) ?? trails[0];

  const handleToggle = (modIdx: number, lessonIdx: number) => {
    const lesson = trail.modules[modIdx]?.lessons[lessonIdx];
    if (lesson) toggleLesson(trail.id, lesson.id);
  };

  const currentLesson = trail.modules
    .flatMap((m) => m.lessons)
    .find((l) => l.current);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* Page header */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '1fr auto' },
          gap: 3,
          alignItems: 'end',
        }}
      >
        <Box>
          <Typography
            variant="caption"
            sx={{
              color: 'primary.main',
              letterSpacing: '0.10em',
              display: 'block',
              mb: 0.75,
              textTransform: 'uppercase',
            }}
          >
            Trilha personalizada pela IA · {trail.level}
          </Typography>
          <Typography
            component="h1"
            sx={{
              fontFamily: 'var(--f-serif)',
              fontSize: { xs: '1.75rem', md: '2.25rem' },
              fontWeight: 400,
              lineHeight: 1.15,
              mb: 0.75,
            }}
          >
            {trail.title}
          </Typography>
          <Typography sx={{ color: tokens.text[2], fontSize: '0.9rem' }}>
            {trail.subtitle}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 1.5, flexShrink: 0 }}>
          <Button
            variant="outlined"
            startIcon={<BookmarkBorderIcon />}
            sx={{
              borderColor: tokens.line.default,
              color: tokens.text[2],
              textTransform: 'none',
              '&:hover': { borderColor: tokens.line.strong, bgcolor: tokens.bg[4] },
            }}
          >
            Salvar
          </Button>
          <Button
            variant="contained"
            startIcon={<PlayArrowIcon />}
            onClick={() =>
              currentLesson && router.push(`/aula/${currentLesson.id}`)
            }
            sx={{ textTransform: 'none', fontWeight: 600 }}
          >
            Retomar trilha
          </Button>
        </Box>
      </Box>

      {/* Stats row */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr 1fr', md: 'repeat(4, 1fr)' },
          gap: 1.75,
        }}
      >
        {/* Progress */}
        <Box
          sx={{
            p: 2.5,
            bgcolor: tokens.bg[3],
            border: `1px solid ${tokens.line.default}`,
            borderRadius: '14px',
          }}
        >
          <Typography
            sx={{
              fontSize: 10,
              color: tokens.text[2],
              fontFamily: 'var(--f-mono)',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              mb: 1,
            }}
          >
            Progresso
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.75 }}>
            <Typography
              sx={{ fontFamily: 'var(--f-serif)', fontSize: 28, lineHeight: 1 }}
            >
              {trail.progress}
            </Typography>
            <Typography sx={{ color: tokens.text[2], fontSize: 14 }}>%</Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={trail.progress}
            sx={{
              mt: 1.5,
              height: 4,
              borderRadius: 2,
              bgcolor: tokens.bg[0],
              '& .MuiLinearProgress-bar': { borderRadius: 2 },
            }}
          />
        </Box>

        {/* Aulas */}
        <Box
          sx={{
            p: 2.5,
            bgcolor: tokens.bg[3],
            border: `1px solid ${tokens.line.default}`,
            borderRadius: '14px',
          }}
        >
          <Typography
            sx={{
              fontSize: 10,
              color: tokens.text[2],
              fontFamily: 'var(--f-mono)',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              mb: 1,
            }}
          >
            Aulas
          </Typography>
          <Typography sx={{ fontFamily: 'var(--f-serif)', fontSize: 28, lineHeight: 1 }}>
            {trail.lessonsDone}{' '}
            <Box component="span" sx={{ color: tokens.text[3], fontSize: 20 }}>
              / {trail.lessonsTotal}
            </Box>
          </Typography>
          <Typography sx={{ fontSize: 12, color: tokens.text[2], mt: 1.5 }}>
            concluídas
          </Typography>
        </Box>

        {/* Tempo */}
        <Box
          sx={{
            p: 2.5,
            bgcolor: tokens.bg[3],
            border: `1px solid ${tokens.line.default}`,
            borderRadius: '14px',
          }}
        >
          <Typography
            sx={{
              fontSize: 10,
              color: tokens.text[2],
              fontFamily: 'var(--f-mono)',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              mb: 1,
            }}
          >
            Tempo
          </Typography>
          <Typography sx={{ fontFamily: 'var(--f-serif)', fontSize: 28, lineHeight: 1 }}>
            {trail.hoursDone}h{' '}
            <Box component="span" sx={{ color: tokens.text[3], fontSize: 20 }}>
              / {trail.hoursTotal}h
            </Box>
          </Typography>
          <Typography sx={{ fontSize: 12, color: tokens.text[2], mt: 1.5 }}>
            total estimado
          </Typography>
        </Box>

        {/* IA Card */}
        <Box
          sx={{
            p: 2.5,
            bgcolor: tokens.violet.soft,
            border: `1px solid ${tokens.violet.ring}`,
            borderRadius: '14px',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 0.75,
              fontSize: 10,
              color: tokens.violet.main,
              fontFamily: 'var(--f-mono)',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              mb: 1,
            }}
          >
            <AutoAwesomeIcon sx={{ fontSize: 12 }} />
            <span>IA</span>
          </Box>
          <Typography
            sx={{ fontSize: 13, color: 'text.primary', lineHeight: 1.45 }}
          >
            {trail.aiNote}
          </Typography>
        </Box>
      </Box>

      {/* Modules section */}
      <Box>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            mb: 2,
          }}
        >
          <Typography
            sx={{ fontFamily: 'var(--f-serif)', fontSize: 22, whiteSpace: 'nowrap' }}
          >
            {trail.modules.length} módulos
          </Typography>
          <Box sx={{ flex: 1, height: '1px', bgcolor: tokens.line.default }} />
          <Button
            size="small"
            variant="text"
            startIcon={<FilterListIcon sx={{ fontSize: 14 }} />}
            sx={{
              fontSize: 12,
              color: tokens.text[2],
              textTransform: 'none',
              flexShrink: 0,
              '&:hover': { color: 'text.primary', bgcolor: tokens.bg[4] },
            }}
          >
            Filtrar
          </Button>
        </Box>

        {trail.modules.map((m, i) => (
          <ModuleCard
            key={m.id}
            mod={m}
            idx={i}
            onToggle={(li) => handleToggle(i, li)}
          />
        ))}
      </Box>
    </Box>
  );
}
