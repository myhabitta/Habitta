'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { changePasswordAction, updateProfileAction } from './actions';

interface UserCardProps {
  user: {
    id: string;
    email: string;
    full_name: string;
    role: 'admin' | 'sales';
  };
}

type ActionState = { error: string } | { success: string } | null;

const SubmitButton = ({ label }: { label: string }) => {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="sm" disabled={pending}>
      {pending ? 'Guardando...' : label}
    </Button>
  );
};

const UserCard = ({ user }: UserCardProps) => {
  const [profileState, profileAction] = useActionState<ActionState, FormData>(
    updateProfileAction,
    null
  );
  const [passwordState, passwordAction] = useActionState<ActionState, FormData>(
    changePasswordAction,
    null
  );

  return (
    <div className="rounded-lg border border-border bg-card p-6 space-y-6">
      {/* Header del usuario */}
      <div className="flex items-center justify-between">
        <div>
          <p className="font-medium text-foreground">{user.full_name || 'Sin nombre'}</p>
          <p className="text-sm text-muted-foreground">{user.email}</p>
        </div>
        <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
          {user.role}
        </Badge>
      </div>

      {/* Editar perfil */}
      <form action={profileAction} className="space-y-3">
        <input type="hidden" name="userId" value={user.id} />
        <p className="text-sm font-medium text-foreground">Editar perfil</p>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <Label htmlFor={`name-${user.id}`} className="text-xs">
              Nombre completo
            </Label>
            <Input
              id={`name-${user.id}`}
              name="full_name"
              defaultValue={user.full_name}
              placeholder="Nombre"
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor={`role-${user.id}`} className="text-xs">
              Rol
            </Label>
            <select
              id={`role-${user.id}`}
              name="role"
              defaultValue={user.role}
              className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              <option value="admin">admin</option>
              <option value="sales">sales</option>
            </select>
          </div>
        </div>
        {'error' in (profileState ?? {}) && (
          <p className="text-xs text-destructive">
            {(profileState as { error: string }).error}
          </p>
        )}
        {'success' in (profileState ?? {}) && (
          <p className="text-xs text-green-600 dark:text-green-400">
            {(profileState as { success: string }).success}
          </p>
        )}
        <SubmitButton label="Guardar perfil" />
      </form>

      {/* Cambiar contraseña */}
      <form action={passwordAction} className="space-y-3 border-t border-border pt-4">
        <input type="hidden" name="userId" value={user.id} />
        <p className="text-sm font-medium text-foreground">Cambiar contraseña</p>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <Label htmlFor={`pass-${user.id}`} className="text-xs">
              Nueva contraseña
            </Label>
            <Input
              id={`pass-${user.id}`}
              name="password"
              type="password"
              placeholder="Mínimo 6 caracteres"
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor={`confirm-${user.id}`} className="text-xs">
              Confirmar contraseña
            </Label>
            <Input
              id={`confirm-${user.id}`}
              name="confirmPassword"
              type="password"
              placeholder="Repetir contraseña"
            />
          </div>
        </div>
        {'error' in (passwordState ?? {}) && (
          <p className="text-xs text-destructive">
            {(passwordState as { error: string }).error}
          </p>
        )}
        {'success' in (passwordState ?? {}) && (
          <p className="text-xs text-green-600 dark:text-green-400">
            {(passwordState as { success: string }).success}
          </p>
        )}
        <SubmitButton label="Cambiar contraseña" />
      </form>
    </div>
  );
};

export default UserCard;
