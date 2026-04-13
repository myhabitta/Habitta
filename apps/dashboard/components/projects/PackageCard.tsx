'use client';

import Link from 'next/link';
import { Check, Pencil } from 'lucide-react';
import type { Package } from '@habitta/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface PackageCardProps {
  pkg: Package;
  projectSlug: string;
}

const formatPrice = (price: number): string =>
  new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(price);

const PackageCard = ({ pkg, projectSlug }: PackageCardProps) => {
  const features = pkg.features ?? [];
  const isActive = pkg.status === 'active';

  return (
    <Card
      className="group relative flex flex-col overflow-hidden transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
      style={{
        borderColor: isActive ? 'var(--habitta-accent-tint)' : undefined,
      }}
    >
      {/* Barra superior de color */}
      <div
        className="h-1 w-full"
        style={{
          backgroundColor: isActive ? 'var(--habitta-accent)' : 'var(--border)',
        }}
      />

      <CardContent className="flex flex-1 flex-col p-6">
        {/* Status + editar */}
        <div className="mb-4 flex items-start justify-between gap-2">
          <div>
            <span
              className="inline-flex items-center rounded-full px-2 py-0.5 font-sans text-[11px] font-semibold"
              style={
                isActive
                  ? {
                      backgroundColor: 'var(--success-tint)',
                      color: 'var(--success)',
                    }
                  : {
                      backgroundColor: 'var(--muted)',
                      color: 'var(--muted-foreground)',
                    }
              }
            >
              {isActive ? 'Activo' : 'Inactivo'}
            </span>
          </div>
          <Link
            href={`/dashboard/projects/${projectSlug}/packages/${pkg.slug}/edit`}
            className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground opacity-0 transition-all hover:bg-muted hover:text-foreground group-hover:opacity-100"
            aria-label={`Editar ${pkg.name}`}
          >
            <Pencil className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* Nombre del paquete */}
        <h3 className="font-display text-xl font-semibold leading-tight">
          {pkg.name}
        </h3>

        {/* Precio */}
        <div className="mt-3 flex items-baseline gap-1">
          <span
            className="font-sans text-3xl font-bold tracking-tight"
            style={{ color: 'var(--habitta-accent)' }}
          >
            {formatPrice(pkg.price)}
          </span>
        </div>

        {/* Descripcion */}
        {pkg.description && (
          <p className="mt-2 font-sans text-sm leading-relaxed text-muted-foreground">
            {pkg.description}
          </p>
        )}

        {/* Divider */}
        {features.length > 0 && (
          <div className="my-4 border-t border-border" />
        )}

        {/* Features */}
        {features.length > 0 && (
          <ul className="flex flex-1 flex-col gap-2.5">
            {features.map((feature, i) => (
              <li key={i} className="flex items-start gap-2.5 font-sans text-sm">
                <span
                  className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full"
                  style={{
                    backgroundColor: 'var(--habitta-accent-tint)',
                  }}
                >
                  <Check
                    className="h-2.5 w-2.5"
                    style={{ color: 'var(--habitta-accent)' }}
                    aria-hidden="true"
                  />
                </span>
                <span className="leading-tight text-foreground/80">{feature}</span>
              </li>
            ))}
          </ul>
        )}

        {/* Footer — boton editar visible en mobile */}
        <div className="mt-6 md:hidden">
          <Button asChild variant="outline" size="sm" className="w-full gap-2">
            <Link href={`/dashboard/projects/${projectSlug}/packages/${pkg.slug}/edit`}>
              <Pencil className="h-3.5 w-3.5" />
              Editar paquete
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PackageCard;
