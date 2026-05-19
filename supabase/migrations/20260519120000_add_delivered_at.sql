-- Add delivered_at field to track when apartment was physically delivered to client
ALTER TABLE clients ADD COLUMN IF NOT EXISTS delivered_at timestamptz DEFAULT NULL;
