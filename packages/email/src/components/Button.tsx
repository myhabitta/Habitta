import { Button as EmailButton } from '@react-email/components';
import * as React from 'react';

interface ButtonProps {
  href: string;
  children: React.ReactNode;
}

export const Button = ({ href, children }: ButtonProps) => {
  return (
    <EmailButton href={href} style={button}>
      {children}
    </EmailButton>
  );
};

const button: React.CSSProperties = {
  backgroundColor: '#C8763A',
  color: '#ffffff',
  fontFamily: "'Outfit', Helvetica, Arial, sans-serif",
  fontSize: '13px',
  fontWeight: 600,
  textDecoration: 'none',
  textAlign: 'center' as const,
  padding: '18px 40px',
  borderRadius: '8px',
  display: 'inline-block',
  letterSpacing: '1.5px',
  textTransform: 'uppercase' as const,
};
