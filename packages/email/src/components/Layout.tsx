import {
  Html,
  Head,
  Font,
  Body,
  Container,
  Section,
  Text,
  Img,
  Link,
  Hr,
  Preview,
  Row,
  Column,
} from '@react-email/components';
import * as React from 'react';

interface LayoutProps {
  children: React.ReactNode;
  previewText: string;
}

const LOGO_URL =
  'https://res.cloudinary.com/dcpkaidzl/image/upload/v1775692422/Imagotipo2-F2_pvxjv0_1cb309.webp';

export const Layout = ({ children, previewText }: LayoutProps) => {
  return (
    <Html lang="es">
      <Head>
        <Font
          fontFamily="Cormorant Garamond"
          fallbackFontFamily="Georgia"
          webFont={{
            url: 'https://fonts.gstatic.com/s/cormorantgaramond/v16/co3bmX5slCNuHLi8bLeY9MK7whWMhyjYrEtFmSq5.woff2',
            format: 'woff2',
          }}
          fontWeight={400}
          fontStyle="normal"
        />
        <Font
          fontFamily="Cormorant Garamond"
          fallbackFontFamily="Georgia"
          webFont={{
            url: 'https://fonts.gstatic.com/s/cormorantgaramond/v16/co3YmX5slCNuHLi8bLeY9MK7whWMhyjQAllvuQ6_vw.woff2',
            format: 'woff2',
          }}
          fontWeight={700}
          fontStyle="normal"
        />
        <Font
          fontFamily="Outfit"
          fallbackFontFamily="Helvetica"
          webFont={{
            url: 'https://fonts.gstatic.com/s/outfit/v11/QGYyz_MVcBeNP4NjuGObqx1XmO1I4TC1C4G-EiAou6Y.woff2',
            format: 'woff2',
          }}
          fontWeight={400}
          fontStyle="normal"
        />
        <Font
          fontFamily="Outfit"
          fallbackFontFamily="Helvetica"
          webFont={{
            url: 'https://fonts.gstatic.com/s/outfit/v11/QGYyz_MVcBeNP4NjuGObqx1XmO1I4bK1C4G-EiAou6Y.woff2',
            format: 'woff2',
          }}
          fontWeight={600}
          fontStyle="normal"
        />
        <Font
          fontFamily="Outfit"
          fallbackFontFamily="Helvetica"
          webFont={{
            url: 'https://fonts.gstatic.com/s/outfit/v11/QGYyz_MVcBeNP4NjuGObqx1XmO1I4Ym1C4G-EiAou6Y.woff2',
            format: 'woff2',
          }}
          fontWeight={700}
          fontStyle="normal"
        />
      </Head>
      <Preview>{previewText}</Preview>
      <Body style={body}>
        <Container style={container}>
          {/* ── Header ── */}
          <Section style={header}>
            <Link href="https://myhabitta.co" style={{ textDecoration: 'none' }}>
              <Img src={LOGO_URL} alt="Habitta" width="150" height="auto" style={logoImg} />
            </Link>
          </Section>

          {/* ── Decorative accent line ── */}
          <Section style={accentLine} />

          {/* ── Content ── */}
          <Section style={content}>{children}</Section>

          {/* ── Footer ── */}
          <Section style={footerSection}>
            <Hr style={footerDivider} />

            <Row style={footerRow}>
              <Column style={footerLeft}>
                <Img
                  src="https://res.cloudinary.com/dcpkaidzl/image/upload/q_auto/f_auto/v1775692674/Mesa_de_trabajo_39_copia_2_bufljc.webp"
                  alt="Habitta"
                  width="100"
                  height="auto"
                  style={{ display: 'block', marginBottom: '4px' }}
                />
                <Text style={footerTagline}>Arquitectura de Vida</Text>
              </Column>
              <Column style={footerRight}>
                <Text style={footerDetail}>Medellín, Colombia</Text>
                <Text style={footerDetail}>
                  <Link href="mailto:myhabitta.sas@gmail.com" style={footerLink}>
                    myhabitta.sas@gmail.com
                  </Link>
                </Text>
                <Text style={footerDetail}>
                  <Link href="https://myhabitta.co" style={footerLink}>
                    myhabitta.co
                  </Link>
                </Text>
              </Column>
            </Row>

            <Hr style={footerDividerLight} />

            <Text style={footerCopy}>
              &copy; 2026 Habitta S.A.S. Todos los derechos reservados.
            </Text>
            <Text style={footerDisclaimer}>
              Este correo es una notificación automática sobre el avance de tu proyecto.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

/* ── Styles ── */

const body: React.CSSProperties = {
  backgroundColor: '#e8e4df',
  fontFamily: "'Cormorant Garamond', Georgia, 'Times New Roman', serif",
  margin: 0,
  padding: '32px 16px',
};

const container: React.CSSProperties = {
  backgroundColor: '#ffffff',
  maxWidth: '600px',
  margin: '0 auto',
  borderRadius: '2px',
  overflow: 'hidden',
  boxShadow: '0 4px 24px rgba(30, 26, 27, 0.08)',
};

const header: React.CSSProperties = {
  backgroundColor: '#272626',
  padding: '36px 40px 28px',
  textAlign: 'center' as const,
};

const logoImg: React.CSSProperties = {
  margin: '0 auto',
  display: 'block',
};

const accentLine: React.CSSProperties = {
  height: '3px',
  background: 'linear-gradient(90deg, #C8763A 0%, #E8A060 50%, #C8763A 100%)',
  backgroundColor: '#C8763A',
  margin: 0,
  padding: 0,
};

const content: React.CSSProperties = {
  padding: '40px 44px 32px',
};

const footerSection: React.CSSProperties = {
  backgroundColor: '#faf8f5',
  padding: '0 44px 32px',
};

const footerDivider: React.CSSProperties = {
  borderColor: '#e0dbd5',
  borderWidth: '1px',
  margin: '0 0 24px',
};

const footerRow: React.CSSProperties = {
  width: '100%',
};

const footerLeft: React.CSSProperties = {
  verticalAlign: 'top',
  width: '50%',
};

const footerRight: React.CSSProperties = {
  verticalAlign: 'top',
  width: '50%',
  textAlign: 'right' as const,
};

const footerTagline: React.CSSProperties = {
  fontFamily: "'Cormorant Garamond', Georgia, 'Times New Roman', serif",
  fontSize: '12px',
  fontStyle: 'italic',
  color: '#C8763A',
  margin: 0,
};

const footerDetail: React.CSSProperties = {
  fontFamily: "'Outfit', Helvetica, Arial, sans-serif",
  fontSize: '12px',
  color: '#8a837b',
  margin: '0 0 2px',
  lineHeight: '1.5',
};

const footerLink: React.CSSProperties = {
  color: '#8a837b',
  textDecoration: 'none',
};

const footerDividerLight: React.CSSProperties = {
  borderColor: '#ece8e3',
  borderWidth: '1px',
  margin: '20px 0 16px',
};

const footerCopy: React.CSSProperties = {
  fontFamily: "'Outfit', Helvetica, Arial, sans-serif",
  fontSize: '11px',
  color: '#b5afa8',
  margin: '0 0 2px',
  lineHeight: '1.5',
  textAlign: 'center' as const,
};

const footerDisclaimer: React.CSSProperties = {
  fontFamily: "'Outfit', Helvetica, Arial, sans-serif",
  fontSize: '10px',
  color: '#c5c0ba',
  margin: 0,
  lineHeight: '1.5',
  textAlign: 'center' as const,
};
