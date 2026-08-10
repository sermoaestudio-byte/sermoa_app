import React, { useState } from 'react';
import {
  X,
  Plus,
  Trash2,
  Dumbbell,
  Clock,
  Calendar,
  User,
  Users,
  Award,
  Sparkles,
  Info,
  Layers,
  Flame,
  Check,
  Search,
  CheckSquare,
  Square
} from 'lucide-react';
import { useStudioStore } from '../../store/studioStore';
import { Routine, Exercise, Profile } from '../../types';
import { ConfirmDialog } from '../common/ConfirmDialog';

interface CreateRoutineModalProps {
  routineToEdit?: Routine | null;
  onClose: () => void;
}

export const CreateRoutineModal: React.FC<CreateRoutineModalProps> = ({
  routineToEdit,
  onClose,
}) => {
  const { profiles, activities, createRoutine, updateRoutine } = useStudioStore();
  const isEditing = !!routineToEdit;

  const instructors = profiles.filter((p) => p.role === 'instructor' || p.role === 'admin');
  const students = profiles.filter((p) => p.role === 'client' && p.status === 'active');

  // Metadata Fields
  const [title, setTitle] = useState(routineToEdit?.title || '');
  const [goal, setGoal] = useState(routineToEdit?.goal || '');
  const [level, setLevel] = useState<'principiante' | 'intermedio' | 'avanzado'>(
    routineToEdit?.level || 'intermedio'
  );
  const [activityId, setActivityId] = useState(
    routineToEdit?.activity_id || activities[0]?.id || ''
  );
  const [instructorId, setInstructorId] = useState(
    routineToEdit?.instructor_id || instructors[0]?.id || ''
  );

  // Multi-Student Assignment State
  const initialSelectedIds = routineToEdit?.student_ids?.length
    ? routineToEdit.student_ids
    : routineToEdit?.student_id
    ? [routineToEdit.student_id]
    : [];

  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>(initialSelectedIds);
  const [isGeneralTemplate, setIsGeneralTemplate] = useState<boolean>(initialSelectedIds.length === 0);
  const [studentSearch, setStudentSearch] = useState('');

  const [durationMinutes, setDurationMinutes] = useState(
    routineToEdit?.duration_minutes || 45
  );
  const [daysPerWeek, setDaysPerWeek] = useState(routineToEdit?.days_per_week || 2);

  // Exercises List
  const [exercises, setExercises] = useState<Exercise[]>(
    routineToEdit?.exercises || [
      {
        id: 'ex-1',
        name: 'Footwork en Reformer',
        category: 'pilates',
        sets: 3,
        reps: '15 reps',
        springs_or_weight: '2 Rojos + 1 Azul',
        rest_seconds: 30,
        notes: 'Alinear talones y mantener columna neutra en todo el recorrido.',
      },
      {
        id: 'ex-2',
        name: 'The Hundred (El Cien)',
        category: 'core',
        sets: 1,
        reps: '100 bombeos',
        springs_or_weight: '1 Rojo',
        rest_seconds: 45,
        notes: 'Bombeo vigoroso de brazos, mirada al ombligo.',
      },
    ]
  );

  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const toggleStudentSelection = (studentId: string) => {
    setIsGeneralTemplate(false);
    if (selectedStudentIds.includes(studentId)) {
      const next = selectedStudentIds.filter((id) => id !== studentId);
      setSelectedStudentIds(next);
      if (next.length === 0) setIsGeneralTemplate(true);
    } else {
      setSelectedStudentIds([...selectedStudentIds, studentId]);
    }
  };

  const handleSelectAllStudents = () => {
    setIsGeneralTemplate(false);
    setSelectedStudentIds(students.map((s) => s.id));
  };

  const handleClearStudents = () => {
    setSelectedStudentIds([]);
    setIsGeneralTemplate(true);
  };

  const addExercise = () => {
    setExercises([
      ...exercises,
      {
        id: `ex-${Date.now()}`,
        name: '',
        category: 'pilates',
        sets: 3,
        reps: '12 reps',
        springs_or_weight: '1 Rojo + 1 Azul',
        rest_seconds: 30,
        notes: '',
      },
    ]);
  };

  const removeExercise = (id: string) => {
    if (exercises.length <= 1) return;
    setExercises(exercises.filter((ex) => ex.id !== id));
  };

  const updateExerciseField = (id: string, field: keyof Exercise, value: any) => {
    setExercises(
      exercises.map((ex) => (ex.id === id ? { ...ex, [field]: value } : ex))
    );
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !goal || exercises.some((ex) => !ex.name.trim())) {
      alert('Por favor completa el título, objetivo y el nombre de todos los ejercicios.');
      return;
    }

    setShowConfirmModal(true);
  };

  const handleExecuteSave = () => {
    setShowConfirmModal(false);

    const assignedIds = isGeneralTemplate ? [] : selectedStudentIds;

    if (isEditing && routineToEdit) {
      updateRoutine(routineToEdit.id, {
        title,
        goal,
        level,
        activity_id: activityId,
        instructor_id: instructorId,
        student_id: assignedIds[0] || undefined,
        student_ids: assignedIds,
        duration_minutes: durationMinutes,
        days_per_week: daysPerWeek,
        exercises,
      });
    } else {
      createRoutine({
        title,
        goal,
        level,
        activity_id: activityId,
        instructor_id: instructorId,
        student_id: assignedIds[0] || undefined,
        student_ids: assignedIds,
        duration_minutes: durationMinutes,
        days_per_week: daysPerWeek,
        exercises,
      });
    }

    onClose();
  };

  const filteredStudentsList = students.filter((s) => {
    const query = studentSearch.toLowerCase();
    return (
      s.first_name.toLowerCase().includes(query) ||
      s.last_name.toLowerCase().includes(query) ||
      s.email.toLowerCase().includes(query)
    );
  });

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
        <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-100 flex flex-col">
          
          {/* Modal Header */}
          <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-20">
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-2xl bg-cyan-50 text-cyan-600 flex items-center justify-center shadow-xs">
                <Dumbbell className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
                  {isEditing ? 'Editar Plan de Rutina' : 'Nueva Rutina de Entrenamiento'}
                </h3>
                <p className="text-xs text-slate-400">
                  Estructura ejercicios, series, cargas y asignación a múltiples alumnos
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleFormSubmit} className="p-6 space-y-6 flex-1 text-xs">
            
            {/* 1. Header Metadata: Title & Goal */}
            <div className="space-y-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1.5">
                  <span className="text-rose-500 mr-1">*</span>Título de la Rutina
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Reformer Full Body - Nivel Intermedio"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1.5">
                  <span className="text-rose-500 mr-1">*</span>Objetivo Principal del Plan
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Fortalecimiento de Core, estabilidad lumbopélvica y postura"
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
            </div>

            {/* 2. Responsibles & Discipline */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 bg-slate-50/70 p-4 rounded-2xl border border-slate-200/60">
              
              {/* Profesor Responsable */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Profesor Responsable
                </label>
                <select
                  value={instructorId}
                  onChange={(e) => setInstructorId(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800"
                >
                  {instructors.map((p) => (
                    <option key={p.id} value={p.id}>
                      Prof. {p.first_name} {p.last_name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Disciplina */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Disciplina
                </label>
                <select
                  value={activityId}
                  onChange={(e) => setActivityId(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800"
                >
                  {activities.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Nivel */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Nivel de Dificultad
                </label>
                <select
                  value={level}
                  onChange={(e) => setLevel(e.target.value as any)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800"
                >
                  <option value="principiante">Principiante</option>
                  <option value="intermedio">Intermedio</option>
                  <option value="avanzado">Avanzado</option>
                </select>
              </div>

            </div>

            {/* 3. MULTI-STUDENT ASSIGNMENT SECTION */}
            <div className="p-4 bg-cyan-50/40 rounded-2xl border border-cyan-100 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4 text-cyan-700" />
                  <span className="font-extrabold text-slate-900 text-xs">
                    Asignación a Alumnos ({isGeneralTemplate ? 'Plantilla General - Todos' : `${selectedStudentIds.length} seleccionados`})
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={handleClearStudents}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-extrabold transition-all ${
                      isGeneralTemplate
                        ? 'bg-cyan-700 text-white shadow-xs'
                        : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    Plantilla General (Todos)
                  </button>

                  <button
                    type="button"
                    onClick={handleSelectAllStudents}
                    className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
                  >
                    Seleccionar Todos ({students.length})
                  </button>
                </div>
              </div>

              {/* Student Search */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Buscar alumno por nombre para asignar..."
                  value={studentSearch}
                  onChange={(e) => setStudentSearch(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none"
                />
              </div>

              {/* Multi-Student Selection Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 max-h-40 overflow-y-auto scrollbar-none p-1 bg-white rounded-xl border border-slate-200/80">
                {filteredStudentsList.map((student) => {
                  const isSelected = selectedStudentIds.includes(student.id);

                  return (
                    <button
                      key={student.id}
                      type="button"
                      onClick={() => toggleStudentSelection(student.id)}
                      className={`p-2 rounded-xl text-left border flex items-center justify-between transition-all ${
                        isSelected
                          ? 'border-cyan-600 bg-cyan-50/60 font-bold text-cyan-900 shadow-xs'
                          : 'border-slate-100 bg-slate-50/50 hover:bg-white text-slate-700'
                      }`}
                    >
                      <div className="flex items-center space-x-2 truncate mr-1">
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-extrabold ${
                            isSelected ? 'bg-cyan-600 text-white' : 'bg-slate-200 text-slate-600'
                          }`}
                        >
                          {student.first_name[0]}{student.last_name[0]}
                        </div>
                        <span className="truncate text-[11px]">
                          {student.first_name} {student.last_name}
                        </span>
                      </div>

                      {isSelected ? (
                        <CheckSquare className="w-4 h-4 text-cyan-600 shrink-0" />
                      ) : (
                        <Square className="w-4 h-4 text-slate-300 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              <p className="text-[10px] text-slate-500 italic">
                💡 Si dejas la rutina como "Plantilla General", estará visible y disponible para todo el alumnado. Si seleccionas uno o más alumnos, aparecerá específicamente en su perfil y portal.
              </p>
            </div>

            {/* 4. Duration & Frequency */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  Duración Sesión (min)
                </label>
                <input
                  type="number"
                  min="15"
                  max="120"
                  value={durationMinutes}
                  onChange={(e) => setDurationMinutes(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  Días x Semana
                </label>
                <input
                  type="number"
                  min="1"
                  max="7"
                  value={daysPerWeek}
                  onChange={(e) => setDaysPerWeek(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  Total Ejercicios
                </label>
                <div className="px-3 py-2 bg-slate-100 border border-slate-200 rounded-xl text-xs font-black text-slate-700 text-center">
                  {exercises.length} bloques
                </div>
              </div>
            </div>

            {/* 5. Exercise Builder Section */}
            <div className="pt-2 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-extrabold text-slate-900 text-sm flex items-center space-x-2">
                    <span>Bloques de Ejercicios</span>
                    <span className="bg-cyan-100 text-cyan-900 font-extrabold text-[10px] px-2 py-0.5 rounded-full">
                      {exercises.length}
                    </span>
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    Define nombre, series, repeticiones, resortes o peso y notas de ejecución
                  </p>
                </div>

                <button
                  type="button"
                  onClick={addExercise}
                  className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-cyan-50 hover:bg-cyan-100 text-cyan-800 border border-cyan-200 rounded-xl text-xs font-bold transition-all shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Agregar Ejercicio</span>
                </button>
              </div>

              {/* Exercises List */}
              <div className="space-y-3">
                {exercises.map((ex, index) => (
                  <div
                    key={ex.id}
                    className="p-4 bg-white rounded-2xl border border-slate-200 shadow-soft space-y-3 relative group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-extrabold text-cyan-700 bg-cyan-50 px-2.5 py-0.5 rounded-lg border border-cyan-100">
                        Ejercicio #{index + 1}
                      </span>

                      {exercises.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeExercise(ex.id)}
                          className="text-slate-400 hover:text-rose-600 p-1 transition-colors"
                          title="Eliminar ejercicio"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-600 mb-1">
                          <span className="text-rose-500 mr-1">*</span>Nombre del Ejercicio
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="Ej: Footwork, The Hundred, Plancha"
                          value={ex.name}
                          onChange={(e) => updateExerciseField(ex.id, 'name', e.target.value)}
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-600 mb-1">
                          Categoría / Enfoque
                        </label>
                        <select
                          value={ex.category}
                          onChange={(e) => updateExerciseField(ex.id, 'category', e.target.value)}
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800"
                        >
                          <option value="pilates">Pilates Reformer / Mat</option>
                          <option value="core">Core & Abdominales</option>
                          <option value="fuerza">Fuerza & Musculación</option>
                          <option value="flexibilidad">Flexibilidad & Elongación</option>
                          <option value="cardio">Cardio & Resistencia</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-600 mb-1">
                          Series
                        </label>
                        <input
                          type="number"
                          min="1"
                          max="10"
                          value={ex.sets}
                          onChange={(e) => updateExerciseField(ex.id, 'sets', Number(e.target.value))}
                          className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-600 mb-1">
                          Repeticiones / Tiempo
                        </label>
                        <input
                          type="text"
                          placeholder="Ej: 12-15 reps o 45s"
                          value={ex.reps}
                          onChange={(e) => updateExerciseField(ex.id, 'reps', e.target.value)}
                          className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800"
                        />
                      </div>

                      <div className="col-span-2 sm:col-span-1">
                        <label className="block text-[10px] font-bold text-slate-600 mb-1">
                          Carga / Resortes
                        </label>
                        <input
                          type="text"
                          placeholder="Ej: 1 Rojo + 1 Azul o 4kg"
                          value={ex.springs_or_weight || ''}
                          onChange={(e) => updateExerciseField(ex.id, 'springs_or_weight', e.target.value)}
                          className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-600 mb-1">
                        Notas Técnicas & Recomendaciones
                      </label>
                      <input
                        type="text"
                        placeholder="Ej: Mantener hombros relajados y respiración fluida..."
                        value={ex.notes || ''}
                        onChange={(e) => updateExerciseField(ex.id, 'notes', e.target.value)}
                        className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700"
                      />
                    </div>

                  </div>
                ))}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-cyan-700 hover:bg-cyan-800 text-white text-xs font-extrabold shadow-sm transition-all"
              >
                {isEditing ? 'Guardar Cambios' : 'Crear Plan de Rutina'}
              </button>
            </div>

          </form>

        </div>
      </div>

      {/* Standardized Confirm Dialog */}
      <ConfirmDialog
        isOpen={showConfirmModal}
        title={isEditing ? '¿Confirmar modificación de rutina?' : '¿Confirmar creación de rutina?'}
        message={`Se guardará el plan "${title}" con ${exercises.length} ejercicios asignado a ${
          isGeneralTemplate ? 'todos los alumnos (Plantilla General)' : `${selectedStudentIds.length} alumno(s) específico(s)`
        }.`}
        confirmText={isEditing ? 'Confirmar y Guardar' : 'Confirmar y Crear'}
        cancelText="Revisar"
        variant="success"
        onConfirm={handleExecuteSave}
        onCancel={() => setShowConfirmModal(false)}
      />
    </>
  );
};
