import React from 'react';
import { ShieldCheck, UserCheck, Smartphone, RefreshCw } from 'lucide-react';
import { useStudioStore } from '../../store/studioStore';
import { UserRole } from '../../types';

interface RoleSwitcherProps {
  onNavigate: (view: string) => void;
}

export const RoleSwitcher: React.FC<RoleSwitcherProps> = ({ onNavigate }) => {
  const { currentRole, setRole, resetToDemoData } = useStudioStore();

  const handleRoleChange = (newRole: UserRole) => {
    setRole(newRole);
    if (newRole === 'client') {
      onNavigate('portal-alumno');
    } else if (newRole === 'instructor') {
      onNavigate('attendance');
    } else {
      onNavigate('dashboard');
    }
  };

  return (
    <aside aria-label="Simulador de roles" className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 bg-slate-900/90 backdrop-blur-md text-white px-3.5 py-2 rounded-full shadow-2xl border border-slate-700/80 flex items-center space-x-2 text-xs font-semibold">
      <span className="text-slate-400 font-medium px-1 hidden sm:inline text-[11px] uppercase tracking-wider">
        Vista:
      </span>

      {/* Admin Button */}
      <button
        onClick={() => handleRoleChange('admin')}
        className={`px-3 py-1 rounded-full flex items-center space-x-1.5 transition-all ${
          currentRole === 'admin'
            ? 'bg-purple-600 text-white shadow-md'
            : 'text-slate-300 hover:text-white hover:bg-slate-800'
        }`}
      >
        <ShieldCheck className="w-3.5 h-3.5" />
        <span>Admin</span>
      </button>

      {/* Instructor Button */}
      <button
        onClick={() => handleRoleChange('instructor')}
        className={`px-3 py-1 rounded-full flex items-center space-x-1.5 transition-all ${
          currentRole === 'instructor'
            ? 'bg-brand-600 text-white shadow-md'
            : 'text-slate-300 hover:text-white hover:bg-slate-800'
        }`}
      >
        <UserCheck className="w-3.5 h-3.5" />
        <span>Profesor</span>
      </button>

      {/* Student Portal Button */}
      <button
        onClick={() => handleRoleChange('client')}
        className={`px-3 py-1 rounded-full flex items-center space-x-1.5 transition-all ${
          currentRole === 'client'
            ? 'bg-emerald-500 text-white shadow-md'
            : 'text-slate-300 hover:text-white hover:bg-slate-800'
        }`}
      >
        <Smartphone className="w-3.5 h-3.5" />
        <span>Alumno (App)</span>
      </button>

      <div className="h-4 w-px bg-slate-700 mx-1"></div>

      {/* Reset Demo Button */}
      <button
        onClick={() => {
          if (window.confirm('¿Deseas restaurar todos los datos de demostración iniciales?')) {
            resetToDemoData();
            onNavigate('dashboard');
          }
        }}
        className="p-1 text-slate-400 hover:text-slate-200 transition-colors"
        title="Restaurar datos de prueba"
      >
        <RefreshCw className="w-3.5 h-3.5" />
      </button>
    </aside>
  );
};
