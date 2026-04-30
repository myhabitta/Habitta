'use client';

import DeleteConfirmDialog from '@/components/molecules/DeleteConfirmDialog';
import { deleteClientAction } from '@/app/(dashboard)/clients/actions';

interface DeleteClientButtonProps {
  clientId: string;
  clientName: string;
  variant?: 'icon' | 'button';
}

const DeleteClientButton = ({ clientId, clientName, variant = 'icon' }: DeleteClientButtonProps) => {
  const props = {
    entityName: clientName,
    entityType: 'cliente' as const,
    onConfirm: () => deleteClientAction(clientId),
    variant,
    ...(variant === 'button' ? { redirectTo: '/clients' } : {}),
  };

  return <DeleteConfirmDialog {...props} />;
};

export default DeleteClientButton;
