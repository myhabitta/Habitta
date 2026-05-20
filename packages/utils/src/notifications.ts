import { sendEmail } from './email';
import { logEmail } from '@habitta/database';

interface NotificationData {
  to: string;
  subject: string;
  html: string;
}

interface SendNotificationParams {
  type: 'email' | 'whatsapp';
  clientId: string;
  template?: string;
  data: NotificationData;
}

export const sendNotification = async ({
  type,
  clientId,
  template,
  data,
}: SendNotificationParams): Promise<{ error: string | null }> => {
  switch (type) {
    case 'email': {
      const result = await sendEmail(data);

      try {
        await logEmail({
          clientId,
          template: template ?? 'generic',
          toEmail: data.to,
          subject: data.subject,
          status: result.error ? 'failed' : 'sent',
          error: result.error ?? undefined,
        });
      } catch (logError) {
        console.error('[notifications] Failed to log email:', logError);
      }

      return result;
    }
    case 'whatsapp':
      console.log('[notifications] WhatsApp channel not yet implemented');
      return { error: null };
    default:
      return { error: `Canal de notificación no soportado: ${type}` };
  }
};
