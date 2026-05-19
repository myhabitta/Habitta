'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Pencil, Check, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { updateClientFieldAction } from '@/app/(dashboard)/clients/actions';

interface ClientInlineEditorProps {
  clientId: string;
  clientShortId: string;
  field: string;
  currentValue: string | null;
  placeholder?: string;
  successMessage?: string;
  emptyLabel?: string;
}

const ClientInlineEditor = ({
  clientId,
  clientShortId,
  field,
  currentValue,
  placeholder = '',
  successMessage = 'Actualizado',
  emptyLabel = 'No registrado',
}: ClientInlineEditorProps) => {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(currentValue ?? '');
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleSave = () => {
    startTransition(async () => {
      const result = await updateClientFieldAction(clientId, clientShortId, field, value.trim());
      if (result) {
        toast.error(result.error);
      } else {
        toast.success(successMessage);
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
          placeholder={placeholder}
          className="h-8 text-sm"
          autoFocus
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSave();
            if (e.key === 'Escape') { setEditing(false); setValue(currentValue ?? ''); }
          }}
        />
        <Button size="icon" variant="ghost" className="h-8 w-8 text-green-600" onClick={handleSave} disabled={isPending}>
          <Check size={14} />
        </Button>
        <Button size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground" onClick={() => { setEditing(false); setValue(currentValue ?? ''); }}>
          <X size={14} />
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <span className="font-sans text-sm font-medium text-foreground">
        {currentValue || <span className="text-muted-foreground">{emptyLabel}</span>}
      </span>
      <Button size="icon" variant="ghost" className="h-7 w-7 text-muted-foreground hover:text-foreground" onClick={() => setEditing(true)}>
        <Pencil size={12} />
      </Button>
    </div>
  );
};

export default ClientInlineEditor;
