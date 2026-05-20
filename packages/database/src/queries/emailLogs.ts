import type { EmailLog } from '@habitta/types';
import { createAdminClient } from '../client';

// NOTE: email_logs table is not yet in generated Supabase types.
// After running `supabase db push` and regenerating types, remove `as never` casts.

interface LogEmailParams {
  clientId: string | null;
  template: string;
  toEmail: string;
  subject: string;
  status: 'sent' | 'failed';
  error?: string | undefined;
}

export const logEmail = async (params: LogEmailParams): Promise<void> => {
  const supabase = createAdminClient();

  const { error } = await (supabase as never as { from: (t: string) => { insert: (row: Record<string, unknown>) => Promise<{ error: { message: string } | null }> } }).from('email_logs').insert({
    client_id: params.clientId,
    template: params.template,
    to_email: params.toEmail,
    subject: params.subject,
    status: params.status,
    error: params.error ?? null,
  });

  if (error) throw new Error(`logEmail: ${error.message}`);
};

export const getEmailLogsByClient = async (clientId: string): Promise<EmailLog[]> => {
  const supabase = createAdminClient();

  const { data, error } = await (supabase as never as { from: (t: string) => { select: (cols: string) => { eq: (col: string, val: string) => { order: (col: string, opts: { ascending: boolean }) => Promise<{ data: unknown[]; error: { message: string } | null }> } } } }).from('email_logs')
    .select('*')
    .eq('client_id', clientId)
    .order('created_at', { ascending: false });

  if (error) throw new Error(`getEmailLogsByClient: ${error.message}`);
  return (data as EmailLog[]) ?? [];
};
