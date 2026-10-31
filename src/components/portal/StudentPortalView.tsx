import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  QrCode,
  User,
  Plus,
  CheckCircle2,
  AlertCircle,
  Smartphone,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Sparkles,
  LogOut,
  Menu
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useStudioStore } from '../../store/studioStore';
import { getWeekDates, toISODateString } from '../../utils/date';
import { StudentRegisterView } from './StudentRegisterView';
import { StudentHomeDashboard } from './StudentHomeDashboard';
import { StudentProfileView } from './StudentProfileView';
import { StudentBookingsTab } from './StudentBookingsTab';
import { StudentRoutinesTab } from './StudentRoutinesTab';
import { StudentCheckinModal } from '../checkin/StudentCheckinModal';
import { BuyPackModal } from '../payments/BuyPackModal';
import { StudentSidebar } from './StudentSidebar';
import { ClassSchedule } from '../../types';
import { Dumbbell } from 'lucide-react';

export const StudentPortalView: React.FC = () => {
  const {
    studio,
    branches,
    classes,
    profiles,
    currentStudentId,
    setCurrentStudentId,
    bookClass,
    currentUser,
    bookings,
    waitlist,
    processWaitlistResponse,
    expireWaitlistEntry,
    getEnrichedClasses,
  } = useStudioStore();

  const [activeTab, setActiveTab] = useState<'home' | 'my_profile' | 'schedule' | 'my_bookings' | 'my_routines' | 'register'>('home');
  const [showSidebarDrawer, setShowSidebarDrawer] = useState(false);
  const [selectedBranchId, setSelectedBranchId] = useState('');
  const [selectedDiscipline, setSelectedDiscipline] = useState('Pilates Reformer');
  const [selectedInstructorId, setSelectedInstructorId] = useState('');
  const [collapsedDays, setCollapsedDays] = useState<Record<string, boolean>>({});
  const [selectedDayIndex, setSelectedDayIndex] = useState<number>(new Date().getDay());
  const [currentWeekDate, setCurrentWeekDate] = useState(new Date());
  const [scheduleViewMode, setScheduleViewMode] = useState<'calendar' | 'list'>('calendar');
  const [showCheckinGPSModal, setShowCheckinGPSModal] = useState(false);
  const [isBuyPackOpen, setIsBuyPackOpen] = useState(false);

  // Toggle de colapso de día
  const toggleDayCollapse = (dateStr: string, defaultState: boolean) => {
    setCollapsedDays((prev) => {
      const current = prev[dateStr] !== undefined ? prev[dateStr] : defaultState;
      return { ...prev, [dateStr]: !current };
    });
  };

  // Waitlist Confirmation state
  const [pendingWaitlistId, setPendingWaitlistId] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('action') === 'confirm_waitlist') {
      const waitlistId = params.get('waitlist_id');
      if (waitlistId) {
        setPendingWaitlistId(waitlistId);
      }
    }
  }, []);

  // Simulación de login: permitimos elegir un estudiante para probar
  const students = profiles.filter((p) => p.role === 'client');
  // Usamos el estudiante emulado (si es estudiante), o el que esté seleccionado, o currentUser si es estudiante
  const currentStudent = profiles.find((p) => p.id === currentStudentId && p.role === 'client') || (currentUser?.role === 'client' ? currentUser : null);

  // Expiration Checker for Waitlist
  useEffect(() => {
    const hasPendingWaitlist = waitlist.some((w) => w.status === 'pending_confirmation' && w.expires_at);
    if (!hasPendingWaitlist) return;

    const timer = setInterval(() => {
      const now = Date.now();
      waitlist.forEach((w) => {
        if (w.status === 'pending_confirmation' && w.expires_at) {
          if (now >= new Date(w.expires_at).getTime()) {
            expireWaitlistEntry(w.id);
          }
        }
      });
    }, 5000);
    return () => clearInterval(timer);
  }, [waitlist]);

  const weekDays = getWeekDates(currentWeekDate);
  const businessWeekDays = weekDays.filter((d) => d.date.getDay() >= 1 && d.date.getDay() <= 5);

  // Obtener clases enriquecidas con instructores y salas reales del store
  const enrichedClasses = getEnrichedClasses();
  const instructors = profiles.filter((p) => p.role === 'instructor' || p.role === 'admin');

  // Filtrado de clases según Sede, Disciplina y Profesor
  const filteredScheduleClasses = enrichedClasses.filter((c) => {
    if (selectedBranchId && c.branch_id !== selectedBranchId) return false;
    if (selectedInstructorId && c.instructor_id !== selectedInstructorId) return false;
    if (selectedDiscipline && selectedDiscipline !== 'ALL') {
      const matchActivity = c.activity?.name?.toLowerCase().includes(selectedDiscipline.toLowerCase());
      const matchTitle = c.title?.toLowerCase().includes(selectedDiscipline.toLowerCase());
      if (!matchActivity && !matchTitle) return false;
    }
    return true;
  });

  const handleBook = (cls: ClassSchedule, dateStr?: string) => {
    if (!currentStudent) return;

    const todayDateStr = toISODateString(new Date());
    const targetDateStr = dateStr || todayDateStr;

    // Validation: Date in the past
    if (targetDateStr < todayDateStr) {
      alert('No es posible reservar un turno de una fecha que ya pasó.');
      return;
    }

    // Validation: Time in the past for today
    if (targetDateStr === todayDateStr && cls.start_time) {
      const now = new Date();
      const currentHours = String(now.getHours()).padStart(2, '0');
      const currentMinutes = String(now.getMinutes()).padStart(2, '0');
      const currentTimeStr = `${currentHours}:${currentMinutes}`;
      if (cls.start_time < currentTimeStr) {
        alert('El horario de esta clase ya ha pasado.');
        return;
      }
    }

    // We need to pass the date because if we book for tomorrow, it shouldn't book for today.
    // If no date is passed, it falls back to the store default (today).
    const res = bookClass(cls.id, currentStudent.id, targetDateStr, false);
    if (!res.success && res.message.toLowerCase().includes('créditos')) {
      setIsBuyPackOpen(true);
    } else {
      alert(res.message);
    }
    if (res.success && !res.isWaitlist) {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F2EB]/60 pb-24 relative overflow-x-hidden flex font-sans selection:bg-[#E8D5B5] selection:text-[#44261B]">

      {/* Decorative Silhouette Watermark in Background (Contraste artístico Sermoa en el lateral) */}
      <div
        className="fixed inset-0 pointer-events-none z-0 overflow-hidden flex items-center justify-end pr-4 sm:pr-8 md:pr-12"
        aria-hidden="true"
      >
        <img
          src="/pilates-silhouette.png"
          alt=""
          className="w-[280px] sm:w-[420px] md:w-[500px] lg:w-[520px] max-w-none opacity-[0.22] select-none mix-blend-multiply translate-x-4 sm:translate-x-6 translate-y-2"
        />
      </div>

      {/* 1. Left Navbar Sidebar permanente (visible siempre en desktop con toggle colapsable) */}
      <div className="hidden lg:block shrink-0 relative z-30">
        <StudentSidebar
          student={currentStudent}
          studio={studio}
          activeTab={activeTab}
          onSelectTab={(tab) => setActiveTab(tab)}
          onLogout={() => {
            window.location.hash = '#login';
          }}
          studentsList={students}
          currentStudentId={currentStudent?.id || ''}
          onSelectStudent={(id) => setCurrentStudentId(id)}
        />
      </div>

      {/* 2. Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 relative z-10">

        {/* Student App Topbar */}
        <header className="bg-white/95 backdrop-blur-md border-b border-[#E8D5B5] sticky top-0 z-30 shadow-xs relative">
          <div className="max-w-3xl lg:max-w-[760px] xl:max-w-[800px] mr-auto ml-0 px-4 sm:px-8 py-3 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {/* Hamburger Button on Left (visible en pantallas móviles) */}
              <button
                onClick={() => setShowSidebarDrawer(true)}
                className="lg:hidden p-2 text-[#44261B] hover:text-[#5E612B] hover:bg-[#F4E8D1] rounded-xl transition-colors border border-[#E8D5B5] cursor-pointer flex items-center justify-center shadow-2xs"
                title="Abrir menú lateral"
              >
                <Menu className="w-5 h-5 text-[#44261B]" />
              </button>

              <div className="w-9 h-9 rounded-xl bg-white border border-[#E8D5B5] p-1 shadow-2xs flex items-center justify-center shrink-0">
                <img
                  src={studio.logo_url || '/logo.png'}
                  alt={studio.name}
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h2 className="font-extrabold text-[#44261B] text-sm leading-tight">
                  {studio.name || 'Sermoa'} • Portal
                </h2>
                <span className="text-[11px] text-[#A68D74] font-medium">Pilates & Bienestar</span>
              </div>
            </div>

            {/* Student Simulator Selector */}
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-bold text-[#A68D74] uppercase hidden sm:inline-block">
                Alumno:
              </span>
              <select
                value={currentStudent?.id || ''}
                onChange={(e) => setCurrentStudentId(e.target.value)}
                className="text-xs border-[#E8D5B5] rounded-xl bg-[#FAF8F5] p-1.5 focus:ring-[#5E612B] focus:border-[#5E612B] max-w-[150px] text-[#44261B] font-medium"
                title="Simulador: Cambiar de Alumno"
              >
                <option value="" disabled>Emular Usuario...</option>
                {students.map(s => (
                  <option key={s.id} value={s.id}>{s.first_name} {s.last_name}</option>
                ))}
              </select>
            </div>
          </div>
        </header>

        {/* Main Content Area con ancho amplio para el calendario y lista */}
        <main className="max-w-7xl mr-auto ml-0 px-4 sm:px-8 py-6 w-full">

          {/* TAB 1: SCHEDULE / BOOKING */}
          {activeTab === 'schedule' && (
            <div className="space-y-6 animate-fade-in">

              {/* Student Credit Summary Pill or Empty Register Banner */}
              {currentStudent ? (
                <div
                  className="text-white rounded-3xl p-5 shadow-soft flex items-center justify-between border border-[#E8D5B5]"
                  style={{
                    background: 'linear-gradient(135deg, #44261B 0%, #5E612B 45%, #C18749 100%)',
                  }}
                >
                  <div>
                    <span className="text-[10px] font-bold tracking-widest uppercase text-[#F4E8D1]/80 block">
                      Estado de tu Membresía
                    </span>
                    <h3 className="text-xl font-extrabold mt-0.5 text-white tracking-wide">
                      {currentStudent.credits_balance === 999
                        ? 'TIENES PASE LIBRE (ILIMITADO)'
                        : `TIENES ${currentStudent.credits_balance ?? 0} CRÉDITOS DISPONIBLES`}
                    </h3>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-3xl p-6 text-center border border-slate-200 shadow-soft space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-700 flex items-center justify-center mx-auto shadow-xs border border-brand-100">
                    <User className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-extrabold text-slate-900">Bienvenido al Portal de Alumnos</h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    Aún no hay alumnos activos registrados en el sistema. Puedes completar tu ficha médica para solicitar tu ingreso.
                  </p>
                </div>
              )}

              {/* BARRA DE FILTROS Y SELECTOR DE VISTA */}
              <div className="bg-white p-4 sm:p-5 rounded-3xl border border-[#E8D5B5] shadow-xs space-y-4">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Filtros: Sede, Disciplina, Profesor */}
                  <div className="flex flex-wrap items-center gap-3">
                    {/* Filtro Sede */}
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-bold text-[#A68D74]">Sede:</span>
                      <select
                        value={selectedBranchId}
                        onChange={(e) => setSelectedBranchId(e.target.value)}
                        className="px-3 py-1.5 bg-[#FAF8F5] border border-[#E8D5B5] rounded-xl text-xs font-bold text-[#44261B] focus:outline-none shadow-2xs cursor-pointer"
                      >
                        <option value="">Todas las Sedes</option>
                        {branches.map((b) => (
                          <option key={b.id} value={b.id}>
                            {b.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Filtro Disciplina */}
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-bold text-[#A68D74]">Disciplina:</span>
                      <select
                        value={selectedDiscipline}
                        onChange={(e) => setSelectedDiscipline(e.target.value)}
                        className="px-3 py-1.5 bg-[#FAF8F5] border border-[#E8D5B5] rounded-xl text-xs font-bold text-[#44261B] focus:outline-none shadow-2xs cursor-pointer"
                      >
                        <option value="Pilates Reformer">PILATES REFORMER</option>
                      </select>
                    </div>

                    {/* Filtro Profesor */}
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-bold text-[#A68D74]">Profesor:</span>
                      <select
                        value={selectedInstructorId}
                        onChange={(e) => setSelectedInstructorId(e.target.value)}
                        className="px-3 py-1.5 bg-[#FAF8F5] border border-[#E8D5B5] rounded-xl text-xs font-bold text-[#44261B] focus:outline-none shadow-2xs cursor-pointer"
                      >
                        <option value="">Todos los Profesores</option>
                        {instructors.map((ins) => (
                          <option key={ins.id} value={ins.id}>
                            {ins.first_name} {ins.last_name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Botón Reset Filtros */}
                    {(selectedBranchId || selectedInstructorId) && (
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedBranchId('');
                          setSelectedInstructorId('');
                        }}
                        className="text-xs font-bold text-[#CB563C] hover:text-[#44261B] underline transition-colors cursor-pointer ml-1"
                      >
                        Limpiar Filtros
                      </button>
                    )}
                  </div>

                  {/* Switcher: Calendario vs Lista */}
                  <div className="flex items-center space-x-1.5 bg-[#FAF8F5] p-1 rounded-2xl border border-[#E8D5B5]/60 shrink-0">
                    <button
                      type="button"
                      onClick={() => setScheduleViewMode('calendar')}
                      className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${scheduleViewMode === 'calendar'
                        ? 'bg-[#5E612B] text-[#F4E8D1] shadow-2xs'
                        : 'text-[#A68D74] hover:text-[#44261B]'
                        }`}
                    >
                      <Calendar className="w-3.5 h-3.5" />
                      <span>Calendario</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setScheduleViewMode('list')}
                      className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${scheduleViewMode === 'list'
                        ? 'bg-[#5E612B] text-[#F4E8D1] shadow-2xs'
                        : 'text-[#A68D74] hover:text-[#44261B]'
                        }`}
                    >
                      <Clock className="w-3.5 h-3.5" />
                      <span>Por Día</span>
                    </button>
                  </div>
                </div>

                {/* Navegador de Semana (Lunes a Viernes) */}
                <div className="flex items-center justify-between pt-2 border-t border-[#E8D5B5]/40">
                  <button
                    type="button"
                    onClick={() => {
                      const prev = new Date(currentWeekDate);
                      prev.setDate(prev.getDate() - 7);
                      setCurrentWeekDate(prev);
                    }}
                    className="p-1.5 rounded-xl border border-[#E8D5B5] text-[#5E612B] hover:bg-[#FAF8F5] transition-colors cursor-pointer"
                    title="Semana anterior"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  <div className="flex items-center space-x-2 text-center">
                    <span className="text-xs sm:text-sm font-extrabold text-[#44261B]">
                      Semana del {businessWeekDays[0]?.dayNumber} al {businessWeekDays[businessWeekDays.length - 1]?.dayNumber} de{' '}
                      {businessWeekDays[0]?.date.toLocaleString('es-ES', { month: 'long' })}
                    </span>
                    <button
                      type="button"
                      onClick={() => setCurrentWeekDate(new Date())}
                      className="px-2.5 py-0.5 rounded-lg text-[10px] font-bold bg-[#F4E8D1] text-[#5E612B] hover:bg-[#E8D5B5] transition-colors cursor-pointer"
                    >
                      Hoy
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      const next = new Date(currentWeekDate);
                      next.setDate(next.getDate() + 7);
                      setCurrentWeekDate(next);
                    }}
                    className="p-1.5 rounded-xl border border-[#E8D5B5] text-[#5E612B] hover:bg-[#FAF8F5] transition-colors cursor-pointer"
                    title="Semana siguiente"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* ========================================================================= */}
              {/* VISTA 1: FORMATO CALENDARIO SEMANAL (LUNES A VIERNES) */}
              {/* ========================================================================= */}
              {scheduleViewMode === 'calendar' && (
                <div className="grid grid-cols-1 md:grid-cols-5 gap-3 animate-fade-in">
                  {businessWeekDays.map((wd) => {
                    const dIndex = wd.date.getDay();
                    const dayClasses = filteredScheduleClasses
                      .filter((c) => {
                        if (c.day_of_week !== dIndex) return false;
                        if (!c.is_recurring && c.date !== wd.dateStr) return false;
                        return true;
                      })
                      .sort((a, b) => a.start_time.localeCompare(b.start_time));

                    const todayStr = toISODateString(new Date());
                    const isToday = todayStr === wd.dateStr;
                    const isPastDay = wd.dateStr < todayStr;
                    const now = new Date();
                    const currentTimeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

                    return (
                      <div
                        key={wd.dateStr}
                        className={`rounded-2xl border transition-all flex flex-col ${isPastDay
                          ? 'bg-[#FAF8F5]/50 border-slate-200 opacity-70'
                          : isToday
                            ? 'bg-[#FAF8F5] border-[#5E612B]/70 shadow-sm'
                            : 'bg-white border-[#E8D5B5]'
                          }`}
                      >
                        {/* Cabecera del día */}
                        <div
                          className={`p-3 text-center border-b ${isToday
                            ? 'bg-[#5E612B] text-[#F4E8D1]'
                            : isPastDay
                              ? 'bg-slate-100 border-slate-200 text-slate-500'
                              : 'border-[#E8D5B5]/60 bg-[#FAF8F5]'
                            } rounded-t-2xl`}
                        >
                          <div className="flex items-center justify-center gap-1.5">
                            <span className={`text-[11px] uppercase font-extrabold block ${isToday ? 'text-[#F4E8D1]' : isPastDay ? 'text-slate-500' : 'text-[#A68D74]'}`}>
                              {wd.dayName}
                            </span>
                            {isPastDay && (
                              <span className="text-[9px] font-bold uppercase px-1.5 py-0.2 rounded bg-slate-200 text-slate-600">
                                Pasado
                              </span>
                            )}
                          </div>
                          <span className={`text-base font-black block mt-0.5 ${isToday ? 'text-white' : isPastDay ? 'text-slate-500' : 'text-[#44261B]'}`}>
                            {wd.dayNumber}
                          </span>
                        </div>

                        {/* Lista de clases dentro de la columna del día */}
                        <div className="p-2.5 space-y-2.5 flex-1 min-h-[260px]">
                          {dayClasses.length === 0 ? (
                            <div className="h-full flex items-center justify-center p-3 text-center">
                              <span className="text-[11px] text-[#A68D74] italic">Sin clases</span>
                            </div>
                          ) : (
                            dayClasses.map((cls) => {
                              const classBookings = bookings.filter(
                                (b) =>
                                  b.class_id === cls.id &&
                                  (b.status === 'confirmed' || b.status === 'attended') &&
                                  (!b.booking_date || b.booking_date === wd.dateStr)
                              );
                              const enrolled = classBookings.length;
                              const availableSpots = Math.max(0, cls.max_capacity - enrolled);
                              const isFull = availableSpots <= 0;

                              const isAlreadyBooked = currentStudent
                                ? classBookings.some((b) => b.student_id === currentStudent.id)
                                : false;

                              const instructorName = cls.instructor
                                ? `${cls.instructor.first_name} ${cls.instructor.last_name || ''}`.trim()
                                : 'Profesor Sermoa';

                              const isPastTime = isPastDay || (isToday && cls.start_time < currentTimeStr);

                              return (
                                <div
                                  key={cls.id}
                                  className={`rounded-xl p-3 border shadow-2xs transition-all space-y-2 text-left ${isPastTime
                                    ? 'bg-slate-50/80 border-slate-200 text-slate-400'
                                    : 'bg-[#FAF8F5] hover:bg-white border-[#E8D5B5]'
                                    }`}
                                >
                                  {/* Horario y Cupos (sin la píldora repetitiva de disciplina) */}
                                  <div className="flex items-center justify-between gap-1">
                                    <div className={`flex items-center gap-1.5 text-xs font-black ${isPastTime ? 'text-slate-400' : 'text-[#44261B]'}`}>
                                      <Clock className={`w-3.5 h-3.5 ${isPastTime ? 'text-slate-400' : 'text-[#5E612B]'}`} />
                                      <span>{cls.start_time} a {cls.end_time} hs</span>
                                    </div>
                                    <span
                                      className={`text-[10px] font-bold px-2 py-0.5 rounded ${isPastTime
                                        ? 'bg-slate-200/70 text-slate-500'
                                        : isFull
                                          ? 'bg-rose-100 text-[#CB563C]'
                                          : 'bg-[#eaede7] text-[#5E612B]'
                                        }`}
                                    >
                                      {isPastTime ? 'Finalizado' : isFull ? 'Sin cupos' : `${availableSpots} cupos`}
                                    </span>
                                  </div>

                                  {/* Profesor */}
                                  <div className={`text-[11px] font-semibold truncate ${isPastTime ? 'text-slate-400' : 'text-[#A68D74]'}`}>
                                    {instructorName}
                                  </div>

                                  {/* Botón Reservar Turno */}
                                  {isAlreadyBooked ? (
                                    <div className="w-full py-1.5 rounded-xl bg-[#F4E8D1] text-[#5E612B] text-[11px] font-extrabold text-center border border-[#E8D5B5]">
                                      Anotado
                                    </div>
                                  ) : isPastTime ? (
                                    <div className="w-full py-1.5 rounded-xl bg-slate-100 text-slate-400 text-[11px] font-bold text-center border border-slate-200 select-none">
                                      No disponible
                                    </div>
                                  ) : (
                                    <button
                                      type="button"
                                      onClick={() => handleBook(cls, wd.dateStr)}
                                      className={`w-full py-2 rounded-xl text-[11px] font-extrabold transition-all cursor-pointer ${isFull
                                        ? 'bg-[#C18749] hover:bg-[#44261B] text-white'
                                        : 'bg-[#5E612B] hover:bg-[#44261B] text-[#F4E8D1]'
                                        }`}
                                    >
                                      {isFull ? 'Lista Espera' : 'Reservar Turno'}
                                    </button>
                                  )}
                                </div>
                              );
                            })
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* ========================================================================= */}
              {/* VISTA 2: FORMATO LISTA POR DÍA / EN FILAS (CONFORME A IMAGEN 1) */}
              {/* ========================================================================= */}
              {scheduleViewMode === 'list' && (
                <div className="space-y-4 animate-fade-in">
                  {businessWeekDays.map((wd) => {
                    const dIndex = wd.date.getDay();
                    const dayClasses = filteredScheduleClasses
                      .filter((c) => {
                        if (c.day_of_week !== dIndex) return false;
                        if (!c.is_recurring && c.date !== wd.dateStr) return false;
                        return true;
                      })
                      .sort((a, b) => a.start_time.localeCompare(b.start_time));

                    const todayStr = toISODateString(new Date());
                    const isToday = todayStr === wd.dateStr;
                    const isPastDay = wd.dateStr < todayStr;
                    const now = new Date();
                    const currentTimeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
                    const defaultCollapsed = isPastDay;
                    const isCollapsed = collapsedDays[wd.dateStr] !== undefined ? collapsedDays[wd.dateStr] : defaultCollapsed;
                    const monthName = wd.date.toLocaleString('es-ES', { month: 'long' });

                    return (
                      <div
                        key={wd.dateStr}
                        className={`rounded-2xl border transition-all overflow-hidden ${isPastDay
                          ? 'bg-[#FAF8F5]/40 border-slate-200 opacity-75'
                          : isToday
                            ? 'bg-white border-[#5E612B]/70 shadow-sm ring-1 ring-[#5E612B]/20'
                            : 'bg-white border-[#E8D5B5] shadow-xs'
                          }`}
                      >
                        {/* Header del Día Plegable */}
                        <button
                          type="button"
                          onClick={() => toggleDayCollapse(wd.dateStr, defaultCollapsed)}
                          className={`w-full flex items-center justify-between px-4 sm:px-6 py-3.5 text-left transition-colors cursor-pointer ${isToday
                            ? 'bg-[#F4E8D1]/70 hover:bg-[#F4E8D1]'
                            : isPastDay
                              ? 'bg-slate-100/70 hover:bg-slate-100 text-slate-500'
                              : 'bg-[#FAF8F5] hover:bg-[#F4E8D1]/40'
                            }`}
                        >
                          <div className="flex items-center space-x-3">
                            <div className={`w-2 h-2 rounded-full ${isToday ? 'bg-[#5E612B]' : isPastDay ? 'bg-slate-400' : 'bg-[#A68D74]'}`} />
                            <div className="flex items-center gap-2">
                              <span className={`text-xs sm:text-sm font-black uppercase tracking-wider ${isPastDay ? 'text-slate-600' : 'text-[#44261B]'}`}>
                                {wd.dayName} {wd.dayNumber} DE {monthName.toUpperCase()}
                              </span>
                              {isToday && (
                                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-[#5E612B] text-white">
                                  Hoy
                                </span>
                              )}
                              {isPastDay && (
                                <span className="text-[9px] font-bold uppercase px-2 py-0.5 rounded-full bg-slate-200 text-slate-600">
                                  Pasado
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center space-x-3">
                            <span className="text-xs font-bold text-[#A68D74]">
                              {dayClasses.length} {dayClasses.length === 1 ? 'clase' : 'clases'}
                            </span>
                            <div className="p-1 text-[#A68D74] hover:text-[#44261B] rounded-lg">
                              {isCollapsed ? (
                                <ChevronDown className="w-4 h-4 text-[#A68D74]" />
                              ) : (
                                <ChevronUp className="w-4 h-4 text-[#5E612B]" />
                              )}
                            </div>
                          </div>
                        </button>

                        {/* Contenido de Turnos en Filas */}
                        {!isCollapsed && (
                          <div className="divide-y divide-[#E8D5B5]/60 p-2 sm:p-3 bg-white">
                            {dayClasses.length > 0 ? (
                              dayClasses.map((cls) => {
                                const cellDateStr = wd.dateStr;
                                const classBookings = bookings.filter(
                                  (b) =>
                                    b.class_id === cls.id &&
                                    (b.status === 'confirmed' || b.status === 'attended') &&
                                    (b.booking_date === cellDateStr || !b.booking_date)
                                );
                                const enrolledCount = classBookings.length;
                                const availableSpots = Math.max(0, cls.max_capacity - enrolledCount);
                                const isFull = availableSpots <= 0;

                                // Verificar si este alumno ya está inscripto
                                const isAlreadyBooked = currentStudent
                                  ? classBookings.some((b) => b.student_id === currentStudent.id)
                                  : false;

                                const instructorName = cls.instructor
                                  ? `${cls.instructor.first_name} ${cls.instructor.last_name || ''}`.trim()
                                  : 'Profesor Sermoa';

                                const isPastTime = isPastDay || (isToday && cls.start_time < currentTimeStr);

                                return (
                                  <div
                                    key={cls.id}
                                    className={`p-3 sm:p-4 rounded-xl transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 group relative border ${isPastTime
                                      ? 'bg-slate-50/70 border-slate-200 text-slate-400'
                                      : 'hover:bg-[#FAF8F5] border-transparent hover:border-[#E8D5B5]'
                                      }`}
                                  >
                                    {/* Izquierda: Horario, Disciplina, Profesor */}
                                    <div className="flex items-start sm:items-center space-x-3.5 flex-1 min-w-0">
                                      {/* Indicador de color */}
                                      <div
                                        className="w-2.5 h-2.5 rounded-full shrink-0 mt-1 sm:mt-0"
                                        style={{ backgroundColor: isPastTime ? '#cbd5e1' : (cls.activity?.color || cls.color || '#5E612B') }}
                                      />

                                      {/* Horario */}
                                      <div className={`font-black text-xs sm:text-sm tracking-tight shrink-0 min-w-[95px] ${isPastTime ? 'text-slate-400' : 'text-[#44261B]'}`}>
                                        {cls.start_time}–{cls.end_time}
                                      </div>

                                      <span className="text-[#E8D5B5] hidden sm:inline">|</span>

                                      {/* Disciplina */}
                                      <div className={`font-extrabold text-xs sm:text-sm truncate ${isPastTime ? 'text-slate-400' : 'text-[#44261B] group-hover:text-[#5E612B]'}`}>
                                        {cls.title}
                                      </div>

                                      <span className="text-[#E8D5B5] hidden sm:inline">|</span>

                                      {/* Profesor */}
                                      <div className={`text-xs font-semibold truncate ${isPastTime ? 'text-slate-400' : 'text-[#A68D74]'}`}>
                                        {instructorName}
                                      </div>
                                    </div>

                                    {/* Derecha: Cupos y Botón Reservar / Estado */}
                                    <div className="flex items-center justify-between sm:justify-end space-x-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#E8D5B5]/50">
                                      {/* Cupos disponibles */}
                                      <span
                                        className={`text-xs font-extrabold px-2.5 py-1 rounded-full border ${isPastTime
                                          ? 'bg-slate-100 border-slate-200 text-slate-400'
                                          : isFull
                                            ? 'bg-rose-50 border-rose-200 text-[#CB563C]'
                                            : 'bg-[#eaede7] border-[#cadbcd] text-[#5E612B]'
                                          }`}
                                      >
                                        {isPastTime ? 'Finalizado' : isFull ? 'Sin cupos disponibles' : `${availableSpots}/${cls.max_capacity} cupos`}
                                      </span>

                                      {/* Botón de Acción */}
                                      {isAlreadyBooked ? (
                                        <span className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-[#F4E8D1] text-[#5E612B] text-xs font-extrabold border border-[#E8D5B5]">
                                          <CheckCircle2 className="w-3.5 h-3.5 text-[#5E612B]" />
                                          <span>Anotado</span>
                                        </span>
                                      ) : isPastTime ? (
                                        <span className="inline-block px-4 py-1.5 rounded-xl text-xs font-bold bg-slate-100 text-slate-400 border border-slate-200 select-none">
                                          No disponible
                                        </span>
                                      ) : (
                                        <button
                                          type="button"
                                          onClick={() => handleBook(cls, cellDateStr)}
                                          className={`px-4 py-1.5 rounded-xl text-xs font-extrabold transition-all shadow-xs cursor-pointer ${isFull
                                            ? 'bg-[#C18749] hover:bg-[#44261B] text-white'
                                            : 'bg-[#5E612B] hover:bg-[#44261B] text-[#F4E8D1]'
                                            }`}
                                        >
                                          {isFull ? 'Lista Espera' : 'Reservar'}
                                        </button>
                                      )}
                                    </div>
                                  </div>
                                );
                              })
                            ) : (
                              <div className="py-6 text-center text-[#A68D74]">
                                <p className="text-xs font-medium">No hay clases programadas para este día</p>
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
          )}

          {/* TAB 0: HOME DASHBOARD (Dashboard rediseñado: Próxima clase, Reservar, Plan unificado, Accesos rápidos) */}
          {activeTab === 'home' && currentStudent && (
            <StudentHomeDashboard
              student={currentStudent}
              studio={studio}
              onGoToSchedule={() => setActiveTab('schedule')}
              onGoToRoutines={() => setActiveTab('my_routines')}
              onGoToProfile={() => setActiveTab('my_profile')}
              onGoToBookings={() => setActiveTab('my_bookings')}
              onOpenBuyPack={() => setIsBuyPackOpen(true)}
            />
          )}

          {/* TAB 2: MY BOOKINGS */}
          {activeTab === 'my_bookings' && currentStudent && (
            <StudentBookingsTab student={currentStudent} />
          )}

          {/* TAB: MY ROUTINES */}
          {activeTab === 'my_routines' && currentStudent && (
            <StudentRoutinesTab student={currentStudent} />
          )}

          {/* TAB: MI PERFIL (Credencial Member Pass, Plan actual y Objetivo) */}
          {activeTab === 'my_profile' && currentStudent && (
            <StudentProfileView
              student={currentStudent}
              studio={studio}
              onBackToHome={() => setActiveTab('home')}
              onOpenCheckinGPS={() => setShowCheckinGPSModal(true)}
            />
          )}

          {/* TAB 4: NEW REGISTRATION */}
          {activeTab === 'register' && (
            <StudentRegisterView onGoToLogin={() => setActiveTab('schedule')} />
          )}

        </main>
      </div>

      {/* Student Drawer Sidebar (para pantallas pequeñas / móviles) */}
      <StudentSidebar
        isDrawer={true}
        isOpen={showSidebarDrawer}
        onClose={() => setShowSidebarDrawer(false)}
        student={currentStudent}
        studio={studio}
        activeTab={activeTab}
        onSelectTab={(tab) => setActiveTab(tab)}
        onLogout={() => {
          window.location.hash = '#login';
        }}
        studentsList={students}
        currentStudentId={currentStudent?.id || ''}
        onSelectStudent={(id) => setCurrentStudentId(id)}
      />

      {/* GPS Modal */}
      {showCheckinGPSModal && (
        <StudentCheckinModal onClose={() => setShowCheckinGPSModal(false)} />
      )}

      {/* Waitlist Confirmation Modal */}
      {pendingWaitlistId && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-xl text-center">
            <div className="w-16 h-16 bg-brand-100 text-brand-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-extrabold text-slate-800 mb-2">¡Se liberó un lugar!</h3>
            <p className="text-sm text-slate-600 mb-6">
              El turno que estabas esperando ahora está disponible. ¿Deseas confirmar tu reserva? Si rechazas, pasaremos al siguiente en la lista.
            </p>
            <div className="flex flex-col space-y-3">
              <button
                onClick={() => {
                  const res = processWaitlistResponse(pendingWaitlistId, true);
                  if (res.success) {
                    confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
                    alert('¡Reserva confirmada con éxito!');
                  } else {
                    alert('Hubo un error al confirmar la reserva.');
                  }
                  setPendingWaitlistId(null);
                  window.history.replaceState({}, document.title, window.location.pathname);
                }}
                className="w-full py-3.5 bg-brand-600 hover:bg-brand-700 text-white font-extrabold rounded-2xl transition-colors"
              >
                Sí, Confirmar Reserva
              </button>
              <button
                onClick={() => {
                  const res = processWaitlistResponse(pendingWaitlistId, false);
                  if (res.success) {
                    if (res.nextPromotedUser && res.waitlistEntry) {
                      const confirmLink = `${window.location.origin}/portal?action=confirm_waitlist&waitlist_id=${res.waitlistEntry.id}`;
                      alert(`Turno rechazado.\n\n[SIMULACIÓN WHATSAPP]\nMensaje enviado a ${res.nextPromotedUser.first_name} (siguiente en fila):\n"¡Hola! Se liberó un turno que estabas esperando. Haz clic aquí para confirmar: ${confirmLink}"`);
                    } else {
                      alert('Turno rechazado. No hay más alumnos en la lista de espera.');
                    }
                  }
                  setPendingWaitlistId(null);
                  window.history.replaceState({}, document.title, window.location.pathname);
                }}
                className="w-full py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-2xl transition-colors"
              >
                No, Ceder mi Lugar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Compra de Packs con Mercado Pago */}
      {currentStudent && (
        <BuyPackModal
          isOpen={isBuyPackOpen}
          onClose={() => setIsBuyPackOpen(false)}
          student={currentStudent}
          onSuccess={() => {
            setIsBuyPackOpen(false);
            setActiveTab('schedule');
          }}
        />
      )}

    </div>
  );
};
