'use client';

import DeleteConfirmDialog from '@/components/molecules/DeleteConfirmDialog';
import { deleteLeadAction } from '@/app/(dashboard)/leads/actions';

interface DeleteLeadButtonProps {
  leadId: string;
  leadName: string;
  variant?: 'icon' | 'button';
}

const DeleteLeadButton = ({ leadId, leadName, variant = 'icon' }: DeleteLeadButtonProps) => {
  const props = {
    entityName: leadName,
    entityType: 'lead' as const,
    onConfirm: () => deleteLeadAction(leadId),
    variant,
    ...(variant === 'button' ? { redirectTo: '/leads' } : {}),
  };

  return <DeleteConfirmDialog {...props} />;
};

export default DeleteLeadButton;
