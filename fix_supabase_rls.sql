-- ==============================================================================
-- SERMOA FIT / AGENDAFIT - SCRIPT PARA HABILITAR ESCRITURA Y LECTURA EN SUPABASE
-- ==============================================================================
-- Ejecuta este script en el SQL Editor de tu proyecto de Supabase para desbloquear
-- los permisos de inserción, edición y eliminación para la aplicación web.

-- 1. Deshabilitar RLS en todas las tablas para permitir sincronización total
ALTER TABLE IF EXISTS studios DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS branches DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS rooms DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS activities DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS instructor_details DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS classes DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS bookings DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS waitlist DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS credit_packs DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS student_memberships DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS payments DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS attendances DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS routines DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS whatsapp_templates DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS financial_categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS financial_monthly_goals DISABLE ROW LEVEL SECURITY;

-- 2. Asegurar que existan las columnas complementarias en la tabla profiles
ALTER TABLE IF EXISTS profiles ADD COLUMN IF NOT EXISTS birth_date DATE;
ALTER TABLE IF EXISTS profiles ADD COLUMN IF NOT EXISTS emergency_contact_name VARCHAR(150);
ALTER TABLE IF EXISTS profiles ADD COLUMN IF NOT EXISTS emergency_contact_phone VARCHAR(50);
ALTER TABLE IF EXISTS profiles ADD COLUMN IF NOT EXISTS medical_notes TEXT;
ALTER TABLE IF EXISTS profiles ADD COLUMN IF NOT EXISTS has_medical_certificate BOOLEAN DEFAULT FALSE;
ALTER TABLE IF EXISTS profiles ADD COLUMN IF NOT EXISTS credits_balance INT DEFAULT 0;
ALTER TABLE IF EXISTS profiles ADD COLUMN IF NOT EXISTS debt_amount DECIMAL(10, 2) DEFAULT 0.00;
ALTER TABLE IF EXISTS profiles ADD COLUMN IF NOT EXISTS preferred_branch_id UUID REFERENCES branches(id) ON DELETE SET NULL;

-- 3. Otorgar permisos directos a los roles anon y authenticated
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA public TO anon, authenticated, service_role;

-- Listo: Ahora el CRM y la App pueden guardar, editar y eliminar datos en tiempo real.
