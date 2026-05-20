import { Section, Text } from '@react-email/components';
import * as React from 'react';
import { Layout } from '../components/Layout';
import { Button } from '../components/Button';
import { InfoBox } from '../components/InfoBox';
import { ProgressBar, PHASE_COLORS, PHASE_BG_COLORS } from '../components/ProgressBar';

interface PhaseUpdateEmailProps {
  clientName: string;
  projectName: string;
  packageName: string;
  phaseName: string;
  phaseNumber: number;
  portalUrl: string;
}

const PHASE_MESSAGES: Record<number, string> = {
  1: 'Los trabajos de tu hogar han comenzado. Estamos construyendo las bases de algo increíble.',
  2: 'Tu apartamento avanza con paso firme. Cada detalle toma forma.',
  3: 'Estamos avanzando con los acabados interiores — tu apartamento está cobrando vida.',
  4: 'Los toques finales están en marcha. ¡Tu apartamento está casi listo!',
  5: '¡Tu apartamento está terminado! Es momento de recibir las llaves.',
};

const PHASE_DETAILS: Record<number, string[]> = {
  1: ['Plomería', 'Revoque', 'Mortero'],
  2: ['Estuco', 'Cielo raso', 'Electricidad', 'Enchape'],
  3: ['Fondeo', 'Carpintería'],
  4: ['Pintura', 'Detalles finales', 'Limpieza'],
  5: ['Entrega de llaves'],
};

export const PhaseUpdateEmail = ({
  clientName,
  projectName,
  packageName,
  phaseName,
  phaseNumber,
  portalUrl,
}: PhaseUpdateEmailProps) => {
  const message = PHASE_MESSAGES[phaseNumber] ?? 'Tu apartamento sigue avanzando.';
  const phaseColor = PHASE_COLORS[phaseNumber] ?? '#C8763A';
  const details = PHASE_DETAILS[phaseNumber] ?? [];
  const phaseBg = PHASE_BG_COLORS[phaseNumber] ?? '#faf8f5';

  return (
    <Layout previewText={`Tu apartamento está en fase: ${phaseName}`}>
      {/* Editorial header */}
      <Text style={{ ...eyebrow, color: phaseColor }}>Actualización de obra</Text>
      <Text style={headline}>Tu apartamento{'\n'}avanza</Text>

      <Section style={{ ...dividerAccent, backgroundColor: phaseColor }} />

      <Text style={greeting}>
        Hola <strong style={{ color: phaseColor }}>{clientName}</strong>,
      </Text>

      <Text style={paragraph}>{message}</Text>

      {/* Progress visualization */}
      <ProgressBar currentPhase={phaseNumber} phaseName={phaseName} />

      {/* Phase detail box */}
      {details.length > 0 && (
        <Section
          style={{
            backgroundColor: phaseBg,
            border: `1px solid ${phaseColor}20`,
            borderLeft: `4px solid ${phaseColor}`,
            borderRadius: '6px',
            padding: '20px 24px',
            marginBottom: '24px',
          }}
        >
          <Text
            style={{
              fontFamily: "'Outfit', Helvetica, Arial, sans-serif",
              fontSize: '11px',
              fontWeight: 700,
              color: phaseColor,
              letterSpacing: '2px',
              textTransform: 'uppercase' as const,
              margin: '0 0 14px',
            }}
          >
            ¿Qué incluye esta fase?
          </Text>
          {details.map((item) => (
            <Text
              key={item}
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, 'Times New Roman', serif",
                fontSize: '15px',
                fontWeight: 700,
                color: '#1e1a1b',
                lineHeight: '1.3',
                margin: '0 0 10px',
                paddingLeft: '16px',
                borderLeft: `3px solid ${phaseColor}`,
              }}
            >
              {item}
            </Text>
          ))}
        </Section>
      )}

      {/* Project details */}
      <Text style={sectionTitle}>Detalles del proyecto</Text>
      <InfoBox label="Proyecto" value={projectName} color={phaseColor} />
      <InfoBox label="Paquete de acabados" value={packageName} color={phaseColor} />

      <Text style={motivational}>
        Cada fase nos acerca más al momento de entregarte las llaves de tu nuevo hogar.
      </Text>

      <Section style={ctaWrapper}>
        <Button href={portalUrl}>Ver el avance</Button>
      </Section>
    </Layout>
  );
};

const eyebrow: React.CSSProperties = {
  fontFamily: "'Outfit', Helvetica, Arial, sans-serif",
  fontSize: '10px',
  fontWeight: 600,
  color: '#C8763A',
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

const motivational: React.CSSProperties = {
  fontFamily: "'Cormorant Garamond', Georgia, 'Times New Roman', serif",
  fontSize: '14px',
  color: '#8a837b',
  lineHeight: '1.7',
  fontStyle: 'italic',
  margin: '20px 0 0',
  paddingTop: '16px',
  borderTop: '1px solid #ece8e3',
};

const ctaWrapper: React.CSSProperties = {
  textAlign: 'center' as const,
  margin: '32px 0 8px',
};

export default PhaseUpdateEmail;
