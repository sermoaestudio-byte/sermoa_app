import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import {
  X,
  Edit2,
  User,
  Phone,
  Mail,
  CreditCard,
  HeartPulse,
  Save,
  AlertCircle,
  Building,
  CheckCircle2,
  FileCheck
} from 'lucide-react';
import { Profile, StudentStatus } from '../../types';
import { useStudioStore } from '../../store/studioStore';

interface EditStudentModalProps {
  student: Profile;
  onClose: () => void;
  onSaved?: () => void;
}

export const EditStudentModal: React.FC<EditStudentModalProps> = ({
  student,
  onClose,
  onSaved,
}) => {
  const { branches, updateStudent } = useStudioStore();

  const [firstName, setFirstName] = useState(student.first_name || '');
  const [lastName, setLastName] = useState(student.last_name || '');
  const [email, setEmail] = useState(student.email || '');
  const [phone, setPhone] = useState(student.phone || '');
  const [idNumber, setIdNumber] = useState(student.id_number || '');
  const [status, setStatus] = useState<StudentStatus>(student.status || 'active');
  const [creditsBalance, setCreditsBalance] = useState(student.credits_balance ?? 0);
  const [debtAmount, setDebtAmount] = useState(student.debt_amount ?? 0);
  const [preferredBranchId, setPreferredBranchId] = useState(student.preferred_branch_id || branches[0]?.id || '');
  const [hasMedicalCert, setHasMedicalCert] = useState(!!student.has_medical_certificate);
  const [medicalNotes, setMedicalNotes] = useState(student.medical_notes || '');

  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    updateStudent(student.id, {
      first_name: firstName.trim(),
      last_name: lastName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      id_number: idNumber.trim(),
      status,
      credits_balance: Number(creditsBalance),
      debt_amount: Number(debtAmount),
      preferred_branch_id: preferredBranchId,
      has_medical_certificate: hasMedicalCert,
      medical_notes: medicalNotes.trim(),
    });

    setIsSaving(false);
    if (onSaved) onSaved();
    onClose();
  };

  return createPortal(
    <div className="fixed inset-0 z-[9999] overflow-y-auto bg-slate-950/60 backdrop-blur-xs flex min-h-full items-center justify-center p-4 sm:p-6 animate-fade-in text-left">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-100 my-auto flex flex-col max-h-[90vh] overflow-hidden">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur-sm z-10">
          <div className="flex items-center space-x-3">
            <div className="w-11 h-11 rounded-2xl bg-brand-50 text-brand-700 flex items-center justify-center font-bold shadow-xs">
              <Edit2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-slate-900">
                Editar Alumno: {student.first_name} {student.last_name}
              </h3>
              <p className="text-xs text-slate-400">
                Modifica los datos personales, créditos, deudas y ficha médica
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto flex-1 text-xs">
          
          {/* 1. Datos Personales */}
          <div className="bg-slate-50/80 p-5 rounded-2xl border border-slate-200/80 space-y-4">
            <div className="flex items-center space-x-2 pb-1 border-b border-slate-200/60">
              <User className="w-4 h-4 text-brand-600" />
              <span className="font-extrabold text-slate-800 text-sm">1. Datos Personales & Contacto</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Nombre *</label>
                <input
                  type="text"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl font-medium text-slate-800 focus:ring-2 focus:ring-brand-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Apellido *</label>
                <input
                  type="text"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl font-medium text-slate-800 focus:ring-2 focus:ring-brand-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Email *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl font-medium text-slate-800 focus:ring-2 focus:ring-brand-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Teléfono / WhatsApp *</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl font-medium text-slate-800 focus:ring-2 focus:ring-brand-500 focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-bold text-slate-700 mb-1">DNI / Documento</label>
                <input
                  type="text"
                  value={idNumber}
                  onChange={(e) => setIdNumber(e.target.value)}
                  placeholder="Ej: 33892437"
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl font-medium text-slate-800 focus:ring-2 focus:ring-brand-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* 2. Estado, Créditos & Finanzas */}
          <div className="bg-slate-50/80 p-5 rounded-2xl border border-slate-200/80 space-y-4">
            <div className="flex items-center space-x-2 pb-1 border-b border-slate-200/60">
              <CreditCard className="w-4 h-4 text-emerald-600" />
              <span className="font-extrabold text-slate-800 text-sm">2. Estado de Cuenta & Créditos</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Estado</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as StudentStatus)}
                  className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl font-bold text-slate-800 focus:outline-none"
                >
                  <option value="active">Activo (Aprobado)</option>
                  <option value="pending_approval">Pendiente de Aprobación</option>
                  <option value="inactive">Inactivo / Pausado</option>
                  <option value="rejected">Rechazado</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Créditos de Clases</label>
                <input
                  type="number"
                  min="0"
                  value={creditsBalance}
                  onChange={(e) => setCreditsBalance(Number(e.target.value))}
                  className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl font-extrabold text-emerald-700 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Deuda Pendiente ($)</label>
                <input
                  type="number"
                  min="0"
                  value={debtAmount}
                  onChange={(e) => setDebtAmount(Number(e.target.value))}
                  className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl font-extrabold text-rose-600 focus:outline-none"
                />
              </div>

              {branches.length > 0 && (
                <div className="sm:col-span-3">
                  <label className="block font-bold text-slate-700 mb-1">Sede Preferida</label>
                  <select
                    value={preferredBranchId}
                    onChange={(e) => setPreferredBranchId(e.target.value)}
                    className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl font-medium text-slate-800 focus:outline-none"
                  >
                    {branches.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name} ({b.address})
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </div>

          {/* 3. Ficha Médica & Observaciones */}
          <div className="bg-slate-50/80 p-5 rounded-2xl border border-slate-200/80 space-y-4">
            <div className="flex items-center space-x-2 pb-1 border-b border-slate-200/60">
              <HeartPulse className="w-4 h-4 text-rose-500" />
              <span className="font-extrabold text-slate-800 text-sm">3. Ficha de Salud & Observaciones</span>
            </div>

            <label className="flex items-center space-x-2.5 cursor-pointer bg-white p-3 rounded-xl border border-slate-200">
              <input
                type="checkbox"
                checked={hasMedicalCert}
                onChange={(e) => setHasMedicalCert(e.target.checked)}
                className="w-4 h-4 text-emerald-600 rounded-sm border-slate-300 focus:ring-emerald-500"
              />
              <span className="font-bold text-slate-800">
                Apto médico físico entregado y validado en recepción
              </span>
            </label>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Notas Médicas / Lesiones / Comentarios</label>
              <textarea
                rows={3}
                value={medicalNotes}
                onChange={(e) => setMedicalNotes(e.target.value)}
                placeholder="Ej: Hernia de disco L4-L5, hipertensión leve, molestia en rodilla derecha..."
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl font-medium text-slate-800 focus:ring-2 focus:ring-brand-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-slate-200 font-bold text-slate-600 hover:bg-slate-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-extrabold shadow-sm transition-all flex items-center space-x-1.5"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? 'Guardando...' : 'Guardar Cambios'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>,
    document.body
  );
};
