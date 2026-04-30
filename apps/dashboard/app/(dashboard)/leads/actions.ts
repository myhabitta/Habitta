'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import {
  updateLead,
  createLead,
  deleteLead,
  convertLeadToClient,
  addClientPayment,
  getPackageById,
} from '@habitta/database';
import type { LeadStatus, CreateLeadInput } from '@habitta/types';

export const updateLeadStatusAction = async (
  id: string,
  shortId: string,
  status: LeadStatus
): Promise<{ error: string } | null> => {
  if (status === 'converted') {
    return {
      error:
        'Para marcar como convertido debes usar "Convertir a cliente". Ese flujo crea el cliente en la base de datos.',
    };
  }

  try {
    await updateLead(id, { status });
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Error al actualizar estado' };
  }
  revalidatePath('/leads');
  revalidatePath(`/leads/${shortId}`);
  return null;
};

export const updateLeadNotesAction = async (
  id: string,
  shortId: string,
  notes: string
): Promise<{ error: string } | null> => {
  try {
    await updateLead(id, { notes });
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Error al guardar notas' };
  }
  revalidatePath(`/leads/${shortId}`);
  return null;
};

export const deleteLeadAction = async (
  id: string
): Promise<{ error?: string }> => {
  try {
    await deleteLead(id);
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Error al eliminar el lead' };
  }
  revalidatePath('/leads');
  return {};
};

export const createLeadAction = async (
  _prevState: { error: string } | null,
  formData: FormData
): Promise<{ error: string } | null> => {
  const phone = (formData.get('phone') as string) || undefined;
  const project_id = (formData.get('project_id') as string) || undefined;
  const package_id = (formData.get('package_id') as string) || undefined;
  const notes = (formData.get('notes') as string) || undefined;

  const data: CreateLeadInput = {
    first_name: formData.get('first_name') as string,
    last_name: formData.get('last_name') as string,
    email: formData.get('email') as string,
    ...(phone ? { phone } : {}),
    ...(project_id ? { project_id } : {}),
    ...(package_id ? { package_id } : {}),
    ...(notes ? { notes } : {}),
  };

  try {
    await createLead(data);
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Error al crear el lead' };
  }

  revalidatePath('/leads');
  redirect('/leads');
};

export const convertLeadAction = async (
  leadId: string,
  leadShortId: string,
  _prevState: { error?: string; success?: boolean; message?: string } | null,
  formData: FormData
): Promise<{ error?: string; success?: boolean; message?: string } | null> => {
  const project_id = formData.get('project_id') as string;
  const package_id = formData.get('package_id') as string;
  const total_amount = parseFloat(formData.get('total_amount') as string);
  const work_start_date = (formData.get('work_start_date') as string) || null;
  const tower = (formData.get('tower') as string)?.trim();
  const apartment_number = (formData.get('apartment_number') as string)?.trim();
  const initialPaymentRaw = ((formData.get('initial_payment') as string) || '').replace(/\./g, '');
  const initial_payment = parseFloat(initialPaymentRaw);

  if (!project_id || !package_id || isNaN(total_amount) || !tower || !apartment_number) {
    return { error: 'Completa todos los campos requeridos' };
  }
  if (isNaN(initial_payment) || initial_payment <= 0) {
    return { error: 'El anticipo inicial es obligatorio y debe ser mayor a cero' };
  }

  try {
    const selectedPackage = await getPackageById(package_id);
    if (!selectedPackage) {
      return { error: 'No se encontró el paquete seleccionado' };
    }

    if (initial_payment > selectedPackage.price) {
      return { error: 'El anticipo no puede superar el valor del paquete' };
    }

    const client = await convertLeadToClient(leadId, {
      project_id,
      package_id,
      total_amount,
      work_start_date,
      tower,
      apartment_number,
    });

    // Crear el primer abono obligatorio
    await addClientPayment({
      client_id: client.id,
      amount: initial_payment,
      paid_at: work_start_date || new Date().toISOString().split('T')[0]!,
      notes: 'Anticipo inicial',
    });
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Error al convertir el lead' };
  }

  revalidatePath('/leads');
  revalidatePath(`/leads/${leadShortId}`);
  revalidatePath('/clients');
  redirect('/clients?converted=1');
};
