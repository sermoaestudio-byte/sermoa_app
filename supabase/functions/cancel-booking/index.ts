import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0";
import { corsHeaders } from "../_shared/cors.ts";

interface CancelBookingPayload {
  studio_id: string;
  booking_id: string;
}

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

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
    let body: CancelBookingPayload;
    try {
      body = await req.json();
    } catch {
      return new Response(
        JSON.stringify({ success: false, error: 'Cuerpo de solicitud JSON inválido o malformado.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { studio_id, booking_id } = body;

    // Validación de presencia y formato UUID
    if (!studio_id || !UUID_REGEX.test(studio_id)) {
      return new Response(
        JSON.stringify({ success: false, error: 'studio_id inválido o ausente. Debe ser un UUID válido.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!booking_id || !UUID_REGEX.test(booking_id)) {
      return new Response(
        JSON.stringify({ success: false, error: 'booking_id inválido o ausente. Debe ser un UUID válido.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 6. Obtener la reserva para verificar a quién pertenece antes de autorizar
    const { data: targetBooking, error: bookingErr } = await supabaseAdmin
      .from('bookings')
      .select('id, studio_id, student_id, status')
      .eq('id', booking_id)
      .eq('studio_id', studio_id)
      .maybeSingle();

    if (bookingErr) {
      console.error('Error al consultar la reserva:', bookingErr);
      return new Response(
        JSON.stringify({ success: false, error: 'Error interno al consultar la reserva solicitada.' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!targetBooking) {
      return new Response(
        JSON.stringify({ success: false, error: 'La reserva solicitada no existe o no pertenece al estudio indicado.' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 7. Autorización estricta de identidad y roles:
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
        JSON.stringify({ success: false, error: 'No tienes un perfil registrado en el estudio correspondiente.' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Determinar si el usuario que llama es administrador del estudio
    const isAdmin = callerProfiles.some((p: any) => p.role === 'admin');

    // Determinar si el usuario es el titular de la reserva
    const isOwner = callerProfiles.some((p: any) => p.id === targetBooking.student_id);

    if (!isAdmin && !isOwner) {
      // Bloqueo de suplantación o interferencia con reservas de otros alumnos
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Operación no autorizada. No tienes permisos para cancelar reservas de otro alumno.'
        }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 8. Invocar la función SQL transaccional atómica fn_cancel_booking_refund
    const { data: rpcResult, error: rpcError } = await supabaseAdmin.rpc('fn_cancel_booking_refund', {
      p_studio_id: studio_id,
      p_booking_id: booking_id,
    });

    if (rpcError) {
      console.warn('Error en ejecución de fn_cancel_booking_refund:', rpcError.message);
      return new Response(
        JSON.stringify({
          success: false,
          error: rpcError.message || 'Error al procesar la cancelación en la base de datos.'
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 9. Respuesta estructurada exitosa
    return new Response(
      JSON.stringify({
        success: true,
        data: rpcResult
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (err: any) {
    console.error('Error inesperado en Edge Function cancel-booking:', err);
    return new Response(
      JSON.stringify({ success: false, error: 'Error interno del servidor', message: err?.message || String(err) }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
