-- ============================================================
-- RLS para client_payments
-- ============================================================

ALTER TABLE client_payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "authenticated users can read client_payments"
  ON client_payments FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "authenticated users can insert client_payments"
  ON client_payments FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "authenticated users can update client_payments"
  ON client_payments FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "authenticated users can delete client_payments"
  ON client_payments FOR DELETE
  TO authenticated
  USING (true);
