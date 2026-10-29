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
  } = useStudioStore();

  const [activeTab, setActiveTab] = useState<'home' | 'my_profile' | 'schedule' | 'my_bookings' | 'my_routines' | 'register'>('home');
  const [showSidebarDrawer, setShowSidebarDrawer] = useState(false);
  const [selectedBranchId, setSelectedBranchId] = useState(branches[0]?.id || '');
  const [selectedDayIndex, setSelectedDayIndex] = useState<number>(new Date().getDay());
  const [currentWeekDate, setCurrentWeekDate] = useState(new Date());
  const [scheduleViewMode, setScheduleViewMode] = useState<'calendar' | 'list'>('calendar');
  const [showCheckinGPSModal, setShowCheckinGPSModal] = useState(false);
  const [isBuyPackOpen, setIsBuyPackOpen] = useState(false);

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

  const handleBook = (cls: ClassSchedule, dateStr?: string) => {
    if (!currentStudent) return;

    // We need to pass the date because if we book for tomorrow, it shouldn't book for today.
    // If no date is passed, it falls back to the store default (today).
    const res = bookClass(cls.id, currentStudent.id, dateStr, false);
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

        {/* Main Content Area alineada hacia la izquierda */}
        <main className="max-w-3xl lg:max-w-[760px] xl:max-w-[800px] mr-auto ml-0 px-4 sm:px-8 py-6 w-full">

          {/* TAB 1: SCHEDULE / BOOKING */}
          {activeTab === 'schedule' && (
            <div className="space-y-5 animate-fade-in">

              {/* Student Credit Summary Pill or Empty Register Banner */}
              {currentStudent ? (
                <div
                  className="text-white rounded-3xl p-5 shadow-soft flex items-center justify-between border border-[#E8D5B5]"
                  style={{
                    background: 'linear-gradient(135deg, #44261B 0%, #5E612B 45%, #C18749 100%)',
                  }}
                >
                  <div>

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

              {/* Sede & Selector de Vista (Calendario / Lista) */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-[#E8D5B5] shadow-xs">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-bold text-[#A68D74]">Sede:</span>
                  <select
                    value={selectedBranchId}
                    onChange={(e) => setSelectedBranchId(e.target.value)}
                    className="px-3 py-1.5 bg-[#FAF8F5] border border-[#E8D5B5] rounded-xl text-xs font-bold text-[#44261B] focus:outline-none shadow-2xs"
                  >
                    {branches.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Switcher: Calendario vs Lista */}
                <div className="flex items-center space-x-1.5 bg-[#FAF8F5] p-1 rounded-xl border border-[#E8D5B5]/60 self-start sm:self-auto">
                  <button
                    onClick={() => setScheduleViewMode('calendar')}
                    className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${
                      scheduleViewMode === 'calendar'
                        ? 'bg-[#5E612B] text-[#F4E8D1] shadow-2xs'
                        : 'text-[#A68D74] hover:text-[#44261B]'
                    }`}
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Calendario</span>
                  </button>
                  <button
                    onClick={() => setScheduleViewMode('list')}
                    className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${
                      scheduleViewMode === 'list'
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
              <div className="flex items-center justify-between bg-white px-4 py-2.5 rounded-2xl border border-[#E8D5B5] shadow-xs">
                <button
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
                    onClick={() => setCurrentWeekDate(new Date())}
                    className="px-2.5 py-0.5 rounded-lg text-[10px] font-bold bg-[#F4E8D1] text-[#5E612B] hover:bg-[#E8D5B5] transition-colors cursor-pointer"
                  >
                    Hoy
                  </button>
                </div>

                <button
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

              {/* VISTA 1: FORMATO CALENDARIO SEMANAL LUNES A VIERNES (Columnas más anchas) */}
              {scheduleViewMode === 'calendar' ? (
                <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                  {businessWeekDays.map((wd) => {
                    const dIndex = wd.date.getDay();
                    const dayClasses = classes
                      .filter((c) => c.day_of_week === dIndex && (!selectedBranchId || c.branch_id === selectedBranchId))
                      .sort((a, b) => a.start_time.localeCompare(b.start_time));

                    const isToday = toISODateString(new Date()) === wd.dateStr;

                    return (
                      <div
                        key={wd.dateStr}
                        className={`rounded-2xl border transition-all flex flex-col ${
                          isToday
                            ? 'bg-[#FAF8F5] border-[#5E612B]/70 shadow-sm'
                            : 'bg-white border-[#E8D5B5]'
                        }`}
                      >
                        {/* Cabecera del día */}
                        <div
                          className={`p-3 text-center border-b ${
                            isToday ? 'bg-[#5E612B] text-[#F4E8D1]' : 'border-[#E8D5B5]/60 bg-[#FAF8F5]'
                          } rounded-t-2xl`}
                        >
                          <span className={`text-[11px] uppercase font-extrabold block ${isToday ? 'text-[#F4E8D1]' : 'text-[#A68D74]'}`}>
                            {wd.dayName}
                          </span>
                          <span className={`text-base font-black block mt-0.5 ${isToday ? 'text-white' : 'text-[#44261B]'}`}>
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
                                (b) => b.class_id === cls.id && b.status === 'confirmed' && (!b.booking_date || b.booking_date === wd.dateStr)
                              );
                              const enrolled = classBookings.length;
                              const availableSpots = Math.max(0, cls.max_capacity - enrolled);
                              const isFull = availableSpots <= 0;

                              return (
                                <div
                                  key={cls.id}
                                  className="bg-[#FAF8F5] hover:bg-white rounded-xl p-3 border border-[#E8D5B5] shadow-2xs transition-all space-y-2 text-left"
                                >
                                  <div className="flex items-center justify-between gap-1">
                                    <span
                                      className="text-[10px] font-extrabold px-2 py-0.5 rounded text-white truncate max-w-[105px]"
                                      style={{ backgroundColor: cls.activity?.color || cls.color || '#5E612B' }}
                                    >
                                      {cls.title}
                                    </span>
                                    <span
                                      className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                                        isFull ? 'bg-rose-100 text-[#CB563C]' : 'bg-[#eaede7] text-[#5E612B]'
                                      }`}
                                    >
                                      {isFull ? 'Lleno' : `${availableSpots} cupos`}
                                    </span>
                                  </div>

                                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#44261B]">
                                    <Clock className="w-3.5 h-3.5 text-[#5E612B]" />
                                    <span>{cls.start_time} a {cls.end_time} hs</span>
                                  </div>

                                  <button
                                    onClick={() => handleBook(cls, wd.dateStr)}
                                    className={`w-full py-2 rounded-xl text-[11px] font-extrabold transition-all cursor-pointer ${
                                      isFull
                                        ? 'bg-[#C18749] hover:bg-[#44261B] text-white'
                                        : 'bg-[#5E612B] hover:bg-[#44261B] text-[#F4E8D1]'
                                    }`}
                                  >
                                    {isFull ? 'Lista Espera' : 'Reservar Turno'}
                                  </button>
                                </div>
                              );
                            })
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                /* VISTA 2: FORMATO LISTA POR DÍA */
                <div className="space-y-4">
                  {/* Selector de días lunes a viernes */}
                  <div className="grid grid-cols-5 gap-1.5 bg-white p-2 rounded-2xl border border-[#E8D5B5] shadow-xs">
                    {businessWeekDays.map((day) => {
                      const isSelected = selectedDayIndex === day.date.getDay();

                      return (
                        <button
                          key={day.dateStr}
                          onClick={() => setSelectedDayIndex(day.date.getDay())}
                          className={`py-2 text-center rounded-xl transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-[#5E612B] text-[#F4E8D1] font-extrabold shadow-sm'
                              : 'text-[#A68D74] hover:bg-[#F4E8D1]/40'
                          }`}
                        >
                          <span className="text-[10px] uppercase block">{day.dayName}</span>
                          <span className="text-xs font-bold block mt-0.5">{day.dayNumber}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Listado de clases del día seleccionado */}
                  <div className="space-y-3">
                    {(() => {
                      const dayClasses = classes.filter(
                        (c) =>
                          c.day_of_week === selectedDayIndex &&
                          (!selectedBranchId || c.branch_id === selectedBranchId)
                      );

                      if (dayClasses.length === 0) {
                        return (
                          <div className="bg-white rounded-3xl p-8 text-center text-xs text-[#A68D74] border border-[#E8D5B5]">
                            No hay clases disponibles para este día y sede.
                          </div>
                        );
                      }

                      const targetDay = weekDays.find((d) => d.date.getDay() === selectedDayIndex);
                      const targetDateStr = targetDay ? targetDay.dateStr : toISODateString(new Date());

                      return dayClasses.map((cls) => {
                        const classBookings = bookings.filter(
                          (b) => b.class_id === cls.id && b.status === 'confirmed' && (!b.booking_date || b.booking_date === targetDateStr)
                        );
                        const enrolled = classBookings.length;
                        const availableSpots = Math.max(0, cls.max_capacity - enrolled);
                        const isFull = availableSpots <= 0;

                        return (
                          <div
                            key={cls.id}
                            className="bg-white rounded-3xl p-4 sm:p-5 border border-[#E8D5B5] shadow-xs hover:shadow-sm transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                          >
                            <div>
                              <div className="flex items-center space-x-2 mb-1.5">
                                <span
                                  className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full text-white shadow-2xs"
                                  style={{ backgroundColor: cls.activity?.color || cls.color || '#5E612B' }}
                                >
                                  {cls.title}
                                </span>
                                <span
                                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                    isFull ? 'bg-rose-100 text-[#CB563C]' : 'bg-[#eaede7] text-[#5E612B]'
                                  }`}
                                >
                                  {isFull ? 'Completo' : `${availableSpots} lugares`}
                                </span>
                              </div>

                              <div className="text-xs font-bold text-[#44261B] flex items-center space-x-2">
                                <Clock className="w-3.5 h-3.5 text-[#5E612B]" />
                                <span>{cls.start_time} a {cls.end_time} hs</span>
                              </div>
                            </div>

                            <button
                              onClick={() => handleBook(cls, targetDateStr)}
                              className={`px-5 py-2 rounded-2xl text-xs font-extrabold shadow-sm transition-all self-start sm:self-center cursor-pointer ${
                                isFull
                                  ? 'bg-[#C18749] hover:bg-[#44261B] text-white'
                                  : 'bg-[#5E612B] hover:bg-[#44261B] text-[#F4E8D1]'
                              }`}
                            >
                              {isFull ? 'Anotarme en Espera' : 'Reservar Turno'}
                            </button>
                          </div>
                        );
                      });
                    })()}
                  </div>
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
            <h3 className="text-xl font-extrabold text-slate-800 mb-2">¡Se liberó tu lugar!</h3>
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
