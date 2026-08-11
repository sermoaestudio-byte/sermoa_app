import React from 'react';
import { ShieldAlert, ArrowLeft, Lock, Home, UserCheck, Smartphone } from 'lucide-react';
import { useStudioStore } from '../../store/studioStore';
import { UserRole } from '../../types';

interface AccessDeniedViewProps {
  requiredRole?: 'admin' | 'instructor' | 'auth';
  onNavigate: (view: string) => void;
}

export const AccessDeniedView: React.FC<AccessDeniedViewProps> = ({
  requiredRole = 'admin',
  onNavigate,
}) => {
  const { currentRole, studio } = useStudioStore();

  const getRoleLabel = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return 'Administrador';
      case 'instructor':
        return 'Profesor / Staff';
      case 'client':
        return 'Alumno';
      default:
        return 'Usuario';
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4 sm:p-6 animate-fade-in text-center">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-rose-200/80 shadow-2xl space-y-6">
        
        {/* Shield Alert Icon with Glowing Effect */}
        <div className="relative mx-auto w-20 h-20">
          <div className="absolute inset-0 bg-rose-500/20 rounded-3xl blur-xl animate-pulse" />
          <div className="relative w-20 h-20 bg-rose-50 border-2 border-rose-200 text-rose-600 rounded-3xl flex items-center justify-center shadow-md">
            <ShieldAlert className="w-10 h-10" />
          </div>
        </div>

        {/* Text Details */}
        <div className="space-y-2">
          <span className="text-[11px] font-black uppercase tracking-widest text-rose-600 bg-rose-50 px-3 py-1 rounded-full border border-rose-200">
            Error 403 • Acceso Prohibido
          </span>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Acceso Denegado
          </h2>
          <p className="text-xs text-slate-500 leading-relaxed max-w-sm mx-auto">
            No tienes los permisos necesarios para acceder a esta sección o la URL fue modificada manualmente.
          </p>
        </div>

        {/* Current State Info Box */}
        <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-2xl text-left space-y-1.5 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-slate-500 font-bold">Estudio:</span>
            <span className="font-extrabold text-slate-800">{studio.name}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-500 font-bold">Tu Perfil Actual:</span>
            <span className="font-extrabold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-lg border border-rose-100 uppercase text-[10px]">
              {getRoleLabel(currentRole)}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-500 font-bold">Permiso Requerido:</span>
            <span className="font-extrabold text-slate-700 bg-slate-200/70 px-2 py-0.5 rounded-lg uppercase text-[10px]">
              {requiredRole === 'admin' ? 'Solo Administradores' : requiredRole === 'instructor' ? 'Staff / Profesores' : 'Inicio de Sesión'}
            </span>
          </div>
        </div>

        {/* Redirection Actions */}
        <div className="pt-2 flex flex-col gap-2.5">
          {currentRole === 'client' ? (
            <button
              onClick={() => onNavigate('portal-alumno')}
              className="w-full py-3 px-4 bg-brand-600 hover:bg-brand-700 text-white font-extrabold text-xs rounded-2xl transition-all shadow-md flex items-center justify-center space-x-2"
            >
              <Smartphone className="w-4 h-4" />
              <span>Volver a Mi Portal del Alumno</span>
            </button>
          ) : (
            <button
              onClick={() => onNavigate('dashboard')}
              className="w-full py-3 px-4 bg-slate-900 hover:bg-black text-white font-extrabold text-xs rounded-2xl transition-all shadow-md flex items-center justify-center space-x-2"
            >
              <Home className="w-4 h-4" />
              <span>Volver al Inicio</span>
            </button>
          )}

          <button
            onClick={() => onNavigate('login')}
            className="w-full py-2.5 px-4 bg-white hover:bg-slate-50 text-slate-600 font-bold text-xs rounded-xl border border-slate-200 transition-colors flex items-center justify-center space-x-1.5"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Iniciar Sesión con Otra Cuenta</span>
          </button>
        </div>

      </div>
    </div>
  );
};
