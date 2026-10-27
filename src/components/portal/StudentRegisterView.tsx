import React, { useState } from 'react';
import { UserPlus, HeartPulse, CheckCircle2, Phone, Mail, User, ShieldCheck, ArrowRight, Lock, FileText } from 'lucide-react';
import { useStudioStore } from '../../store/studioStore';

interface StudentRegisterViewProps {
  onGoToLogin: () => void;
}

export const StudentRegisterView: React.FC<StudentRegisterViewProps> = ({ onGoToLogin }) => {
  const { studio, branches, submitStudentRegistration } = useStudioStore();

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
  
  // Health questionnaire
  const [hasInjuries, setHasInjuries] = useState(false);
  const [injuriesDetail, setInjuriesDetail] = useState('');
  const [isPregnant, setIsPregnant] = useState(false);
  const [hasMedicalCertificate, setHasMedicalCertificate] = useState(false);
  const [medicalNotes, setMedicalNotes] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert('Las contraseñas no coinciden. Por favor verifícalas.');
      return;
    }

    setIsSubmitting(true);
    try {
      await submitStudentRegistration({
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
      }, password);

      setIsSubmitted(true);
    } catch (err) {
      console.error('Error al registrar alumno:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="max-w-md mx-auto bg-white rounded-3xl p-8 border border-slate-200 shadow-soft text-center animate-fade-in my-8">
        <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-4 shadow-sm">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-extrabold text-slate-900 mb-2">
          ¡Solicitud Enviada con Éxito!
        </h3>
        <p className="text-xs text-slate-600 leading-relaxed mb-6">
          Hola <strong>{firstName}</strong>, recibimos tu solicitud de ingreso y ficha médica. El equipo de <strong>{studio.name}</strong> revisará tus antecedentes y certificado de salud para habilitar tu cuenta.
          <br /><br />
          Te notificaremos por <strong>WhatsApp y correo electrónico</strong> en cuanto tu solicitud sea aprobada para que puedas iniciar sesión, adquirir tu pack de clases con Mercado Pago y comenzar a reservar tus turnos.
        </p>

        <button
          onClick={onGoToLogin}
          className="w-full py-3 bg-slate-900 hover:bg-black text-white text-xs font-extrabold rounded-2xl transition-all shadow-md cursor-pointer"
        >
          Ir a Iniciar Sesión
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-soft my-6 animate-fade-in">
      
      {/* Header */}
      <div className="text-center mb-6">
        <span className="text-xs font-bold uppercase tracking-wider text-brand-600 bg-brand-50 px-3 py-1 rounded-full">
          Registro de Nuevo Alumno
        </span>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight mt-2">
          Únete a {studio.name}
        </h2>
        <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
          Completa tus datos personales y declaración médica para que el equipo pueda adaptar tus clases
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Nombre *</label>
            <input
              type="text"
              required
              placeholder="Ej: Florencia"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:ring-2 focus:ring-brand-500 focus:outline-none"
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
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:ring-2 focus:ring-brand-500 focus:outline-none"
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
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:ring-2 focus:ring-brand-500 focus:outline-none"
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
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:ring-2 focus:ring-brand-500 focus:outline-none"
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
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:ring-2 focus:ring-brand-500 focus:outline-none"
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
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:ring-2 focus:ring-brand-500 focus:outline-none"
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
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:ring-2 focus:ring-brand-500 focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Sucursal de Preferencia</label>
          <select
            value={branchId}
            onChange={(e) => setBranchId(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:ring-2 focus:ring-brand-500 focus:outline-none"
          >
            {branches.map((b) => (
              <option key={b.id} value={b.id}>{b.name} - {b.city}</option>
            ))}
          </select>
        </div>

        {/* Emergency contact */}
        <div className="pt-2 border-t border-slate-100">
          <label className="block text-xs font-bold text-slate-800 mb-2">Contacto de Emergencia</label>
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

        {/* Health declaration */}
        <div className="pt-2 border-t border-slate-100">
          <div className="flex items-center space-x-2 text-xs font-bold text-slate-800 mb-2">
            <HeartPulse className="w-4 h-4 text-rose-500" />
            <span>Ficha de Salud y Aptitud Física</span>
          </div>

          <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <label className="flex items-center justify-between text-xs font-medium text-slate-700 cursor-pointer">
              <span>¿Tienes alguna lesión, dolor o antecedente postural?</span>
              <input
                type="checkbox"
                checked={hasInjuries}
                onChange={(e) => setHasInjuries(e.target.checked)}
                className="rounded text-brand-600 w-4 h-4"
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
                className="rounded text-brand-600 w-4 h-4"
              />
            </label>

            <label className="flex items-center justify-between text-xs font-medium text-slate-700 cursor-pointer">
              <span className="flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-brand-600" />
                <span>¿Cuentas con certificado médico / apto físico al día?</span>
              </span>
              <input
                type="checkbox"
                checked={hasMedicalCertificate}
                onChange={(e) => setHasMedicalCertificate(e.target.checked)}
                className="rounded text-brand-600 w-4 h-4"
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

        {/* Submit */}
        <div className="pt-3">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 rounded-2xl text-xs font-extrabold shadow-md transition-all flex items-center justify-center space-x-2 bg-brand-600 hover:bg-brand-700 text-white cursor-pointer disabled:opacity-50"
          >
            {isSubmitting ? (
              <span>Enviando solicitud...</span>
            ) : (
              <>
                <span>Enviar Solicitud de Registro</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          <p className="text-[11px] text-slate-400 text-center mt-3">
            ¿Ya tienes cuenta?{' '}
            <button
              type="button"
              onClick={onGoToLogin}
              className="text-brand-700 font-bold underline cursor-pointer"
            >
              Ingresa a reservar
            </button>
          </p>
        </div>

      </form>
    </div>
  );
};
