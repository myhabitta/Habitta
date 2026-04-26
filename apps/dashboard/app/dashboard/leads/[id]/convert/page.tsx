import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import { UserCheck } from 'lucide-react';
import { getLeadByShortId, getProjects } from '@habitta/database';
import { Card, CardContent } from '@/components/ui/card';
import ConvertLeadForm from '@/components/leads/ConvertLeadForm';

const formatPrice = (price: number) =>
  new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(price);

export default async function ConvertLeadPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: shortId } = await params;
  const [lead, projects] = await Promise.all([getLeadByShortId(shortId), getProjects()]);

  if (!lead) notFound();
  if (lead.status === 'converted') redirect('/clients');

  return (
    <div>
      <nav className="mb-6 flex items-center gap-2 font-sans text-sm text-muted-foreground">
        <Link href="/leads" className="transition-colors hover:text-foreground">
          Leads
        </Link>
        <span>/</span>
        <Link
          href={`/leads/${lead.short_id}`}
          className="transition-colors hover:text-foreground"
        >
          {lead.first_name} {lead.last_name}
        </Link>
        <span>/</span>
        <span className="text-foreground">Convertir</span>
      </nav>

      <div className="mx-auto max-w-xl">
        <Card className="overflow-hidden">
          <div className="h-1.5 w-full" style={{ backgroundColor: 'var(--habitta-accent)' }} />
          <CardContent className="p-6">
            {/* Header */}
            <div className="mb-6 flex flex-col items-center text-center">
              <div
                className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl"
                style={{ backgroundColor: 'var(--habitta-accent-tint)' }}
              >
                <UserCheck className="h-7 w-7" style={{ color: 'var(--habitta-accent)' }} />
              </div>
              <h1 className="font-display text-2xl font-semibold">Convertir a Cliente</h1>
              <p className="mt-1 font-sans text-sm text-muted-foreground">
                Estás por convertir a{' '}
                <span className="font-semibold text-foreground">
                  {lead.first_name} {lead.last_name}
                </span>{' '}
                en cliente
              </p>
            </div>

            {/* Resumen del lead */}
            <div className="mb-6 rounded-lg p-4" style={{ backgroundColor: 'var(--muted)' }}>
              <p className="mb-2 font-sans text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Datos del lead
              </p>
              <div className="flex flex-col gap-1">
                <p className="font-sans text-sm">{lead.email}</p>
                {lead.phone && (
                  <p className="font-sans text-sm text-muted-foreground">{lead.phone}</p>
                )}
                {lead.project && (
                  <p className="font-sans text-sm text-muted-foreground">
                    Proyecto: {lead.project.name}
                  </p>
                )}
                {lead.package && (
                  <p className="font-sans text-sm text-muted-foreground">
                    Paquete: {lead.package.name} · {formatPrice(lead.package.price)}
                  </p>
                )}
              </div>
            </div>

            {/* Formulario */}
            <ConvertLeadForm lead={lead} projects={projects} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
