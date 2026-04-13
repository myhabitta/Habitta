-- Función para generar un ID corto base62 de 8 caracteres
CREATE OR REPLACE FUNCTION generate_short_id()
RETURNS text AS $$
DECLARE
  chars TEXT := 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  result TEXT := '';
  i INTEGER;
  bytes BYTEA;
BEGIN
  bytes := gen_random_bytes(8);
  FOR i IN 1..8 LOOP
    result := result || substr(chars, (get_byte(bytes, i-1) % 62) + 1, 1);
  END LOOP;
  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Agregar short_id a leads
ALTER TABLE leads ADD COLUMN short_id TEXT UNIQUE DEFAULT generate_short_id();

-- Agregar short_id a clients
ALTER TABLE clients ADD COLUMN short_id TEXT UNIQUE DEFAULT generate_short_id();

-- Índices para lookups rápidos por short_id
CREATE INDEX idx_leads_short_id   ON leads(short_id);
CREATE INDEX idx_clients_short_id ON clients(short_id);
