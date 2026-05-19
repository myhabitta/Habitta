interface WelcomeEmailParams {
  clientName: string;
  projectName: string;
  packageName: string;
  apartmentNumber: string;
  portalUrl: string;
}

interface PhaseUpdateEmailParams {
  clientName: string;
  projectName: string;
  apartmentNumber: string;
  phase: number;
  phaseLabel: string;
  portalUrl: string;
}

const baseStyles = `
  body { margin: 0; padding: 0; background-color: #f9f8f6; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; }
  .container { max-width: 560px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; }
  .header { background-color: #424832; padding: 32px 24px; text-align: center; }
  .header h1 { color: #ffffff; font-size: 24px; margin: 0; font-weight: 600; }
  .body { padding: 32px 24px; }
  .body p { color: #1e1a1b; font-size: 15px; line-height: 1.6; margin: 0 0 16px; }
  .info-box { background-color: #f3f1ed; border-radius: 8px; padding: 20px; margin: 20px 0; }
  .info-row { display: flex; justify-content: space-between; padding: 6px 0; font-size: 14px; color: #1e1a1b; }
  .info-label { color: #6e6762; }
  .btn { display: inline-block; background-color: #E8703A; color: #ffffff; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 15px; }
  .footer { padding: 24px; text-align: center; font-size: 12px; color: #6e6762; }
`;

export const buildWelcomeEmail = ({
  clientName,
  projectName,
  packageName,
  apartmentNumber,
  portalUrl,
}: WelcomeEmailParams): string => `
<!DOCTYPE html>
<html lang="es">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>${baseStyles}</style></head>
<body style="margin:0;padding:0;background-color:#f9f8f6;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;">
  <div style="padding:24px;">
    <div style="max-width:560px;margin:0 auto;background-color:#ffffff;border-radius:12px;overflow:hidden;">
      <div style="background-color:#424832;padding:32px 24px;text-align:center;">
        <h1 style="color:#ffffff;font-size:24px;margin:0;font-weight:600;">¡Bienvenido a Habitta!</h1>
      </div>
      <div style="padding:32px 24px;">
        <p style="color:#1e1a1b;font-size:15px;line-height:1.6;margin:0 0 16px;">
          Hola <strong>${clientName}</strong>,
        </p>
        <p style="color:#1e1a1b;font-size:15px;line-height:1.6;margin:0 0 16px;">
          Es un placer confirmarte que ya eres parte de la familia Habitta. Aquí tienes el resumen de tu compra:
        </p>

        <div style="background-color:#f3f1ed;border-radius:8px;padding:20px;margin:20px 0;">
          <table style="width:100%;border-collapse:collapse;">
            <tr>
              <td style="padding:6px 0;font-size:14px;color:#6e6762;">Proyecto</td>
              <td style="padding:6px 0;font-size:14px;color:#1e1a1b;text-align:right;font-weight:600;">${projectName}</td>
            </tr>
            <tr>
              <td style="padding:6px 0;font-size:14px;color:#6e6762;">Paquete de acabados</td>
              <td style="padding:6px 0;font-size:14px;color:#1e1a1b;text-align:right;font-weight:600;">${packageName}</td>
            </tr>
            <tr>
              <td style="padding:6px 0;font-size:14px;color:#6e6762;">Apartamento</td>
              <td style="padding:6px 0;font-size:14px;color:#1e1a1b;text-align:right;font-weight:600;">${apartmentNumber}</td>
            </tr>
          </table>
        </div>

        <p style="color:#1e1a1b;font-size:15px;line-height:1.6;margin:0 0 24px;">
          Desde el siguiente enlace podrás seguir el avance de tu apartamento en tiempo real:
        </p>

        <div style="text-align:center;margin:24px 0;">
          <a href="${portalUrl}" style="display:inline-block;background-color:#E8703A;color:#ffffff;padding:14px 32px;border-radius:8px;text-decoration:none;font-weight:600;font-size:15px;">
            Ver mi apartamento
          </a>
        </div>
      </div>
      <div style="padding:24px;text-align:center;font-size:12px;color:#6e6762;border-top:1px solid #f3f1ed;">
        Habitta — Acabados que transforman tu hogar
      </div>
    </div>
  </div>
</body>
</html>`;

const buildProgressDots = (currentPhase: number): string => {
  const phases = [0, 1, 2, 3, 4, 5];
  const labels = ['—', '1', '2', '3', '4', '✓'];
  return phases
    .map((p, i) => {
      const isCompleted = p < currentPhase;
      const isActive = p === currentPhase;
      const bg = isCompleted ? '#759465' : isActive ? '#E8703A' : '#e8e4de';
      const textColor = isCompleted || isActive ? '#ffffff' : '#6e6762';
      return `<td style="padding:0 3px;text-align:center;">
        <div style="width:32px;height:32px;border-radius:50%;background-color:${bg};color:${textColor};font-size:12px;font-weight:700;line-height:32px;display:inline-block;">${labels[i]}</div>
      </td>`;
    })
    .join('');
};

export const buildPhaseUpdateEmail = ({
  clientName,
  projectName,
  apartmentNumber,
  phase,
  phaseLabel,
  portalUrl,
}: PhaseUpdateEmailParams): string => `
<!DOCTYPE html>
<html lang="es">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background-color:#f9f8f6;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;">
  <div style="padding:24px;">
    <div style="max-width:560px;margin:0 auto;background-color:#ffffff;border-radius:12px;overflow:hidden;">
      <div style="background-color:#424832;padding:32px 24px;text-align:center;">
        <h1 style="color:#ffffff;font-size:24px;margin:0;font-weight:600;">Actualización de tu apartamento</h1>
      </div>
      <div style="padding:32px 24px;">
        <p style="color:#1e1a1b;font-size:15px;line-height:1.6;margin:0 0 16px;">
          Hola <strong>${clientName}</strong>,
        </p>
        <p style="color:#1e1a1b;font-size:15px;line-height:1.6;margin:0 0 24px;">
          Tu apartamento <strong>${apartmentNumber}</strong> en <strong>${projectName}</strong> ha avanzado a una nueva etapa de construcción:
        </p>

        <div style="background-color:#fef3ec;border-radius:8px;padding:20px;margin:20px 0;text-align:center;">
          <div style="font-size:13px;color:#6e6762;margin-bottom:4px;">${phase === 0 ? 'Sin iniciar' : phase === 5 ? 'Terminado' : `Fase ${phase} de 4`}</div>
          <div style="font-size:18px;font-weight:700;color:#E8703A;">${phaseLabel}</div>
        </div>

        <div style="text-align:center;margin:24px 0;">
          <table style="margin:0 auto;border-collapse:collapse;"><tr>${buildProgressDots(phase)}</tr></table>
        </div>

        <div style="text-align:center;margin:24px 0;">
          <a href="${portalUrl}" style="display:inline-block;background-color:#E8703A;color:#ffffff;padding:14px 32px;border-radius:8px;text-decoration:none;font-weight:600;font-size:15px;">
            Ver avance completo
          </a>
        </div>
      </div>
      <div style="padding:24px;text-align:center;font-size:12px;color:#6e6762;border-top:1px solid #f3f1ed;">
        Habitta — Acabados que transforman tu hogar
      </div>
    </div>
  </div>
</body>
</html>`;
