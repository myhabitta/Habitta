import type { Client, ClientStats, ClientWithRelations, UpdateClientInput, ConstructionPhase } from '@habitta/types';

import { createServerClient, createAdminClient } from '../client';

type ClientFilters = {
  project_id?: string;
};

export const getClients = async (filters?: ClientFilters): Promise<ClientWithRelations[]> => {
  const supabase = createServerClient();
  let query = supabase
    .from('clients')
    .select(
      '*, project:projects(id, name, city), package:packages(id, name, price, delivery_days), lead:leads(id, short_id, notes), payments:client_payments(id, amount, paid_at, notes, created_at)'
    )
    .order('created_at', { ascending: false });

  if (filters?.project_id) query = query.eq('project_id', filters.project_id);

  const { data, error } = await query;
  if (error) throw new Error(`getClients: ${error.message}`);
  return (data as ClientWithRelations[]) ?? [];
};

export const getClient = async (id: string): Promise<ClientWithRelations | null> => {
  const supabase = createServerClient();

  const { data, error } = await supabase
    .from('clients')
    .select(
      '*, project:projects(id, name, city), package:packages(id, name, price, delivery_days), lead:leads(id, short_id, notes), payments:client_payments(id, amount, paid_at, notes, created_at)'
    )
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw new Error(`getClient: ${error.message}`);
  }

  return data as ClientWithRelations;
};

export const getClientByShortId = async (shortId: string): Promise<ClientWithRelations | null> => {
  const supabase = createServerClient();

  const { data, error } = await supabase
    .from('clients')
    .select(
      '*, project:projects(id, name, city), package:packages(id, name, price, delivery_days), lead:leads(id, short_id, notes), payments:client_payments(id, amount, paid_at, notes, created_at)'
    )
    .eq('short_id', shortId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw new Error(`getClientByShortId: ${error.message}`);
  }

  return data as ClientWithRelations;
};

export const updateClient = async (id: string, input: UpdateClientInput): Promise<Client> => {
  const supabase = createServerClient();

  const { data, error } = await supabase
    .from('clients')
    .update(input as never)
    .eq('id', id)
    .select()
    .single();

  if (error) throw new Error(`updateClient: ${error.message}`);
  if (!data) throw new Error('No se pudo actualizar el cliente');

  return data as Client;
};

export const deleteClient = async (id: string): Promise<void> => {
  const { createAdminClient } = await import('../client');
  const supabase = createAdminClient();

  const { error } = await supabase.from('clients').delete().eq('id', id);

  if (error) throw new Error(`deleteClient: ${error.message}`);
};

export const getClientStats = async (): Promise<ClientStats> => {
  const supabase = createServerClient();

  const { data, error } = await supabase
    .from('clients')
    .select('id, total_amount, created_at');

  if (error) throw new Error(`getClientStats: ${error.message}`);

  const rows = (data ?? []) as Pick<Client, 'total_amount' | 'created_at'>[];

  const now = new Date();
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

  const total = rows.length;
  const totalRevenue = rows.reduce((sum, r) => sum + (r.total_amount ?? 0), 0);
  const averageTicket = total > 0 ? Math.round(totalRevenue / total) : 0;
  const thisMonth = rows.filter((r) => (r.created_at ?? '') >= firstDayOfMonth).length;

  return { total, totalRevenue, averageTicket, thisMonth };
};

export const checkSlugExists = async (slug: string): Promise<boolean> => {
  const supabase = createAdminClient();
  const { data } = await (supabase as unknown as ReturnType<typeof createServerClient>)
    .from('clients')
    .select('id')
    .eq('portal_slug', slug)
    .maybeSingle();
  return !!data;
};

export const getClientByCedula = async (cedula: string, email: string): Promise<ClientWithRelations | null> => {
  const supabase = createAdminClient();

  const { data, error } = await (supabase as unknown as ReturnType<typeof createServerClient>)
    .from('clients')
    .select(
      '*, project:projects(id, name, city), package:packages(id, name, price, delivery_days), lead:leads(id, short_id, notes), payments:client_payments(id, amount, paid_at, notes, created_at)'
    )
    .eq('cedula', cedula)
    .eq('email', email)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw new Error(`getClientByCedula: ${error.message}`);
  }

  return data as ClientWithRelations;
};

export const getClientByCedulaOnly = async (cedula: string): Promise<ClientWithRelations | null> => {
  const supabase = createAdminClient();

  const { data, error } = await (supabase as unknown as ReturnType<typeof createServerClient>)
    .from('clients')
    .select(
      '*, project:projects(id, name, city), package:packages(id, name, price, delivery_days), lead:leads(id, short_id, notes), payments:client_payments(id, amount, paid_at, notes, created_at)'
    )
    .eq('cedula', cedula)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw new Error(`getClientByCedulaOnly: ${error.message}`);
  }

  return data as ClientWithRelations;
};

export const getClientBySlug = async (slug: string): Promise<ClientWithRelations | null> => {
  const supabase = createAdminClient();

  const { data, error } = await (supabase as unknown as ReturnType<typeof createServerClient>)
    .from('clients')
    .select(
      '*, project:projects(id, name, city), package:packages(id, name, price, delivery_days), lead:leads(id, short_id, notes), payments:client_payments(id, amount, paid_at, notes, created_at)'
    )
    .eq('portal_slug', slug)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw new Error(`getClientBySlug: ${error.message}`);
  }

  return data as ClientWithRelations;
};

export const updateClientPhase = async (
  clientId: string,
  phase: ConstructionPhase
): Promise<Client> => {
  const supabase = createAdminClient();

  const { data, error } = await (supabase as unknown as ReturnType<typeof createServerClient>)
    .from('clients')
    .update({ construction_phase: phase, notified_at: new Date().toISOString() } as never)
    .eq('id', clientId)
    .select()
    .single();

  if (error) throw new Error(`updateClientPhase: ${error.message}`);
  return data as Client;
};
