import React, { useState } from 'react';
import {
  Dumbbell,
  Clock,
  Calendar,
  UserCheck,
  CheckCircle2,
  Sparkles,
  Flame,
  Award,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { useStudioStore } from '../../store/studioStore';
import { Profile, Routine } from '../../types';

interface StudentRoutinesTabProps {
  student: Profile;
}

export const StudentRoutinesTab: React.FC<StudentRoutinesTabProps> = ({ student }) => {
  const { routines, profiles, activities } = useStudioStore();

  // Find routines assigned to this student OR general studio templates
  const myRoutines = routines.filter((r: Routine) => {
    const assignedIds = r.student_ids?.length
      ? r.student_ids
      : r.student_id
      ? [r.student_id]
      : [];

    if (assignedIds.includes(student.id)) return true;
    if (assignedIds.length === 0) return true; // General template
    return false;
  });

  const [expandedRoutineId, setExpandedRoutineId] = useState<string>(myRoutines[0]?.id || '');
  const [completedExercises, setCompletedExercises] = useState<Record<string, boolean>>({});

  const toggleExerciseDone = (exerciseId: string) => {
    setCompletedExercises((prev) => ({
      ...prev,
      [exerciseId]: !prev[exerciseId],
    }));
  };

  return (
    <div className="space-y-5 max-w-2xl mx-auto my-6 animate-fade-in">
      
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-extrabold text-slate-900 flex items-center space-x-2">
            <Dumbbell className="w-4 h-4 text-cyan-600" />
            <span>Mi Plan de Entrenamiento ({myRoutines.length})</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Sigue las series y repeticiones prescritas por tus profesores
          </p>
        </div>
      </div>

      {myRoutines.length === 0 ? (
        <div className="p-8 bg-white rounded-3xl border border-slate-200 text-center text-xs text-slate-400">
          No tienes rutinas asignadas en este momento.
        </div>
      ) : (
        <div className="space-y-4">
          {myRoutines.map((routine) => {
            const instructor = profiles.find((p) => p.id === routine.instructor_id);
            const activity = activities.find((a) => a.id === routine.activity_id);
            const isExpanded = expandedRoutineId === routine.id;

            const assignedIds = routine.student_ids?.length
              ? routine.student_ids
              : routine.student_id
              ? [routine.student_id]
              : [];
            const isDirectlyAssigned = assignedIds.includes(student.id);

            return (
              <div
                key={routine.id}
                className="bg-white rounded-3xl border border-slate-200 shadow-soft overflow-hidden transition-all"
              >
                {/* Routine Card Header */}
                <div
                  onClick={() => setExpandedRoutineId(isExpanded ? '' : routine.id)}
                  className="p-5 cursor-pointer hover:bg-slate-50/60 transition-colors flex items-start justify-between gap-3"
                >
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="bg-cyan-50 text-cyan-800 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase border border-cyan-200">
                        {routine.level}
                      </span>
                      {activity && (
                        <span
                          className="text-[10px] font-extrabold px-2 py-0.5 rounded-full text-white shadow-xs"
                          style={{ backgroundColor: activity.color || '#54875e' }}
                        >
                          {activity.name}
                        </span>
                      )}
                      {isDirectlyAssigned && (
                        <span className="bg-emerald-50 text-emerald-800 font-extrabold text-[10px] px-2 py-0.5 rounded-full border border-emerald-200 flex items-center space-x-1">
                          <Sparkles className="w-3 h-3 text-emerald-600" />
                          <span>Asignado para ti</span>
                        </span>
                      )}
                    </div>

                    <h4 className="text-base font-extrabold text-slate-900 leading-snug">
                      {routine.title}
                    </h4>

                    <p className="text-xs text-slate-500 font-medium">
                      {routine.goal}
                    </p>

                    <div className="flex items-center space-x-3 text-[11px] text-slate-400 pt-1">
                      <span className="flex items-center space-x-1">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{routine.duration_minutes || 45} min</span>
                      </span>
                      <span>•</span>
                      <span className="flex items-center space-x-1">
                        <UserCheck className="w-3.5 h-3.5 text-purple-600" />
                        <span>Prof. {instructor?.first_name || 'Staff'}</span>
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg"
                  >
                    {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </button>
                </div>

                {/* Expanded Exercises Checklist */}
                {isExpanded && (
                  <div className="p-5 pt-0 border-t border-slate-100 bg-slate-50/40 space-y-3">
                    <div className="pt-3 flex items-center justify-between text-xs font-bold text-slate-700">
                      <span>Lista de Ejercicios ({routine.exercises.length})</span>
                      <span className="text-[10px] text-slate-400 font-medium">
                        Toca para marcar completado
                      </span>
                    </div>

                    <div className="space-y-2.5">
                      {routine.exercises.map((ex, index) => {
                        const isDone = completedExercises[ex.id];

                        return (
                          <div
                            key={ex.id}
                            onClick={() => toggleExerciseDone(ex.id)}
                            className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-start justify-between gap-3 ${
                              isDone
                                ? 'bg-emerald-50/80 border-emerald-300 text-slate-500'
                                : 'bg-white border-slate-200 shadow-xs text-slate-800'
                            }`}
                          >
                            <div className="space-y-1">
                              <div className="flex items-center space-x-2">
                                <span
                                  className={`w-5 h-5 rounded-md text-[10px] font-black flex items-center justify-center ${
                                    isDone ? 'bg-emerald-600 text-white' : 'bg-cyan-100 text-cyan-800'
                                  }`}
                                >
                                  {index + 1}
                                </span>
                                <span className={`font-extrabold text-xs ${isDone ? 'line-through' : ''}`}>
                                  {ex.name}
                                </span>
                              </div>

                              <div className="flex flex-wrap items-center gap-2 text-[11px] font-bold text-slate-600 pl-7">
                                <span className="bg-slate-100 px-2 py-0.5 rounded-md">
                                  {ex.sets} series x {ex.reps}
                                </span>
                                {ex.springs_or_weight && (
                                  <span className="bg-cyan-50 text-cyan-800 px-2 py-0.5 rounded-md border border-cyan-100">
                                    ⚙️ {ex.springs_or_weight}
                                  </span>
                                )}
                              </div>

                              {ex.notes && (
                                <p className="text-[10px] text-slate-500 italic pl-7 mt-0.5">
                                  💡 {ex.notes}
                                </p>
                              )}
                            </div>

                            <button
                              type="button"
                              className={`p-1 rounded-full transition-colors ${
                                isDone ? 'text-emerald-600' : 'text-slate-300 hover:text-slate-500'
                              }`}
                            >
                              <CheckCircle2 className="w-5 h-5" />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
