import React, { useState } from 'react';
import {
  Calendar,
  UserPlus,
  BookOpen,
  Copy,
  Check,
  MapPin,
  Users,
  ChevronRight,
  Clock,
  QrCode,
  Sparkles,
  Share2,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import { useStudioStore } from '../../store/studioStore';
import { toISODateString } from '../../utils/date';

interface SidebarRightProps {
  onNavigate: (view: string) => void;
}

export const SidebarRight: React.FC<SidebarRightProps> = ({ onNavigate }) => {
  const { studio, profiles, branches, classes, bookings } = useStudioStore();
  const [copiedLink, setCopiedLink] = useState(false);

  const todayStr = toISODateString(new Date());
  const activeStudentsCount = profiles.filter((p) => p.role === 'client' && p.status === 'active').length;
  const instructorsCount = profiles.filter((p) => p.role === 'instructor' || p.role === 'admin').length;
  const todayClasses = classes.filter((c) => !c.is_cancelled && (c.date === todayStr || c.day_of_week === new Date().getDay()));
  const todayBookings = bookings.filter((b) => b.booking_date === todayStr && b.status === 'confirmed');

  const registrationLink = typeof window !== 'undefined'
    ? `${window.location.origin}/#registro`
    : `https://${studio.slug}.sermoa.app/#registro`;

  const handleCopyRegistrationLink = () => {
    navigator.clipboard.writeText(registrationLink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  return (
    <aside className="w-full lg:w-80 space-y-5">
      
      {/* 1. Card: Resumen del Estudio (Uso Particular SERMOA) */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-soft">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-extrabold text-slate-900">Estado del Estudio</span>
            <span className="bg-emerald-50 text-emerald-700 font-extrabold text-[10px] px-2 py-0.5 rounded-full border border-emerald-200">
              Activo
            </span>
          </div>
          <span className="text-xs font-bold text-slate-400">
            {todayClasses.length} clases hoy
          </span>
        </div>

        {/* Studio Quick Highlights */}
        <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-200/60 mb-4 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500 font-medium flex items-center space-x-1.5">
              <Users className="w-3.5 h-3.5 text-blue-500" />
              <span>Alumnos Activos</span>
            </span>
            <span className="font-extrabold text-slate-800">{activeStudentsCount}</span>
          </div>

          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500 font-medium flex items-center space-x-1.5">
              <Sparkles className="w-3.5 h-3.5 text-purple-500" />
              <span>Equipo Docente</span>
            </span>
            <span className="font-extrabold text-slate-800">{instructorsCount} profesores</span>
          </div>

          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500 font-medium flex items-center space-x-1.5">
              <Calendar className="w-3.5 h-3.5 text-emerald-500" />
              <span>Turnos Confirmados Hoy</span>
            </span>
            <span className="font-extrabold text-emerald-700 font-bold">{todayBookings.length} reservas</span>
          </div>
        </div>

        {/* Quick Actions Grid */}
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => onNavigate('classes')}
            className="py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-colors text-center"
          >
            Ver Horarios
          </button>
          <button
            onClick={() => onNavigate('attendance')}
            className="py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-colors text-center"
          >
            Pasar Lista
          </button>
        </div>
      </div>

      {/* 2. Card: Link de Inscripción para Redes Sociales & Alumnos */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-soft space-y-3">
        <div className="flex items-start space-x-3">
          <div className="p-2.5 rounded-2xl bg-brand-50 text-brand-700 shadow-xs border border-brand-100">
            <Share2 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-brand-700 bg-brand-100/60 px-2 py-0.5 rounded-full">
              Inscripciones & Redes
            </span>
            <h4 className="font-extrabold text-slate-900 text-sm mt-1">
              Link de Alta para Alumnos
            </h4>
            <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
              Publica este enlace en tu Instagram o envíalo por WhatsApp para que los interesados completen su ficha médica.
            </p>
          </div>
        </div>

        {/* Link Box Display */}
        <div className="p-2.5 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-center justify-between text-xs font-mono text-slate-600 truncate">
          <span className="truncate mr-2 text-[11px] font-bold text-brand-800">
            {registrationLink}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2 pt-1">
          <button
            onClick={handleCopyRegistrationLink}
            className="w-full py-2.5 px-3 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-extrabold flex items-center justify-center space-x-1.5 shadow-sm transition-all"
          >
            {copiedLink ? (
              <>
                <Check className="w-3.5 h-3.5 text-white" />
                <span>¡Link Copiado al Portapapeles!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copiar Enlace de Inscripción</span>
              </>
            )}
          </button>

          <button
            onClick={() => onNavigate('portal-alumno')}
            className="w-full py-2 px-3 rounded-2xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center justify-center space-x-1.5 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            <span>Previsualizar Portal Alumno</span>
          </button>
        </div>

        {/* Explanatory note */}
        <div className="pt-2 border-t border-slate-100 flex items-start space-x-2 text-[10px] text-slate-500">
          <ShieldCheck className="w-3.5 h-3.5 text-brand-600 shrink-0 mt-0.5" />
          <p className="leading-tight">
            Una vez que el alumno envía su solicitud y tú la apruebas desde <strong>Alumnos</strong>, el alumno podrá ingresar a su agenda de clases.
          </p>
        </div>
      </div>

      {/* 3. Card: Material de Ayuda y Configuración */}
      <button
        onClick={() => onNavigate('settings')}
        className="w-full bg-rose-50/60 hover:bg-rose-100/60 border border-rose-100 rounded-3xl p-4 flex items-center justify-between text-left transition-colors group shadow-xs"
      >
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-2xl bg-rose-500/10 text-rose-600 flex items-center justify-center">
            <BookOpen className="w-4 h-4" />
          </div>
          <div>
            <h5 className="text-xs font-extrabold text-slate-900 group-hover:text-rose-700 transition-colors">
              Guías & Configuración
            </h5>
            <p className="text-[11px] text-slate-500">Ajustes de GPS y WhatsApp</p>
          </div>
        </div>
        <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-rose-600 group-hover:translate-x-0.5 transition-all" />
      </button>

    </aside>
  );
};
