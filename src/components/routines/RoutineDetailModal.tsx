import React, { useState } from 'react';
import {
  X,
  Dumbbell,
  Clock,
  Calendar,
  User,
  Users,
  UserCheck,
  Edit2,
  Trash2,
  MessageCircle,
  Share2,
  Sparkles,
  Award,
  Layers,
  ChevronRight,
  Flame,
  Phone
} from 'lucide-react';
import { useStudioStore } from '../../store/studioStore';
import { Routine, Profile } from '../../types';
import { openWhatsApp } from '../../utils/whatsapp';
import { ConfirmDialog } from '../common/ConfirmDialog';

interface RoutineDetailModalProps {
  routine: Routine;
  onEdit: () => void;
  onDelete: () => void;
  onClose: () => void;
}

export const RoutineDetailModal: React.FC<RoutineDetailModalProps> = ({
  routine,
  onEdit,
  onDelete,
  onClose,
}) => {
  const { profiles, activities } = useStudioStore();

  const instructor = profiles.find((p) => p.id === routine.instructor_id);
  const activity = activities.find((a) => a.id === routine.activity_id);

  // Assigned students list
  const assignedStudentIds = routine.student_ids?.length
    ? routine.student_ids
    : routine.student_id
    ? [routine.student_id]
    : [];

  const assignedStudents = profiles.filter((p) => assignedStudentIds.includes(p.id));
  const isGeneralTemplate = assignedStudents.length === 0;

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleShareWhatsAppStudent = (studentPhone?: string) => {
    const exercisesText = routine.exercises
      .map(
        (ex, i) =>
          `🔹 *${i + 1}. ${ex.name}*: ${ex.sets} series x ${ex.reps}${
            ex.springs_or_weight ? ` (Carga: ${ex.springs_or_weight})` : ''
          }${ex.notes ? `\n   _Nota: ${ex.notes}_` : ''}`
      )
      .join('\n\n');

    const message = `🏋️ *PLAN DE ENTRENAMIENTO - SERMOA APP*\n\n📋 *Rutina:* ${routine.title}\n🎯 *Objetivo:* ${routine.goal}\n⏱️ *Duración:* ${routine.duration_minutes || 45} min • ${routine.days_per_week || 2} días/sem\n👨‍🏫 *Profesor:* ${instructor ? `${instructor.first_name} ${instructor.last_name}` : 'Staff'}\n\n*EJERCICIOS:*\n${exercisesText}\n\n¡A darlo todo en el entrenamiento! 💪`;

    openWhatsApp(studentPhone || '', message);
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
        <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-100 flex flex-col">
          
          {/* Header */}
          <div className="p-6 border-b border-slate-100 flex items-start justify-between bg-slate-50/80 sticky top-0 z-20">
            <div className="flex items-start space-x-3.5 pr-4">
              <div className="w-12 h-12 rounded-2xl bg-cyan-100 text-cyan-800 font-extrabold flex items-center justify-center text-xl shrink-0 shadow-xs border border-cyan-200">
                <Dumbbell className="w-6 h-6" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-1.5 mb-1">
                  <span className="bg-cyan-50 text-cyan-800 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase border border-cyan-200">
                    Nivel {routine.level}
                  </span>
                  {activity && (
                    <span
                      className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full text-white shadow-xs"
                      style={{ backgroundColor: activity.color || '#54875e' }}
                    >
                      {activity.name}
                    </span>
                  )}
                </div>
                <h3 className="text-xl font-black text-slate-900 leading-snug">
                  {routine.title}
                </h3>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  {routine.goal}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-1 shrink-0">
              <button
                onClick={onEdit}
                className="p-2 text-slate-400 hover:text-brand-600 hover:bg-white rounded-xl transition-colors"
                title="Editar rutina"
              >
                <Edit2 className="w-4 h-4" />
              </button>

              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                title="Eliminar rutina"
              >
                <Trash2 className="w-4 h-4" />
              </button>

              <button
                onClick={onClose}
                className="p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6 flex-1 text-xs">
            
            {/* Responsibles Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              
              {/* Instructor Card */}
              <div className="p-4 bg-purple-50/60 rounded-2xl border border-purple-100 flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-sm shrink-0">
                  <UserCheck className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600 block">
                    Profesor Responsable
                  </span>
                  <span className="font-extrabold text-slate-900 text-xs">
                    {instructor ? `Prof. ${instructor.first_name} ${instructor.last_name}` : 'Staff del Estudio'}
                  </span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">
                    {instructor?.phone || 'Sin teléfono'}
                  </span>
                </div>
              </div>

              {/* Assignment Summary */}
              <div className="p-4 bg-cyan-50/60 rounded-2xl border border-cyan-100 flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-100 text-cyan-700 flex items-center justify-center font-bold text-sm shrink-0">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-700 block">
                    Alcance de Alumnos
                  </span>
                  <span className="font-extrabold text-slate-900 text-xs">
                    {isGeneralTemplate
                      ? 'Plantilla General (Todos los alumnos)'
                      : `${assignedStudents.length} alumno(s) asignado(s)`}
                  </span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">
                    {isGeneralTemplate
                      ? 'Disponible en todo el estudio'
                      : 'Prescripción personalizada'}
                  </span>
                </div>
              </div>

            </div>

            {/* If specific students assigned, list them with individual WhatsApp actions */}
            {!isGeneralTemplate && (
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/70 space-y-2">
                <span className="font-extrabold text-slate-800 text-[11px] block">
                  Alumnos con este plan asignado:
                </span>

                <div className="space-y-1.5 max-h-36 overflow-y-auto scrollbar-none">
                  {assignedStudents.map((s) => (
                    <div
                      key={s.id}
                      className="p-2 bg-white rounded-xl border border-slate-200/80 flex items-center justify-between"
                    >
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 rounded-full bg-cyan-100 text-cyan-800 flex items-center justify-center text-[10px] font-bold">
                          {s.first_name[0]}{s.last_name[0]}
                        </div>
                        <div>
                          <span className="font-bold text-slate-900 text-xs">
                            {s.first_name} {s.last_name}
                          </span>
                          <span className="text-[10px] text-slate-400 ml-2">
                            {s.phone}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => handleShareWhatsAppStudent(s.phone)}
                        className="px-2 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg text-[10px] font-bold flex items-center space-x-1 transition-colors"
                        title="Enviar plan a este alumno"
                      >
                        <MessageCircle className="w-3 h-3" />
                        <span>Enviar</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Metrics pills */}
            <div className="flex flex-wrap gap-2 py-2 border-y border-slate-100 text-xs text-slate-600 font-semibold">
              <span className="flex items-center space-x-1 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200/60">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>{routine.duration_minutes || 45} minutos</span>
              </span>
              <span className="flex items-center space-x-1 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200/60">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>{routine.days_per_week || 2} días por semana</span>
              </span>
              <span className="flex items-center space-x-1 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200/60">
                <Flame className="w-3.5 h-3.5 text-amber-500" />
                <span>{routine.exercises.length} ejercicios estructurados</span>
              </span>
            </div>

            {/* Exercises List */}
            <div>
              <h4 className="font-extrabold text-slate-900 text-sm mb-3 flex items-center space-x-2">
                <span>Desglose de Ejercicios del Plan</span>
              </h4>

              <div className="space-y-3">
                {routine.exercises.map((ex, idx) => (
                  <div
                    key={ex.id}
                    className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-soft space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="w-6 h-6 rounded-lg bg-cyan-100 text-cyan-800 font-black text-xs flex items-center justify-center">
                          {idx + 1}
                        </span>
                        <h5 className="font-extrabold text-slate-900 text-xs">
                          {ex.name}
                        </h5>
                      </div>

                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-200/60">
                        {ex.category}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 bg-slate-50 p-2.5 rounded-xl text-center">
                      <div>
                        <span className="text-[9px] font-bold text-slate-400 uppercase block">Series</span>
                        <span className="font-black text-slate-800 text-xs">{ex.sets}</span>
                      </div>
                      <div>
                        <span className="text-[9px] font-bold text-slate-400 uppercase block">Reps / Tiempo</span>
                        <span className="font-black text-slate-800 text-xs">{ex.reps}</span>
                      </div>
                      <div>
                        <span className="text-[9px] font-bold text-slate-400 uppercase block">Carga / Resortes</span>
                        <span className="font-bold text-cyan-700 text-xs truncate block">
                          {ex.springs_or_weight || 'Normal'}
                        </span>
                      </div>
                    </div>

                    {ex.notes && (
                      <p className="text-[11px] text-slate-500 italic pl-1 leading-relaxed">
                        💡 {ex.notes}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Modal Footer with WhatsApp Action */}
          <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
            <button
              onClick={() => handleShareWhatsAppStudent(assignedStudents[0]?.phone)}
              className="inline-flex items-center space-x-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black shadow-sm transition-all"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Compartir Plan por WhatsApp</span>
            </button>

            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-white transition-colors"
            >
              Cerrar
            </button>
          </div>

        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        title="¿Eliminar plan de rutina?"
        message={`¿Estás seguro de que deseas eliminar "${routine.title}"? Esta acción no se puede deshacer.`}
        confirmText="Eliminar Definitivamente"
        cancelText="Cancelar"
        variant="danger"
        onConfirm={() => {
          setShowDeleteConfirm(false);
          onDelete();
        }}
        onCancel={() => setShowDeleteConfirm(false)}
      />
    </>
  );
};
