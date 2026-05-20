'use server';

import { revalidatePath } from 'next/cache';
import { updateClient, deleteClient, addClientPayment, updateClientPhase, getClient } from '@habitta/database';
import type { ClientStatus, ConstructionPhase } from '@habitta/types';
import { PHASE_LABELS } from '@habitta/types';
import { sendNotification } from '@habitta/utils';
import { renderEmail, PhaseUpdateEmail, DeliveryEmail, DELIVERY_SUBJECT } from '@habitta/email';

export const deleteClientAction = async (
  id: string
): Promise<{ error?: string }> => {
  try {
    await deleteClient(id);
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Error al eliminar el cliente' };
  }
  revalidatePath('/clients');
  return {};
};

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
  revalidatePath(`/clients/${shortId}`);
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
  revalidatePath('/clients');
  revalidatePath(`/clients/${shortId}`);
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
  revalidatePath('/clients');
  revalidatePath(`/clients/${shortId}`);
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
    revalidatePath(`/clients/${clientShortId}`);
    revalidatePath('/clients');
    return {};
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Error desconocido' };
  }
};

const EDITABLE_FIELDS = new Set(['first_name', 'last_name', 'phone', 'cedula', 'tower', 'apartment_number']);

export const updateClientInfoAction = async (
  id: string,
  shortId: string,
  data: {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    cedula: string;
    tower: string;
    apartment_number: string;
  }
): Promise<{ error?: string; success?: string }> => {
  if (!data.first_name.trim() || !data.last_name.trim()) {
    return { error: 'Nombre y apellido son obligatorios' };
  }
  if (!data.email.trim()) {
    return { error: 'El email es obligatorio' };
  }

  try {
    await updateClient(id, {
      first_name: data.first_name.trim(),
      last_name: data.last_name.trim(),
      phone: data.phone.trim() || null,
      cedula: data.cedula.trim() || null,
      tower: data.tower.trim() || null,
      apartment_number: data.apartment_number.trim() || null,
    } as never);
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Error al actualizar' };
  }
  revalidatePath('/clients');
  revalidatePath(`/clients/${shortId}`);
  return { success: 'Información actualizada' };
};

export const updateClientFieldAction = async (
  id: string,
  shortId: string,
  field: string,
  value: string
): Promise<{ error: string } | null> => {
  if (!EDITABLE_FIELDS.has(field)) return { error: 'Campo no permitido' };
  const REQUIRED_FIELDS = new Set(['first_name', 'last_name']);
  if (REQUIRED_FIELDS.has(field) && !value) return { error: 'Este campo no puede estar vacío' };
  try {
    const dbValue = value || (REQUIRED_FIELDS.has(field) ? value : null);
    await updateClient(id, { [field]: dbValue } as never);
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Error al actualizar' };
  }
  revalidatePath('/clients');
  revalidatePath(`/clients/${shortId}`);
  return null;
};

export const updateClientCedulaAction = async (
  id: string,
  shortId: string,
  cedula: string
): Promise<{ error: string } | null> => {
  if (!cedula.trim()) return { error: 'La cédula no puede estar vacía' };
  try {
    await updateClient(id, { cedula: cedula.trim() });
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Error al actualizar cédula' };
  }
  revalidatePath('/clients');
  revalidatePath(`/clients/${shortId}`);
  return null;
};

export const toggleDeliveryAction = async (
  clientId: string,
  clientShortId: string,
  isDelivered: boolean
): Promise<{ error?: string; success?: string }> => {
  try {
    await updateClient(clientId, {
      delivered_at: isDelivered ? new Date().toISOString() : null,
    });

    // Send delivery email when marking as delivered
    if (isDelivered) {
      const client = await getClient(clientId);
      if (client) {
        const websiteUrl = process.env.NEXT_PUBLIC_WEBSITE_URL ?? 'https://myhabitta.co';
        const portalUrl = `${websiteUrl}/portal/${client.cedula ?? client.portal_slug}`;

        renderEmail(
          DeliveryEmail({
            clientName: `${client.first_name} ${client.last_name}`,
            projectName: client.project.name,
            packageName: client.package?.name ?? '',
            apartmentNumber: client.apartment_number ?? undefined,
            portalUrl,
          })
        ).then((html) =>
          sendNotification({
            type: 'email',
            clientId: client.id,
            template: 'delivery',
            data: {
              to: client.email,
              subject: DELIVERY_SUBJECT,
              html,
            },
          })
        ).catch((err) => {
          console.error('[delivery-email] Error:', err);
        });
      }
    }

    revalidatePath('/clients');
    revalidatePath(`/clients/${clientShortId}`);
    return { success: isDelivered ? 'Apartamento marcado como entregado' : 'Entrega desmarcada' };
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Error al actualizar entrega' };
  }
};

export const updateConstructionPhaseAction = async (
  clientId: string,
  clientShortId: string,
  phase: ConstructionPhase
): Promise<{ error?: string; success?: string }> => {
  if (phase < 0 || phase > 5) {
    return { error: 'Fase inválida' };
  }

  try {
    const updatedClient = await updateClientPhase(clientId, phase);

    // Get full client for email data
    const client = await getClient(clientId);
    if (client) {
      const websiteUrl = process.env.NEXT_PUBLIC_WEBSITE_URL ?? 'https://myhabitta.co';
      const portalUrl = `${websiteUrl}/portal/${client.cedula ?? client.portal_slug}`;

      try {
        console.log('[phase-email] Rendering email for:', client.email);
        const html = await renderEmail(
          PhaseUpdateEmail({
            clientName: `${client.first_name} ${client.last_name}`,
            projectName: client.project.name,
            packageName: client.package?.name ?? '',
            phaseName: PHASE_LABELS[phase],
            phaseNumber: phase,
            portalUrl,
          })
        );
        console.log('[phase-email] HTML rendered, sending...');
        const result = await sendNotification({
          type: 'email',
          clientId: client.id,
          template: 'phase_update',
          data: {
            to: client.email,
            subject: `Tu apartamento avanzó a: ${PHASE_LABELS[phase]}`,
            html,
          },
        });
        console.log('[phase-email] Result:', result);
      } catch (err) {
        console.error('[phase-email] Error:', err);
      }
    } else {
      console.error('[phase-email] Client not found:', clientId);
    }

    revalidatePath('/clients');
    revalidatePath(`/clients/${clientShortId}`);
    return { success: `Fase actualizada. Se notificó a ${updatedClient.first_name} por correo.` };
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Error al actualizar fase' };
  }
};
