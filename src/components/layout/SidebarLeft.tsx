import React, { useState, useRef, useEffect } from 'react';
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
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  Ticket,
  Bell,
  LogOut,
  Smartphone,
  User,
  CheckCircle2,
  X
} from 'lucide-react';
import { useStudioStore } from '../../store/studioStore';
import { useConfirm } from '../../contexts/ConfirmContext';

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
  const { studio, profiles, currentRole, currentUser, logout } = useStudioStore();
  const { confirm } = useConfirm();

  const [internalCollapsed, setInternalCollapsed] = useState<boolean>(() => {
    try {
      return localStorage.getItem('sermoa_sidebar_collapsed') === 'true';
    } catch {
      return false;
    }
  });

  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const notificationsRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notificationsRef.current && !notificationsRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isCollapsed = controlledCollapsed !== undefined ? controlledCollapsed : internalCollapsed;

  const toggleCollapsed = () => {
    if (controlledToggle) {
      controlledToggle();
    } else {
      setInternalCollapsed((prev) => {
        const next = !prev;
        try {
          localStorage.setItem('sermoa_sidebar_collapsed', String(next));
        } catch { }
        return next;
      });
    }
  };

  const pendingStudents = profiles.filter((p) => p.status === 'pending_approval');
  const userProfile = currentUser || profiles.find((p) => p.role === 'admin') || profiles[0];
  const userInitials = userProfile
    ? `${userProfile.first_name?.charAt(0) || ''}${userProfile.last_name?.charAt(0) || ''}`.toUpperCase()
    : 'AD';
  const displayName = userProfile
    ? `${userProfile.first_name} ${userProfile.last_name}`
    : 'Administrador';

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
      description: 'Horarios y cupos',
      icon: Calendar,
      roles: ['admin', 'instructor'],
    },
    {
      id: 'students',
      label: 'Alumnos',
      description: 'Saldos, perfiles y CRM',
      icon: Users,
      badge: pendingStudents.length > 0 ? `${pendingStudents.length}` : undefined,
      roles: ['admin', 'instructor'],
    },
    {
      id: 'packs',
      label: 'Packs y Tarifas',
      description: 'Membresías y precios',
      icon: Ticket,
      roles: ['admin'],
    },
    {
      id: 'attendance',
      label: 'Pasar lista',
      description: 'Asistencia del día',
      icon: ClipboardList,
      roles: ['admin', 'instructor'],
    },
    {
      id: 'finance',
      label: 'Caja & Finanzas',
      description: 'Ingresos, gastos y pagos',
      icon: BarChart3,
      roles: ['admin'],
    },
    {
      id: 'history',
      label: 'Historial de movimientos',
      description: 'Auditoría y cobros',
      icon: Wallet,
      roles: ['admin', 'instructor'],
    },
    {
      id: 'instructors',
      label: 'Profesores',
      description: 'Staff y asignaciones',
      icon: UserCheck,
      roles: ['admin', 'instructor'],
    },
    {
      id: 'branches',
      label: 'Sucursales',
      description: 'Sedes y GPS',
      icon: MapPin,
      roles: ['admin', 'instructor'],
    },
    {
      id: 'routines',
      label: 'Rutinas',
      description: 'Planes de ejercicio',
      icon: Dumbbell,
      roles: ['admin', 'instructor'],
    },
    {
      id: 'settings',
      label: 'Configuración',
      description: 'Estudio, marca y GPS',
      icon: Settings,
      roles: ['admin'],
    },
  ];

  const filteredItems = navItems.filter((item) => item.roles.includes(currentRole || 'admin'));

  const handleLogout = async () => {
    setShowUserMenu(false);
    const confirmed = await confirm('¿Estás seguro de que deseas cerrar sesión?', {
      title: 'Cerrar Sesión',
      type: 'warning',
      confirmText: 'Sí, Salir',
    });
    if (confirmed) {
      logout();
      onNavigate('login');
    }
  };

  return (
    <aside
      className={`${isCollapsed ? 'w-20' : 'w-64'
        } border-r flex flex-col justify-between shrink-0 h-screen sticky top-0 z-30 transition-all duration-300 ease-in-out bg-[#FAF8F5] border-[#E8D5B5] relative select-none`}
    >
      {/* Botón flotante para colapsar/expandir */}
      <button
        type="button"
        onClick={toggleCollapsed}
        aria-label={isCollapsed ? 'Expandir menú lateral' : 'Contraer menú lateral'}
        title={isCollapsed ? 'Expandir menú' : 'Contraer menú'}
        className="absolute -right-3.5 top-14 z-40 w-7 h-7 bg-white border border-[#E8D5B5] text-[#5E612B] hover:text-[#44261B] hover:bg-[#F4E8D1] rounded-full shadow-md flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 focus:outline-none cursor-pointer"
      >
        {isCollapsed ? (
          <ChevronRight className="w-4 h-4 stroke-[2.5]" />
        ) : (
          <ChevronLeft className="w-4 h-4 stroke-[2.5]" />
        )}
      </button>

      {/* TOP: Brand Header */}
      <div className="flex-1 flex flex-col min-h-0">
        <div className={`h-16 border-b border-[#E8D5B5] flex items-center shrink-0 ${isCollapsed ? 'justify-center px-2' : 'justify-between px-4'}`}>
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
                  Pilates & Wellness
                </span>
              </div>
            )}
          </button>
        </div>

        {/* MIDDLE: Navigation List with internal scroll */}
        <nav className={`py-3 space-y-1 overflow-y-auto flex-1 ${isCollapsed ? 'px-2' : 'px-2.5'}`}>
          {filteredItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;

            return (
              <div key={item.id} className="relative group">
                <button
                  onClick={() => onNavigate(item.id)}
                  className={`w-full rounded-2xl transition-all cursor-pointer flex items-center ${isCollapsed
                      ? 'h-11 justify-center px-0'
                      : 'px-3 py-2 justify-between'
                    } ${isActive
                      ? 'bg-[#5E612B] text-[#F4E8D1] shadow-xs'
                      : 'text-[#44261B] hover:text-[#5E612B] hover:bg-[#F4E8D1]/60'
                    }`}
                  title={isCollapsed ? item.label : undefined}
                >
                  <div className={`flex items-center min-w-0 ${isCollapsed ? 'justify-center' : 'space-x-2.5'}`}>
                    <div
                      className={`relative rounded-xl flex items-center justify-center shrink-0 transition-colors ${isCollapsed ? 'w-8 h-8' : 'w-7 h-7'
                        } ${isActive
                          ? 'bg-white/15 text-[#F4E8D1]'
                          : 'bg-[#F4E8D1] text-[#5E612B] group-hover:bg-[#E8D5B5]'
                        }`}
                    >
                      <Icon className={isCollapsed ? 'w-4 h-4' : 'w-3.5 h-3.5'} />

                      {isCollapsed && item.badge && (
                        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-rose-500 border-2 border-[#FAF8F5] rounded-full shadow-xs" />
                      )}
                    </div>

                    {!isCollapsed && (
                      <div className="truncate text-left min-w-0">
                        <span className="text-xs font-bold block leading-snug truncate">
                          {item.label}
                        </span>
                        <span
                          className={`text-[9px] block leading-none truncate ${isActive ? 'text-[#F4E8D1]/80' : 'text-[#A68D74]'
                            }`}
                        >
                          {item.description}
                        </span>
                      </div>
                    )}
                  </div>

                  {!isCollapsed && item.badge && (
                    <span
                      className={`text-[9px] font-black px-1.5 py-0.5 rounded-full shrink-0 ${isActive
                          ? 'bg-[#F4E8D1] text-[#44261B]'
                          : 'bg-rose-500 text-white'
                        }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>

                {/* Tooltip flotante en colapsado */}
                {isCollapsed && (
                  <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-[#44261B] text-[#FAF8F5] text-xs font-bold rounded-xl shadow-xl whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 flex items-center space-x-2 border border-[#E8D5B5]/20">
                    <span>{item.label}</span>
                    {item.badge && (
                      <span className="bg-rose-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full">
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

      {/* BOTTOM: NOTIFICACIONES & PERFIL DE USUARIO CONSOLIDADOS */}
      <div className="p-2.5 border-t border-[#E8D5B5] bg-[#F4E8D1]/40 shrink-0 space-y-2">

        {/* Fila: Notificaciones y Perfil */}
        <div className="relative">

          {/* Notifications Trigger */}
          <div ref={notificationsRef} className="relative">
            <button
              type="button"
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowUserMenu(false);
              }}
              className={`w-full flex items-center rounded-xl p-2 transition-colors cursor-pointer ${showNotifications ? 'bg-white shadow-xs' : 'hover:bg-[#E8D5B5]/50'
                } ${isCollapsed ? 'justify-center' : 'justify-between'}`}
              title="Notificaciones"
            >
              <div className="flex items-center space-x-2.5">
                <div className="relative w-7 h-7 rounded-lg bg-white border border-[#E8D5B5] flex items-center justify-center text-[#5E612B] shadow-2xs">
                  <Bell className="w-3.5 h-3.5" />
                  {pendingStudents.length > 0 && (
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-rose-500 rounded-full ring-2 ring-white animate-pulse" />
                  )}
                </div>
                {!isCollapsed && (
                  <div className="text-left">
                    <span className="text-xs font-bold text-[#44261B] block leading-none">
                      Notificaciones
                    </span>
                    <span className="text-[9px] text-stone-500 font-medium block mt-0.5">
                      {pendingStudents.length > 0
                        ? `${pendingStudents.length} solicitud${pendingStudents.length === 1 ? '' : 'es'} pendiente${pendingStudents.length === 1 ? '' : 's'}`
                        : 'Al día'}
                    </span>
                  </div>
                )}
              </div>

              {!isCollapsed && pendingStudents.length > 0 && (
                <span className="bg-rose-500 text-white font-black text-[9px] px-1.5 py-0.5 rounded-full">
                  {pendingStudents.length}
                </span>
              )}
            </button>

            {/* Notifications Popover (flotante hacia arriba o derecha) */}
            {showNotifications && (
              <div
                className={`absolute z-50 bg-white rounded-2xl shadow-xl border border-[#E8D5B5] p-3 animate-fade-in ${isCollapsed
                    ? 'left-full ml-3 bottom-0 w-72'
                    : 'bottom-full mb-2 left-0 w-64'
                  }`}
              >
                <div className="flex items-center justify-between pb-2 border-b border-stone-100 mb-2">
                  <span className="font-extrabold text-xs text-[#44261B]">Notificaciones</span>
                  <button
                    onClick={() => setShowNotifications(false)}
                    className="text-stone-400 hover:text-stone-600 p-1"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                {pendingStudents.length > 0 ? (
                  <div className="space-y-2 max-h-56 overflow-y-auto">
                    {pendingStudents.map((stu) => (
                      <div
                        key={stu.id}
                        onClick={() => {
                          onNavigate('students');
                          setShowNotifications(false);
                        }}
                        className="p-2.5 bg-amber-50/80 hover:bg-amber-100/80 border border-amber-200 rounded-xl cursor-pointer transition-colors text-left"
                      >
                        <div className="flex items-center justify-between text-[11px] font-bold text-amber-900">
                          <span>Solicitud de Registro</span>
                          <span className="text-[9px] text-amber-700 bg-amber-200/60 px-1 rounded-sm">Nuevo</span>
                        </div>
                        <p className="text-[11px] text-amber-800 mt-0.5">
                          <strong>{stu.first_name} {stu.last_name}</strong> completó su registro.
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-4 text-center text-xs text-stone-400">
                    <CheckCircle2 className="w-6 h-6 mx-auto text-emerald-500 mb-1" />
                    <span>Sin solicitudes pendientes</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* User Profile Trigger & Menu */}
          <div ref={userMenuRef} className="relative mt-1">
            <button
              type="button"
              onClick={() => {
                setShowUserMenu(!showUserMenu);
                setShowNotifications(false);
              }}
              className={`w-full flex items-center rounded-xl p-2 transition-colors cursor-pointer ${showUserMenu ? 'bg-white shadow-xs' : 'hover:bg-[#E8D5B5]/50'
                } ${isCollapsed ? 'justify-center' : 'justify-between'}`}
              title={displayName}
            >
              <div className="flex items-center space-x-2.5 min-w-0">
                <div className="w-8 h-8 rounded-full bg-[#44261B] text-[#F4E8D1] font-black text-xs flex items-center justify-center shrink-0 shadow-xs border border-white">
                  {userInitials}
                </div>
                {!isCollapsed && (
                  <div className="text-left truncate min-w-0">
                    <span className="text-xs font-extrabold text-[#44261B] block leading-tight truncate">
                      {displayName}
                    </span>
                    <span className="text-[9px] font-bold text-[#5E612B] uppercase tracking-wider block leading-none mt-0.5 truncate">
                      {currentRole === 'admin' ? 'Administrador' : 'Profesor'}
                    </span>
                  </div>
                )}
              </div>

              {!isCollapsed && (
                <ChevronUp className={`w-3.5 h-3.5 text-stone-400 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
              )}
            </button>

            {/* User Dropdown Menu */}
            {showUserMenu && (
              <div
                className={`absolute z-50 bg-[#FAF8F5] rounded-2xl shadow-xl border border-[#E8D5B5] py-1.5 animate-fade-in ${isCollapsed
                    ? 'left-full ml-3 bottom-0 w-56'
                    : 'bottom-full mb-2 left-0 w-full'
                  }`}
              >
                <div className="px-3 py-2 border-b border-[#E8D5B5]/60 mb-1">
                  <span className="text-[11px] font-extrabold text-[#44261B] block truncate">
                    {displayName}
                  </span>
                  <span className="text-[9px] text-[#A68D74] block truncate">
                    {userProfile?.email || 'admin@sermoa.app'}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    onNavigate('portal-alumno');
                    setShowUserMenu(false);
                  }}
                  className="w-full px-3 py-2 text-left text-xs text-[#44261B] hover:bg-[#F4E8D1] flex items-center space-x-2 transition-colors cursor-pointer"
                >
                  <Smartphone className="w-3.5 h-3.5 text-[#5E612B]" />
                  <span className="font-bold">Vista Alumno</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    onNavigate('settings');
                    setShowUserMenu(false);
                  }}
                  className="w-full px-3 py-2 text-left text-xs text-[#44261B] hover:bg-[#F4E8D1] flex items-center space-x-2 transition-colors cursor-pointer"
                >
                  <Settings className="w-3.5 h-3.5 text-stone-600" />
                  <span className="font-bold">Configuración</span>
                </button>

                <div className="border-t border-[#E8D5B5]/60 my-1" />

                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full px-3 py-2 text-left text-xs text-rose-600 hover:bg-rose-50 flex items-center space-x-2 transition-colors font-bold cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Cerrar Sesión</span>
                </button>
              </div>
            )}
          </div>

        </div>

      </div>

    </aside>
  );
};
