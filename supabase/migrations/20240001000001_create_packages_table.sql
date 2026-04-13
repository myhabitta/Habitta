-- Tabla: packages
CREATE TABLE packages (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id  uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  name        text NOT NULL,
  slug        text NOT NULL,
  description text,
  price       numeric(12,2) NOT NULL,
  features    text[] DEFAULT '{}',
  status      text NOT NULL DEFAULT 'active'
              CHECK (status IN ('active', 'inactive')),
  created_at  timestamptz DEFAULT now(),
  updated_at  timestamptz DEFAULT now(),
  UNIQUE(project_id, slug)
);

-- Índices
CREATE INDEX idx_packages_project_id ON packages(project_id);
CREATE INDEX idx_packages_status     ON packages(status);

-- Trigger updated_at
CREATE TRIGGER trg_packages_updated_at
  BEFORE UPDATE ON packages
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
