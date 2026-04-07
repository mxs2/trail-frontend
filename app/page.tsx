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
    title: 'JWT Authentication',
    description:
      'Secure, stateless authentication powered by JSON Web Tokens. Every learner and instructor gets scoped access — no shared passwords, no session bloat.',
    icon: KeyIcon,
  },
  {
    title: 'Challenge Submissions',
    description:
      'Structured coding and scenario-based challenges let trainees submit work directly in-platform. Automated checks flag results instantly, cutting review overhead.',
    icon: ClipboardChecklistIcon,
  },
  {
    title: 'Performance Dashboards',
    description:
      'Real-time dashboards track completion rates, scores, and skill progression across your entire cohort so managers can act on data — not gut feel.',
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
            Train smarter. Scale faster.
          </Text>
          <Text
            variant="bodyLg"
            as="p"
            alignment="center"
            tone="subdued"
          >
            Trail closes the feedback loop between IT training delivery and
            business outcomes — so your team grows at the speed your
            organisation demands.
          </Text>
          <InlineStack gap="300" align="center">
            <Button variant="primary" size="large" url="/signup">
              Get started free
            </Button>
            <Button size="large" url="/demo">
              Watch the demo
            </Button>
          </InlineStack>
        </BlockStack>
      </Box>

      <Divider />

      {/* ── Features Grid ── */}
      <Box paddingBlockStart="1200" paddingBlockEnd="1200">
        <BlockStack gap="800">
          <Text variant="headingXl" as="h2" alignment="center">
            Everything you need to run high-throughput IT training
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
          title="Reduce feedback lead time. Identify hiring talent early."
          illustration="https://cdn.shopify.com/s/assets/admin/checkout/settings-customizecart-705f57c725ac05be2a489568fb6e4ff0562f0f86f5afbed844617dd5d7c91b4b.svg"
          primaryAction={{
            content: 'Start your free pilot',
            url: '/signup',
          }}
          secondaryAction={{
            content: 'Talk to our team',
            url: '/contact',
          }}
        >
          <Text variant="bodyMd" as="p">
            Traditional IT training programmes suffer from a months-long gap
            between skill delivery and performance feedback. Trail&apos;s{' '}
            <strong>Functional Feedback Loop</strong> surfaces learner
            performance data in real time — so you know which candidates are
            ready to step up, and which need targeted support, before your
            next hiring cycle begins.
          </Text>
        </CalloutCard>
      </Box>
    </Page>
  );
}
