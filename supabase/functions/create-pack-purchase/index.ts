import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0";
import { corsHeaders } from "../_shared/cors.ts";

serve(async (req) => {
  // Manejo de pre-flight CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { pack_id, user_id, payer_email, payer_name, back_url } = await req.json();

    if (!pack_id || !user_id) {
      return new Response(
        JSON.stringify({ error: 'Faltan parámetros requeridos: pack_id y user_id' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
    const mpAccessToken = Deno.env.get('MP_ACCESS_TOKEN');

    if (!mpAccessToken) {
      return new Response(
        JSON.stringify({ error: 'MP_ACCESS_TOKEN no configurado en los secrets de Supabase' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // 1. Obtener datos del pack
    const { data: pack, error: packError } = await supabase
      .from('credit_packs')
      .select('*')
      .eq('id', pack_id)
      .single();

    if (packError || !pack) {
      return new Response(
        JSON.stringify({ error: 'El pack seleccionado no existe o no está disponible' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 1.5 Verificar que el perfil de usuario exista en profiles (evita fallo de foreign key)
    const { data: userProfile } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', user_id)
      .maybeSingle();

    if (!userProfile) {
      const { error: profileUpsertError } = await supabase.from('profiles').upsert({
        id: user_id,
        studio_id: pack.studio_id,
        role: 'client',
        status: 'pending_approval',
        first_name: payer_name ? payer_name.split(' ')[0] : 'Alumno',
        last_name: payer_name && payer_name.includes(' ') ? payer_name.split(' ').slice(1).join(' ') : 'Sermoa',
        email: payer_email || 'alumno@sermoa.app',
        phone: '5491100000000',
        credits_balance: 0,
        debt_amount: 0,
        has_medical_certificate: false
      }, { onConflict: 'id' });

      if (profileUpsertError) {
        console.error('Error creating fallback profile:', profileUpsertError);
      }
    }

    // 2. Crear registro de compra en estado 'pending'
    const { data: purchase, error: purchaseError } = await supabase
      .from('pack_purchases')
      .insert({
        studio_id: pack.studio_id,
        user_id: user_id,
        pack_id: pack_id,
        credits: pack.credits_count,
        amount: pack.price,
        status: 'pending'
      })
      .select()
      .single();

    if (purchaseError || !purchase) {
      return new Response(
        JSON.stringify({ error: 'Error al registrar la compra en la base de datos', details: purchaseError }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 3. Crear la preferencia en Mercado Pago
    const webhookUrl = `${supabaseUrl}/functions/v1/mercadopago-webhook`;
    
    // Mercado Pago rechaza localhost en back_urls cuando auto_return está activo
    const isLocal = !back_url || back_url.includes('localhost') || back_url.includes('127.0.0.1');
    const safeBackUrl = isLocal ? 'https://sermoa.app' : back_url;

    const preferencePayload: any = {
      items: [
        {
          id: pack.id,
          title: `SERMOA - ${pack.name}`,
          description: pack.description || `${pack.credits_count} créditos para clases de Pilates`,
          quantity: 1,
          currency_id: 'ARS',
          unit_price: Number(pack.price)
        }
      ],
      payer: {
        email: payer_email || 'alumno@sermoa.app',
        name: payer_name || 'Alumno Sermoa'
      },
      external_reference: purchase.id,
      notification_url: webhookUrl,
      back_urls: {
        success: `${safeBackUrl}?status=success&purchase_id=${purchase.id}`,
        failure: `${safeBackUrl}?status=failure&purchase_id=${purchase.id}`,
        pending: `${safeBackUrl}?status=pending&purchase_id=${purchase.id}`
      }
    };

    if (!isLocal && safeBackUrl.startsWith('https://')) {
      preferencePayload.auto_return = 'approved';
    }

    const mpRes = await fetch('https://api.mercadopago.com/checkout/preferences', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${mpAccessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(preferencePayload)
    });

    const mpData = await mpRes.json();

    if (!mpRes.ok) {
      return new Response(
        JSON.stringify({ error: 'Error devuelto por la API de Mercado Pago', details: mpData }),
        { status: mpRes.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 4. Actualizar la compra con el preference_id y external_reference
    await supabase
      .from('pack_purchases')
      .update({
        mp_preference_id: mpData.id,
        external_reference: purchase.id
      })
      .eq('id', purchase.id);

    return new Response(
      JSON.stringify({
        success: true,
        purchase_id: purchase.id,
        preference_id: mpData.id,
        init_point: mpData.init_point,
        sandbox_init_point: mpData.sandbox_init_point
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: 'Error interno del servidor', message: err.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
