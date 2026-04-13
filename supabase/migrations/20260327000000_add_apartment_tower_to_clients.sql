ALTER TABLE clients
  ADD COLUMN IF NOT EXISTS apartment_number text,
  ADD COLUMN IF NOT EXISTS tower text;
