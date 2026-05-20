import { Section, Row, Column, Text } from '@react-email/components';
import * as React from 'react';

const PHASES = ['Fase 1', 'Fase 2', 'Fase 3', 'Fase 4', 'Terminado'];

export const PHASE_COLORS: Record<number, string> = {
  1: '#ea580c',
  2: '#ca8a04',
  3: '#22c55e',
  4: '#0ea5e9',
  5: '#10b981',
};

export const PHASE_BG_COLORS: Record<number, string> = {
  1: '#fff3e0',
  2: '#fef9c3',
  3: '#dcfce7',
  4: '#e0f2fe',
  5: '#d1fae5',
};

const PHASE_ICONS: Record<number, string> = {
  1: '◇',
  2: '▲',
  3: '◈',
  4: '●',
  5: '★',
};

interface ProgressBarProps {
  currentPhase: number;
  phaseName: string;
}

export const ProgressBar = ({ currentPhase, phaseName }: ProgressBarProps) => {
  const activeColor = PHASE_COLORS[currentPhase] ?? '#C8763A';

  return (
    <Section style={wrapper}>
      {/* Phase indicator badge */}
      <Section style={{ textAlign: 'center' as const, marginBottom: '4px' }}>
        <Text style={stageLabel}>ETAPA {currentPhase} DE 5</Text>
      </Section>
      <Text style={{ ...phaseTitle, color: activeColor }}>{phaseName}</Text>

      {/* Progress track */}
      <Section style={trackContainer}>
        <Row>
          {PHASES.map((phase, index) => {
            const phaseNumber = index + 1;
            const isCompleted = phaseNumber < currentPhase;
            const isActive = phaseNumber === currentPhase;
            const phaseColor = PHASE_COLORS[phaseNumber] ?? '#C8763A';
            const icon = PHASE_ICONS[phaseNumber] ?? '●';

            return (
              <Column key={phase} style={stepColumn}>
                {/* Dot */}
                <table
                  cellPadding="0"
                  cellSpacing="0"
                  border={0}
                  style={{ margin: '0 auto' }}
                >
                  <tr>
                    <td
                      align="center"
                      valign="middle"
                      style={{
                        width: isActive ? '32px' : '24px',
                        height: isActive ? '32px' : '24px',
                        borderRadius: '50%',
                        backgroundColor:
                          isActive || isCompleted ? phaseColor : '#e8e4df',
                        textAlign: 'center' as const,
                        verticalAlign: 'middle',
                        fontSize: isActive ? '14px' : '10px',
                        lineHeight: '1',
                        color: isActive || isCompleted ? '#ffffff' : '#b5afa8',
                        fontFamily: 'serif',
                        padding: 0,
                      }}
                    >
                      {isCompleted ? '✓' : icon}
                    </td>
                  </tr>
                </table>
                {/* Label */}
                <Text
                  style={{
                    ...stepLabel,
                    color: isActive ? phaseColor : isCompleted ? '#1e1a1b' : '#c5c0ba',
                    fontWeight: isActive ? 700 : 400,
                  }}
                >
                  {phase}
                </Text>
              </Column>
            );
          })}
        </Row>
      </Section>
    </Section>
  );
};

const wrapper: React.CSSProperties = {
  backgroundColor: '#faf8f5',
  border: '1px solid #ece8e3',
  borderRadius: '4px',
  padding: '28px 16px 20px',
  textAlign: 'center' as const,
  marginBottom: '24px',
};

const stageLabel: React.CSSProperties = {
  fontFamily: "'Outfit', Helvetica, Arial, sans-serif",
  fontSize: '10px',
  fontWeight: 600,
  color: '#b5afa8',
  letterSpacing: '2px',
  textTransform: 'uppercase' as const,
  margin: 0,
};

const phaseTitle: React.CSSProperties = {
  fontFamily: "'Cormorant Garamond', Georgia, 'Times New Roman', serif",
  fontSize: '24px',
  fontWeight: 700,
  margin: '4px 0 24px',
  letterSpacing: '0.5px',
};

const trackContainer: React.CSSProperties = {
  width: '100%',
};

const stepColumn: React.CSSProperties = {
  textAlign: 'center' as const,
  verticalAlign: 'top',
  width: '20%',
};

const stepLabel: React.CSSProperties = {
  fontFamily: "'Outfit', Helvetica, Arial, sans-serif",
  fontSize: '9px',
  margin: '8px 0 0',
  lineHeight: '1.3',
  letterSpacing: '0.3px',
};
