import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  CreditCard,
  CheckCircle2,
  ChevronRight,
  Dumbbell,
  Sparkles,
  QrCode,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  Plus
} from 'lucide-react';
import { Profile, Studio, Booking, ClassSchedule } from '../../types';
import { useStudioStore } from '../../store/studioStore';
import { ConfirmDialog } from '../common/ConfirmDialog';

interface StudentHomeDashboardProps {
  student: Profile;
  studio: Studio;
  onGoToSchedule: () => void;
  onGoToRoutines: () => void;
  onGoToProfile: () => void;
  onGoToBookings?: () => void;
  onOpenBuyPack?: () => void;
}

export const StudentHomeDashboard: React.FC<StudentHomeDashboardProps> = ({
  student,
  studio,
  onGoToSchedule,
  onGoToRoutines,
  onGoToProfile,
  onGoToBookings,
  onOpenBuyPack,
}) => {
  const { bookings, classes, branches, cancelBooking } = useStudioStore();
  const [bookingToCancel, setBookingToCancel] = useState<string | null>(null);

  const isUnlimited = student.credits_balance === 999;
  const isUpToDate = (student.debt_amount ?? 0) <= 0;

  // Filtrar reservas confirmadas del alumno ordenadas por fecha
  const myBookings = bookings
    .filter((b: Booking) => b.student_id === student.id && b.status === 'confirmed')
    .sort((a, b) => (a.booking_date > b.booking_date ? 1 : -1));

  // Próxima clase principal y siguientes
  const nextBooking = myBookings[0] || null;
  const otherUpcoming = myBookings.slice(1, 3);

  // Obtener clase y sucursal de la próxima reserva
  const nextClass = nextBooking
    ? classes.find((c: ClassSchedule) => c.id === nextBooking.class_id)
    : null;
  const nextBranch = nextClass
    ? branches.find((b) => b.id === nextClass.branch_id)
    : null;

  const handleConfirmCancel = () => {
    if (bookingToCancel) {
      cancelBooking(bookingToCancel);
      setBookingToCancel(null);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-5 max-w-4xl mr-auto ml-0 my-6 animate-fade-in pb-10 w-full">

      {/* 1. Encabezado de Bienvenida (Espaciado vertical optimizado) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-[#E8D5B5]/60">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#5E612B] block">
            Bienvenido a Sermoa
          </span>
          <h1 className="text-xl sm:text-2xl font-serif font-black text-[#44261B] tracking-tight mt-0.5">
            ¡Hola, {student.first_name}!
          </h1>
          <p className="text-xs text-[#A68D74] mt-0.5 leading-relaxed">
            Tu espacio de bienestar, movimiento consciente y preparación física.
          </p>
        </div>

        {/* Botón de acción principal destacado */}
        <button
          onClick={onGoToSchedule}
          className="self-start sm:self-auto px-4 py-2 rounded-full bg-[#5E612B] hover:bg-[#44261B] text-[#F4E8D1] hover:text-white font-bold text-xs shadow-md hover:shadow-lg transition-all flex items-center gap-2 group cursor-pointer active:scale-95"
        >
          <Plus className="w-4 h-4 text-[#F4E8D1]" />
          <span>Reservar una clase</span>
          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
        </button>
      </div>

      {/* 2. Layout Principal */}
      <div className="space-y-4 sm:space-y-5">

          {/* ------------------------------------------------------------ */}
          {/* A. PRIORIDAD 1: PRÓXIMA CLASE O ESTADO DE RESERVAS           */}
          {/* (Altura moderadamente reducida ~10-15%, padding optimizado)  */}
          {/* ------------------------------------------------------------ */}
          <section className="bg-white rounded-3xl p-4 sm:p-5 border border-[#E8D5B5] shadow-xs relative overflow-hidden">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#5E612B] animate-pulse" />
                <h2 className="text-xs sm:text-sm font-extrabold text-[#44261B] uppercase tracking-wider">
                  Tu próxima clase
                </h2>
              </div>

              {myBookings.length > 0 && (
                <button
                  onClick={onGoToBookings || onGoToSchedule}
                  className="text-xs font-bold text-[#5E612B] hover:text-[#44261B] flex items-center gap-1 transition-colors"
                >
                  <span>Ver todas ({myBookings.length})</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {nextBooking && nextClass ? (
              <div className="bg-[#FAF8F5] rounded-2xl p-3.5 sm:p-4 border border-[#E8D5B5]/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className="text-xs font-bold px-2.5 py-0.5 rounded-full text-white shadow-2xs"
                      style={{ backgroundColor: nextClass.color || '#5E612B' }}
                    >
                      {nextClass.title}
                    </span>
                    <span className="text-[11px] font-semibold text-[#5E612B] bg-[#F4E8D1] px-2.5 py-0.5 rounded-full border border-[#E8D5B5]">
                      Confirmada
                    </span>
                  </div>

                  <div className="flex items-center gap-4 text-xs font-bold text-[#44261B] pt-0.5">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-[#5E612B]" />
                      <span>{nextClass.start_time} a {nextClass.end_time} hs</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-[#C18749]" />
                      <span>{nextBooking.booking_date}</span>
                    </div>
                  </div>

                  {nextBranch && (
                    <div className="flex items-center gap-1.5 text-xs text-[#A68D74] font-medium">
                      <MapPin className="w-3.5 h-3.5 text-[#A68D74]" />
                      <span>{nextBranch.name} • Sala Principal</span>
                    </div>
                  )}
                </div>

                <div className="flex sm:flex-col gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#E8D5B5]/60">
                  <button
                    onClick={() => setBookingToCancel(nextBooking.id)}
                    className="w-full px-3 py-1.5 text-xs font-semibold text-[#CB563C] hover:bg-rose-50 border border-rose-200 rounded-xl transition-colors cursor-pointer text-center"
                  >
                    Cancelar turno
                  </button>
                </div>
              </div>
            ) : (
              /* Estado vacío elegante con altura moderadamente compacta */
              <div className="bg-[#FAF8F5] rounded-2xl p-4 sm:p-5 border border-dashed border-[#E8D5B5] text-center space-y-2.5">
                <div className="w-10 h-10 rounded-xl bg-[#F4E8D1] text-[#5E612B] flex items-center justify-center mx-auto shadow-2xs">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-[#44261B]">
                    Todavía no tenés una próxima clase
                  </h3>
                  <p className="text-xs text-[#A68D74] max-w-sm mx-auto mt-0.5">
                    Elegí el día y horario que mejor se adapte a tu rutina para reservar tu lugar.
                  </p>
                </div>
                <div className="pt-1">
                  <button
                    onClick={onGoToSchedule}
                    className="px-5 py-2 rounded-full bg-[#5E612B] hover:bg-[#44261B] text-[#F4E8D1] hover:text-white font-bold text-xs shadow-sm transition-all inline-flex items-center gap-1.5 cursor-pointer active:scale-95"
                  >
                    <span>Reservar una clase</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* Turnos siguientes en lista compacta si existen */}
            {otherUpcoming.length > 0 && (
              <div className="mt-3 pt-3 border-t border-[#E8D5B5]/60 space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#A68D74] block">
                  Siguientes reservas:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {otherUpcoming.map((item) => {
                    const cls = classes.find((c: ClassSchedule) => c.id === item.class_id);
                    return (
                      <div
                        key={item.id}
                        className="p-2.5 bg-[#FAF8F5]/80 rounded-xl border border-[#E8D5B5] flex items-center justify-between text-xs"
                      >
                        <div className="truncate pr-2">
                          <span className="font-bold text-[#44261B] block truncate">
                            {cls?.title || 'Pilates Reformer'}
                          </span>
                          <span className="text-[11px] text-[#A68D74]">
                            {item.booking_date} • {cls?.start_time} hs
                          </span>
                        </div>
                        <button
                          onClick={() => setBookingToCancel(item.id)}
                          className="text-[10px] text-[#CB563C] hover:underline shrink-0"
                        >
                          Cancelar
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </section>


          {/* ------------------------------------------------------------ */}
          {/* B. UNIFICACIÓN: RESUMEN ÚNICO DEL PLAN Y CLASES DISPONIBLES */}
          {/* (Distribución sin truncamiento: etiquetas claras y valores)  */}
          {/* ------------------------------------------------------------ */}
          <section className="bg-white rounded-3xl p-4 sm:p-5 border border-[#E8D5B5] shadow-xs">
            <div className="mb-3">
              <h2 className="text-xs sm:text-sm font-extrabold text-[#44261B] uppercase tracking-wider">
                Tu plan actual
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Bloque 1: Clases disponibles */}
              <div className="bg-[#FAF8F5] rounded-2xl p-3 sm:p-3.5 border border-[#E8D5B5] flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#F4E8D1] text-[#5E612B] flex items-center justify-center shrink-0">
                  <CreditCard className="w-4 h-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-[10px] font-bold text-[#A68D74] uppercase tracking-wider block">
                    Clases disponibles
                  </span>
                  <span className="text-sm sm:text-base font-black text-[#44261B] block leading-tight mt-0.5">
                    {isUnlimited ? 'Pase Libre' : `${student.credits_balance ?? 0}`}
                  </span>
                </div>
              </div>

              {/* Bloque 2: Estado del Plan */}
              <div className="bg-[#FAF8F5] rounded-2xl p-3 sm:p-3.5 border border-[#E8D5B5] flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#eaede7] text-[#5E612B] flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-4 h-4 text-[#5E612B]" />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-[10px] font-bold text-[#A68D74] uppercase tracking-wider block">
                    Estado
                  </span>
                  <span className="text-xs sm:text-sm font-bold text-[#5E612B] block leading-tight mt-0.5">
                    {isUpToDate ? 'Activo / Al día' : `Deuda: $${student.debt_amount}`}
                  </span>
                </div>
              </div>
            </div>

            {/* Aviso si quedan pocas clases o 0 créditos */}
            {!isUnlimited && (student.credits_balance ?? 0) <= 1 && (
              <div className="mt-3 p-3 rounded-2xl bg-[#F4E8D1]/50 border border-[#E8D5B5] flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-[#C18749] shrink-0" />
                  <p className="text-xs text-[#44261B] font-medium">
                    {(student.credits_balance ?? 0) === 0
                      ? 'No tienes créditos disponibles para nuevos turnos.'
                      : 'Te queda 1 última clase disponible en tu plan.'}
                  </p>
                </div>
                {onOpenBuyPack && (
                  <button
                    onClick={onOpenBuyPack}
                    className="px-3 py-1 rounded-xl bg-[#5E612B] hover:bg-[#44261B] text-[#F4E8D1] text-xs font-bold shrink-0 transition-colors cursor-pointer"
                  >
                    Renovar pack
                  </button>
                )}
              </div>
            )}
          </section>

          {/* ------------------------------------------------------------ */}
          {/* C. FILOSOFÍA SERMOA (Directamente debajo de Tu Plan Actual)   */}
          {/* ------------------------------------------------------------ */}
          <div className="bg-[#FAF8F5] rounded-3xl p-3.5 sm:p-4 border border-[#E8D5B5] flex items-center gap-3.5 relative overflow-hidden group">
            <div className="w-10 h-10 rounded-xl bg-[#F4E8D1]/70 flex items-center justify-center shrink-0 border border-[#E8D5B5]/60 overflow-hidden">
              <img
                src="/pilates-silhouette.png"
                alt="Pilates Sermoa"
                className="w-8 h-8 object-contain opacity-45 mix-blend-multiply transition-opacity group-hover:opacity-60"
              />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] font-bold text-[#5E612B]/90 uppercase tracking-wider block">
                Filosofía Sermoa
              </span>
              <p className="text-xs text-[#A68D74] font-serif italic leading-snug mt-0.5">
                "Movimiento consciente, control y equilibrio en cada sesión."
              </p>
            </div>
          </div>

        </div>

      {/* Modal de confirmación para cancelar turno */}
      <ConfirmDialog
        isOpen={!!bookingToCancel}
        title="¿Cancelar turno reservado?"
        message="Si cancelas con anticipación, tu crédito se reembolsará automáticamente en tu saldo."
        confirmText="Sí, cancelar reserva"
        cancelText="Conservar turno"
        variant="danger"
        onConfirm={handleConfirmCancel}
        onCancel={() => setBookingToCancel(null)}
      />

    </div>
  );
};
