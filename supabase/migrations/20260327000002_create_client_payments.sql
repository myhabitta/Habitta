-- ============================================================
-- client_payments: historial de anticipos por cliente
-- ============================================================

CREATE TABLE IF NOT EXISTS client_payments (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id     uuid NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  amount        numeric(15, 2) NOT NULL CHECK (amount > 0),
  paid_at       date NOT NULL DEFAULT CURRENT_DATE,
  notes         text,
  created_at    timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS client_payments_client_id_idx ON client_payments (client_id);
