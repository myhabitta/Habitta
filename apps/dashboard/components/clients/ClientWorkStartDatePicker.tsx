'use client';

import { useState, useTransition } from 'react';
import { CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { updateClientWorkStartDateAction } from '@/app/(dashboard)/clients/actions';

interface ClientWorkStartDatePickerProps {
  clientId: string;
  clientShortId: string;
  currentDate: string | null;
}

// Formatea 'YYYY-MM-DD' como 'DD MMM YYYY' en español Colombia
const formatLocalDate = (iso: string | null): string => {
  if (!iso) return 'Sin fecha';
  const [year, month, day] = iso.split('-').map(Number);
  return new Intl.DateTimeFormat('es-CO', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(year!, month! - 1, day!));
};

// Convierte Date a 'YYYY-MM-DD' sin desfase de timezone
const toISODate = (date: Date): string => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

const ClientWorkStartDatePicker = ({
  clientId,
  clientShortId,
  currentDate,
}: ClientWorkStartDatePickerProps) => {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<Date | undefined>(
    currentDate
      ? (() => {
          const [y, m, d] = currentDate.split('-').map(Number);
          return new Date(y!, m! - 1, d!);
        })()
      : undefined
  );
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const handleSelect = (date: Date | undefined) => {
    setSelected(date);
    setOpen(false);
    setError(null);

    const isoDate = date ? toISODate(date) : null;

    startTransition(async () => {
      const result = await updateClientWorkStartDateAction(clientId, clientShortId, isoDate);
      if (result?.error) {
        setError(result.error);
      } else {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      }
    });
  };

  return (
    <div className="flex flex-col gap-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            disabled={isPending}
            className="w-full justify-start gap-2 font-sans text-sm"
          >
            <CalendarIcon className="h-4 w-4 shrink-0 text-muted-foreground" />
            <span className={selected ? 'text-foreground' : 'text-muted-foreground'}>
              {selected ? formatLocalDate(toISODate(selected)) : 'Seleccionar fecha'}
            </span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={selected}
            onSelect={handleSelect}
            defaultMonth={selected ?? new Date()}
            initialFocus
          />
        </PopoverContent>
      </Popover>

      {saved && (
        <p className="font-sans text-xs" style={{ color: 'var(--success)' }}>
          Fecha guardada ✓
        </p>
      )}
      {error && (
        <p className="font-sans text-xs" style={{ color: 'var(--destructive)' }}>
          {error}
        </p>
      )}
      {selected && (
        <button
          type="button"
          onClick={() => handleSelect(undefined)}
          className="font-sans text-xs text-muted-foreground underline-offset-2 hover:underline"
          disabled={isPending}
        >
          Quitar fecha
        </button>
      )}
    </div>
  );
};

export default ClientWorkStartDatePicker;
