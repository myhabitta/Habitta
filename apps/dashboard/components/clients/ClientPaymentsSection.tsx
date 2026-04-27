'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { CalendarIcon, Plus } from 'lucide-react';
import type { ClientPayment } from '@habitta/types';
import { formatPrice } from '@habitta/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { addClientPaymentAction } from '@/app/(dashboard)/clients/actions';

interface ClientPaymentsSectionProps {
  clientId: string;
  clientShortId: string;
  totalAmount: number;
  payments: ClientPayment[];
}

const DATE_FMT = new Intl.DateTimeFormat('es-CO', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
});

const toISODate = (date: Date): string => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

const formatLocalDate = (iso: string): string => {
  const parts = iso.split('-').map(Number);
  if (parts.length !== 3) return iso;
  const [y, m, d] = parts as [number, number, number];
  return DATE_FMT.format(new Date(y, m - 1, d));
};

const ClientPaymentsSection = ({
  clientId,
  clientShortId,
  totalAmount,
  payments,
}: ClientPaymentsSectionProps) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [amount, setAmount] = useState('');
  const [notes, setNotes] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [calendarOpen, setCalendarOpen] = useState(false);

  const totalPaid = payments.reduce((sum, p) => sum + Number(p.amount), 0);
  const remaining = totalAmount - totalPaid;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      setError('Ingresa un monto válido');
      return;
    }
    if (totalPaid + numericAmount > totalAmount) {
      setError(
        `El monto supera el total acordado. Máximo permitido: ${formatPrice(remaining)}`
      );
      return;
    }

    startTransition(async () => {
      const result = await addClientPaymentAction(
        clientId,
        clientShortId,
        numericAmount,
        toISODate(selectedDate),
        notes.trim() || null,
        totalAmount
      );
      if (result?.error) {
        setError(result.error);
      } else {
        setSuccess(true);
        setAmount('');
        setNotes('');
        setSelectedDate(new Date());
        setTimeout(() => setSuccess(false), 2500);
        router.refresh();
      }
    });
  };

  const sortedPayments = payments
    .slice()
    .sort((a, b) => b.paid_at.localeCompare(a.paid_at));

  return (
    <div className="flex flex-col gap-5">
      {/* Resumen pagado / pendiente */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-lg p-3" style={{ backgroundColor: 'var(--success-tint)' }}>
          <p className="font-sans text-xs text-muted-foreground">Pagado</p>
          <p
            className="mt-0.5 font-sans text-sm font-bold"
            style={{ color: 'var(--success)' }}
          >
            {formatPrice(totalPaid)}
          </p>
        </div>
        <div className="rounded-lg p-3" style={{ backgroundColor: 'var(--muted)' }}>
          <p className="font-sans text-xs text-muted-foreground">Pendiente</p>
          <p
            className="mt-0.5 font-sans text-sm font-bold"
            style={{ color: remaining > 0 ? 'var(--warning)' : 'var(--success)' }}
          >
            {formatPrice(remaining)}
          </p>
        </div>
      </div>

      {/* Historial */}
      {sortedPayments.length > 0 && (
        <div className="flex flex-col gap-2">
          <p className="font-sans text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Historial
          </p>
          {sortedPayments.map((payment) => (
            <div
              key={payment.id}
              className="flex items-start justify-between rounded-lg p-3"
              style={{ backgroundColor: 'var(--muted)' }}
            >
              <div>
                <p className="font-sans text-sm font-medium">
                  {formatPrice(Number(payment.amount))}
                </p>
                {payment.notes && (
                  <p className="font-sans text-xs text-muted-foreground">{payment.notes}</p>
                )}
              </div>
              <p className="font-sans text-xs text-muted-foreground">
                {formatLocalDate(payment.paid_at)}
              </p>
            </div>
          ))}
        </div>
      )}

      <Separator />

      {/* Formulario: registrar anticipo */}
      {remaining > 0 ? (
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <p className="font-sans text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Registrar anticipo
          </p>

          {/* Monto */}
          <div className="flex flex-col gap-1">
            <label className="font-sans text-xs text-muted-foreground">Monto (COP)</label>
            <Input
              type="number"
              min="1"
              step="1"
              placeholder="Ej: 5000000"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="font-sans text-sm"
              disabled={isPending}
            />
          </div>

          {/* Fecha */}
          <div className="flex flex-col gap-1">
            <label className="font-sans text-xs text-muted-foreground">Fecha del pago</label>
            <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  type="button"
                  className="w-full justify-start gap-2 font-sans text-sm"
                  disabled={isPending}
                >
                  <CalendarIcon className="h-4 w-4 shrink-0 text-muted-foreground" />
                  <span>{formatLocalDate(toISODate(selectedDate))}</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => {
                    if (date) setSelectedDate(date);
                    setCalendarOpen(false);
                  }}
                  defaultMonth={selectedDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Notas */}
          <div className="flex flex-col gap-1">
            <label className="font-sans text-xs text-muted-foreground">Notas (opcional)</label>
            <Input
              type="text"
              placeholder="Ej: Transferencia bancaria"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="font-sans text-sm"
              disabled={isPending}
            />
          </div>

          {error && (
            <p className="font-sans text-xs" style={{ color: 'var(--destructive)' }}>
              {error}
            </p>
          )}
          {success && (
            <p className="font-sans text-xs" style={{ color: 'var(--success)' }}>
              Anticipo registrado correctamente
            </p>
          )}

          <Button
            type="submit"
            disabled={isPending || !amount}
            className="w-full gap-2"
            size="sm"
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            {isPending ? 'Guardando...' : 'Registrar anticipo'}
          </Button>
        </form>
      ) : (
        <p className="font-sans text-sm font-medium" style={{ color: 'var(--success)' }}>
          Pago completo — total recibido
        </p>
      )}
    </div>
  );
};

export default ClientPaymentsSection;
