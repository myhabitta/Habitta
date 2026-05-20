import { Section, Text, Row, Column } from '@react-email/components';
import * as React from 'react';

interface InfoBoxProps {
  label: string;
  value: string;
  color?: string;
}

export const InfoBox = ({ label, value, color = '#C8763A' }: InfoBoxProps) => {
  return (
    <Section style={box}>
      <Row>
        <Column style={{ width: '4px' }}>
          <Section style={{ ...accent, backgroundColor: color }} />
        </Column>
        <Column style={{ paddingLeft: '16px' }}>
          <Text style={labelStyle}>{label}</Text>
          <Text style={valueStyle}>{value}</Text>
        </Column>
      </Row>
    </Section>
  );
};

const box: React.CSSProperties = {
  marginBottom: '8px',
  padding: '14px 0',
  borderBottom: '1px solid #f0ece7',
};

const accent: React.CSSProperties = {
  width: '4px',
  height: '100%',
  minHeight: '36px',
  borderRadius: '2px',
};

const labelStyle: React.CSSProperties = {
  fontFamily: "'Outfit', Helvetica, Arial, sans-serif",
  fontSize: '10px',
  fontWeight: 600,
  color: '#9a938b',
  textTransform: 'uppercase' as const,
  letterSpacing: '1.5px',
  margin: '0 0 2px',
};

const valueStyle: React.CSSProperties = {
  fontFamily: "'Cormorant Garamond', Georgia, 'Times New Roman', serif",
  fontSize: '17px',
  fontWeight: 700,
  color: '#1e1a1b',
  margin: 0,
  letterSpacing: '0.3px',
};
