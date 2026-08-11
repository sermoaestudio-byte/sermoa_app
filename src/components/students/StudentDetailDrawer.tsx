import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import {
  X,
  Phone,
  Mail,
  Calendar,
  CreditCard,
  HeartPulse,
  Clock,
  Plus,
  Minus,
  MessageCircle,
  FileCheck,
  DollarSign,
  Receipt,
  AlertCircle
} from 'lucide-react';
import { Profile, Booking, PaymentTransaction } from '../../types';
import { useStudioStore } from '../../store/studioStore';
import { openWhatsApp } from '../../utils/whatsapp';

interface StudentDetailDrawerProps {
  student: Profile | null;
  onClose: () => void;
  onOpenPayment?: (studentId: string) => void;
}

export const StudentDetailDrawer: React.FC<StudentDetailDrawerProps> = ({
  student,
  onClose,
  onOpenPayment,
}) => {
  const {
    studio,
    creditPacks,
    bookings,
    payments,
    whatsappTemplates,
    purchaseCreditPack,
  } = useStudioStore();

  const [selectedPackId, setSelectedPackId] = useState('');
  const [showBuyPack, setShowBuyPack] = useState(false);

  if (!student) return null;

  const studentBookings = bookings.filter((b: Booking) => b.student_id === student.id);
  const studentPayments = payments.filter((p: PaymentTransaction) => p.student_id === student.id);

  const handleSendWhatsApp = () => {
    const msg = `¡Hola ${student.first_name}! Te escribimos de ${studio.name}. ¿Cómo estás?`;
    openWhatsApp(student.phone, msg);
  };

  const handleAssignPack = () => {
    if (!selectedPackId) return;
    purchaseCreditPack(student.id, selectedPackId, 'transfer');
    setSelectedPackId('');
    setShowBuyPack(false);
  };

  return createPortal(
    <div className="fixed inset-0 z-[9999] overflow-hidden bg-slate-950/60 backdrop-blur-xs animate-fade-in flex justify-end">
      <div className="bg-white w-full max-w-xl h-full overflow-y-auto shadow-2xl flex flex-col">
        
        {/* Drawer Header */}
        <div className="p-6 border-b border-slate-100 flex items-start justify-between sticky top-0 bg-white/95 backdrop-blur-sm z-10">
          <div className="flex items-center space-x-3.5">
            <div className="w-14 h-14 rounded-2xl bg-brand-50 text-brand-800 font-extrabold text-lg flex items-center justify-center shadow-xs">
              {student.first_name[0]}{student.last_name[0]}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-xl font-extrabold text-slate-900">
                  {student.first_name} {student.last_name}
                </h3>
                <span
                  className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase ${
                    student.status === 'active'
                      ? 'bg-emerald-100 text-emerald-800'
                      : student.status === 'pending_approval'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  {student.status === 'active' ? 'Activo' : student.status}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">DNI: {student.id_number || 'N/A'}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Body */}
        <div className="p-6 space-y-6 flex-1 text-xs">
          
          {/* Quick Actions / Contact Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 bg-slate-50 rounded-2xl border border-slate-200/70">
            <div className="text-xs text-slate-600 space-y-1">
              <div className="flex items-center space-x-2">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                <span className="font-semibold">{student.phone}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span>{student.email}</span>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              {onOpenPayment && (
                <button
                  onClick={() => onOpenPayment(student.id)}
                  className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold shadow-sm transition-all flex items-center space-x-1.5"
                >
                  <DollarSign className="w-4 h-4" />
                  <span>Cobrar / Registrar Pago</span>
                </button>
              )}

              <button
                onClick={handleSendWhatsApp}
                className="p-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 transition-all flex items-center justify-center"
                title="Abrir WhatsApp"
              >
                <MessageCircle className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Credits & Financial Balance */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Credits Card */}
            <div className="p-4 bg-emerald-50/70 border border-emerald-200/80 rounded-2xl space-y-2">
              <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-tight block">
                Créditos Disponibles
              </span>
              <div className="text-2xl font-black text-emerald-950">
                {student.credits_balance} clases
              </div>
              
              <div className="pt-1 flex items-center space-x-2">
                {onOpenPayment ? (
                  <button
                    onClick={() => onOpenPayment(student.id)}
                    className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center space-x-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Cargar & Cobrar Pack</span>
                  </button>
                ) : (
                  <button
                    onClick={() => setShowBuyPack(!showBuyPack)}
                    className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center space-x-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Asignar Pack</span>
                  </button>
                )}
              </div>
            </div>

            {/* Account State Card */}
            <div
              className={`p-4 rounded-2xl border space-y-2 ${
                student.debt_amount > 0
                  ? 'bg-rose-50 border-rose-200 text-rose-900'
                  : 'bg-slate-50 border-slate-200 text-slate-800'
              }`}
            >
              <span className="text-[11px] font-bold uppercase tracking-tight block">
                Estado de Cuenta
              </span>
              <div className="text-2xl font-black">
                {student.debt_amount > 0
                  ? `-$${student.debt_amount.toLocaleString('es-AR')}`
                  : '$0.00'}
              </div>
              
              <div className="flex items-center justify-between pt-1">
                <span className="text-[11px] font-medium text-slate-500">
                  {student.debt_amount > 0 ? 'Saldo pendiente de pago' : '✓ Al día'}
                </span>
                {student.debt_amount > 0 && onOpenPayment && (
                  <button
                    onClick={() => onOpenPayment(student.id)}
                    className="px-2.5 py-1 bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-[10px] rounded-lg shadow-2xs transition-all"
                  >
                    Regularizar
                  </button>
                )}
              </div>
            </div>

          </div>

          {/* Assign Pack Form (Quick modal inside drawer) */}
          {showBuyPack && (
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl animate-fade-in space-y-3">
              <label className="block text-xs font-bold text-slate-700">
                Selecciona el Pack o Membresía a cargar:
              </label>
              <select
                value={selectedPackId}
                onChange={(e) => setSelectedPackId(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800"
              >
                <option value="">Selecciona un pack...</option>
                {creditPacks.map((pack) => (
                  <option key={pack.id} value={pack.id}>
                    {pack.name} ({pack.credits_count} clases - ${pack.price.toLocaleString('es-AR')})
                  </option>
                ))}
              </select>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowBuyPack(false)}
                  className="px-3 py-1.5 text-xs text-slate-500 font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleAssignPack}
                  disabled={!selectedPackId}
                  className="px-4 py-1.5 bg-emerald-600 text-white rounded-xl text-xs font-bold shadow-sm disabled:opacity-50"
                >
                  Confirmar Asignación
                </button>
              </div>
            </div>
          )}

          {/* Medical Notes & Health Info */}
          <div className="p-4 bg-rose-50/50 border border-rose-100 rounded-2xl space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-rose-900">
              <div className="flex items-center space-x-2">
                <HeartPulse className="w-4 h-4 text-rose-600" />
                <span>Ficha de Salud & Observaciones</span>
              </div>
              <span className="text-[11px] font-semibold text-slate-500">
                {student.has_medical_certificate ? '✅ Apto médico entregado' : '⚠️ Sin apto físico'}
              </span>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed bg-white/60 p-3 rounded-xl">
              {student.medical_notes || 'No se registraron observaciones médicas particulares.'}
            </p>
            {student.emergency_contact_name && (
              <div className="text-[11px] text-slate-500">
                Contacto de Emergencia: <strong>{student.emergency_contact_name}</strong> ({student.emergency_contact_phone || 'S/N'})
              </div>
            )}
          </div>

          {/* Recent Bookings History */}
          <div>
            <h4 className="font-extrabold text-slate-800 text-sm mb-3">Historial de Turnos y Clases</h4>
            {studentBookings.length === 0 ? (
              <p className="text-xs text-slate-400 py-3 text-center bg-slate-50 rounded-2xl">
                Sin reservas registradas aún.
              </p>
            ) : (
              <div className="space-y-2">
                {studentBookings.slice(0, 5).map((b) => (
                  <div
                    key={b.id}
                    className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-bold text-slate-800">Clase Reservada</span>
                      <span className="text-slate-400 block text-[11px]">
                        {b.booking_date} • {b.start_time} hs
                      </span>
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                        b.status === 'confirmed'
                          ? 'bg-emerald-100 text-emerald-800'
                          : b.status === 'attended'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {b.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Payments History */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-extrabold text-slate-800 text-sm">Compras y Pagos Realizados</h4>
              {onOpenPayment && (
                <button
                  onClick={() => onOpenPayment(student.id)}
                  className="text-xs font-bold text-emerald-700 hover:underline flex items-center space-x-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Nuevo Cobro</span>
                </button>
              )}
            </div>

            {studentPayments.length === 0 ? (
              <p className="text-xs text-slate-400 py-3 text-center bg-slate-50 rounded-2xl">
                No hay comprobantes de pago asociados a este alumno.
              </p>
            ) : (
              <div className="space-y-2">
                {studentPayments.map((pay) => (
                  <div
                    key={pay.id}
                    className="p-3.5 bg-slate-50/80 rounded-2xl border border-slate-200/70 flex items-center justify-between text-xs hover:bg-slate-50 transition-colors"
                  >
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-slate-900">{pay.concept}</span>
                        {pay.reference_code && (
                          <span className="font-mono text-[9px] text-slate-400 bg-white px-1.5 py-0.2 rounded border border-slate-200">
                            {pay.reference_code}
                          </span>
                        )}
                      </div>
                      <span className="text-slate-400 block text-[11px] mt-0.5">
                        {new Date(pay.created_at).toLocaleDateString('es-AR')} • {pay.payment_method} • {pay.category}
                      </span>
                    </div>
                    <span className="font-black text-emerald-700 text-sm">
                      +${pay.amount.toLocaleString('es-AR')}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>
    </div>,
    document.body
  );
};
