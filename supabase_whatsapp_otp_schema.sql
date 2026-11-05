-- ==============================================================================
-- SERMOA FIT / AGENDAFIT - RECUPERACIÓN DE CONTRASEÑA POR WHATSAPP (OTP)
-- ==============================================================================

-- 1. Asegurar extensión pgcrypto para hashing de contraseñas y generación de UUIDs
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Tabla para almacenar códigos OTP de 6 dígitos
CREATE TABLE IF NOT EXISTS public.password_reset_codes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    identifier TEXT NOT NULL, -- Teléfono o Email ingresado
    phone TEXT,
    email TEXT,
    code VARCHAR(6) NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    used BOOLEAN DEFAULT FALSE,
    attempts INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices de consulta rápida
CREATE INDEX IF NOT EXISTS idx_pwd_reset_identifier ON public.password_reset_codes(identifier);
CREATE INDEX IF NOT EXISTS idx_pwd_reset_code ON public.password_reset_codes(code);
CREATE INDEX IF NOT EXISTS idx_pwd_reset_expires ON public.password_reset_codes(expires_at);

-- 3. Habilitar RLS
ALTER TABLE public.password_reset_codes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow anonymous reset code insertion and selection" ON public.password_reset_codes;
CREATE POLICY "Allow anonymous reset code insertion and selection"
    ON public.password_reset_codes
    FOR ALL
    TO anon, authenticated
    USING (true)
    WITH CHECK (true);

-- 4. RPC: Solicitar código OTP (por WhatsApp / Email)
CREATE OR REPLACE FUNCTION public.request_whatsapp_otp(
    p_identifier TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_clean_id TEXT;
    v_clean_digits TEXT;
    v_profile RECORD;
    v_code VARCHAR(6);
    v_expires_at TIMESTAMP WITH TIME ZONE;
BEGIN
    v_clean_id := lower(trim(p_identifier));
    v_clean_digits := regexp_replace(v_clean_id, '[^0-9]', '', 'g');

    -- Buscar en perfiles por email o por coincidencia numérica de teléfono
    SELECT * INTO v_profile
    FROM public.profiles
    WHERE lower(email) = v_clean_id
       OR (v_clean_digits <> '' AND regexp_replace(phone, '[^0-9]', '', 'g') LIKE '%' || v_clean_digits || '%')
    ORDER BY 
       CASE WHEN role = 'admin' THEN 1 WHEN role = 'instructor' THEN 2 ELSE 3 END
    LIMIT 1;

    IF v_profile IS NULL THEN
        RETURN jsonb_build_object(
            'success', false,
            'message', 'No encontramos ninguna cuenta asociada al celular o email ingresado.'
        );
    END IF;

    -- Generar código aleatorio de 6 dígitos (100000 - 999999)
    v_code := lpad(floor(random() * 900000 + 100000)::text, 6, '0');
    v_expires_at := now() + interval '10 minutes';

    -- Invalidar códigos anteriores no usados para este identificador o perfil
    UPDATE public.password_reset_codes
    SET used = true
    WHERE (profile_id = v_profile.id OR identifier = v_clean_id) AND used = false;

    -- Insertar nuevo código OTP
    INSERT INTO public.password_reset_codes (
        profile_id,
        identifier,
        phone,
        email,
        code,
        expires_at
    ) VALUES (
        v_profile.id,
        v_clean_id,
        v_profile.phone,
        v_profile.email,
        v_code,
        v_expires_at
    );

    RETURN jsonb_build_object(
        'success', true,
        'message', 'Código de verificación generado con éxito.',
        'phone', v_profile.phone,
        'email', v_profile.email,
        'name', v_profile.first_name,
        'code', v_code -- Retornado para pruebas directas hasta enlazar la API de Meta
    );
END;
$$;

-- 5. RPC: Validar código OTP y actualizar contraseña en Supabase Auth
CREATE OR REPLACE FUNCTION public.verify_and_update_password_otp(
    p_identifier TEXT,
    p_code TEXT,
    p_new_password TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_clean_id TEXT;
    v_clean_digits TEXT;
    v_record RECORD;
    v_profile RECORD;
    v_auth_user_id UUID;
BEGIN
    v_clean_id := lower(trim(p_identifier));
    v_clean_digits := regexp_replace(v_clean_id, '[^0-9]', '', 'g');

    -- Buscar código activo y vigente
    SELECT * INTO v_record
    FROM public.password_reset_codes
    WHERE code = trim(p_code)
      AND used = false
      AND expires_at > now()
      AND (
          identifier = v_clean_id
          OR lower(email) = v_clean_id
          OR (v_clean_digits <> '' AND regexp_replace(phone, '[^0-9]', '', 'g') LIKE '%' || v_clean_digits || '%')
      )
    ORDER BY created_at DESC
    LIMIT 1;

    IF v_record IS NULL THEN
        RETURN jsonb_build_object(
            'success', false,
            'message', 'El código de verificación es inválido o ha expirado.'
        );
    END IF;

    -- Obtener perfil
    SELECT * INTO v_profile
    FROM public.profiles
    WHERE id = v_record.profile_id;

    IF v_profile IS NULL THEN
        RETURN jsonb_build_object(
            'success', false,
            'message', 'No se encontró el perfil de usuario asociado.'
        );
    END IF;

    -- Buscar auth_user_id
    v_auth_user_id := v_profile.auth_user_id;

    IF v_auth_user_id IS NULL THEN
        SELECT id INTO v_auth_user_id
        FROM auth.users
        WHERE lower(email) = lower(v_profile.email);
    END IF;

    -- Actualizar contraseña en auth.users usando el hash Blowfish de Supabase
    IF v_auth_user_id IS NOT NULL THEN
        UPDATE auth.users
        SET encrypted_password = crypt(p_new_password, gen_salt('bf')),
            updated_at = now()
        WHERE id = v_auth_user_id;

        -- Sincronizar referencia en profiles si hiciera falta
        UPDATE public.profiles
        SET auth_user_id = v_auth_user_id
        WHERE id = v_profile.id;
    END IF;

    -- Marcar el código OTP como utilizado
    UPDATE public.password_reset_codes
    SET used = true
    WHERE id = v_record.id;

    RETURN jsonb_build_object(
        'success', true,
        'message', 'Tu contraseña se ha restablecido exitosamente.'
    );
END;
$$;

-- 6. Conceder permisos de ejecución para anon y authenticated
GRANT EXECUTE ON FUNCTION public.request_whatsapp_otp(TEXT) TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.verify_and_update_password_otp(TEXT, TEXT, TEXT) TO anon, authenticated, service_role;

