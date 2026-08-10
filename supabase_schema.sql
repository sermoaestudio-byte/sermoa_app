-- ==============================================================================
-- SERMOA FIT / AGENDAFIT NEXT - SUPABASE SCHEMA DEFINITION (FASE 2)
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. STUDIOS (Multi-tenant)
CREATE TABLE IF NOT EXISTS studios (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    logo_url TEXT,
    phone VARCHAR(50),
    email VARCHAR(255),
    description TEXT,
    currency VARCHAR(10) DEFAULT 'ARS',
    cancellation_window_hours INT DEFAULT 2,
    gps_checkin_radius_meters INT DEFAULT 75,
    trial_days_remaining INT DEFAULT 29,
    plan_tier VARCHAR(50) DEFAULT 'STARTER', -- STARTER, PRO, ENTERPRISE
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. BRANCHES (Sucursales con Geofencing GPS)
CREATE TABLE IF NOT EXISTS branches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    studio_id UUID REFERENCES studios(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    address TEXT NOT NULL,
    city VARCHAR(100),
    phone VARCHAR(50),
    latitude DOUBLE PRECISION NOT NULL, -- Coordenadas GPS para Check-in
    longitude DOUBLE PRECISION NOT NULL,
    opening_hours TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. ROOMS (Salas físicas por sucursal)
CREATE TABLE IF NOT EXISTS rooms (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    branch_id UUID REFERENCES branches(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    capacity INT NOT NULL DEFAULT 12,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. PROFILES (Usuarios: Admins, Profesores, Alumnos)
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    studio_id UUID REFERENCES studios(id) ON DELETE CASCADE,
    auth_user_id UUID, -- Referencia a auth.users de Supabase
    role VARCHAR(50) NOT NULL DEFAULT 'client', -- 'admin', 'instructor', 'client'
    status VARCHAR(50) NOT NULL DEFAULT 'active', -- 'active', 'pending_approval', 'inactive', 'rejected'
    first_name VARCHAR(150) NOT NULL,
    last_name VARCHAR(150) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL, -- Número con código de país para WhatsApp (ej: 5491123456789)
    avatar_url TEXT,
    id_number VARCHAR(50), -- DNI / Cédula
    birth_date DATE,
    emergency_contact_name VARCHAR(150),
    emergency_contact_phone VARCHAR(50),
    medical_notes TEXT, -- Observaciones médicas, lesiones, etc.
    has_medical_certificate BOOLEAN DEFAULT FALSE,
    credits_balance INT DEFAULT 0,
    debt_amount DECIMAL(10, 2) DEFAULT 0.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. ACTIVITIES (Disciplinas: Pilates Reformer, Yoga, Funcional, etc.)
CREATE TABLE IF NOT EXISTS activities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    studio_id UUID REFERENCES studios(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    color VARCHAR(20) DEFAULT '#54875e',
    default_duration_minutes INT DEFAULT 60,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. INSTRUCTORS (Detalle adicional de profesores)
CREATE TABLE IF NOT EXISTS instructor_details (
    profile_id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
    specialties TEXT[],
    commission_per_class DECIMAL(10, 2) DEFAULT 0.00,
    bio TEXT,
    is_active BOOLEAN DEFAULT TRUE
);

-- 7. CLASSES & SCHEDULES (Clases y Horarios)
CREATE TABLE IF NOT EXISTS classes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    studio_id UUID REFERENCES studios(id) ON DELETE CASCADE,
    branch_id UUID REFERENCES branches(id) ON DELETE CASCADE,
    room_id UUID REFERENCES rooms(id) ON DELETE SET NULL,
    activity_id UUID REFERENCES activities(id) ON DELETE RESTRICT,
    instructor_id UUID REFERENCES profiles(id) ON DELETE RESTRICT,
    title VARCHAR(255) NOT NULL,
    day_of_week INT NOT NULL, -- 0=Domingo, 1=Lunes, ... 6=Sábado
    start_time TIME NOT NULL, -- ej: 08:00
    end_time TIME NOT NULL,   -- ej: 09:00
    date DATE,                -- Opcional si es clase única, null si es semanal recurrente
    max_capacity INT NOT NULL DEFAULT 10,
    is_recurring BOOLEAN DEFAULT TRUE,
    is_cancelled BOOLEAN DEFAULT FALSE,
    color VARCHAR(20) DEFAULT '#54875e',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. BOOKINGS (Reservas de Alumnos)
CREATE TABLE IF NOT EXISTS bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    class_id UUID REFERENCES classes(id) ON DELETE CASCADE,
    student_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    booking_date DATE NOT NULL,
    status VARCHAR(50) DEFAULT 'confirmed', -- 'confirmed', 'cancelled_by_user', 'cancelled_by_admin', 'attended', 'no_show'
    credit_deducted BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    cancelled_at TIMESTAMP WITH TIME ZONE,
    UNIQUE(class_id, student_id, booking_date)
);

-- 9. WAITLIST (Listas de espera automáticas)
CREATE TABLE IF NOT EXISTS waitlist (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    class_id UUID REFERENCES classes(id) ON DELETE CASCADE,
    student_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    booking_date DATE NOT NULL,
    position INT NOT NULL,
    status VARCHAR(50) DEFAULT 'waiting', -- 'waiting', 'promoted', 'expired', 'cancelled'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    promoted_at TIMESTAMP WITH TIME ZONE,
    UNIQUE(class_id, student_id, booking_date)
);

-- 10. CREDIT PACKS & PLANS (Planes y Packs de Créditos)
CREATE TABLE IF NOT EXISTS credit_packs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    studio_id UUID REFERENCES studios(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    credits_count INT NOT NULL, -- ej: 8 clases, 12 clases, 9999 para pase libre
    price DECIMAL(10, 2) NOT NULL,
    validity_days INT NOT NULL DEFAULT 30,
    is_recurring_monthly BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 11. STUDENT MEMBERSHIPS (Membresías activas de alumnos)
CREATE TABLE IF NOT EXISTS student_memberships (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    pack_id UUID REFERENCES credit_packs(id) ON DELETE RESTRICT,
    credits_total INT NOT NULL,
    credits_remaining INT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status VARCHAR(50) DEFAULT 'active', -- 'active', 'expired', 'consumed'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 12. PAYMENTS & TRANSACTIONS (Historial Financiero y Movimientos)
CREATE TABLE IF NOT EXISTS payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    studio_id UUID REFERENCES studios(id) ON DELETE CASCADE,
    student_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    pack_id UUID REFERENCES credit_packs(id) ON DELETE SET NULL,
    amount DECIMAL(10, 2) NOT NULL,
    payment_type VARCHAR(50) NOT NULL, -- 'income' (ingreso), 'expense' (gasto)
    payment_method VARCHAR(50) NOT NULL, -- 'mercadopago', 'cash', 'transfer', 'card'
    concept VARCHAR(255) NOT NULL,
    status VARCHAR(50) DEFAULT 'completed', -- 'completed', 'pending', 'refunded'
    reference_code VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 13. ATTENDANCES & QR CHECK-INS (Control de Asistencia y Validación GPS)
CREATE TABLE IF NOT EXISTS attendances (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
    student_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    class_id UUID REFERENCES classes(id) ON DELETE CASCADE,
    checkin_method VARCHAR(50) DEFAULT 'qr_gps', -- 'qr_gps', 'manual_instructor', 'manual_admin'
    verified_latitude DOUBLE PRECISION,
    verified_longitude DOUBLE PRECISION,
    distance_meters INT, -- Distancia calculada en metros a la sucursal
    status VARCHAR(50) DEFAULT 'present', -- 'present', 'late', 'absent_with_notice', 'no_show'
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 14. ROUTINES & EXERCISES (Módulo de Rutinas)
CREATE TABLE IF NOT EXISTS routines (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    studio_id UUID REFERENCES studios(id) ON DELETE CASCADE,
    student_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    instructor_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL,
    goal VARCHAR(255),
    exercises JSONB NOT NULL DEFAULT '[]'::JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 15. WHATSAPP TEMPLATES (Plantillas de Mensajes Automáticos)
CREATE TABLE IF NOT EXISTS whatsapp_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    studio_id UUID REFERENCES studios(id) ON DELETE CASCADE,
    code VARCHAR(50) NOT NULL, -- 'welcome_approved', 'class_reminder', 'waitlist_promoted', 'debt_reminder', 'booking_confirmed'
    title VARCHAR(255) NOT NULL,
    template_text TEXT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(studio_id, code)
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
ALTER TABLE studios ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendances ENABLE ROW LEVEL SECURITY;

-- Admins can read/write everything in their studio
CREATE POLICY "Admins full access" ON profiles
    FOR ALL USING (
        auth.uid() IN (
            SELECT auth_user_id FROM profiles WHERE role = 'admin' AND studio_id = profiles.studio_id
        )
    );

-- Students can read classes and manage their own bookings
CREATE POLICY "Students can view classes" ON classes
    FOR SELECT USING (true);

CREATE POLICY "Students can manage own bookings" ON bookings
    FOR ALL USING (
        auth.uid() = (SELECT auth_user_id FROM profiles WHERE id = bookings.student_id)
    );
