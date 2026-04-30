'use client';

import { useRouter } from 'next/navigation';
import { Eye, Trash2 } from 'lucide-react';
import type { LeadWithRelations, LeadStatus } from '@habitta/types';
import { formatPrice } from '@habitta/utils';
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
import { deleteLeadAction } from '@/app/(dashboard)/leads/actions';

// ─── LeadStatusBadge ──────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<LeadStatus, { label: string; style: React.CSSProperties }> = {
  new: {
    label: 'Nuevo',
    style: { backgroundColor: 'var(--habitta-accent-tint)', color: 'var(--habitta-accent)', border: 'transparent' },
  },
  contacted: {
    label: 'Contactado',
    style: { backgroundColor: 'var(--warning-tint)', color: 'var(--warning)', border: 'transparent' },
  },
  negotiating: {
    label: 'En negociación',
    style: { backgroundColor: 'var(--warning-tint)', color: '#D97706', border: 'transparent' },
  },
  converted: {
    label: 'Convertido',
    style: { backgroundColor: 'var(--success-tint)', color: 'var(--success)', border: 'transparent' },
  },
  lost: {
    label: 'Perdido',
    style: { backgroundColor: 'var(--destructive-tint)', color: 'var(--destructive)', border: 'transparent' },
  },
};

const LeadStatusBadge = ({ status }: { status: LeadStatus }) => {
  const config = STATUS_CONFIG[status] ?? STATUS_CONFIG.new;
  return (
    <Badge variant="outline" style={config.style}>
      {config.label}
    </Badge>
  );
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

const getInitials = (firstName: string, lastName: string): string =>
  `${firstName[0] ?? ''}${lastName[0] ?? ''}`.toUpperCase();

const formatDate = (dateStr: string | null): string => {
  if (!dateStr) return '—';
  return new Intl.DateTimeFormat('es-CO', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(dateStr));
};

// ─── LeadsTable ───────────────────────────────────────────────────────────────

interface LeadsTableProps {
  leads: LeadWithRelations[];
}

const LeadsTable = ({ leads }: LeadsTableProps) => {
  const router = useRouter();

  return (
    <div className="overflow-x-auto rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>Contacto</TableHead>
            <TableHead className="hidden md:table-cell">Proyecto</TableHead>
            <TableHead className="hidden lg:table-cell">Paquete</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead className="hidden sm:table-cell">Fecha</TableHead>
            <TableHead className="w-[60px]" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {leads.map((lead) => (
            <TableRow
              key={lead.id}
              className="cursor-pointer hover:bg-muted/50"
              onClick={() => router.push(`/leads/${lead.short_id}`)}
            >
              {/* Nombre con avatar */}
              <TableCell>
                <div className="flex items-center gap-2.5">
                  <div
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full font-sans text-xs font-semibold text-white"
                    style={{ backgroundColor: 'var(--habitta-accent)' }}
                    aria-hidden="true"
                  >
                    {getInitials(lead.first_name, lead.last_name)}
                  </div>
                  <span className="font-sans text-sm font-medium">
                    {lead.first_name} {lead.last_name}
                  </span>
                </div>
              </TableCell>

              {/* Email y teléfono */}
              <TableCell>
                <div className="flex flex-col">
                  <span className="font-sans text-sm font-medium">{lead.email}</span>
                  {lead.phone && (
                    <span className="font-sans text-xs text-muted-foreground">{lead.phone}</span>
                  )}
                </div>
              </TableCell>

              {/* Proyecto */}
              <TableCell className="hidden md:table-cell">
                {lead.project ? (
                  <span className="font-sans text-sm">{lead.project.name}</span>
                ) : (
                  <span className="font-sans text-sm text-muted-foreground">Sin proyecto</span>
                )}
              </TableCell>

              {/* Paquete */}
              <TableCell className="hidden lg:table-cell">
                {lead.package ? (
                  <div className="flex flex-col">
                    <span className="font-sans text-sm">{lead.package.name}</span>
                    <span className="font-sans text-xs text-muted-foreground">
                      {formatPrice(lead.package.price)}
                    </span>
                  </div>
                ) : (
                  <span className="font-sans text-sm text-muted-foreground">Sin paquete</span>
                )}
              </TableCell>

              {/* Status */}
              <TableCell>
                <LeadStatusBadge status={lead.status} />
              </TableCell>

              {/* Fecha */}
              <TableCell className="hidden sm:table-cell">
                <span className="font-sans text-sm text-muted-foreground">
                  {formatDate(lead.created_at)}
                </span>
              </TableCell>

              {/* Acciones */}
              <TableCell onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => router.push(`/leads/${lead.short_id}`)}
                    aria-label={`Ver lead ${lead.first_name} ${lead.last_name}`}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <DeleteConfirmDialog
                    entityName={`${lead.first_name} ${lead.last_name}`}
                    entityType="lead"
                    onConfirm={() => deleteLeadAction(lead.id)}
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

export default LeadsTable;
