'use client';

import { useTransition, useState } from 'react';
import { Check, AlertTriangle } from 'lucide-react';
import type { LeadStatus } from '@habitta/types';
import { Button } from '@/components/ui/button';
import { updateLeadStatusAction } from '@/app/(dashboard)/leads/actions';

interface LeadStatusStepperProps {
  leadId: string;
  leadShortId: string;
  currentStatus: LeadStatus;
}

const STEPS: Array<{ status: LeadStatus; label: string }> = [
  { status: 'new', label: 'Nuevo' },
  { status: 'contacted', label: 'Contactado' },
  { status: 'negotiating', label: 'En negociación' },
];

const MAIN_STATUSES = STEPS.map((s) => s.status);

const getStatusIndex = (status: LeadStatus): number => {
  if (status === 'converted') return MAIN_STATUSES.length - 1;
  return MAIN_STATUSES.indexOf(status);
};

const LeadStatusStepper = ({ leadId, leadShortId, currentStatus }: LeadStatusStepperProps) => {
  const [isPending, startTransition] = useTransition();
  const [confirmLost, setConfirmLost] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const currentIndex = getStatusIndex(currentStatus);
  const isLost = currentStatus === 'lost';

  const handleStep = (status: LeadStatus) => {
    if (status === currentStatus || isPending) return;
    if (status === 'lost') {
      setConfirmLost(true);
      return;
    }
    startTransition(async () => {
      const result = await updateLeadStatusAction(leadId, leadShortId, status);
      if (result?.error) setError(result.error);
    });
  };

  const handleConfirmLost = () => {
    setConfirmLost(false);
    startTransition(async () => {
      const result = await updateLeadStatusAction(leadId, leadShortId, 'lost');
      if (result?.error) setError(result.error);
    });
  };

  return (
    <div className="flex flex-col gap-1">
      {error && (
        <p className="mb-2 font-sans text-xs" style={{ color: 'var(--destructive)' }}>
          {error}
        </p>
      )}

      {/* Pasos principales */}
      {STEPS.map((step, index) => {
        // When lost, all main steps are treated as done
        const isDone = isLost ? true : currentIndex > index;
        const isActive = !isLost && currentIndex === index;
        const isFuture = !isLost && currentIndex < index;
        const isClickable = !isLost && isFuture && !isPending;

        return (
          <div key={step.status} className="flex items-start gap-3">
            {/* Linha + círculo */}
            <div className="flex flex-col items-center">
              {/* Círculo */}
              <button
                onClick={() => isClickable && handleStep(step.status)}
                disabled={!isClickable || isPending}
                aria-label={`Marcar como ${step.label}`}
                className={[
                  'flex h-7 w-7 items-center justify-center rounded-full border-2 transition-all duration-200',
                  isDone ? 'border-transparent text-white' : '',
                  isActive ? 'border-transparent text-white' : '',
                  isFuture
                    ? 'border-border bg-background hover:border-[var(--habitta-accent)] hover:opacity-80'
                    : '',
                  isClickable ? 'cursor-pointer' : 'cursor-default',
                ]
                  .filter(Boolean)
                  .join(' ')}
                style={isDone || isActive ? { backgroundColor: 'var(--habitta-accent)' } : undefined}
              >
                {isDone ? (
                  <Check className="h-3.5 w-3.5" strokeWidth={3} />
                ) : isActive ? (
                  <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-white" />
                ) : (
                  <span className="h-2 w-2 rounded-full bg-muted" />
                )}
              </button>

              {/* Línea conectora */}
              {index < STEPS.length - 1 && (
                <div
                  className={[
                    'my-0.5 w-0.5 flex-1',
                    isDone
                      ? 'bg-[var(--habitta-accent)]'
                      : 'border-l-2 border-dashed border-border bg-transparent',
                  ].join(' ')}
                  style={{ height: '20px' }}
                />
              )}
            </div>

            {/* Label */}
            <div className="pb-4 pt-0.5">
              <span
                className={[
                  'font-sans text-sm',
                  isActive ? 'font-semibold text-foreground' : '',
                  isDone && !isActive ? 'text-muted-foreground line-through' : '',
                  isFuture ? 'text-muted-foreground' : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
              >
                {step.label}
              </span>
            </div>
          </div>
        );
      })}

      {/* Separador + Lost */}
      <div className="my-2 border-t border-dashed border-border" />

      <div className="flex items-center gap-3">
        <button
          onClick={() => !isLost && !isPending && handleStep('lost')}
          disabled={isLost || isPending}
          className={[
            'flex h-7 w-7 items-center justify-center rounded-full border-2 transition-all',
            isLost
              ? 'border-transparent text-white'
              : 'cursor-pointer border-border hover:border-destructive hover:opacity-80',
          ].join(' ')}
          style={isLost ? { backgroundColor: 'var(--destructive)' } : undefined}
          aria-label="Marcar como perdido"
        >
          {isLost ? (
            <Check className="h-3.5 w-3.5" strokeWidth={3} />
          ) : (
            <span className="h-2 w-2 rounded-full bg-muted" />
          )}
        </button>
        <span
          className={['font-sans text-sm', isLost ? 'font-semibold' : 'text-muted-foreground'].join(
            ' '
          )}
          style={isLost ? { color: 'var(--destructive)' } : undefined}
        >
          Perdido
        </span>
      </div>

      {/* Confirmación Lost (inline, sin AlertDialog externo) */}
      {confirmLost && (
        <div
          className="mt-3 rounded-lg p-3"
          style={{ backgroundColor: 'var(--destructive-tint)' }}
        >
          <div className="mb-2 flex items-center gap-2">
            <AlertTriangle
              className="h-4 w-4 shrink-0"
              style={{ color: 'var(--destructive)' }}
            />
            <p
              className="font-sans text-sm font-semibold"
              style={{ color: 'var(--destructive)' }}
            >
              ¿Marcar como perdido?
            </p>
          </div>
          <p className="mb-3 font-sans text-xs text-muted-foreground">
            Esta acción indica que el lead no se convertirá en cliente.
          </p>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setConfirmLost(false)}
              className="flex-1 text-xs"
            >
              Cancelar
            </Button>
            <Button
              size="sm"
              onClick={handleConfirmLost}
              disabled={isPending}
              className="flex-1 text-xs text-white"
              style={{ backgroundColor: 'var(--destructive)' }}
            >
              Confirmar
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeadStatusStepper;
