import React, { useState } from 'react';
import { createPortal } from 'react-dom';
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
import {
  getRegisterLink,
  getPortalLink,
  getInstagramBioText,
  getWhatsAppPortalInviteText,
} from '../../utils/links';

interface StudioLinksModalProps {
  onClose: () => void;
  onOpenQRPoster: () => void;
}

export const StudioLinksModal: React.FC<StudioLinksModalProps> = ({
  onClose,
  onOpenQRPoster,
}) => {
  const { studio } = useStudioStore();

  const registerUrl = getRegisterLink();
  const portalUrl = getPortalLink();

  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const instagramBioText = getInstagramBioText(studio.name);
  const whatsappActiveStudentText = getWhatsAppPortalInviteText(studio.name);

  return createPortal(
    <div className="fixed inset-0 z-[9999] overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex min-h-full items-center justify-center p-3 sm:p-6 animate-fade-in">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-100 my-auto flex flex-col max-h-[88vh] overflow-hidden text-left">
        
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-100 flex items-start justify-between bg-slate-50/90 shrink-0">
          <div className="flex items-start space-x-3.5 pr-4">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-brand-50 text-brand-700 flex items-center justify-center font-bold text-lg shrink-0 shadow-xs border border-brand-100">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-brand-700 bg-brand-100/60 px-2 py-0.5 rounded-full border border-brand-200">
                Difusión & Captación
              </span>
              <h3 className="text-lg sm:text-xl font-black text-slate-900 mt-1 leading-snug">
                Centro de Enlaces Oficiales
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Copia y comparte los enlaces para redes sociales, WhatsApp y alumnos
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-200/60 transition-colors shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 space-y-5 overflow-y-auto flex-1 text-xs">
          
          {/* 1. LINK DE INSCRIPCIÓN / REDES SOCIALES */}
          <div className="p-4 sm:p-5 bg-gradient-to-br from-brand-50/70 to-emerald-50/50 border border-brand-200 rounded-3xl space-y-3 shadow-soft">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 rounded-xl bg-brand-600 text-white shadow-xs shrink-0">
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
            <div className="p-2.5 sm:p-3 bg-white rounded-2xl border border-brand-200/80 flex items-center justify-between font-mono text-xs text-brand-900">
              <span className="truncate mr-2 font-bold text-[11px] sm:text-xs">{registerUrl}</span>
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
                <span>📝 Texto sugerido para Bio de Instagram:</span>
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
          <div className="p-4 sm:p-5 bg-white border border-slate-200 rounded-3xl space-y-3 shadow-soft">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 shrink-0">
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
            <div className="p-2.5 sm:p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between font-mono text-xs text-slate-800">
              <span className="truncate mr-2 font-bold text-[11px] sm:text-xs">{portalUrl}</span>
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
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-center justify-between gap-3">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 bg-white rounded-xl text-slate-800 border border-slate-200 shadow-xs shrink-0">
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
              className="px-3.5 py-2 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-extrabold text-slate-800 transition-colors shadow-xs shrink-0"
            >
              Ver Cartel
            </button>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between shrink-0">
          <span className="text-[11px] text-slate-400 font-medium">
            SERMOA App • Difusión & Redes
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all"
          >
            Listo
          </button>
        </div>

      </div>
    </div>,
    document.body
  );
};
