import React, { useState } from 'react';
import {
  UserPlus,
  HeartPulse,
  CheckCircle2,
  Phone,
  Mail,
  User,
  ShieldCheck,
  ArrowRight,
  Lock,
  FileText,
  CreditCard,
  Sparkles,
  AlertCircle,
  Clock
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useStudioStore } from '../../store/studioStore';
import { MercadoPagoModal } from '../payments/MercadoPagoModal';
import { CreditPack, Profile } from '../../types';

interface StudentRegisterViewProps {
  onGoToLogin: () => void;
}

export const StudentRegisterView: React.FC<StudentRegisterViewProps> = ({ onGoToLogin }) => {
  const { studio, branches, creditPacks, submitStudentRegistration } = useStudioStore();

  const activePacks = creditPacks.filter((p) => p.is_active !== false);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [idNumber, setIdNumber] = useState('');
  const [branchId, setBranchId] = useState(branches[0]?.id || '');
  const [emergencyName, setEmergencyName] = useState('');
  const [emergencyPhone, setEmergencyPhone] = useState('');

  // Pack seleccionado para inscripción
  const [selectedPackId, setSelectedPackId] = useState<string>(activePacks[0]?.id || '');

  // Health questionnaire
  const [hasInjuries, setHasInjuries] = useState(false);
  const [injuriesDetail, setInjuriesDetail] = useState('');
  const [isPregnant, setIsPregnant] = useState(false);
  const [hasMedicalCertificate, setHasMedicalCertificate] = useState(false);
  const [medicalNotes, setMedicalNotes] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registeredStudent, setRegisteredStudent] = useState<Profile | null>(null);
  const [isMPModalOpen, setIsMPModalOpen] = useState(false);
  const [paymentDone, setPaymentDone] = useState(false);

  const selectedPack = activePacks.find((p) => p.id === selectedPackId) || activePacks[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert('Las contraseñas no coinciden. Por favor verifícalas.');
      return;
    }

    if (!selectedPack) {
      alert('Por favor selecciona un pack de clases para continuar con tu inscripción.');
      return;
    }

    setIsSubmitting(true);
    try {
      const student = await submitStudentRegistration(
        {
          first_name: firstName,
          last_name: lastName,
          email,
          phone,
          id_number: idNumber,
          preferred_branch_id: branchId,
          emergency_contact_name: emergencyName,
          emergency_contact_phone: emergencyPhone,
          medical_notes: medicalNotes,
          has_medical_certificate: hasMedicalCertificate,
          medical_declaration: {
            has_injuries: hasInjuries,
            injuries_detail: injuriesDetail,
            has_hypertension: false,
            is_pregnant: isPregnant,
            taking_medications: false,
            has_cardiac_conditions: false,
          },
        },
        password
      );

      setRegisteredStudent(student);
      // Abrir inmediatamente la pasarela de Mercado Pago para pagar el pack seleccionado
      setIsMPModalOpen(true);
    } catch (err) {
      console.error('Error al registrar alumno:', err);
      alert('Ocurrió un error al procesar el registro. Intenta nuevamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePaymentSuccess = () => {
    setPaymentDone(true);
    setIsMPModalOpen(false);
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch { }
  };

  // Pantalla de confirmación tras registrarse y/o pagar
  if (registeredStudent && (paymentDone || !isMPModalOpen)) {
    return (
      <div className="max-w-lg mx-auto bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-soft text-center animate-fade-in my-8 space-y-5">
        <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mx-auto shadow-xs">
          <Clock className="w-8 h-8 animate-pulse" />
        </div>

        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-amber-100 text-amber-900 mb-2">
            <AlertCircle className="w-3.5 h-3.5" />
            Solicitud Pendiente de Aprobación Médica
          </span>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            ¡{paymentDone ? 'Pago y Solicitud Recibidos' : 'Registro Enviado con Éxito'}!
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed mt-2 max-w-md mx-auto">
            Hola <strong>{firstName}</strong>, recibimos tu formulario de alta{paymentDone ? ` y el pago de tu ${selectedPack?.name}` : ''}.
          </p>
        </div>

        {/* Resumen del Pack seleccionado */}
        {selectedPack && (
          <div className="p-4 bg-[#FAF8F5] border border-[#E8D5B5] rounded-2xl text-left text-xs space-y-1">
            <div className="flex items-center justify-between font-bold text-[#44261B]">
              <span className="flex items-center gap-1.5">
                <CreditCard className="w-4 h-4 text-[#5E612B]" />
                {selectedPack.name}
              </span>
              <span className="text-[#5E612B] font-black text-sm">
                ${Number(selectedPack.price).toLocaleString('es-AR')}
              </span>
            </div>
            <p className="text-slate-500 text-[11px]">
              {selectedPack.credits_count === 999 ? 'Pase Libre' : `${selectedPack.credits_count} clases`} • Válido por {selectedPack.validity_days} días
            </p>
            <div className="pt-2 flex items-center gap-2">
              <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                paymentDone ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
              }`}>
                {paymentDone ? '✓ Pago Acreditado vía Mercado Pago' : 'Pendiente de Pago'}
              </span>
            </div>
          </div>
        )}

        <div className="bg-amber-50/70 border border-amber-200/80 p-4 rounded-2xl text-left text-xs text-amber-950 space-y-2">
          <p className="font-bold flex items-center gap-1.5 text-amber-900">
            <HeartPulse className="w-4 h-4 text-rose-600 shrink-0" />
            Revisión Médica en Curso
          </p>
          <p className="text-[11px] leading-relaxed text-amber-900/90">
            Por protocolos de salud y seguridad deportiva, el equipo profesional de <strong>{studio.name}</strong> analiza tu ficha médica antes de confirmar tu ingreso.
          </p>
          <p className="text-[11px] leading-relaxed text-amber-900/90 font-semibold">
            Podrás entrar a tu portal y ver tus créditos cargados, pero <strong>podrás disfrutar de tus créditos una vez que el administrador valide tu ficha médica</strong>. En cuanto sea aprobada, recibirás un WhatsApp de confirmación.
          </p>
        </div>

        {!paymentDone && (
          <button
            type="button"
            onClick={() => setIsMPModalOpen(true)}
            className="w-full py-3 bg-[#5E612B] hover:bg-[#44261B] text-[#F4E8D1] text-xs font-black rounded-2xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
          >
            <CreditCard className="w-4 h-4" />
            <span>Abonar Pack con Mercado Pago</span>
          </button>
        )}

        <button
          onClick={onGoToLogin}
          className="w-full py-3 bg-slate-900 hover:bg-black text-white text-xs font-extrabold rounded-2xl transition-all shadow-md cursor-pointer"
        >
          Ir a Iniciar Sesión en el Portal
        </button>

        {/* Modal de Mercado Pago */}
        {selectedPack && registeredStudent && (
          <MercadoPagoModal
            isOpen={isMPModalOpen}
            onClose={() => setIsMPModalOpen(false)}
            pack={selectedPack}
            userId={registeredStudent.id}
            userEmail={registeredStudent.email}
            userName={`${registeredStudent.first_name} ${registeredStudent.last_name}`}
            onPaymentSuccess={handlePaymentSuccess}
          />
        )}
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-soft my-6 animate-fade-in">
      
      {/* Header */}
      <div className="text-center mb-6">
        <span className="text-xs font-bold uppercase tracking-wider text-[#5E612B] bg-[#5E612B]/10 px-3 py-1 rounded-full">
          Registro de Nuevo Alumno
        </span>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight mt-2">
          Inscripción a {studio.name}
        </h2>
        <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
          Completa tus datos personales, ficha médica y selecciona tu pack para abonar tu inscripción
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        
        {/* SECCIÓN 1: DATOS PERSONALES */}
        <div className="space-y-3">
          <span className="text-xs font-black uppercase tracking-wider text-[#A68D74] block">
            1. Datos Personales
          </span>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Nombre *</label>
              <input
                type="text"
                required
                placeholder="Ej: Florencia"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:ring-2 focus:ring-[#5E612B] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Apellido *</label>
              <input
                type="text"
                required
                placeholder="Ej: Silva"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:ring-2 focus:ring-[#5E612B] focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">WhatsApp (Celular) *</label>
              <input
                type="tel"
                required
                placeholder="54911..."
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:ring-2 focus:ring-[#5E612B] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">DNI / Cédula *</label>
              <input
                type="text"
                required
                placeholder="38921..."
                value={idNumber}
                onChange={(e) => setIdNumber(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:ring-2 focus:ring-[#5E612B] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Correo Electrónico *</label>
            <input
              type="email"
              required
              placeholder="florencia@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:ring-2 focus:ring-[#5E612B] focus:outline-none"
            />
          </div>

          {/* Security Password */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Contraseña *</label>
              <input
                type="password"
                required
                minLength={6}
                placeholder="Mínimo 6 caracteres"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:ring-2 focus:ring-[#5E612B] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Repetir Contraseña *</label>
              <input
                type="password"
                required
                minLength={6}
                placeholder="Repite la contraseña"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:ring-2 focus:ring-[#5E612B] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Sucursal de Preferencia</label>
            <select
              value={branchId}
              onChange={(e) => setBranchId(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:ring-2 focus:ring-[#5E612B] focus:outline-none"
            >
              {branches.map((b) => (
                <option key={b.id} value={b.id}>{b.name} - {b.city}</option>
              ))}
            </select>
          </div>

          {/* Emergency contact */}
          <div className="pt-2">
            <label className="block text-xs font-bold text-slate-800 mb-1">Contacto de Emergencia</label>
            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="Nombre y vínculo (ej: Mamá)"
                value={emergencyName}
                onChange={(e) => setEmergencyName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800"
              />
              <input
                type="tel"
                placeholder="Teléfono de emergencia"
                value={emergencyPhone}
                onChange={(e) => setEmergencyPhone(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800"
              />
            </div>
          </div>
        </div>

        {/* SECCIÓN 2: FICHA DE SALUD */}
        <div className="pt-3 border-t border-slate-100 space-y-3">
          <div className="flex items-center space-x-2 text-xs font-black uppercase tracking-wider text-[#A68D74]">
            <HeartPulse className="w-4 h-4 text-rose-500" />
            <span>2. Ficha de Salud y Aptitud Física</span>
          </div>

          <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <label className="flex items-center justify-between text-xs font-medium text-slate-700 cursor-pointer">
              <span>¿Tienes alguna lesión, dolor o antecedente postural?</span>
              <input
                type="checkbox"
                checked={hasInjuries}
                onChange={(e) => setHasInjuries(e.target.checked)}
                className="rounded text-[#5E612B] w-4 h-4"
              />
            </label>

            {hasInjuries && (
              <input
                type="text"
                placeholder="Indica la zona (ej: lumbar, cervical, rodilla derecha)..."
                value={injuriesDetail}
                onChange={(e) => setInjuriesDetail(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-rose-200 rounded-xl text-xs text-slate-800 animate-fade-in"
              />
            )}

            <label className="flex items-center justify-between text-xs font-medium text-slate-700 cursor-pointer">
              <span>¿Te encuentras embarazada?</span>
              <input
                type="checkbox"
                checked={isPregnant}
                onChange={(e) => setIsPregnant(e.target.checked)}
                className="rounded text-[#5E612B] w-4 h-4"
              />
            </label>

            <label className="flex items-center justify-between text-xs font-medium text-slate-700 cursor-pointer">
              <span className="flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-[#5E612B]" />
                <span>¿Cuentas con certificado médico / apto físico al día?</span>
              </span>
              <input
                type="checkbox"
                checked={hasMedicalCertificate}
                onChange={(e) => setHasMedicalCertificate(e.target.checked)}
                className="rounded text-[#5E612B] w-4 h-4"
              />
            </label>

            <textarea
              rows={2}
              placeholder="Otras observaciones médicas para el profesor..."
              value={medicalNotes}
              onChange={(e) => setMedicalNotes(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800"
            />
          </div>
        </div>

        {/* SECCIÓN 3: SELECCIÓN DE PACK DE CLASES */}
        <div className="pt-3 border-t border-slate-100 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-[#A68D74] flex items-center gap-1.5">
              <CreditCard className="w-4 h-4 text-[#5E612B]" />
              3. Selecciona tu Pack de Clases *
            </span>
            <span className="text-[11px] text-slate-400">Requerido para inscripción</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {activePacks.map((pack) => {
              const isSelected = selectedPackId === pack.id;
              return (
                <div
                  key={pack.id}
                  onClick={() => setSelectedPackId(pack.id)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'border-[#5E612B] bg-[#5E612B]/5 shadow-xs ring-2 ring-[#5E612B]/40'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="font-extrabold text-xs text-[#44261B]">{pack.name}</h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        {pack.credits_count === 999 ? 'Pase Libre Ilimitado' : `${pack.credits_count} clases`} • {pack.validity_days} días
                      </p>
                    </div>
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                      isSelected ? 'border-[#5E612B] bg-[#5E612B]' : 'border-slate-300'
                    }`}>
                      {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                    </div>
                  </div>

                  <div className="mt-2.5 pt-2 border-t border-slate-100/80 flex items-center justify-between">
                    <span className="text-xs font-black text-[#5E612B]">
                      ${Number(pack.price).toLocaleString('es-AR')}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      ${pack.credits_count > 0 && pack.credits_count < 999 ? Math.round(Number(pack.price) / pack.credits_count).toLocaleString('es-AR') + '/clase' : 'Abono'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Submit */}
        <div className="pt-3">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 rounded-2xl text-xs font-extrabold shadow-md transition-all flex items-center justify-center space-x-2 bg-[#5E612B] hover:bg-[#44261B] text-[#F4E8D1] cursor-pointer disabled:opacity-50"
          >
            {isSubmitting ? (
              <span>Procesando registro...</span>
            ) : (
              <>
                <span>Enviar Registro y Abonar Pack (${selectedPack ? Number(selectedPack.price).toLocaleString('es-AR') : ''})</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          <p className="text-[11px] text-slate-400 text-center mt-3">
            ¿Ya tienes cuenta?{' '}
            <button
              type="button"
              onClick={onGoToLogin}
              className="text-[#5E612B] font-bold underline cursor-pointer"
            >
              Ingresa al portal
            </button>
          </p>
        </div>

      </form>

      {/* Modal de Pago de Mercado Pago */}
      {selectedPack && registeredStudent && (
        <MercadoPagoModal
          isOpen={isMPModalOpen}
          onClose={() => setIsMPModalOpen(false)}
          pack={selectedPack}
          userId={registeredStudent.id}
          userEmail={registeredStudent.email}
          userName={`${registeredStudent.first_name} ${registeredStudent.last_name}`}
          onPaymentSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  );
};
