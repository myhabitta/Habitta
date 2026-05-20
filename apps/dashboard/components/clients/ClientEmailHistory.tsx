import { Mail, CheckCircle2, XCircle, Clock } from 'lucide-react';
import type { EmailLog } from '@habitta/types';

interface ClientEmailHistoryProps {
  emails: EmailLog[];
}

const TEMPLATE_LABELS: Record<string, string> = {
  welcome: 'Bienvenida',
  phase_update: 'Actualización de fase',
  delivery: 'Entrega',
  generic: 'Notificación',
};

const formatDate = (dateStr: string): string =>
  new Intl.DateTimeFormat('es-CO', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(dateStr));

const ClientEmailHistory = ({ emails }: ClientEmailHistoryProps) => {
  if (emails.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 py-6 text-center">
        <Mail className="h-8 w-8 text-muted-foreground/40" aria-hidden="true" />
        <p className="font-sans text-sm text-muted-foreground">
          No se han enviado correos a este cliente.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {emails.map((email) => (
        <div
          key={email.id}
          className="flex items-start gap-3 rounded-lg p-3"
          style={{ backgroundColor: 'var(--muted)' }}
        >
          <div className="mt-0.5 shrink-0">
            {email.status === 'sent' ? (
              <CheckCircle2 className="h-4 w-4 text-emerald-500" aria-hidden="true" />
            ) : (
              <XCircle className="h-4 w-4 text-destructive" aria-hidden="true" />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="font-sans text-sm font-medium">
                {TEMPLATE_LABELS[email.template] ?? email.template}
              </span>
              <span
                className="inline-flex items-center rounded-full px-1.5 py-0.5 font-sans text-[10px] font-medium"
                style={{
                  backgroundColor: email.status === 'sent' ? 'var(--success-tint, hsl(142 40% 92%))' : 'hsl(0 70% 93%)',
                  color: email.status === 'sent' ? 'var(--success, hsl(142 70% 35%))' : 'hsl(0 70% 45%)',
                }}
              >
                {email.status === 'sent' ? 'Enviado' : 'Fallido'}
              </span>
            </div>
            <p className="mt-0.5 truncate font-sans text-xs text-muted-foreground">
              {email.subject}
            </p>
            <div className="mt-1 flex items-center gap-1 font-sans text-[11px] text-muted-foreground/70">
              <Clock className="h-3 w-3" aria-hidden="true" />
              {formatDate(email.created_at)}
            </div>
            {email.error && (
              <p className="mt-1 font-sans text-xs text-destructive">{email.error}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ClientEmailHistory;
