import React, { useState } from 'react';
import {
  Users,
  Search,
  Filter,
  UserPlus,
  Phone,
  MessageCircle,
  MoreVertical,
  CheckCircle,
  AlertCircle,
  FileText,
  Clock,
  HelpCircle,
  ArrowLeft,
  DollarSign,
  Receipt,
  Edit2,
  Trash2
} from 'lucide-react';
import { useStudioStore } from '../../store/studioStore';
import { Profile } from '../../types';
import { StudentApprovalTab } from './StudentApprovalTab';
import { StudentDetailDrawer } from './StudentDetailDrawer';
import { AddStudentModal } from './AddStudentModal';
import { EditStudentModal } from './EditStudentModal';
import { ConfirmDialog } from '../common/ConfirmDialog';
import { ModuleHelpDrawer } from '../common/ModuleHelpDrawer';
import { NewTransactionModal } from '../finance/NewTransactionModal';
import { openWhatsApp } from '../../utils/whatsapp';

interface StudentsViewProps {
  onNavigate?: (view: string) => void;
}

export const StudentsView: React.FC<StudentsViewProps> = ({ onNavigate }) => {
  const { profiles, studio, deleteStudent } = useStudioStore();
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'pending' | 'debt' | 'no_credits'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<Profile | null>(null);
  const [studentToEdit, setStudentToEdit] = useState<Profile | null>(null);
  const [studentToDelete, setStudentToDelete] = useState<Profile | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [paymentStudentId, setPaymentStudentId] = useState<string | null>(null);

  const clients = profiles.filter((p) => p.role === 'client');
  const pendingCount = clients.filter((p) => p.status === 'pending_approval').length;
  const debtCount = clients.filter((p) => p.debt_amount > 0).length;

  const filteredClients = clients.filter((student) => {
    // Search query filter
    const fullName = `${student.first_name} ${student.last_name}`.toLowerCase();
    const matchesSearch =
      fullName.includes(searchQuery.toLowerCase()) ||
      student.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.phone.includes(searchQuery);

    if (!matchesSearch) return false;

    // Tab filter
    if (activeTab === 'active') return student.status === 'active';
    if (activeTab === 'pending') return student.status === 'pending_approval';
    if (activeTab === 'debt') return student.debt_amount > 0;
    if (activeTab === 'no_credits') return student.status === 'active' && student.credits_balance <= 0;
    return true;
  });

  return (
    <div className="py-6 sm:py-8 animate-fade-in">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header with Title & Add Student Button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-start space-x-3">
            {onNavigate && (
              <button
                onClick={() => onNavigate('dashboard')}
                className="p-2.5 bg-white border border-[#E8D5B5] hover:bg-[#F4E8D1] text-[#44261B] rounded-2xl shadow-xs transition-colors shrink-0 mt-0.5 cursor-pointer"
                title="Volver al Inicio"
              >
                <ArrowLeft className="w-4 h-4 text-[#44261B]" />
              </button>
            )}
            <div>
              <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-[#A68D74] mb-1">
                <Users className="w-3.5 h-3.5 text-[#5E612B]" />
                <span>Operativa Diaria</span>
              </div>
              <h1 className="text-2xl font-extrabold text-[#44261B] tracking-tight">
                Gestión de Alumnos (CRM)
              </h1>
              <p className="text-xs text-[#A68D74] mt-0.5">
                Administra perfiles, cobros de cuotas, saldos de créditos, deudas y solicitudes
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2.5 self-start sm:self-center">
            <button
              onClick={() => setShowHelp(true)}
              className="inline-flex items-center space-x-1.5 px-3 py-2 bg-white hover:bg-[#F4E8D1] text-[#44261B] border border-[#E8D5B5] rounded-xl text-xs font-bold shadow-xs transition-all cursor-pointer"
              title="Ver guía de uso de Alumnos"
            >
              <HelpCircle className="w-4 h-4 text-[#5E612B]" />
              <span>Ayuda del Módulo</span>
            </button>

            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center space-x-1.5 px-4 py-2 bg-[#5E612B] hover:bg-[#44261B] text-[#F4E8D1] rounded-xl text-xs font-extrabold shadow-sm transition-all cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              <span>Nuevo Alumno</span>
            </button>
          </div>
        </div>

        {/* Tab Filters */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-2 mb-6 text-xs font-bold scrollbar-none">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${
              activeTab === 'all'
                ? 'bg-[#44261B] text-white shadow-sm'
                : 'bg-white text-[#44261B] hover:bg-[#F4E8D1] border border-[#E8D5B5]'
            }`}
          >
            Todos ({clients.length})
          </button>

          <button
            onClick={() => setActiveTab('pending')}
            className={`px-4 py-2 rounded-xl transition-all flex items-center space-x-1.5 cursor-pointer ${
              activeTab === 'pending'
                ? 'bg-[#C18749] text-white shadow-sm'
                : 'bg-white text-[#44261B] hover:bg-[#F4E8D1] border border-[#E8D5B5]'
            }`}
          >
            <span>Solicitudes Pendientes</span>
            {pendingCount > 0 && (
              <span className="bg-[#F4E8D1] text-[#44261B] text-[10px] font-extrabold px-1.5 py-0.2 rounded-full">
                {pendingCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('active')}
            className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${
              activeTab === 'active'
                ? 'bg-[#5E612B] text-[#F4E8D1] shadow-sm'
                : 'bg-white text-[#44261B] hover:bg-[#F4E8D1] border border-[#E8D5B5]'
            }`}
          >
            Activos ({clients.filter((c) => c.status === 'active').length})
          </button>

          <button
            onClick={() => setActiveTab('debt')}
            className={`px-4 py-2 rounded-xl transition-all flex items-center space-x-1.5 cursor-pointer ${
              activeTab === 'debt'
                ? 'bg-[#B74E2A] text-white shadow-sm'
                : 'bg-white text-[#44261B] hover:bg-[#F4E8D1] border border-[#E8D5B5]'
            }`}
          >
            <span>Con Deuda / Pendientes</span>
            {debtCount > 0 && (
              <span className="bg-[#FAF8F5] text-[#B74E2A] text-[10px] font-extrabold px-1.5 py-0.2 rounded-full">
                {debtCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('no_credits')}
            className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${
              activeTab === 'no_credits'
                ? 'bg-[#A68D74] text-white shadow-sm'
                : 'bg-white text-[#44261B] hover:bg-[#F4E8D1] border border-[#E8D5B5]'
            }`}
          >
            Sin Créditos
          </button>
        </div>

        {/* Pending Approval Tab Active */}
        {activeTab === 'pending' ? (
          <StudentApprovalTab
            pendingStudents={clients.filter((c) => c.status === 'pending_approval')}
            onSelectStudent={(stu) => setSelectedStudent(stu)}
          />
        ) : (
          /* Normal Students Table & Search */
          <div className="bg-white rounded-3xl border border-[#E8D5B5] shadow-soft overflow-hidden">
            
            {/* Search Bar */}
            <div className="p-4 sm:p-5 border-b border-[#E8D5B5] flex items-center justify-between gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-[#A68D74] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Buscar alumno por nombre, email o teléfono..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-[#FAF8F5] border border-[#E8D5B5] rounded-xl text-xs font-medium text-[#44261B] focus:outline-none focus:ring-2 focus:ring-[#5E612B]"
                />
              </div>

              <span className="text-xs text-[#A68D74] font-medium hidden sm:block">
                Mostrando <strong className="text-[#44261B]">{filteredClients.length}</strong> alumnos
              </span>
            </div>

            {/* Students Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAF8F5] text-[#A68D74] font-bold uppercase text-[10px] tracking-wider border-b border-[#E8D5B5]">
                  <tr>
                    <th className="px-6 py-3.5">Alumno</th>
                    <th className="px-6 py-3.5">Contacto / WhatsApp</th>
                    <th className="px-6 py-3.5">Estado</th>
                    <th className="px-6 py-3.5">Créditos & Cuenta</th>
                    <th className="px-6 py-3.5">Ficha Médica</th>
                    <th className="px-6 py-3.5 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E8D5B5]/60 font-medium text-[#44261B]">
                  {filteredClients.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-[#A68D74]">
                        No se encontraron alumnos con los criterios seleccionados.
                      </td>
                    </tr>
                  ) : (
                    filteredClients.map((student) => (
                      <tr
                        key={student.id}
                        onClick={() => setSelectedStudent(student)}
                        className="hover:bg-[#FAF8F5]/90 transition-colors cursor-pointer group"
                      >
                        {/* Alumno Info */}
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-9 h-9 rounded-full bg-[#F4E8D1] border border-[#E8D5B5] text-[#5E612B] font-bold text-xs flex items-center justify-center group-hover:scale-105 transition-transform overflow-hidden">
                              {student.avatar_url ? (
                                <img src={student.avatar_url} alt="" className="w-full h-full object-cover" />
                              ) : (
                                <span>{student.first_name[0]}{student.last_name[0]}</span>
                              )}
                            </div>
                            <div>
                              <span className="font-extrabold text-[#44261B] block group-hover:text-[#5E612B] transition-colors">
                                {student.first_name} {student.last_name}
                              </span>
                              <span className="text-[11px] text-[#A68D74]">{student.email}</span>
                            </div>
                          </div>
                        </td>

                        {/* Phone */}
                        <td className="px-6 py-4 font-semibold text-[#44261B]">
                          {student.phone}
                        </td>

                        {/* Status */}
                        <td className="px-6 py-4">
                          <span
                            className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase border ${
                              student.status === 'active'
                                ? 'bg-[#eaede7] text-[#5E612B] border-[#cadbcd]'
                                : student.status === 'pending_approval'
                                ? 'bg-[#F4E8D1] text-[#C18749] border-[#E8D5B5]'
                                : 'bg-[#FAF8F5] text-[#A68D74] border-[#E8D5B5]'
                            }`}
                          >
                            {student.status === 'active' ? 'Activo' : student.status === 'pending_approval' ? 'Pendiente' : student.status}
                          </span>
                        </td>

                        {/* Credits & Account State */}
                        <td className="px-6 py-4">
                          <div>
                            <span
                              className={`font-extrabold text-sm block leading-tight ${
                                student.credits_balance > 0 ? 'text-[#5E612B]' : 'text-[#A68D74]'
                              }`}
                            >
                              {student.credits_balance === 999 ? 'Pase Libre' : `${student.credits_balance} clases`}
                            </span>
                            {student.debt_amount > 0 ? (
                              <span className="inline-flex items-center space-x-1 text-[10px] font-bold text-[#B74E2A] bg-[#B74E2A]/10 border border-[#B74E2A]/30 px-1.5 py-0.2 rounded-md mt-0.5">
                                <AlertCircle className="w-3 h-3" />
                                <span>Deuda: -${student.debt_amount.toLocaleString('es-AR')}</span>
                              </span>
                            ) : (
                              <span className="text-[10px] font-bold text-[#5E612B] mt-0.5 block">
                                ✓ Al día
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Medical */}
                        <td className="px-6 py-4">
                          <span
                            className={`text-[11px] font-bold ${
                              student.has_medical_certificate
                                ? 'text-[#5E612B]'
                                : student.medical_notes
                                ? 'text-[#B74E2A]'
                                : 'text-[#A68D74]'
                            }`}
                          >
                            {student.has_medical_certificate ? '✅ Apto al día' : student.medical_notes ? '⚠️ Con nota médica' : 'Sin apto'}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-end space-x-1.5">
                            {/* Registrar Cobro / Pago Directo */}
                            <button
                              onClick={() => setPaymentStudentId(student.id)}
                              className="px-2.5 py-1.5 bg-[#5E612B] hover:bg-[#44261B] text-[#F4E8D1] font-extrabold text-[11px] rounded-xl shadow-2xs transition-all flex items-center space-x-1 cursor-pointer"
                              title="Registrar cobro / ingreso"
                            >
                              <DollarSign className="w-3.5 h-3.5" />
                              <span>Cobrar</span>
                            </button>

                            {/* WhatsApp directo */}
                            <button
                              onClick={() => {
                                const msg = `Hola ${student.first_name}, te escribimos de ${studio.name}.`;
                                openWhatsApp(student.phone, msg);
                              }}
                              className="p-1.5 text-[#5E612B] hover:bg-[#F4E8D1] rounded-xl transition-colors border border-[#E8D5B5] cursor-pointer"
                              title="WhatsApp directo"
                            >
                              <MessageCircle className="w-4 h-4" />
                            </button>

                            {/* Editar Alumno */}
                            <button
                              onClick={() => setStudentToEdit(student)}
                              className="p-1.5 text-[#A68D74] hover:text-[#44261B] hover:bg-[#F4E8D1] rounded-xl transition-colors border border-[#E8D5B5] cursor-pointer"
                              title="Editar datos del alumno"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>

                            {/* Eliminar Alumno */}
                            <button
                              onClick={() => setStudentToDelete(student)}
                              className="p-1.5 text-[#A68D74] hover:text-[#B74E2A] hover:bg-[#B74E2A]/10 rounded-xl transition-colors border border-[#E8D5B5] cursor-pointer"
                              title="Eliminar alumno"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>

                            {/* Ver Ficha Lateral */}
                            <button
                              onClick={() => setSelectedStudent(student)}
                              className="px-2.5 py-1.5 bg-[#FAF8F5] hover:bg-[#F4E8D1] text-[#44261B] border border-[#E8D5B5] font-bold text-[11px] rounded-xl transition-colors cursor-pointer"
                            >
                              Ver Ficha
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

          </div>
        )}

        {/* Modals & Drawers */}
        {selectedStudent && (
          <StudentDetailDrawer
            student={selectedStudent}
            onClose={() => setSelectedStudent(null)}
            onOpenPayment={(stuId) => setPaymentStudentId(stuId)}
            onEditStudent={(stu) => setStudentToEdit(stu)}
            onDeleteStudent={(stu) => setStudentToDelete(stu)}
          />
        )}

        {studentToEdit && (
          <EditStudentModal
            student={studentToEdit}
            onClose={() => {
              setStudentToEdit(null);
              // Update selectedStudent if it was currently open
              if (selectedStudent && selectedStudent.id === studentToEdit.id) {
                const refreshed = profiles.find((p) => p.id === studentToEdit.id);
                if (refreshed) setSelectedStudent(refreshed);
              }
            }}
          />
        )}

        {studentToDelete && (
          <ConfirmDialog
            isOpen={!!studentToDelete}
            title="¿Eliminar Alumno del Sistema?"
            message={`¿Estás seguro de que deseas eliminar permanentemente a "${studentToDelete.first_name} ${studentToDelete.last_name}"? Se borrará su perfil, saldo de créditos y reservas tanto de la aplicación como de la base de datos de Supabase.`}
            confirmText="Sí, Eliminar Alumno"
            cancelText="Cancelar"
            variant="danger"
            onConfirm={() => {
              deleteStudent(studentToDelete.id);
              if (selectedStudent?.id === studentToDelete.id) {
                setSelectedStudent(null);
              }
              setStudentToDelete(null);
            }}
            onCancel={() => setStudentToDelete(null)}
          />
        )}

        {showAddModal && (
          <AddStudentModal onClose={() => setShowAddModal(false)} />
        )}

        {/* Direct Payment / Cobro Modal */}
        {paymentStudentId && (
          <NewTransactionModal
            isOpen={!!paymentStudentId}
            onClose={() => setPaymentStudentId(null)}
            defaultType="income"
            preselectedStudentId={paymentStudentId}
          />
        )}

        {/* Auto-Help Module Drawer */}
        <ModuleHelpDrawer
          isOpen={showHelp}
          moduleId="students"
          onClose={() => setShowHelp(false)}
        />

      </div>
    </div>
  );
};
