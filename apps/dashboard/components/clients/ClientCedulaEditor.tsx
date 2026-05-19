'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Pencil, Check, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { updateClientCedulaAction } from '@/app/(dashboard)/clients/actions';

interface ClientCedulaEditorProps {
  clientId: string;
  clientShortId: string;
  currentCedula: string | null;
}

const ClientCedulaEditor = ({ clientId, clientShortId, currentCedula }: ClientCedulaEditorProps) => {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(currentCedula ?? '');
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleSave = () => {
    startTransition(async () => {
      const result = await updateClientCedulaAction(clientId, clientShortId, value);
      if (result) {
        toast.error(result.error);
      } else {
        toast.success('Cédula actualizada');
        setEditing(false);
        router.refresh();
      }
    });
  };

  if (editing) {
    return (
      <div className="flex items-center gap-2">
        <Input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Número de cédula"
          className="h-8 text-sm"
          autoFocus
        />
        <Button size="icon" variant="ghost" className="h-8 w-8 text-green-600" onClick={handleSave} disabled={isPending}>
          <Check size={14} />
        </Button>
        <Button size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground" onClick={() => { setEditing(false); setValue(currentCedula ?? ''); }}>
          <X size={14} />
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <span className="font-sans text-sm font-medium text-foreground">
        {currentCedula || <span className="text-muted-foreground">No registrada</span>}
      </span>
      <Button size="icon" variant="ghost" className="h-7 w-7 text-muted-foreground hover:text-foreground" onClick={() => setEditing(true)}>
        <Pencil size={12} />
      </Button>
    </div>
  );
};

export default ClientCedulaEditor;
