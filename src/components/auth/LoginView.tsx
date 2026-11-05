import React, { useState, useRef, useEffect } from 'react';
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  MessageSquare,
  KeyRound,
  RotateCw,
  Phone,
  Sparkles
} from 'lucide-react';
import { useStudioStore } from '../../store/studioStore';
import { UserRole } from '../../types';

interface LoginViewProps {
  onLoginSuccess: (role: UserRole) => void;
  onGoToRegister: () => void;
  onGoToLanding?: () => void;
}

type RecoveryStep = 'phone_input' | 'otp_verify' | 'new_password' | 'success';

export const LoginView: React.FC<LoginViewProps> = ({
  onLoginSuccess,
  onGoToRegister,
  onGoToLanding,
}) => {
  const {
    studio,
    loginWithSupabase,
    requestWhatsAppOtp,
    verifyWhatsAppOtpAndResetPassword,
    setRole,
    setCurrentStudentId,
  } = useStudioStore();

  // Login form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Recovery wizard state
  const [isRecoveringPassword, setIsRecoveringPassword] = useState(false);
  const [recoveryStep, setRecoveryStep] = useState<RecoveryStep>('phone_input');
  const [phoneOrEmail, setPhoneOrEmail] = useState('');
  const [otpCode, setOtpCode] = useState(['', '', '', '', '', '']);
  const [mockOtpCode, setMockOtpCode] = useState<string | null>(null);
  const [recipientName, setRecipientName] = useState('');
  const [recipientPhone, setRecipientPhone] = useState('');
  const [countdown, setCountdown] = useState(600); // 10 minutes

  // New password state
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // OTP input refs
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Timer countdown for OTP
  useEffect(() => {
    let timer: any;
    if (isRecoveringPassword && recoveryStep === 'otp_verify' && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isRecoveringPassword, recoveryStep, countdown]);

  // Handle standard Login Submit
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    setIsSubmitting(true);

    try {
      const res = await loginWithSupabase(email, password);
      setIsSubmitting(false);

      if (res.success && res.role) {
        onLoginSuccess(res.role);
      } else {
        setErrorMessage(res.message || 'Credenciales inválidas. Por favor intenta nuevamente.');
      }
    } catch (err: any) {
      setIsSubmitting(false);
      setErrorMessage('Ocurrió un error al procesar el inicio de sesión. Intenta nuevamente.');
    }
  };

  // Step 1: Request OTP via WhatsApp
  const handleRequestOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!phoneOrEmail.trim()) {
      setErrorMessage('Por favor, ingresa tu número de WhatsApp o correo electrónico registrado.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await requestWhatsAppOtp(phoneOrEmail.trim());
      setIsSubmitting(false);

      if (res.success) {
        setMockOtpCode(res.mockCode || null);
        setRecipientName(res.name || '');
        setRecipientPhone(res.phone || phoneOrEmail);
        setCountdown(600); // Reset timer to 10 min
        setOtpCode(['', '', '', '', '', '']);
        setRecoveryStep('otp_verify');
        setSuccessMessage('Código de verificación generado.');
        setTimeout(() => {
          otpInputRefs.current[0]?.focus();
        }, 150);
      } else {
        setErrorMessage(res.message || 'No se pudo enviar el código. Verifica los datos ingresados.');
      }
    } catch (err: any) {
      setIsSubmitting(false);
      setErrorMessage('Error al solicitar el código. Intenta nuevamente.');
    }
  };

  // Step 2: Handle OTP input typing, backspace, and paste
  const handleOtpChange = (index: number, val: string) => {
    const digit = val.replace(/[^0-9]/g, '').slice(-1);
    const newOtp = [...otpCode];
    newOtp[index] = digit;
    setOtpCode(newOtp);

    // Auto-focus next box
    if (digit && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpCode[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasteText = e.clipboardData.getData('text').replace(/[^0-9]/g, '').slice(0, 6);
    if (pasteText) {
      const arr = ['', '', '', '', '', ''];
      pasteText.split('').forEach((char, i) => {
        if (i < 6) arr[i] = char;
      });
      setOtpCode(arr);
      const nextIdx = Math.min(pasteText.length, 5);
      otpInputRefs.current[nextIdx]?.focus();
    }
  };

  // Verify OTP button
  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    const fullCode = otpCode.join('');
    if (fullCode.length < 6) {
      setErrorMessage('Por favor ingresa los 6 dígitos del código.');
      return;
    }
    setRecoveryStep('new_password');
    setSuccessMessage('');
  };

  // Step 3: Set and confirm new password
  const handleResetPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (newPassword.length < 6) {
      setErrorMessage('La contraseña debe tener un mínimo de 6 caracteres.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage('Las contraseñas no coinciden. Verifícalas e inténtalo de nuevo.');
      return;
    }

    setIsSubmitting(true);
    const fullCode = otpCode.join('');

    try {
      const res = await verifyWhatsAppOtpAndResetPassword(phoneOrEmail, fullCode, newPassword);
      setIsSubmitting(false);

      if (res.success) {
        setRecoveryStep('success');
        setSuccessMessage('¡Contraseña actualizada con éxito!');
      } else {
        setErrorMessage(res.message || 'Código inválido o expirado.');
      }
    } catch (err: any) {
      setIsSubmitting(false);
      setErrorMessage('Ocurrió un error al restablecer la contraseña.');
    }
  };

  // Reset wizard back to login
  const resetRecoveryFlow = () => {
    setIsRecoveringPassword(false);
    setRecoveryStep('phone_input');
    setPhoneOrEmail('');
    setOtpCode(['', '', '', '', '', '']);
    setMockOtpCode(null);
    setNewPassword('');
    setConfirmPassword('');
    setErrorMessage('');
    setSuccessMessage('');
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-soft animate-fade-in space-y-6 relative">
        
        {/* Back navigation */}
        {isRecoveringPassword ? (
          <button
            onClick={resetRecoveryFlow}
            className="absolute top-6 left-6 text-slate-400 hover:text-slate-600 transition-colors flex items-center gap-1 text-xs font-bold"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver a Iniciar Sesión
          </button>
        ) : onGoToLanding ? (
          <button 
            onClick={onGoToLanding}
            className="absolute top-6 left-6 text-slate-400 hover:text-slate-600 transition-colors flex items-center gap-1 text-xs font-bold"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver
          </button>
        ) : null}

        {/* Brand Logo & Header */}
        <div className="text-center space-y-2 mt-4">
          <div className="w-20 h-20 mx-auto flex items-center justify-center p-1">
            <img src="/logo-login.png" alt="App Logo" className="w-full h-full object-contain" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              {isRecoveringPassword
                ? recoveryStep === 'success'
                  ? '¡Todo listo!'
                  : 'Recuperar Contraseña'
                : `Ingresar a ${studio.name}`}
            </h2>
            <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
              {!isRecoveringPassword && 'Accede a tu agenda de clases, reservas o panel de control'}
              {isRecoveringPassword && recoveryStep === 'phone_input' && 'Ingresá tu WhatsApp o correo para recibir tu código de seguridad OTP.'}
              {isRecoveringPassword && recoveryStep === 'otp_verify' && `Ingresá el código de 6 dígitos que enviamos a ${recipientPhone || phoneOrEmail}`}
              {isRecoveringPassword && recoveryStep === 'new_password' && 'Creá una nueva clave segura para acceder a tu cuenta.'}
              {isRecoveringPassword && recoveryStep === 'success' && 'Tu contraseña fue restablecida con éxito.'}
            </p>
          </div>
        </div>

        {/* Success Alert */}
        {successMessage && (
          <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-start space-x-2.5 text-xs text-emerald-800 animate-fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <p className="leading-relaxed font-semibold">{successMessage}</p>
          </div>
        )}

        {/* Error Alert */}
        {errorMessage && (
          <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl flex items-start space-x-2.5 text-xs text-rose-800 animate-fade-in">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <p className="leading-relaxed font-semibold">{errorMessage}</p>
          </div>
        )}

        {/* ======================================================== */}
        {/* RECOVERY FLOW                                            */}
        {/* ======================================================== */}
        {isRecoveringPassword ? (
          <div className="space-y-4">
            
            {/* ETAPA 1: INGRESO DE WHATSAPP / IDENTIFICADOR */}
            {recoveryStep === 'phone_input' && (
              <form onSubmit={handleRequestOtp} className="space-y-4 text-xs">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="font-bold text-slate-700">Número de WhatsApp o Celular</label>
                    <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      Envío Instantáneo
                    </span>
                  </div>
                  <div className="relative">
                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 flex items-center space-x-1 text-slate-400">
                      <MessageSquare className="w-4 h-4 text-emerald-600" />
                    </div>
                    <input
                      type="text"
                      required
                      placeholder="Ej: 3513802261 o tu@email.com"
                      value={phoneOrEmail}
                      onChange={(e) => setPhoneOrEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white"
                    />
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Podés ingresar tu número con o sin prefijo de país (+54 9), o el email de tu perfil.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 bg-[#5E612B] hover:bg-[#484a20] text-white rounded-xl font-extrabold text-xs shadow-md shadow-[#5E612B]/20 flex items-center justify-center space-x-2 transition-all disabled:opacity-50"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>{isSubmitting ? 'Verificando y enviando...' : 'Enviar Código por WhatsApp'}</span>
                </button>
              </form>
            )}

            {/* ETAPA 2: VALIDACIÓN DE CÓDIGO OTP (6 DÍGITOS) */}
            {recoveryStep === 'otp_verify' && (
              <form onSubmit={handleVerifyOtp} className="space-y-4 text-xs">
                {/* Banner Modo Prueba / Simulación antes de enlazar Meta API */}
                {mockOtpCode && (
                  <div className="p-3 bg-amber-50/90 border border-amber-200/80 rounded-2xl flex items-center justify-between text-xs text-amber-900 animate-fade-in">
                    <div className="flex items-center space-x-2">
                      <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
                      <div>
                        <p className="font-bold">Código de verificación para prueba:</p>
                        <p className="text-[11px] text-amber-700">Se enviará por WhatsApp una vez ingresado tu Token de Meta.</p>
                      </div>
                    </div>
                    <span className="font-mono text-base font-extrabold tracking-widest bg-amber-200/70 text-amber-950 px-2.5 py-1 rounded-lg border border-amber-300">
                      {mockOtpCode}
                    </span>
                  </div>
                )}

                <div>
                  <label className="block text-center font-bold text-slate-700 mb-3">
                    Ingresá el código de 6 dígitos
                  </label>

                  {/* 6 Casilleros OTP */}
                  <div className="flex items-center justify-center gap-2 sm:gap-2.5" onPaste={handleOtpPaste}>
                    {otpCode.map((digit, idx) => (
                      <input
                        key={idx}
                        ref={(el) => (otpInputRefs.current[idx] = el)}
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(idx, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                        className="w-10 sm:w-11 h-12 sm:h-13 text-center text-xl font-black text-slate-800 bg-[#FAF8F5] border-2 border-[#E8D5B5] rounded-xl focus:border-[#5E612B] focus:ring-2 focus:ring-[#5E612B]/20 outline-none transition-all shadow-inner"
                      />
                    ))}
                  </div>
                </div>

                {/* Temporizador y Reenvío */}
                <div className="flex items-center justify-between text-[11px] pt-1">
                  <span className="text-slate-400 font-medium">
                    Vence en: <strong className="text-slate-700 font-mono font-bold">
                      {Math.floor(countdown / 60)}:{(countdown % 60).toString().padStart(2, '0')}
                    </strong>
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRequestOtp()}
                    disabled={isSubmitting || countdown > 540}
                    className="text-[#5E612B] hover:text-[#484a20] font-bold flex items-center space-x-1 disabled:opacity-40"
                  >
                    <RotateCw className={`w-3 h-3 ${isSubmitting ? 'animate-spin' : ''}`} />
                    <span>Reenviar código</span>
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={otpCode.join('').length < 6}
                  className="w-full py-3 bg-[#5E612B] hover:bg-[#484a20] text-white rounded-xl font-extrabold text-xs shadow-md shadow-[#5E612B]/20 flex items-center justify-center space-x-2 transition-all disabled:opacity-40"
                >
                  <span>Continuar</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => {
                      setRecoveryStep('phone_input');
                      setErrorMessage('');
                    }}
                    className="text-[11px] text-slate-400 hover:text-slate-600 font-semibold"
                  >
                    ¿Número incorrecto? Cambiar WhatsApp
                  </button>
                </div>
              </form>
            )}

            {/* ETAPA 3: NUEVA CONTRASEÑA */}
            {recoveryStep === 'new_password' && (
              <form onSubmit={handleResetPasswordSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1.5">Nueva Contraseña</label>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      required
                      placeholder="Mínimo 6 caracteres"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                    >
                      {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1.5">Confirmar Contraseña</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      required
                      placeholder="Repite tu nueva contraseña"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || newPassword.length < 6 || newPassword !== confirmPassword}
                  className="w-full py-3 bg-[#5E612B] hover:bg-[#484a20] text-white rounded-xl font-extrabold text-xs shadow-md shadow-[#5E612B]/20 flex items-center justify-center space-x-2 transition-all disabled:opacity-40"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>{isSubmitting ? 'Guardando contraseña...' : 'Actualizar Contraseña'}</span>
                </button>
              </form>
            )}

            {/* ETAPA 4: ÉXITO */}
            {recoveryStep === 'success' && (
              <div className="text-center py-4 space-y-4">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-800">¡Contraseña Restablecida!</h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Ya podés iniciar sesión en SERMOA con tu nueva clave de acceso.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={resetRecoveryFlow}
                  className="w-full py-3 bg-[#5E612B] hover:bg-[#484a20] text-white rounded-xl font-extrabold text-xs shadow-md shadow-[#5E612B]/20 flex items-center justify-center space-x-2 transition-all"
                >
                  <span>Iniciar Sesión Ahora</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}

          </div>
        ) : (
          /* ======================================================== */
          /* REGULAR LOGIN FORM                                       */
          /* ======================================================== */
          <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
            
            {/* Email */}
            <div>
              <label className="block font-bold text-slate-700 mb-1.5">
                Correo Electrónico
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="tu@email.com o admin"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="font-bold text-slate-700">Contraseña</label>
                <button
                  type="button"
                  onClick={() => {
                    setIsRecoveringPassword(true);
                    setRecoveryStep('phone_input');
                    setPhoneOrEmail(email); // Pre-fill with entered email if any
                    setErrorMessage('');
                    setSuccessMessage('');
                  }}
                  className="text-[11px] font-bold text-[#5E612B] hover:text-[#484a20] flex items-center gap-1"
                >
                  <MessageSquare className="w-3 h-3 text-emerald-600" />
                  ¿Olvidaste tu contraseña?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-extrabold text-xs shadow-md shadow-brand-600/20 flex items-center justify-center space-x-2 transition-all"
            >
              {isSubmitting ? (
                <span>Autenticando...</span>
              ) : (
                <>
                  <span>Iniciar Sesión</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

          </form>
        )}

      </div>
    </div>
  );
};
