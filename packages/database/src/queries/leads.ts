import type {
  Lead,
  LeadWithRelations,
  LeadStatus,
  CreateLeadInput,
  UpdateLeadInput,
  ConvertLeadInput,
  Client,
} from '@habitta/types';

import { createServerClient } from '../client';

export const getLeads = async (filters?: {
  status?: LeadStatus;
  project_id?: string;
}): Promise<LeadWithRelations[]> => {
  const supabase = createServerClient();

  try {
    let query = supabase
      .from('leads')
      .select('*, project:projects(id, name, city), package:packages(id, name, price)')
      .neq('status', 'converted')
      .order('created_at', { ascending: false });

    if (filters?.status) {
      query = query.eq('status', filters.status);
    }
    if (filters?.project_id) {
      query = query.eq('project_id', filters.project_id);
    }

    const { data, error } = await query;

    if (error) throw new Error(error.message);
    return (data as LeadWithRelations[]) ?? [];
  } catch (err) {
    if (err instanceof Error) throw err;
    throw new Error('getLeads: error desconocido');
  }
};

export const getLead = async (id: string): Promise<LeadWithRelations | null> => {
  const supabase = createServerClient();

  const { data, error } = await supabase
    .from('leads')
    .select('*, project:projects(id, name, city), package:packages(id, name, price)')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw new Error(error.message);
  }

  return data as LeadWithRelations;
};

export const getLeadByShortId = async (shortId: string): Promise<LeadWithRelations | null> => {
  const supabase = createServerClient();

  const { data, error } = await supabase
    .from('leads')
    .select('*, project:projects(id, name, city), package:packages(id, name, price)')
    .eq('short_id', shortId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw new Error(error.message);
  }

  return data as LeadWithRelations;
};

export const createLead = async (input: CreateLeadInput): Promise<Lead> => {
  const supabase = createServerClient();

  const { data, error } = await supabase
    .from('leads')
    .insert({
      ...input,
      status: 'new',
    } as never)
    .select()
    .single();

  if (error) throw new Error(error.message);
  if (!data) throw new Error('No se pudo crear el lead');

  return data as Lead;
};

export const updateLead = async (id: string, input: UpdateLeadInput): Promise<Lead> => {
  const supabase = createServerClient();

  const { data, error } = await supabase
    .from('leads')
    .update(input as never)
    .eq('id', id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  if (!data) throw new Error('No se pudo actualizar el lead');

  return data as Lead;
};

export const convertLeadToClient = async (
  leadId: string,
  input: ConvertLeadInput
): Promise<Client> => {
  const { createAdminClient } = await import('../client');
  const supabase = createAdminClient();

  // Paso 1: obtener datos del lead
  const { data: lead, error: leadError } = await supabase
    .from('leads')
    .select('*')
    .eq('id', leadId)
    .single();

  if (leadError || !lead) {
    throw new Error('Lead no encontrado');
  }

  const typedLead = lead as Lead;

  // Si por datos históricos ya existe cliente ligado al lead, evitar duplicados.
  const { data: existingClient, error: existingClientError } = await supabase
    .from('clients')
    .select('*')
    .eq('lead_id', leadId)
    .maybeSingle();

  if (existingClientError) {
    throw new Error(`Error validando cliente existente: ${existingClientError.message}`);
  }

  if (existingClient) {
    const { error: deleteLeadError } = await supabase.from('leads').delete().eq('id', leadId);
    if (deleteLeadError) {
      throw new Error(`No se pudo limpiar el lead convertido: ${deleteLeadError.message}`);
    }
    return existingClient as Client;
  }

  // Paso 2: crear el cliente
  const { data: client, error: clientError } = await supabase
    .from('clients')
    .insert({
      first_name: typedLead.first_name,
      last_name: typedLead.last_name,
      email: typedLead.email,
      phone: typedLead.phone,
      project_id: input.project_id,
      package_id: input.package_id,
      total_amount: input.total_amount,
      tower: input.tower,
      apartment_number: input.apartment_number,
      work_start_date: input.work_start_date ?? null,
      lead_id: leadId,
      status: 'pendiente',
    } as never)
    .select()
    .single();

  if (clientError || !client) {
    throw new Error(`Error al crear el cliente: ${clientError?.message ?? 'desconocido'}`);
  }

  // Paso 3: eliminar el lead (flujo requerido: sale de leads y pasa a clients)
  const { error: deleteLeadError } = await supabase.from('leads').delete().eq('id', leadId);

  if (deleteLeadError) {
    // Evitar inconsistencia: si no se pudo borrar el lead, revertimos el cliente creado.
    await supabase.from('clients').delete().eq('id', (client as Client).id);
    throw new Error(`No se pudo eliminar el lead convertido: ${deleteLeadError.message}`);
  }

  return client as Client;
};

export const deleteLead = async (id: string): Promise<void> => {
  const { createAdminClient } = await import('../client');
  const supabase = createAdminClient();

  const { error } = await supabase.from('leads').delete().eq('id', id);

  if (error) throw new Error(`deleteLead: ${error.message}`);
};

export const getLeadStats = async (): Promise<{
  total: number;
  new: number;
  contacted: number;
  negotiating: number;
  converted: number;
  lost: number;
  thisWeek: number;
}> => {
  const supabase = createServerClient();

  try {
    const { data, error } = await supabase.from('leads').select('status, created_at');

    if (error) throw new Error(error.message);

    const leads = (data ?? []) as Pick<Lead, 'status' | 'created_at'>[];
    const hace7dias = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    return {
      total: leads.length,
      new: leads.filter((l) => l.status === 'new').length,
      contacted: leads.filter((l) => l.status === 'contacted').length,
      negotiating: leads.filter((l) => l.status === 'negotiating').length,
      converted: leads.filter((l) => l.status === 'converted').length,
      lost: leads.filter((l) => l.status === 'lost').length,
      thisWeek: leads.filter((l) => new Date(l.created_at ?? '') >= hace7dias).length,
    };
  } catch (err) {
    if (err instanceof Error) throw err;
    throw new Error('getLeadStats: error desconocido');
  }
};
