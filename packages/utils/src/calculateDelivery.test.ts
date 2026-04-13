import { calculateDelivery } from './calculateDelivery';

// Congela "hoy" en una fecha fija para que los tests sean deterministas
const FIXED_TODAY = new Date('2026-03-27T12:00:00Z');

beforeAll(() => {
  jest.useFakeTimers();
  jest.setSystemTime(FIXED_TODAY);
});

afterAll(() => {
  jest.useRealTimers();
});

describe('calculateDelivery', () => {
  describe('sin_fecha — cuando faltan datos', () => {
    it('retorna sin_fecha si workStartDate es null', () => {
      const result = calculateDelivery(null, 45);
      expect(result.status).toBe('sin_fecha');
      expect(result.deliveryDate).toBeNull();
      expect(result.daysRemaining).toBeNull();
    });

    it('retorna sin_fecha si workStartDate es string vacío', () => {
      const result = calculateDelivery('', 45);
      expect(result.status).toBe('sin_fecha');
    });

    it('retorna sin_fecha si deliveryDays es null', () => {
      const result = calculateDelivery('2026-03-01', null);
      expect(result.status).toBe('sin_fecha');
    });

    it('retorna sin_fecha si deliveryDays es 0', () => {
      const result = calculateDelivery('2026-03-01', 0);
      expect(result.status).toBe('sin_fecha');
    });

    it('retorna sin_fecha si workStartDate es inválido', () => {
      const result = calculateDelivery('not-a-date', 45);
      expect(result.status).toBe('sin_fecha');
    });
  });

  describe('en_tiempo — más de 15 días restantes', () => {
    it('paquete básico (45 días): iniciado hace 10 días → 35 días restantes', () => {
      // hoy: 2026-03-27, inicio: 2026-03-17, entrega: 2026-05-01
      const result = calculateDelivery('2026-03-17', 45);
      expect(result.status).toBe('en_tiempo');
      expect(result.daysRemaining).toBe(35);
      expect(result.deliveryDate).toEqual(new Date(2026, 4, 1)); // 1 mayo
    });

    it('paquete premium (60 días): iniciado hoy → 60 días restantes', () => {
      const result = calculateDelivery('2026-03-27', 60);
      expect(result.status).toBe('en_tiempo');
      expect(result.daysRemaining).toBe(60);
    });

    it('paquete estándar (50 días): iniciado hace 1 día → 49 días restantes', () => {
      const result = calculateDelivery('2026-03-26', 50);
      expect(result.status).toBe('en_tiempo');
      expect(result.daysRemaining).toBe(49);
    });
  });

  describe('urgente — entre 0 y 15 días restantes', () => {
    it('exactamente 15 días restantes → urgente', () => {
      // hoy: 2026-03-27, entrega: 2026-04-11, inicio: 2026-04-11 - 45 = 2026-02-25
      const result = calculateDelivery('2026-02-25', 45);
      expect(result.status).toBe('urgente');
      expect(result.daysRemaining).toBe(15);
    });

    it('exactamente 1 día restante → urgente', () => {
      // entrega mañana 2026-03-28, inicio: 2026-03-28 - 45 = 2026-02-11
      const result = calculateDelivery('2026-02-11', 45);
      expect(result.status).toBe('urgente');
      expect(result.daysRemaining).toBe(1);
    });

    it('entrega hoy → urgente (0 días)', () => {
      const result = calculateDelivery('2026-02-10', 45);
      expect(result.status).toBe('urgente');
      expect(result.daysRemaining).toBe(0);
    });
  });

  describe('vencido — entrega pasada', () => {
    it('entrega fue ayer → vencido con -1 día', () => {
      // entrega 2026-03-26, inicio: 2026-03-26 - 45 = 2026-02-09
      const result = calculateDelivery('2026-02-09', 45);
      expect(result.status).toBe('vencido');
      expect(result.daysRemaining).toBe(-1);
    });

    it('entrega fue hace 30 días → vencido', () => {
      // entrega 2026-02-25, inicio: 2026-02-25 - 45 = 2026-01-11
      const result = calculateDelivery('2026-01-11', 45);
      expect(result.status).toBe('vencido');
      expect(result.daysRemaining).toBe(-30);
    });
  });

  describe('deliveryDate — fecha correcta', () => {
    it('calcula la fecha de entrega sumando los días exactos', () => {
      // inicio: 2026-01-01, +50 días = 2026-02-20
      const result = calculateDelivery('2026-01-01', 50);
      const delivery = result.deliveryDate!;
      expect(delivery.getFullYear()).toBe(2026);
      expect(delivery.getMonth()).toBe(1); // febrero (0-indexed)
      expect(delivery.getDate()).toBe(20);
    });
  });
});
