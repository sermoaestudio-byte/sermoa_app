import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import {
  X,
  Users,
  Clock,
  MapPin,
  Trash2,
  UserPlus,
  MessageCircle,
  AlertCircle,
  CheckCircle,
  ArrowUpRight
} from 'lucide-react';
import { ClassSchedule, Profile, Booking, WaitlistEntry } from '../../types';
import { useStudioStore } from '../../store/studioStore';
import { openWhatsApp, formatWhatsAppTemplate } from '../../utils/whatsapp';
import { getBookingLink } from '../../utils/links';
import { toISODateString } from '../../utils/date';

interface ClassDetailModalProps {
  classItem: ClassSchedule | null;
  selectedDate?: string;
  onClose: () => void;
}

export const ClassDetailModal: React.FC<ClassDetailModalProps> = ({ classItem, selectedDate, onClose }) => {
  const {
    bookings,
    waitlist,
    profiles,
    studio,
    whatsappTemplates,
    bookClass,
    cancelBooking,
    deleteClass,
    updateClass,
    getEnrichedClasses,
  } = useStudioStore();

  const currentClass = getEnrichedClasses().find(c => c.id === classItem?.id) || classItem;

  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [showAddStudent, setShowAddStudent] = useState(false);
  const [isEditingInstructor, setIsEditingInstructor] = useState(false);
  const [selectedInstructorId, setSelectedInstructorId] = useState(currentClass?.instructor_id || '');

  if (!currentClass) return null;

  const targetDate = selectedDate || toISODateString(new Date());

  const classBookings = bookings.filter(
    (b: Booking) => b.class_id === currentClass.id && b.status === 'confirmed' && (b.booking_date === targetDate || !b.booking_date)
  );
  const classWaitlist = waitlist
    .filter((w: WaitlistEntry) => w.class_id === currentClass.id && w.status === 'waiting' && (w.request_date === targetDate || !w.request_date))
    .sort((a, b) => a.position - b.position);

  const availableStudents = profiles.filter(
    (p: Profile) =>
      p.role === 'client' &&
      p.status === 'active' &&
      !classBookings.some((b) => b.student_id === p.id)
  );

  const handleAddStudent = () => {
    if (!selectedStudentId) return;
    const res = bookClass(currentClass.id, selectedStudentId, targetDate);
    if (res.success) {
      setSelectedStudentId('');
      setShowAddStudent(false);
    } else {
      alert(res.message);
    }
  };

  const handleNotifyStudent = (student: Profile) => {
    const tpl = whatsappTemplates.find((t) => t.code === 'class_reminder');
    if (tpl && student.phone) {
      const msg = formatWhatsAppTemplate(tpl.template_text, {
        nombre: student.first_name,
        clase: currentClass.title,
        horario: currentClass.start_time,
        sede: currentClass.branch?.name || '',
        link: getBookingLink(studio.slug),
      });
      openWhatsApp(student.phone, msg);
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-100 flex flex-col">
        
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-100 flex items-start justify-between sticky top-0 bg-white/95 backdrop-blur-sm z-10">
          <div>
            <span
              className="text-xs font-extrabold px-2.5 py-0.5 rounded-full text-white inline-block mb-1.5 shadow-xs"
              style={{ backgroundColor: currentClass.activity?.color || currentClass.color }}
            >
              {currentClass.activity?.name || 'Clase'}
            </span>
            <h3 className="text-xl font-extrabold text-slate-900">{currentClass.title}</h3>
            <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-slate-500 font-medium">
              <span className="flex items-center space-x-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span className="font-bold text-slate-700">
                  {currentClass.start_time} - {currentClass.end_time} hs
                </span>
              </span>
              <span>•</span>
              <span className="flex items-center space-x-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>{currentClass.branch?.name} ({currentClass.room?.name})</span>
              </span>
              <span>•</span>
              {isEditingInstructor ? (
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-slate-700">Prof:</span>
                  <select
                    value={selectedInstructorId}
                    onChange={(e) => {
                      const newId = e.target.value;
                      setSelectedInstructorId(newId);
                      updateClass(currentClass.id, { instructor_id: newId });
                      setIsEditingInstructor(false);
                    }}
                    onBlur={() => setIsEditingInstructor(false)}
                    autoFocus
                    className="text-xs bg-white border border-slate-200 rounded px-1 py-0.5"
                  >
                    {profiles.filter(p => p.role === 'instructor' || p.role === 'admin').map(p => (
                      <option key={p.id} value={p.id}>{p.first_name} {p.last_name}</option>
                    ))}
                  </select>
                </div>
              ) : (
                <span 
                  className="font-bold text-slate-700 cursor-pointer hover:text-brand-600 transition-colors"
                  onClick={() => {
                    setSelectedInstructorId(currentClass.instructor_id);
                    setIsEditingInstructor(true);
                  }}
                  title="Click para cambiar profesor"
                >
                  Prof: {currentClass.instructor?.first_name} {currentClass.instructor?.last_name}
                </span>
              )}
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 flex-1">
          
          {/* Enrolled Students Section */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <h4 className="font-extrabold text-slate-800 text-sm">Alumnos Inscriptos</h4>
                <span className="text-slate-500 font-medium">
                  {classBookings.length} / {currentClass.max_capacity} inscritos
                </span>
              </div>

              <button
                onClick={() => setShowAddStudent(!showAddStudent)}
                className="text-xs font-bold text-brand-700 hover:text-brand-800 flex items-center space-x-1 bg-brand-50 hover:bg-brand-100 px-2.5 py-1 rounded-lg transition-colors"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Agregar Alumno</span>
              </button>
            </div>

            {/* Manual Add Student Form */}
            {showAddStudent && (
              <div className="p-4 mb-3 bg-slate-50 border border-slate-200 rounded-2xl animate-fade-in flex flex-col sm:flex-row gap-2">
                <select
                  value={selectedStudentId}
                  onChange={(e) => setSelectedStudentId(e.target.value)}
                  className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
                >
                  <option value="">Selecciona un alumno activo...</option>
                  {availableStudents.map((stu) => (
                    <option key={stu.id} value={stu.id}>
                      {stu.first_name} {stu.last_name} ({stu.credits_balance} créditos)
                    </option>
                  ))}
                </select>

                <button
                  onClick={handleAddStudent}
                  disabled={!selectedStudentId}
                  className="px-4 py-2 bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-sm transition-colors"
                >
                  Confirmar
                </button>
              </div>
            )}

            {/* Students List */}
            {classBookings.length === 0 ? (
              <p className="text-xs text-slate-400 py-4 text-center bg-slate-50 rounded-2xl">
                Aún no hay alumnos inscriptos en esta clase.
              </p>
            ) : (
              <div className="space-y-2">
                {classBookings.map((b) => {
                  const student = profiles.find((p) => p.id === b.student_id);
                  if (!student) return null;

                  return (
                    <div
                      key={b.id}
                      className="p-3 bg-slate-50/80 rounded-2xl border border-slate-200/60 flex items-center justify-between hover:bg-slate-100/60 transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-800 font-bold text-xs flex items-center justify-center">
                          {student.first_name[0]}{student.last_name[0]}
                        </div>
                        <div>
                          <div className="font-bold text-xs text-slate-800">
                            {student.first_name} {student.last_name}
                          </div>
                          <div className="text-[11px] text-slate-400 flex items-center space-x-2">
                            <span>{student.phone}</span>
                            <span>•</span>
                            <span className="text-emerald-700 font-semibold">
                              {student.credits_balance} créditos rest.
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-1.5">
                        {/* WhatsApp reminder button */}
                        <button
                          onClick={() => handleNotifyStudent(student)}
                          className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                          title="Enviar recordatorio por WhatsApp"
                        >
                          <MessageCircle className="w-4 h-4" />
                        </button>

                        {/* Cancel booking */}
                        <button
                          onClick={() => {
                            if (window.confirm(`¿Cancelar la reserva de ${student.first_name}? Se le reembolsará el crédito.`)) {
                              cancelBooking(b.id);
                            }
                          }}
                          className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Cancelar reserva"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Waitlist Section */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <h4 className="font-extrabold text-slate-800 text-sm">Lista de Espera</h4>
                <span className="text-xs font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full">
                  {classWaitlist.length} en cola
                </span>
              </div>
            </div>

            {classWaitlist.length === 0 ? (
              <p className="text-xs text-slate-400 py-3 text-center bg-slate-50 rounded-2xl">
                No hay alumnos en lista de espera para este turno.
              </p>
            ) : (
              <div className="space-y-2">
                {classWaitlist.map((w) => {
                  const student = profiles.find((p) => p.id === w.student_id);
                  if (!student) return null;

                  return (
                    <div
                      key={w.id}
                      className="p-3 bg-amber-50/60 rounded-2xl border border-amber-200/60 flex items-center justify-between"
                    >
                      <div className="flex items-center space-x-3">
                        <span className="w-6 h-6 rounded-full bg-amber-200 text-amber-900 font-extrabold text-xs flex items-center justify-center">
                          #{w.position}
                        </span>
                        <div>
                          <div className="font-bold text-xs text-slate-800">
                            {student.first_name} {student.last_name}
                          </div>
                          <div className="text-[11px] text-amber-700">
                            Esperando cupo liberado
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-6 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between rounded-b-3xl">
          <button
            onClick={() => {
              if (window.confirm('¿Estás seguro de eliminar esta clase? Se cancelarán todas las reservas asociadas.')) {
                deleteClass(currentClass.id);
                onClose();
              }
            }}
            className="text-xs font-bold text-rose-600 hover:text-rose-700 flex items-center space-x-1.5"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Eliminar Clase</span>
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold transition-colors"
          >
            Cerrar
          </button>
        </div>

      </div>
    </div>,
    document.body
  );
};
