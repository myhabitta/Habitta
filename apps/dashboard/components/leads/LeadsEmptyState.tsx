import Link from 'next/link';
import { Users } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface LeadsEmptyStateProps {
  hasFilters?: boolean;
}

const LeadsEmptyState = ({ hasFilters = false }: LeadsEmptyStateProps) => (
  <div className="flex flex-col items-center justify-center py-16 text-center">
    <div
      className="mb-4 rounded-2xl p-5"
      style={{ backgroundColor: 'color-mix(in srgb, var(--habitta-accent) 8%, transparent)' }}
    >
      <Users
        className="h-10 w-10"
        style={{ color: 'color-mix(in srgb, var(--habitta-accent) 60%, transparent)' }}
        aria-hidden="true"
      />
    </div>

    <h2 className="font-display text-xl font-semibold">
      {hasFilters ? 'Sin resultados' : 'No hay leads aún'}
    </h2>
    <p className="mt-2 max-w-sm font-sans text-sm text-muted-foreground">
      {hasFilters
        ? 'No se encontraron leads con los filtros aplicados. Prueba con otros criterios.'
        : 'Los leads capturados desde el website aparecerán aquí. También puedes crearlos manualmente.'}
    </p>

    {!hasFilters && (
      <Button
        asChild
        className="mt-6 gap-2 text-white hover:opacity-90"
        style={{ backgroundColor: 'var(--habitta-accent)' }}
      >
        <Link href="/dashboard/leads/new">Crear lead manualmente</Link>
      </Button>
    )}
  </div>
);

export default LeadsEmptyState;
