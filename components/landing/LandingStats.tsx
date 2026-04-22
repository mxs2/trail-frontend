// "Como funciona" (3 numbered steps) + depoimento de aluno
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { tokens } from '../../lib/tokens';

const STEPS = [
  {
    n: '01',
    title: 'Conte seu objetivo',
    description:
      'Vaga dev, trocar de stack, freelas. A IA usa isso como norte do seu aprendizado.',
  },
  {
    n: '02',
    title: 'Receba sua trilha',
    description:
      'Módulos, aulas e exercícios montados sob medida. Nada genérico, nada padrão.',
  },
  {
    n: '03',
    title: 'Avance no seu ritmo',
    description:
      'Conclua aulas, marque feedback, peça revisões. A trilha se adapta a cada passo.',
  },
];

function Eyebrow({ children }: { children: string }) {
  return (
    <Box
      sx={{
        fontFamily: 'var(--f-mono)',
        fontSize: 12,
        color: 'primary.main',
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        mb: 1.5,
      }}
    >
      {children}
    </Box>
  );
}

export default function LandingStats() {
  return (
    <>
      {/* Como funciona */}
      <Box
        component="section"
        id="como-funciona"
        sx={{
          px: { xs: 3, md: 6 },
          py: { xs: '60px', md: '80px' },
          borderTop: `1px solid ${tokens.line.default}`,
          maxWidth: 1200,
          mx: 'auto',
        }}
      >
        <Eyebrow>Como funciona</Eyebrow>
        <Typography
          component="h2"
          sx={{
            fontFamily: 'var(--f-serif)',
            fontWeight: 400,
            fontSize: { xs: '2rem', md: '2.75rem' },
            lineHeight: 1.1,
            mb: { xs: '40px', md: '60px' },
            maxWidth: 720,
            color: 'text.primary',
          }}
        >
          De zero à sua primeira aula em menos de 3 minutos.
        </Typography>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
            gap: { xs: 5, md: 5 },
          }}
        >
          {STEPS.map((s) => (
            <Box key={s.n}>
              <Typography
                sx={{
                  fontFamily: 'var(--f-mono)',
                  fontSize: 12,
                  color: 'primary.main',
                  letterSpacing: '0.1em',
                  mb: 2,
                }}
              >
                {s.n}
              </Typography>
              <Typography
                component="h3"
                sx={{
                  fontFamily: 'var(--f-serif)',
                  fontWeight: 400,
                  fontSize: 26,
                  lineHeight: 1.2,
                  mb: 1.25,
                  color: 'text.primary',
                }}
              >
                {s.title}
              </Typography>
              <Typography sx={{ fontSize: 14.5, color: tokens.text[2], lineHeight: 1.6 }}>
                {s.description}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>

      {/* Depoimento */}
      <Box
        component="section"
        id="depoimentos"
        sx={{
          px: { xs: 3, md: 6 },
          py: { xs: '60px', md: '80px' },
          borderTop: `1px solid ${tokens.line.default}`,
          maxWidth: 1000,
          mx: 'auto',
          textAlign: 'center',
        }}
      >
        <Typography
          component="blockquote"
          sx={{
            fontFamily: 'var(--f-serif)',
            fontStyle: 'italic',
            fontWeight: 400,
            fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' },
            lineHeight: 1.25,
            mb: 3.5,
            color: 'text.primary',
            m: 0,
          }}
        >
          &ldquo;Em 3 meses aprendi mais com a Trail do que em 2 anos pulando entre cursos. A trilha
          ajusta antes de eu perceber que tô travando.&rdquo;
        </Typography>

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            justifyContent: 'center',
            mt: 3.5,
          }}
        >
          <Box
            aria-hidden="true"
            sx={{
              width: 42,
              height: 42,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #A78BFA, #7C3AED)',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 600,
              fontSize: 14,
              flexShrink: 0,
            }}
          >
            AB
          </Box>
          <Box sx={{ textAlign: 'left' }}>
            <Typography sx={{ fontSize: 14, fontWeight: 600, color: 'text.primary' }}>
              Ana Beatriz Costa
            </Typography>
            <Typography sx={{ fontSize: 12, color: tokens.text[2] }}>
              Jr. Frontend · contratada em jan/26
            </Typography>
          </Box>
        </Box>
      </Box>
    </>
  );
}
