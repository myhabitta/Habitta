export type EmailLogStatus = 'sent' | 'failed';

export type EmailLog = {
  id: string;
  client_id: string | null;
  template: string;
  to_email: string;
  subject: string;
  status: EmailLogStatus;
  error: string | null;
  created_at: string;
};
