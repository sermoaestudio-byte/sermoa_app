import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  Users,
  CheckCircle2,
  QrCode,
  MapPin,
  ChevronDown,
  ChevronUp,
  UserCheck,
  AlertCircle,
  Sparkles,
  Phone
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useStudioStore } from '../../store/studioStore';
import { toISODateString } from '../../utils/date';
import { Booking, ClassSchedule, Profile, AttendanceRecord } from '../../types';

interface TodayClassesSectionProps {
  onNavigate: (view: string) => void;
}

export const TodayClassesSection: React.FC<TodayClassesSectionProps> = ({ onNavigate }) => {
  const {
    getEnrichedClasses,
    bookings,
    profiles,
    branches,
    attendances,
    markAttendance,
    currentUser,
    currentRole
  } = useStudioStore();

  const todayStr = toISODateString(new Date());

  // Clases de hoy ordenadas por horario
  const allClassesToday = getEnrichedClasses()
    .filter((c: ClassSchedule) => {
      if (c.is_cancelled) return false;
      if (!c.is_recurring && c.date !== todayStr) return false;
      if (c.is_recurring && c.day_of_week !== new Date().getDay()) return false;
      // Si el profesor tiene ID propio, podemos filtrar o mostrar todas las del estudio si no está especificado
      if (currentRole === 'instructor' && currentUser?.id && c.instructor_id) {
        // Si hay clases asignadas a este profesor, priorizamos o mostramos todas
        // Por flexibilidad mostramos todas las que correspondan al instructor o todas si solo hay un profe
      }
      return true;
    })
    .sort((a, b) => a.start_time.localeCompare(b.start_time));

  // Estado para la clase seleccionada / expandida
  const [selectedClassId, setSelectedClassId] = useState<string>(allClassesToday[0]?.id || '');
  const [expandedStudents, setExpandedStudents] = useState<boolean>(true);

  const activeClass = allClassesToday.find((c) => c.id === selectedClassId) || allClassesToday[0];
  const activeBranch = branches.find((b) => b.id === activeClass?.branch_id);

  // Reservas confirmadas / activas de la clase seleccionada para hoy
  const activeClassBookings = bookings.filter(
    (b: Booking) =>
      b.class_id === activeClass?.id &&
      (b.booking_date === todayStr || !b.booking_date) &&
      b.status !== 'cancelled_by_user' &&
      b.status !== 'cancelled_by_admin'
  );

  // Total de alumnos presentes hoy en todas las clases
  const todayAttendances = (attendances || []).filter(
    (a: AttendanceRecord) => a.timestamp?.startsWith(todayStr)
  );

  const handleToggleAttendance = (bookingId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'attended' ? 'no_show' : 'present';
    markAttendance(bookingId, newStatus);
    if (newStatus === 'present') {
      confetti({
        particleCount: 30,
        spread: 60,
        origin: { y: 0.7 },
      });
    }
  };

  return (
    <section className="space-y-6 mb-10">
      
      {/* 1. MÓDULO: CLASES DE HOY */}
      <div className="bg-white/95 backdrop-blur-sm border border-[#E8D5B5] rounded-3xl p-5 sm:p-7 shadow-soft">
        <div className="mb-5 pb-4 border-b border-[#E8D5B5]">
          <div className="flex items-center space-x-2 text-xs font-black uppercase tracking-wider text-[#C18749] mb-1">
            <Calendar className="w-4 h-4 text-[#5E612B]" />
            <span>Turnos Programados</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-[#44261B] tracking-tight flex items-center gap-2">
            CLASES DE HOY
            <span className="text-xs font-extrabold bg-[#F4E8D1] text-[#5E612B] px-2.5 py-1 rounded-full border border-[#E8D5B5]">
              {allClassesToday.length} {allClassesToday.length === 1 ? 'clase' : 'clases'}
            </span>
          </h2>
        </div>

        {allClassesToday.length === 0 ? (
          <div className="text-center py-12 bg-[#FAF8F5] rounded-3xl border border-dashed border-[#E8D5B5]">
            <Calendar className="w-12 h-12 text-[#A68D74] mx-auto mb-3 opacity-60" />
            <h3 className="font-extrabold text-[#44261B] text-base">No hay turnos programados para hoy</h3>
            <p className="text-xs text-[#A68D74] mt-1 max-w-sm mx-auto">
              No tienes clases asignadas en el día de hoy. Puedes consultar el calendario para ver los próximos días.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {allClassesToday.map((cls) => {
              const isSelected = cls.id === activeClass?.id;
              const clsBookings = bookings.filter(
                (b) =>
                  b.class_id === cls.id &&
                  (b.booking_date === todayStr || !b.booking_date) &&
                  b.status !== 'cancelled_by_user' &&
                  b.status !== 'cancelled_by_admin'
              );
              const attendedCount = clsBookings.filter((b) => b.status === 'attended').length;
              const branch = branches.find((b) => b.id === cls.branch_id);
              const instructor = profiles.find((p) => p.id === cls.instructor_id);
              const isExpanded = selectedClassId === cls.id;

              return (
                <div
                  key={cls.id}
                  className={`bg-white rounded-3xl border transition-all overflow-hidden ${
                    isExpanded
                      ? 'border-[#5E612B] shadow-md ring-1 ring-[#5E612B]/20'
                      : 'border-[#E8D5B5] shadow-xs hover:border-[#5E612B]/40'
                  }`}
                >
                  {/* Class Header Banner Row (Estilo exacto Foto 2) */}
                  <div
                    onClick={() => setSelectedClassId(isExpanded ? '' : cls.id)}
                    className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer hover:bg-[#FAF8F5]/60 transition-colors"
                  >
                    <div className="flex items-start sm:items-center space-x-4 min-w-0">
                      {/* Left Olive Pill with Start & End Time (Foto 2) */}
                      <div className="w-20 sm:w-24 py-2.5 px-2 bg-[#545D31] text-[#F4E8D1] rounded-2xl flex flex-col items-center justify-center shrink-0 shadow-2xs">
                        <span className="font-black text-sm sm:text-base leading-tight tracking-tight">
                          {cls.start_time}
                        </span>
                        <span className="text-[10px] font-semibold text-[#F4E8D1]/80 leading-none mt-0.5">
                          a {cls.end_time}
                        </span>
                      </div>

                      {/* Title & Metadata */}
                      <div className="min-w-0 space-y-1.5">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-black text-base sm:text-lg text-[#44261B] tracking-tight">
                            {cls.title}
                          </h3>
                          <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#eaede7] text-[#5E612B] border border-[#cadbcd]">
                            {cls.title}
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#44261B]/80 font-medium">
                          {/* Sede y Sala */}
                          <div className="flex items-center space-x-1.5 text-[#C18749]">
                            <MapPin className="w-3.5 h-3.5 text-[#C18749]" />
                            <span className="font-bold">
                              {branch?.name || 'Sede Principal'}{cls.room?.name ? ` (${cls.room.name})` : ''}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right side stats pill and expand chevron */}
                    <div className="flex items-center justify-between sm:justify-end space-x-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#E8D5B5]/60">
                      <div className="flex items-center space-x-2">
                        <span
                          className={`text-xs font-black px-3 py-1.5 rounded-xl border ${
                            clsBookings.length >= cls.max_capacity
                              ? 'bg-[#B74E2A]/10 text-[#B74E2A] border-[#B74E2A]/30'
                              : 'bg-[#F4E8D1] text-[#44261B] border-[#E8D5B5]'
                          }`}
                        >
                          {clsBookings.length}/{cls.max_capacity} Alumnos
                        </span>
                        {attendedCount > 0 && (
                          <span className="text-xs font-black px-2.5 py-1 rounded-xl bg-[#eaede7] text-[#5E612B] border border-[#cadbcd] hidden md:inline-flex items-center space-x-1">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>{attendedCount} presentes</span>
                          </span>
                        )}
                      </div>

                      <div className="w-8 h-8 rounded-xl bg-[#FAF8F5] border border-[#E8D5B5] flex items-center justify-center text-[#44261B]">
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4 text-[#5E612B]" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-[#A68D74]" />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Expandable Section: Alumnos del turno y Pasar Lista */}
                  {isExpanded && (
                    <div className="p-4 sm:p-6 bg-[#FAF8F5] border-t border-[#E8D5B5] space-y-3 animate-fade-in">
                      <div className="flex items-center justify-between text-xs font-black text-[#A68D74] uppercase tracking-wider px-1">
                        <span>Alumnos Inscriptos a este turno</span>
                        <span>Asistencia</span>
                      </div>

                      {clsBookings.length === 0 ? (
                        <div className="p-6 text-center bg-white rounded-2xl border border-dashed border-[#E8D5B5] text-xs text-[#A68D74]">
                          No hay alumnos inscriptos para este turno todavía.
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {clsBookings.map((b) => {
                            const student = profiles.find((p) => p.id === b.student_id);
                            if (!student) return null;
                            const isAttended = b.status === 'attended';

                            return (
                              <div
                                key={b.id}
                                className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                                  isAttended
                                    ? 'bg-[#eaede7] border-[#cadbcd]'
                                    : 'bg-white border-[#E8D5B5] hover:border-[#5E612B]/40'
                                }`}
                              >
                                <div className="flex items-center space-x-3 min-w-0">
                                  <div
                                    className={`w-10 h-10 rounded-2xl font-black text-xs flex items-center justify-center shrink-0 shadow-2xs overflow-hidden ${
                                      isAttended
                                        ? 'bg-[#5E612B] text-white'
                                        : 'bg-[#F4E8D1] border border-[#E8D5B5] text-[#5E612B]'
                                    }`}
                                  >
                                    {student.avatar_url ? (
                                      <img src={student.avatar_url} alt="" className="w-full h-full object-cover" />
                                    ) : (
                                      <span>{student.first_name?.[0]}{student.last_name?.[0]}</span>
                                    )}
                                  </div>
                                  <div className="min-w-0">
                                    <div className="flex items-center space-x-2">
                                      <h4 className="font-extrabold text-sm text-[#44261B] truncate">
                                        {student.first_name} {student.last_name}
                                      </h4>
                                      {isAttended && (
                                        <span className="text-[10px] font-black bg-[#F4E8D1] text-[#5E612B] px-2 py-0.5 rounded-full flex items-center space-x-1 shrink-0 border border-[#E8D5B5]">
                                          <CheckCircle2 className="w-3 h-3 text-[#5E612B]" />
                                          <span>En Sala</span>
                                        </span>
                                      )}
                                    </div>
                                    <div className="flex items-center space-x-2 text-[11px] text-[#A68D74] mt-0.5">
                                      {student.phone && (
                                        <span className="flex items-center space-x-1">
                                          <Phone className="w-2.5 h-2.5" />
                                          <span>{student.phone}</span>
                                        </span>
                                      )}
                                      <span>•</span>
                                      <span>{student.credits_balance === 999 ? 'Pase Libre' : `${student.credits_balance} créditos`}</span>
                                    </div>
                                  </div>
                                </div>

                                {/* Botón rápido de presencia */}
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleToggleAttendance(b.id, b.status);
                                  }}
                                  className={`px-3 py-1.5 rounded-xl text-xs font-extrabold flex items-center space-x-1.5 transition-all shrink-0 cursor-pointer ${
                                    isAttended
                                      ? 'bg-[#5E612B] text-[#F4E8D1] shadow-xs hover:bg-[#44261B]'
                                      : 'bg-[#F4E8D1] text-[#44261B] hover:bg-[#E8D5B5] border border-[#E8D5B5]'
                                  }`}
                                  title={isAttended ? 'Click para desmarcar' : 'Confirmar presencia manualmente'}
                                >
                                  <CheckCircle2 className={`w-3.5 h-3.5 ${isAttended ? 'text-[#F4E8D1]' : 'text-[#5E612B]'}`} />
                                  <span>{isAttended ? 'Presente' : 'Marcar Presente'}</span>
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 2. MÓDULO: ASISTENCIA EN VIVO POR QR (Check-in en el estudio) */}
      <div className="bg-white/95 backdrop-blur-sm border border-[#E8D5B5] rounded-3xl p-5 sm:p-7 shadow-soft">
        <div className="mb-5 pb-4 border-b border-[#E8D5B5]">
          <div className="flex items-center space-x-2 text-xs font-black uppercase tracking-wider text-[#5E612B] mb-1">
            <QrCode className="w-4 h-4 text-[#5E612B]" />
            <span>Control de Ingreso en Vivo</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-[#44261B] tracking-tight flex items-center gap-2">
            ASISTENCIA & CHECK-IN POR QR
            <span className="text-xs font-extrabold bg-[#eaede7] text-[#5E612B] px-2.5 py-1 rounded-full border border-[#cadbcd]">
              {todayAttendances.length} registrados hoy
            </span>
          </h2>
        </div>

        {/* Explicativo sutil de la dinámica del QR en el estudio */}
        <div className="mb-4 p-3.5 rounded-2xl bg-gradient-to-r from-amber-50 to-rose-50 border border-amber-200/60 flex items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-xl bg-[#1F2933] text-white flex items-center justify-center shrink-0">
              <QrCode className="w-4 h-4 text-amber-300" />
            </div>
            <p className="text-xs text-stone-700 leading-relaxed font-medium">
              Los alumnos escanean el código QR en la recepción o puerta del estudio con su celular para validar su turno y quedar marcados como <strong className="text-emerald-700 font-extrabold">Presentes</strong> al instante.
            </p>
          </div>
        </div>

        {/* Timeline / Listado de asistencias de hoy registradas por QR o manual */}
        {todayAttendances.length === 0 ? (
          <div className="text-center py-8 bg-white/60 rounded-2xl border border-dashed border-[#E8DFD1]">
            <QrCode className="w-9 h-9 text-stone-400 mx-auto mb-2 opacity-50" />
            <h4 className="font-extrabold text-[#1F2933] text-sm">Esperando los primeros ingresos del día</h4>
            <p className="text-xs text-stone-500 mt-0.5">
              A medida que los alumnos lleguen y escaneen el QR del estudio, aparecerán aquí automáticamente.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {todayAttendances.map((att: AttendanceRecord) => {
              const student = profiles.find((p) => p.id === att.student_id);
              const cls = getEnrichedClasses().find((c) => c.id === att.class_id);
              const time = att.timestamp ? new Date(att.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--:--';

              return (
                <div
                  key={att.id}
                  className="p-3.5 rounded-2xl bg-white border border-emerald-100 shadow-xs flex items-center justify-between gap-3"
                >
                  <div className="flex items-center space-x-3 min-w-0">
                    <div className="w-9 h-9 rounded-full bg-emerald-500 text-white font-black text-xs flex items-center justify-center shrink-0 shadow-xs">
                      {student?.first_name?.[0] || 'A'}
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-extrabold text-sm text-[#1F2933] truncate">
                        {student?.first_name} {student?.last_name}
                      </h4>
                      <p className="text-[11px] text-stone-500 truncate">
                        {cls?.title || 'Clase'} ({cls?.start_time || ''} hs)
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-black border border-emerald-200">
                      <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                      <span>{time} hs</span>
                    </span>
                    <span className="block text-[9px] text-stone-400 font-extrabold uppercase mt-0.5">
                      {att.checkin_method === 'qr_gps' ? 'QR Estudio' : 'Manual'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </section>
  );
};
