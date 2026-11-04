import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0";
import { corsHeaders } from "../_shared/cors.ts";

interface BookClassPayload {
  studio_id: string;
  student_id: string;
  class_id: string;
  booking_date: string; // YYYY-MM-DD
  booking_id?: string;
}

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

serve(async (req) => {
  // 1. Manejo de Pre-flight CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ success: false, error: 'Método no permitido. Utilice POST.' }),
      { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  try {
    // 2. Extraer y verificar cabecera de autenticación
    const authHeader = req.headers.get('Authorization') || req.headers.get('authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ success: false, error: 'Cabecera Authorization faltante. Se requiere sesión autenticada.' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const token = authHeader.replace(/^Bearer\s+/i, '').trim();
    if (!token) {
      return new Response(
        JSON.stringify({ success: false, error: 'Token Bearer inválido o vacío.' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 3. Variables de entorno seguras del servidor (Supabase Edge runtime)
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';

    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('Error de configuración: Faltan variables SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY en el servidor.');
      return new Response(
        JSON.stringify({ success: false, error: 'Configuración interna del servidor incompleta.' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Cliente seguro con service_role (aislado estrictamente en el backend)
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

    // 4. Validar token contra Supabase Auth
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
    if (authError || !user) {
      return new Response(
        JSON.stringify({ success: false, error: 'Sesión no válida o expirada. Por favor inicie sesión nuevamente.' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 5. Parsear y validar payload de entrada
    let body: BookClassPayload;
    try {
      body = await req.json();
    } catch {
      return new Response(
        JSON.stringify({ success: false, error: 'Cuerpo de solicitud JSON inválido o malformado.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { studio_id, student_id, class_id, booking_date, booking_id } = body;

    // Validación de presencia y formato
    if (!studio_id || !UUID_REGEX.test(studio_id)) {
      return new Response(
        JSON.stringify({ success: false, error: 'studio_id inválido o ausente. Debe ser un UUID válido.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!student_id || !UUID_REGEX.test(student_id)) {
      return new Response(
        JSON.stringify({ success: false, error: 'student_id inválido o ausente. Debe ser un UUID válido.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!class_id || !UUID_REGEX.test(class_id)) {
      return new Response(
        JSON.stringify({ success: false, error: 'class_id inválido o ausente. Debe ser un UUID válido.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!booking_date || !DATE_REGEX.test(booking_date)) {
      return new Response(
        JSON.stringify({ success: false, error: 'booking_date inválido o ausente. Debe tener formato YYYY-MM-DD.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (booking_id && !UUID_REGEX.test(booking_id)) {
      return new Response(
        JSON.stringify({ success: false, error: 'booking_id provisto no es un UUID válido.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 6. Autorización estricta de identidad y roles:
    // Obtener los perfiles del usuario autenticado en este estudio
    const { data: callerProfiles, error: callerErr } = await supabaseAdmin
      .from('profiles')
      .select('id, studio_id, role, auth_user_id')
      .eq('auth_user_id', user.id)
      .eq('studio_id', studio_id);

    if (callerErr) {
      console.error('Error consultando perfil del usuario autenticado:', callerErr);
      return new Response(
        JSON.stringify({ success: false, error: 'Error interno verificando permisos de usuario.' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!callerProfiles || callerProfiles.length === 0) {
      return new Response(
        JSON.stringify({ success: false, error: 'No tienes un perfil registrado en el estudio solicitado.' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Determinar si el usuario que llama es administrador del estudio
    const isAdmin = callerProfiles.some((p: any) => p.role === 'admin');

    // Determinar si el usuario está operando sobre su propio perfil de alumno
    const isSelf = callerProfiles.some((p: any) => p.id === student_id);

    if (!isAdmin && !isSelf) {
      // Bloqueo preventivo de suplantación de identidad
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Operación no autorizada. No tienes permisos para gestionar reservas en nombre de otro alumno.'
        }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 7. Invocar la función SQL transaccional atómica fn_book_class_fefo
    const rpcParams: Record<string, any> = {
      p_studio_id: studio_id,
      p_student_id: student_id,
      p_class_id: class_id,
      p_booking_date: booking_date,
    };

    if (booking_id) {
      rpcParams.p_booking_id = booking_id;
    }

    const { data: rpcResult, error: rpcError } = await supabaseAdmin.rpc('fn_book_class_fefo', rpcParams);

    if (rpcError) {
      console.warn('Error en ejecución de fn_book_class_fefo:', rpcError.message);
      // Mapear mensajes de negocio amigables
      return new Response(
        JSON.stringify({
          success: false,
          error: rpcError.message || 'Error al procesar la reserva en la base de datos.'
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 8. Respuesta estructurada exitosa
    return new Response(
      JSON.stringify({
        success: true,
        data: rpcResult
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (err: any) {
    console.error('Error inesperado en Edge Function book-class:', err);
    return new Response(
      JSON.stringify({ success: false, error: 'Error interno del servidor', message: err?.message || String(err) }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
