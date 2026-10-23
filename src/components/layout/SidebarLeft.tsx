import React from 'react';
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
  ShieldCheck
} from 'lucide-react';
import { useStudioStore } from '../../store/studioStore';

interface SidebarLeftProps {
  currentView: string;
  onNavigate: (view: string) => void;
}

export const SidebarLeft: React.FC<SidebarLeftProps> = ({ currentView, onNavigate }) => {
  const { studio, profiles, currentRole } = useStudioStore();

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

  const filteredItems = navItems;

  return (
    <aside className={`w-64 border-r flex flex-col justify-between shrink-0 min-h-screen sticky top-0 z-30 transition-colors bg-[#FAF8F5] border-[#E8D5B5]`}>

      {/* Brand Header */}
      <div>
        <div className="h-16 px-4 border-b border-[#E8D5B5] flex items-center justify-between">
          <button
            onClick={() => onNavigate('dashboard')}
            className="flex items-center space-x-2.5 group focus:outline-none text-left cursor-pointer"
          >
            <div className="w-9 h-9 rounded-xl bg-white border border-[#E8D5B5] flex items-center justify-center p-1 shadow-2xs group-hover:scale-105 transition-transform shrink-0">
              <img
                src={studio.logo_url || '/logo.png'}
                alt={studio.name}
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <span className="font-black text-[#44261B] text-sm tracking-tight block leading-tight">
                {studio.name || 'Sermoa'}
              </span>
              <span className="text-[9px] text-[#A68D74] font-bold uppercase tracking-wider block">
                Pilates & Studio
              </span>
            </div>
          </button>
        </div>

        {/* Nav list */}
        <nav className="px-2.5 py-3 space-y-1 max-h-[calc(100vh-220px)] overflow-y-auto">
          {filteredItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`w-full px-3 py-2.5 rounded-2xl text-left flex items-center justify-between transition-all group cursor-pointer ${
                  isActive
                    ? 'bg-[#5E612B] text-[#F4E8D1] shadow-xs'
                    : 'text-[#44261B] hover:text-[#5E612B] hover:bg-[#F4E8D1]/60'
                }`}
              >
                <div className="flex items-center space-x-3 min-w-0">
                  <div
                    className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                      isActive
                        ? 'bg-white/15 text-[#F4E8D1]'
                        : 'bg-[#F4E8D1] text-[#5E612B] group-hover:bg-[#E8D5B5]'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <div className="truncate">
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
                </div>

                {item.badge && (
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
            );
          })}
        </nav>
      </div>

      {/* Footer studio info */}
      <div className="p-3 border-t border-[#E8D5B5] bg-[#F4E8D1]/30 text-center">
        <span className="text-[10px] font-bold text-[#A68D74]">
          Panel de Operativa • Sermoa
        </span>
      </div>

    </aside>
  );
};
