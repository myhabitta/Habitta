'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { HardHat, Check, Circle, Flag } from 'lucide-react';
import type { ConstructionPhase } from '@habitta/types';
import { PHASE_LABELS, PHASE_SHORT_LABELS, PHASE_COLORS } from '@habitta/types';
import { Button } from '@/components/ui/button';
import { updateConstructionPhaseAction } from '@/app/(dashboard)/clients/actions';

interface ConstructionPhaseStepperProps {
  clientId: string;
  clientShortId: string;
  currentPhase: ConstructionPhase;
  clientName: string;
}

const PHASES: ConstructionPhase[] = [0, 1, 2, 3, 4, 5];

const ConstructionPhaseStepper = ({
  clientId,
  clientShortId,
  currentPhase,
  clientName,
}: ConstructionPhaseStepperProps) => {
  const [selectedPhase, setSelectedPhase] = useState<ConstructionPhase>(currentPhase);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const hasChanged = selectedPhase !== currentPhase;

  const handleSave = () => {
    startTransition(async () => {
      const result = await updateConstructionPhaseAction(clientId, clientShortId, selectedPhase);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(result.success);
        router.refresh();
      }
    });
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Vertical timeline stepper */}
      <div className="flex flex-col gap-0">
        {PHASES.map((phase, i) => {
          const isCompleted = phase < currentPhase;
          const isActive = phase === selectedPhase;
          const isCurrent = phase === currentPhase;
          const isLast = i === PHASES.length - 1;
          const isTerminado = phase === 5;
          const isSinIniciar = phase === 0;

          return (
            <div key={phase} className="flex gap-3">
              {/* Timeline rail */}
              <div className="flex flex-col items-center">
                <button
                  type="button"
                  onClick={() => setSelectedPhase(phase)}
                  className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full font-sans text-xs font-bold transition-all"
                  style={{
                    backgroundColor: isActive
                      ? PHASE_COLORS[phase].solid
                      : isCompleted
                        ? PHASE_COLORS[phase].solid
                        : isCurrent
                          ? PHASE_COLORS[phase].bg
                          : 'var(--muted)',
                    color: isActive || isCompleted ? '#ffffff' : 'var(--muted-foreground)',
                    outline: isActive ? `3px solid ${PHASE_COLORS[phase].bg}` : 'none',
                    outlineOffset: '2px',
                  }}
                >
                  {isCompleted ? (
                    <Check className="h-4 w-4" />
                  ) : isTerminado ? (
                    <Flag className="h-4 w-4" />
                  ) : isSinIniciar ? (
                    <Circle className="h-4 w-4" />
                  ) : (
                    phase
                  )}
                </button>
                {!isLast && (
                  <div
                    className="w-0.5 flex-1"
                    style={{
                      minHeight: '20px',
                      backgroundColor: phase < currentPhase ? PHASE_COLORS[phase].solid : 'var(--border)',
                    }}
                  />
                )}
              </div>

              {/* Label */}
              <div className={isLast ? 'pb-0' : 'pb-4'}>
                <p
                  className="font-sans text-xs font-semibold leading-9"
                  style={{
                    color: isActive
                      ? PHASE_COLORS[phase].text
                      : isCompleted
                        ? PHASE_COLORS[phase].text
                        : 'var(--muted-foreground)',
                  }}
                >
                  {isSinIniciar || isTerminado
                    ? PHASE_LABELS[phase]
                    : `${PHASE_SHORT_LABELS[phase]}: ${PHASE_LABELS[phase]}`}
                </p>
                {isCurrent && !isCompleted && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-orange-100 px-2 py-0.5 font-sans text-[10px] font-medium text-orange-600 dark:bg-orange-950 dark:text-orange-400">
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-current opacity-75" />
                      <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-current" />
                    </span>
                    Estado actual
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Save button */}
      {hasChanged && (
        <Button
          onClick={handleSave}
          disabled={isPending}
          className="gap-2 text-white"
          style={{ backgroundColor: 'var(--habitta-accent)' }}
        >
          <HardHat className="h-4 w-4" />
          {isPending ? 'Guardando...' : `Guardar y notificar a ${clientName}`}
        </Button>
      )}
    </div>
  );
};

export default ConstructionPhaseStepper;
