'use client';

import { useState, useTransition } from 'react';
import { updateClientNotesAction } from '@/app/(dashboard)/clients/actions';
import { Button } from '@/components/ui/button';

interface ClientNotesEditorProps {
  clientId: string;
  clientShortId: string;
  initialNotes: string;
}

const ClientNotesEditor = ({ clientId, clientShortId, initialNotes }: ClientNotesEditorProps) => {
  const [notes, setNotes] = useState(initialNotes);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const hasChanges = notes !== initialNotes;

  const handleSave = () => {
    setError(null);
    startTransition(async () => {
      const result = await updateClientNotesAction(clientId, clientShortId, notes);
      if (result?.error) {
        setError(result.error);
      } else {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      }
    });
  };

  return (
    <div className="flex flex-col gap-3">
      <textarea
        value={notes}
        onChange={(e) => {
          setNotes(e.target.value);
          setSaved(false);
        }}
        rows={5}
        placeholder="Agrega notas sobre este cliente..."
        className="w-full resize-y rounded-md border border-input bg-background px-3 py-2 font-sans text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      />

      {error && (
        <p className="font-sans text-xs" style={{ color: 'var(--destructive)' }}>
          {error}
        </p>
      )}

      <div className="flex items-center justify-end gap-3">
        {saved && (
          <span className="font-sans text-xs" style={{ color: 'var(--success)' }}>
            Guardado ✓
          </span>
        )}
        <Button
          onClick={handleSave}
          disabled={!hasChanges || isPending}
          size="sm"
          style={
            hasChanges
              ? {
                  backgroundColor: 'var(--habitta-accent)',
                  color: 'var(--habitta-accent-foreground)',
                }
              : undefined
          }
          variant={hasChanges ? 'default' : 'outline'}
        >
          {isPending ? 'Guardando...' : 'Guardar notas'}
        </Button>
      </div>
    </div>
  );
};

export default ClientNotesEditor;
