'use client';

import { useState, useActionState, useEffect, useRef } from 'react';
import { useFormStatus } from 'react-dom';
import { useRouter } from 'next/navigation';
import { Plus, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { createUserAction } from './actions';

type ActionState = { error: string } | { success: string } | null;

const SubmitButton = () => {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full text-white" disabled={pending}>
      {pending ? 'Creando...' : 'Crear usuario'}
    </Button>
  );
};

const CreateUserDialog = () => {
  const [open, setOpen] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [state, action] = useActionState<ActionState, FormData>(createUserAction, null);
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state && 'success' in state) {
      setShowSuccess(true);
      router.refresh();
      const timer = setTimeout(() => {
        setOpen(false);
        setShowSuccess(false);
      }, 2500);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [state, router]);

  // Reset form when dialog opens
  const handleOpenChange = (v: boolean) => {
    setOpen(v);
    if (v) {
      setShowSuccess(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="text-white">
          <Plus size={16} className="mr-2" />
          Nuevo usuario
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        {showSuccess ? (
          <div className="flex flex-col items-center gap-4 py-8">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
              <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
            <div className="text-center">
              <p className="font-display text-lg font-semibold text-foreground">
                Usuario creado
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                {state && 'success' in state ? state.success : ''}
              </p>
            </div>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="font-display">Crear nuevo usuario</DialogTitle>
              <DialogDescription>
                El usuario podrá acceder al dashboard con estas credenciales.
              </DialogDescription>
            </DialogHeader>

            <form ref={formRef} action={action} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="create-name">Nombre completo</Label>
                <Input id="create-name" name="full_name" placeholder="Juan Pérez" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="create-email">Correo electrónico</Label>
                <Input
                  id="create-email"
                  name="email"
                  type="email"
                  placeholder="juan@habitta.co"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="create-password">Contraseña</Label>
                <Input
                  id="create-password"
                  name="password"
                  type="password"
                  placeholder="Mínimo 6 caracteres"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="create-role">Rol</Label>
                <select
                  id="create-role"
                  name="role"
                  defaultValue="user"
                  className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                  <option value="user">Lead</option>
                  <option value="admin">Manager</option>
                  <option value="super_admin">Super Admin</option>
                </select>
              </div>

              {state && 'error' in state && (
                <p className="text-sm text-destructive">{state.error}</p>
              )}

              <SubmitButton />
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CreateUserDialog;
