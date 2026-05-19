'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { updateClientInfoAction } from '@/app/(dashboard)/clients/actions';

interface ClientEditModalProps {
  clientId: string;
  clientShortId: string;
  initialData: {
    first_name: string;
    last_name: string;
    email: string;
    phone: string | null;
    cedula: string | null;
    tower: string | null;
    apartment_number: string | null;
  };
}

const ClientEditModal = ({ clientId, clientShortId, initialData }: ClientEditModalProps) => {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const [form, setForm] = useState({
    first_name: initialData.first_name,
    last_name: initialData.last_name,
    email: initialData.email,
    phone: initialData.phone ?? '',
    cedula: initialData.cedula ?? '',
    tower: initialData.tower ?? '',
    apartment_number: initialData.apartment_number ?? '',
  });

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    startTransition(async () => {
      const result = await updateClientInfoAction(clientId, clientShortId, form);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(result.success);
        setOpen(false);
        router.refresh();
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1.5">
          <Pencil className="h-3.5 w-3.5" />
          Editar
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display text-lg">Editar información</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4 pt-2">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="first_name" className="font-sans text-xs">Nombre</Label>
              <Input
                id="first_name"
                value={form.first_name}
                onChange={(e) => handleChange('first_name', e.target.value)}
                placeholder="Nombre"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="last_name" className="font-sans text-xs">Apellido</Label>
              <Input
                id="last_name"
                value={form.last_name}
                onChange={(e) => handleChange('last_name', e.target.value)}
                placeholder="Apellido"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="email" className="font-sans text-xs">Email</Label>
            <Input
              id="email"
              type="email"
              value={form.email}
              onChange={(e) => handleChange('email', e.target.value)}
              placeholder="correo@ejemplo.com"
              disabled
            />
            <p className="font-sans text-[10px] text-muted-foreground">El email no se puede modificar</p>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="phone" className="font-sans text-xs">Teléfono</Label>
            <Input
              id="phone"
              value={form.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              placeholder="Ej: 3001234567"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="cedula" className="font-sans text-xs">Cédula</Label>
            <Input
              id="cedula"
              value={form.cedula}
              onChange={(e) => handleChange('cedula', e.target.value)}
              placeholder="Número de cédula"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="tower" className="font-sans text-xs">Torre</Label>
              <Input
                id="tower"
                value={form.tower}
                onChange={(e) => handleChange('tower', e.target.value)}
                placeholder="Ej: 1"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="apartment_number" className="font-sans text-xs">Apartamento</Label>
              <Input
                id="apartment_number"
                value={form.apartment_number}
                onChange={(e) => handleChange('apartment_number', e.target.value)}
                placeholder="Ej: 301"
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col-reverse gap-3 pt-4 sm:flex-row sm:justify-end">
          <Button variant="outline" onClick={() => setOpen(false)} disabled={isPending}>
            Cancelar
          </Button>
          <Button
            onClick={handleSave}
            disabled={isPending}
            className="text-white"
            style={{ backgroundColor: 'var(--habitta-accent)' }}
          >
            {isPending ? 'Guardando...' : 'Guardar cambios'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ClientEditModal;
