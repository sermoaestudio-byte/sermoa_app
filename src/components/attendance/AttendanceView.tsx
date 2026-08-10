import React, { useState } from 'react';
import {
  ClipboardList,
  CheckCircle2,
  XCircle,
  Clock,
  QrCode,
  Users,
  MapPin,
  Sparkles,
  Camera,
  HelpCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useStudioStore } from '../../store/studioStore';
import { toISODateString } from '../../utils/date';
import { Booking, ClassSchedule, Profile } from '../../types';
import { QRScannerModal } from './QRScannerModal';
import { ModuleHelpDrawer } from '../common/ModuleHelpDrawer';

export const AttendanceView: React.FC = () => {
  const {
    classes,
    bookings,
    profiles,
    branches,
    markAttendance,
    performQRCheckinWithGPS,
  } = useStudioStore();

  const todayStr = toISODateString(new Date());
  const todayClasses = classes
    .filter((c) => !c.is_cancelled && (c.date === todayStr || c.day_of_week === new Date().getDay()))
    .sort((a, b) => a.start_time.localeCompare(b.start_time));

  const [selectedClassId, setSelectedClassId] = useState(todayClasses[0]?.id || '');
  const [showScannerModal, setShowScannerModal] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  const currentClass = todayClasses.find((c) => c.id === selectedClassId) || todayClasses[0];
  const currentBranch = branches.find((b) => b.id === currentClass?.branch_id);

  const currentClassBookings = bookings.filter(
    (b: Booking) => b.class_id === currentClass?.id && (b.booking_date === todayStr || !b.booking_date)
  );

  const handleMark = (bookingId: string, status: 'present' | 'late' | 'no_show') => {
    markAttendance(bookingId, status);
    if (status === 'present') {
      confetti({
        particleCount: 35,
        spread: 50,
        origin: { y: 0.8 },
      });
    }
  };

  return (
    <div className="py-6 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
              <ClipboardList className="w-3.5 h-3.5 text-rose-500" />
              <span>Operativa Diaria</span>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Pasar Lista & Control de Asistencia
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Toma de asistencia rápida del día por clase o escaneo de código QR
            </p>
          </div>

          <div className="flex items-center space-x-2.5 self-start sm:self-center">
            <button
              onClick={() => setShowHelp(true)}
              className="inline-flex items-center space-x-1.5 px-3 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold shadow-xs transition-all"
              title="Ver guía de Asistencia y Check-in"
            >
              <HelpCircle className="w-4 h-4 text-rose-500" />
              <span>Ayuda</span>
            </button>

            <button
              onClick={() => setShowScannerModal(true)}
              className="inline-flex items-center space-x-2 px-4 py-2.5 bg-brand-olive hover:bg-brand-darkolive text-white rounded-xl text-xs font-extrabold shadow-sm transition-all"
            >
              <Camera className="w-4 h-4" />
              <span>Escanear Pase QR Alumno</span>
            </button>
          </div>
        </div>

        {/* Classes Tabs of the Day */}
        <div className="flex items-center space-x-3 overflow-x-auto pb-3 mb-6 scrollbar-none">
          {todayClasses.map((cls) => {
            const isSelected = cls.id === currentClass?.id;
            const clsBookings = bookings.filter((b) => b.class_id === cls.id);
            const presentCount = clsBookings.filter((b) => b.status === 'attended').length;

            return (
              <button
                key={cls.id}
                onClick={() => setSelectedClassId(cls.id)}
                className={`p-4 rounded-2xl border text-left min-w-[200px] shrink-0 transition-all ${
                  isSelected
                    ? 'border-brand-600 bg-white shadow-soft font-bold'
                    : 'border-slate-200 bg-slate-50/60 hover:bg-white text-slate-600'
                }`}
              >
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-extrabold text-slate-900 flex items-center space-x-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{cls.start_time} hs</span>
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 font-bold">
                    {presentCount} presentes
                  </span>
                </div>
                <div className="text-sm font-extrabold text-slate-800 line-clamp-1">{cls.title}</div>
                <div className="text-[11px] text-slate-500 mt-1">Prof. {cls.instructor?.first_name}</div>
              </button>
            );
          })}
        </div>

        {/* Current Selected Class Details & Student List */}
        {currentClass ? (
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-soft">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-100 gap-4 mb-6">
              <div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Clase Seleccionada</span>
                <h3 className="text-xl font-extrabold text-slate-900 mt-0.5">
                  {currentClass.title} ({currentClass.start_time} - {currentClass.end_time} hs)
                </h3>
                <p className="text-xs text-slate-500 mt-1 flex items-center space-x-3">
                  <span>📍 {currentBranch?.name} ({currentClass.room?.name || 'Sala 1'})</span>
                  <span>•</span>
                  <span>Prof. {currentClass.instructor?.first_name} {currentClass.instructor?.last_name}</span>
                </p>
              </div>

              <div className="flex items-center space-x-3">
                <span className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-xl">
                  {currentClassBookings.length} / {currentClass.max_capacity} Inscriptos
                </span>
              </div>
            </div>

            {/* List of Enrolled Students to Mark Attendance */}
            <div className="space-y-3">
              {currentClassBookings.length > 0 ? (
                currentClassBookings.map((b) => {
                  const student = profiles.find((p) => p.id === b.student_id);
                  if (!student) return null;

                  const isPresent = b.status === 'attended';
                  const isNoShow = b.status === 'no_show';

                  return (
                    <div
                      key={b.id}
                      className="p-4 rounded-2xl border border-slate-200/70 hover:border-slate-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/40"
                    >
                      <div className="flex items-center space-x-3.5">
                        <div className="w-10 h-10 rounded-full bg-brand-100 text-brand-800 font-extrabold flex items-center justify-center text-sm shadow-xs">
                          {student.first_name[0]}{student.last_name[0]}
                        </div>
                        <div>
                          <h4 className="font-extrabold text-slate-900 text-sm">
                            {student.first_name} {student.last_name}
                          </h4>
                          <div className="flex items-center space-x-2 text-[11px] text-slate-500 mt-0.5">
                            <span>{student.phone}</span>
                            <span>•</span>
                            <span>Saldo: {student.credits_balance} créditos</span>
                          </div>
                        </div>
                      </div>

                      {/* Attendance Buttons */}
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleMark(b.id, 'present')}
                          className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center space-x-1.5 transition-all ${
                            isPresent
                              ? 'bg-emerald-600 text-white shadow-emerald-600/20'
                              : 'bg-white border border-slate-200 text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200'
                          }`}
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Presente</span>
                        </button>

                        <button
                          onClick={() => handleMark(b.id, 'no_show')}
                          className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all ${
                            isNoShow
                              ? 'bg-rose-600 text-white shadow-rose-600/20'
                              : 'bg-white border border-slate-200 text-slate-700 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200'
                          }`}
                        >
                          <XCircle className="w-4 h-4" />
                          <span>Ausente</span>
                        </button>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="py-12 text-center text-slate-400">
                  <Users className="w-10 h-10 mx-auto mb-2 text-slate-300" />
                  <p className="text-xs font-bold text-slate-600">No hay alumnos inscriptos para esta clase aún.</p>
                </div>
              )}
            </div>

          </div>
        ) : (
          <div className="py-16 text-center text-slate-400 bg-white rounded-3xl border border-slate-200/80">
            <ClipboardList className="w-12 h-12 mx-auto mb-3 text-slate-300" />
            <p className="text-sm font-bold text-slate-600">No hay clases programadas para el día de hoy.</p>
          </div>
        )}

        {/* QR Camera Scanner Modal */}
        {showScannerModal && (
          <QRScannerModal
            onClose={() => setShowScannerModal(false)}
            onScanSuccess={(studentId) => {
              setShowScannerModal(false);
              const stu = profiles.find((p) => p.id === studentId);
              alert(`¡Pase Digital escaneado exitosamente para ${stu?.first_name} ${stu?.last_name}! Asistencia registrada.`);
            }}
          />
        )}

        {/* Module Auto-Help Drawer */}
        <ModuleHelpDrawer
          isOpen={showHelp}
          moduleId="attendance"
          onClose={() => setShowHelp(false)}
        />

      </div>
    </div>
  );
};
