'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
} from '@/components/ui/alert-dialog';

interface DeleteConfirmDialogProps {
  entityName: string;
  entityType: 'lead' | 'cliente';
  onConfirm: () => Promise<{ error?: string } | null | void>;
  redirectTo?: string | undefined;
  trigger?: React.ReactNode;
  variant?: 'icon' | 'button';
}

const DeleteConfirmDialog = ({
  entityName,
  entityType,
  onConfirm,
  redirectTo,
  trigger,
  variant = 'icon',
}: DeleteConfirmDialogProps) => {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleConfirm = () => {
    startTransition(async () => {
      const result = await onConfirm();
      if (result && 'error' in result && result.error) {
        toast.error(result.error);
        setOpen(false);
      } else {
        toast.success(`${entityType === 'lead' ? 'Lead' : 'Cliente'} eliminado correctamente`);
        setOpen(false);
        if (redirectTo) {
          router.push(redirectTo);
        } else {
          router.refresh();
        }
      }
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      {trigger ? (
        <div onClick={() => setOpen(true)}>{trigger}</div>
      ) : variant === 'icon' ? (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setOpen(true)}
          aria-label={`Eliminar ${entityType} ${entityName}`}
          className="text-muted-foreground hover:text-destructive"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      ) : (
        <Button
          variant="destructive"
          onClick={() => setOpen(true)}
          className="w-full gap-2"
        >
          <Trash2 className="h-4 w-4" />
          Eliminar {entityType}
        </Button>
      )}

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="font-display">
            Eliminar {entityType}
          </AlertDialogTitle>
          <AlertDialogDescription className="font-sans">
            ¿Estás seguro de eliminar {entityType === 'lead' ? 'el lead' : 'el cliente'}{' '}
            <span className="font-semibold text-foreground">{entityName}</span>? Esta acción no
            se puede deshacer.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancelar</AlertDialogCancel>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={isPending}
          >
            {isPending ? 'Eliminando...' : 'Eliminar'}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteConfirmDialog;
