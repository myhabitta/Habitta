import { Resend } from 'resend';

let resendInstance: Resend | null = null;

const getResend = (): Resend => {
  if (!resendInstance) {
    const key = process.env.RESEND_API_KEY;
    if (!key) throw new Error('RESEND_API_KEY no configurada');
    resendInstance = new Resend(key);
  }
  return resendInstance;
};

interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
}

export const sendEmail = async ({ to, subject, html }: SendEmailParams): Promise<{ error: string | null }> => {
  try {
    const resend = getResend();
    const from = process.env.RESEND_FROM_EMAIL ?? 'Habitta <notificaciones@habitta.com>';

    const { error } = await resend.emails.send({ from, to, subject, html });

    if (error) return { error: error.message };
    return { error: null };
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Error enviando correo' };
  }
};
