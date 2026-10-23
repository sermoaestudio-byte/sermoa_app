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
  AlertCircle,
  Edit2,
  Trash2
} from 'lucide-react';
import { Profile, Booking, PaymentTransaction } from '../../types';
import { useStudioStore } from '../../store/studioStore';
import { openWhatsApp } from '../../utils/whatsapp';

interface StudentDetailDrawerProps {
  student: Profile | null;
  onClose: () => void;
  onOpenPayment?: (studentId: string) => void;
  onEditStudent?: (student: Profile) => void;
  onDeleteStudent?: (student: Profile) => void;
}

export const StudentDetailDrawer: React.FC<StudentDetailDrawerProps> = ({
  student,
  onClose,
  onOpenPayment,
  onEditStudent,
  onDeleteStudent,
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
        <div className="p-6 border-b border-[#E8D5B5] flex items-start justify-between sticky top-0 bg-[#FAF8F5]/95 backdrop-blur-sm z-10">
          <div className="flex items-center space-x-3.5">
            <div className="w-14 h-14 rounded-2xl bg-[#F4E8D1] border border-[#E8D5B5] text-[#5E612B] font-extrabold text-lg flex items-center justify-center shadow-xs overflow-hidden">
              {student.avatar_url ? (
                <img src={student.avatar_url} alt="" className="w-full h-full object-cover" />
              ) : (
                <span>{student.first_name[0]}{student.last_name[0]}</span>
              )}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-xl font-extrabold text-[#44261B]">
                  {student.first_name} {student.last_name}
                </h3>
                <span
                  className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase border ${
                    student.status === 'active'
                      ? 'bg-[#eaede7] text-[#5E612B] border-[#cadbcd]'
                      : student.status === 'pending_approval'
                      ? 'bg-[#F4E8D1] text-[#C18749] border-[#E8D5B5]'
                      : 'bg-[#FAF8F5] text-[#A68D74] border-[#E8D5B5]'
                  }`}
                >
                  {student.status === 'active' ? 'Activo' : student.status}
                </span>
              </div>
              <p className="text-xs text-[#A68D74] mt-0.5">DNI: {student.id_number || 'N/A'}</p>
            </div>
          </div>

          <div className="flex items-center space-x-1.5">
            {onEditStudent && (
              <button
                onClick={() => onEditStudent(student)}
                className="p-2 text-[#A68D74] hover:text-[#5E612B] hover:bg-[#F4E8D1] rounded-full transition-colors"
                title="Editar Alumno"
              >
                <Edit2 className="w-4 h-4" />
              </button>
            )}

            {onDeleteStudent && (
              <button
                onClick={() => onDeleteStudent(student)}
                className="p-2 text-[#A68D74] hover:text-[#B74E2A] hover:bg-[#B74E2A]/10 rounded-full transition-colors"
                title="Eliminar Alumno"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}

            <button
              onClick={onClose}
              className="p-2 text-[#A68D74] hover:text-[#44261B] rounded-full hover:bg-[#F4E8D1] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Drawer Body */}
        <div className="p-6 space-y-6 flex-1 text-xs bg-[#FAF8F5]">
          
          {/* Quick Actions / Contact Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 bg-white rounded-2xl border border-[#E8D5B5] shadow-2xs">
            <div className="text-xs text-[#44261B] space-y-1">
              <div className="flex items-center space-x-2">
                <Phone className="w-3.5 h-3.5 text-[#5E612B]" />
                <span className="font-semibold">{student.phone}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-3.5 h-3.5 text-[#A68D74]" />
                <span className="text-[#A68D74]">{student.email}</span>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              {onOpenPayment && (
                <button
                  onClick={() => onOpenPayment(student.id)}
                  className="px-3.5 py-2 rounded-xl bg-[#5E612B] hover:bg-[#44261B] text-[#F4E8D1] text-xs font-extrabold shadow-sm transition-all flex items-center space-x-1.5 cursor-pointer"
                >
                  <DollarSign className="w-4 h-4" />
                  <span>Cobrar / Registrar Pago</span>
                </button>
              )}

              <button
                onClick={handleSendWhatsApp}
                className="p-2 rounded-xl bg-[#F4E8D1] hover:bg-[#E8D5B5] text-[#5E612B] border border-[#E8D5B5] transition-all flex items-center justify-center cursor-pointer"
                title="Abrir WhatsApp"
              >
                <MessageCircle className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Credits & Financial Balance */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Credits Card */}
            <div className="p-4 bg-white border border-[#E8D5B5] rounded-2xl space-y-2 shadow-2xs">
              <span className="text-[11px] font-bold text-[#5E612B] uppercase tracking-tight block">
                Créditos Disponibles
              </span>
              <div className="text-2xl font-black text-[#44261B]">
                {student.credits_balance === 999 ? 'Pase Libre' : `${student.credits_balance} clases`}
              </div>
              
              <div className="pt-1 flex items-center space-x-2">
                {onOpenPayment ? (
                  <button
                    onClick={() => onOpenPayment(student.id)}
                    className="text-xs font-bold text-[#5E612B] hover:text-[#44261B] flex items-center space-x-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Cargar & Cobrar Pack</span>
                  </button>
                ) : (
                  <button
                    onClick={() => setShowBuyPack(!showBuyPack)}
                    className="text-xs font-bold text-[#5E612B] hover:text-[#44261B] flex items-center space-x-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Asignar Pack</span>
                  </button>
                )}
              </div>
            </div>

            {/* Account State Card */}
            <div
              className={`p-4 rounded-2xl border space-y-2 shadow-2xs ${
                student.debt_amount > 0
                  ? 'bg-[#B74E2A]/10 border-[#B74E2A]/30 text-[#B74E2A]'
                  : 'bg-white border-[#E8D5B5] text-[#44261B]'
              }`}
            >
              <span className="text-[11px] font-bold uppercase tracking-tight block text-[#A68D74]">
                Estado de Cuenta
              </span>
              <div className="text-2xl font-black text-[#44261B]">
                {student.debt_amount > 0
                  ? `-$${student.debt_amount.toLocaleString('es-AR')}`
                  : '$0.00'}
              </div>
              
              <div className="flex items-center justify-between pt-1">
                <span className="text-[11px] font-medium text-[#A68D74]">
                  {student.debt_amount > 0 ? 'Saldo pendiente de pago' : '✓ Al día'}
                </span>
                {student.debt_amount > 0 && onOpenPayment && (
                  <button
                    onClick={() => onOpenPayment(student.id)}
                    className="px-2.5 py-1 bg-[#B74E2A] hover:bg-[#8C361A] text-white font-extrabold text-[10px] rounded-lg shadow-2xs transition-all cursor-pointer"
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
          <div className="p-4 bg-white border border-[#E8D5B5] rounded-2xl space-y-2 shadow-2xs">
            <div className="flex items-center justify-between text-xs font-bold text-[#44261B]">
              <div className="flex items-center space-x-2">
                <HeartPulse className="w-4 h-4 text-[#C18749]" />
                <span>Ficha de Salud & Observaciones</span>
              </div>
              <span className="text-[11px] font-semibold text-[#A68D74]">
                {student.has_medical_certificate ? '✅ Apto médico entregado' : '⚠️ Sin apto físico'}
              </span>
            </div>
            <p className="text-xs text-[#44261B] leading-relaxed bg-[#FAF8F5] border border-[#E8D5B5]/60 p-3 rounded-xl">
              {student.medical_notes || 'No se registraron observaciones médicas particulares.'}
            </p>
            {student.emergency_contact_name && (
              <div className="text-[11px] text-[#A68D74]">
                Contacto de Emergencia: <strong className="text-[#44261B]">{student.emergency_contact_name}</strong> ({student.emergency_contact_phone || 'S/N'})
              </div>
            )}
          </div>

          {/* Recent Bookings History */}
          <div>
            <h4 className="font-extrabold text-[#44261B] text-sm mb-3">Historial de Turnos y Clases</h4>
            {studentBookings.length === 0 ? (
              <p className="text-xs text-[#A68D74] py-3 text-center bg-white border border-[#E8D5B5] rounded-2xl">
                Sin reservas registradas aún.
              </p>
            ) : (
              <div className="space-y-2">
                {studentBookings.slice(0, 5).map((b) => (
                  <div
                    key={b.id}
                    className="p-3 bg-white rounded-xl border border-[#E8D5B5] flex items-center justify-between text-xs shadow-2xs"
                  >
                    <div>
                      <span className="font-bold text-[#44261B]">Clase Reservada</span>
                      <span className="text-[#A68D74] block text-[11px]">
                        {b.booking_date} • {b.start_time} hs
                      </span>
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                        b.status === 'confirmed'
                          ? 'bg-[#eaede7] text-[#5E612B]'
                          : b.status === 'attended'
                          ? 'bg-[#F4E8D1] text-[#44261B]'
                          : 'bg-[#B74E2A]/15 text-[#B74E2A]'
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
              <h4 className="font-extrabold text-[#44261B] text-sm">Compras y Pagos Realizados</h4>
              {onOpenPayment && (
                <button
                  onClick={() => onOpenPayment(student.id)}
                  className="text-xs font-bold text-[#5E612B] hover:text-[#44261B] flex items-center space-x-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Nuevo Cobro</span>
                </button>
              )}
            </div>

            {studentPayments.length === 0 ? (
              <p className="text-xs text-[#A68D74] py-3 text-center bg-white border border-[#E8D5B5] rounded-2xl">
                No hay comprobantes de pago asociados a este alumno.
              </p>
            ) : (
              <div className="space-y-2">
                {studentPayments.map((pay) => (
                  <div
                    key={pay.id}
                    className="p-3.5 bg-white rounded-2xl border border-[#E8D5B5] flex items-center justify-between text-xs hover:bg-[#FAF8F5] transition-colors shadow-2xs"
                  >
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-[#44261B]">{pay.concept}</span>
                        {pay.reference_code && (
                          <span className="font-mono text-[9px] text-[#A68D74] bg-[#FAF8F5] px-1.5 py-0.2 rounded border border-[#E8D5B5]">
                            {pay.reference_code}
                          </span>
                        )}
                      </div>
                      <span className="text-[#A68D74] block text-[11px] mt-0.5">
                        {new Date(pay.created_at).toLocaleDateString('es-AR')} • {pay.payment_method} • {pay.category}
                      </span>
                    </div>
                    <span className="font-black text-[#5E612B] text-sm">
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
