'use client';

import { useRouter } from 'next/navigation';
import { Pencil, Trash2 } from 'lucide-react';
import type { ClientWithRelations, ClientStatus } from '@habitta/types';
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
import DeleteConfirmDialog from '@/components/molecules/DeleteConfirmDialog';
import { deleteClientAction } from '@/app/(dashboard)/clients/actions';

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
      <span className="font-sans text-sm font-medium">{DATE_FMT.format(deliveryDate)}</span>
      <Badge variant="outline" style={config.style} className="w-fit text-xs">
        {daysLabel}
      </Badge>
    </div>
  );
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

const getInitials = (firstName: string, lastName: string): string =>
  `${firstName[0] ?? ''}${lastName[0] ?? ''}`.toUpperCase();

const DATE_FMT = new Intl.DateTimeFormat('es-CO', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
});

// Para fechas ISO "YYYY-MM-DD" (date only) usa parse local para evitar desfase UTC
const formatLocalDate = (iso: string | null): string => {
  if (!iso) return '—';
  const parts = iso.split('-').map(Number);
  if (parts.length !== 3) return '—';
  const [y, m, d] = parts as [number, number, number];
  return DATE_FMT.format(new Date(y, m - 1, d));
};

// Para timestamps ISO completos (created_at)
const formatDate = (dateStr: string | null): string => {
  if (!dateStr) return '—';
  return DATE_FMT.format(new Date(dateStr));
};

// ─── ClientsTable ─────────────────────────────────────────────────────────────

interface ClientsTableProps {
  clients: ClientWithRelations[];
}

const ClientsTable = ({ clients }: ClientsTableProps) => {
  const router = useRouter();

  return (
    <div className="overflow-x-auto rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>Contacto</TableHead>
            <TableHead className="hidden md:table-cell">Proyecto</TableHead>
            <TableHead className="hidden lg:table-cell">Apto</TableHead>
            <TableHead className="hidden lg:table-cell">Paquete</TableHead>
            <TableHead>Anticipos</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead className="hidden sm:table-cell">Fecha abono</TableHead>
            <TableHead className="hidden md:table-cell">Entrega</TableHead>
            <TableHead className="w-[60px]" />
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
                  <span className="font-sans text-sm font-medium">
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

              {/* Proyecto */}
              <TableCell className="hidden md:table-cell">
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
              <TableCell className="hidden lg:table-cell">
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
              <TableCell className="hidden lg:table-cell">
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

              {/* Estado */}
              <TableCell>
                <ClientStatusBadge status={client.status} />
              </TableCell>

              {/* Fecha abono */}
              <TableCell className="hidden sm:table-cell">
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
              <TableCell className="hidden md:table-cell">
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
