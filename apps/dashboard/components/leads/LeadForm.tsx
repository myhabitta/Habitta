'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import type { Project, Package } from '@habitta/types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { createLeadAction } from '@/app/dashboard/leads/actions';

interface LeadFormProps {
  projects: Project[];
}

const formatPrice = (price: number) =>
  new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(price);

const SubmitButton = () => {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      disabled={pending}
      className="gap-2 text-white hover:opacity-90"
      style={{ backgroundColor: 'var(--habitta-accent)' }}
    >
      {pending ? (
        <>
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
          Creando...
        </>
      ) : (
        'Crear lead'
      )}
    </Button>
  );
};

const selectClass =
  'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 font-sans text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50';

const LeadForm = ({ projects }: LeadFormProps) => {
  const [state, formAction] = useFormState(createLeadAction, null);
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [packages, setPackages] = useState<Package[]>([]);
  const [loadingPackages, setLoadingPackages] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);

  const activeProjects = projects.filter((p) => p.status === 'active');

  useEffect(() => {
    if (!selectedProjectId) {
      setPackages([]);
      setSelectedPackage(null);
      return;
    }
    setLoadingPackages(true);
    fetch(`/api/packages?project_id=${selectedProjectId}`)
      .then((res) => res.json())
      .then((data: Package[]) => {
        setPackages(data);
        setSelectedPackage(null);
      })
      .catch(() => setPackages([]))
      .finally(() => setLoadingPackages(false));
  }, [selectedProjectId]);

  const handlePackageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const pkg = packages.find((p) => p.id === e.target.value) ?? null;
    setSelectedPackage(pkg);
  };

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

      {/* Nombre */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="first_name">Nombre *</Label>
          <Input id="first_name" name="first_name" required placeholder="Juan" />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="last_name">Apellido *</Label>
          <Input id="last_name" name="last_name" required placeholder="Pérez" />
        </div>
      </div>

      {/* Contacto */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="email">Email *</Label>
          <Input id="email" name="email" type="email" required placeholder="juan@email.com" />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="phone">Teléfono</Label>
          <Input id="phone" name="phone" type="tel" placeholder="+57 300 000 0000" />
        </div>
      </div>

      {/* Proyecto */}
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="project_id">Proyecto de interés</Label>
        <select
          id="project_id"
          name="project_id"
          className={selectClass}
          value={selectedProjectId}
          onChange={(e) => setSelectedProjectId(e.target.value)}
        >
          <option value="">Sin proyecto</option>
          {activeProjects.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name} — {p.city}
            </option>
          ))}
        </select>
      </div>

      {/* Paquete */}
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="package_id">Paquete de interés</Label>
        <select
          id="package_id"
          name="package_id"
          className={selectClass}
          disabled={!selectedProjectId || loadingPackages}
          onChange={handlePackageChange}
          defaultValue=""
        >
          <option value="">
            {loadingPackages
              ? 'Cargando paquetes...'
              : !selectedProjectId
                ? 'Selecciona un proyecto primero'
                : 'Sin paquete'}
          </option>
          {packages.map((pkg) => (
            <option key={pkg.id} value={pkg.id}>
              {pkg.name} — {formatPrice(pkg.price)}
            </option>
          ))}
        </select>
        {selectedPackage && (
          <p className="font-sans text-xs" style={{ color: 'var(--habitta-accent)' }}>
            Precio: {formatPrice(selectedPackage.price)}
          </p>
        )}
      </div>

      {/* Notas */}
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="notes">Notas</Label>
        <textarea
          id="notes"
          name="notes"
          rows={3}
          placeholder="Observaciones sobre el lead..."
          className="flex min-h-[80px] w-full resize-y rounded-md border border-input bg-background px-3 py-2 font-sans text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        />
      </div>

      {/* Botones */}
      <div className="mt-2 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Button asChild variant="outline">
          <Link href="/leads">Cancelar</Link>
        </Button>
        <SubmitButton />
      </div>
    </form>
  );
};

export default LeadForm;
