import React, { useState, useEffect } from 'react';
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
  Trash2,
  ChevronLeft,
  ChevronRight,
  X
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

const ITEMS_PER_PAGE = 10;

export const StudentsView: React.FC<StudentsViewProps> = ({ onNavigate }) => {
  const { profiles, studio, deleteStudent } = useStudioStore();
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'pending' | 'no_credits'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedStudent, setSelectedStudent] = useState<Profile | null>(null);
  const [studentToEdit, setStudentToEdit] = useState<Profile | null>(null);
  const [studentToDelete, setStudentToDelete] = useState<Profile | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [paymentStudentId, setPaymentStudentId] = useState<string | null>(null);

  const clients = profiles.filter((p) => p.role === 'client');
  const pendingCount = clients.filter((p) => p.status === 'pending_approval').length;
  const activeCount = clients.filter((c) => c.status === 'active').length;
  const noCreditsCount = clients.filter((p) => p.status === 'active' && (p.credits_balance ?? 0) <= 0).length;

  // Reset page when tab or search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, activeTab]);

  // Comprehensive search across any concept
  const filteredClients = clients.filter((student) => {
    // 1. Tab filter
    if (activeTab === 'active' && student.status !== 'active') return false;
    if (activeTab === 'pending' && student.status !== 'pending_approval') return false;
    if (activeTab === 'no_credits' && !(student.status === 'active' && (student.credits_balance ?? 0) <= 0)) return false;

    // 2. Search query filter
    const q = searchQuery.trim().toLowerCase();
    if (!q) return true;

    const fullName = `${student.first_name || ''} ${student.last_name || ''}`.toLowerCase();
    const email = (student.email || '').toLowerCase();
    const phone = (student.phone || '');
    const idNumber = (student.id_number || '').toLowerCase();
    const emergencyName = (student.emergency_contact_name || '').toLowerCase();
    const emergencyPhone = (student.emergency_contact_phone || '');
    const notes = (student.notes || '').toLowerCase();
    const medicalNotes = (student.medical_notes || '').toLowerCase();
    const statusText = student.status === 'active' ? 'activo' : student.status === 'pending_approval' ? 'pendiente' : (student.status || '');
    const creditsText = student.credits_balance === 999 ? 'pase libre' : `${student.credits_balance ?? 0} clases`;
    const medicalCertText = student.has_medical_certificate ? 'apto al dia certificado' : 'sin apto';

    return (
      fullName.includes(q) ||
      email.includes(q) ||
      phone.includes(q) ||
      idNumber.includes(q) ||
      emergencyName.includes(q) ||
      emergencyPhone.includes(q) ||
      notes.includes(q) ||
      medicalNotes.includes(q) ||
      statusText.toLowerCase().includes(q) ||
      creditsText.toLowerCase().includes(q) ||
      medicalCertText.toLowerCase().includes(q)
    );
  });

  // Pagination calculation
  const totalPages = Math.ceil(filteredClients.length / ITEMS_PER_PAGE) || 1;
  const paginatedClients = filteredClients.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="py-6 sm:py-8 animate-fade-in">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">

        {/* ============================================================== */}
        {/* CABECERA UNIFICADA & COHERENTE (Título, Acciones y Pestañas) */}
        {/* ============================================================== */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#E8D5B5] shadow-soft space-y-4">
          
          {/* Fila 1: Título a la izquierda, Botones de acción a la derecha */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start space-x-3">
              {onNavigate && (
                <button
                  onClick={() => onNavigate('dashboard')}
                  className="p-2.5 bg-[#FAF8F5] border border-[#E8D5B5] hover:bg-[#F4E8D1] text-[#44261B] rounded-2xl shadow-2xs transition-colors shrink-0 mt-0.5 cursor-pointer"
                  title="Volver al Inicio"
                >
                  <ArrowLeft className="w-4 h-4 text-[#44261B]" />
                </button>
              )}
              <div>
                <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-[#A68D74] mb-0.5">
                  <Users className="w-3.5 h-3.5 text-[#5E612B]" />
                  <span>Operativa Diaria</span>
                </div>
                <h1 className="text-xl sm:text-2xl font-black text-[#44261B] tracking-tight">
                  Gestión de Alumnos (CRM)
                </h1>
                <p className="text-xs text-[#A68D74] mt-0.5">
                  Administra perfiles, cobros de packs, clases activas y solicitudes médicas
                </p>
              </div>
            </div>

            {/* Botones de acción alineados */}
            <div className="flex items-center space-x-2 self-start sm:self-center shrink-0">
              <button
                onClick={() => setShowHelp(true)}
                className="inline-flex items-center space-x-1.5 px-3.5 py-2.5 bg-[#FAF8F5] hover:bg-[#F4E8D1] text-[#44261B] border border-[#E8D5B5] rounded-xl text-xs font-bold shadow-2xs transition-all cursor-pointer"
                title="Ver guía de uso de Alumnos"
              >
                <HelpCircle className="w-4 h-4 text-[#5E612B]" />
                <span>Ayuda</span>
              </button>

              <button
                onClick={() => setShowAddModal(true)}
                className="inline-flex items-center space-x-2 px-4 py-2.5 bg-[#5E612B] hover:bg-[#44261B] text-[#F4E8D1] rounded-xl text-xs font-black shadow-xs transition-all cursor-pointer"
              >
                <UserPlus className="w-4 h-4" />
                <span>Nuevo Alumno</span>
              </button>
            </div>
          </div>

          {/* Fila 2: Pestañas de filtrado (Segmented Control) */}
          <div className="pt-2 border-t border-[#E8D5B5]/60 flex items-center gap-2 overflow-x-auto scrollbar-none pb-1">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
                activeTab === 'all'
                  ? 'bg-[#44261B] text-white shadow-xs'
                  : 'bg-[#FAF8F5] text-[#44261B] hover:bg-[#F4E8D1] border border-[#E8D5B5]'
              }`}
            >
              Todos ({clients.length})
            </button>

            <button
              onClick={() => setActiveTab('pending')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer shrink-0 ${
                activeTab === 'pending'
                  ? 'bg-[#C18749] text-white shadow-xs'
                  : 'bg-[#FAF8F5] text-[#44261B] hover:bg-[#F4E8D1] border border-[#E8D5B5]'
              }`}
            >
              <span>Solicitudes Pendientes</span>
              {pendingCount > 0 && (
                <span className="bg-[#FAF8F5] text-[#C18749] text-[10px] font-black px-1.5 py-0.2 rounded-full border border-[#C18749]/40">
                  {pendingCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('active')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
                activeTab === 'active'
                  ? 'bg-[#5E612B] text-[#F4E8D1] shadow-xs'
                  : 'bg-[#FAF8F5] text-[#44261B] hover:bg-[#F4E8D1] border border-[#E8D5B5]'
              }`}
            >
              Activos ({activeCount})
            </button>

            <button
              onClick={() => setActiveTab('no_credits')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer shrink-0 ${
                activeTab === 'no_credits'
                  ? 'bg-[#A68D74] text-white shadow-xs'
                  : 'bg-[#FAF8F5] text-[#44261B] hover:bg-[#F4E8D1] border border-[#E8D5B5]'
              }`}
            >
              <span>Sin Clases Activas</span>
              {noCreditsCount > 0 && (
                <span className="bg-[#FAF8F5] text-[#A68D74] text-[10px] font-black px-1.5 py-0.2 rounded-full border border-[#A68D74]/40">
                  {noCreditsCount}
                </span>
              )}
            </button>
          </div>

        </div>

        {/* ============================================================== */}
        {/* CONTENIDO PRINCIPAL: SOLICITUDES PENDIENTES O TABLA CON PAGINACIÓN */}
        {/* ============================================================== */}
        {activeTab === 'pending' ? (
          <StudentApprovalTab
            pendingStudents={clients.filter((c) => c.status === 'pending_approval')}
            onSelectStudent={(stu) => setSelectedStudent(stu)}
          />
        ) : (
          <div className="bg-white rounded-3xl border border-[#E8D5B5] shadow-soft overflow-hidden flex flex-col">

            {/* Barra de búsqueda integrada y contador */}
            <div className="p-4 sm:p-5 border-b border-[#E8D5B5] flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#FAF8F5]/40">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-[#A68D74] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Buscar por nombre, email, teléfono, DNI, apto o estado..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-9 py-2.5 bg-white border border-[#E8D5B5] rounded-xl text-xs font-medium text-[#44261B] placeholder-[#A68D74]/70 focus:outline-none focus:ring-2 focus:ring-[#5E612B] transition-all shadow-2xs"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A68D74] hover:text-[#44261B] p-0.5"
                    title="Limpiar búsqueda"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <div className="flex items-center space-x-2 text-xs text-[#A68D74]">
                <span>
                  Mostrando <strong className="text-[#44261B]">{filteredClients.length}</strong> alumnos
                </span>
                {totalPages > 1 && (
                  <span className="hidden sm:inline text-[#A68D74]/60">• Pág. {currentPage} de {totalPages}</span>
                )}
              </div>
            </div>

            {/* TABLA CON SCROLL INTERNO Y CABECERA INMOVILIZADA (Sticky Header) */}
            <div className="overflow-x-auto overflow-y-auto max-h-[580px] relative scrollbar-thin">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="sticky top-0 z-10 bg-[#FAF8F5] text-[#A68D74] font-black uppercase text-[10px] tracking-wider border-b border-[#E8D5B5] shadow-xs">
                  <tr>
                    <th className="px-6 py-3.5 bg-[#FAF8F5]">Alumno</th>
                    <th className="px-6 py-3.5 bg-[#FAF8F5]">Contacto / WhatsApp</th>
                    <th className="px-6 py-3.5 bg-[#FAF8F5]">Estado</th>
                    <th className="px-6 py-3.5 bg-[#FAF8F5]">Clases Activas (Pagas)</th>
                    <th className="px-6 py-3.5 bg-[#FAF8F5]">Ficha Médica</th>
                    <th className="px-6 py-3.5 bg-[#FAF8F5] text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E8D5B5]/60 font-medium text-[#44261B]">
                  {paginatedClients.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-[#A68D74]">
                        No se encontraron alumnos con los criterios de búsqueda seleccionados.
                      </td>
                    </tr>
                  ) : (
                    paginatedClients.map((student) => (
                      <tr
                        key={student.id}
                        onClick={() => setSelectedStudent(student)}
                        className="hover:bg-[#FAF8F5]/80 transition-colors cursor-pointer group"
                      >
                        {/* Alumno Info */}
                        <td className="px-6 py-3.5">
                          <div className="flex items-center space-x-3">
                            <div className="w-9 h-9 rounded-full bg-[#F4E8D1] border border-[#E8D5B5] text-[#5E612B] font-bold text-xs flex items-center justify-center group-hover:scale-105 transition-transform overflow-hidden shrink-0">
                              {student.avatar_url ? (
                                <img src={student.avatar_url} alt="" className="w-full h-full object-cover" />
                              ) : (
                                <span>{student.first_name[0]}{student.last_name[0]}</span>
                              )}
                            </div>
                            <div className="min-w-0">
                              <span className="font-extrabold text-[#44261B] block group-hover:text-[#5E612B] transition-colors truncate">
                                {student.first_name} {student.last_name}
                              </span>
                              <span className="text-[11px] text-[#A68D74] block truncate">{student.email}</span>
                            </div>
                          </div>
                        </td>

                        {/* Phone */}
                        <td className="px-6 py-3.5 font-semibold text-[#44261B]">
                          {student.phone}
                        </td>

                        {/* Status */}
                        <td className="px-6 py-3.5">
                          <span
                            className={`text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase border ${
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

                        {/* Active Classes & Account State */}
                        <td className="px-6 py-3.5">
                          <div>
                            <span
                              className={`font-black text-xs sm:text-sm block leading-tight ${
                                (student.credits_balance ?? 0) > 0 ? 'text-[#5E612B]' : 'text-[#A68D74]'
                              }`}
                            >
                              {student.credits_balance === 999
                                ? 'Pase Libre'
                                : `${student.credits_balance ?? 0} ${(student.credits_balance ?? 0) === 1 ? 'clase activa' : 'clases activas'}`}
                            </span>
                            {(student.credits_balance ?? 0) > 0 ? (
                              <span className="text-[10px] font-bold text-[#5E612B] mt-0.5 block">
                                ✓ Al día
                              </span>
                            ) : (
                              <span className="text-[10px] font-bold text-[#C18749] mt-0.5 block">
                                Sin clases activas
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Medical */}
                        <td className="px-6 py-3.5">
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
                        <td className="px-6 py-3.5 text-right" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-end space-x-1.5">
                            {/* Registrar Cobro / Pago Directo */}
                            <button
                              onClick={() => setPaymentStudentId(student.id)}
                              className="px-2.5 py-1.5 bg-[#5E612B] hover:bg-[#44261B] text-[#F4E8D1] font-black text-[11px] rounded-xl shadow-2xs transition-all flex items-center space-x-1 cursor-pointer"
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

            {/* CONTROLES DE PAGINACIÓN (Hasta 10 usuarios por página) */}
            {totalPages > 1 && (
              <div className="px-6 py-3.5 bg-[#FAF8F5]/80 border-t border-[#E8D5B5] flex flex-col sm:flex-row items-center justify-between gap-3 select-none">
                <span className="text-xs text-[#A68D74] font-medium">
                  Mostrando <strong className="text-[#44261B]">{(currentPage - 1) * ITEMS_PER_PAGE + 1}</strong> a{' '}
                  <strong className="text-[#44261B]">{Math.min(currentPage * ITEMS_PER_PAGE, filteredClients.length)}</strong> de{' '}
                  <strong className="text-[#44261B]">{filteredClients.length}</strong> alumnos
                </span>

                <div className="flex items-center space-x-1.5">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1.5 bg-white border border-[#E8D5B5] rounded-xl text-xs font-bold text-[#44261B] hover:bg-[#F4E8D1] disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center space-x-1 cursor-pointer"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                    <span>Anterior</span>
                  </button>

                  <div className="flex items-center space-x-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`w-8 h-8 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center justify-center ${
                          currentPage === pageNum
                            ? 'bg-[#5E612B] text-[#F4E8D1] shadow-xs'
                            : 'bg-white border border-[#E8D5B5] text-[#44261B] hover:bg-[#F4E8D1]'
                        }`}
                      >
                        {pageNum}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1.5 bg-white border border-[#E8D5B5] rounded-xl text-xs font-bold text-[#44261B] hover:bg-[#F4E8D1] disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center space-x-1 cursor-pointer"
                  >
                    <span>Siguiente</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

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
