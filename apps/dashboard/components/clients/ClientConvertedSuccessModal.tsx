'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface ClientConvertedSuccessModalProps {
  openByDefault: boolean;
}

const ClientConvertedSuccessModal = ({ openByDefault }: ClientConvertedSuccessModalProps) => {
  const router = useRouter();
  const [open, setOpen] = useState(openByDefault);

  if (!openByDefault) return null;

  return (
    <AlertDialog open={open}>
      <AlertDialogContent
        onEscapeKeyDown={(event) => event.preventDefault()}
        onPointerDownOutside={(event) => event.preventDefault()}
      >
        <AlertDialogHeader>
          <AlertDialogTitle>Lead convertido a cliente</AlertDialogTitle>
          <AlertDialogDescription>
            La conversión se completó correctamente y el cliente ya aparece en esta sección.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction
            onClick={() => {
              setOpen(false);
              router.replace('/clients');
            }}
          >
            Entendido
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ClientConvertedSuccessModal;
