import React, { useState } from 'react';
import { UserPlus, HeartPulse, CheckCircle2, Phone, Mail, User, ShieldCheck, ArrowRight } from 'lucide-react';
import { useStudioStore } from '../../store/studioStore';

interface StudentRegisterViewProps {
  onGoToLogin: () => void;
}

export const StudentRegisterView: React.FC<StudentRegisterViewProps> = ({ onGoToLogin }) => {
  const { studio, branches, submitStudentRegistration } = useStudioStore();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [idNumber, setIdNumber] = useState('');
  const [branchId, setBranchId] = useState(branches[0]?.id || '');
  const [emergencyName, setEmergencyName] = useState('');
  const [emergencyPhone, setEmergencyPhone] = useState('');
  
  // Health questionnaire
  const [hasInjuries, setHasInjuries] = useState(false);
  const [injuriesDetail, setInjuriesDetail] = useState('');
  const [isPregnant, setIsPregnant] = useState(false);
  const [medicalNotes, setMedicalNotes] = useState('');

  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitStudentRegistration({
      first_name: firstName,
      last_name: lastName,
      email,
      phone,
      id_number: idNumber,
      preferred_branch_id: branchId,
      emergency_contact_name: emergencyName,
      emergency_contact_phone: emergencyPhone,
      medical_notes: medicalNotes,
      medical_declaration: {
        has_injuries: hasInjuries,
        injuries_detail: injuriesDetail,
        has_hypertension: false,
        is_pregnant: isPregnant,
        taking_medications: false,
        has_cardiac_conditions: false,
      },
    });

    setIsSubmitted(true);
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
          Hola <strong>{firstName}</strong>, el equipo de <strong>{studio.name}</strong> revisará tu información y ficha de salud.
          <br /><br />
          Te enviaremos un mensaje de <strong>WhatsApp y correo electrónico</strong> en cuanto tu cuenta esté habilitada para que puedas reservar tu primera clase.
        </p>

        <button
          onClick={onGoToLogin}
          className="w-full py-3 bg-slate-900 hover:bg-black text-white text-xs font-extrabold rounded-2xl transition-all shadow-md"
        >
          Volver a la Pantalla Principal
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
          Completa tus datos personales y declaración de salud para que el profesor pueda adaptar tus clases
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Nombre</label>
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
            <label className="block text-xs font-bold text-slate-700 mb-1">Apellido</label>
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
            <label className="block text-xs font-bold text-slate-700 mb-1">WhatsApp (Celular)</label>
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
            <label className="block text-xs font-bold text-slate-700 mb-1">DNI / Documento</label>
            <input
              type="text"
              required
              placeholder="38.900.123"
              value={idNumber}
              onChange={(e) => setIdNumber(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:ring-2 focus:ring-brand-500 focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Correo Electrónico</label>
          <input
            type="email"
            required
            placeholder="tu.email@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:ring-2 focus:ring-brand-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Sucursal de Preferencia</label>
          <select
            value={branchId}
            onChange={(e) => setBranchId(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none"
          >
            {branches.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name} ({b.address})
              </option>
            ))}
          </select>
        </div>

        {/* Health Declaration */}
        <div className="pt-3 border-t border-slate-100">
          <div className="flex items-center space-x-2 text-xs font-bold text-rose-900 mb-3">
            <HeartPulse className="w-4 h-4 text-rose-600" />
            <span>Declaración de Salud & Apto Físico</span>
          </div>

          <div className="space-y-3 bg-rose-50/40 border border-rose-100 rounded-2xl p-4">
            <label className="flex items-center justify-between text-xs font-medium text-slate-700 cursor-pointer">
              <span>¿Tienes alguna lesión articular, muscular o dolor recurrente?</span>
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

            <textarea
              rows={2}
              placeholder="Otras observaciones para el profesor..."
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
            className="w-full py-3.5 bg-brand-600 hover:bg-brand-700 text-white rounded-2xl text-xs font-extrabold shadow-md transition-all flex items-center justify-center space-x-2"
          >
            <span>Enviar Solicitud de Registro</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <p className="text-[11px] text-slate-400 text-center mt-3">
            ¿Ya tienes cuenta?{' '}
            <button
              type="button"
              onClick={onGoToLogin}
              className="text-brand-700 font-bold underline"
            >
              Ingresa a reservar
            </button>
          </p>
        </div>

      </form>
    </div>
  );
};
