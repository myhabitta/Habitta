-- Días de entrega por paquete
ALTER TABLE packages
  ADD COLUMN IF NOT EXISTS delivery_days integer NOT NULL DEFAULT 45
  CHECK (delivery_days > 0);

-- Fecha de inicio de obra por cliente (cuando paga el adelanto)
ALTER TABLE clients
  ADD COLUMN IF NOT EXISTS work_start_date date;
