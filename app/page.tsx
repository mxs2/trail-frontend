'use client';

import {
  Page,
  Card,
  Text,
  Button,
  InlineStack,
  BlockStack,
  Grid,
  CalloutCard,
  Box,
  Divider,
} from '@shopify/polaris';
import {
  KeyIcon,
  ClipboardChecklistIcon,
  ChartVerticalFilledIcon,
} from '@shopify/polaris-icons';

interface Feature {
  title: string;
  description: string;
  icon: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
}

const features: Feature[] = [
  {
    title: 'Autenticação JWT',
    description:
      'Autenticação segura e sem estado com JSON Web Tokens. Cada aluno e instrutor recebe acesso com escopo definido — sem senhas compartilhadas, sem sobrecarga de sessão.',
    icon: KeyIcon,
  },
  {
    title: 'Submissão de Desafios',
    description:
      'Desafios práticos de código e cenários estruturados permitem que os alunos submetam trabalhos diretamente na plataforma. Verificações automáticas sinalizam os resultados na hora, reduzindo o tempo de revisão.',
    icon: ClipboardChecklistIcon,
  },
  {
    title: 'Dashboards de Desempenho',
    description:
      'Painéis em tempo real monitoram taxas de conclusão, pontuações e progressão de habilidades em toda a sua turma, para que gestores atuem com base em dados — não em intuição.',
    icon: ChartVerticalFilledIcon,
  },
];

export default function LandingPage() {
  return (
    <Page>
      {/* ── Hero ── */}
      <Box paddingBlockStart="1600" paddingBlockEnd="1600">
        <BlockStack gap="600" align="center">
          <Text variant="heading2xl" as="h1" alignment="center">
            Treine com inteligência. Escale com velocidade.
          </Text>
          <Text
            variant="bodyLg"
            as="p"
            alignment="center"
            tone="subdued"
          >
            O Trail fecha o loop de feedback entre a entrega de treinamentos em
            TI e os resultados de negócio — para que sua equipe cresça na
            velocidade que a sua organização exige.
          </Text>
          <InlineStack gap="300" align="center">
            <Button variant="primary" size="large" url="/signup">
              Comece gratuitamente
            </Button>
            <Button size="large" url="/demo">
              Assistir à demonstração
            </Button>
          </InlineStack>
        </BlockStack>
      </Box>

      <Divider />

      {/* ── Features Grid ── */}
      <Box paddingBlockStart="1200" paddingBlockEnd="1200">
        <BlockStack gap="800">
          <Text variant="headingXl" as="h2" alignment="center">
            Tudo que você precisa para capacitações de TI de alto impacto
          </Text>
          <Grid>
            {features.map((feature) => (
              <Grid.Cell
                key={feature.title}
                columnSpan={{ xs: 6, sm: 6, md: 2, lg: 4, xl: 4 }}
              >
                <Card>
                  <BlockStack gap="400">
                    <InlineStack gap="200" align="start" blockAlign="center">
                      <feature.icon
                        style={{ width: 28, height: 28 }}
                        aria-hidden="true"
                      />
                      <Text variant="headingMd" as="h3">
                        {feature.title}
                      </Text>
                    </InlineStack>
                    <Text variant="bodyMd" as="p" tone="subdued">
                      {feature.description}
                    </Text>
                  </BlockStack>
                </Card>
              </Grid.Cell>
            ))}
          </Grid>
        </BlockStack>
      </Box>

      <Divider />

      {/* ── Value Proposition ── */}
      <Box paddingBlockStart="1200" paddingBlockEnd="1600">
        <CalloutCard
          title="Reduza o tempo de feedback. Identifique talentos com antecedência."
          illustration="/callout-illustration.svg"
          primaryAction={{
            content: 'Iniciar piloto gratuito',
            url: '/signup',
          }}
          secondaryAction={{
            content: 'Falar com nossa equipe',
            url: '/contact',
          }}
        >
          <Text variant="bodyMd" as="p">
            Os programas tradicionais de treinamento em TI sofrem com uma lacuna
            de meses entre a entrega de habilidades e o feedback de desempenho.
            O <strong>Loop de Feedback Funcional</strong> do Trail expõe os
            dados de desempenho dos alunos em tempo real — para que você saiba
            quais candidatos estão prontos para avançar e quais precisam de
            suporte direcionado, antes do início do próximo ciclo de
            contratações.
          </Text>
        </CalloutCard>
      </Box>
    </Page>
  );
}
