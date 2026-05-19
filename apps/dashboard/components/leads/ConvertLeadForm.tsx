'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { CalendarIcon } from 'lucide-react';
import type { LeadWithRelations, Package, Project } from '@habitta/types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { convertLeadAction } from '@/app/(dashboard)/leads/actions';

interface ConvertLeadFormProps {
  lead: LeadWithRelations;
  projects: Project[];
}

const formatPrice = (price: number) =>
  new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(price);

interface SubmitButtonProps {
  disabled?: boolean;
}

const SubmitButton = ({ disabled = false }: SubmitButtonProps) => {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      disabled={pending || disabled}
      className="flex-1 gap-2 text-white hover:opacity-90"
      style={{ backgroundColor: 'var(--habitta-accent)' }}
    >
      {pending ? (
        <>
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
          Convirtiendo...
        </>
      ) : (
        'Confirmar conversión'
      )}
    </Button>
  );
};

const selectClass =
  'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 font-sans text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50';

// Convierte Date a 'YYYY-MM-DD' sin desfase de timezone
const toISODate = (date: Date): string => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

const formatCopNumber = (value: string): string => {
  const digits = value.replace(/\D/g, '');
  if (!digits) return '';
  return new Intl.NumberFormat('es-CO', { maximumFractionDigits: 0 }).format(Number(digits));
};

const parseCopNumber = (value: string): number => {
  const digits = value.replace(/\D/g, '');
  return digits ? Number(digits) : 0;
};

const ConvertLeadForm = ({ lead, projects }: ConvertLeadFormProps) => {
  const action = convertLeadAction.bind(null, lead.id, lead.short_id);
  const [state, formAction] = useFormState(action, null);

  const activeProjects = projects.filter((p) => p.status === 'active');
  const [selectedProjectId, setSelectedProjectId] = useState(lead.project?.id ?? '');
  const [packages, setPackages] = useState<Package[]>([]);
  const [loadingPackages, setLoadingPackages] = useState(false);
  const [selectedPackageId, setSelectedPackageId] = useState(lead.package?.id ?? '');
  const [totalAmount, setTotalAmount] = useState<string>(
    lead.package?.price ? String(lead.package.price) : ''
  );

  const selectedPackage = packages.find((p) => p.id === selectedPackageId) ?? null;
  const [workStartDate, setWorkStartDate] = useState<Date | undefined>(undefined);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [initialPayment, setInitialPayment] = useState('');

  useEffect(() => {
    if (!selectedProjectId) {
      setPackages([]);
      setSelectedPackageId('');
      return;
    }
    setLoadingPackages(true);
    fetch(`/api/packages?project_id=${selectedProjectId}`)
      .then((res) => res.json())
      .then((data: Package[]) => {
        setPackages(data);
        const preselect = data.find((p) => p.id === lead.package?.id);
        if (preselect) {
          setSelectedPackageId(preselect.id);
          setTotalAmount(String(preselect.price));
        }
      })
      .catch(() => setPackages([]))
      .finally(() => setLoadingPackages(false));
  }, [selectedProjectId, lead.package?.id]);

  const handlePackageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const pkg = packages.find((p) => p.id === e.target.value);
    setSelectedPackageId(e.target.value);
    if (pkg) setTotalAmount(String(pkg.price));
  };

  const initialPaymentValue = parseCopNumber(initialPayment);
  const packagePrice = selectedPackage?.price ?? 0;
  const isInitialPaymentInvalid = packagePrice > 0 && initialPaymentValue > packagePrice;

  return (
    <form action={formAction} className="flex flex-col gap-5">
      {state?.error && (
        <div
          className="rounded-md p-3 font-sans text-sm"
          style={{ backgroundColor: 'var(--destructive-tint)', color: 'var(--destructive)' }}
        >
          {state.error}
        </div>
      )}

      {/* Proyecto */}
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="project_id">Proyecto *</Label>
        <select
          id="project_id"
          name="project_id"
          required
          className={selectClass}
          value={selectedProjectId}
          onChange={(e) => setSelectedProjectId(e.target.value)}
        >
          <option value="">Seleccionar proyecto</option>
          {activeProjects.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name} — {p.city}
            </option>
          ))}
        </select>
      </div>

      {/* Paquete */}
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="package_id">Paquete elegido *</Label>
        <select
          id="package_id"
          name="package_id"
          required
          className={selectClass}
          value={selectedPackageId}
          disabled={!selectedProjectId || loadingPackages}
          onChange={handlePackageChange}
        >
          <option value="">
            {loadingPackages
              ? 'Cargando...'
              : !selectedProjectId
                ? 'Selecciona un proyecto primero'
                : 'Seleccionar paquete'}
          </option>
          {packages.map((pkg) => (
            <option key={pkg.id} value={pkg.id}>
              {pkg.name} — {formatPrice(pkg.price)}
            </option>
          ))}
        </select>
        {selectedPackage && (
          <p className="font-sans text-xs text-muted-foreground">
            Precio base:{' '}
            <span style={{ color: 'var(--habitta-accent)' }}>
              {formatPrice(selectedPackage.price)}
            </span>
          </p>
        )}
      </div>

      {/* Total */}
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="total_amount">Valor total de venta (COP) *</Label>
        <Input
          id="total_amount"
          name="total_amount"
          type="number"
          required
          min={0}
          step={1000000}
          value={totalAmount}
          onChange={(e) => setTotalAmount(e.target.value)}
          placeholder="Ej: 250000000"
        />
        {totalAmount && !isNaN(parseFloat(totalAmount)) && (
          <p className="font-sans text-xs font-medium" style={{ color: 'var(--habitta-accent)' }}>
            {formatPrice(parseFloat(totalAmount))}
          </p>
        )}
        <p className="font-sans text-xs text-muted-foreground">
          Puede diferir del precio base del paquete según negociación.
        </p>
      </div>

      {/* Cédula */}
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="cedula">Cédula del cliente *</Label>
        <Input id="cedula" name="cedula" type="text" required placeholder="Ej: 1234567890" />
        <p className="font-sans text-xs text-muted-foreground">
          Se usará para que el cliente acceda a su portal de seguimiento.
        </p>
      </div>

      {/* Ubicación de la unidad */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="tower">Torre *</Label>
          <Input id="tower" name="tower" type="text" required placeholder="Ej: Torre 2" />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="apartment_number">Apto *</Label>
          <Input
            id="apartment_number"
            name="apartment_number"
            type="text"
            required
            placeholder="Ej: 703"
          />
        </div>
      </div>

        {/* Anticipo inicial (obligatorio) */}
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="initial_payment_display">Anticipo inicial (COP) *</Label>
          <Input
            id="initial_payment_display"
            type="text"
            inputMode="numeric"
            required
            value={initialPayment}
            onChange={(e) => setInitialPayment(formatCopNumber(e.target.value))}
            placeholder="Ej: 5.000.000"
          />
          <input type="hidden" name="initial_payment" value={initialPayment} />
          <p className="font-sans text-xs text-muted-foreground">
            Monto del primer abono. Todo cliente debe tener al menos un anticipo.
          </p>
          {selectedPackage && (
            <p className="font-sans text-xs text-muted-foreground">
              Máximo permitido por paquete:{' '}
              <span className="font-semibold text-foreground">{formatPrice(selectedPackage.price)}</span>
            </p>
          )}
          {isInitialPaymentInvalid && (
            <p className="font-sans text-xs" style={{ color: 'var(--destructive)' }}>
              El anticipo no puede superar el valor del paquete.
            </p>
          )}
        </div>

      {/* Fecha de inicio de obra */}
      <div className="flex flex-col gap-1.5">
        <Label>Fecha de inicio de obra *</Label>
        <input
          type="hidden"
          name="work_start_date"
          value={workStartDate ? toISODate(workStartDate) : ''}
        />
        <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
          <PopoverTrigger asChild>
            <button type="button" className={selectClass + ' flex items-center gap-2'}>
              <CalendarIcon className="h-4 w-4 shrink-0 text-muted-foreground" />
              <span className={workStartDate ? '' : 'text-muted-foreground'}>
                {workStartDate
                  ? new Intl.DateTimeFormat('es-CO', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                    }).format(workStartDate)
                  : 'Seleccionar fecha de inicio'}
              </span>
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={workStartDate}
              onSelect={(date) => {
                setWorkStartDate(date);
                setCalendarOpen(false);
              }}
              initialFocus
            />
          </PopoverContent>
        </Popover>
        <p className="font-sans text-xs text-muted-foreground">
          Día en que el cliente paga el adelanto e inicia la obra.
        </p>
      </div>

        {/* Botones */}
      <div className="mt-2 flex flex-col-reverse gap-3 sm:flex-row">
        <Button asChild variant="outline" className="flex-1">
          <Link href={`/leads/${lead.short_id}`}>Cancelar</Link>
        </Button>
        <SubmitButton disabled={isInitialPaymentInvalid} />
      </div>
    </form>
  );
};

export default ConvertLeadForm;
