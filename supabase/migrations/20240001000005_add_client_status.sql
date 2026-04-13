-- Agrega campo de estado al proceso del cliente
ALTER TABLE clients
  ADD COLUMN status text NOT NULL DEFAULT 'pendiente'
  CHECK (status IN ('pendiente', 'en_proceso', 'completado'));

CREATE INDEX idx_clients_status ON clients(status);
