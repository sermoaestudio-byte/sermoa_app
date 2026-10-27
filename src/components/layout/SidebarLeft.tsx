import React, { useState } from 'react';
import {
  LayoutDashboard,
  Calendar,
  Users,
  ClipboardList,
  UserCheck,
  MapPin,
  Dumbbell,
  Wallet,
  Settings,
  BarChart3,
  ChevronRight,
  ChevronLeft,
  ShieldCheck,
  Ticket
} from 'lucide-react';
import { useStudioStore } from '../../store/studioStore';

interface SidebarLeftProps {
  currentView: string;
  onNavigate: (view: string) => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export const SidebarLeft: React.FC<SidebarLeftProps> = ({
  currentView,
  onNavigate,
  isCollapsed: controlledCollapsed,
  onToggleCollapse: controlledToggle,
}) => {
  const { studio, profiles, currentRole } = useStudioStore();

  const [internalCollapsed, setInternalCollapsed] = useState<boolean>(() => {
    try {
      return localStorage.getItem('sermoa_sidebar_collapsed') === 'true';
    } catch {
      return false;
    }
  });

  const isCollapsed = controlledCollapsed !== undefined ? controlledCollapsed : internalCollapsed;

  const toggleCollapsed = () => {
    if (controlledToggle) {
      controlledToggle();
    } else {
      setInternalCollapsed((prev) => {
        const next = !prev;
        try {
          localStorage.setItem('sermoa_sidebar_collapsed', String(next));
        } catch {}
        return next;
      });
    }
  };

  const pendingStudents = profiles.filter((p) => p.status === 'pending_approval');

  const navItems = [
    {
      id: 'dashboard',
      label: 'Inicio',
      description: 'Panel general',
      icon: LayoutDashboard,
      roles: ['admin', 'instructor'],
    },
    {
      id: 'classes',
      label: 'Clases y reservas',
      description: 'Horarios, cupos y calendario',
      icon: Calendar,
      roles: ['admin', 'instructor'],
    },
    {
      id: 'students',
      label: 'Alumnos',
      description: 'Saldos, perfiles y CRM',
      icon: Users,
      badge: pendingStudents.length > 0 ? `${pendingStudents.length} req` : undefined,
      roles: ['admin', 'instructor'],
    },
    {
      id: 'packs',
      label: 'Packs y Tarifas',
      description: 'Membresías y precios MP',
      icon: Ticket,
      roles: ['admin'],
    },
    {
      id: 'attendance',
      label: 'Pasar lista',
      description: 'Asistencia rápida del día',
      icon: ClipboardList,
      roles: ['admin', 'instructor'],
    },
    {
      id: 'instructors',
      label: 'Profesores',
      description: 'Staff, roles y asignaciones',
      icon: UserCheck,
      roles: ['admin', 'instructor'],
    },
    {
      id: 'branches',
      label: 'Sucursales',
      description: 'Sedes, salas y GPS',
      icon: MapPin,
      roles: ['admin', 'instructor'],
    },
    {
      id: 'routines',
      label: 'Rutinas',
      description: 'Planes de entrenamiento',
      icon: Dumbbell,
      roles: ['admin', 'instructor'],
    },
    {
      id: 'history',
      label: 'Historial de movimientos',
      description: 'Auditoría y compras',
      icon: Wallet,
      roles: ['admin', 'instructor'],
    },
  ];

  const filteredItems = navItems.filter((item) => item.roles.includes(currentRole || 'admin'));

  return (
    <aside
      className={`${
        isCollapsed ? 'w-20' : 'w-64'
      } border-r flex flex-col justify-between shrink-0 h-screen sticky top-0 z-30 transition-all duration-300 ease-in-out bg-[#FAF8F5] border-[#E8D5B5] relative select-none`}
    >
      {/* Botón flotante en el centro vertical del borde derecho */}
      <button
        type="button"
        onClick={toggleCollapsed}
        aria-label={isCollapsed ? 'Expandir menú lateral' : 'Contraer menú lateral'}
        title={isCollapsed ? 'Expandir menú' : 'Contraer menú'}
        className="absolute -right-3.5 top-1/2 -translate-y-1/2 z-40 w-7 h-7 bg-white border border-[#E8D5B5] text-[#5E612B] hover:text-[#44261B] hover:bg-[#F4E8D1] rounded-full shadow-md flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 focus:outline-none cursor-pointer"
      >
        {isCollapsed ? (
          <ChevronRight className="w-4 h-4 stroke-[2.5]" />
        ) : (
          <ChevronLeft className="w-4 h-4 stroke-[2.5]" />
        )}
      </button>

      {/* Brand Header */}
      <div>
        <div className={`h-16 border-b border-[#E8D5B5] flex items-center ${isCollapsed ? 'justify-center px-2' : 'justify-between px-4'}`}>
          <button
            onClick={() => onNavigate('dashboard')}
            className={`flex items-center ${isCollapsed ? 'justify-center' : 'space-x-2.5'} group focus:outline-none text-left cursor-pointer overflow-hidden`}
            title="Ir al Inicio"
          >
            <div className="w-9 h-9 rounded-xl bg-white border border-[#E8D5B5] flex items-center justify-center p-1 shadow-2xs group-hover:scale-105 transition-transform shrink-0">
              <img
                src={studio.logo_url || '/logo.png'}
                alt={studio.name}
                className="w-full h-full object-contain"
              />
            </div>
            {!isCollapsed && (
              <div className="truncate min-w-0 transition-opacity duration-200">
                <span className="font-black text-[#44261B] text-sm tracking-tight block leading-tight truncate">
                  {studio.name || 'Sermoa'}
                </span>
                <span className="text-[9px] text-[#A68D74] font-bold uppercase tracking-wider block truncate">
                  Pilates & Studio
                </span>
              </div>
            )}
          </button>
        </div>

        {/* Nav list */}
        <nav className={`py-3 space-y-1.5 max-h-[calc(100vh-140px)] overflow-y-auto ${isCollapsed ? 'px-2' : 'px-2.5'}`}>
          {filteredItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;

            return (
              <div key={item.id} className="relative group">
                <button
                  onClick={() => onNavigate(item.id)}
                  className={`w-full rounded-2xl transition-all cursor-pointer flex items-center ${
                    isCollapsed
                      ? 'h-11 justify-center px-0'
                      : 'px-3 py-2.5 justify-between'
                  } ${
                    isActive
                      ? 'bg-[#5E612B] text-[#F4E8D1] shadow-xs'
                      : 'text-[#44261B] hover:text-[#5E612B] hover:bg-[#F4E8D1]/60'
                  }`}
                  title={isCollapsed ? item.label : undefined}
                >
                  <div className={`flex items-center min-w-0 ${isCollapsed ? 'justify-center' : 'space-x-3'}`}>
                    <div
                      className={`relative rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                        isCollapsed ? 'w-8 h-8' : 'w-7 h-7'
                      } ${
                        isActive
                          ? 'bg-white/15 text-[#F4E8D1]'
                          : 'bg-[#F4E8D1] text-[#5E612B] group-hover:bg-[#E8D5B5]'
                      }`}
                    >
                      <Icon className={isCollapsed ? 'w-4 h-4' : 'w-3.5 h-3.5'} />
                      
                      {/* Indicador tipo punto en modo contraído si tiene badge */}
                      {isCollapsed && item.badge && (
                        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#C18749] border-2 border-[#FAF8F5] rounded-full shadow-xs" />
                      )}
                    </div>

                    {!isCollapsed && (
                      <div className="truncate text-left min-w-0">
                        <span className="text-xs font-bold block leading-snug truncate">
                          {item.label}
                        </span>
                        <span
                          className={`text-[10px] block leading-none truncate ${
                            isActive ? 'text-[#F4E8D1]/80' : 'text-[#A68D74]'
                          }`}
                        >
                          {item.description}
                        </span>
                      </div>
                    )}
                  </div>

                  {!isCollapsed && item.badge && (
                    <span
                      className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded-full shrink-0 ${
                        isActive
                          ? 'bg-[#F4E8D1] text-[#44261B]'
                          : 'bg-[#F4E8D1] text-[#5E612B] border border-[#E8D5B5]'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>

                {/* Floating tooltip al pasar el cursor cuando está contraído */}
                {isCollapsed && (
                  <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-[#44261B] text-[#FAF8F5] text-xs font-bold rounded-xl shadow-xl whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 flex items-center space-x-2 border border-[#E8D5B5]/20">
                    <span>{item.label}</span>
                    {item.badge && (
                      <span className="bg-[#C18749] text-white text-[9px] font-black px-1.5 py-0.5 rounded-full">
                        {item.badge}
                      </span>
                    )}
                    <div className="absolute top-1/2 -left-1 -translate-y-1/2 w-2 h-2 bg-[#44261B] rotate-45" />
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </div>

      {/* Footer studio info */}
      <div className="p-3 border-t border-[#E8D5B5] bg-[#F4E8D1]/30 text-center transition-all overflow-hidden">
        {isCollapsed ? (
          <span className="text-[10px] font-black text-[#A68D74] block" title="Sermoa Studio">
            S
          </span>
        ) : (
          <span className="text-[10px] font-bold text-[#A68D74] block truncate">
            Panel de Operativa • Sermoa
          </span>
        )}
      </div>

    </aside>
  );
};
