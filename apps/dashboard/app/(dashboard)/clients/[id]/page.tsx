import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Mail, Phone, Calendar, Building2, Package as PackageIcon, Users } from 'lucide-react';
import type { ElementType } from 'react';
import { getClientByShortId } from '@habitta/database';
import { calculateDelivery } from '@habitta/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import ClientNotesEditor from '@/components/clients/ClientNotesEditor';
import ClientStatusSelector from '@/components/clients/ClientStatusSelector';
import ClientWorkStartDatePicker from '@/components/clients/ClientWorkStartDatePicker';
import ClientPaymentsSection from '@/components/clients/ClientPaymentsSection';
import DeleteClientButton from '@/components/clients/DeleteClientButton';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const getInitials = (firstName: string, lastName: string): string =>
  `${firstName[0] ?? ''}${lastName[0] ?? ''}`.toUpperCase();

const formatDate = (dateStr: string | null): string => {
  if (!dateStr) return '—';
  return new Intl.DateTimeFormat('es-CO', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(new Date(dateStr));
};

const getTimeSince = (dateStr: string | null): string => {
  if (!dateStr) return '—';
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days < 30) return `${days} día${days !== 1 ? 's' : ''}`;
  const months = Math.floor(days / 30);
  return `${months} mes${months !== 1 ? 'es' : ''}`;
};

const formatCOP = (amount: number | null): string => {
  if (amount === null) return '—';
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
  }).format(amount);
};

// ─── InfoRow ──────────────────────────────────────────────────────────────────

interface InfoRowProps {
  icon: ElementType;
  label: string;
  value: string | null | undefined;
}

const InfoRow = ({ icon: Icon, label, value }: InfoRowProps) => (
  <div className="flex items-start gap-3">
    <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted">
      <Icon className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
    </div>
    <div>
      <p className="font-sans text-xs text-muted-foreground">{label}</p>
      <p className="font-sans text-sm font-medium text-foreground">
        {value ?? <span className="text-muted-foreground">No registrado</span>}
      </p>
    </div>
  </div>
);

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function ClientDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: shortId } = await params;
  const client = await getClientByShortId(shortId);

  if (!client) notFound();

  return (
    <div>
      {/* Breadcrumb */}
      <nav
        className="mb-6 flex items-center gap-2 font-sans text-sm text-muted-foreground"
        aria-label="Breadcrumb"
      >
        <Link href="/clients" className="transition-colors hover:text-foreground">
          Clientes
        </Link>
        <span aria-hidden="true">/</span>
        <span className="text-foreground">
          {client.first_name} {client.last_name}
        </span>
      </nav>

      {/* Grid principal */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* ── Columna izquierda (2/3) ──────────────────────────────────────── */}
        <div className="flex flex-col gap-6 lg:col-span-2">
          {/* Card: Información del cliente */}
          <Card className="overflow-hidden">
            <div className="h-1 w-full" style={{ backgroundColor: 'var(--success)' }} />
            <CardContent className="p-6">
              {/* Avatar + nombre + badge */}
              <div className="mb-6 flex items-start gap-4">
                <div
                  className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl font-sans text-xl font-bold text-white shadow-sm"
                  style={{ backgroundColor: 'var(--success)' }}
                  aria-hidden="true"
                >
                  {getInitials(client.first_name, client.last_name)}
                </div>
                <div>
                  <h1 className="font-display text-2xl font-semibold">
                    {client.first_name} {client.last_name}
                  </h1>
                  <span
                    className="mt-1 inline-flex items-center rounded-full px-2.5 py-0.5 font-sans text-xs font-semibold"
                    style={{ backgroundColor: 'var(--success-tint)', color: 'var(--success)' }}
                  >
                    Cliente
                  </span>
                </div>
              </div>

              {/* Info rows */}
              <div className="flex flex-col gap-4">
                <InfoRow icon={Mail} label="Email" value={client.email} />
                <InfoRow icon={Phone} label="Teléfono" value={client.phone} />
                <InfoRow
                  icon={Calendar}
                  label="Fecha de conversión"
                  value={formatDate(client.created_at)}
                />
                <InfoRow
                  icon={Calendar}
                  label="Antigüedad"
                  value={getTimeSince(client.created_at)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Card: Detalle de compra */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="font-display text-lg font-semibold">Detalle de compra</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 px-6 pb-6">
              {/* Proyecto */}
              <div className="rounded-lg p-4" style={{ backgroundColor: 'var(--muted)' }}>
                <div className="mb-1 flex items-center gap-2">
                  <Building2
                    className="h-4 w-4 shrink-0"
                    style={{ color: 'var(--habitta-accent)' }}
                    aria-hidden="true"
                  />
                  <span className="font-sans text-sm font-semibold">{client.project.name}</span>
                </div>
                <span className="font-sans text-xs text-muted-foreground">
                  {client.project.city}
                </span>
              </div>

              {/* Paquete */}
              <div className="rounded-lg p-4" style={{ backgroundColor: 'var(--muted)' }}>
                <div className="mb-1 flex items-center gap-2">
                  <PackageIcon
                    className="h-4 w-4 shrink-0"
                    style={{ color: 'var(--habitta-accent)' }}
                    aria-hidden="true"
                  />
                  <span className="font-sans text-sm font-semibold">{client.package.name}</span>
                </div>
                <span className="font-sans text-xs text-muted-foreground">
                  Precio base: {formatCOP(client.package.price)}
                </span>
              </div>

              {/* Total */}
              <Separator className="my-2" />
              <div className="flex items-center justify-between">
                <span className="font-sans text-sm text-muted-foreground">Total de venta</span>
                <span
                  className="font-display text-3xl font-bold"
                  style={{ color: 'var(--habitta-accent)' }}
                >
                  {formatCOP(client.total_amount)}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Card: Anticipos */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="font-display text-lg font-semibold">Anticipos</CardTitle>
            </CardHeader>
            <CardContent className="px-6 pb-6">
              <ClientPaymentsSection
                clientId={client.id}
                clientShortId={client.short_id}
                totalAmount={client.total_amount ?? 0}
                payments={client.payments ?? []}
              />
            </CardContent>
          </Card>

          {/* Card: Notas */}
          <Card>
            <CardContent className="p-6">
              <h2 className="mb-4 font-display text-lg font-semibold">Notas</h2>
              <ClientNotesEditor
                clientId={client.id}
                clientShortId={client.short_id}
                initialNotes={client.notes ?? ''}
              />
            </CardContent>
          </Card>
        </div>

        {/* ── Columna derecha (1/3) ────────────────────────────────────────── */}
        <div className="flex flex-col gap-6">
          {/* Card: Estado del proceso */}
          <Card>
            <CardContent className="p-6">
              <h2 className="mb-4 font-display text-lg font-semibold">Estado del proceso</h2>
              <ClientStatusSelector
                clientId={client.id}
                clientShortId={client.short_id}
                currentStatus={client.status}
              />
            </CardContent>
          </Card>

          {/* Card: Fecha de inicio de obra */}
          <Card>
            <CardContent className="p-6">
              <h2 className="mb-1 font-display text-lg font-semibold">Inicio de obra</h2>
              <p className="mb-4 font-sans text-xs text-muted-foreground">
                Fecha desde la que se cuenta la entrega del apartamento.
              </p>
              <ClientWorkStartDatePicker
                clientId={client.id}
                clientShortId={client.short_id}
                currentDate={client.work_start_date}
              />
              {/* Mostrar resumen de entrega si hay fecha */}
              {client.work_start_date &&
                (() => {
                  const { daysRemaining, deliveryDate, status } = calculateDelivery(
                    client.work_start_date,
                    client.package.delivery_days
                  );
                  if (!deliveryDate) return null;
                  const formatted = new Intl.DateTimeFormat('es-CO', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric',
                  }).format(deliveryDate);
                  return (
                    <div
                      className="mt-4 rounded-lg p-3"
                      style={{ backgroundColor: 'var(--muted)' }}
                    >
                      <p className="font-sans text-xs text-muted-foreground">
                        Fecha estimada de entrega
                      </p>
                      <p className="mt-0.5 font-sans text-sm font-semibold">{formatted}</p>
                      <p
                        className="mt-0.5 font-sans text-xs font-medium"
                        style={{
                          color:
                            status === 'vencido'
                              ? 'hsl(0 70% 45%)'
                              : status === 'urgente'
                                ? 'var(--warning)'
                                : 'var(--success)',
                        }}
                      >
                        {status === 'vencido'
                          ? `Vencido hace ${Math.abs(daysRemaining!)} días`
                          : status === 'urgente'
                            ? `⚠ Faltan ${daysRemaining} días`
                            : `Faltan ${daysRemaining} días`}
                      </p>
                    </div>
                  );
                })()}
            </CardContent>
          </Card>

          {/* Card: Lead de origen */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="font-display text-base font-semibold">Lead de origen</CardTitle>
            </CardHeader>
            <CardContent className="px-6 pb-6">
              {client.lead ? (
                <div className="space-y-3">
                  <p className="font-sans text-sm text-muted-foreground">
                    Proviene del lead capturado en el website.
                  </p>
                  <Button variant="outline" asChild className="w-full gap-2">
                    <Link href={`/leads/${client.lead.short_id}`}>
                      <Users className="h-4 w-4" aria-hidden="true" />
                      Ver lead original
                    </Link>
                  </Button>
                  {client.lead.notes && (
                    <div
                      className="rounded-lg p-3 font-sans text-sm italic text-muted-foreground"
                      style={{ backgroundColor: 'var(--muted)' }}
                    >
                      &ldquo;{typeof client.lead.notes === 'string'
                        ? client.lead.notes
                        : client.lead.notes.text}&rdquo;
                    </div>
                  )}
                </div>
              ) : (
                <p className="font-sans text-sm text-muted-foreground">
                  Cliente creado manualmente, sin lead asociado.
                </p>
              )}
            </CardContent>
          </Card>

          {/* Card: Resumen */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="font-display text-base font-semibold">Resumen</CardTitle>
            </CardHeader>
            <CardContent className="px-6 pb-6">
              <dl className="space-y-3">
                <div>
                  <dt className="font-sans text-xs uppercase tracking-wide text-muted-foreground">
                    Registro
                  </dt>
                  <dd className="mt-0.5 font-sans text-sm">
                    {formatDate(client.created_at)}
                  </dd>
                </div>
                <div>
                  <dt className="font-sans text-xs uppercase tracking-wide text-muted-foreground">
                    Proyecto
                  </dt>
                  <dd className="mt-0.5 font-sans text-sm">{client.project.name}</dd>
                </div>
                <div>
                  <dt className="font-sans text-xs uppercase tracking-wide text-muted-foreground">
                    Paquete
                  </dt>
                  <dd className="mt-0.5 font-sans text-sm">{client.package.name}</dd>
                </div>
                <div>
                  <dt className="font-sans text-xs uppercase tracking-wide text-muted-foreground">
                    Total invertido
                  </dt>
                  <dd
                    className="mt-0.5 font-sans text-sm font-bold"
                    style={{ color: 'var(--habitta-accent)' }}
                  >
                    {formatCOP(client.total_amount)}
                  </dd>
                </div>
              </dl>
            </CardContent>
          </Card>

          {/* Card: Zona peligrosa */}
          <Card className="border-destructive/30">
            <CardContent className="p-6">
              <h2 className="mb-3 font-display text-base font-semibold text-destructive">
                Zona peligrosa
              </h2>
              <p className="mb-4 font-sans text-xs text-muted-foreground">
                Eliminar este cliente borrará toda su información permanentemente.
              </p>
              <DeleteClientButton
                clientId={client.id}
                clientName={`${client.first_name} ${client.last_name}`}
                variant="button"
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
