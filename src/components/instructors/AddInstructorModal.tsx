import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  X,
  Info,
  Shield,
  Eye,
  EyeOff,
  Phone,
  Plus,
  ChevronDown,
  MessageCircle,
  Check,
  Power,
  PowerOff
} from 'lucide-react';
import { useStudioStore } from '../../store/studioStore';
import { openWhatsApp } from '../../utils/whatsapp';
import { Profile } from '../../types';
import { ConfirmDialog } from '../common/ConfirmDialog';

interface AddInstructorModalProps {
  instructorToEdit?: Profile | null;
  onClose: () => void;
}

export const AddInstructorModal: React.FC<AddInstructorModalProps> = ({
  instructorToEdit,
  onClose,
}) => {
  const { addInstructor, updateInstructor, studio } = useStudioStore();
  const isEditing = !!instructorToEdit;

  const [email, setEmail] = useState(instructorToEdit?.email || '');
  const [firstName, setFirstName] = useState(instructorToEdit?.first_name || '');
  const [lastName, setLastName] = useState(instructorToEdit?.last_name || '');
  const [phone, setPhone] = useState(instructorToEdit?.phone || '+54 9 11 ');
  const [password, setPassword] = useState(isEditing ? '••••••••••' : '');
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState<'active' | 'inactive'>(instructorToEdit?.status === 'inactive' ? 'inactive' : 'active');

  // Permissions
  const [showPermissions, setShowPermissions] = useState(true);
  const [viewAllStudents, setViewAllStudents] = useState(
    !!instructorToEdit?.permissions?.view_all_students
  );
  const [manageCredits, setManageCredits] = useState(
    !!instructorToEdit?.permissions?.manage_student_credits
  );
  const [viewAllClasses, setViewAllClasses] = useState(
    !!instructorToEdit?.permissions?.view_all_classes
  );
  const [createNewStudents, setCreateNewStudents] = useState(
    !!instructorToEdit?.permissions?.create_students
  );

  // State for Confirmation Dialog
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const handleCreateStudentsChange = (checked: boolean) => {
    setCreateNewStudents(checked);
    if (checked) {
      setViewAllStudents(true); // Auto-enable view all students
    }
  };

  const handleSendSuggestionWhatsApp = () => {
    openWhatsApp(
      studio.phone || '5491155550199',
      'Hola! Me gustaría sugerir un nuevo permiso adicional para los profesores en SERMOA App.'
    );
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !firstName || !lastName || !phone) {
      alert('Por favor completa todos los campos obligatorios (*).');
      return;
    }

    // Open standardized confirmation modal
    setShowConfirmModal(true);
  };

  const handleExecuteSave = () => {
    setShowConfirmModal(false);

    if (isEditing && instructorToEdit) {
      updateInstructor(instructorToEdit.id, {
        first_name: firstName,
        last_name: lastName,
        email,
        phone,
        status,
        permissions: {
          view_all_students: viewAllStudents || createNewStudents,
          manage_student_credits: manageCredits,
          view_all_classes: viewAllClasses,
          create_students: createNewStudents,
        },
      });
    } else {
      addInstructor({
        first_name: firstName,
        last_name: lastName,
        email,
        phone,
        password,
        permissions: {
          view_all_students: viewAllStudents || createNewStudents,
          manage_student_credits: manageCredits,
          view_all_classes: viewAllClasses,
          create_students: createNewStudents,
        },
      });
    }

    onClose();
  };

  return createPortal(
    <>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in overflow-y-auto">
        <div className="bg-white rounded-3xl max-w-xl w-full max-h-[88vh] shadow-2xl border border-slate-100 flex flex-col my-auto overflow-hidden text-left">
          
          {/* Modal Header */}
          <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
            <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
              {isEditing ? 'Editar Profesor' : 'Nuevo Profesor'}
            </h3>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Body Form with internal scroll and fixed footer */}
          <form onSubmit={handleFormSubmit} className="flex flex-col flex-1 overflow-hidden min-h-0">
            <div className="p-6 space-y-5 overflow-y-auto flex-1 min-h-0 text-xs">
            
            {/* Callout / Info Banner */}
            <div className="p-4 bg-blue-50/80 border border-blue-100 rounded-2xl flex items-start space-x-3.5">
              <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 shadow-xs">
                <span>i</span>
              </div>
              <div>
                <h4 className="font-extrabold text-slate-900 text-xs mb-1">
                  Acceso al Panel de Profesores
                </h4>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  Este registro habilita el acceso exclusivo al Portal del Profesor. Utilizando las credenciales ingresadas, el profesor podrá visualizar su agenda asignada, registrar la asistencia de sus alumnos y gestionar las rutinas de entrenamiento.
                </p>
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block font-bold text-slate-700 mb-1.5">
                <span className="text-rose-500 mr-1">*</span>Email
              </label>
              <input
                type="email"
                required
                placeholder="ejemplo@sermoa.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-blue-50/30 border border-blue-100 rounded-xl text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            {/* Nombre & Apellido */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block font-bold text-slate-700 mb-1.5">
                  <span className="text-rose-500 mr-1">*</span>Nombre
                </label>
                <input
                  type="text"
                  required
                  placeholder="Juan"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1.5">
                  <span className="text-rose-500 mr-1">*</span>Apellido
                </label>
                <input
                  type="text"
                  required
                  placeholder="Pérez"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
            </div>

            {/* Teléfono */}
            <div>
              <label className="block font-bold text-slate-700 mb-1.5">
                <span className="text-rose-500 mr-1">*</span>Teléfono
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center space-x-1 text-slate-400 pointer-events-none">
                  <span className="text-base">🇦🇷</span>
                  <ChevronDown className="w-3 h-3" />
                </div>
                <input
                  type="tel"
                  required
                  placeholder="+54 9 11 1234 5678"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-12 pr-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
            </div>

            {/* Contraseña */}
            {!isEditing && (
              <div>
                <label className="block font-bold text-slate-700 mb-1.5">
                  <span className="text-rose-500 mr-1">*</span>Contraseña
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required={!isEditing}
                    placeholder="••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-blue-50/30 border border-blue-100 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            )}

            {/* Estado del Profesor (si está editando) */}
            {isEditing && (
              <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-2xl flex items-center justify-between">
                <div>
                  <h4 className="font-extrabold text-slate-800 text-xs">Estado de la Cuenta</h4>
                  <p className="text-[11px] text-slate-500">
                    {status === 'active' ? 'El profesor puede acceder y dictar clases' : 'El profesor está temporalmente inactivado'}
                  </p>
                </div>

                <div className="flex items-center space-x-1.5 bg-white p-1 rounded-xl border border-slate-200">
                  <button
                    type="button"
                    onClick={() => setStatus('active')}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-extrabold transition-all flex items-center space-x-1 ${
                      status === 'active'
                        ? 'bg-emerald-600 text-white shadow-2xs'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    <Power className="w-3 h-3" />
                    <span>Activo</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setStatus('inactive')}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-extrabold transition-all flex items-center space-x-1 ${
                      status === 'inactive'
                        ? 'bg-amber-600 text-white shadow-2xs'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    <PowerOff className="w-3 h-3" />
                    <span>Inactivo</span>
                  </button>
                </div>
              </div>
            )}

            {/* Collapsible: Permisos Adicionales (Opcional) */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setShowPermissions(!showPermissions)}
                className="w-full flex items-center justify-between text-left py-2 font-extrabold text-slate-900 text-xs group"
              >
                <span className="flex items-center space-x-2">
                  <Shield className="w-4 h-4 text-purple-600" />
                  <span>Permisos Adicionales (Opcional)</span>
                </span>
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${showPermissions ? 'rotate-180' : ''}`} />
              </button>

              {showPermissions && (
                <div className="mt-2.5 space-y-3.5 animate-fade-in">
                  <p className="text-slate-500 text-[11px]">
                    Configura las acciones especiales que este profesor puede realizar.
                  </p>

                  {/* Permission 1: Ver todos los alumnos */}
                  <label className="flex items-start space-x-3 cursor-pointer p-2.5 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-200/60">
                    <input
                      type="checkbox"
                      checked={viewAllStudents}
                      onChange={(e) => setViewAllStudents(e.target.checked)}
                      className="mt-0.5 rounded text-brand-olive focus:ring-brand-olive w-4 h-4"
                    />
                    <div>
                      <span className="font-extrabold text-slate-800 text-xs block">
                        Ver todos los alumnos del estudio
                      </span>
                      <span className="text-[11px] text-slate-500 block leading-tight mt-0.5">
                        Permite al profesor acceder a la lista completa de alumnos, independientemente de si están en sus clases o no.
                      </span>
                    </div>
                  </label>

                  {/* Permission 2: Gestionar créditos */}
                  <label className="flex items-start space-x-3 cursor-pointer p-2.5 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-200/60">
                    <input
                      type="checkbox"
                      checked={manageCredits}
                      onChange={(e) => setManageCredits(e.target.checked)}
                      className="mt-0.5 rounded text-brand-olive focus:ring-brand-olive w-4 h-4"
                    />
                    <div>
                      <span className="font-extrabold text-slate-800 text-xs block">
                        Gestionar créditos de alumnos
                      </span>
                      <span className="text-[11px] text-slate-500 block leading-tight mt-0.5">
                        Otorga la capacidad de recargar o ajustar manualmente los créditos de los alumnos. El historial de movimientos quedará registrado.
                      </span>
                    </div>
                  </label>

                  {/* Permission 3: Ver todas las clases y registrar asistencia */}
                  <label className="flex items-start space-x-3 cursor-pointer p-2.5 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-200/60">
                    <input
                      type="checkbox"
                      checked={viewAllClasses}
                      onChange={(e) => setViewAllClasses(e.target.checked)}
                      className="mt-0.5 rounded text-brand-olive focus:ring-brand-olive w-4 h-4"
                    />
                    <div>
                      <span className="font-extrabold text-slate-800 text-xs block">
                        Ver todas las clases y registrar asistencia
                      </span>
                      <span className="text-[11px] text-slate-500 block leading-tight mt-0.5">
                        De forma predeterminada, el profesor solo ve las clases en las que está asignado y solo puede registrar asistencia en esas sesiones. Con esta opción activa, el profesor podrá ver todas las clases del estudio y registrar asistencia en cualquier clase.
                      </span>
                    </div>
                  </label>

                  {/* Permission 4: Crear nuevos alumnos */}
                  <label className="flex items-start space-x-3 cursor-pointer p-2.5 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-200/60">
                    <input
                      type="checkbox"
                      checked={createNewStudents}
                      onChange={(e) => handleCreateStudentsChange(e.target.checked)}
                      className="mt-0.5 rounded text-brand-olive focus:ring-brand-olive w-4 h-4"
                    />
                    <div>
                      <span className="font-extrabold text-slate-800 text-xs block">
                        Crear nuevos alumnos
                      </span>
                      <span className="text-[11px] text-slate-500 block leading-tight mt-0.5">
                        Permite al profesor registrar nuevos alumnos en el estudio directamente desde su panel. Activa automáticamente “Ver todos los alumnos del estudio” para que el alumno creado sea visible de inmediato.
                      </span>
                    </div>
                  </label>

                  {/* WhatsApp Suggestion Box */}
                  <div className="p-3.5 bg-blue-50/70 border border-blue-100 rounded-2xl flex items-start space-x-3 mt-4">
                    <div className="w-6 h-6 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 mt-0.5">
                      <Plus className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <h5 className="font-bold text-slate-900 text-xs">
                        ¿Necesitas más permisos?
                      </h5>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Estamos trabajando en nuevas acciones. Si tienes sugerencias, cuéntanoslo aquí:
                      </p>
                      <button
                        type="button"
                        onClick={handleSendSuggestionWhatsApp}
                        className="mt-1.5 text-blue-600 hover:text-blue-700 font-extrabold text-[11px] underline flex items-center space-x-1"
                      >
                        <span>Enviar sugerencia por WhatsApp</span>
                      </button>
                    </div>
                  </div>

                </div>
              )}
            </div>

            </div>

            {/* Pinned Modal Actions Footer */}
            <div className="p-4 sm:p-5 border-t border-slate-100 bg-slate-50 flex items-center justify-end space-x-3 shrink-0">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white text-xs font-extrabold shadow-md shadow-purple-700/20 transition-all"
              >
                {isEditing ? 'Guardar Cambios' : 'Crear'}
              </button>
            </div>

          </form>

        </div>
      </div>

      {/* Standardized Confirm Dialog for Modification / Creation */}
      <ConfirmDialog
        isOpen={showConfirmModal}
        title={isEditing ? '¿Confirmar modificación del profesor?' : '¿Confirmar creación de nuevo profesor?'}
        message={
          isEditing
            ? `Se actualizarán los datos y permisos de ${firstName} ${lastName} en todo el sistema.`
            : `Se creará el acceso para ${firstName} ${lastName} con el correo ${email}.`
        }
        confirmText={isEditing ? 'Confirmar y Guardar' : 'Confirmar y Crear'}
        cancelText="Revisar"
        variant="success"
        onConfirm={handleExecuteSave}
        onCancel={() => setShowConfirmModal(false)}
      />
    </>,
    document.body
  );
};
