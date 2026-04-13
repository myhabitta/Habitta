-- Tabla: clients
CREATE TABLE clients (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id      uuid REFERENCES leads(id) ON DELETE SET NULL,
  first_name   text NOT NULL,
  last_name    text NOT NULL,
  email        text NOT NULL,
  phone        text,
  project_id   uuid NOT NULL REFERENCES projects(id),
  package_id   uuid NOT NULL REFERENCES packages(id),
  total_amount numeric(12,2) NOT NULL,
  created_at   timestamptz DEFAULT now(),
  updated_at   timestamptz DEFAULT now()
);

-- Índices
CREATE INDEX idx_clients_email      ON clients(email);
CREATE INDEX idx_clients_lead_id    ON clients(lead_id);
CREATE INDEX idx_clients_project_id ON clients(project_id);
CREATE INDEX idx_clients_package_id ON clients(package_id);

-- Trigger updated_at
CREATE TRIGGER trg_clients_updated_at
  BEFORE UPDATE ON clients
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
