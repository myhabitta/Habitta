export type DeliveryStatus = 'sin_fecha' | 'en_tiempo' | 'urgente' | 'vencido';

export type DeliveryInfo = {
  /** Fecha estimada de entrega */
  deliveryDate: Date | null;
  /** Días restantes (negativo = vencido) */
  daysRemaining: number | null;
  /** Estado semáforo para UI */
  status: DeliveryStatus;
};

/**
 * Parsea una fecha ISO (YYYY-MM-DD) como fecha LOCAL, evitando el desfase UTC.
 * `new Date('2026-03-27')` → UTC midnight, que en zonas -X horas sería el día anterior.
 */
const parseLocalDate = (iso: string): Date | null => {
  const parts = iso.split('-').map(Number);
  if (parts.length !== 3) return null;
  const [year, month, day] = parts as [number, number, number];
  if (!year || !month || !day) return null;
  const d = new Date(year, month - 1, day);
  return isNaN(d.getTime()) ? null : d;
};

/**
 * Calcula información de entrega de un apartamento.
 *
 * @param workStartDate  Fecha ISO (YYYY-MM-DD) del día que el cliente paga el adelanto
 *                       e inicia obra. Si es null o inválida, retorna status 'sin_fecha'.
 * @param deliveryDays   Días de entrega definidos por el paquete elegido (básico: 45,
 *                       estándar: 50, premium: 60).
 * @returns              DeliveryInfo con fecha de entrega, días restantes y estado semáforo.
 *
 * Semáforo:
 * - `sin_fecha`  — no hay fecha de inicio o datos inválidos
 * - `en_tiempo`  — más de 15 días restantes
 * - `urgente`    — entre 0 y 15 días restantes (incluyendo el día de entrega)
 * - `vencido`    — fecha de entrega ya pasó
 *
 * @example
 * calculateDelivery('2026-03-01', 45)
 * // → { deliveryDate: Date(2026-04-15), daysRemaining: 19, status: 'en_tiempo' }
 */
export const calculateDelivery = (
  workStartDate: string | null | undefined,
  deliveryDays: number | null | undefined
): DeliveryInfo => {
  if (!workStartDate || !deliveryDays || deliveryDays <= 0) {
    return { deliveryDate: null, daysRemaining: null, status: 'sin_fecha' };
  }

  const start = parseLocalDate(workStartDate);
  if (!start) {
    return { deliveryDate: null, daysRemaining: null, status: 'sin_fecha' };
  }

  const deliveryDate = new Date(start);
  deliveryDate.setDate(deliveryDate.getDate() + deliveryDays);

  // Midnight local de hoy para comparar solo fechas
  const now = new Date();
  const todayMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const deliveryMidnight = new Date(
    deliveryDate.getFullYear(),
    deliveryDate.getMonth(),
    deliveryDate.getDate()
  );

  const msPerDay = 1000 * 60 * 60 * 24;
  const daysRemaining = Math.round(
    (deliveryMidnight.getTime() - todayMidnight.getTime()) / msPerDay
  );

  let status: DeliveryStatus;
  if (daysRemaining < 0) {
    status = 'vencido';
  } else if (daysRemaining <= 15) {
    status = 'urgente';
  } else {
    status = 'en_tiempo';
  }

  return { deliveryDate, daysRemaining, status };
};
