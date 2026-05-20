import { Section, Text } from '@react-email/components';
import * as React from 'react';
import { Layout } from '../components/Layout';
import { Button } from '../components/Button';
import { InfoBox } from '../components/InfoBox';
import { ProgressBar, PHASE_COLORS } from '../components/ProgressBar';

interface DeliveryEmailProps {
  clientName: string;
  projectName: string;
  packageName: string;
  apartmentNumber?: string | undefined;
  portalUrl: string;
}

export const DELIVERY_SUBJECT = '¡Felicidades! Tu apartamento está listo';

const DELIVERY_COLOR = PHASE_COLORS[5] ?? '#10b981';

export const DeliveryEmail = ({
  clientName,
  projectName,
  packageName,
  apartmentNumber,
  portalUrl,
}: DeliveryEmailProps) => {
  return (
    <Layout previewText="¡Tu apartamento está listo! — Habitta">
      {/* Celebration banner */}
      <Section style={celebrationBanner}>
        <Text style={celebrationIcon}>★</Text>
        <Text style={celebrationLabel}>ENTREGA LISTA</Text>
      </Section>

      {/* Editorial header */}
      <Text style={eyebrow}>¡Felicidades!</Text>
      <Text style={headline}>
        Tu hogar está{'\n'}listo
      </Text>

      <Section style={{ ...dividerAccent, backgroundColor: DELIVERY_COLOR }} />

      <Text style={greeting}>
        Hola <strong style={{ color: DELIVERY_COLOR }}>{clientName}</strong>,
      </Text>

      <Text style={paragraph}>
        Este es el momento que estábamos esperando. Tu apartamento en{' '}
        <strong>{projectName}</strong> ha completado todas las fases de construcción y está listo
        para recibirte.
      </Text>

      {/* Progress visualization — all complete */}
      <ProgressBar currentPhase={5} phaseName="Entrega" />

      {/* Project details */}
      <Text style={sectionTitle}>Tu apartamento</Text>
      <InfoBox label="Proyecto" value={projectName} color={DELIVERY_COLOR} />
      <InfoBox label="Paquete de acabados" value={packageName} color={DELIVERY_COLOR} />
      {apartmentNumber && (
        <InfoBox label="Apartamento" value={apartmentNumber} color={DELIVERY_COLOR} />
      )}

      {/* Next steps */}
      <Section style={nextStepsBox}>
        <Text style={nextStepsTitle}>Próximos pasos</Text>
        <Text style={stepItem}>
          ★ <strong>Coordinaremos la fecha de entrega de llaves</strong>
        </Text>
      </Section>

      <Section style={ctaWrapper}>
        <Button href={portalUrl}>Ir a Mi Portal</Button>
      </Section>

      <Text style={closing}>
        Gracias por confiar en Habitta para construir tu hogar.{'\n'}Ha sido un privilegio
        acompañarte en este camino.
      </Text>
      <Text style={signature}>— El equipo Habitta</Text>
    </Layout>
  );
};

const celebrationBanner: React.CSSProperties = {
  backgroundColor: '#d1fae5',
  border: '1px solid #a7f3d0',
  borderRadius: '6px',
  textAlign: 'center' as const,
  padding: '20px 16px 12px',
  marginBottom: '24px',
};

const celebrationIcon: React.CSSProperties = {
  fontSize: '28px',
  margin: '0 0 4px',
  color: DELIVERY_COLOR,
};

const celebrationLabel: React.CSSProperties = {
  fontFamily: "'Outfit', Helvetica, Arial, sans-serif",
  fontSize: '10px',
  fontWeight: 600,
  color: DELIVERY_COLOR,
  letterSpacing: '3px',
  margin: 0,
};

const eyebrow: React.CSSProperties = {
  fontFamily: "'Outfit', Helvetica, Arial, sans-serif",
  fontSize: '10px',
  fontWeight: 600,
  color: DELIVERY_COLOR,
  letterSpacing: '3px',
  textTransform: 'uppercase' as const,
  margin: '0 0 8px',
};

const headline: React.CSSProperties = {
  fontFamily: "'Cormorant Garamond', Georgia, 'Times New Roman', serif",
  fontSize: '28px',
  fontWeight: 700,
  color: '#1e1a1b',
  lineHeight: '1.2',
  margin: '0 0 24px',
};

const dividerAccent: React.CSSProperties = {
  height: '2px',
  width: '48px',
  margin: '0 0 28px',
  borderRadius: '1px',
};

const greeting: React.CSSProperties = {
  fontFamily: "'Cormorant Garamond', Georgia, 'Times New Roman', serif",
  fontSize: '16px',
  color: '#1e1a1b',
  lineHeight: '1.7',
  margin: '0 0 12px',
};

const paragraph: React.CSSProperties = {
  fontFamily: "'Outfit', Helvetica, Arial, sans-serif",
  fontSize: '15px',
  color: '#4a4541',
  lineHeight: '1.7',
  margin: '0 0 28px',
};

const sectionTitle: React.CSSProperties = {
  fontFamily: "'Outfit', Helvetica, Arial, sans-serif",
  fontSize: '10px',
  fontWeight: 600,
  color: '#9a938b',
  letterSpacing: '2px',
  textTransform: 'uppercase' as const,
  margin: '0 0 16px',
  paddingBottom: '8px',
  borderBottom: '1px solid #ece8e3',
};

const nextStepsBox: React.CSSProperties = {
  backgroundColor: '#fdfaf3',
  border: '1px solid #f0e6c8',
  borderLeft: `3px solid ${DELIVERY_COLOR}`,
  borderRadius: '2px',
  padding: '20px 24px',
  margin: '24px 0 0',
};

const nextStepsTitle: React.CSSProperties = {
  fontFamily: "'Outfit', Helvetica, Arial, sans-serif",
  fontSize: '10px',
  fontWeight: 600,
  color: '#9a938b',
  letterSpacing: '2px',
  textTransform: 'uppercase' as const,
  margin: '0 0 12px',
};

const stepItem: React.CSSProperties = {
  fontFamily: "'Outfit', Helvetica, Arial, sans-serif",
  fontSize: '14px',
  color: '#1e1a1b',
  lineHeight: '1.6',
  margin: 0,
};

const ctaWrapper: React.CSSProperties = {
  textAlign: 'center' as const,
  margin: '32px 0 8px',
};

const closing: React.CSSProperties = {
  fontFamily: "'Cormorant Garamond', Georgia, 'Times New Roman', serif",
  fontSize: '14px',
  color: '#8a837b',
  lineHeight: '1.7',
  fontStyle: 'italic',
  margin: '20px 0 0',
  paddingTop: '16px',
  borderTop: '1px solid #ece8e3',
};

const signature: React.CSSProperties = {
  fontFamily: "'Outfit', Helvetica, Arial, sans-serif",
  fontSize: '13px',
  fontWeight: 600,
  color: '#C8763A',
  margin: '8px 0 0',
};

export default DeliveryEmail;
