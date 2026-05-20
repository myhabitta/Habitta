import { Section, Text } from '@react-email/components';
import * as React from 'react';
import { Layout } from '../components/Layout';
import { Button } from '../components/Button';
import { InfoBox } from '../components/InfoBox';

interface WelcomeEmailProps {
  clientName: string;
  projectName: string;
  packageName: string;
  apartmentNumber: string;
  portalUrl: string;
}

export const WELCOME_SUBJECT = '¡Bienvenido/a a Habitta! Tu nuevo hogar te espera';

export const WelcomeEmail = ({
  clientName,
  projectName,
  packageName,
  apartmentNumber,
  portalUrl,
}: WelcomeEmailProps) => {
  return (
    <Layout previewText="Bienvenido/a a Habitta — Tu nuevo hogar te espera">
      {/* Editorial opening */}
      <Text style={eyebrow}>Bienvenido a la familia</Text>
      <Text style={headline}>
        Tu nuevo hogar{'\n'}comienza aquí
      </Text>

      <Section style={dividerAccent} />

      <Text style={greeting}>
        Hola <strong style={{ color: '#C8763A' }}>{clientName}</strong>,
      </Text>

      <Text style={paragraph}>
        Es un placer confirmarte que ya eres parte de <strong>Habitta</strong>.
        A partir de ahora, acompañaremos cada paso del camino hacia tu nuevo hogar.
      </Text>

      {/* Purchase summary */}
      <Text style={sectionTitle}>Resumen de tu compra</Text>
      <InfoBox label="Proyecto" value={projectName} />
      <InfoBox label="Paquete de acabados" value={packageName} />
      <InfoBox label="Apartamento" value={apartmentNumber} />

      <Section style={spacer} />

      {/* Portal callout */}
      <Section style={calloutBox}>
        <Text style={calloutTitle}>Tu portal Mi Apartamento</Text>
        <Text style={calloutText}>
          Desde tu portal personal podrás seguir el avance de obra en tiempo real.
          Cada vez que haya un avance importante, te notificaremos por correo.
        </Text>
      </Section>

      <Section style={ctaWrapper}>
        <Button href={portalUrl}>Ver Mi Apartamento</Button>
      </Section>

      <Section style={dividerLight} />

      <Text style={closing}>
        ¿Tienes alguna duda? Escríbenos a{' '}
        <a href="mailto:myhabitta.sas@gmail.com" style={link}>
          myhabitta.sas@gmail.com
        </a>
      </Text>
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
  backgroundColor: '#C8763A',
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

const spacer: React.CSSProperties = {
  height: '8px',
};

const calloutBox: React.CSSProperties = {
  backgroundColor: '#faf8f5',
  border: '1px solid #ece8e3',
  borderLeft: '3px solid #C8763A',
  borderRadius: '2px',
  padding: '20px 24px',
  margin: '0 0 8px',
};

const calloutTitle: React.CSSProperties = {
  fontFamily: "'Cormorant Garamond', Georgia, 'Times New Roman', serif",
  fontSize: '15px',
  fontWeight: 700,
  color: '#1e1a1b',
  margin: '0 0 6px',
};

const calloutText: React.CSSProperties = {
  fontFamily: "'Outfit', Helvetica, Arial, sans-serif",
  fontSize: '14px',
  color: '#6e6762',
  lineHeight: '1.6',
  margin: 0,
};

const ctaWrapper: React.CSSProperties = {
  textAlign: 'center' as const,
  margin: '32px 0',
};

const dividerLight: React.CSSProperties = {
  height: '1px',
  backgroundColor: '#ece8e3',
  margin: '0 0 20px',
};

const closing: React.CSSProperties = {
  fontFamily: "'Outfit', Helvetica, Arial, sans-serif",
  fontSize: '13px',
  color: '#9a938b',
  lineHeight: '1.6',
  margin: 0,
};

const link: React.CSSProperties = {
  color: '#C8763A',
  textDecoration: 'none',
  fontWeight: 600,
};

export default WelcomeEmail;
