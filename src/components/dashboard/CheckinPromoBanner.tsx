import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { QrCode, CheckCircle2, ArrowRight, ShieldCheck, MapPin } from 'lucide-react';
import { useStudioStore } from '../../store/studioStore';
import { getBookingLink } from '../../utils/links';

interface CheckinPromoBannerProps {
  onOpenQRPoster: () => void;
  onNavigate: (view: string) => void;
}

export const CheckinPromoBanner: React.FC<CheckinPromoBannerProps> = ({
  onOpenQRPoster,
  onNavigate,
}) => {
  const { studio, branches, profiles, classes, creditPacks } = useStudioStore();

  const instructorsCount = profiles.filter((p) => p.role === 'instructor').length;
  const bookingUrl = getBookingLink(studio.slug);

  // Onboarding step statuses
  const steps = [
    {
      num: 1,
      title: 'Define tu sucursal',
      desc: 'Define la ubicación, horarios de atención y coordenadas GPS desde Sucursales.',
      done: branches.length > 0,
      targetView: 'branches',
    },
    {
      num: 2,
      title: 'Vincula profesores',
      desc: 'Añade y asigna instructores desde Profesores para asociarlos a las clases.',
      done: instructorsCount >= 1,
      targetView: 'instructors',
    },
    {
      num: 3,
      title: 'Crea tus clases',
      desc: 'Establece horarios, capacidad y profesores desde Clases & Reservas.',
      done: classes.length > 0,
      targetView: 'classes',
    },
    {
      num: 4,
      title: 'Crea planes de rutina',
      desc: 'Diseña rutinas y ejercicios para asignar a tus alumnos desde Rutinas.',
      done: true,
      targetView: 'routines',
    },
    {
      num: 5,
      title: 'Comparte tu enlace',
      desc: `Publica tu link de registro en Instagram o WhatsApp para que tus alumnos se inscriban.`,
      done: true,
      targetView: 'portal-alumno',
    },
  ];

  return (
    <section aria-labelledby="checkin-promo-heading" className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-10">
      
      {/* LEFT: Olive Green QR Hero Banner (Exact match to AgendaFit screenshot) */}
      <div className="lg:col-span-7 bg-brand-olive rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-soft flex flex-col justify-between">
        
        {/* Background decorative watermark */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-white/5 rounded-full blur-2xl pointer-events-none -mr-20 -mt-20"></div>

        <div>
          <div className="flex items-center space-x-2 text-brand-200 text-xs font-extrabold uppercase tracking-wider mb-2">
            <ShieldCheck className="w-4 h-4 text-emerald-300" />
            <span>Validación de Presencia + GPS</span>
          </div>

          <h3 id="checkin-promo-heading" className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-3">
            Check-in Inteligente por QR
          </h3>

          <p className="text-sm text-slate-100/90 leading-relaxed max-w-md mb-6">
            Optimiza el ingreso de tus alumnos con el sistema de código QR. Automatiza la toma de asistencia y ahorra tiempo valioso.
          </p>

          <div className="space-y-2.5 text-xs text-white/90 mb-6">
            <div className="flex items-center space-x-2.5">
              <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center font-bold text-[11px]">
                1
              </span>
              <span>Descarga e imprime tu código</span>
            </div>
            <div className="flex items-center space-x-2.5">
              <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center font-bold text-[11px]">
                2
              </span>
              <span>Colócalo en la recepción</span>
            </div>
          </div>
        </div>

        {/* Bottom Banner Actions & QR Preview */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-white/15">
          <div className="flex items-center space-x-2 bg-black/20 backdrop-blur-sm px-3 py-1.5 rounded-full w-fit">
            <span className="text-amber-300 text-xs">⚡</span>
            <span className="text-xs font-bold uppercase tracking-wide text-amber-200">
              ACCESO INSTANTÁNEO
            </span>
          </div>

          <button
            onClick={onOpenQRPoster}
            className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-white text-slate-900 font-extrabold text-xs shadow-lg hover:bg-slate-50 hover:scale-102 active:scale-98 transition-all"
          >
            <QrCode className="w-4 h-4 text-brand-darkolive" />
            <span>Ver & Imprimir Cartel QR</span>
          </button>
        </div>
      </div>

      {/* RIGHT: Onboarding Stepper Checklist (Steps 1 to 5) */}
      <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-soft">
        <h4 className="font-extrabold text-slate-900 text-base mb-4 flex items-center justify-between">
          <span>Pasos de Configuración</span>
          <span className="text-xs font-bold text-brand-600 bg-brand-50 px-2.5 py-0.5 rounded-full">
            {steps.filter((s) => s.done).length} de {steps.length} listos
          </span>
        </h4>

        <div className="space-y-4">
          {steps.map((step) => (
            <div
              key={step.num}
              onClick={() => onNavigate(step.targetView)}
              className="flex items-start space-x-3 group cursor-pointer p-2 rounded-xl hover:bg-slate-50 transition-colors"
            >
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 transition-colors ${
                  step.done
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'border-2 border-slate-300 text-slate-500'
                }`}
              >
                {step.done ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : step.num}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h5 className="font-bold text-slate-800 text-xs group-hover:text-brand-700 transition-colors">
                    {step.title}
                  </h5>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                </div>
                <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5">
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </section>
  );
};
