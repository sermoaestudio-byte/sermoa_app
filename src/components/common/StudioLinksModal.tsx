import React, { useState } from 'react';
import {
  X,
  Share2,
  Copy,
  Check,
  ExternalLink,
  Instagram,
  MessageCircle,
  QrCode,
  Sparkles,
  Smartphone,
  ShieldCheck,
  Globe
} from 'lucide-react';
import { useStudioStore } from '../../store/studioStore';

interface StudioLinksModalProps {
  onClose: () => void;
  onOpenQRPoster: () => void;
}

export const StudioLinksModal: React.FC<StudioLinksModalProps> = ({
  onClose,
  onOpenQRPoster,
}) => {
  const { studio } = useStudioStore();

  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://sermoa.app';
  const registerUrl = `${baseUrl}/#registro`;
  const portalUrl = `${baseUrl}/#portal-alumno`;

  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const instagramBioText = `✨ ${studio.name} | Pilates Reformer & Movimiento Consciente\n📲 ¡Solicita tu ingreso y completa tu ficha médica aquí!\n👉 ${registerUrl}`;
  const whatsappActiveStudentText = `¡Hola! 👋 Ya puedes ingresar a consultar y reservar tus clases desde tu Portal SERMOA aquí: ${portalUrl}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-100 flex flex-col">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-start justify-between bg-slate-50/80 sticky top-0 z-20">
          <div className="flex items-start space-x-3.5 pr-4">
            <div className="w-11 h-11 rounded-2xl bg-brand-50 text-brand-700 flex items-center justify-center font-bold text-lg shrink-0 shadow-xs border border-brand-100">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-brand-700 bg-brand-100/60 px-2 py-0.5 rounded-full border border-brand-200">
                Difusión & Captación
              </span>
              <h3 className="text-xl font-black text-slate-900 mt-1 leading-snug">
                Centro de Enlaces Oficiales
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Copia y comparte los enlaces para redes sociales, WhatsApp y alumnos
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 flex-1 text-xs">
          
          {/* 1. LINK DE INSCRIPCIÓN / REDES SOCIALES */}
          <div className="p-5 bg-gradient-to-br from-brand-50/70 to-emerald-50/50 border border-brand-200 rounded-3xl space-y-3.5 shadow-soft">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 rounded-xl bg-brand-600 text-white shadow-xs">
                  <Instagram className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-extrabold text-slate-900 text-sm">
                    1. Enlace para Redes Sociales & Instagram Bio
                  </h4>
                  <p className="text-slate-500 text-[11px]">
                    Para que los nuevos candidatos completen su Ficha Médica y soliciten el alta
                  </p>
                </div>
              </div>
            </div>

            {/* URL Display */}
            <div className="p-3 bg-white rounded-2xl border border-brand-200/80 flex items-center justify-between font-mono text-xs text-brand-900">
              <span className="truncate mr-2 font-bold">{registerUrl}</span>
              <button
                onClick={() => handleCopy(registerUrl, 'register_url')}
                className="px-3 py-1.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold shrink-0 flex items-center space-x-1 transition-all shadow-xs"
              >
                {copiedKey === 'register_url' ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>¡Copiado!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copiar Link</span>
                  </>
                )}
              </button>
            </div>

            {/* Ready to copy Bio Template */}
            <div className="bg-white/80 p-3 rounded-2xl border border-brand-100 space-y-2">
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-700">
                <span>📝 Texto sugerido listo para Bio de Instagram:</span>
                <button
                  onClick={() => handleCopy(instagramBioText, 'bio_text')}
                  className="text-brand-700 hover:text-brand-900 text-[10px] font-extrabold flex items-center space-x-1"
                >
                  {copiedKey === 'bio_text' ? (
                    <span className="text-emerald-700">¡Texto Copiado!</span>
                  ) : (
                    <span>Copiar Texto Completo</span>
                  )}
                </button>
              </div>
              <p className="text-[11px] text-slate-600 font-sans italic bg-slate-50 p-2.5 rounded-xl whitespace-pre-line border border-slate-100">
                {instagramBioText}
              </p>
            </div>
          </div>

          {/* 2. LINK DEL PORTAL DE ALUMNOS (RESERVAS & RUTINAS) */}
          <div className="p-5 bg-white border border-slate-200 rounded-3xl space-y-3.5 shadow-soft">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
                  <Smartphone className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-extrabold text-slate-900 text-sm">
                    2. Enlace del Portal del Alumno Activo
                  </h4>
                  <p className="text-slate-500 text-[11px]">
                    Para alumnos ya aprobados: reservar clases, ver turnos y consultar su rutina
                  </p>
                </div>
              </div>
            </div>

            {/* URL Display */}
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between font-mono text-xs text-slate-800">
              <span className="truncate mr-2 font-bold">{portalUrl}</span>
              <button
                onClick={() => handleCopy(portalUrl, 'portal_url')}
                className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shrink-0 flex items-center space-x-1 transition-all"
              >
                {copiedKey === 'portal_url' ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>¡Copiado!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copiar Link</span>
                  </>
                )}
              </button>
            </div>

            {/* Ready to send WhatsApp template */}
            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200/60 space-y-2">
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-700">
                <span>💬 Mensaje sugerido para enviar por WhatsApp:</span>
                <button
                  onClick={() => handleCopy(whatsappActiveStudentText, 'wapp_text')}
                  className="text-blue-700 hover:text-blue-900 text-[10px] font-extrabold"
                >
                  {copiedKey === 'wapp_text' ? (
                    <span className="text-emerald-700">¡Mensaje Copiado!</span>
                  ) : (
                    <span>Copiar Mensaje</span>
                  )}
                </button>
              </div>
              <p className="text-[11px] text-slate-600 italic bg-white p-2.5 rounded-xl border border-slate-100">
                {whatsappActiveStudentText}
              </p>
            </div>
          </div>

          {/* 3. CARTEL QR DE RECEPCIÓN (CHECK-IN CON GPS) */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 bg-white rounded-xl text-slate-800 border border-slate-200 shadow-xs">
                <QrCode className="w-5 h-5 text-brand-700" />
              </div>
              <div>
                <h5 className="font-extrabold text-slate-900 text-xs">
                  Cartel QR de Recepción del Estudio
                </h5>
                <p className="text-[11px] text-slate-500">
                  Cartel A4 listo para imprimir y colgar en la puerta de entrada
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                onClose();
                onOpenQRPoster();
              }}
              className="px-4 py-2 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-extrabold text-slate-800 transition-colors shadow-xs"
            >
              Ver e Imprimir Cartel
            </button>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
          <span className="text-[11px] text-slate-400 font-medium">
            SERMOA App • Difusión & Accesos
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all"
          >
            Listo
          </button>
        </div>

      </div>
    </div>
  );
};
