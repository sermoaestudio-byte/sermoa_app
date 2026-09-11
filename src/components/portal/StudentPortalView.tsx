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
  LogOut
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useStudioStore } from '../../store/studioStore';
import { getWeekDates, toISODateString } from '../../utils/date';
import { StudentRegisterView } from './StudentRegisterView';
import { StudentDigitalPass } from './StudentDigitalPass';
import { StudentBookingsTab } from './StudentBookingsTab';
import { StudentRoutinesTab } from './StudentRoutinesTab';
import { StudentCheckinModal } from '../checkin/StudentCheckinModal';
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

  const [activeTab, setActiveTab] = useState<'schedule' | 'my_bookings' | 'my_routines' | 'digital_pass' | 'register'>('schedule');
  const [selectedBranchId, setSelectedBranchId] = useState(branches[0]?.id || '');
  const [selectedDayIndex, setSelectedDayIndex] = useState<number>(new Date().getDay());
  const [currentWeekDate, setCurrentWeekDate] = useState(new Date());
  const [showCheckinGPSModal, setShowCheckinGPSModal] = useState(false);
  const [currentTime, setCurrentTime] = useState(Date.now());
  
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

  // Expiration Checker and Timer
  useEffect(() => {
    const timer = setInterval(() => {
      const now = Date.now();
      setCurrentTime(now);

      waitlist.forEach((w) => {
        if (w.status === 'pending_confirmation' && w.expires_at) {
          if (now >= new Date(w.expires_at).getTime()) {
            expireWaitlistEntry(w.id);
          }
        }
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [waitlist, expireWaitlistEntry]);

  const weekDays = getWeekDates(currentWeekDate);

  const handleBook = (cls: ClassSchedule, dateStr?: string) => {
    if (!currentStudent) return;
    
    // We need to pass the date because if we book for tomorrow, it shouldn't book for today.
    // If no date is passed, it falls back to the store default (today).
    const res = bookClass(cls.id, currentStudent.id, dateStr, false);
    alert(res.message);
    if (res.success && !res.isWaitlist) {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-24">
      
      {/* Student App Topbar */}
      <header className="bg-white border-b border-slate-200/80 sticky top-0 z-30 shadow-xs">
        <div className="max-w-2xl mx-auto px-4 py-3.5 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-full bg-brand-800 text-white flex items-center justify-center font-extrabold text-sm shadow-sm uppercase">
              <span>{currentStudent ? `${currentStudent.first_name?.[0] || ''}${currentStudent.last_name?.[0] || ''}` : 'U'}</span>
            </div>
            <div>
              <h2 className="font-extrabold text-slate-900 text-sm leading-tight">
                {currentStudent ? `${currentStudent.first_name} ${currentStudent.last_name}` : studio.name}
              </h2>
              <span className="text-[11px] text-slate-400 font-medium">Portal de Alumnos</span>
            </div>
          </div>

          {/* Student Actions & Logout */}
          <div className="flex items-center space-x-2">
            <select
              value={currentStudent?.id || ''}
              onChange={(e) => setCurrentStudentId(e.target.value)}
              className="text-xs border-slate-200 rounded-lg bg-slate-50 p-1.5 focus:ring-brand-500 focus:border-brand-500 max-w-[150px]"
              title="Simulador: Cambiar de Alumno"
            >
              <option value="" disabled>Emular Usuario...</option>
              {students.map(s => (
                <option key={s.id} value={s.id}>{s.first_name} {s.last_name}</option>
              ))}
            </select>
            <button
              onClick={() => {
                window.location.hash = '#login';
              }}
              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors border border-slate-200"
              title="Salir / Iniciar sesión con otra cuenta"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Student App Navigation Tabs */}
        <div className="max-w-2xl mx-auto px-4 flex items-center justify-around text-xs font-bold border-t border-slate-100 pt-1">
          <button
            onClick={() => setActiveTab('schedule')}
            className={`py-2.5 px-3 border-b-2 transition-all flex items-center space-x-1.5 ${
              activeTab === 'schedule'
                ? 'border-brand-600 text-brand-800'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Reservar Clases</span>
          </button>

          <button
            onClick={() => setActiveTab('my_bookings')}
            className={`py-2.5 px-3 border-b-2 transition-all flex items-center space-x-1.5 ${
              activeTab === 'my_bookings'
                ? 'border-brand-600 text-brand-800'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Mis Turnos</span>
          </button>

          <button
            onClick={() => setActiveTab('my_routines')}
            className={`py-2.5 px-3 border-b-2 transition-all flex items-center space-x-1.5 ${
              activeTab === 'my_routines'
                ? 'border-brand-600 text-brand-800'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Dumbbell className="w-4 h-4" />
            <span>Mi Rutina</span>
          </button>

          <button
            onClick={() => setActiveTab('digital_pass')}
            className={`py-2.5 px-3 border-b-2 transition-all flex items-center space-x-1.5 ${
              activeTab === 'digital_pass'
                ? 'border-brand-600 text-brand-800'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <QrCode className="w-4 h-4" />
            <span>Pase QR</span>
          </button>

        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-2xl mx-auto px-4 py-6">
        
        {/* TAB 1: SCHEDULE / BOOKING */}
        {activeTab === 'schedule' && (
          <div className="space-y-5 animate-fade-in">
            
            {/* Student Credit Summary Pill or Empty Register Banner */}
            {currentStudent ? (
              <div className="bg-gradient-to-r from-brand-600 to-brand-800 text-white rounded-3xl p-5 shadow-soft flex items-center justify-between">
                <div>
                  <span className="text-xs text-brand-100 block font-medium">Hola, {currentStudent.first_name}!</span>
                  <h3 className="text-xl font-extrabold mt-0.5">
                    {currentStudent.credits_balance === 999 
                      ? 'Pase Libre (Ilimitado)' 
                      : `${currentStudent.credits_balance} Clases Disponibles`}
                  </h3>
                </div>
                <button
                  onClick={() => setActiveTab('digital_pass')}
                  className="px-3.5 py-2 bg-white text-slate-900 font-extrabold text-xs rounded-xl shadow-xs hover:bg-slate-100 transition-colors flex items-center space-x-1.5"
                >
                  <QrCode className="w-3.5 h-3.5 text-brand-700" />
                  <span>Ver Pase</span>
                </button>
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

            {/* Branch Selector */}
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold text-slate-500">Sede:</span>
              <select
                value={selectedBranchId}
                onChange={(e) => setSelectedBranchId(e.target.value)}
                className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none shadow-xs"
              >
                {branches.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Week Days Bar */}
            <div className="grid grid-cols-7 gap-1.5 bg-white p-2 rounded-2xl border border-slate-200/80 shadow-xs">
              {weekDays.map((day) => {
                const isSelected = selectedDayIndex === day.date.getDay();

                return (
                  <button
                    key={day.dateStr}
                    onClick={() => setSelectedDayIndex(day.date.getDay())}
                    className={`py-2 text-center rounded-xl transition-all ${
                      isSelected
                        ? 'bg-brand-600 text-white font-extrabold shadow-sm'
                        : 'text-slate-500 hover:bg-slate-50'
                    }`}
                  >
                    <span className="text-[10px] uppercase block">{day.dayName}</span>
                    <span className="text-xs font-bold block mt-0.5">{day.dayNumber}</span>
                  </button>
                );
              })}
            </div>

            {/* Available Classes for Day */}
            <div className="space-y-3">
              {(() => {
                const dayClasses = classes.filter(
                  (c) =>
                    c.day_of_week === selectedDayIndex &&
                    (!selectedBranchId || c.branch_id === selectedBranchId)
                );

                if (dayClasses.length === 0) {
                  return (
                    <div className="bg-white rounded-3xl p-8 text-center text-xs text-slate-400 border border-slate-200">
                      No hay clases disponibles para este día y sede.
                    </div>
                  );
                }
                
                const targetDay = weekDays.find(d => d.date.getDay() === selectedDayIndex);
                const targetDateStr = targetDay ? targetDay.dateStr : toISODateString(new Date());

                const renderedClasses = dayClasses.map((cls) => {
                  const classBookings = bookings.filter(
                    (b) => b.class_id === cls.id && b.status === 'confirmed' && (!b.booking_date || b.booking_date === targetDateStr)
                  );
                  const enrolled = classBookings.length;
                  const availableSpots = Math.max(0, cls.max_capacity - enrolled);
                  
                  // Obtener la lista de espera activa para esta clase
                  const activeWaitlist = waitlist
                    .filter((w) => w.class_id === cls.id && w.request_date === targetDateStr && w.status !== 'promoted' && w.status !== 'rejected')
                    .sort((a, b) => a.position - b.position);

                  // Ver si el estudiante actual está en la lista de espera
                  const studentWaitlistIndex = currentStudent ? activeWaitlist.findIndex(w => w.student_id === currentStudent.id) : -1;
                  const isUserWaitlisted = studentWaitlistIndex !== -1;
                  
                  // El usuario puede reservar SI:
                  // 1. Hay lugares disponibles y no hay nadie en lista de espera (o menos personas que lugares).
                  // 2. O BIEN el usuario está en la lista de espera, y su posición está dentro de los lugares disponibles.
                  const isFullForUser = isUserWaitlisted 
                    ? studentWaitlistIndex >= availableSpots 
                    : availableSpots <= activeWaitlist.length;

                  const studentWaitlistEntry = isUserWaitlisted ? activeWaitlist[studentWaitlistIndex] : null;

                  let buttonText = 'Reservar Turno';
                  let badgeText = `${availableSpots} lugares`;
                  let badgeColor = 'bg-emerald-100 text-emerald-800';
                  let isDisabled = false;
                  let missedConfirmationMsg = null;
                  let countdownMsg = null;

                  if (studentWaitlistEntry?.missed_confirmation) {
                    missedConfirmationMsg = `Perdiste tu turno por falta de confirmación. Tu lugar de espera actual es #${studentWaitlistEntry.position}.`;
                  }

                  if (isFullForUser) {
                    if (isUserWaitlisted) {
                      badgeText = 'En Lista de Espera';
                      badgeColor = 'bg-amber-100 text-amber-800';
                      buttonText = 'En Espera (Tu posición: ' + activeWaitlist[studentWaitlistIndex].position + ')';
                      isDisabled = true; // Ya está anotado y no hay cupo
                    } else {
                      badgeText = availableSpots > 0 ? 'Cupos reservados para espera' : 'Completo (Lista de Espera)';
                      badgeColor = 'bg-rose-100 text-rose-800';
                      buttonText = 'Anotarme en Espera';
                    }
                  } else {
                    if (isUserWaitlisted) {
                      if (studentWaitlistEntry?.status === 'pending_confirmation') {
                        badgeText = '¡Lugar Disponible para ti!';
                        badgeColor = 'bg-emerald-100 text-emerald-800 animate-pulse';
                        buttonText = 'Confirmar mi Lugar';
                        if (studentWaitlistEntry.expires_at) {
                          const timeLeft = Math.max(0, Math.floor((new Date(studentWaitlistEntry.expires_at).getTime() - currentTime) / 1000));
                          const mins = Math.floor(timeLeft / 60);
                          const secs = timeLeft % 60;
                          countdownMsg = `Tienes ${mins}:${secs.toString().padStart(2, '0')} min para confirmar tu lugar antes de que expire.`;
                        }
                      } else {
                        // Ocurre si liberan lugar, pero la persona todavía no fue procesada a 'pending_confirmation' por algún error.
                        // Aunque normalmente si hay lugar y es su turno, bookClass lo acepta.
                        badgeText = '¡Lugar Disponible!';
                        badgeColor = 'bg-emerald-100 text-emerald-800';
                        buttonText = 'Confirmar mi Lugar';
                      }
                    }
                  }

                  return (
                    <div
                      key={cls.id}
                      className={`bg-white rounded-3xl p-5 border shadow-soft hover:shadow-soft-lg transition-all flex flex-col ${studentWaitlistEntry?.status === 'pending_confirmation' ? 'border-emerald-300 ring-4 ring-emerald-50' : 'border-slate-200'}`}
                    >
                      {missedConfirmationMsg && (
                        <div className="mb-4 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold p-3 rounded-xl flex items-center space-x-2">
                          <AlertCircle className="w-4 h-4 flex-shrink-0" />
                          <span>{missedConfirmationMsg}</span>
                        </div>
                      )}
                      {countdownMsg && (
                        <div className="mb-4 bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold p-3 rounded-xl flex items-center space-x-2">
                          <Clock className="w-4 h-4 flex-shrink-0 animate-pulse" />
                          <span>{countdownMsg}</span>
                        </div>
                      )}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                          <div className="flex items-center space-x-2 mb-1.5">
                            <span
                              className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full text-white shadow-xs"
                              style={{ backgroundColor: cls.activity?.color || cls.color }}
                            >
                              {cls.title}
                            </span>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${badgeColor}`}>
                              {badgeText}
                            </span>
                          </div>

                          <div className="text-xs font-bold text-slate-800 flex items-center space-x-2">
                            <Clock className="w-3.5 h-3.5 text-slate-400" />
                            <span>{cls.start_time} a {cls.end_time} hs</span>
                          </div>
                          <div className="text-[11px] text-slate-400 mt-0.5">
                            Prof: {cls.instructor?.first_name} {cls.instructor?.last_name} • {cls.room?.name}
                          </div>
                        </div>

                        <button
                          onClick={() => handleBook(cls, targetDateStr)}
                          disabled={isDisabled}
                          className={`px-5 py-2.5 rounded-2xl text-xs font-extrabold shadow-sm transition-all self-start sm:self-center ${
                            isDisabled
                              ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                              : isFullForUser
                              ? 'bg-amber-500 hover:bg-amber-600 text-white'
                              : 'bg-brand-600 hover:bg-brand-700 text-white'
                          }`}
                        >
                          {buttonText}
                        </button>
                      </div>
                    </div>
                  );
                });

                const allFull = dayClasses.every((cls) => {
                  const cb = bookings.filter((b) => b.class_id === cls.id && b.status === 'confirmed' && (!b.booking_date || b.booking_date === targetDateStr));
                  return cb.length >= cls.max_capacity;
                });

                return (
                  <>
                    {renderedClasses}
                    {allFull && dayClasses.length > 0 && (
                      <div className="mt-6 p-6 bg-slate-50 rounded-3xl border border-slate-200 text-center">
                        <p className="text-sm font-medium text-slate-600 mb-4">
                          La agenda del día está completa. Puedes unirte a la lista de espera general y te avisaremos si se libera cualquier horario.
                        </p>
                        <button
                          onClick={() => {
                            if (!currentStudent) return;
                            const res = bookClass('ANY_TIME', currentStudent.id, targetDateStr, true);
                            alert(res.message);
                          }}
                          className="px-6 py-3 rounded-2xl text-sm font-extrabold bg-slate-800 hover:bg-slate-900 text-white shadow-sm transition-all"
                        >
                          Anotarme en Espera (Cualquier horario)
                        </button>
                      </div>
                    )}
                  </>
                );
              })()}
            </div>

          </div>
        )}

        {/* TAB 2: MY BOOKINGS */}
        {activeTab === 'my_bookings' && currentStudent && (
          <StudentBookingsTab student={currentStudent} />
        )}

        {/* TAB: MY ROUTINES */}
        {activeTab === 'my_routines' && currentStudent && (
          <StudentRoutinesTab student={currentStudent} />
        )}

        {/* TAB 3: DIGITAL PASS */}
        {activeTab === 'digital_pass' && currentStudent && (
          <StudentDigitalPass
            student={currentStudent}
            studio={studio}
            onOpenCheckinGPS={() => setShowCheckinGPSModal(true)}
          />
        )}

        {/* TAB 4: NEW REGISTRATION */}
        {activeTab === 'register' && (
          <StudentRegisterView onGoToLogin={() => setActiveTab('schedule')} />
        )}

      </main>

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

    </div>
  );
};
