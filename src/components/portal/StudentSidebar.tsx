import React, { useState } from 'react';
import {
  Home,
  User,
  Calendar,
  Clock,
  Dumbbell,
  CreditCard,
  MapPin,
  Users,
  ChevronRight,
  ChevronLeft,
  LogOut,
  Instagram,
  MessageCircle,
  Sparkles,
  QrCode
} from 'lucide-react';
import { Profile, Studio } from '../../types';

interface StudentSidebarProps {
  student: Profile | null;
  studio: Studio;
  activeTab: 'home' | 'my_profile' | 'schedule' | 'my_bookings' | 'my_routines' | 'register';
  onSelectTab: (tab: 'home' | 'my_profile' | 'schedule' | 'my_bookings' | 'my_routines' | 'register') => void;
  onLogout: () => void;
  studentsList: Profile[];
  currentStudentId: string;
  onSelectStudent: (id: string) => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  // For mobile drawer compatibility
  isDrawer?: boolean;
  isOpen?: boolean;
  onClose?: () => void;
}

export const StudentSidebar: React.FC<StudentSidebarProps> = ({
  student,
  studio,
  activeTab,
  onSelectTab,
  onLogout,
  studentsList,
  currentStudentId,
  onSelectStudent,
  isCollapsed: controlledCollapsed,
  onToggleCollapse: controlledToggle,
  isDrawer = false,
  isOpen = true,
  onClose,
}) => {
  const [internalCollapsed, setInternalCollapsed] = useState<boolean>(() => {
    try {
      return localStorage.getItem('sermoa_student_sidebar_collapsed') === 'true';
    } catch {
      return false;
    }
  });

  const isCollapsed = isDrawer ? false : (controlledCollapsed !== undefined ? controlledCollapsed : internalCollapsed);

  const toggleCollapsed = () => {
    if (controlledToggle) {
      controlledToggle();
    } else {
      setInternalCollapsed((prev) => {
        const next = !prev;
        try {
          localStorage.setItem('sermoa_student_sidebar_collapsed', String(next));
        } catch {}
        return next;
      });
    }
  };

  // Estructura de menú:
  // 1. Inicio
  // 2. Reservar clase
  // 3. Mis turnos
  // 4. Mi perfil (contiene Mi Plan, Credencial, Ficha y Objetivos)
  const mainMenuItems = [
    {
      id: 'home' as const,
      label: 'Inicio',
      description: 'Panel general',
      icon: Home,
      action: () => {
        onSelectTab('home');
        if (isDrawer && onClose) onClose();
      },
      active: activeTab === 'home',
    },
    {
      id: 'schedule' as const,
      label: 'Reservar clase',
      description: 'Agenda y horarios',
      icon: Calendar,
      action: () => {
        onSelectTab('schedule');
        if (isDrawer && onClose) onClose();
      },
      active: activeTab === 'schedule',
    },
    {
      id: 'my_bookings' as const,
      label: 'Mis turnos',
      description: 'Próximas reservas',
      icon: Clock,
      action: () => {
        onSelectTab('my_bookings');
        if (isDrawer && onClose) onClose();
      },
      active: activeTab === 'my_bookings',
    },
    {
      id: 'my_profile' as const,
      label: 'Mi perfil',
      description: 'Mi plan y credencial',
      icon: User,
      badge: student?.credits_balance === 999 ? 'Pase Libre' : `${student?.credits_balance ?? 0} clases`,
      action: () => {
        onSelectTab('my_profile');
        if (isDrawer && onClose) onClose();
      },
      active: activeTab === 'my_profile',
    },
  ];

  // Accesos secundarios agrupados en zona inferior
  const secondaryMenuItems = [
    {
      id: 'branches' as const,
      label: 'Sucursales',
      description: 'Sedes y salas',
      icon: MapPin,
      badge: 'Sede Central',
      action: () => {
        alert('Sucursal Principal Sermoa: Calle 9 de Julio 450, Centro.');
        if (isDrawer && onClose) onClose();
      },
    },
  ];

  const sidebarContent = (
    <aside
      className={`${
        isCollapsed ? 'w-20' : 'w-64'
      } border-r flex flex-col justify-between shrink-0 h-screen sticky top-0 z-30 transition-all duration-300 ease-in-out bg-[#FAF8F5] border-[#E8D5B5] relative select-none`}
    >
      {/* Botón flotante para contraer/expandir en desktop */}
      {!isDrawer && (
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
      )}

      {/* Top Header con Perfil de Alumno */}
      <div className="flex-1 overflow-y-auto">
        
        {/* Cabecera / Identidad */}
        <div className={`border-b border-[#E8D5B5] transition-all ${isCollapsed ? 'p-3' : 'p-4'}`}>
          <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3'}`}>
            <div className="w-10 h-10 rounded-2xl bg-[#5E612B] border-2 border-[#E8D5B5] overflow-hidden flex-shrink-0 flex items-center justify-center shadow-xs">
              {student?.avatar_url ? (
                <img
                  src={student.avatar_url}
                  alt={student.first_name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-5 h-5 text-[#F4E8D1]" />
              )}
            </div>

            {!isCollapsed && (
              <div className="min-w-0 flex-1 truncate">
                <span className="text-[10px] text-[#A68D74] font-bold uppercase tracking-wider block leading-none">
                  Portal Alumno
                </span>
                <h3 className="font-black text-[#44261B] text-sm tracking-tight truncate leading-tight mt-0.5">
                  {student?.first_name || 'Alumno'} {student?.last_name || ''}
                </h3>
                <span className="text-[10px] font-bold text-[#5E612B] block truncate">
                  {student?.credits_balance === 999 ? 'Pase Libre' : `${student?.credits_balance ?? 0} clases`}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Menú Principal Organizado */}
        <div className="py-3">
          {!isCollapsed && (
            <span className="px-4 text-[10px] font-bold uppercase tracking-wider text-[#A68D74] block mb-2">
              Menú Principal
            </span>
          )}
          <nav className={`space-y-1.5 ${isCollapsed ? 'px-2' : 'px-2.5'}`}>
            {mainMenuItems.map((item) => {
              const Icon = item.icon;
              const isActive = item.active;

              return (
                <div key={item.id} className="relative group">
                  <button
                    onClick={item.action}
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
                        className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full shrink-0 ${
                          isActive
                            ? 'bg-[#F4E8D1] text-[#44261B]'
                            : 'bg-[#F4E8D1] text-[#5E612B] border border-[#E8D5B5]'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>

                  {/* Tooltip flotante en modo contraído */}
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

        {/* Separador y Accesos Secundarios */}
        <div className="pt-2 pb-3 border-t border-[#E8D5B5]/60">
          {!isCollapsed && (
            <span className="px-4 text-[10px] font-bold uppercase tracking-wider text-[#A68D74] block mb-2">
              Explorar
            </span>
          )}
          <nav className={`space-y-1.5 ${isCollapsed ? 'px-2' : 'px-2.5'}`}>
            {secondaryMenuItems.map((item) => {
              const Icon = item.icon;

              return (
                <div key={item.id} className="relative group">
                  <button
                    onClick={item.action}
                    className={`w-full rounded-2xl transition-all cursor-pointer flex items-center text-[#44261B] hover:text-[#5E612B] hover:bg-[#F4E8D1]/60 ${
                      isCollapsed
                        ? 'h-10 justify-center px-0'
                        : 'px-3 py-2 justify-between'
                    }`}
                    title={isCollapsed ? item.label : undefined}
                  >
                    <div className={`flex items-center min-w-0 ${isCollapsed ? 'justify-center' : 'space-x-3'}`}>
                      <div
                        className={`rounded-xl flex items-center justify-center shrink-0 transition-colors bg-white border border-[#E8D5B5] text-[#A68D74] group-hover:text-[#5E612B] group-hover:border-[#5E612B] ${
                          isCollapsed ? 'w-8 h-8' : 'w-7 h-7'
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                      </div>

                      {!isCollapsed && (
                        <div className="truncate text-left min-w-0">
                          <span className="text-xs font-semibold block leading-snug truncate">
                            {item.label}
                          </span>
                        </div>
                      )}
                    </div>

                    {!isCollapsed && item.badge && (
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-[#F4E8D1] text-[#5E612B]">
                        {item.badge}
                      </span>
                    )}
                  </button>

                  {isCollapsed && (
                    <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-[#44261B] text-[#FAF8F5] text-xs font-bold rounded-xl shadow-xl whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 flex items-center space-x-2 border border-[#E8D5B5]/20">
                      <span>{item.label}</span>
                      <div className="absolute top-1/2 -left-1 -translate-y-1/2 w-2 h-2 bg-[#44261B] rotate-45" />
                    </div>
                  )}
                </div>
              );
            })}
          </nav>
        </div>

      </div>

      {/* Footer Info / Salir */}
      <div className="p-3 border-t border-[#E8D5B5] bg-[#F4E8D1]/30 transition-all overflow-hidden">
        {isCollapsed ? (
          <button
            onClick={onLogout}
            className="w-full py-2 flex items-center justify-center text-[#A68D74] hover:text-[#CB563C] transition-colors"
            title="Cerrar sesión"
          >
            <LogOut className="w-4 h-4" />
          </button>
        ) : (
          <div className="flex items-center justify-between text-[11px] text-[#A68D74] px-1">
            <span className="font-bold">Sermoa Alumnos</span>
            <button
              onClick={onLogout}
              className="hover:text-[#CB563C] text-[#A68D74] font-semibold flex items-center space-x-1 cursor-pointer transition-colors"
              title="Cerrar sesión"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Salir</span>
            </button>
          </div>
        )}
      </div>
    </aside>
  );

  // Modal drawer para móviles
  if (isDrawer) {
    if (!isOpen) return null;
    return (
      <div className="fixed inset-0 z-50 overflow-hidden animate-fade-in lg:hidden">
        <div
          onClick={onClose}
          className="absolute inset-0 bg-stone-900/60 backdrop-blur-xs transition-opacity"
        />
        <div className="absolute inset-y-0 left-0 max-w-full flex">
          <div className="w-screen max-w-xs bg-[#FAF8F5] shadow-2xl flex flex-col border-r border-[#E8D5B5]">
            {sidebarContent}
          </div>
        </div>
      </div>
    );
  }

  return sidebarContent;
};
