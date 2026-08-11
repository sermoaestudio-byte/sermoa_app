import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  X,
  FileText,
  Calendar,
  Tag,
  DollarSign,
  User,
  Package,
  CheckCircle2,
  AlertCircle,
  Plus
} from 'lucide-react';
import { useStudioStore } from '../../store/studioStore';
import { PaymentMethod, PaymentType, Profile } from '../../types';
import { CategoriesModal } from './CategoriesModal';

interface NewTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultType?: PaymentType;
  preselectedStudentId?: string;
}

const PAYMENT_METHODS_LIST: { id: PaymentMethod; label: string }[] = [
  { id: 'cash', label: 'Efectivo' },
  { id: 'transfer', label: 'Transferencia' },
  { id: 'mercadopago', label: 'Mercado Pago' },
  { id: 'chytapay' as any, label: 'ChytaPay' },
  { id: 'card', label: 'Tarjetas' },
  { id: 'other' as any, label: 'Otros' },
];

const CURRENCIES_LIST = [
  { id: 'ARS', label: 'Pesos argentinos (ARS)' },
  { id: 'USD', label: 'Dólares estadounidenses (USD)' },
  { id: 'EUR', label: 'Euros (EUR)' },
];

export const NewTransactionModal: React.FC<NewTransactionModalProps> = ({
  isOpen,
  onClose,
  defaultType = 'income',
  preselectedStudentId,
}) => {
  const { profiles, creditPacks, addTransaction, financialCategories } = useStudioStore();
  const students = profiles.filter((p: Profile) => p.role === 'client');

  const [paymentType, setPaymentType] = useState<PaymentType>(defaultType);
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState<string>('');
  const [selectedStudentId, setSelectedStudentId] = useState<string>(preselectedStudentId || '');
  const [selectedPackId, setSelectedPackId] = useState<string>('');
  const [creditsToAdd, setCreditsToAdd] = useState<number>(0);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [amount, setAmount] = useState<number | ''>('');
  const [currency, setCurrency] = useState<string>('ARS');
  const [paymentMethod, setPaymentMethod] = useState<string>('');
  const [isRecurringExpense, setIsRecurringExpense] = useState<boolean>(false);
  const [repeatUntilDate, setRepeatUntilDate] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [showCategoriesModal, setShowCategoriesModal] = useState<boolean>(false);

  // Sync defaultType & preselectedStudentId on opening
  useEffect(() => {
    if (isOpen) {
      setPaymentType(defaultType);
      setSelectedStudentId(preselectedStudentId || '');
      setDate(new Date().toISOString().split('T')[0]);
      setIsRecurringExpense(false);
      setRepeatUntilDate('');
      setNotes('');
      setAmount('');
      setSelectedPackId('');
      setCreditsToAdd(0);

      const activeCats = financialCategories.filter((c) => c.is_active && c.type === defaultType);
      if (defaultType === 'income') {
        setSelectedCategory(activeCats.find((c) => c.name.toLowerCase().includes('manual'))?.name || activeCats[0]?.name || 'Ingreso manual');
        if (preselectedStudentId) {
          const student = students.find((s) => s.id === preselectedStudentId);
          if (student) {
            setDescription(`Pago de ${student.first_name} ${student.last_name}`);
            if (student.debt_amount > 0) {
              setAmount(student.debt_amount);
              setDescription(`Cobro de saldo pendiente: ${student.first_name} ${student.last_name}`);
            }
          }
        } else {
          setDescription('');
        }
      } else {
        setSelectedCategory(activeCats[0]?.name || '');
        setDescription('');
      }
    }
  }, [isOpen, defaultType, preselectedStudentId, financialCategories]);

  if (!isOpen) return null;

  const activeCategories = financialCategories.filter(
    (c) => c.is_active && c.type === paymentType
  );

  const selectedStudent = students.find((s) => s.id === selectedStudentId);

  const handleStudentChange = (stuId: string) => {
    setSelectedStudentId(stuId);
    setSelectedPackId('');
    setCreditsToAdd(0);

    if (!stuId) {
      setDescription('');
      setAmount('');
      return;
    }

    const stu = students.find((s) => s.id === stuId);
    if (stu) {
      if (stu.debt_amount > 0) {
        setDescription(`Cancelación de deuda: ${stu.first_name} ${stu.last_name}`);
        setAmount(stu.debt_amount);
      } else {
        setDescription(`Cobro a alumno: ${stu.first_name} ${stu.last_name}`);
      }
    }
  };

  const handlePackChange = (packId: string) => {
    setSelectedPackId(packId);
    if (!packId) {
      setCreditsToAdd(0);
      return;
    }

    const pack = creditPacks.find((p) => p.id === packId);
    if (pack) {
      setAmount(pack.price);
      setCreditsToAdd(pack.credits_count);
      const stu = students.find((s) => s.id === selectedStudentId);
      const studentName = stu ? `${stu.first_name} ${stu.last_name}` : '';
      setDescription(`Compra ${pack.name} - ${studentName}`.trim());
      setSelectedCategory('Venta de Pack / Membresía');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || Number(amount) <= 0) {
      alert('Por favor ingresa un monto válido.');
      return;
    }

    if (!description.trim()) {
      alert('Por favor ingresa una descripción.');
      return;
    }

    const studentName = selectedStudent
      ? `${selectedStudent.first_name} ${selectedStudent.last_name}`
      : undefined;

    addTransaction(
      {
        student_id: selectedStudentId || undefined,
        student_name: studentName,
        pack_id: selectedPackId || undefined,
        amount: Number(amount),
        payment_type: paymentType,
        payment_method: (paymentMethod as PaymentMethod) || 'cash',
        concept: description.trim(),
        category: selectedCategory || (paymentType === 'income' ? 'Ingreso manual' : 'Gasto general'),
        reference_code: `REC-${Date.now().toString().slice(-6)}`,
        notes: [
          notes.trim(),
          isRecurringExpense ? `Gasto fijo recurrente mensual${repeatUntilDate ? ` (hasta ${repeatUntilDate})` : ''}` : '',
        ]
          .filter(Boolean)
          .join(' · '),
        created_at: new Date(date + 'T12:00:00Z').toISOString(),
      },
      paymentType === 'income' ? creditsToAdd : 0
    );

    onClose();
  };

  return createPortal(
    <>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 bg-slate-950/60 backdrop-blur-xs animate-fade-in overflow-y-auto">
        <div className="bg-white rounded-3xl max-w-lg w-full max-h-[92vh] shadow-2xl border border-slate-100 flex flex-col my-auto overflow-hidden text-left">
          
          {/* Header */}
          <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
            <div className="flex items-center space-x-2.5">
              <span
                className={`text-xl font-black ${
                  paymentType === 'income' ? 'text-emerald-600' : 'text-rose-600'
                }`}
              >
                $
              </span>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
                {paymentType === 'income' ? 'Registrar ingreso' : 'Registrar egreso'}
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form Body */}
          <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-5 overflow-y-auto flex-1 min-h-0 text-xs">
            
            {/* Card Detalle */}
            <div className="p-5 bg-white border border-slate-200/90 rounded-2xl space-y-4 shadow-2xs">
              
              <div className="flex items-center space-x-2 text-slate-700 font-bold text-xs pb-2 border-b border-slate-100">
                <FileText className="w-4 h-4 text-slate-500" />
                <span>Detalle</span>
              </div>

              {/* 1. Fecha */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  <span className="text-rose-500 mr-1">*</span>Fecha
                </label>
                <div className="relative">
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
              </div>

              {/* In Ingreso: Alumno & Pack Selector */}
              {paymentType === 'income' && (
                <div className="space-y-3 p-3 bg-slate-50/70 border border-slate-200/70 rounded-xl">
                  <div className="flex items-center justify-between">
                    <label className="font-bold text-slate-700 flex items-center space-x-1">
                      <User className="w-3.5 h-3.5 text-slate-500" />
                      <span>Alumno CRM (Opcional)</span>
                    </label>
                    {selectedStudent && (
                      <span className="text-[11px] font-extrabold text-emerald-700">
                        Saldo: {selectedStudent.credits_balance} clases
                      </span>
                    )}
                  </div>

                  <select
                    value={selectedStudentId}
                    onChange={(e) => handleStudentChange(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  >
                    <option value="">Ingreso general / Sin alumno asignado</option>
                    {students.map((stu) => (
                      <option key={stu.id} value={stu.id}>
                        {stu.first_name} {stu.last_name} {stu.debt_amount > 0 ? `(Deuda: $${stu.debt_amount.toLocaleString('es-AR')})` : `(${stu.credits_balance} cls)`}
                      </option>
                    ))}
                  </select>

                  {/* If student has debt alert */}
                  {selectedStudent && selectedStudent.debt_amount > 0 && (
                    <div className="p-2.5 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-[11px] flex items-center justify-between">
                      <div className="flex items-center space-x-1.5 font-bold">
                        <AlertCircle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                        <span>Este alumno tiene un saldo adeudado de ${selectedStudent.debt_amount.toLocaleString('es-AR')}.</span>
                      </div>
                    </div>
                  )}

                  {/* Pack Selector if student chosen */}
                  {selectedStudent && (
                    <div className="pt-1">
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">
                        Cargar Pack o Membresía:
                      </label>
                      <select
                        value={selectedPackId}
                        onChange={(e) => handlePackChange(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none"
                      >
                        <option value="">Seleccionar pack para acreditar clases automáticamente...</option>
                        {creditPacks.map((pack) => (
                          <option key={pack.id} value={pack.id}>
                            {pack.name} (+{pack.credits_count} clases - ${pack.price.toLocaleString('es-AR')})
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
              )}

              {/* 2. Descripción */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  <span className="text-rose-500 mr-1">*</span>Descripción
                </label>
                <input
                  type="text"
                  required
                  placeholder={paymentType === 'expense' ? 'Ej. Alquiler del local' : 'Ej. Cobro de pack / cuota'}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              {/* 3. Categoría */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  {paymentType === 'expense' ? (
                    <>
                      <span className="text-rose-500 mr-1">*</span>Categoría
                    </>
                  ) : (
                    'Categoría (opcional)'
                  )}
                </label>
                <div className="flex items-center space-x-2">
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="flex-1 px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  >
                    <option value="">
                      {paymentType === 'expense' ? 'Seleccione categoría' : 'Ingreso manual'}
                    </option>
                    {activeCategories.map((cat) => (
                      <option key={cat.id} value={cat.name}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => setShowCategoriesModal(true)}
                    className="p-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-slate-600 transition-colors shrink-0"
                    title="Gestionar categorías"
                  >
                    <Tag className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* 4. Monto ($) & Moneda */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    <span className="text-rose-500 mr-1">*</span>Monto ($)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 font-bold">
                      $
                    </span>
                    <input
                      type="number"
                      required
                      min="1"
                      step="1"
                      placeholder="0"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value === '' ? '' : Number(e.target.value))}
                      className="w-full pl-8 pr-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    <span className="text-rose-500 mr-1">*</span>Moneda
                  </label>
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  >
                    {CURRENCIES_LIST.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* 5. Método de pago */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Método de pago
                </label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
                >
                  <option value="">Opcional</option>
                  {PAYMENT_METHODS_LIST.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* 6. Gasto fijo mensual (for Egreso) */}
              {paymentType === 'expense' && (
                <div className="pt-2 space-y-3 border-t border-slate-100">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800 text-xs">
                      Gasto fijo mensual
                    </span>
                    <button
                      type="button"
                      onClick={() => setIsRecurringExpense(!isRecurringExpense)}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        isRecurringExpense ? 'bg-brand-olive' : 'bg-slate-300'
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                          isRecurringExpense ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>

                  {isRecurringExpense && (
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2 animate-fade-in">
                      <label className="block text-[11px] font-bold text-slate-600">
                        Repetir hasta (opcional)
                      </label>
                      <input
                        type="date"
                        placeholder="Sin fecha fin"
                        value={repeatUntilDate}
                        onChange={(e) => setRepeatUntilDate(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800"
                      />
                      <p className="text-[11px] text-slate-400">
                        Se repetirá cada mes de forma automática.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* 7. Observaciones (opcional) */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Observaciones (opcional)
                </label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Detalles adicionales, número de factura, etc..."
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"
                />
              </div>

            </div>

            {/* Footer Buttons */}
            <div className="pt-3 flex items-center justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-brand-olive hover:bg-brand-darkolive text-white text-xs font-extrabold shadow-sm transition-all"
              >
                Registrar
              </button>
            </div>

          </form>

        </div>
      </div>

      {/* Categories Modal if clicked from tag icon */}
      <CategoriesModal
        isOpen={showCategoriesModal}
        onClose={() => setShowCategoriesModal(false)}
      />
    </>,
    document.body
  );
};
