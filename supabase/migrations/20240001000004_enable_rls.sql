-- Habilitar RLS en todas las tablas
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads    ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients  ENABLE ROW LEVEL SECURITY;

-- =====================
-- PROJECTS
-- =====================
CREATE POLICY "authenticated users can read projects"
  ON projects FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "authenticated users can insert projects"
  ON projects FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "authenticated users can update projects"
  ON projects FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- =====================
-- PACKAGES
-- =====================
CREATE POLICY "authenticated users can read packages"
  ON packages FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "authenticated users can insert packages"
  ON packages FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "authenticated users can update packages"
  ON packages FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- =====================
-- LEADS
-- =====================
CREATE POLICY "authenticated users can read leads"
  ON leads FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "authenticated users can insert leads"
  ON leads FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "authenticated users can update leads"
  ON leads FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- =====================
-- CLIENTS
-- =====================
CREATE POLICY "authenticated users can read clients"
  ON clients FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "authenticated users can insert clients"
  ON clients FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "authenticated users can update clients"
  ON clients FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- DELETE: no hay políticas — bloqueado para todos los roles cliente.
-- Las eliminaciones se ejecutan desde Server Actions usando service_role_key,
-- que bypasea RLS y no necesita política explícita.
