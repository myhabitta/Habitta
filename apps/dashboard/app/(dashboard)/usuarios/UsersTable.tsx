'use client';

import { useState, useActionState, useTransition, useEffect } from 'react';
import { useFormStatus } from 'react-dom';
import { useRouter } from 'next/navigation';
import { Pencil, Trash2, KeyRound, Shield, ShieldCheck, User, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { changePasswordAction, updateProfileAction, deleteUserAction } from './actions';

// ─── Types ──────────────────────────────────────────────────────────────────────

interface UserRow {
  id: string;
  email: string;
  full_name: string;
  role: 'super_admin' | 'admin' | 'user';
  created_at: string | null;
}

interface UsersTableProps {
  users: UserRow[];
  currentUserId: string;
}

type ActionState = { error: string } | { success: string } | null;

// ─── Helpers ────────────────────────────────────────────────────────────────────

const ROLE_CONFIG = {
  super_admin: { label: 'Super Admin', icon: Shield, variant: 'outline' as const, bg: '#F8C4C4', text: '#9B1C1C', className: '' },
  admin: { label: 'Manager', icon: ShieldCheck, variant: 'outline' as const, bg: '#A5D8FF', text: '#1864AB', className: '' },
  user: { label: 'Lead', icon: User, variant: 'outline' as const, bg: '#B9FBC0', text: '#2B6E30', className: '' },
};

const getInitials = (name: string, email: string) => {
  if (name) {
    const parts = name.trim().split(' ').filter(Boolean);
    if (parts.length >= 2) return ((parts[0]?.[0] ?? '') + (parts[1]?.[0] ?? '')).toUpperCase();
    return name.slice(0, 2).toUpperCase();
  }
  return email.slice(0, 2).toUpperCase();
};

// ─── Submit Button ──────────────────────────────────────────────────────────────

const SubmitBtn = ({ label, loadingLabel }: { label: string; loadingLabel: string }) => {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full text-white" disabled={pending}>
      {pending ? loadingLabel : label}
    </Button>
  );
};

// ─── Edit Profile Dialog ────────────────────────────────────────────────────────

const EditDialog = ({ user, open, onClose }: { user: UserRow; open: boolean; onClose: () => void }) => {
  const [state, action] = useActionState<ActionState, FormData>(updateProfileAction, null);
  const [showSuccess, setShowSuccess] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (state && 'success' in state) {
      setShowSuccess(true);
      router.refresh();
      const t = setTimeout(() => { onClose(); setShowSuccess(false); }, 2000);
      return () => clearTimeout(t);
    }
    return undefined;
  }, [state, router, onClose]);

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-md">
        {showSuccess ? (
          <div className="flex flex-col items-center gap-4 py-8">
            <CheckCircle2 className="h-10 w-10 text-green-600 dark:text-green-400" />
            <p className="font-display text-lg font-semibold">Perfil actualizado</p>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="font-display">Editar usuario</DialogTitle>
              <DialogDescription>{user.email}</DialogDescription>
            </DialogHeader>
            <form action={action} className="space-y-4">
              <input type="hidden" name="userId" value={user.id} />
              <div className="space-y-2">
                <Label>Nombre completo</Label>
                <Input name="full_name" defaultValue={user.full_name} required />
              </div>
              <div className="space-y-2">
                <Label>Rol</Label>
                <select
                  name="role"
                  defaultValue={user.role}
                  className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                  <option value="super_admin">Super Admin</option>
                  <option value="admin">Manager</option>
                  <option value="user">Lead</option>
                </select>
              </div>
              {state && 'error' in state && <p className="text-sm text-destructive">{state.error}</p>}
              <SubmitBtn label="Guardar cambios" loadingLabel="Guardando..." />
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

// ─── Change Password Dialog ─────────────────────────────────────────────────────

const PasswordDialog = ({ user, open, onClose }: { user: UserRow; open: boolean; onClose: () => void }) => {
  const [state, action] = useActionState<ActionState, FormData>(changePasswordAction, null);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (state && 'success' in state) {
      setShowSuccess(true);
      const t = setTimeout(() => { onClose(); setShowSuccess(false); }, 2000);
      return () => clearTimeout(t);
    }
    return undefined;
  }, [state, onClose]);

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-md">
        {showSuccess ? (
          <div className="flex flex-col items-center gap-4 py-8">
            <CheckCircle2 className="h-10 w-10 text-green-600 dark:text-green-400" />
            <p className="font-display text-lg font-semibold">Contraseña actualizada</p>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="font-display">Cambiar contraseña</DialogTitle>
              <DialogDescription>{user.full_name || user.email}</DialogDescription>
            </DialogHeader>
            <form action={action} className="space-y-4">
              <input type="hidden" name="userId" value={user.id} />
              <div className="space-y-2">
                <Label>Nueva contraseña</Label>
                <Input name="password" type="password" placeholder="Mínimo 6 caracteres" required />
              </div>
              <div className="space-y-2">
                <Label>Confirmar contraseña</Label>
                <Input name="confirmPassword" type="password" placeholder="Repetir contraseña" required />
              </div>
              {state && 'error' in state && <p className="text-sm text-destructive">{state.error}</p>}
              <SubmitBtn label="Cambiar contraseña" loadingLabel="Cambiando..." />
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

// ─── Delete Confirm Dialog ──────────────────────────────────────────────────────

const DeleteDialog = ({ user, open, onClose }: { user: UserRow; open: boolean; onClose: () => void }) => {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleDelete = () => {
    startTransition(async () => {
      const result = await deleteUserAction(user.id);
      if (result && 'error' in result) {
        setError(result.error);
      } else {
        router.refresh();
        onClose();
      }
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={(v) => !v && onClose()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Eliminar usuario</AlertDialogTitle>
          <AlertDialogDescription>
            ¿Estás seguro de eliminar a <strong>{user.full_name || user.email}</strong>? Esta acción no se puede deshacer.
          </AlertDialogDescription>
        </AlertDialogHeader>
        {error && <p className="text-sm text-destructive">{error}</p>}
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
  );
};

// ─── Main Table ─────────────────────────────────────────────────────────────────

const UsersTable = ({ users, currentUserId }: UsersTableProps) => {
  const [editUser, setEditUser] = useState<UserRow | null>(null);
  const [passwordUser, setPasswordUser] = useState<UserRow | null>(null);
  const [deleteUser, setDeleteUser] = useState<UserRow | null>(null);

  return (
    <>
      <TooltipProvider delayDuration={200}>
        <div className="overflow-x-auto rounded-lg border border-border">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-[280px]">Usuario</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Rol</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => {
                const role = ROLE_CONFIG[user.role];
                const isSelf = user.id === currentUserId;
                const RoleIcon = role.icon;

                return (
                  <TableRow key={user.id}>
                    {/* User info */}
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div
                          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold"
                          style={{ backgroundColor: role.bg, color: role.text }}
                        >
                          {getInitials(user.full_name, user.email)}
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-foreground">
                            {user.full_name || 'Sin nombre'}
                          </p>
                          {isSelf && (
                            <span className="text-[10px] font-medium text-muted-foreground">(Tú)</span>
                          )}
                        </div>
                      </div>
                    </TableCell>

                    {/* Email */}
                    <TableCell>
                      <span className="text-sm text-muted-foreground">{user.email}</span>
                    </TableCell>

                    {/* Role badge */}
                    <TableCell>
                      <Badge
                        variant={role.variant}
                        className="gap-1 border-transparent font-medium"
                        style={{ backgroundColor: role.bg, color: role.text }}
                      >
                        <RoleIcon size={12} />
                        {role.label}
                      </Badge>
                    </TableCell>

                    {/* Actions — icon buttons */}
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-muted-foreground hover:text-foreground"
                              onClick={() => setEditUser(user)}
                            >
                              <Pencil size={14} />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Editar perfil</TooltipContent>
                        </Tooltip>

                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-muted-foreground hover:text-foreground"
                              onClick={() => setPasswordUser(user)}
                            >
                              <KeyRound size={14} />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Cambiar contraseña</TooltipContent>
                        </Tooltip>

                        {!isSelf && (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                onClick={() => setDeleteUser(user)}
                              >
                                <Trash2 size={14} />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Eliminar usuario</TooltipContent>
                          </Tooltip>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}

              {users.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="h-32 text-center text-muted-foreground">
                    No hay usuarios registrados.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </TooltipProvider>

      {/* Dialogs */}
      {editUser && (
        <EditDialog user={editUser} open={!!editUser} onClose={() => setEditUser(null)} />
      )}
      {passwordUser && (
        <PasswordDialog user={passwordUser} open={!!passwordUser} onClose={() => setPasswordUser(null)} />
      )}
      {deleteUser && (
        <DeleteDialog user={deleteUser} open={!!deleteUser} onClose={() => setDeleteUser(null)} />
      )}
    </>
  );
};

export default UsersTable;
