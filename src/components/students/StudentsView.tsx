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
  HelpCircle
} from 'lucide-react';
import { useStudioStore } from '../../store/studioStore';
import { Profile } from '../../types';
import { StudentApprovalTab } from './StudentApprovalTab';
import { StudentDetailDrawer } from './StudentDetailDrawer';
import { AddStudentModal } from './AddStudentModal';
import { ModuleHelpDrawer } from '../common/ModuleHelpDrawer';
import { openWhatsApp } from '../../utils/whatsapp';

export const StudentsView: React.FC = () => {
  const { profiles, studio } = useStudioStore();
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'pending' | 'debt' | 'no_credits'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<Profile | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

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
    <div className="py-6 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header with Title & Add Student Button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
              <Users className="w-3.5 h-3.5 text-blue-600" />
              <span>Operativa Diaria</span>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Gestión de Alumnos (CRM)
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Administra perfiles, saldos de créditos, fichas médicas y solicitudes pendientes
            </p>
          </div>

          <div className="flex items-center space-x-2.5 self-start sm:self-center">
            <button
              onClick={() => setShowHelp(true)}
              className="inline-flex items-center space-x-1.5 px-3 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold shadow-xs transition-all"
              title="Ver guía de uso de Alumnos"
            >
              <HelpCircle className="w-4 h-4 text-blue-600" />
              <span>Ayuda del Módulo</span>
            </button>

            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-extrabold shadow-sm transition-all"
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
            className={`px-4 py-2 rounded-xl transition-all ${
              activeTab === 'all'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
            }`}
          >
            Todos ({clients.length})
          </button>

          <button
            onClick={() => setActiveTab('pending')}
            className={`px-4 py-2 rounded-xl transition-all flex items-center space-x-1.5 ${
              activeTab === 'pending'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
            }`}
          >
            <span>Solicitudes Pendientes</span>
            {pendingCount > 0 && (
              <span className="bg-amber-100 text-amber-900 text-[10px] font-extrabold px-1.5 py-0.2 rounded-full">
                {pendingCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('active')}
            className={`px-4 py-2 rounded-xl transition-all ${
              activeTab === 'active'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
            }`}
          >
            Activos ({clients.filter((c) => c.status === 'active').length})
          </button>

          <button
            onClick={() => setActiveTab('debt')}
            className={`px-4 py-2 rounded-xl transition-all flex items-center space-x-1.5 ${
              activeTab === 'debt'
                ? 'bg-rose-600 text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
            }`}
          >
            <span>Con Deuda ({debtCount})</span>
          </button>

          <button
            onClick={() => setActiveTab('no_credits')}
            className={`px-4 py-2 rounded-xl transition-all ${
              activeTab === 'no_credits'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
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
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-soft overflow-hidden">
            
            {/* Search Bar */}
            <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Buscar alumno por nombre, email o teléfono..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <span className="text-xs text-slate-400 font-medium hidden sm:block">
                Mostrando <strong>{filteredClients.length}</strong> alumnos
              </span>
            </div>

            {/* Students Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50/80 text-slate-400 font-bold uppercase text-[10px] tracking-wider border-b border-slate-100">
                  <tr>
                    <th className="px-6 py-3.5">Alumno</th>
                    <th className="px-6 py-3.5">Contacto / WhatsApp</th>
                    <th className="px-6 py-3.5">Estado</th>
                    <th className="px-6 py-3.5">Créditos</th>
                    <th className="px-6 py-3.5">Ficha Médica</th>
                    <th className="px-6 py-3.5 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {filteredClients.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                        No se encontraron alumnos con los criterios seleccionados.
                      </td>
                    </tr>
                  ) : (
                    filteredClients.map((student) => (
                      <tr
                        key={student.id}
                        onClick={() => setSelectedStudent(student)}
                        className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                      >
                        {/* Alumno Info */}
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-9 h-9 rounded-full bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-center group-hover:scale-105 transition-transform">
                              {student.first_name[0]}{student.last_name[0]}
                            </div>
                            <div>
                              <span className="font-extrabold text-slate-900 block group-hover:text-blue-600 transition-colors">
                                {student.first_name} {student.last_name}
                              </span>
                              <span className="text-[11px] text-slate-400">{student.email}</span>
                            </div>
                          </div>
                        </td>

                        {/* Phone */}
                        <td className="px-6 py-4 font-semibold text-slate-800">
                          {student.phone}
                        </td>

                        {/* Status */}
                        <td className="px-6 py-4">
                          <span
                            className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase ${
                              student.status === 'active'
                                ? 'bg-emerald-100 text-emerald-800'
                                : student.status === 'pending_approval'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {student.status === 'active' ? 'Activo' : student.status === 'pending_approval' ? 'Pendiente' : student.status}
                          </span>
                        </td>

                        {/* Credits */}
                        <td className="px-6 py-4">
                          <span
                            className={`font-extrabold text-sm ${
                              student.credits_balance > 0 ? 'text-emerald-700' : 'text-slate-400'
                            }`}
                          >
                            {student.credits_balance} clases
                          </span>
                        </td>

                        {/* Medical */}
                        <td className="px-6 py-4">
                          <span
                            className={`text-[11px] font-bold ${
                              student.has_medical_certificate
                                ? 'text-emerald-600'
                                : student.medical_notes
                                ? 'text-rose-600'
                                : 'text-slate-400'
                            }`}
                          >
                            {student.has_medical_certificate ? '✅ Apto al día' : student.medical_notes ? '⚠️ Con lesión/nota' : 'Sin apto'}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-end space-x-2">
                            <button
                              onClick={() => {
                                const msg = `Hola ${student.first_name}, te escribimos de ${studio.name}.`;
                                openWhatsApp(student.phone, msg);
                              }}
                              className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                              title="WhatsApp directo"
                            >
                              <MessageCircle className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setSelectedStudent(student)}
                              className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[11px] rounded-lg transition-colors"
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
          />
        )}

        {showAddModal && (
          <AddStudentModal onClose={() => setShowAddModal(false)} />
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
