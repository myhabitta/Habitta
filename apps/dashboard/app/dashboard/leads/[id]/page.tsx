import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Mail, Phone, Calendar, Building2, Package, UserCheck } from 'lucide-react';
import type { ElementType } from 'react';
import { getLeadByShortId } from '@habitta/database';
import type { LeadStatus } from '@habitta/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import LeadNotesEditor from '@/components/leads/LeadNotesEditor';
import LeadStatusStepper from '@/components/leads/LeadStatusStepper';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const getInitials = (first: string, last: string): string =>
  `${first[0] ?? ''}${last[0] ?? ''}`.toUpperCase();

const formatDate = (dateStr: string | null): string => {
  if (!dateStr) return '—';
  return new Intl.DateTimeFormat('es-CO', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(new Date(dateStr));
};

const formatPrice = (price: number): string =>
  new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(price);

const STATUS_LABELS: Record<LeadStatus, string> = {
  new: 'Nuevo',
  contacted: 'Contactado',
  negotiating: 'En negociación',
  converted: 'Convertido',
  lost: 'Perdido',
};

const STATUS_STYLES: Record<LeadStatus, React.CSSProperties> = {
  new: { backgroundColor: 'var(--habitta-accent-tint)', color: 'var(--habitta-accent)' },
  contacted: { backgroundColor: 'var(--warning-tint)', color: 'var(--warning)' },
  negotiating: { backgroundColor: 'var(--warning-tint)', color: '#D97706' },
  converted: { backgroundColor: 'var(--success-tint)', color: 'var(--success)' },
  lost: { backgroundColor: 'var(--destructive-tint)', color: 'var(--destructive)' },
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

export default async function LeadDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: shortId } = await params;
  const lead = await getLeadByShortId(shortId);

  if (!lead) notFound();

  const isConverted = lead.status === 'converted';
  const isLost = lead.status === 'lost';
  const canConvert = !isConverted && !isLost;

  return (
    <div>
      {/* Breadcrumb */}
      <nav
        className="mb-6 flex items-center gap-2 font-sans text-sm text-muted-foreground"
        aria-label="Breadcrumb"
      >
        <Link href="/dashboard/leads" className="transition-colors hover:text-foreground">
          Leads
        </Link>
        <span aria-hidden="true">/</span>
        <span className="text-foreground">
          {lead.first_name} {lead.last_name}
        </span>
      </nav>

      {/* Grid principal */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* ── Columna izquierda (2/3) ────────────────────────────────────────── */}
        <div className="flex flex-col gap-6 lg:col-span-2">
          {/* Card: Información */}
          <Card className="overflow-hidden">
            <div className="h-1 w-full" style={{ backgroundColor: 'var(--habitta-accent)' }} />
            <CardContent className="p-6">
              {/* Avatar + nombre */}
              <div className="mb-6 flex items-center gap-4">
                <div
                  className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl font-sans text-xl font-bold text-white shadow-sm"
                  style={{ backgroundColor: 'var(--habitta-accent)' }}
                  aria-hidden="true"
                >
                  {getInitials(lead.first_name, lead.last_name)}
                </div>
                <div>
                  <h1 className="font-display text-2xl font-semibold">
                    {lead.first_name} {lead.last_name}
                  </h1>
                  <span
                    className="mt-1 inline-flex items-center rounded-full px-2.5 py-0.5 font-sans text-xs font-semibold"
                    style={STATUS_STYLES[lead.status]}
                  >
                    {STATUS_LABELS[lead.status]}
                  </span>
                </div>
              </div>

              {/* Info rows */}
              <div className="flex flex-col gap-4">
                <InfoRow icon={Mail} label="Email" value={lead.email} />
                <InfoRow icon={Phone} label="Teléfono" value={lead.phone} />
                <InfoRow
                  icon={Calendar}
                  label="Fecha de registro"
                  value={formatDate(lead.created_at)}
                />
                <InfoRow
                  icon={Building2}
                  label="Proyecto de interés"
                  value={
                    lead.project ? `${lead.project.name} — ${lead.project.city}` : null
                  }
                />
                <InfoRow
                  icon={Package}
                  label="Paquete de interés"
                  value={
                    lead.package
                      ? `${lead.package.name} · ${formatPrice(lead.package.price)}`
                      : null
                  }
                />
              </div>
            </CardContent>
          </Card>

          {/* Card: Notas */}
          <Card>
            <CardContent className="p-6">
              <h2 className="mb-4 font-display text-lg font-semibold">Notas</h2>
              <LeadNotesEditor
                leadId={lead.id}
                leadShortId={lead.short_id}
                initialNotes={typeof lead.notes === 'string' ? lead.notes : ''}
              />
            </CardContent>
          </Card>
        </div>

        {/* ── Columna derecha (1/3) ──────────────────────────────────────────── */}
        <div className="flex flex-col gap-6">
          {/* Card: Estado */}
          <Card>
            <CardContent className="p-6">
              <h2 className="mb-5 font-display text-lg font-semibold">Estado del lead</h2>
              <LeadStatusStepper
                leadId={lead.id}
                leadShortId={lead.short_id}
                currentStatus={lead.status}
              />
            </CardContent>
          </Card>

          {/* Card: Acciones */}
          <Card>
            <CardContent className="p-6">
              <h2 className="mb-4 font-display text-lg font-semibold">Acciones</h2>

              {canConvert && (
                <Button
                  asChild
                  className="w-full gap-2 text-white hover:opacity-90"
                  style={{ backgroundColor: 'var(--habitta-accent)' }}
                >
                  <Link href={`/dashboard/leads/${lead.short_id}/convert`}>
                    <UserCheck className="h-4 w-4" />
                    Convertir a cliente
                  </Link>
                </Button>
              )}

              {isConverted && (
                <div className="flex flex-col gap-3">
                  <p className="font-sans text-sm text-muted-foreground">
                    Este lead ya fue convertido a cliente.
                  </p>
                  <Button asChild variant="outline" className="w-full">
                    <Link href="/dashboard/clients">Ver clientes</Link>
                  </Button>
                </div>
              )}

              {isLost && (
                <p className="font-sans text-sm text-muted-foreground">
                  Este lead fue marcado como perdido.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
