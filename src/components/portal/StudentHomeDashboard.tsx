import React from 'react';
import {
  Sparkles,
  Calendar,
  CreditCard,
  CheckCircle2,
  ChevronRight,
  Dumbbell,
  ShieldCheck,
  Award,
  IdCard,
} from 'lucide-react';
import { Profile, Studio } from '../../types';

interface StudentHomeDashboardProps {
  student: Profile;
  studio: Studio;
  onGoToSchedule: () => void;
  onGoToRoutines: () => void;
  onGoToProfile: () => void;
  onOpenBuyPack?: () => void;
}

export const StudentHomeDashboard: React.FC<StudentHomeDashboardProps> = ({
  student,
  studio,
  onGoToSchedule,
  onGoToRoutines,
  onGoToProfile,
  onOpenBuyPack,
}) => {
  const isUnlimited = student.credits_balance === 999;
  const isUpToDate = (student.debt_amount ?? 0) <= 0;

  return (
    <div className="max-w-md mx-auto space-y-6 animate-fade-in pb-12">
      {/* 1. Big Greeting (¡Hola [Nombre]! 👋) */}
      <div className="pt-1">
        <h1 className="text-2xl sm:text-3xl font-black text-[#44261B] tracking-tight flex items-center space-x-2">
          <span>¡Hola {student.first_name}!</span>
          <span className="text-2xl">👋</span>
        </h1>
        <div className="h-0.5 w-12 bg-[#5E612B] rounded-full mt-2" />
      </div>

      {/* 1.5 Zero Credits / Buy Pack Banner */}
      {(student.credits_balance ?? 0) <= 0 && !isUnlimited && (
        <div className="bg-gradient-to-br from-[#44261B] via-[#5E612B] to-[#C18749] text-white rounded-3xl p-5 shadow-soft-lg border border-[#E8D5B5] animate-fade-in relative overflow-hidden">
          <div className="relative z-10 flex flex-col space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-[#F4E8D1] shrink-0">
                <Sparkles className="w-5 h-5 text-amber-300" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-[#F4E8D1] block">
                  ¡Cuenta Habilitada!
                </span>
                <h3 className="text-base font-extrabold text-white">
                  Elige tu Pack de Clases
                </h3>
              </div>
            </div>
            <p className="text-xs text-[#E8D5B5] leading-relaxed">
              Selecciona tu plan de clases y abona de forma segura con Mercado Pago para comenzar a reservar tus turnos.
            </p>
            <button
              onClick={onOpenBuyPack || onGoToProfile}
              className="w-full py-3 bg-[#F4E8D1] hover:bg-white text-[#44261B] font-extrabold text-xs rounded-xl shadow-sm transition-all flex items-center justify-center space-x-2 cursor-pointer hover:scale-[1.01]"
            >
              <CreditCard className="w-4 h-4 text-[#5E612B]" />
              <span>Ver Packs Disponibles</span>
              <ChevronRight className="w-4 h-4 text-[#5E612B]" />
            </button>
          </div>
        </div>
      )}

      {/* 2. Top Primary Action Cards (Mi Entrenamiento, Reservas, Beneficios / Credencial) */}
      <div className="space-y-2.5">
        {/* Card 1: Mi Entrenamiento */}
        <button
          onClick={onGoToRoutines}
          className="w-full bg-white hover:bg-[#F4E8D1]/40 border border-[#E8D5B5] rounded-2xl p-4 shadow-xs transition-all flex items-center justify-between text-left group cursor-pointer"
        >
          <div className="flex items-center space-x-3.5">
            <div className="w-11 h-11 rounded-2xl bg-[#F4E8D1] border border-[#E8D5B5] text-[#5E612B] flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform shadow-2xs">
              <Dumbbell className="w-5 h-5 text-[#5E612B]" />
            </div>
            <div>
              <h4 className="text-sm font-extrabold text-[#44261B] group-hover:text-[#5E612B] transition-colors">
                Mi Entrenamiento
              </h4>
              <p className="text-[11px] text-[#A68D74] mt-0.5">
                Establece tu objetivo y accede a tus planes
              </p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-[#A68D74] group-hover:translate-x-0.5 transition-transform" />
        </button>

        {/* Card 2: Reservas */}
        <button
          onClick={onGoToSchedule}
          className="w-full bg-white hover:bg-[#F4E8D1]/40 border border-[#E8D5B5] rounded-2xl p-4 shadow-xs transition-all flex items-center justify-between text-left group cursor-pointer"
        >
          <div className="flex items-center space-x-3.5">
            <div className="w-11 h-11 rounded-2xl bg-[#F7F3EC] border border-[#E8D5B5] text-[#B74E2A] flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform shadow-2xs">
              <Calendar className="w-5 h-5 text-[#B74E2A]" />
            </div>
            <div>
              <h4 className="text-sm font-extrabold text-[#44261B] group-hover:text-[#B74E2A] transition-colors">
                Reservas
              </h4>
              <p className="text-[11px] text-[#A68D74] mt-0.5">
                Gestiona tus reservas de clases
              </p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-[#A68D74] group-hover:translate-x-0.5 transition-transform" />
        </button>

        {/* Card 3: CLUB DE BENEFICIOS */}
        <button
          onClick={onGoToProfile}
          className="w-full bg-white hover:bg-[#F4E8D1]/40 border border-[#E8D5B5] rounded-2xl p-4 shadow-xs transition-all flex items-center justify-between text-left group cursor-pointer"
        >
          <div className="flex items-center space-x-3.5">
            <div className="w-11 h-11 rounded-2xl bg-[#F4E8D1] border border-[#E8D5B5] text-[#C18749] flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform shadow-2xs">
              <CreditCard className="w-5 h-5 text-[#C18749]" />
            </div>
            <div>
              <h4 className="text-sm font-extrabold text-[#44261B] group-hover:text-[#C18749] transition-colors">
                CLUB DE BENEFICIOS
              </h4>
              <p className="text-[11px] text-[#A68D74] mt-0.5">
                Accede a tus beneficios y credencial
              </p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-[#A68D74] group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      {/* 3. Member Pass Quick Preview Banner */}
      <div 
        onClick={onGoToProfile}
        className="rounded-3xl p-5 border border-[#E8D5B5] shadow-soft cursor-pointer transition-all hover:shadow-md relative overflow-hidden group"
        style={{
          background: 'linear-gradient(135deg, #44261B 0%, #5E612B 45%, #C18749 100%)',
        }}
      >
        <div className="relative z-10 flex items-center justify-between text-white">
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-md border border-white/25 flex items-center justify-center flex-shrink-0 shadow-inner">
              <Sparkles className="w-6 h-6 text-[#F4E8D1]" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-black tracking-widest text-[#F4E8D1] block">
                CREDENCIAL DIGITAL
              </span>
              <h3 className="text-base font-extrabold mt-0.5 text-white">
                Member Pass Activo
              </h3>
              <span className="text-xs text-[#E8D5B5]/90 font-medium block">
                {isUnlimited ? 'Pase Libre Mensual' : `${student.credits_balance ?? 0} clases disponibles`}
              </span>
            </div>
          </div>

          <div className="px-3.5 py-2 bg-[#F4E8D1] text-[#44261B] font-extrabold text-xs rounded-xl shadow-xs group-hover:bg-white transition-colors flex items-center space-x-1">
            <span>Ver Pase</span>
            <ChevronRight className="w-3.5 h-3.5 text-[#5E612B]" />
          </div>
        </div>
      </div>

      {/* 4. TU CUENTA - STATUS GRID (Estilo exacto foto 2) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h4 className="text-xs font-black uppercase tracking-wider text-[#5E612B]">
            Tu Cuenta
          </h4>
          <span className="text-[11px] font-bold text-[#A68D74]">
            {isUpToDate ? 'Estado al día' : 'Pendiente'}
          </span>
        </div>

        {/* Points & History Card */}
        <div className="bg-white rounded-2xl p-4 border border-[#E8D5B5] shadow-xs flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-[#F4E8D1] text-[#5E612B] border border-[#E8D5B5] flex items-center justify-center">
              <Award className="w-5 h-5 text-[#D98E2A]" />
            </div>
            <div>
              <span className="text-sm font-extrabold text-[#44261B] block">
                {isUnlimited ? 'Pase Ilimitado' : `${student.credits_balance ?? 0} Clases Disponibles`}
              </span>
              <span className="text-[11px] text-[#A68D74] font-medium">
                Puntos & beneficios de socio activo
              </span>
            </div>
          </div>
          <button
            onClick={onGoToSchedule}
            className="p-2 text-[#5E612B] hover:bg-[#F4E8D1] rounded-xl transition-colors cursor-pointer"
            title="Reservar clases"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* 4 Status Badges Grid */}
        <div className="grid grid-cols-2 gap-2.5">
          {/* Card 1: Vigencia */}
          <div className="bg-white rounded-2xl p-3.5 border border-[#E8D5B5] shadow-xs flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-[#F4E8D1] border border-[#E8D5B5] flex items-center justify-center text-[#5E612B] flex-shrink-0">
              <Calendar className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-black text-[#44261B] flex items-center space-x-1">
                <span>Vigencia</span>
                <span className="text-[#5E612B]">OK</span>
              </div>
              <span className="text-[10px] text-[#A68D74] block truncate">de tu inscripción</span>
            </div>
          </div>

          {/* Card 2: Cuenta */}
          <div className="bg-white rounded-2xl p-3.5 border border-[#E8D5B5] shadow-xs flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-[#F7F3EC] border border-[#C18749]/40 flex items-center justify-center text-[#B74E2A] flex-shrink-0">
              <CreditCard className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-black text-[#44261B] flex items-center space-x-1">
                <span>Cuenta</span>
                <span className={isUpToDate ? 'text-[#5E612B]' : 'text-[#B74E2A]'}>
                  {isUpToDate ? 'OK' : 'Saldo'}
                </span>
              </div>
              <span className="text-[10px] text-[#A68D74] block truncate">
                {isUpToDate ? 'estás al día' : `deuda: $${student.debt_amount}`}
              </span>
            </div>
          </div>

          {/* Card 3: Requisitos */}
          <div className="bg-white rounded-2xl p-3.5 border border-[#E8D5B5] shadow-xs flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-[#F4E8D1] border border-[#E8D5B5] flex items-center justify-center text-[#5E612B] flex-shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-black text-[#44261B] flex items-center space-x-1">
                <span>Requisitos</span>
                <span className="text-[#5E612B]">OK</span>
              </div>
              <span className="text-[10px] text-[#A68D74] block truncate">ficha médica completa</span>
            </div>
          </div>

          {/* Card 4: Estás OK */}
          <div className="bg-white rounded-2xl p-3.5 border border-[#E8D5B5] shadow-xs flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-[#F4E8D1] border border-[#E8D5B5] flex items-center justify-center text-[#5E612B] flex-shrink-0">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-black text-[#44261B] flex items-center space-x-1">
                <span>Estás</span>
                <span className="text-[#5E612B]">OK</span>
              </div>
              <span className="text-[10px] text-[#A68D74] block truncate">para reservar</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
