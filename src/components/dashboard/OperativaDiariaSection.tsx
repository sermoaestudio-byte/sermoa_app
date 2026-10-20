import React from 'react';
import {
  Calendar,
  Users,
  UserCheck,
  MapPin,
  ClipboardList,
  Dumbbell,
  Wallet,
  ArrowRight,
  Clock
} from 'lucide-react';
import { useStudioStore } from '../../store/studioStore';

interface OperativaDiariaSectionProps {
  onNavigate: (view: string) => void;
}

export const OperativaDiariaSection: React.FC<OperativaDiariaSectionProps> = ({ onNavigate }) => {
  const { profiles } = useStudioStore();
  const pendingRequests = profiles.filter((p) => p.status === 'pending_approval');

  return (
    <section aria-labelledby="operativa-diaria-heading" className="mb-10">
      
      {/* Section Header */}
      <div className="flex items-center space-x-2 text-base font-extrabold text-[#1F2933] mb-4">
        <span className="text-[#5EBA8C]">⚡</span>
        <h3 id="operativa-diaria-heading">Operativa Diaria</h3>
      </div>

      <div className="space-y-4">
        
        {/* 1. Hero Featured Card: Clases & Reservas */}
        <div className="relative overflow-hidden bg-[#FAF8F5] rounded-3xl p-6 sm:p-7 border border-[#E8DFD1] shadow-soft hover:shadow-soft-lg transition-all group">
          
          {/* Subtle background clock watermark */}
          <Clock className="absolute -right-6 -bottom-6 w-44 h-44 text-[#EFE9DF]/80 -rotate-12 pointer-events-none group-hover:scale-105 transition-transform" />

          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start space-x-4">
              <div className="w-14 h-14 rounded-2xl bg-[#1F2933] border border-[#1F2933] flex items-center justify-center text-[#FAF8F5] shadow-sm group-hover:scale-105 transition-transform">
                <Calendar className="w-7 h-7 text-[#FAF8F5]" />
              </div>
              <div>
                <h4 className="text-lg sm:text-xl font-extrabold text-[#1F2933] tracking-tight">
                  Clases & Reservas
                </h4>
                <p className="text-sm text-stone-500 font-medium mt-1">
                  Control total de horarios, cupos y asistencias
                </p>
              </div>
            </div>

            <button
              onClick={() => onNavigate('classes')}
              className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-2xl border border-[#E8DFD1] bg-[#FAF8F5] hover:bg-[#EFE9DF] text-[#1F2933] text-sm font-bold shadow-sm transition-all hover:border-[#D6CAB7] self-start sm:self-center"
            >
              <span>Ir ahora</span>
              <ArrowRight className="w-4 h-4 text-stone-500 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* 2. Grid of Action Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          
          {/* Card: Alumnos */}
          <button
            onClick={() => onNavigate('students')}
            className="bg-[#FAF8F5] rounded-2xl p-5 border border-[#E8DFD1] shadow-soft hover:shadow-soft-lg hover:border-[#1F2933]/30 transition-all text-left group relative"
          >
            {pendingRequests.length > 0 && (
              <span className="absolute top-4 right-4 bg-[#F7C59F] text-[#8C502E] font-extrabold text-[10px] px-2 py-0.5 rounded-full shadow-sm">
                {pendingRequests.length} pendientes
              </span>
            )}
            <div className="w-11 h-11 rounded-2xl bg-[#1F2933] text-[#FAF8F5] flex items-center justify-center mb-3.5 group-hover:scale-105 transition-transform shadow-xs">
              <Users className="w-5 h-5" />
            </div>
            <h5 className="font-extrabold text-[#1F2933] text-base">Alumnos</h5>
            <p className="text-xs text-stone-500 font-medium mt-1">
              Saldos, perfiles y actividad
            </p>
          </button>

          {/* Card: Profesores */}
          <button
            onClick={() => onNavigate('instructors')}
            className="bg-[#FAF8F5] rounded-2xl p-5 border border-[#E8DFD1] shadow-soft hover:shadow-soft-lg hover:border-[#5EBA8C]/40 transition-all text-left group"
          >
            <div className="w-11 h-11 rounded-2xl bg-[#5EBA8C]/20 text-[#2B6D4E] flex items-center justify-center mb-3.5 group-hover:scale-105 transition-transform">
              <UserCheck className="w-5 h-5" />
            </div>
            <h5 className="font-extrabold text-[#1F2933] text-base">Profesores</h5>
            <p className="text-xs text-stone-500 font-medium mt-1">
              Staff, roles y asignaciones
            </p>
          </button>

          {/* Card: Sucursales */}
          <button
            onClick={() => onNavigate('branches')}
            className="bg-[#FAF8F5] rounded-2xl p-5 border border-[#E8DFD1] shadow-soft hover:shadow-soft-lg hover:border-[#F7C59F] transition-all text-left group"
          >
            <div className="w-11 h-11 rounded-2xl bg-[#F7C59F]/30 text-[#8C502E] flex items-center justify-center mb-3.5 group-hover:scale-105 transition-transform">
              <MapPin className="w-5 h-5" />
            </div>
            <h5 className="font-extrabold text-[#1F2933] text-base">Sucursales</h5>
            <p className="text-xs text-stone-500 font-medium mt-1">
              Ubicaciones y horarios de atención
            </p>
          </button>

          {/* Card: Pasar Lista */}
          <button
            onClick={() => onNavigate('attendance')}
            className="bg-[#FAF8F5] rounded-2xl p-5 border border-[#E8DFD1] shadow-soft hover:shadow-soft-lg hover:border-[#E8DFD1] transition-all text-left group"
          >
            <div className="w-11 h-11 rounded-2xl bg-[#EFE9DF] text-[#1F2933] flex items-center justify-center mb-3.5 group-hover:scale-105 transition-transform">
              <ClipboardList className="w-5 h-5" />
            </div>
            <h5 className="font-extrabold text-[#1F2933] text-base">Pasar Lista</h5>
            <p className="text-xs text-stone-500 font-medium mt-1">
              Control de asistencia y registros
            </p>
          </button>

          {/* Card: Rutinas */}
          <button
            onClick={() => onNavigate('routines')}
            className="bg-[#FAF8F5] rounded-2xl p-5 border border-[#E8DFD1] shadow-soft hover:shadow-soft-lg hover:border-[#5EBA8C]/40 transition-all text-left group"
          >
            <div className="w-11 h-11 rounded-2xl bg-[#5EBA8C]/20 text-[#2B6D4E] flex items-center justify-center mb-3.5 group-hover:scale-105 transition-transform">
              <Dumbbell className="w-5 h-5" />
            </div>
            <h5 className="font-extrabold text-[#1F2933] text-base">Rutinas</h5>
            <p className="text-xs text-stone-500 font-medium mt-1">
              Planes de entrenamiento y ejercicios
            </p>
          </button>

          {/* Card: Historial de movimientos */}
          <button
            onClick={() => onNavigate('history')}
            className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-soft hover:shadow-soft-lg hover:border-emerald-200 transition-all text-left group"
          >
            <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3.5 group-hover:scale-105 transition-transform">
              <Wallet className="w-5 h-5" />
            </div>
            <h5 className="font-extrabold text-slate-800 text-base">Historial de movimientos</h5>
            <p className="text-xs text-slate-500 font-medium mt-1">
              Registro de reservas, compras, reembolsos y créditos
            </p>
          </button>

        </div>
      </div>
    </section>
  );
};
