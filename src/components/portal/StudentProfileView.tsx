import React, { useRef, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import {
  Sparkles,
  Navigation,
  Camera,
  CheckCircle2,
  Calendar,
  CreditCard,
  Heart,
  QrCode,
  ShieldCheck,
  User,
  ChevronRight,
  Target,
  Award,
  ArrowLeft,
  Flame,
  Info
} from 'lucide-react';
import { Profile, Studio } from '../../types';
import { useStudioStore } from '../../store/studioStore';

interface StudentProfileViewProps {
  student: Profile;
  studio: Studio;
  onBackToHome: () => void;
  onOpenCheckinGPS: () => void;
}

export const StudentProfileView: React.FC<StudentProfileViewProps> = ({
  student,
  studio,
  onBackToHome,
  onOpenCheckinGPS,
}) => {
  const { updateStudent } = useStudioStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showQRModal, setShowQRModal] = useState(false);
  const [photoSavedToast, setPhotoSavedToast] = useState(false);
  const [isEditingGoal, setIsEditingGoal] = useState(false);
  const [goalText, setGoalText] = useState(
    student.medical_notes || 'Tonificación general, postura y bienestar integral en Pilates Reformer.'
  );

  // QR Token
  const qrPassPayload = JSON.stringify({
    student_id: student.id,
    dni: student.id_number || '38921450',
    name: `${student.first_name} ${student.last_name}`,
    token: `SERMOA-PASS-${student.id}-${Date.now().toString().slice(-4)}`,
  });

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2.5 * 1024 * 1024) {
        alert('Por favor selecciona una foto de menos de 2.5MB');
        return;
      }
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        const base64 = uploadEvent.target?.result as string;
        if (base64) {
          updateStudent(student.id, { avatar_url: base64 });
          setPhotoSavedToast(true);
          setTimeout(() => setPhotoSavedToast(false), 3000);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveGoal = () => {
    updateStudent(student.id, { medical_notes: goalText });
    setIsEditingGoal(false);
  };

  const isUnlimited = student.credits_balance === 999;
  const isUpToDate = (student.debt_amount ?? 0) <= 0;

  return (
    <div className="max-w-md mx-auto space-y-6 animate-fade-in pb-12">
      {/* Toast Notification */}
      {photoSavedToast && (
        <div className="fixed top-5 right-5 z-50 bg-[#5E612B] text-[#F4E8D1] px-4 py-2.5 rounded-2xl shadow-lg flex items-center space-x-2 text-xs font-bold animate-fade-in border border-[#E8D5B5]">
          <CheckCircle2 className="w-4 h-4 text-[#F4E8D1]" />
          <span>¡Foto de credencial actualizada!</span>
        </div>
      )}

      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handlePhotoUpload}
        accept="image/*"
        className="hidden"
      />

      {/* Top Navigation Bar with Back Button */}
      <div className="flex items-center justify-between pt-1">
        <button
          onClick={onBackToHome}
          className="flex items-center space-x-2 text-xs font-bold text-[#5E612B] hover:text-[#44261B] bg-white px-3.5 py-2 rounded-xl border border-[#E8D5B5] shadow-2xs transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver al Inicio</span>
        </button>

        <span className="text-xs font-black uppercase tracking-wider text-[#A68D74]">
          Mi Perfil
        </span>
      </div>

      {/* ============================================================== */}
      {/* 1. MEMBER PASS CARD (Paleta Otoño: Oliva, Camel, Mostaza, Marfil, Terracota) */}
      {/* ============================================================== */}
      <div className="relative rounded-[28px] overflow-hidden shadow-soft-lg border border-[#E8D5B5] transition-all hover:shadow-xl group">
        
        {/* Pass Top Banner */}
        <div
          className="relative p-6 sm:p-7 text-white"
          style={{
            background: 'linear-gradient(135deg, #44261B 0%, #5E612B 40%, #545D31 70%, #C18749 100%)',
          }}
        >
          {/* Subtle decorative watercolor orbs & silhouette watermark */}
          <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-[#D98E2A]/20 blur-2xl pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-44 h-44 rounded-full bg-[#E8D5B5]/25 blur-xl pointer-events-none" />
          
          {/* Subtle Pilates Silhouette in Card Banner */}
          <img
            src="/pilates-silhouette.png"
            alt=""
            className="absolute -right-4 -bottom-6 w-44 h-44 opacity-15 pointer-events-none select-none invert"
          />

          {/* Card Top Row */}
          <div className="relative z-10 flex items-start justify-between">
            <div>
              <div className="flex items-center space-x-2">
                <span className="tracking-[0.2em] uppercase text-[11px] font-black text-[#F4E8D1]">
                  {studio.name || 'SERMOA'}
                </span>
                <span className="text-[10px] text-[#E8D5B5]/80 font-semibold">• ESTUDIO</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight mt-1 text-[#F4E8D1] uppercase drop-shadow-xs">
                MEMBER PASS
              </h2>
            </div>

            {/* Category Badge */}
            <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-black/25 backdrop-blur-md border border-[#F4E8D1]/30 text-[#F4E8D1] text-[10px] font-extrabold uppercase tracking-wider shadow-inner">
              <Sparkles className="w-3 h-3 text-[#D98E2A]" />
              <span>{isUnlimited ? 'VIP GOLD' : 'SERMOA CLUB'}</span>
            </div>
          </div>

          {/* Card Center: Categoria Inicial & Requisito de Renovación Continua (Estilo exacto foto 2) */}
          <div className="relative z-10 my-5 flex items-center justify-between gap-4">
            {/* Heart Emblem Metallic Style */}
            <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl bg-white/10 backdrop-blur-md border border-[#F4E8D1]/30 flex items-center justify-center shadow-soft flex-shrink-0">
              <Heart className="w-8 h-8 sm:w-9 sm:h-9 text-[#F4E8D1] fill-[#D98E2A]/50 stroke-[1.8]" />
            </div>

            {/* Text Block matching Foto 2 */}
            <div className="flex-1 min-w-0">
              <p className="text-xs sm:text-[13px] font-black text-[#F4E8D1] tracking-tight">
                Estás en la <span className="underline decoration-[#D98E2A] underline-offset-2">categoría inicial</span>.
              </p>
              
              {/* Subtle line with small center heart divider */}
              <div className="relative my-2 flex items-center">
                <div className="flex-grow border-t border-[#F4E8D1]/25"></div>
                <span className="flex-shrink mx-2 text-[10px] text-[#D98E2A]">🤍</span>
                <div className="flex-grow border-t border-[#F4E8D1]/25"></div>
              </div>

              <p className="text-[11px] text-[#F4E8D1]/90 leading-snug">
                Para subir de categoría, deberás llegar a los <strong className="font-extrabold text-[#F4E8D1]">cuatro meses</strong> de renovación continua.
              </p>
            </div>
          </div>

          {/* Decorative Divider */}
          <div className="relative z-10 border-t border-[#F4E8D1]/20 pt-3 flex items-center justify-between text-[11px] text-[#F4E8D1]/80 font-medium">
            <span>Sede Principal & Red Sermoa</span>
            <span className="text-[#F4E8D1] font-bold">2026 Pass</span>
          </div>
        </div>

        {/* Pass Bottom Card */}
        <div className="bg-[#FAF8F5] p-5 sm:p-6 border-t border-[#E8D5B5]">
          <div className="flex items-center space-x-4">
            
            {/* Student Photo Avatar with Upload Trigger */}
            <div className="relative group/avatar flex-shrink-0">
              <div className="w-20 h-20 sm:w-22 sm:h-22 rounded-2xl overflow-hidden border-2 border-white shadow-soft bg-[#F4E8D1] flex items-center justify-center">
                {student.avatar_url ? (
                  <img
                    src={student.avatar_url}
                    alt={`${student.first_name} ${student.last_name}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-[#5E612B] bg-gradient-to-br from-[#F4E8D1] to-[#E8D5B5]">
                    <User className="w-8 h-8 text-[#5E612B]" />
                    <span className="text-[9px] font-bold mt-1 text-[#44261B]">Subir foto</span>
                  </div>
                )}
              </div>

              {/* Camera Button overlay */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                title="Subir o cambiar foto de credencial"
                className="absolute -bottom-1 -right-1 p-1.5 bg-[#5E612B] hover:bg-[#44261B] text-white rounded-xl shadow-md border-2 border-white transition-transform hover:scale-110 flex items-center justify-center cursor-pointer"
              >
                <Camera className="w-3.5 h-3.5 text-[#F4E8D1]" />
              </button>
            </div>

            {/* Student Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#A68D74]">
                  Alumno / Titular
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-black text-[#44261B] truncate uppercase tracking-tight">
                {student.last_name ? `${student.last_name}, ${student.first_name}` : student.first_name}
              </h3>
              <p className="text-xs text-[#5E612B] font-medium mt-0.5">
                DNI: <span className="font-bold text-[#44261B]">{student.id_number || 'No especificado'}</span>
              </p>
              
              <div className="mt-2 flex items-center flex-wrap gap-1.5">
                <span className="inline-flex items-center space-x-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#F4E8D1] text-[#44261B] border border-[#E8D5B5]">
                  <span>Nivel:</span>
                  <span className="text-[#B74E2A] font-black">{isUnlimited ? 'VIP GOLD' : 'SERMOA'}</span>
                </span>
                <span className="text-[10px] font-semibold text-[#A68D74]">
                  • Sin vencimiento
                </span>
              </div>
            </div>
          </div>

          {/* Quick Credential Action Buttons */}
          <div className="mt-5 grid grid-cols-2 gap-2.5">
            <button
              onClick={() => setShowQRModal(true)}
              className="py-3 px-3 bg-[#5E612B] hover:bg-[#44261B] text-[#F4E8D1] rounded-2xl text-xs font-extrabold shadow-sm transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
            >
              <QrCode className="w-4 h-4 text-[#F4E8D1]" />
              <span>Ver QR de Ingreso</span>
            </button>

            <button
              onClick={onOpenCheckinGPS}
              className="py-3 px-3 bg-[#F4E8D1]/60 hover:bg-[#F4E8D1] text-[#44261B] border border-[#E8D5B5] rounded-2xl text-xs font-extrabold transition-all flex items-center justify-center space-x-1.5 shadow-2xs cursor-pointer"
            >
              <Navigation className="w-4 h-4 text-[#B74E2A]" />
              <span>Check-in GPS</span>
            </button>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 2. PLAN ACTUAL & DETALLES DE MEMBRESÍA */}
      {/* ============================================================== */}
      <div className="bg-white rounded-3xl p-5 border border-[#E8D5B5] shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-[#E8D5B5]/60 pb-3">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#F4E8D1] border border-[#E8D5B5] text-[#5E612B] flex items-center justify-center">
              <Award className="w-5 h-5 text-[#5E612B]" />
            </div>
            <div>
              <h4 className="text-xs font-black uppercase text-[#44261B] tracking-wider">
                Plan Actual
              </h4>
              <span className="text-[11px] text-[#A68D74]">
                Detalle de tu suscripción en Sermoa
              </span>
            </div>
          </div>
          <span className="text-[10px] font-black uppercase px-2.5 py-1 rounded-full bg-[#F4E8D1] text-[#5E612B] border border-[#E8D5B5]">
            Activo
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-1">
          <div className="p-3 bg-[#F7F3EC] rounded-2xl border border-[#E8D5B5]/60">
            <span className="text-[10px] text-[#A68D74] block uppercase font-bold">Tipo de Pase</span>
            <span className="text-sm font-extrabold text-[#44261B] block mt-0.5">
              {isUnlimited ? 'Pase Libre Mensual' : 'Pack Clases Activas'}
            </span>
          </div>

          <div className="p-3 bg-[#F7F3EC] rounded-2xl border border-[#E8D5B5]/60">
            <span className="text-[10px] text-[#A68D74] block uppercase font-bold">Saldo Restante</span>
            <span className="text-sm font-black text-[#5E612B] block mt-0.5">
              {isUnlimited ? 'Ilimitado' : `${student.credits_balance ?? 0} clases`}
            </span>
          </div>

          <div className="p-3 bg-[#F7F3EC] rounded-2xl border border-[#E8D5B5]/60">
            <span className="text-[10px] text-[#A68D74] block uppercase font-bold">Estado de Cuota</span>
            <span className={`text-xs font-bold block mt-0.5 ${isUpToDate ? 'text-[#5E612B]' : 'text-[#B74E2A]'}`}>
              {isUpToDate ? 'Al Día (Sin deuda)' : `Pendiente $${student.debt_amount}`}
            </span>
          </div>

          <div className="p-3 bg-[#F7F3EC] rounded-2xl border border-[#E8D5B5]/60">
            <span className="text-[10px] text-[#A68D74] block uppercase font-bold">Vigencia</span>
            <span className="text-xs font-bold text-[#44261B] block mt-0.5">
              Renovación continua
            </span>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 3. OBJETIVO DEL ALUMNO (Editable & Personalizado) */}
      {/* ============================================================== */}
      <div className="bg-white rounded-3xl p-5 border border-[#E8D5B5] shadow-xs space-y-3">
        <div className="flex items-center justify-between border-b border-[#E8D5B5]/60 pb-3">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#F7F3EC] border border-[#E8D5B5] text-[#B74E2A] flex items-center justify-center">
              <Target className="w-5 h-5 text-[#B74E2A]" />
            </div>
            <div>
              <h4 className="text-xs font-black uppercase text-[#44261B] tracking-wider">
                Mi Objetivo
              </h4>
              <span className="text-[11px] text-[#A68D74]">
                Meta de entrenamiento & acondicionamiento
              </span>
            </div>
          </div>

          <button
            onClick={() => {
              if (isEditingGoal) {
                handleSaveGoal();
              } else {
                setIsEditingGoal(true);
              }
            }}
            className="text-[11px] font-bold text-[#5E612B] hover:text-[#44261B] underline cursor-pointer"
          >
            {isEditingGoal ? 'Guardar' : 'Editar'}
          </button>
        </div>

        {isEditingGoal ? (
          <div className="space-y-2 pt-1">
            <textarea
              value={goalText}
              onChange={(e) => setGoalText(e.target.value)}
              rows={3}
              className="w-full text-xs p-3 border border-[#E8D5B5] rounded-xl focus:outline-none focus:ring-1 focus:ring-[#5E612B] text-[#44261B]"
              placeholder="Escribe tu objetivo personal aquí..."
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setIsEditingGoal(false)}
                className="px-3 py-1.5 text-xs text-[#A68D74] hover:text-[#44261B]"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveGoal}
                className="px-3.5 py-1.5 bg-[#5E612B] text-[#F4E8D1] text-xs font-bold rounded-xl"
              >
                Guardar Objetivo
              </button>
            </div>
          </div>
        ) : (
          <div className="p-3.5 bg-[#F4E8D1]/40 rounded-2xl border border-[#E8D5B5]/60 flex items-start space-x-3">
            <Flame className="w-4 h-4 text-[#D98E2A] flex-shrink-0 mt-0.5" />
            <p className="text-xs text-[#44261B] font-medium leading-relaxed">
              {student.medical_notes || 'Tonificación general, postura y bienestar integral en Pilates Reformer.'}
            </p>
          </div>
        )}
      </div>

      {/* ============================================================== */}
      {/* 4. MODAL DE QR DE INGRESO */}
      {/* ============================================================== */}
      {showQRModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-sm w-full text-center shadow-2xl border border-[#E8D5B5]">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#44261B] bg-[#F4E8D1] px-3 py-1 rounded-full border border-[#E8D5B5]">
                Pase de Acceso Sermoa
              </span>
              <button
                onClick={() => setShowQRModal(false)}
                className="text-[#A68D74] hover:text-[#44261B] text-sm font-bold p-1 rounded-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            <h3 className="text-lg font-black text-[#44261B]">
              {student.first_name} {student.last_name}
            </h3>
            <p className="text-xs text-[#5E612B] mb-4">
              DNI: {student.id_number || '38.921.450'}
            </p>

            <div className="p-4 bg-[#F7F3EC] border-2 border-dashed border-[#E8D5B5] rounded-3xl inline-block shadow-inner my-2">
              <QRCodeSVG
                value={qrPassPayload}
                size={190}
                level="H"
                includeMargin={true}
              />
            </div>

            <p className="text-[11px] text-[#A68D74] mt-3 leading-relaxed">
              Muestra este código al profesor o acerca tu pantalla al tótem de recepción al ingresar.
            </p>

            <button
              onClick={() => setShowQRModal(false)}
              className="mt-5 w-full py-3 bg-[#5E612B] hover:bg-[#44261B] text-[#F4E8D1] font-extrabold text-xs rounded-2xl transition-colors cursor-pointer"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
