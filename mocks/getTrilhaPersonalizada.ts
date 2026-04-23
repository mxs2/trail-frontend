// Simulates an AI personalization API call.
// In production, replace the body with a real fetch to the AI endpoint.
// Delay mimics model inference latency (800–1200ms).

import type { TrilhaPersonalizada } from '../types';
import { MOCK_TRAILS } from './trails';

const PERSONALIZACAO: Record<string, TrilhaPersonalizada> = {
  default: {
    trilhaPrincipal: MOCK_TRAILS[0],
    recomendacao: {
      titulo: 'Uma revisão rápida antes de continuar',
      descricao:
        'Notei que você hesitou no exercício de useEffect. Separei um módulo de 12min que reforça dependency arrays antes da próxima aula.',
      sugestoes: [
        {
          id: 'sug-rf-dep-arrays',
          title: 'Revisão: Dependency arrays',
          duration: '12min',
          type: 'video',
        },
      ],
    },
    notaDoMentor: '',
  },
};

export async function getTrilhaPersonalizada(userId: string): Promise<TrilhaPersonalizada> {
  await new Promise<void>((resolve) => setTimeout(resolve, 800 + Math.random() * 400));
  return PERSONALIZACAO[userId] ?? PERSONALIZACAO['default'];
}
