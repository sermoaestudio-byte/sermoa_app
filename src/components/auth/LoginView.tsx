import React, { useState } from 'react';
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  UserPlus
} from 'lucide-react';
import { useStudioStore } from '../../store/studioStore';
import { UserRole } from '../../types';

interface LoginViewProps {
  onLoginSuccess: (role: UserRole) => void;
  onGoToRegister: () => void;
}

export const LoginView: React.FC<LoginViewProps> = ({
  onLoginSuccess,
  onGoToRegister,
}) => {
  const { studio, loginWithSupabase, requestPasswordReset, setRole, setCurrentStudentId } = useStudioStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRecoveringPassword, setIsRecoveringPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    setIsSubmitting(true);

    if (isRecoveringPassword) {
      if (!email) {
        setErrorMessage('Por favor, ingresa tu correo electrónico.');
        setIsSubmitting(false);
        return;
      }
      const res = await requestPasswordReset(email);
      setIsSubmitting(false);
      if (res.success) {
        setSuccessMessage('Te hemos enviado un correo con las instrucciones para recuperar tu contraseña.');
      } else {
        setErrorMessage(res.message || 'Error al enviar el correo.');
      }
      return;
    }

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

  // Quick Demo Access Selector
  const handleQuickLogin = (role: UserRole, studentId?: string) => {
    setRole(role);
    if (studentId) setCurrentStudentId(studentId);
    onLoginSuccess(role);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-soft animate-fade-in space-y-6">
        
        {/* Brand Logo & Header */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 rounded-2xl mx-auto flex items-center justify-center shadow-md shadow-brand-600/20 bg-white p-1">
            <img src="/logo.png" alt="App Logo" className="w-full h-full object-contain rounded-xl" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              {isRecoveringPassword ? 'Recuperar Contraseña' : `Ingresar a ${studio.name}`}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              {isRecoveringPassword
                ? 'Ingresa tu correo y te enviaremos un enlace'
                : 'Accede a tu agenda de clases, reservas o panel de control'}
            </p>
          </div>
        </div>

        {/* Success Alert Message */}
        {successMessage && (
          <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-start space-x-2.5 text-xs text-emerald-800 animate-fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <p className="leading-relaxed font-semibold">{successMessage}</p>
          </div>
        )}

        {/* Error Alert Message */}
        {errorMessage && (
          <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl flex items-start space-x-2.5 text-xs text-rose-800 animate-fade-in">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <p className="leading-relaxed font-semibold">{errorMessage}</p>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
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

          {/* Password (Only if not recovering) */}
          {!isRecoveringPassword && (
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="font-bold text-slate-700">Contraseña</label>
                <button
                  type="button"
                  onClick={() => {
                    setIsRecoveringPassword(true);
                    setErrorMessage('');
                    setSuccessMessage('');
                  }}
                  className="text-[11px] font-bold text-brand-700 hover:text-brand-900"
                >
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
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-extrabold text-xs shadow-md shadow-brand-600/20 flex items-center justify-center space-x-2 transition-all"
          >
            {isSubmitting ? (
              <span>{isRecoveringPassword ? 'Enviando...' : 'Autenticando...'}</span>
            ) : (
              <>
                <span>{isRecoveringPassword ? 'Enviar enlace de recuperación' : 'Iniciar Sesión'}</span>
                {!isRecoveringPassword && <ArrowRight className="w-4 h-4" />}
              </>
            )}
          </button>

          {/* Back to Login */}
          {isRecoveringPassword && (
            <button
              type="button"
              onClick={() => {
                setIsRecoveringPassword(false);
                setErrorMessage('');
                setSuccessMessage('');
              }}
              className="w-full py-2 text-slate-500 hover:text-slate-700 font-semibold text-xs"
            >
              Volver al inicio de sesión
            </button>
          )}

        </form>



      </div>
    </div>
  );
};
