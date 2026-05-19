-- Expand construction_phase from 1-4 to 0-5
-- 0 = Sin iniciar, 1-4 = Fases, 5 = Terminado

ALTER TABLE clients DROP CONSTRAINT IF EXISTS clients_construction_phase_check;
ALTER TABLE clients ADD CONSTRAINT clients_construction_phase_check CHECK (construction_phase BETWEEN 0 AND 5);
ALTER TABLE clients ALTER COLUMN construction_phase SET DEFAULT 0;
