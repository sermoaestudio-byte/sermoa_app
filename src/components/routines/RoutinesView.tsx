import React, { useState } from 'react';
import {
  Dumbbell,
  Plus,
  Flame,
  Sparkles,
  User,
  Users,
  UserCheck,
  ChevronRight,
  Search,
  Filter,
  Clock,
  Calendar,
  Tag,
  HelpCircle,
  MessageCircle,
  Edit2,
  Trash2
} from 'lucide-react';
import { useStudioStore } from '../../store/studioStore';
import { Routine, Profile } from '../../types';
import { CreateRoutineModal } from './CreateRoutineModal';
import { RoutineDetailModal } from './RoutineDetailModal';
import { ModuleHelpDrawer } from '../common/ModuleHelpDrawer';
import { ConfirmDialog } from '../common/ConfirmDialog';
import { openWhatsApp } from '../../utils/whatsapp';

export const RoutinesView: React.FC = () => {
  const { routines, profiles, activities, deleteRoutine } = useStudioStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [selectedInstructorId, setSelectedInstructorId] = useState<string>('all');
  const [selectedActivityId, setSelectedActivityId] = useState<string>('all');
  const [selectedStudentId, setSelectedStudentId] = useState<string>('all');

  // Modals
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [routineToEdit, setRoutineToEdit] = useState<Routine | null>(null);
  const [selectedRoutine, setSelectedRoutine] = useState<Routine | null>(null);
  const [showHelp, setShowHelp] = useState(false);

  // Deletion confirm
  const [routineToDelete, setRoutineToDelete] = useState<Routine | null>(null);

  const instructors = profiles.filter((p) => p.role === 'instructor' || p.role === 'admin');
  const students = profiles.filter((p) => p.role === 'client' && p.status === 'active');

  const filteredRoutines = routines.filter((r) => {
    // Search query
    const matchSearch =
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.goal.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.exercises.some((e) => e.name.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchSearch) return false;

    // Filters
    if (selectedLevel !== 'all' && r.level !== selectedLevel) return false;
    if (selectedInstructorId !== 'all' && r.instructor_id !== selectedInstructorId) return false;
    if (selectedActivityId !== 'all' && r.activity_id !== selectedActivityId) return false;

    // Student Filter
    if (selectedStudentId !== 'all') {
      const assignedIds = r.student_ids?.length
        ? r.student_ids
        : r.student_id
        ? [r.student_id]
        : [];
      if (!assignedIds.includes(selectedStudentId)) return false;
    }

    return true;
  });

  const handleConfirmDelete = () => {
    if (routineToDelete) {
      deleteRoutine(routineToDelete.id);
      setRoutineToDelete(null);
      if (selectedRoutine?.id === routineToDelete.id) {
        setSelectedRoutine(null);
      }
    }
  };

  const handleQuickWhatsApp = (routine: Routine) => {
    const assignedIds = routine.student_ids?.length
      ? routine.student_ids
      : routine.student_id
      ? [routine.student_id]
      : [];
    const student = profiles.find((p) => assignedIds.includes(p.id));
    const targetPhone = student?.phone || '';
    const message = `🏋️ *PLAN DE ENTRENAMIENTO SERMOA*\n\n📋 *Rutina:* ${routine.title}\n🎯 *Objetivo:* ${routine.goal}\n⏱️ *Duración:* ${routine.duration_minutes || 45} min • ${routine.days_per_week || 2} días/sem\n\n¡Consulta tus ejercicios desde la app de Sermoa! 💪`;
    openWhatsApp(targetPhone, message);
  };

  return (
    <div className="py-6 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
              <Dumbbell className="w-3.5 h-3.5 text-cyan-600" />
              <span>Operativa Diaria</span>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Rutinas & Planes de Entrenamiento
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Crea ejercicios, asigna profesores responsables y prescribe planes a múltiples alumnos
            </p>
          </div>

          <div className="flex items-center space-x-2.5 self-start md:self-auto">
            <button
              onClick={() => setShowHelp(true)}
              className="inline-flex items-center space-x-1.5 px-3 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold shadow-xs transition-all"
              title="Ver guía de Rutinas"
            >
              <HelpCircle className="w-4 h-4 text-cyan-600" />
              <span>Ayuda</span>
            </button>

            <button
              onClick={() => {
                setRoutineToEdit(null);
                setShowCreateModal(true);
              }}
              className="inline-flex items-center space-x-1.5 px-4 py-2 bg-cyan-700 hover:bg-cyan-800 text-white rounded-xl text-xs font-extrabold shadow-sm transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Nueva Rutina</span>
            </button>
          </div>
        </div>

        {/* Search & Filters Bar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-soft mb-6 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
          
          {/* Search Bar */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar por nombre de rutina, objetivo o ejercicio..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-brand-500 text-slate-800"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-2">
            
            {/* Level Filter */}
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none"
            >
              <option value="all">Todos los niveles</option>
              <option value="principiante">Principiante</option>
              <option value="intermedio">Intermedio</option>
              <option value="avanzado">Avanzado</option>
            </select>

            {/* Instructor Filter */}
            <select
              value={selectedInstructorId}
              onChange={(e) => setSelectedInstructorId(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none"
            >
              <option value="all">Todos los profesores</option>
              {instructors.map((p) => (
                <option key={p.id} value={p.id}>
                  Prof. {p.first_name} {p.last_name}
                </option>
              ))}
            </select>

            {/* Activity Filter */}
            <select
              value={selectedActivityId}
              onChange={(e) => setSelectedActivityId(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none"
            >
              <option value="all">Todas las disciplinas</option>
              {activities.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name}
                </option>
              ))}
            </select>

            {/* Student Filter */}
            <select
              value={selectedStudentId}
              onChange={(e) => setSelectedStudentId(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none"
            >
              <option value="all">Todos los alumnos</option>
              {students.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.first_name} {s.last_name}
                </option>
              ))}
            </select>

          </div>
        </div>

        {/* Routines Grid */}
        {filteredRoutines.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredRoutines.map((routine) => {
              const instructor = profiles.find((p) => p.id === routine.instructor_id);
              const activity = activities.find((a) => a.id === routine.activity_id);

              const assignedIds = routine.student_ids?.length
                ? routine.student_ids
                : routine.student_id
                ? [routine.student_id]
                : [];
              const assignedStudentsList = profiles.filter((p) => assignedIds.includes(p.id));
              const isGeneral = assignedStudentsList.length === 0;

              return (
                <div
                  key={routine.id}
                  className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-soft hover:shadow-soft-lg transition-all flex flex-col justify-between group"
                >
                  <div>
                    {/* Header Badges */}
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="bg-cyan-50 text-cyan-800 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase border border-cyan-200">
                          {routine.level}
                        </span>
                        {activity && (
                          <span
                            className="text-[10px] font-bold px-2 py-0.5 rounded-full text-white shadow-xs"
                            style={{ backgroundColor: activity.color || '#54875e' }}
                          >
                            {activity.name}
                          </span>
                        )}
                      </div>

                      <span className="text-[11px] text-slate-400 font-bold">
                        {routine.exercises.length} ejercicios
                      </span>
                    </div>

                    <h3 className="font-extrabold text-slate-900 text-base mb-1 group-hover:text-cyan-700 transition-colors">
                      {routine.title}
                    </h3>
                    <p className="text-xs text-slate-500 mb-3 line-clamp-2 leading-relaxed">
                      {routine.goal}
                    </p>

                    {/* Metadata summary */}
                    <div className="flex items-center space-x-3 text-[11px] text-slate-400 mb-4">
                      <span className="flex items-center space-x-1">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{routine.duration_minutes || 45} min</span>
                      </span>
                      <span>•</span>
                      <span className="flex items-center space-x-1">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{routine.days_per_week || 2} días/sem</span>
                      </span>
                    </div>

                    {/* Exercises Mini-list */}
                    <div className="space-y-1.5 mb-4 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                      {routine.exercises.slice(0, 3).map((ex) => (
                        <div key={ex.id} className="flex items-center justify-between text-xs">
                          <span className="font-semibold text-slate-700 truncate mr-2">
                            • {ex.name}
                          </span>
                          <span className="text-[10px] font-bold text-slate-500 shrink-0">
                            {ex.sets}x{ex.reps}
                          </span>
                        </div>
                      ))}
                      {routine.exercises.length > 3 && (
                        <span className="text-[10px] text-cyan-600 font-bold block pt-1">
                          + {routine.exercises.length - 3} ejercicios más...
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Footer & Actions */}
                  <div className="pt-3 border-t border-slate-100 space-y-3">
                    
                    <div className="flex items-center justify-between text-xs">
                      {/* Instructor */}
                      <div className="flex items-center space-x-1.5 text-purple-700 font-bold text-[11px]">
                        <UserCheck className="w-3.5 h-3.5" />
                        <span>Prof. {instructor?.first_name || 'Staff'}</span>
                      </div>

                      {/* Students Badge */}
                      <span className="text-[10px] text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md font-bold flex items-center space-x-1">
                        <Users className="w-3 h-3 text-slate-400" />
                        <span>
                          {isGeneral
                            ? 'Plantilla General'
                            : assignedStudentsList.length === 1
                            ? assignedStudentsList[0].first_name
                            : `${assignedStudentsList.length} alumnos`}
                        </span>
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-2 pt-1">
                      <button
                        onClick={() => setSelectedRoutine(routine)}
                        className="flex-1 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center space-x-1 shadow-xs"
                      >
                        <span>Ver Plan Completo</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => handleQuickWhatsApp(routine)}
                        className="p-2 text-emerald-700 hover:bg-emerald-50 border border-emerald-200 rounded-xl transition-colors"
                        title="Enviar por WhatsApp"
                      >
                        <MessageCircle className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => {
                          setRoutineToEdit(routine);
                          setShowCreateModal(true);
                        }}
                        className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
                        title="Editar"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => setRoutineToDelete(routine)}
                        className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl transition-colors"
                        title="Eliminar"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-16 text-center text-slate-400 bg-white rounded-3xl border border-slate-200/80">
            <Dumbbell className="w-12 h-12 mx-auto mb-3 text-slate-300" />
            <p className="text-sm font-bold text-slate-700">No se encontraron rutinas con los filtros seleccionados.</p>
            <p className="text-xs text-slate-400 mt-1">Prueba cambiando los filtros o crea una nueva rutina.</p>
          </div>
        )}

        {/* Modals & Drawers */}
        {showCreateModal && (
          <CreateRoutineModal
            routineToEdit={routineToEdit}
            onClose={() => {
              setShowCreateModal(false);
              setRoutineToEdit(null);
            }}
          />
        )}

        {selectedRoutine && (
          <RoutineDetailModal
            routine={selectedRoutine}
            onEdit={() => {
              const r = selectedRoutine;
              setSelectedRoutine(null);
              setRoutineToEdit(r);
              setShowCreateModal(true);
            }}
            onDelete={() => {
              deleteRoutine(selectedRoutine.id);
              setSelectedRoutine(null);
            }}
            onClose={() => setSelectedRoutine(null)}
          />
        )}

        {/* Confirmation Dialog for Deletion */}
        <ConfirmDialog
          isOpen={!!routineToDelete}
          title="¿Eliminar plan de rutina?"
          message={
            routineToDelete
              ? `¿Estás seguro de que deseas eliminar "${routineToDelete.title}"? Esta acción no se puede deshacer.`
              : ''
          }
          confirmText="Eliminar Definitivamente"
          cancelText="Cancelar"
          variant="danger"
          onConfirm={handleConfirmDelete}
          onCancel={() => setRoutineToDelete(null)}
        />

        {/* Module Auto-Help Drawer */}
        <ModuleHelpDrawer
          isOpen={showHelp}
          moduleId="routines"
          onClose={() => setShowHelp(false)}
        />

      </div>
    </div>
  );
};
