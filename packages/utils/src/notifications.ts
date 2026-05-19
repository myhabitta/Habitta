import { sendEmail } from './email';

interface NotificationData {
  to: string;
  subject: string;
  html: string;
}

interface SendNotificationParams {
  type: 'email' | 'whatsapp';
  clientId: string;
  data: NotificationData;
}

export const sendNotification = async ({
  type,
  data,
}: SendNotificationParams): Promise<{ error: string | null }> => {
  switch (type) {
    case 'email':
      return sendEmail(data);
    case 'whatsapp':
      // Future: WhatsApp integration
      console.log('[notifications] WhatsApp channel not yet implemented');
      return { error: null };
    default:
      return { error: `Canal de notificación no soportado: ${type}` };
  }
};
