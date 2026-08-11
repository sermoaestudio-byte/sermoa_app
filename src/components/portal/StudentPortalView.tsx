import React, { useState } from 'react';
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
  } = useStudioStore();

  const [activeTab, setActiveTab] = useState<'schedule' | 'my_bookings' | 'my_routines' | 'digital_pass' | 'register'>('schedule');
  const [selectedBranchId, setSelectedBranchId] = useState(branches[0]?.id || '');
  const [selectedDayIndex, setSelectedDayIndex] = useState<number>(new Date().getDay());
  const [currentWeekDate, setCurrentWeekDate] = useState(new Date());
  const [showCheckinGPSModal, setShowCheckinGPSModal] = useState(false);

  const activeStudents = profiles.filter((p) => p.role === 'client' && p.status === 'active');
  const currentStudent = profiles.find((p) => p.id === currentStudentId) || activeStudents[0];

  const weekDays = getWeekDates(currentWeekDate);

  const handleBook = (cls: ClassSchedule) => {
    if (!currentStudent) return;
    const res = bookClass(cls.id, currentStudent.id);
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
            <div className="w-9 h-9 rounded-full bg-brand-800 text-white flex items-center justify-center font-extrabold text-sm shadow-sm">
              <span>Ai</span>
            </div>
            <div>
              <h2 className="font-extrabold text-slate-900 text-sm leading-tight">
                {studio.name}
              </h2>
              <span className="text-[11px] text-slate-400 font-medium">Portal de Alumnos</span>
            </div>
          </div>

          {/* Student Actions & Logout */}
          <div className="flex items-center space-x-2">
            {activeTab !== 'register' && currentStudent && (
              <select
                value={currentStudent.id}
                onChange={(e) => setCurrentStudentId(e.target.value)}
                className="text-xs font-bold text-slate-700 bg-slate-100 px-2.5 py-1.5 rounded-xl border border-slate-200 focus:outline-none max-w-[150px] sm:max-w-none truncate"
              >
                {activeStudents.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.first_name} ({s.credits_balance} clases)
                  </option>
                ))}
              </select>
            )}

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
                    {currentStudent.credits_balance} Clases Disponibles
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

                return dayClasses.map((cls) => {
                  const enrolled = cls.enrolled_students_count || 0;
                  const isFull = enrolled >= cls.max_capacity;

                  return (
                    <div
                      key={cls.id}
                      className="bg-white rounded-3xl p-5 border border-slate-200 shadow-soft hover:shadow-soft-lg transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div>
                        <div className="flex items-center space-x-2 mb-1.5">
                          <span
                            className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full text-white shadow-xs"
                            style={{ backgroundColor: cls.activity?.color || cls.color }}
                          >
                            {cls.title}
                          </span>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              isFull ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
                            }`}
                          >
                            {isFull ? 'Completo (Lista de Espera)' : `${cls.max_capacity - enrolled} lugares`}
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
                        onClick={() => handleBook(cls)}
                        className={`px-5 py-2.5 rounded-2xl text-xs font-extrabold shadow-sm transition-all self-start sm:self-center ${
                          isFull
                            ? 'bg-amber-500 hover:bg-amber-600 text-white'
                            : 'bg-brand-600 hover:bg-brand-700 text-white'
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

    </div>
  );
};
