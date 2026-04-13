-- Tabla: leads
-- notes es jsonb para soportar historial de acompañamiento (array de LeadNote)
-- Estructura de cada nota: { text: string, created_at: string, created_by: string }
CREATE TABLE leads (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name  text NOT NULL,
  last_name   text NOT NULL,
  email       text NOT NULL,
  phone       text,
  project_id  uuid REFERENCES projects(id) ON DELETE SET NULL,
  package_id  uuid REFERENCES packages(id) ON DELETE SET NULL,
  status      text NOT NULL DEFAULT 'new'
              CHECK (status IN ('new', 'contacted', 'negotiating', 'converted', 'lost')),
  notes       jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at  timestamptz DEFAULT now(),
  updated_at  timestamptz DEFAULT now()
);

-- Índices
CREATE INDEX idx_leads_status     ON leads(status);
CREATE INDEX idx_leads_email      ON leads(email);
CREATE INDEX idx_leads_project_id ON leads(project_id);
CREATE INDEX idx_leads_package_id ON leads(package_id);

-- Trigger updated_at
CREATE TRIGGER trg_leads_updated_at
  BEFORE UPDATE ON leads
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
