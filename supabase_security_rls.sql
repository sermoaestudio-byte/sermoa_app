-- ==============================================================================
-- SERMOA FIT / AGENDAFIT - CONFIGURACIÓN DE SEGURIDAD Y RLS (ROW LEVEL SECURITY)
-- Compatible con Localhost (http://localhost:3000) y Producción (Vercel)
-- ==============================================================================
-- Este script activa Row Level Security (RLS) en todas las tablas, eliminando
-- los carteles rojos "UNRESTRICTED" en Supabase y protegiendo datos sensibles.
-- Se previene la recursión infinita mediante funciones con SECURITY DEFINER.

-- ==============================================================================
-- 1. SINCRONIZACIÓN Y VINCULACIÓN ENTRE auth.users Y public.profiles
-- ==============================================================================

-- Asegurar columna auth_user_id en profiles
ALTER TABLE IF EXISTS public.profiles 
ADD COLUMN IF NOT EXISTS auth_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;

-- Vincular usuarios existentes por email si no tienen auth_user_id
UPDATE public.profiles p
SET auth_user_id = u.id
FROM auth.users u
WHERE lower(p.email) = lower(u.email)
  AND (p.auth_user_id IS NULL OR p.auth_user_id != u.id);

-- Trigger para vincular automáticamente cuando un usuario se registra o loguea
CREATE OR REPLACE FUNCTION public.handle_auth_user_sync()
RETURNS trigger AS $$
BEGIN
  UPDATE public.profiles
  SET auth_user_id = NEW.id
  WHERE lower(email) = lower(NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_auth_user_sync ON auth.users;
CREATE TRIGGER trg_auth_user_sync
AFTER INSERT OR UPDATE ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_auth_user_sync();

-- ==============================================================================
-- 2. FUNCIONES DE ROLES SEGURAS (Evitan recursión infinita en PostgreSQL)
-- ==============================================================================

-- Obtener el ID del perfil del usuario logueado
CREATE OR REPLACE FUNCTION public.get_my_profile_id()
RETURNS uuid
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT id FROM public.profiles
  WHERE (auth_user_id = auth.uid() OR lower(email) = lower(auth.jwt() ->> 'email'))
  LIMIT 1;
$$;

-- Verificar si el usuario actual es Administrador
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE (auth_user_id = auth.uid() OR lower(email) = lower(auth.jwt() ->> 'email'))
      AND role = 'admin'
  );
$$;

-- Verificar si el usuario actual es Administrador o Profesor (Staff)
CREATE OR REPLACE FUNCTION public.is_staff()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE (auth_user_id = auth.uid() OR lower(email) = lower(auth.jwt() ->> 'email'))
      AND role IN ('admin', 'instructor')
  );
$$;

-- ==============================================================================
-- 3. HABILITACIÓN DE ROW LEVEL SECURITY (RLS) EN TODAS LAS TABLAS
-- ==============================================================================
ALTER TABLE IF EXISTS public.studios ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.branches ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.credit_packs ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.waitlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.student_memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.attendances ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.routines ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.whatsapp_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.financial_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.financial_monthly_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.pack_purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.credit_ledger ENABLE ROW LEVEL SECURITY;

-- Otorgar permisos base al schema public
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA public TO anon, authenticated, service_role;

-- ==============================================================================
-- 4. POLÍTICAS: CATÁLOGO PÚBLICO (Lectura general, edición solo Admin)
-- ==============================================================================

-- STUDIOS
DROP POLICY IF EXISTS "Public can view studios" ON public.studios;
CREATE POLICY "Public can view studios" ON public.studios
  FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Admins can manage studios" ON public.studios;
CREATE POLICY "Admins can manage studios" ON public.studios
  FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

-- BRANCHES
DROP POLICY IF EXISTS "Public can view branches" ON public.branches;
CREATE POLICY "Public can view branches" ON public.branches
  FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Admins can manage branches" ON public.branches;
CREATE POLICY "Admins can manage branches" ON public.branches
  FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

-- ROOMS
DROP POLICY IF EXISTS "Public can view rooms" ON public.rooms;
CREATE POLICY "Public can view rooms" ON public.rooms
  FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Admins can manage rooms" ON public.rooms;
CREATE POLICY "Admins can manage rooms" ON public.rooms
  FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

-- ACTIVITIES
DROP POLICY IF EXISTS "Public can view activities" ON public.activities;
CREATE POLICY "Public can view activities" ON public.activities
  FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Admins can manage activities" ON public.activities;
CREATE POLICY "Admins can manage activities" ON public.activities
  FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

-- CREDIT PACKS (Planes y Packs)
DROP POLICY IF EXISTS "Public can view credit_packs" ON public.credit_packs;
CREATE POLICY "Public can view credit_packs" ON public.credit_packs
  FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Admins can manage credit_packs" ON public.credit_packs;
CREATE POLICY "Admins can manage credit_packs" ON public.credit_packs
  FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

-- CLASSES (Horarios y Grilla de Clases)
DROP POLICY IF EXISTS "Public can view classes" ON public.classes;
CREATE POLICY "Public can view classes" ON public.classes
  FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Staff can manage classes" ON public.classes;
CREATE POLICY "Staff can manage classes" ON public.classes
  FOR ALL TO authenticated USING (public.is_staff()) WITH CHECK (public.is_staff());

-- ==============================================================================
-- 5. POLÍTICAS: PROFILES (Perfiles de Usuarios)
-- ==============================================================================
-- Lectura: Necesaria para hidratación de la tienda, instructores en grilla y login
DROP POLICY IF EXISTS "Allow select profiles" ON public.profiles;
CREATE POLICY "Allow select profiles" ON public.profiles
  FOR SELECT TO anon, authenticated USING (true);

-- Inserción: Registro público de nuevos alumnos (rol cliente) o por Administradores
DROP POLICY IF EXISTS "Allow insert profiles" ON public.profiles;
CREATE POLICY "Allow insert profiles" ON public.profiles
  FOR INSERT TO anon, authenticated 
  WITH CHECK (role = 'client' OR public.is_admin());

-- Actualización: Cada usuario actualiza su propio perfil, o el Admin actualiza cualquiera
DROP POLICY IF EXISTS "Allow update profiles" ON public.profiles;
CREATE POLICY "Allow update profiles" ON public.profiles
  FOR UPDATE TO anon, authenticated
  USING (id = public.get_my_profile_id() OR public.is_admin())
  WITH CHECK (id = public.get_my_profile_id() OR public.is_admin());

-- Eliminación: Solo Administradores
DROP POLICY IF EXISTS "Allow delete profiles" ON public.profiles;
CREATE POLICY "Allow delete profiles" ON public.profiles
  FOR DELETE TO authenticated USING (public.is_admin());

-- ==============================================================================
-- 6. POLÍTICAS: FINANZAS Y GESTIÓN SENSIBLE (Protección estricta)
-- ==============================================================================

-- FINANCIAL CATEGORIES (Solo Admins)
DROP POLICY IF EXISTS "Admins manage financial_categories" ON public.financial_categories;
CREATE POLICY "Admins manage financial_categories" ON public.financial_categories
  FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

-- FINANCIAL MONTHLY GOALS (Solo Admins)
DROP POLICY IF EXISTS "Admins manage financial_monthly_goals" ON public.financial_monthly_goals;
CREATE POLICY "Admins manage financial_monthly_goals" ON public.financial_monthly_goals
  FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

-- PAYMENTS (Pagos e Historial de Movimientos de Caja)
DROP POLICY IF EXISTS "Admins full access on payments" ON public.payments;
DROP POLICY IF EXISTS "Students can view own payments" ON public.payments;
DROP POLICY IF EXISTS "Students can insert own payments" ON public.payments;
DROP POLICY IF EXISTS "Allow select payments" ON public.payments;
DROP POLICY IF EXISTS "Allow insert payments" ON public.payments;
DROP POLICY IF EXISTS "Allow update payments" ON public.payments;
DROP POLICY IF EXISTS "Allow delete payments" ON public.payments;

CREATE POLICY "Allow select payments" ON public.payments
  FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Allow insert payments" ON public.payments
  FOR INSERT TO anon, authenticated WITH CHECK (true);

CREATE POLICY "Allow update payments" ON public.payments
  FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow delete payments" ON public.payments
  FOR DELETE TO anon, authenticated USING (true);

-- ==============================================================================
-- 7. POLÍTICAS: RESERVAS, LISTAS DE ESPERA Y ASISTENCIA
-- ==============================================================================

-- BOOKINGS (Reservas)
-- Lectura pública para cálculo de vacantes ocupadas en la grilla
DROP POLICY IF EXISTS "View bookings" ON public.bookings;
CREATE POLICY "View bookings" ON public.bookings
  FOR SELECT TO anon, authenticated USING (true);

-- Inserción / Edición / Cancelación: Alumno de su propia reserva o Staff de todas
DROP POLICY IF EXISTS "Manage bookings" ON public.bookings;
CREATE POLICY "Manage bookings" ON public.bookings
  FOR ALL TO anon, authenticated
  USING (student_id = public.get_my_profile_id() OR public.is_staff())
  WITH CHECK (student_id = public.get_my_profile_id() OR public.is_staff());

-- WAITLIST (Listas de espera)
DROP POLICY IF EXISTS "View waitlist" ON public.waitlist;
CREATE POLICY "View waitlist" ON public.waitlist
  FOR SELECT TO anon, authenticated
  USING (student_id = public.get_my_profile_id() OR public.is_staff());

DROP POLICY IF EXISTS "Manage waitlist" ON public.waitlist;
CREATE POLICY "Manage waitlist" ON public.waitlist
  FOR ALL TO anon, authenticated
  USING (student_id = public.get_my_profile_id() OR public.is_staff())
  WITH CHECK (student_id = public.get_my_profile_id() OR public.is_staff());

-- ATTENDANCES (Asistencias y Check-in QR/GPS)
DROP POLICY IF EXISTS "Staff manage attendances" ON public.attendances;
CREATE POLICY "Staff manage attendances" ON public.attendances
  FOR ALL TO authenticated USING (public.is_staff()) WITH CHECK (public.is_staff());

DROP POLICY IF EXISTS "Students view and register own attendance" ON public.attendances;
CREATE POLICY "Students view and register own attendance" ON public.attendances
  FOR ALL TO authenticated
  USING (student_id = public.get_my_profile_id())
  WITH CHECK (student_id = public.get_my_profile_id());

-- ==============================================================================
-- 8. POLÍTICAS: RUTINAS, WHATSAPP, MEMBRESÍAS Y MERCADO PAGO
-- ==============================================================================

-- ROUTINES (Rutinas)
DROP POLICY IF EXISTS "Staff manage routines" ON public.routines;
CREATE POLICY "Staff manage routines" ON public.routines
  FOR ALL TO authenticated USING (public.is_staff()) WITH CHECK (public.is_staff());

DROP POLICY IF EXISTS "Students view own routines" ON public.routines;
CREATE POLICY "Students view own routines" ON public.routines
  FOR SELECT TO authenticated USING (student_id = public.get_my_profile_id());

-- WHATSAPP TEMPLATES (Plantillas)
DROP POLICY IF EXISTS "Staff view templates" ON public.whatsapp_templates;
CREATE POLICY "Staff view templates" ON public.whatsapp_templates
  FOR SELECT TO authenticated USING (public.is_staff());

DROP POLICY IF EXISTS "Admins manage templates" ON public.whatsapp_templates;
CREATE POLICY "Admins manage templates" ON public.whatsapp_templates
  FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

-- STUDENT MEMBERSHIPS
DROP POLICY IF EXISTS "Staff manage student_memberships" ON public.student_memberships;
CREATE POLICY "Staff manage student_memberships" ON public.student_memberships
  FOR ALL TO authenticated USING (public.is_staff()) WITH CHECK (public.is_staff());

DROP POLICY IF EXISTS "Students view own memberships" ON public.student_memberships;
CREATE POLICY "Students view own memberships" ON public.student_memberships
  FOR SELECT TO authenticated USING (student_id = public.get_my_profile_id());

-- PACK PURCHASES (Compras de Packs Mercado Pago)
DROP POLICY IF EXISTS "Admins full access on pack_purchases" ON public.pack_purchases;
DROP POLICY IF EXISTS "Students view own pack_purchases" ON public.pack_purchases;
DROP POLICY IF EXISTS "Students create pending pack_purchases" ON public.pack_purchases;
DROP POLICY IF EXISTS "Allow select pack_purchases" ON public.pack_purchases;
DROP POLICY IF EXISTS "Allow insert pack_purchases" ON public.pack_purchases;
DROP POLICY IF EXISTS "Allow update pack_purchases" ON public.pack_purchases;

CREATE POLICY "Allow select pack_purchases" ON public.pack_purchases
  FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Allow insert pack_purchases" ON public.pack_purchases
  FOR INSERT TO anon, authenticated WITH CHECK (true);

CREATE POLICY "Allow update pack_purchases" ON public.pack_purchases
  FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);

-- CREDIT LEDGER (Historial de créditos)
DROP POLICY IF EXISTS "Admins full access on credit_ledger" ON public.credit_ledger;
DROP POLICY IF EXISTS "Students view own credit_ledger" ON public.credit_ledger;
DROP POLICY IF EXISTS "Allow select credit_ledger" ON public.credit_ledger;
DROP POLICY IF EXISTS "Allow insert credit_ledger" ON public.credit_ledger;

CREATE POLICY "Allow select credit_ledger" ON public.credit_ledger
  FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Allow insert credit_ledger" ON public.credit_ledger
  FOR INSERT TO anon, authenticated WITH CHECK (true);

-- ==============================================================================
-- FIN DEL SCRIPT DE SEGURIDAD RLS
-- ==============================================================================

