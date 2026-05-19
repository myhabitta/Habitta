-- Add portal, construction phase, and cedula fields to clients
ALTER TABLE clients
  ADD COLUMN IF NOT EXISTS construction_phase int2 NOT NULL DEFAULT 1
    CHECK (construction_phase BETWEEN 1 AND 4),
  ADD COLUMN IF NOT EXISTS portal_slug text UNIQUE,
  ADD COLUMN IF NOT EXISTS cedula text UNIQUE,
  ADD COLUMN IF NOT EXISTS notified_at timestamptz;

-- Generate portal_slug for existing clients that don't have one
UPDATE clients
SET portal_slug = LOWER(
  REGEXP_REPLACE(
    REGEXP_REPLACE(
      TRANSLATE(
        first_name || '-' || last_name,
        'áéíóúñÁÉÍÓÚÑ',
        'aeiounAEIOUN'
      ),
      '[^a-zA-Z0-9\s-]', '', 'g'
    ),
    '\s+', '-', 'g'
  )
) || '-' || short_id
WHERE portal_slug IS NULL;

-- Now make portal_slug NOT NULL
ALTER TABLE clients ALTER COLUMN portal_slug SET NOT NULL;
