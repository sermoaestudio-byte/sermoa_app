import React, { useState, useEffect, useRef } from 'react';
import { X, CheckCircle2, AlertCircle, Loader2, ShieldCheck, Sparkles, CreditCard } from 'lucide-react';
import { initMercadoPago, Payment } from '@mercadopago/sdk-react';
import confetti from 'canvas-confetti';
import { supabase } from '../../lib/supabase';
import { CreditPack } from '../../types';

interface MercadoPagoModalProps {
  isOpen: boolean;
  onClose: () => void;
  pack: CreditPack | null;
  userId: string;
  userEmail?: string;
  userName?: string;
  onPaymentSuccess?: (creditsAdded: number) => void;
}

export const MercadoPagoModal: React.FC<MercadoPagoModalProps> = ({
  isOpen,
  onClose,
  pack,
  userId,
  userEmail,
  userName,
  onPaymentSuccess,
}) => {
  const [loadingPreference, setLoadingPreference] = useState(true);
  const [preferenceId, setPreferenceId] = useState<string | null>(null);
  const [purchaseId, setPurchaseId] = useState<string | null>(null);
  const [initPoint, setInitPoint] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'approved' | 'rejected'>('idle');

  const onPaymentSuccessRef = useRef(onPaymentSuccess);
  onPaymentSuccessRef.current = onPaymentSuccess;

  const lastFetchedPackIdRef = useRef<string | null>(null);

  // Inicializar Mercado Pago con la clave pública
  useEffect(() => {
    const publicKey = import.meta.env.VITE_MERCADO_PAGO_PUBLIC_KEY;
    if (publicKey && publicKey !== 'tu-public-key-aqui') {
      try {
        initMercadoPago(publicKey, { locale: 'es-AR' });
      } catch (err) {
        console.warn('Mercado Pago ya inicializado o error:', err);
      }
    }
  }, []);

  // Limpiar estado al cerrar modal
  useEffect(() => {
    if (!isOpen) {
      setPreferenceId(null);
      setPurchaseId(null);
      setInitPoint(null);
      setErrorMsg(null);
      setPaymentStatus('idle');
      setLoadingPreference(true);
      lastFetchedPackIdRef.current = null;
    }
  }, [isOpen]);

  // Crear la orden / preferencia al abrir el modal (solo una vez por pack)
  const packId = pack?.id;
  useEffect(() => {
    if (!isOpen || !packId || !userId) return;
    if (preferenceId && lastFetchedPackIdRef.current === packId) return;

    lastFetchedPackIdRef.current = packId;
    let isMounted = true;
    setLoadingPreference(true);
    setErrorMsg(null);
    setPaymentStatus('idle');

    const createPreference = async () => {
      try {
        const origin = window.location.origin;
        const safeBackUrl = origin.includes('localhost') || origin.includes('127.0.0.1')
          ? 'https://sermoa.app'
          : origin;

        // Llamada a la Edge Function
        const { data, error } = await supabase.functions.invoke('create-pack-purchase', {
          body: {
            pack_id: packId,
            user_id: userId,
            payer_email: userEmail || 'alumno@sermoa.app',
            payer_name: userName || 'Alumno Sermoa',
            back_url: safeBackUrl
          }
        });

        if (error || !data?.success) {
          let detailedMsg = data?.error;
          if (error && (error as any).context) {
            try {
              const errBody = await (error as any).context.json();
              detailedMsg = errBody?.details?.message || errBody?.error || errBody?.message || detailedMsg;
            } catch (_) {}
          }
          throw new Error(detailedMsg || error?.message || 'No se pudo generar la orden de pago');
        }

        if (isMounted) {
          setPreferenceId(data.preference_id);
          setPurchaseId(data.purchase_id);
          setInitPoint(data.sandbox_init_point || data.init_point);
          setLoadingPreference(false);
        }
      } catch (err: any) {
        console.error('Error al inicializar pago con Mercado Pago:', err);
        if (isMounted) {
          setErrorMsg(err.message || 'Error al conectar con la pasarela de pagos.');
          setLoadingPreference(false);
        }
      }
    };

    createPreference();

    return () => {
      isMounted = false;
    };
  }, [isOpen, packId, userId, preferenceId]);

  // Escuchar en tiempo real la confirmación del Webhook
  useEffect(() => {
    if (!purchaseId) return;

    const channel = supabase
      .channel(`purchase-${purchaseId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'pack_purchases',
          filter: `id=eq.${purchaseId}`
        },
        (payload: any) => {
          const newStatus = payload.new.status;
          if (newStatus === 'paid') {
            setPaymentStatus('approved');
            confetti({
              particleCount: 80,
              spread: 70,
              origin: { y: 0.6 }
            });

            if (onPaymentSuccessRef.current && pack) {
              onPaymentSuccessRef.current(pack.credits_count);
            }
          } else if (newStatus === 'rejected') {
            setPaymentStatus('rejected');
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [purchaseId, pack?.credits_count]);

  if (!isOpen || !pack) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-6 bg-slate-900 text-white flex items-center justify-between shrink-0 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10">
            <div className="flex items-center space-x-2 text-[10px] uppercase font-bold tracking-widest text-emerald-400 mb-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Pago Seguro con Mercado Pago</span>
            </div>
            <h2 className="text-xl font-extrabold text-white">
              {pack.name}
            </h2>
            <p className="text-xs text-slate-300 mt-0.5">
              {pack.credits_count} clases disponibles • Vigencia {pack.validity_days} días
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center transition-all shrink-0 z-10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Total a abonar */}
        <div className="bg-slate-50 px-6 py-3 border-b border-slate-200/80 flex items-center justify-between">
          <span className="text-xs font-bold text-slate-600">Total a abonar</span>
          <span className="text-lg font-black text-slate-900 tracking-tight">
            ${Number(pack.price).toLocaleString('es-AR')} ARS
          </span>
        </div>

        {/* Contenido / Estado */}
        <div className="p-6 overflow-y-auto flex-1">
          {paymentStatus === 'approved' ? (
            <div className="text-center py-8 animate-fade-in">
              <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-4 shadow-sm">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-extrabold text-slate-900 mb-2">
                ¡Pago Confirmado con Éxito!
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed mb-6">
                Se acreditaron <strong>{pack.credits_count} créditos</strong> en tu cuenta. Ya puedes reservar tus clases.
              </p>
              <button
                onClick={onClose}
                className="w-full py-3.5 bg-slate-900 hover:bg-black text-white text-xs font-extrabold rounded-2xl transition-all shadow-md"
              >
                Volver a la App y Reservar
              </button>
            </div>
          ) : paymentStatus === 'rejected' ? (
            <div className="text-center py-8 animate-fade-in">
              <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-4 shadow-sm">
                <AlertCircle className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-extrabold text-slate-900 mb-2">
                El pago no pudo ser procesado
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-6">
                Mercado Pago no pudo autorizar la transacción. Por favor intenta con otro medio de pago.
              </p>
              <button
                onClick={() => setPaymentStatus('idle')}
                className="w-full py-3.5 bg-slate-900 hover:bg-black text-white text-xs font-extrabold rounded-2xl transition-all shadow-md"
              >
                Reintentar Pago
              </button>
            </div>
          ) : loadingPreference ? (
            <div className="py-12 flex flex-col items-center justify-center text-center space-y-3">
              <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
              <p className="text-xs font-medium text-slate-500">
                Conectando de forma segura con Mercado Pago...
              </p>
            </div>
          ) : errorMsg ? (
            <div className="py-6 text-center">
              <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-amber-800 text-xs mb-4 text-left leading-relaxed">
                <strong>Aviso:</strong> {errorMsg}
              </div>

              {/* Botón de contingencia con redirección si el brick falla */}
              {initPoint && (
                <a
                  href={initPoint}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-2xl transition-all shadow-md mb-2"
                >
                  Continuar en la web de Mercado Pago
                </a>
              )}

              <button
                onClick={onClose}
                className="text-xs font-bold text-slate-500 hover:text-slate-800 mt-2"
              >
                Cerrar
              </button>
            </div>
          ) : preferenceId ? (
            <div className="space-y-4">
              {/* Contenedor del Payment Brick */}
              <div id="paymentBrick_container" className="min-h-[280px]">
                <Payment
                  initialization={{ amount: Number(pack.price), preferenceId }}
                  customization={{
                    paymentMethods: {
                      creditCard: 'all',
                      debitCard: 'all',
                      ticket: 'all',
                      mercadoPago: 'all',
                    },
                    visual: {
                      style: {
                        theme: 'default'
                      }
                    }
                  }}
                  onSubmit={async () => {
                    setPaymentStatus('processing');
                  }}
                  onError={(error) => {
                    console.error('Error en Payment Brick:', error);
                  }}
                />
              </div>

              {paymentStatus === 'processing' && (
                <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-emerald-800 text-xs flex items-center space-x-3">
                  <Loader2 className="w-5 h-5 animate-spin shrink-0 text-emerald-600" />
                  <span>Estamos esperando la confirmación de Mercado Pago. Tus créditos se activarán automáticamente.</span>
                </div>
              )}
            </div>
          ) : null}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
          <span>Transacción encriptada SSL 256-bit</span>
          <span className="font-bold text-slate-600">SERMOA Studio</span>
        </div>

      </div>
    </div>
  );
};
