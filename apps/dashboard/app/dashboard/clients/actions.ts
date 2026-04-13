'use server';

import { revalidatePath } from 'next/cache';
import { updateClient, addClientPayment } from '@habitta/database';
import type { ClientStatus } from '@habitta/types';

export const updateClientNotesAction = async (
  id: string,
  shortId: string,
  notes: string
): Promise<{ error: string } | null> => {
  try {
    await updateClient(id, { notes });
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Error al guardar notas' };
  }
  revalidatePath(`/dashboard/clients/${shortId}`);
  return null;
};

export const updateClientStatusAction = async (
  id: string,
  shortId: string,
  status: ClientStatus
): Promise<{ error: string } | null> => {
  try {
    await updateClient(id, { status });
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Error al actualizar estado' };
  }
  revalidatePath('/dashboard/clients');
  revalidatePath(`/dashboard/clients/${shortId}`);
  return null;
};

export const updateClientWorkStartDateAction = async (
  id: string,
  shortId: string,
  workStartDate: string | null
): Promise<{ error: string } | null> => {
  try {
    await updateClient(id, { work_start_date: workStartDate });
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Error al actualizar fecha de inicio' };
  }
  revalidatePath('/dashboard/clients');
  revalidatePath(`/dashboard/clients/${shortId}`);
  return null;
};

export const addClientPaymentAction = async (
  clientId: string,
  clientShortId: string,
  amount: number,
  paidAt: string,
  notes: string | null,
  totalAmount: number
): Promise<{ error?: string }> => {
  if (amount <= 0) {
    return { error: 'El monto debe ser mayor a cero' };
  }
  if (amount > totalAmount) {
    return { error: 'El monto supera el total acordado con el cliente' };
  }
  try {
    await addClientPayment({ client_id: clientId, amount, paid_at: paidAt, notes });
    revalidatePath(`/dashboard/clients/${clientShortId}`);
    revalidatePath('/dashboard/clients');
    return {};
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Error desconocido' };
  }
};
