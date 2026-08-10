import React, { useState } from 'react';
import {
  UserCheck,
  Plus,
  Calendar,
  DollarSign,
  Phone,
  Mail,
  Award,
  ShieldCheck,
  CheckCircle2,
  Edit2,
  Trash2,
  HelpCircle
} from 'lucide-react';
import { useStudioStore } from '../../store/studioStore';
import { AddInstructorModal } from './AddInstructorModal';
import { ConfirmDialog } from '../common/ConfirmDialog';
import { ModuleHelpDrawer } from '../common/ModuleHelpDrawer';
import { Profile } from '../../types';

export const InstructorsView: React.FC = () => {
  const { profiles, classes, deleteInstructor } = useStudioStore();
  const instructors = profiles.filter((p) => p.role === 'instructor' || p.role === 'admin');

  // Modal States
  const [showAddModal, setShowAddModal] = useState(false);
  const [instructorToEdit, setInstructorToEdit] = useState<Profile | null>(null);
  const [showHelp, setShowHelp] = useState(false);

  // Delete Confirm Dialog State
  const [instructorToDelete, setInstructorToDelete] = useState<Profile | null>(null);

  const handleConfirmDelete = () => {
    if (instructorToDelete) {
      deleteInstructor(instructorToDelete.id);
      setInstructorToDelete(null);
    }
  };

  return (
    <div className="py-6 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header with Title & Action */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
              <UserCheck className="w-3.5 h-3.5 text-purple-600" />
              <span>Operativa Diaria</span>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Profesores & Staff
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Administra tu equipo de instructores, permisos especiales y asignaciones
            </p>
          </div>

          <div className="flex items-center space-x-2.5 self-start sm:self-auto">
            <button
              onClick={() => setShowHelp(true)}
              className="inline-flex items-center space-x-1.5 px-3 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold shadow-xs transition-all"
              title="Ver guía de Profesores"
            >
              <HelpCircle className="w-4 h-4 text-purple-600" />
              <span>Ayuda</span>
            </button>

            <button
              onClick={() => {
                setInstructorToEdit(null);
                setShowAddModal(true);
              }}
              className="inline-flex items-center space-x-1.5 px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-extrabold shadow-sm transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Nuevo Profesor</span>
            </button>
          </div>
        </div>

        {/* Instructors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {instructors.map((instructor) => {
            const assignedClasses = classes.filter((c) => c.instructor_id === instructor.id);

            return (
              <div
                key={instructor.id}
                className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-soft hover:shadow-soft-lg transition-all flex flex-col justify-between group relative"
              >
                <div>
                  {/* Top info with Action Buttons */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3.5">
                      <div className="w-13 h-13 rounded-2xl bg-purple-50 text-purple-700 font-extrabold text-lg flex items-center justify-center shadow-xs">
                        {instructor.first_name[0]}{instructor.last_name[0]}
                      </div>
                      <div>
                        <h4 className="font-extrabold text-slate-900 text-base">
                          {instructor.first_name} {instructor.last_name}
                        </h4>
                        <span className="text-[11px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-100">
                          {instructor.role === 'admin' ? 'Director / Instructor' : 'Profesor Staff'}
                        </span>
                      </div>
                    </div>

                    {/* Edit & Delete Action Buttons */}
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => {
                          setInstructorToEdit(instructor);
                          setShowAddModal(true);
                        }}
                        className="p-2 text-slate-400 hover:text-brand-600 hover:bg-brand-50 rounded-xl transition-colors"
                        title="Editar profesor"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>

                      {instructor.role !== 'admin' && (
                        <button
                          onClick={() => setInstructorToDelete(instructor)}
                          className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                          title="Eliminar profesor"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Specialties */}
                  {instructor.specialties && instructor.specialties.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {instructor.specialties.map((spec, i) => (
                        <span
                          key={i}
                          className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md flex items-center space-x-1"
                        >
                          <Award className="w-3 h-3 text-slate-400" />
                          <span>{spec}</span>
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Contact details */}
                  <div className="space-y-1.5 text-xs text-slate-500 bg-slate-50 p-3 rounded-2xl mb-4 font-medium">
                    <div className="flex items-center space-x-2">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      <span>{instructor.phone}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Mail className="w-3.5 h-3.5 text-slate-400" />
                      <span>{instructor.email}</span>
                    </div>
                  </div>

                  {/* Permissions badges if assigned */}
                  {instructor.permissions && Object.values(instructor.permissions).some(Boolean) && (
                    <div className="mb-4">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-1.5 flex items-center space-x-1">
                        <ShieldCheck className="w-3 h-3 text-purple-600" />
                        <span>Permisos Especiales</span>
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {instructor.permissions.view_all_students && (
                          <span className="text-[9px] font-bold bg-blue-50 text-blue-700 px-2 py-0.5 rounded-md border border-blue-100">
                            Ver todos los alumnos
                          </span>
                        )}
                        {instructor.permissions.manage_student_credits && (
                          <span className="text-[9px] font-bold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-md border border-emerald-100">
                            Gestionar créditos
                          </span>
                        )}
                        {instructor.permissions.view_all_classes && (
                          <span className="text-[9px] font-bold bg-purple-50 text-purple-700 px-2 py-0.5 rounded-md border border-purple-100">
                            Ver todas las clases
                          </span>
                        )}
                        {instructor.permissions.create_students && (
                          <span className="text-[9px] font-bold bg-amber-50 text-amber-800 px-2 py-0.5 rounded-md border border-amber-100">
                            Crear alumnos
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer with stats */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-1.5 text-slate-700 font-bold">
                    <Calendar className="w-4 h-4 text-brand-600" />
                    <span>{assignedClasses.length} clases asignadas</span>
                  </div>

                  <span className="text-slate-500 font-semibold text-[11px]">
                    ${instructor.commission_per_class?.toLocaleString('es-AR') || '0'} / clase
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal: Nuevo / Editar Profesor */}
        {showAddModal && (
          <AddInstructorModal
            instructorToEdit={instructorToEdit}
            onClose={() => {
              setShowAddModal(false);
              setInstructorToEdit(null);
            }}
          />
        )}

        {/* Standardized Confirm Dialog for Deletion */}
        <ConfirmDialog
          isOpen={!!instructorToDelete}
          title="¿Eliminar profesor?"
          message={
            instructorToDelete
              ? `¿Estás seguro de que deseas eliminar a ${instructorToDelete.first_name} ${instructorToDelete.last_name}? Esta acción no se puede deshacer y sus clases se reasignarán.`
              : ''
          }
          confirmText="Eliminar Definitivamente"
          cancelText="Cancelar"
          variant="danger"
          onConfirm={handleConfirmDelete}
          onCancel={() => setInstructorToDelete(null)}
        />

        {/* Module Auto-Help Drawer */}
        <ModuleHelpDrawer
          isOpen={showHelp}
          moduleId="instructors"
          onClose={() => setShowHelp(false)}
        />

      </div>
    </div>
  );
};
