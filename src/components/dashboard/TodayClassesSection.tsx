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
      <div className="bg-[#FAF8F5]/90 backdrop-blur-sm border border-[#E8DFD1] rounded-3xl p-5 sm:p-7 shadow-soft">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 pb-4 border-b border-[#E8DFD1]/80">
          <div>
            <div className="flex items-center space-x-2 text-xs font-black uppercase tracking-wider text-[#B87A4A] mb-1">
              <Calendar className="w-4 h-4 text-[#E68A5C]" />
              <span>Turnos Programados</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-[#1F2933] tracking-tight flex items-center gap-2">
              CLASES DE HOY
              <span className="text-xs font-extrabold bg-[#EFE9DF] text-[#6B5A4B] px-2.5 py-1 rounded-full border border-[#DFD5C6]">
                {allClassesToday.length} {allClassesToday.length === 1 ? 'clase' : 'clases'}
              </span>
            </h2>
          </div>

          <button
            onClick={() => onNavigate('classes')}
            className="text-xs font-bold text-[#8C502E] hover:text-[#5E361F] flex items-center space-x-1 transition-colors self-start sm:self-auto"
          >
            <span>Ver calendario completo</span>
            <span>→</span>
          </button>
        </div>

        {allClassesToday.length === 0 ? (
          <div className="text-center py-10 bg-white/60 rounded-2xl border border-dashed border-[#E8DFD1]">
            <Calendar className="w-10 h-10 text-stone-400 mx-auto mb-2 opacity-60" />
            <h3 className="font-extrabold text-[#1F2933] text-base">No hay clases programadas para hoy</h3>
            <p className="text-xs text-stone-500 mt-1">Descansa o agenda una nueva clase desde el calendario.</p>
          </div>
        ) : (
          <div>
            {/* Carrusel / pestañas de clases de hoy */}
            <div className="flex items-center space-x-3 overflow-x-auto pb-3 mb-5 scrollbar-none">
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

                return (
                  <button
                    key={cls.id}
                    onClick={() => setSelectedClassId(cls.id)}
                    className={`p-4 rounded-2xl border text-left min-w-[210px] shrink-0 transition-all ${
                      isSelected
                        ? 'border-[#B87A4A] bg-[#1F2933] text-white shadow-md scale-[1.02]'
                        : 'border-[#E8DFD1] bg-white/70 hover:bg-white text-stone-700'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className={`font-black flex items-center space-x-1.5 ${isSelected ? 'text-amber-200' : 'text-[#1F2933]'}`}>
                        <Clock className="w-3.5 h-3.5" />
                        <span>{cls.start_time} - {cls.end_time} hs</span>
                      </span>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-extrabold ${
                          isSelected
                            ? 'bg-white/20 text-white'
                            : 'bg-[#EFE9DF] text-[#6B5A4B]'
                        }`}
                      >
                        {clsBookings.length}/{cls.max_capacity}
                      </span>
                    </div>

                    <h4 className="font-extrabold text-sm truncate leading-snug">
                      {cls.title}
                    </h4>

                    <div className="flex items-center justify-between text-[11px] mt-2.5 pt-2 border-t border-white/10 opacity-90">
                      <span className="truncate flex items-center space-x-1">
                        <MapPin className="w-3 h-3 shrink-0" />
                        <span className="truncate">{branch?.name || 'Sede'}</span>
                      </span>
                      <span className="font-bold shrink-0">
                        {attendedCount > 0 ? `✓ ${attendedCount} presentes` : 'Por iniciar'}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Ficha detallada de la clase seleccionada */}
            {activeClass && (
              <div className="bg-white/80 rounded-2xl border border-[#E8DFD1] p-5 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#E8DFD1]/70">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="px-2.5 py-0.5 rounded-md bg-[#FCE7F3] text-[#9D174D] text-[11px] font-black uppercase tracking-wider">
                        Turno Activo
                      </span>
                      <span className="text-xs font-bold text-stone-500">
                        {activeBranch?.name} • Sala: {activeClass.room?.name || 'Principal'}
                      </span>
                    </div>
                    <h3 className="text-lg font-black text-[#1F2933] mt-1">
                      {activeClass.title} ({activeClass.start_time} a {activeClass.end_time} hs)
                    </h3>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setExpandedStudents(!expandedStudents)}
                      className="px-3 py-1.5 rounded-xl border border-[#E8DFD1] bg-white text-xs font-extrabold text-[#1F2933] hover:bg-[#FAF8F5] flex items-center space-x-1.5 transition-colors"
                    >
                      <Users className="w-3.5 h-3.5 text-[#B87A4A]" />
                      <span>{activeClassBookings.length} Alumnos confirmados</span>
                      {expandedStudents ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {/* Listado de alumnos que confirmaron el turno */}
                {expandedStudents && (
                  <div className="mt-4 space-y-2.5">
                    <div className="flex items-center justify-between text-xs font-black text-stone-500 uppercase tracking-wider px-1">
                      <span>Alumnos Inscriptos</span>
                      <span>Estado de Asistencia</span>
                    </div>

                    {activeClassBookings.length === 0 ? (
                      <div className="text-center py-6 text-stone-500 text-xs">
                        No hay alumnos inscriptos para este turno todavía.
                      </div>
                    ) : (
                      activeClassBookings.map((b) => {
                        const student = profiles.find((p) => p.id === b.student_id);
                        if (!student) return null;

                        const isAttended = b.status === 'attended';

                        return (
                          <div
                            key={b.id}
                            className={`p-3.5 rounded-xl border transition-all flex items-center justify-between gap-3 ${
                              isAttended
                                ? 'bg-emerald-50/70 border-emerald-200'
                                : 'bg-[#FAF8F5]/80 border-[#E8DFD1] hover:border-stone-400'
                            }`}
                          >
                            <div className="flex items-center space-x-3 min-w-0">
                              <div
                                className={`w-9 h-9 rounded-full font-black text-xs flex items-center justify-center shrink-0 ${
                                  isAttended
                                    ? 'bg-emerald-600 text-white shadow-xs'
                                    : 'bg-[#1F2933] text-white'
                                }`}
                              >
                                {student.first_name?.[0] || 'A'}
                                {student.last_name?.[0] || ''}
                              </div>
                              <div className="min-w-0">
                                <div className="flex items-center space-x-2">
                                  <h4 className="font-extrabold text-sm text-[#1F2933] truncate">
                                    {student.first_name} {student.last_name}
                                  </h4>
                                  {isAttended && (
                                    <span className="text-[10px] font-black bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full flex items-center space-x-1 shrink-0">
                                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                      <span>En Sala</span>
                                    </span>
                                  )}
                                </div>
                                <div className="flex items-center space-x-2 text-[11px] text-stone-500 mt-0.5">
                                  {student.phone && (
                                    <span className="flex items-center space-x-1">
                                      <Phone className="w-2.5 h-2.5" />
                                      <span>{student.phone}</span>
                                    </span>
                                  )}
                                  <span>•</span>
                                  <span>{student.credits_balance} créditos</span>
                                </div>
                              </div>
                            </div>

                            {/* Botón rápido de presencia / Check-in manual por si no pudo escanear el QR */}
                            <button
                              onClick={() => handleToggleAttendance(b.id, b.status)}
                              className={`px-3 py-1.5 rounded-xl text-xs font-extrabold flex items-center space-x-1.5 transition-all shrink-0 ${
                                isAttended
                                  ? 'bg-emerald-600 text-white shadow-xs hover:bg-emerald-700'
                                  : 'bg-[#EFE9DF] text-[#1F2933] hover:bg-[#E5DDCF]'
                              }`}
                              title={isAttended ? 'Click para desmarcar' : 'Confirmar presencia manualmente'}
                            >
                              <CheckCircle2 className={`w-3.5 h-3.5 ${isAttended ? 'text-white' : 'text-stone-500'}`} />
                              <span>{isAttended ? 'Presente' : 'Marcar Presente'}</span>
                            </button>
                          </div>
                        );
                      })
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* 2. MÓDULO: ASISTENCIA EN VIVO POR QR (Check-in en el estudio) */}
      <div className="bg-[#FAF8F5]/90 backdrop-blur-sm border border-[#E8DFD1] rounded-3xl p-5 sm:p-7 shadow-soft">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 pb-4 border-b border-[#E8DFD1]/80">
          <div>
            <div className="flex items-center space-x-2 text-xs font-black uppercase tracking-wider text-emerald-700 mb-1">
              <QrCode className="w-4 h-4 text-emerald-600" />
              <span>Control de Ingreso en Vivo</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-[#1F2933] tracking-tight flex items-center gap-2">
              ASISTENCIA & CHECK-IN POR QR
              <span className="text-xs font-extrabold bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-full border border-emerald-200">
                {todayAttendances.length} registrados hoy
              </span>
            </h2>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => onNavigate('attendance')}
              className="px-3 py-2 rounded-xl bg-white border border-[#E8DFD1] text-xs font-extrabold text-[#1F2933] hover:bg-[#FAF8F5] transition-colors flex items-center space-x-1.5"
            >
              <UserCheck className="w-4 h-4 text-emerald-600" />
              <span>Ir a Pasar Lista Completa</span>
            </button>
          </div>
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
