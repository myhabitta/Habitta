-- =============================================================
-- Habitta — Seed de datos de prueba
-- UUIDs fijos para que el seed sea repetible y las relaciones
-- entre tablas sean consistentes.
-- =============================================================

-- =====================
-- PROJECTS
-- =====================
INSERT INTO projects (id, slug, name, city, department, description, status) VALUES
(
  'a1000000-0000-0000-0000-000000000001',
  'more-bello',
  'Moré Bello',
  'Bello',
  'Antioquia',
  'Proyecto residencial moderno en el corazón de Bello. Unidades con acabados de alta calidad, zonas comunes equipadas y excelente conectividad con el metro de Medellín.',
  'active'
),
(
  'a1000000-0000-0000-0000-000000000002',
  'vivo-laureles',
  'Vivo Laureles',
  'Medellín',
  'Antioquia',
  'Apartamentos de diseño contemporáneo en el exclusivo sector de Laureles. Cerca de parques, restaurantes y centros comerciales, con acabados premium y espacios optimizados.',
  'active'
);

-- =====================
-- PACKAGES
-- 3 paquetes globales asociados a Moré Bello.
-- project_id disponible para asociar a otros proyectos en el futuro.
-- =====================
INSERT INTO packages (id, project_id, name, slug, description, price, features, delivery_days, status) VALUES
(
  'b1000000-0000-0000-0000-000000000001',
  'a1000000-0000-0000-0000-000000000001',
  'Paquete Básico',
  'basico',
  'Acabados funcionales y de buena calidad para quienes buscan comodidad al mejor precio.',
  180000000.00,
  ARRAY[
    'Piso en cerámica 40x40 en áreas comunes',
    'Cocina con muebles en melanina',
    'Baños con sanitario y lavamanos estándar',
    'Pintura en vinilo para interiores'
  ],
  45,
  'active'
),
(
  'b1000000-0000-0000-0000-000000000002',
  'a1000000-0000-0000-0000-000000000001',
  'Paquete Estándar',
  'estandar',
  'El equilibrio perfecto entre calidad y precio, con materiales de gama media-alta.',
  220000000.00,
  ARRAY[
    'Piso en porcelanato 60x60 en toda la unidad',
    'Cocina con mesón en granito y muebles enchapados',
    'Baños con grifería semipesada marca Corona',
    'Ventanas con doble vidrio para aislamiento acústico'
  ],
  50,
  'active'
),
(
  'b1000000-0000-0000-0000-000000000003',
  'a1000000-0000-0000-0000-000000000001',
  'Paquete Premium',
  'premium',
  'Los más altos estándares en materiales y diseño para una experiencia de vida superior.',
  280000000.00,
  ARRAY[
    'Piso en mármol importado en sala y comedor',
    'Cocina con mesón en cuarzo y electrodomésticos Mabe incluidos',
    'Baños con grifería pesada marca Grohe y ducha tipo lluvia',
    'Carpintería en madera maciza para puertas y closets'
  ],
  60,
  'active'
);

-- =====================
-- LEADS
-- =====================
INSERT INTO leads (id, short_id, first_name, last_name, email, phone, project_id, package_id, status, notes) VALUES
(
  'c1000000-0000-0000-0000-000000000001',
  'Ld000001',
  'Valentina',
  'Ospina Restrepo',
  'valentina.ospina@gmail.com',
  '3001234567',
  'a1000000-0000-0000-0000-000000000001',
  'b1000000-0000-0000-0000-000000000003',
  'converted',
  '[
    {"text": "Llegó por el formulario del website, interesada en el paquete premium de Moré Bello.", "created_at": "2026-01-10T09:00:00Z", "created_by": "ana@habitta.co"},
    {"text": "Llamada de seguimiento. Muy interesada, quiere visitar el proyecto.", "created_at": "2026-01-12T14:30:00Z", "created_by": "ana@habitta.co"},
    {"text": "Visita realizada. Le encantó el proyecto. Iniciamos proceso de negociación.", "created_at": "2026-01-15T11:00:00Z", "created_by": "carlos@habitta.co"},
    {"text": "Firmó la promesa de compraventa. Convertida a cliente.", "created_at": "2026-01-20T16:00:00Z", "created_by": "carlos@habitta.co"}
  ]'::jsonb
),
(
  'c1000000-0000-0000-0000-000000000002',
  'Ld000002',
  'Sebastián',
  'Martínez Gómez',
  'sebastian.martinez@hotmail.com',
  '3112345678',
  'a1000000-0000-0000-0000-000000000001',
  'b1000000-0000-0000-0000-000000000002',
  'converted',
  '[
    {"text": "Registrado manualmente por referido de Valentina Ospina.", "created_at": "2026-01-22T10:00:00Z", "created_by": "ana@habitta.co"},
    {"text": "Primera llamada. Interesado en Moré Bello paquete estándar. Tiene preaprobación bancaria.", "created_at": "2026-01-23T15:00:00Z", "created_by": "ana@habitta.co"},
    {"text": "Negociación cerrada. Firmó documentos.", "created_at": "2026-01-28T10:00:00Z", "created_by": "carlos@habitta.co"}
  ]'::jsonb
),
(
  'c1000000-0000-0000-0000-000000000003',
  'Ld000003',
  'Camila',
  'Torres Herrera',
  'camila.torres@gmail.com',
  '3209876543',
  'a1000000-0000-0000-0000-000000000001',
  'b1000000-0000-0000-0000-000000000002',
  'negotiating',
  '[
    {"text": "Llegó por Instagram. Interesada en paquete estándar de Moré Bello.", "created_at": "2026-02-05T08:30:00Z", "created_by": "ana@habitta.co"},
    {"text": "Reunión virtual realizada. Solicitó cotización formal y tiempo para evaluar financiación.", "created_at": "2026-02-10T11:00:00Z", "created_by": "ana@habitta.co"}
  ]'::jsonb
),
(
  'c1000000-0000-0000-0000-000000000004',
  'Ld000004',
  'Andrés Felipe',
  'Cardona Muñoz',
  'andres.cardona@empresa.com',
  '3154567890',
  'a1000000-0000-0000-0000-000000000002',
  NULL,
  'contacted',
  '[
    {"text": "Llegó por la feria inmobiliaria del 15 de febrero. Interesado en Vivo Laureles pero no definió paquete.", "created_at": "2026-02-15T17:00:00Z", "created_by": "carlos@habitta.co"}
  ]'::jsonb
),
(
  'c1000000-0000-0000-0000-000000000005',
  'Ld000005',
  'María Alejandra',
  'Vásquez Cano',
  'mariavascano@yahoo.com',
  '3187654321',
  'a1000000-0000-0000-0000-000000000001',
  'b1000000-0000-0000-0000-000000000001',
  'lost',
  '[
    {"text": "Llegó por el website. Interesada en paquete básico de Moré Bello.", "created_at": "2026-01-05T09:00:00Z", "created_by": "ana@habitta.co"},
    {"text": "No contestó llamadas en 2 semanas. Enviamos email de seguimiento sin respuesta.", "created_at": "2026-01-20T10:00:00Z", "created_by": "ana@habitta.co"},
    {"text": "Confirmó que compró con otra constructora. Lead perdido.", "created_at": "2026-02-01T09:00:00Z", "created_by": "ana@habitta.co"}
  ]'::jsonb
);

-- =====================
-- CLIENTS
-- =====================
INSERT INTO clients (id, short_id, lead_id, first_name, last_name, email, phone, project_id, package_id, total_amount, status, tower, apartment_number, work_start_date) VALUES
(
  'd1000000-0000-0000-0000-000000000001',
  'Cl000001',
  'c1000000-0000-0000-0000-000000000001',
  'Valentina',
  'Ospina Restrepo',
  'valentina.ospina@gmail.com',
  '3001234567',
  'a1000000-0000-0000-0000-000000000001',
  'b1000000-0000-0000-0000-000000000003',  -- premium: 60 días
  280000000.00,
  'en_proceso',
  'A',
  '502',
  '2026-02-15'  -- entrega: 2026-04-16
),
(
  'd1000000-0000-0000-0000-000000000002',
  'Cl000002',
  'c1000000-0000-0000-0000-000000000002',
  'Sebastián',
  'Martínez Gómez',
  'sebastian.martinez@hotmail.com',
  '3112345678',
  'a1000000-0000-0000-0000-000000000001',
  'b1000000-0000-0000-0000-000000000002',  -- estándar: 50 días
  220000000.00,
  'pendiente',
  'B',
  '301',
  '2026-03-17'  -- entrega: 2026-05-06
);
