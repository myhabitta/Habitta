import Link from 'next/link';
import { UserCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ClientsEmptyStateProps {
  hasFilters?: boolean;
}

const ClientsEmptyState = ({ hasFilters = false }: ClientsEmptyStateProps) => (
  <div className="flex flex-col items-center justify-center py-16 text-center">
    <UserCheck
      className="h-16 w-16"
      style={{ color: 'var(--habitta-accent)', opacity: 0.3 }}
      aria-hidden="true"
    />

    <h2 className="mt-4 font-display text-xl font-semibold">
      {hasFilters ? 'No hay clientes con ese filtro' : 'No hay clientes aún'}
    </h2>
    <p className="mt-1 max-w-xs font-sans text-sm text-muted-foreground">
      {hasFilters
        ? 'Prueba con otro proyecto o elimina el filtro para ver todos los clientes.'
        : 'Los leads convertidos aparecerán aquí.'}
    </p>

    <Button
      asChild
      className="mt-6 text-white hover:opacity-90"
      style={{ backgroundColor: 'var(--habitta-accent)' }}
    >
      {hasFilters ? (
        <Link href="/clients">Ver todos</Link>
      ) : (
        <Link href="/leads">Ver leads</Link>
      )}
    </Button>
  </div>
);

export default ClientsEmptyState;
