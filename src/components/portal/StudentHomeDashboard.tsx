import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
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
  Plus,
  Heart,
  Navigation,
  User
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
  onOpenCheckinGPS?: () => void;
}

export const StudentHomeDashboard: React.FC<StudentHomeDashboardProps> = ({
  student,
  studio,
  onGoToSchedule,
  onGoToRoutines,
  onGoToProfile,
  onGoToBookings,
  onOpenBuyPack,
  onOpenCheckinGPS,
}) => {
  const { bookings, classes, branches, cancelBooking } = useStudioStore();
  const [bookingToCancel, setBookingToCancel] = useState<string | null>(null);
  const [showQRModal, setShowQRModal] = useState(false);

  const qrPassPayload = JSON.stringify({
    student_id: student.id,
    dni: student.id_number || '38921450',
    name: `${student.first_name} ${student.last_name}`,
    token: `SERMOA-PASS-${student.id}-${Date.now().toString().slice(-4)}`,
  });

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
        {/* A. MEMBER PASS: CREDENCIAL DIGITAL DEL ALUMNO                */}
        {/* ------------------------------------------------------------ */}
        <section className="relative rounded-[26px] overflow-hidden shadow-soft border border-[#E8D5B5] transition-all hover:shadow-md group">
          {/* Pass Top Banner con paleta otoñal Sermoa */}
          <div
            className="relative p-5 sm:p-6 text-white"
            style={{
              background: 'linear-gradient(135deg, #44261B 0%, #5E612B 40%, #545D31 70%, #C18749 100%)',
            }}
          >
            {/* Silueta Pilates sutil */}
            <img
              src="/pilates-silhouette.png"
              alt=""
              className="absolute -right-4 -bottom-6 w-36 h-36 opacity-15 pointer-events-none select-none invert"
            />

            <div className="relative z-10 flex items-start justify-between">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="tracking-[0.2em] uppercase text-[10px] font-black text-[#F4E8D1]">
                    {studio.name || 'SERMOA'}
                  </span>
                  <span className="text-[10px] text-[#E8D5B5]/80 font-semibold">• ESTUDIO</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black tracking-tight mt-0.5 text-[#F4E8D1] uppercase">
                  MEMBER PASS
                </h2>
              </div>

              <div className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-black/25 backdrop-blur-md border border-[#F4E8D1]/30 text-[#F4E8D1] text-[10px] font-extrabold uppercase tracking-wider">
                <Sparkles className="w-3 h-3 text-[#D98E2A]" />
                <span>{isUnlimited ? 'VIP GOLD' : 'SERMOA CLUB'}</span>
              </div>
            </div>

            <div className="relative z-10 my-3 flex items-center justify-between gap-3">
              <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-md border border-[#F4E8D1]/30 flex items-center justify-center shrink-0">
                <Heart className="w-6 h-6 text-[#F4E8D1] fill-[#D98E2A]/50" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-black text-[#F4E8D1]">
                  Estás en la <span className="underline decoration-[#D98E2A]">categoría inicial</span>.
                </p>
                <p className="text-[10px] text-[#F4E8D1]/85 mt-0.5 leading-snug">
                  Para subir de categoría, deberás llegar a los <strong>cuatro meses</strong> de renovación continua.
                </p>
              </div>
            </div>

            <div className="relative z-10 border-t border-[#F4E8D1]/20 pt-2 flex items-center justify-between text-[10px] text-[#F4E8D1]/80 font-medium">
              <span>Sede Principal & Red Sermoa</span>
              <span className="text-[#F4E8D1] font-bold">2026 Pass</span>
            </div>
          </div>

          {/* Pass Bottom Card */}
          <div className="bg-[#FAF8F5] p-4 sm:p-5 border-t border-[#E8D5B5]">
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <div className="flex items-center space-x-3 min-w-0">
                <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-white shadow-soft bg-[#F4E8D1] flex items-center justify-center shrink-0">
                  {student.avatar_url ? (
                    <img
                      src={student.avatar_url}
                      alt={`${student.first_name} ${student.last_name}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-[#5E612B] bg-gradient-to-br from-[#F4E8D1] to-[#E8D5B5]">
                      <User className="w-6 h-6 text-[#5E612B]" />
                    </div>
                  )}
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#A68D74] block">
                    Alumno / Titular
                  </span>
                  <h3 className="text-sm sm:text-base font-black text-[#44261B] truncate uppercase">
                    {student.last_name ? `${student.last_name}, ${student.first_name}` : student.first_name}
                  </h3>
                  <p className="text-[11px] text-[#5E612B] font-medium">
                    DNI: <span className="font-bold text-[#44261B]">{student.id_number || 'No especificado'}</span>
                    <span className="ml-2 font-normal text-[#A68D74]">• Nivel: <strong className="text-[#B74E2A]">{isUnlimited ? 'VIP GOLD' : 'SERMOA'}</strong></span>
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={onGoToProfile}
                className="text-xs font-bold text-[#5E612B] hover:text-[#44261B] flex items-center gap-1 transition-colors ml-auto cursor-pointer"
              >
                <span>Ver Mi Perfil</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Credential Action Buttons */}
            <div className="mt-3.5 grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => setShowQRModal(true)}
                className="py-2.5 px-3 bg-[#5E612B] hover:bg-[#44261B] text-[#F4E8D1] rounded-xl text-xs font-extrabold shadow-xs transition-all flex items-center justify-center space-x-1.5 cursor-pointer active:scale-98"
              >
                <QrCode className="w-4 h-4 text-[#F4E8D1]" />
                <span>Ver QR de Ingreso</span>
              </button>

              <button
                type="button"
                onClick={onOpenCheckinGPS || onGoToProfile}
                className="py-2.5 px-3 bg-[#F4E8D1]/60 hover:bg-[#F4E8D1] text-[#44261B] border border-[#E8D5B5] rounded-xl text-xs font-extrabold transition-all flex items-center justify-center space-x-1.5 shadow-2xs cursor-pointer active:scale-98"
              >
                <Navigation className="w-4 h-4 text-[#B74E2A]" />
                <span>Check-in GPS</span>
              </button>
            </div>
          </div>
        </section>

          {/* ------------------------------------------------------------ */}
          {/* B. PRIORIDAD 2: PRÓXIMA CLASE O ESTADO DE RESERVAS           */}
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
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-xs sm:text-sm font-extrabold text-[#44261B] uppercase tracking-wider">
                Tu plan actual
              </h2>
              {(!student.has_medical_certificate || student.status === 'pending_approval') && (
                <span className="text-[10px] font-extrabold text-amber-800 bg-amber-100 border border-amber-300 px-2 py-0.5 rounded-full">
                  {student.status === 'pending_approval' ? 'Ficha Médica en Revisión' : 'Apto Médico Pendiente'}
                </span>
              )}
            </div>

            {(!student.has_medical_certificate || student.status === 'pending_approval') && (
              <div className="mb-3 p-3.5 rounded-2xl bg-amber-50/90 border border-amber-300/80 flex items-start gap-3 text-amber-950 animate-fade-in">
                <Clock className="w-5 h-5 text-amber-600 shrink-0 mt-0.5 animate-pulse" />
                <div>
                  <h4 className="text-xs font-black uppercase tracking-wider text-amber-900">
                    {student.status === 'pending_approval'
                      ? 'Ficha Médica y Registro en Revisión'
                      : 'Informe Médico Pendiente de Validación'}
                  </h4>
                  <p className="text-xs text-amber-900 font-semibold mt-0.5 leading-relaxed">
                    {student.status === 'pending_approval'
                      ? 'Podrás reservar turnos una vez que el administrador valide tu ficha médica y autorice tu cuenta.'
                      : 'Para poder reservar clases, es necesario que la administración valide y apruebe tu informe médico o apto físico.'}
                  </p>
                </div>
              </div>
            )}

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
                    {isUnlimited ? 'Pase Libre' : `${student.credits_balance ?? 0} clases`}
                  </span>
                  {student.status === 'pending_approval' && (
                    <span className="text-[9px] font-extrabold text-amber-800 bg-amber-100 border border-amber-200 px-1.5 py-0.5 rounded-md inline-block mt-1">
                      Pendiente de aprobación para su uso
                    </span>
                  )}
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
                  <span className="text-xs sm:text-sm font-bold block leading-tight mt-0.5 text-[#5E612B]">
                    {student.status === 'pending_approval'
                      ? 'Validación Médica en Curso'
                      : !student.has_medical_certificate
                        ? 'Apto Médico Pendiente'
                        : (isUpToDate ? 'Activo / Al día' : `Deuda: ${student.debt_amount}`)}
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
          {/* C. MI RUTINA DE ENTRENAMIENTO                                */}
          {/* ------------------------------------------------------------ */}
          <div className="bg-white rounded-3xl p-4 sm:p-5 border border-[#E8D5B5] shadow-xs flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-2xl bg-[#eaede7] text-[#5E612B] flex items-center justify-center shrink-0">
                <Dumbbell className="w-5 h-5 text-[#5E612B]" />
              </div>
              <div className="min-w-0">
                <h3 className="text-xs sm:text-sm font-extrabold text-[#44261B] uppercase tracking-wider">
                  Mi Rutina de Entrenamiento
                </h3>
                <p className="text-xs text-[#A68D74] truncate">
                  {student.medical_notes || 'Ejercicios de acondicionamiento y Pilates Reformer asignados a tu perfil.'}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onGoToRoutines}
              className="px-3.5 py-2 bg-[#5E612B] hover:bg-[#44261B] text-[#F4E8D1] rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <span>Ver Rutina</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* ------------------------------------------------------------ */}
          {/* D. FILOSOFÍA SERMOA                                          */}
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

      {/* Modal QR de Ingreso para el Alumno */}
      {showQRModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-sm w-full text-center shadow-2xl border border-[#E8D5B5]">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#44261B] bg-[#F4E8D1] px-3 py-1 rounded-full border border-[#E8D5B5]">
                Pase de Acceso Sermoa
              </span>
              <button
                type="button"
                onClick={() => setShowQRModal(false)}
                className="text-[#A68D74] hover:text-[#44261B] text-sm font-bold p-1 rounded-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            <h3 className="text-lg font-black text-[#44261B]">
              {student.first_name} {student.last_name}
            </h3>
            <p className="text-xs text-[#5E612B] mb-4">
              DNI: {student.id_number || '38.921.450'}
            </p>

            <div className="p-4 bg-[#F7F3EC] border-2 border-dashed border-[#E8D5B5] rounded-3xl inline-block shadow-inner my-2">
              <QRCodeSVG
                value={qrPassPayload}
                size={190}
                level="H"
                includeMargin={true}
              />
            </div>

            <p className="text-[11px] text-[#A68D74] mt-3 leading-relaxed">
              Muestra este código al profesor o acerca tu pantalla al tótem de recepción al ingresar.
            </p>

            <button
              type="button"
              onClick={() => setShowQRModal(false)}
              className="mt-5 w-full py-3 bg-[#5E612B] hover:bg-[#44261B] text-[#F4E8D1] font-extrabold text-xs rounded-2xl transition-colors cursor-pointer"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
