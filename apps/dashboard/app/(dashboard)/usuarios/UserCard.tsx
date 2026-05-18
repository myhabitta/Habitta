'use client';

import { useActionState, useState, useTransition } from 'react';
import { useFormStatus } from 'react-dom';
import { Trash2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { changePasswordAction, updateProfileAction, deleteUserAction } from './actions';

interface UserCardProps {
  user: {
    id: string;
    email: string;
    full_name: string;
    role: 'super_admin' | 'admin' | 'user';
  };
  currentUserId: string;
}

type ActionState = { error: string } | { success: string } | null;

const SubmitButton = ({ label }: { label: string }) => {
  const { pending } = useFormStatus();
  return (
    <Button className="text-white" type="submit" size="sm" disabled={pending}>
      {pending ? 'Guardando...' : label}
    </Button>
  );
};

const UserCard = ({ user, currentUserId }: UserCardProps) => {
  const [profileState, profileAction] = useActionState<ActionState, FormData>(
    updateProfileAction,
    null
  );
  const [passwordState, passwordAction] = useActionState<ActionState, FormData>(
    changePasswordAction,
    null
  );
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const isSelf = user.id === currentUserId;

  const handleDelete = () => {
    startTransition(async () => {
      const result = await deleteUserAction(user.id);
      if (result && 'error' in result) {
        setDeleteError(result.error);
      }
    });
  };

  return (
    <div className="rounded-lg border border-border bg-card p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="font-medium text-foreground">{user.full_name || 'Sin nombre'}</p>
          <p className="text-sm text-muted-foreground">{user.email}</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>{user.role}</Badge>
          {!isSelf && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive">
                  <Trash2 size={15} />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Eliminar usuario</AlertDialogTitle>
                  <AlertDialogDescription>
                    ¿Estás seguro de eliminar a <strong>{user.full_name || user.email}</strong>? Esta acción no se puede deshacer.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                {deleteError && (
                  <p className="text-sm text-destructive">{deleteError}</p>
                )}
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDelete}
                    disabled={isPending}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    {isPending ? 'Eliminando...' : 'Eliminar'}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      </div>

      {/* Edit profile */}
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
              <option value="super_admin">Super Admin</option>
              <option value="admin">Admin</option>
              <option value="user">Usuario</option>
            </select>
          </div>
        </div>
        {profileState && 'error' in profileState && (
          <p className="text-xs text-destructive">{profileState.error}</p>
        )}
        {profileState && 'success' in profileState && (
          <p className="text-xs text-green-600 dark:text-green-400">{profileState.success}</p>
        )}
        <SubmitButton label="Guardar perfil" />
      </form>

      {/* Change password */}
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
        {passwordState && 'error' in passwordState && (
          <p className="text-xs text-destructive">{passwordState.error}</p>
        )}
        {passwordState && 'success' in passwordState && (
          <p className="text-xs text-green-600 dark:text-green-400">{passwordState.success}</p>
        )}
        <SubmitButton label="Cambiar contraseña" />
      </form>
    </div>
  );
};

export default UserCard;
