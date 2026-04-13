'use client';

import { useFormState, useFormStatus } from 'react-dom';
import Link from 'next/link';
import type { Project } from '@habitta/types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

interface ProjectFormProps {
  project?: Project;
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
        'Guardar proyecto'
      )}
    </Button>
  );
};

const ProjectForm = ({ project, action, cancelHref }: ProjectFormProps) => {
  const [state, formAction] = useFormState(action, null);

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
        <Label htmlFor="name">Nombre del proyecto *</Label>
        <Input
          id="name"
          name="name"
          required
          defaultValue={project?.name ?? ''}
          placeholder="Ej: Moré Bello"
        />
      </div>

      {/* Ciudad y departamento en grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="city">Ciudad *</Label>
          <Input
            id="city"
            name="city"
            required
            defaultValue={project?.city ?? ''}
            placeholder="Ej: Medellín"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="department">Departamento *</Label>
          <Input
            id="department"
            name="department"
            required
            defaultValue={project?.department ?? ''}
            placeholder="Ej: Antioquia"
          />
        </div>
      </div>

      {/* Descripción */}
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="description">Descripción</Label>
        <textarea
          id="description"
          name="description"
          rows={4}
          defaultValue={project?.description ?? ''}
          placeholder="Describe el proyecto brevemente..."
          className="flex min-h-[80px] w-full resize-y rounded-md border border-input bg-background px-3 py-2 font-sans text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        />
      </div>

      {/* Estado */}
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="status">Estado</Label>
        <select
          id="status"
          name="status"
          defaultValue={project?.status ?? 'active'}
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

export default ProjectForm;
