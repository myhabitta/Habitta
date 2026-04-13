-- Eliminar paquetes duplicados de Vivo Laureles del seed anterior.
-- Los paquetes quedan asociados a Moré Bello por ahora.
-- project_id se mantiene en el schema para uso futuro por proyecto.

-- 1. Reasignar clients que apuntaban a paquetes eliminados
UPDATE clients SET package_id    = 'b1000000-0000-0000-0000-000000000002',
                   project_id    = 'a1000000-0000-0000-0000-000000000001'
  WHERE package_id = 'b1000000-0000-0000-0000-000000000005';

-- 2. Reasignar leads que apuntaban a paquetes eliminados
UPDATE leads SET package_id  = 'b1000000-0000-0000-0000-000000000002',
                 project_id  = 'a1000000-0000-0000-0000-000000000001'
  WHERE package_id = 'b1000000-0000-0000-0000-000000000005';

-- 3. Eliminar paquetes duplicados
DELETE FROM packages WHERE id IN (
  'b1000000-0000-0000-0000-000000000004',
  'b1000000-0000-0000-0000-000000000005',
  'b1000000-0000-0000-0000-000000000006'
);
