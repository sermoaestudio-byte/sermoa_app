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
  HelpCircle,
  ArrowLeft,
  Power,
  PowerOff,
  UserX,
  Sparkles,
  Search,
  Filter
} from 'lucide-react';
import { useStudioStore } from '../../store/studioStore';
import { AddInstructorModal } from './AddInstructorModal';
import { ConfirmDialog } from '../common/ConfirmDialog';
import { ModuleHelpDrawer } from '../common/ModuleHelpDrawer';
import { Profile } from '../../types';

interface InstructorsViewProps {
  onNavigate?: (view: string) => void;
}

export const InstructorsView: React.FC<InstructorsViewProps> = ({ onNavigate }) => {
  const { profiles, classes, deleteInstructor, updateInstructor } = useStudioStore();
  
  // Staff members (instructors and admins)
  const staffMembers = profiles.filter((p) => p.role === 'instructor' || p.role === 'admin');

  const [activeTab, setActiveTab] = useState<'all' | 'admins' | 'instructors' | 'active' | 'inactive'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Modal States
  const [showAddModal, setShowAddModal] = useState(false);
  const [instructorToEdit, setInstructorToEdit] = useState<Profile | null>(null);
  const [showHelp, setShowHelp] = useState(false);

  // Confirm Dialog State
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    confirmText: string;
    variant?: 'danger' | 'warning' | 'primary';
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    confirmText: '',
    variant: 'danger',
    onConfirm: () => {},
  });

  const adminsCount = staffMembers.filter((s) => s.role === 'admin').length;
  const instructorsCount = staffMembers.filter((s) => s.role === 'instructor').length;
  const activeCount = staffMembers.filter((i) => i.status === 'active' || !i.status).length;
  const inactiveCount = staffMembers.filter((i) => i.status === 'inactive').length;

  const filteredStaff = staffMembers.filter((member) => {
    const isInactive = member.status === 'inactive';
    const matchesTab =
      activeTab === 'all' ||
      (activeTab === 'admins' && member.role === 'admin') ||
      (activeTab === 'instructors' && member.role === 'instructor') ||
      (activeTab === 'active' && !isInactive) ||
      (activeTab === 'inactive' && isInactive);

    const fullName = `${member.first_name} ${member.last_name}`.toLowerCase();
    const matchesSearch =
      fullName.includes(searchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.phone.includes(searchQuery);

    return matchesTab && matchesSearch;
  });

  const handleToggleStatus = (staff: Profile) => {
    const isCurrentlyActive = staff.status === 'active' || !staff.status;
    const newStatus = isCurrentlyActive ? 'inactive' : 'active';

    setConfirmDialog({
      isOpen: true,
      title: isCurrentlyActive ? '¿Inactivar Usuario?' : '¿Activar Usuario?',
      message: isCurrentlyActive
        ? `Al inactivar a "${staff.first_name} ${staff.last_name}", no podrá acceder al sistema hasta que lo reactives.`
        : `Se reactivará la cuenta de "${staff.first_name} ${staff.last_name}" en el equipo.`,
      confirmText: isCurrentlyActive ? 'Inactivar' : 'Activar',
      variant: isCurrentlyActive ? 'warning' : 'primary',
      onConfirm: () => {
        updateInstructor(staff.id, { status: newStatus });
        setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
      },
    });
  };

  const handleDelete = (staff: Profile) => {
    setConfirmDialog({
      isOpen: true,
      title: '¿Eliminar Usuario del Staff?',
      message: `¿Estás seguro de que deseas eliminar permanentemente a "${staff.first_name} ${staff.last_name}"? Esta acción no se puede deshacer y se borrará su acceso.`,
      confirmText: 'Eliminar Usuario',
      variant: 'danger',
      onConfirm: () => {
        deleteInstructor(staff.id);
        setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
      },
    });
  };

  return (
    <div className="py-6 sm:py-8 animate-fade-in">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Header with Title & Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start space-x-3">
            {onNavigate && (
              <button
                onClick={() => onNavigate('dashboard')}
                className="p-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-2xl shadow-xs transition-colors shrink-0 mt-0.5"
                title="Volver al Inicio"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}
            <div>
              <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                <UserCheck className="w-3.5 h-3.5 text-purple-600" />
                <span>Operativa Diaria</span>
              </div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                Equipo & Staff (Administradores y Profesores)
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Administra roles de Administrador (acceso a finanzas) y Profesores (clases y alumnos)
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2.5 self-start sm:self-auto flex-wrap">
            <button
              onClick={() => setShowHelp(true)}
              className="inline-flex items-center space-x-1.5 px-3 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold shadow-xs transition-all"
              title="Ver guía del Staff"
            >
              <HelpCircle className="w-4 h-4 text-purple-600" />
              <span>Ayuda</span>
            </button>

            <button
              onClick={() => {
                setInstructorToEdit(null);
                setShowAddModal(true);
              }}
              className="inline-flex items-center space-x-1.5 px-4 py-2 bg-purple-700 hover:bg-purple-800 text-white rounded-xl text-xs font-extrabold shadow-md shadow-purple-700/20 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Nuevo Staff / Usuario</span>
            </button>
          </div>
        </div>

        {/* Tab & Search Filters */}
        {staffMembers.length > 0 && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center space-x-1 overflow-x-auto pb-1 sm:pb-0">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all shrink-0 ${
                  activeTab === 'all'
                    ? 'bg-purple-100 text-purple-800'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                Todos ({staffMembers.length})
              </button>
              <button
                onClick={() => setActiveTab('admins')}
                className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all shrink-0 flex items-center space-x-1 ${
                  activeTab === 'admins'
                    ? 'bg-blue-100 text-blue-800'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <span>🛡️ Admins ({adminsCount})</span>
              </button>
              <button
                onClick={() => setActiveTab('instructors')}
                className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all shrink-0 flex items-center space-x-1 ${
                  activeTab === 'instructors'
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <span>🧘 Profesores ({instructorsCount})</span>
              </button>
              <button
                onClick={() => setActiveTab('active')}
                className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all shrink-0 ${
                  activeTab === 'active'
                    ? 'bg-slate-200 text-slate-800'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                Activos ({activeCount})
              </button>
              <button
                onClick={() => setActiveTab('inactive')}
                className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all shrink-0 ${
                  activeTab === 'inactive'
                    ? 'bg-slate-200 text-slate-800'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                Inactivos ({inactiveCount})
              </button>
            </div>

            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar por nombre, email o tel..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-3.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none w-full sm:w-64"
              />
            </div>
          </div>
        )}

        {/* Empty State when no staff */}
        {staffMembers.length === 0 && (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-soft space-y-4 my-8">
            <div className="w-16 h-16 rounded-3xl bg-purple-50 text-purple-600 flex items-center justify-center mx-auto shadow-xs border border-purple-100">
              <UserCheck className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900">
                Aún no has registrado miembros del staff
              </h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
                Registra a los administradores y profesores de tu equipo para asignarles roles y permisos.
              </p>
            </div>
            <button
              onClick={() => {
                setInstructorToEdit(null);
                setShowAddModal(true);
              }}
              className="px-6 py-3 bg-purple-700 hover:bg-purple-800 text-white rounded-2xl text-xs font-extrabold shadow-md shadow-purple-700/20 inline-flex items-center space-x-2 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Crear Primer Miembro</span>
            </button>
          </div>
        )}

        {/* Staff Grid */}
        {staffMembers.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredStaff.map((instructor) => {
              const assignedClasses = classes.filter((c) => c.instructor_id === instructor.id);
              const isInactive = instructor.status === 'inactive';
              const isAdmin = instructor.role === 'admin';

              return (
                <div
                  key={instructor.id}
                  className={`bg-white rounded-3xl p-6 border transition-all flex flex-col justify-between group relative ${
                    isInactive
                      ? 'border-slate-200 opacity-75 bg-slate-50/40'
                      : isAdmin
                      ? 'border-blue-200/90 shadow-soft hover:shadow-soft-lg bg-gradient-to-b from-white to-blue-50/20'
                      : 'border-slate-200/80 shadow-soft hover:shadow-soft-lg'
                  }`}
                >
                  <div>
                    {/* Top info with Action Buttons */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3.5">
                        <div
                          className={`w-12 h-12 rounded-2xl font-black text-base flex items-center justify-center shadow-xs ${
                            isInactive
                              ? 'bg-slate-100 text-slate-500'
                              : isAdmin
                              ? 'bg-blue-600 text-white shadow-blue-600/20'
                              : 'bg-purple-50 text-purple-700 border border-purple-100'
                          }`}
                        >
                          {instructor.first_name[0]}{instructor.last_name[0]}
                        </div>
                        <div>
                          <h4 className="font-extrabold text-slate-900 text-base leading-snug">
                            {instructor.first_name} {instructor.last_name}
                          </h4>
                          <div className="flex items-center space-x-1.5 mt-0.5">
                            <span
                              className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${
                                isInactive
                                  ? 'bg-slate-100 text-slate-600 border-slate-200'
                                  : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              }`}
                            >
                              {isInactive ? 'Inactivo' : 'Activo'}
                            </span>
                            {isAdmin ? (
                              <span className="text-[10px] font-extrabold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200 flex items-center space-x-0.5">
                                <span>🛡️ Admin (Finanzas)</span>
                              </span>
                            ) : (
                              <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-100">
                                🧘 Profesor
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons: Edit, Toggle Status, Delete */}
                      <div className="flex items-center space-x-1">
                        {/* Edit Button */}
                        <button
                          onClick={() => {
                            setInstructorToEdit(instructor);
                            setShowAddModal(true);
                          }}
                          className="p-2 text-slate-400 hover:text-purple-700 hover:bg-purple-50 rounded-xl transition-colors"
                          title="Editar usuario"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>

                        {/* Inactivate / Activate Button */}
                        <button
                          onClick={() => handleToggleStatus(instructor)}
                          className={`p-2 rounded-xl transition-colors ${
                            isInactive
                              ? 'text-emerald-600 hover:bg-emerald-50'
                              : 'text-amber-600 hover:bg-amber-50'
                          }`}
                          title={isInactive ? 'Reactivar usuario' : 'Inactivar usuario'}
                        >
                          {isInactive ? (
                            <Power className="w-3.5 h-3.5" />
                          ) : (
                            <PowerOff className="w-3.5 h-3.5" />
                          )}
                        </button>

                        {/* Delete Button */}
                        <button
                          onClick={() => handleDelete(instructor)}
                          className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                          title="Eliminar usuario"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
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
                      {instructor.phone && (
                        <div className="flex items-center space-x-2">
                          <Phone className="w-3.5 h-3.5 text-slate-400" />
                          <span>{instructor.phone}</span>
                        </div>
                      )}
                      {instructor.email && (
                        <div className="flex items-center space-x-2">
                          <Mail className="w-3.5 h-3.5 text-slate-400" />
                          <span className="truncate">{instructor.email}</span>
                        </div>
                      )}
                    </div>

                    {/* Permissions list summary */}
                    <div className="border-t border-slate-100 pt-3 mb-4">
                      <div className="flex items-center space-x-1 text-[11px] font-bold text-slate-400 mb-2">
                        <ShieldCheck className="w-3.5 h-3.5 text-brand-600" />
                        <span>Permisos Asignados</span>
                      </div>
                      <div className="grid grid-cols-2 gap-1 text-[10px] text-slate-600">
                        <div className="flex items-center space-x-1">
                          <CheckCircle2
                            className={`w-3 h-3 ${
                              instructor.permissions?.view_all_students
                                ? 'text-emerald-500'
                                : 'text-slate-300'
                            }`}
                          />
                          <span>Ver alumnos</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <CheckCircle2
                            className={`w-3 h-3 ${
                              instructor.permissions?.manage_student_credits
                                ? 'text-emerald-500'
                                : 'text-slate-300'
                            }`}
                          />
                          <span>Modificar créditos</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <CheckCircle2
                            className={`w-3 h-3 ${
                              instructor.permissions?.view_all_classes
                                ? 'text-emerald-500'
                                : 'text-slate-300'
                            }`}
                          />
                          <span>Todas las clases</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <CheckCircle2
                            className={`w-3 h-3 ${
                              instructor.permissions?.create_students
                                ? 'text-emerald-500'
                                : 'text-slate-300'
                            }`}
                          />
                          <span>Crear alumnos</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Assigned Classes info */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                    <div className="flex items-center space-x-1.5">
                      <Calendar className="w-3.5 h-3.5 text-purple-600" />
                      <span className="font-semibold">{assignedClasses.length} clases asignadas</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>

      {/* Add / Edit Instructor Modal */}
      {showAddModal && (
        <AddInstructorModal
          instructorToEdit={instructorToEdit}
          onClose={() => {
            setShowAddModal(false);
            setInstructorToEdit(null);
          }}
        />
      )}

      {/* Global Confirm Dialog */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title={confirmDialog.title}
        message={confirmDialog.message}
        confirmText={confirmDialog.confirmText}
        variant={confirmDialog.variant}
        onConfirm={confirmDialog.onConfirm}
        onCancel={() => setConfirmDialog((prev) => ({ ...prev, isOpen: false }))}
      />

      {/* Help Drawer */}
      <ModuleHelpDrawer
        isOpen={showHelp}
        onClose={() => setShowHelp(false)}
        moduleId="instructors"
      />

    </div>
  );
};
