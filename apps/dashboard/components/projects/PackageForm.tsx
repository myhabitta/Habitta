'use client';

import { useFormState, useFormStatus } from 'react-dom';
import Link from 'next/link';
import type { Package } from '@habitta/types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

interface PackageFormProps {
  pkg?: Package;
  action: (
    prevState: { error: string } | null,
    formData: FormData
  ) => Promise<{ error: string } | null>;
  cancelHref: string;
}

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
          Guardando...
        </>
      ) : (
        'Guardar paquete'
      )}
    </Button>
  );
};

const PackageForm = ({ pkg, action, cancelHref }: PackageFormProps) => {
  const [state, formAction] = useFormState(action, null);

  const featuresDefault = pkg?.features ? pkg.features.join('\n') : '';

  return (
    <form action={formAction} className="flex flex-col gap-5">
      {/* Error global */}
      {state?.error && (
        <div className="rounded-md bg-destructive/10 p-3 font-sans text-sm text-destructive">
          {state.error}
        </div>
      )}

      {/* Nombre */}
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="name">Nombre del paquete *</Label>
        <Input
          id="name"
          name="name"
          required
          defaultValue={pkg?.name ?? ''}
          placeholder="Ej: Paquete Premium"
        />
      </div>

      {/* Descripción */}
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="description">Descripción</Label>
        <textarea
          id="description"
          name="description"
          rows={3}
          defaultValue={pkg?.description ?? ''}
          placeholder="Descripción opcional del paquete..."
          className="flex min-h-[80px] w-full resize-y rounded-md border border-input bg-background px-3 py-2 font-sans text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        />
      </div>

      {/* Precio */}
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="price">Precio *</Label>
        <Input
          id="price"
          name="price"
          type="number"
          required
          min={0}
          step={1000000}
          defaultValue={pkg?.price ?? ''}
          placeholder="Ej: 220000000"
        />
        <p className="font-sans text-xs text-muted-foreground">Precio en pesos colombianos (COP)</p>
      </div>

      {/* Características */}
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="features">Características</Label>
        <textarea
          id="features"
          name="features"
          rows={5}
          defaultValue={featuresDefault}
          placeholder={'Pisos en porcelanato\nCocina integral\nClosets incluidos'}
          className="flex min-h-[80px] w-full resize-y rounded-md border border-input bg-background px-3 py-2 font-sans text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        />
        <p className="font-sans text-xs text-muted-foreground">
          Una característica por línea o separadas por coma
        </p>
      </div>

      {/* Estado */}
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="status">Estado</Label>
        <select
          id="status"
          name="status"
          defaultValue={pkg?.status ?? 'active'}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 font-sans text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <option value="active">Activo</option>
          <option value="inactive">Inactivo</option>
        </select>
      </div>

      {/* Botones */}
      <div className="mt-2 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Button asChild variant="outline">
          <Link href={cancelHref}>Cancelar</Link>
        </Button>
        <SubmitButton />
      </div>
    </form>
  );
};

export default PackageForm;
