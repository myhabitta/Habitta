'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Pencil, Trash2, PackageCheck, PackageX } from 'lucide-react';
import type { ClientWithRelations, ClientStatus, ConstructionPhase } from '@habitta/types';
import { PHASE_SHORT_LABELS, PHASE_COLORS } from '@habitta/types';
import { formatPrice, calculateDelivery } from '@habitta/utils';
import type { DeliveryStatus } from '@habitta/utils';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import DeleteConfirmDialog from '@/components/molecules/DeleteConfirmDialog';
import { deleteClientAction, toggleDeliveryAction } from '@/app/(dashboard)/clients/actions';

// ─── ClientStatusBadge ────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<ClientStatus, { label: string; style: React.CSSProperties }> = {
  pendiente: {
    label: 'Pendiente',
    style: {
      backgroundColor: 'var(--warning-tint)',
      color: 'var(--warning)',
      border: 'transparent',
    },
  },
  en_proceso: {
    label: 'En proceso',
    style: {
      backgroundColor: 'var(--habitta-accent-tint)',
      color: 'var(--habitta-accent)',
      border: 'transparent',
    },
  },
  completado: {
    label: 'Completado',
    style: {
      backgroundColor: 'var(--success-tint)',
      color: 'var(--success)',
      border: 'transparent',
    },
  },
};

const ClientStatusBadge = ({ status }: { status: ClientStatus }) => {
  const config = STATUS_CONFIG[status] ?? STATUS_CONFIG.pendiente;
  return (
    <Badge variant="outline" style={config.style}>
      {config.label}
    </Badge>
  );
};

// ─── ConstructionPhaseBadge ───────────────────────────────────────────────────

const ConstructionPhaseBadge = ({
  phase,
  deliveredAt,
  clientId,
  clientShortId,
  totalAmount,
  totalPaid,
}: {
  phase: ConstructionPhase;
  deliveredAt: string | null;
  clientId: string;
  clientShortId: string;
  totalAmount: number;
  totalPaid: number;
}) => {
  const colors = PHASE_COLORS[phase] ?? PHASE_COLORS[0];
  const [loading, setLoading] = useState(false);
  const [debtDialogOpen, setDebtDialogOpen] = useState(false);

  const handleToggleDelivery = async (e: React.MouseEvent) => {
    e.stopPropagation();

    // Si se intenta marcar como entregado y hay saldo pendiente, mostrar dialog
    if (!deliveredAt && totalPaid < totalAmount) {
      setDebtDialogOpen(true);
      return;
    }

    setLoading(true);
    await toggleDeliveryAction(clientId, clientShortId, !deliveredAt);
    setLoading(false);
  };

  const pendingBalance = totalAmount - totalPaid;

  return (
    <div className="flex flex-col gap-1">
      <Badge
        variant="outline"
        style={{ backgroundColor: colors.bg, color: colors.text, border: 'transparent' }}
      >
        {PHASE_SHORT_LABELS[phase]}
      </Badge>
      {phase === 5 && (
        <>
          <button
            onClick={handleToggleDelivery}
            disabled={loading}
            className="flex items-center gap-1 whitespace-nowrap rounded-md px-1.5 py-0.5 font-sans text-[10px] font-medium transition-colors hover:bg-muted disabled:opacity-50"
            style={{ color: deliveredAt ? 'var(--success)' : 'var(--muted-foreground)' }}
            title={deliveredAt ? 'Marcar como no entregado' : 'Marcar como entregado'}
          >
            {deliveredAt ? (
              <PackageCheck className="h-3.5 w-3.5" />
            ) : (
              <PackageX className="h-3.5 w-3.5" />
            )}
            {deliveredAt ? 'Entregado' : 'Sin entregar'}
          </button>
          {deliveredAt && (
            <span className="font-sans text-[11px] text-muted-foreground">
              {formatDate(deliveredAt)}
            </span>
          )}

          {/* Dialog de deuda pendiente */}
          <Dialog open={debtDialogOpen} onOpenChange={setDebtDialogOpen}>
            <DialogContent onClick={(e) => e.stopPropagation()}>
              <DialogHeader>
                <DialogTitle>No se puede entregar el apartamento</DialogTitle>
                <DialogDescription>
                  El cliente tiene un saldo pendiente de{' '}
                  <span className="font-semibold text-foreground">
                    {formatPrice(pendingBalance)}
                  </span>
                  . El anticipo debe cubrir el 100% del valor del paquete antes de la entrega.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline" onClick={() => setDebtDialogOpen(false)}>
                  Entendido
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </>
      )}
    </div>
  );
};

// ─── DeliveryBadge ────────────────────────────────────────────────────────────

const DELIVERY_CONFIG: Record<DeliveryStatus, { style: React.CSSProperties }> = {
  sin_fecha: {
    style: { backgroundColor: 'var(--muted)', color: 'var(--muted-foreground)', border: 'transparent' },
  },
  en_tiempo: {
    style: { backgroundColor: 'var(--success-tint)', color: 'var(--success)', border: 'transparent' },
  },
  urgente: {
    style: { backgroundColor: 'var(--warning-tint)', color: 'var(--warning)', border: 'transparent' },
  },
  vencido: {
    style: { backgroundColor: 'hsl(0 80% 95%)', color: 'hsl(0 70% 45%)', border: 'transparent' },
  },
};

interface DeliveryBadgeProps {
  workStartDate: string | null;
  deliveryDays: number;
}

const DeliveryBadge = ({ workStartDate, deliveryDays }: DeliveryBadgeProps) => {
  const { daysRemaining, status } = calculateDelivery(workStartDate, deliveryDays);
  const config = DELIVERY_CONFIG[status];

  const { deliveryDate } = calculateDelivery(workStartDate, deliveryDays);

  if (status === 'sin_fecha' || !deliveryDate) {
    return (
      <span className="font-sans text-sm text-muted-foreground">—</span>
    );
  }

  const daysLabel =
    status === 'vencido'
      ? `Vencido hace ${Math.abs(daysRemaining!)}d`
      : daysRemaining === 0
        ? 'Entrega hoy'
        : `Faltan ${daysRemaining} días`;

  return (
    <div className="flex flex-col gap-0.5">
      <span className="font-sans text-xs font-medium">{formatDDMMMYYYY(deliveryDate)}</span>
      <Badge variant="outline" style={config.style} className="w-fit text-xs">
        {daysLabel}
      </Badge>
    </div>
  );
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

const getInitials = (firstName: string, lastName: string): string =>
  `${firstName[0] ?? ''}${lastName[0] ?? ''}`.toUpperCase();

const formatDDMMMYYYY = (date: Date): string => {
  const dd = String(date.getDate()).padStart(2, '0');
  const mmm = date.toLocaleString('es-CO', { month: 'short' }).replace('.', '');
  const yyyy = date.getFullYear();
  return `${dd}/${mmm}/${yyyy}`;
};

// Para fechas ISO "YYYY-MM-DD" (date only) usa parse local para evitar desfase UTC
const formatLocalDate = (iso: string | null): string => {
  if (!iso) return '—';
  const parts = iso.split('-').map(Number);
  if (parts.length !== 3) return '—';
  const [y, m, d] = parts as [number, number, number];
  return formatDDMMMYYYY(new Date(y, m - 1, d));
};

// Para timestamps ISO completos (created_at)
const formatDate = (dateStr: string | null): string => {
  if (!dateStr) return '—';
  return formatDDMMMYYYY(new Date(dateStr));
};

// ─── ClientsTable ─────────────────────────────────────────────────────────────

interface ClientsTableProps {
  clients: ClientWithRelations[];
}

const ClientsTable = ({ clients }: ClientsTableProps) => {
  const router = useRouter();

  return (
    <div className="overflow-x-auto rounded-lg border">
      <Table className="min-w-[1320px]">
        <TableHeader>
          <TableRow>
            <TableHead className="min-w-[160px]">Nombre</TableHead>
            <TableHead className="min-w-[180px]">Contacto</TableHead>
            <TableHead className="min-w-[120px]">Cédula</TableHead>
            <TableHead className="min-w-[140px]">Proyecto</TableHead>
            <TableHead className="min-w-[100px]">Apto</TableHead>
            <TableHead className="min-w-[130px]">Paquete</TableHead>
            <TableHead className="min-w-[130px]">Anticipos</TableHead>
            <TableHead className="min-w-[110px]">Fase</TableHead>
            <TableHead className="min-w-[120px]">Fecha abono</TableHead>
            <TableHead className="min-w-[140px]">Entrega</TableHead>
            <TableHead className="w-[70px]" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {clients.map((client) => (
            <TableRow
              key={client.id}
              className="hover:bg-muted/50"
            >
              {/* Nombre con avatar */}
              <TableCell>
                <div className="flex items-center gap-2.5">
                  <div
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full font-sans text-xs font-semibold text-white"
                    style={{ backgroundColor: 'var(--success)' }}
                    aria-hidden="true"
                  >
                    {getInitials(client.first_name, client.last_name)}
                  </div>
                  <span className="font-sans text-xs font-medium">
                    {client.first_name} {client.last_name}
                  </span>
                </div>
              </TableCell>

              {/* Email y teléfono */}
              <TableCell>
                <div className="flex flex-col">
                  <span className="font-sans text-sm font-medium">{client.email}</span>
                  {client.phone && (
                    <span className="font-sans text-xs text-muted-foreground">{client.phone}</span>
                  )}
                </div>
              </TableCell>

              {/* Cédula */}
              <TableCell>
                <span className="font-sans text-sm">
                  {client.cedula ?? <span className="text-muted-foreground">—</span>}
                </span>
              </TableCell>

              {/* Proyecto */}
              <TableCell>
                {client.project ? (
                  <div className="flex flex-col">
                    <span className="font-sans text-sm">{client.project.name}</span>
                    <span className="font-sans text-xs text-muted-foreground">
                      {client.project.city}
                    </span>
                  </div>
                ) : (
                  <span className="font-sans text-sm text-muted-foreground">Sin proyecto</span>
                )}
              </TableCell>

              {/* Unidad */}
              <TableCell>
                {client.tower || client.apartment_number ? (
                  <div className="flex flex-col">
                    {client.tower && (
                      <span className="font-sans text-sm">Torre {client.tower}</span>
                    )}
                    {client.apartment_number && (
                      <span className="font-sans text-xs text-muted-foreground">
                        Apto {client.apartment_number}
                      </span>
                    )}
                  </div>
                ) : (
                  <span className="font-sans text-sm text-muted-foreground">—</span>
                )}
              </TableCell>

              {/* Paquete */}
              <TableCell>
                {client.package ? (
                  <div className="flex flex-col">
                    <span className="font-sans text-sm">{client.package.name}</span>
                    <span className="font-sans text-xs text-muted-foreground">
                      {formatPrice(client.package.price)}
                    </span>
                  </div>
                ) : (
                  <span className="font-sans text-sm text-muted-foreground">Sin paquete</span>
                )}
              </TableCell>

              {/* Anticipos */}
              <TableCell>
                {(() => {
                  const totalPaid =
                    client.payments?.reduce((sum, p) => sum + Number(p.amount), 0) ?? 0;
                  const remaining = (client.total_amount ?? 0) - totalPaid;
                  return (
                    <div className="flex flex-col">
                      <span className="font-sans text-sm font-semibold">
                        {formatPrice(totalPaid)}
                      </span>
                      {remaining > 0 ? (
                        <span className="font-sans text-xs text-muted-foreground">
                          Falta {formatPrice(remaining)}
                        </span>
                      ) : (
                        <span
                          className="font-sans text-xs font-medium"
                          style={{ color: 'var(--success)' }}
                        >
                          Completo
                        </span>
                      )}
                    </div>
                  );
                })()}
              </TableCell>

              {/* Fase de construcción */}
              <TableCell>
                {(() => {
                  const paidTotal =
                    client.payments?.reduce((sum, p) => sum + Number(p.amount), 0) ?? 0;
                  return (
                    <ConstructionPhaseBadge
                      phase={client.construction_phase}
                      deliveredAt={client.delivered_at}
                      clientId={client.id}
                      clientShortId={client.short_id}
                      totalAmount={client.total_amount ?? 0}
                      totalPaid={paidTotal}
                    />
                  );
                })()}
              </TableCell>

              {/* Fecha abono */}
              <TableCell>
                {client.payments && client.payments.length > 0 ? (
                  <div className="flex flex-col gap-0.5">
                    {client.payments
                      .slice()
                      .sort((a, b) => a.paid_at.localeCompare(b.paid_at))
                      .map((p, i) => (
                        <span
                          key={p.id}
                          className={`font-sans text-xs ${i === 0 ? 'text-sm font-medium' : 'text-muted-foreground'}`}
                        >
                          {formatLocalDate(p.paid_at)}
                        </span>
                      ))}
                  </div>
                ) : (
                  <span className="font-sans text-xs text-muted-foreground">Sin abonos</span>
                )}
              </TableCell>

              {/* Entrega */}
              <TableCell>
                <DeliveryBadge
                  workStartDate={client.work_start_date}
                  deliveryDays={client.package?.delivery_days ?? 45}
                />
              </TableCell>

              {/* Acciones */}
              <TableCell>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-1.5"
                    onClick={() => router.push(`/clients/${client.short_id}`)}
                    aria-label={`Editar cliente ${client.first_name} ${client.last_name}`}
                  >
                    <Pencil className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline text-xs">Editar</span>
                  </Button>
                  <DeleteConfirmDialog
                    entityName={`${client.first_name} ${client.last_name}`}
                    entityType="cliente"
                    onConfirm={() => deleteClientAction(client.id)}
                  />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ClientsTable;
