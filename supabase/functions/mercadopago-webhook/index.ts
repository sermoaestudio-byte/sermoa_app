import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0";
import { corsHeaders } from "../_shared/cors.ts";

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    let paymentId = url.searchParams.get('data.id') || url.searchParams.get('id');
    let topic = url.searchParams.get('type') || url.searchParams.get('topic');

    // Si viene en el body JSON
    if (!paymentId && req.method === 'POST') {
      try {
        const body = await req.json();
        if (body?.data?.id) paymentId = String(body.data.id);
        if (body?.type) topic = body.type;
        if (body?.action?.startsWith('payment')) topic = 'payment';
      } catch (_) {
        // En caso de que el body no sea un JSON válido
      }
    }

    // Mercado Pago a veces envía pings de prueba sin paymentId
    if (!paymentId) {
      console.log('Webhook ping recibido sin ID de pago:', req.url);
      return new Response('PING_OK', { status: 200, headers: corsHeaders });
    }

    const mpAccessToken = Deno.env.get('MP_ACCESS_TOKEN');
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';

    if (!mpAccessToken) {
      console.error('MP_ACCESS_TOKEN no configurado en los secrets de Supabase');
      return new Response('Missing MP_ACCESS_TOKEN', { status: 500 });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // 1. Consultar a Mercado Pago el estado real del pago
    console.log(`Consultando pago ${paymentId} a Mercado Pago...`);
    const mpRes = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
      headers: {
        'Authorization': `Bearer ${mpAccessToken}`
      }
    });

    if (!mpRes.ok) {
      console.error(`Error al consultar pago ${paymentId} en MP:`, await mpRes.text());
      return new Response('Error querying MP', { status: 200 }); // Retornamos 200 para evitar reintentos infinitos si el id no existe
    }

    const payment = await mpRes.json();
    const purchaseId = payment.external_reference;
    const status = payment.status; // 'approved', 'pending', 'rejected', 'cancelled'

    console.log(`Pago ${paymentId} obtenido. Estado: ${status}, PurchaseId: ${purchaseId}`);

    if (!purchaseId) {
      console.warn(`El pago ${paymentId} no tiene external_reference asociada.`);
      return new Response('No external reference', { status: 200 });
    }

    // 2. Procesar según el estado
    if (status === 'approved') {
      // Llamar a la función SQL segura que garantiza idempotencia
      const { data, error } = await supabase.rpc('accredit_pack_purchase', {
        p_purchase_id: purchaseId,
        p_mp_payment_id: String(payment.id)
      });

      if (error) {
        console.error(`Error al ejecutar accredit_pack_purchase para ${purchaseId}:`, error);
        return new Response('Database error', { status: 500 });
      }

      console.log(`¡Compra ${purchaseId} acreditada exitosamente!`);
    } else if (status === 'rejected' || status === 'cancelled') {
      await supabase
        .from('pack_purchases')
        .update({
          status: status,
          mp_payment_id: String(payment.id)
        })
        .eq('id', purchaseId);

      console.log(`Compra ${purchaseId} actualizada a estado: ${status}`);
    }

    // Siempre responder 200 a Mercado Pago para confirmar recepción
    return new Response('OK', { status: 200, headers: corsHeaders });

  } catch (err: any) {
    console.error('Error no controlado en el webhook de Mercado Pago:', err);
    return new Response(`Server error: ${err.message}`, { status: 500 });
  }
});
