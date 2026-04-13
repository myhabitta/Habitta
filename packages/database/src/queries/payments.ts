import type { ClientPayment, CreateClientPaymentInput } from '@habitta/types';
import { createServerClient } from '../client';

export const getClientPayments = async (clientId: string): Promise<ClientPayment[]> => {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from('client_payments')
    .select('*')
    .eq('client_id', clientId)
    .order('paid_at', { ascending: false });
  if (error) throw new Error(error.message);
  return (data as ClientPayment[]) ?? [];
};

export const addClientPayment = async (input: CreateClientPaymentInput): Promise<ClientPayment> => {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from('client_payments')
    .insert(input as never)
    .select()
    .single();
  if (error) throw new Error(error.message);
  if (!data) throw new Error('No se pudo registrar el pago');
  return data as ClientPayment;
};
