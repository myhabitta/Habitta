'use client';

import { useTransition, useState } from 'react';
import type { ClientStatus } from '@habitta/types';
import { updateClientStatusAction } from '@/app/(dashboard)/clients/actions';

interface ClientStatusSelectorProps {
  clientId: string;
  clientShortId: string;
  currentStatus: ClientStatus;
}

const STATUS_OPTIONS: Array<{
  status: ClientStatus;
  label: string;
  description: string;
}> = [
  {
    status: 'pendiente',
    label: 'Pendiente',
    description: 'Proceso de compra iniciado, en espera de confirmación',
  },
  {
    status: 'en_proceso',
    label: 'En proceso',
    description: 'Documentación y trámites en curso',
  },
  {
    status: 'completado',
    label: 'Completado',
    description: 'Proceso de compra finalizado exitosamente',
  },
];

const STATUS_STYLES: Record<ClientStatus, React.CSSProperties> = {
  pendiente: { backgroundColor: 'var(--warning-tint)', color: 'var(--warning)' },
  en_proceso: { backgroundColor: 'var(--habitta-accent-tint)', color: 'var(--habitta-accent)' },
  completado: { backgroundColor: 'var(--success-tint)', color: 'var(--success)' },
};

const ClientStatusSelector = ({ clientId, clientShortId, currentStatus }: ClientStatusSelectorProps) => {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleChange = (status: ClientStatus) => {
    if (status === currentStatus || isPending) return;
    setError(null);
    startTransition(async () => {
      const result = await updateClientStatusAction(clientId, clientShortId, status);
      if (result?.error) setError(result.error);
    });
  };

  return (
    <div className="flex flex-col gap-2">
      {error && (
        <p className="mb-1 font-sans text-xs" style={{ color: 'var(--destructive)' }}>
          {error}
        </p>
      )}

      {STATUS_OPTIONS.map((option) => {
        const isActive = currentStatus === option.status;

        return (
          <button
            key={option.status}
            onClick={() => handleChange(option.status)}
            disabled={isPending}
            aria-pressed={isActive}
            aria-label={`Marcar como ${option.label}`}
            className={[
              'w-full rounded-lg border-2 p-3 text-left transition-all duration-150',
              isActive ? 'border-transparent' : 'border-border bg-background hover:border-border/60 hover:bg-muted/50',
              isPending ? 'cursor-wait opacity-60' : 'cursor-pointer',
            ]
              .filter(Boolean)
              .join(' ')}
            style={isActive ? STATUS_STYLES[option.status] : undefined}
          >
            <p className="font-sans text-sm font-semibold">{option.label}</p>
            <p
              className="mt-0.5 font-sans text-xs"
              style={isActive ? { opacity: 0.75 } : { color: 'var(--muted-foreground)' }}
            >
              {option.description}
            </p>
          </button>
        );
      })}
    </div>
  );
};

export default ClientStatusSelector;
