import React, { useState } from 'react';
import {
  LayoutDashboard,
  Calendar,
  Users,
  BarChart3,
  ClipboardList,
  Menu,
  X,
  Ticket,
  Wallet,
  UserCheck,
  MapPin,
  Dumbbell,
  Settings,
  LogOut,
  QrCode,
  User
} from 'lucide-react';
import { useStudioStore } from '../../store/studioStore';
import { useConfirm } from '../../contexts/ConfirmContext';

interface MobileBottomNavProps {
  currentView: string;
  onNavigate: (view: string) => void;
  onOpenQRPoster?: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  currentView,
  onNavigate,
  onOpenQRPoster,
}) => {
  const { currentRole, currentUser, profiles, logout } = useStudioStore();
  const { confirm } = useConfirm();
  const [showMoreMenu, setShowMoreMenu] = useState(false);

  const pendingStudents = profiles.filter((p) => p.status === 'pending_approval');
  const userProfile = currentUser || profiles.find((p) => p.role === 'admin') || profiles[0];
  const displayName = userProfile
    ? `${userProfile.first_name} ${userProfile.last_name}`
    : 'Administrador';

  const handleLogout = async () => {
    const isConfirmed = await confirm('¿Cerrar sesión en SERMOA?', {
      title: 'Cerrar Sesión',
      confirmText: 'Cerrar Sesión',
      type: 'warning',
    });
    if (isConfirmed) {
      setShowMoreMenu(false);
      logout();
      window.location.hash = '#login';
    }
  };

  const handleSelectView = (viewId: string) => {
    onNavigate(viewId);
    setShowMoreMenu(false);
  };

  // Ítems principales de la barra inferior (máximo 4 + botón "Más")
  const primaryTabs = [
    {
      id: 'dashboard',
      label: 'Inicio',
      icon: LayoutDashboard,
      roles: ['admin', 'instructor'],
    },
    {
      id: 'classes',
      label: 'Clases',
      icon: Calendar,
      roles: ['admin', 'instructor'],
    },
    {
      id: 'students',
      label: 'Alumnos',
      icon: Users,
      badge: pendingStudents.length > 0 ? pendingStudents.length : undefined,
      roles: ['admin', 'instructor'],
    },
    currentRole === 'admin'
      ? {
          id: 'finance',
          label: 'Caja',
          icon: BarChart3,
          roles: ['admin'],
        }
      : {
          id: 'attendance',
          label: 'Asistencia',
          icon: ClipboardList,
          roles: ['instructor'],
        },
  ];

  // Ítems secundarios dentro del menú "Más"
  const secondaryItems = [
    {
      id: 'packs',
      label: 'Packs y Tarifas',
      icon: Ticket,
      roles: ['admin'],
    },
    {
      id: 'attendance',
      label: 'Pasar Lista',
      icon: ClipboardList,
      roles: ['admin'], // Para admin ya que instructor lo tiene en la barra principal
    },
    {
      id: 'history',
      label: 'Historial de Pagos',
      icon: Wallet,
      roles: ['admin', 'instructor'],
    },
    {
      id: 'instructors',
      label: 'Profesores',
      icon: UserCheck,
      roles: ['admin', 'instructor'],
    },
    {
      id: 'branches',
      label: 'Sucursales',
      icon: MapPin,
      roles: ['admin', 'instructor'],
    },
    {
      id: 'routines',
      label: 'Rutinas',
      icon: Dumbbell,
      roles: ['admin', 'instructor'],
    },
    {
      id: 'settings',
      label: 'Configuración',
      icon: Settings,
      roles: ['admin'],
    },
  ].filter((item) => item.roles.includes(currentRole || 'admin'));

  const isMoreActive = secondaryItems.some((item) => item.id === currentView);

  return (
    <>
      {/* ======================================================== */}
      {/* 1. BARRA DE NAVEGACIÓN INFERIOR (VISIBLE SOLO EN MÓVIL)  */}
      {/* ======================================================== */}
      <nav
        aria-label="Navegación inferior móvil"
        className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-[#FAF8F5]/95 backdrop-blur-md border-t border-[#E8D5B5] px-2 py-1.5 shadow-[0_-4px_16px_rgba(0,0,0,0.06)] flex items-center justify-around safe-bottom"
      >
        {primaryTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentView === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => handleSelectView(tab.id)}
              className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all relative min-w-[60px] cursor-pointer ${
                isActive
                  ? 'text-[#5E612B] font-extrabold'
                  : 'text-[#A68D74] hover:text-[#44261B] font-semibold'
              }`}
            >
              <div className="relative">
                <Icon
                  className={`w-5 h-5 transition-transform ${
                    isActive ? 'scale-110 text-[#5E612B]' : 'text-[#A68D74]'
                  }`}
                />
                {tab.badge !== undefined && (
                  <span className="absolute -top-1.5 -right-2 min-w-[16px] h-4 px-1 rounded-full bg-rose-500 text-white text-[9px] font-black flex items-center justify-center shadow-xs animate-pulse">
                    {tab.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] mt-0.5 tracking-tight leading-none">
                {tab.label}
              </span>
              {isActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-[#5E612B] mt-1" />
              )}
            </button>
          );
        })}

        {/* Botón "Más..." */}
        <button
          onClick={() => setShowMoreMenu((prev) => !prev)}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all relative min-w-[60px] cursor-pointer ${
            showMoreMenu || isMoreActive
              ? 'text-[#5E612B] font-extrabold'
              : 'text-[#A68D74] hover:text-[#44261B] font-semibold'
          }`}
        >
          <Menu
            className={`w-5 h-5 transition-transform ${
              showMoreMenu || isMoreActive ? 'scale-110 text-[#5E612B]' : 'text-[#A68D74]'
            }`}
          />
          <span className="text-[10px] mt-0.5 tracking-tight leading-none">Más</span>
          {(showMoreMenu || isMoreActive) && (
            <span className="w-1.5 h-1.5 rounded-full bg-[#5E612B] mt-1" />
          )}
        </button>
      </nav>

      {/* ======================================================== */}
      {/* 2. MENÚ DESPLEGABLE "MÁS" (BOTTOM SHEET MODAL)            */}
      {/* ======================================================== */}
      {showMoreMenu && (
        <div className="lg:hidden fixed inset-0 z-50 animate-fade-in">
          {/* Backdrop con desenfoque */}
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
            onClick={() => setShowMoreMenu(false)}
          />

          {/* Sheet inferior deslizable */}
          <div className="fixed inset-x-0 bottom-0 bg-[#FAF8F5] rounded-t-3xl border-t border-[#E8D5B5] shadow-2xl p-5 max-h-[85vh] overflow-y-auto space-y-4 animate-slide-up">
            
            {/* Header del Sheet */}
            <div className="flex items-center justify-between pb-3 border-b border-[#E8D5B5]/60">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-full bg-[#E8D5B5] text-[#44261B] font-black text-xs flex items-center justify-center">
                  {displayName.charAt(0)}
                </div>
                <div>
                  <h3 className="text-xs font-black text-[#44261B]">{displayName}</h3>
                  <span className="text-[10px] text-[#A68D74] capitalize">
                    {currentRole === 'admin' ? 'Administrador' : 'Profesor'}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setShowMoreMenu(false)}
                className="w-8 h-8 rounded-full bg-white border border-[#E8D5B5] text-slate-400 hover:text-slate-600 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Grid de opciones secundarias */}
            <div className="grid grid-cols-2 gap-2.5">
              {secondaryItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentView === item.id;

                return (
                  <button
                    key={item.id}
                    onClick={() => handleSelectView(item.id)}
                    className={`flex items-center space-x-2.5 p-3 rounded-2xl border transition-all text-left cursor-pointer ${
                      isActive
                        ? 'bg-[#5E612B] text-white border-[#5E612B] shadow-xs'
                        : 'bg-white text-[#44261B] border-[#E8D5B5] hover:bg-[#F4E8D1]/60'
                    }`}
                  >
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-[#C18749]'}`} />
                    <span className="text-xs font-bold leading-tight">{item.label}</span>
                  </button>
                );
              })}

              {/* Botón Cartel QR si está disponible */}
              {onOpenQRPoster && (
                <button
                  onClick={() => {
                    setShowMoreMenu(false);
                    onOpenQRPoster();
                  }}
                  className="flex items-center space-x-2.5 p-3 rounded-2xl border border-[#E8D5B5] bg-white text-[#44261B] hover:bg-[#F4E8D1]/60 transition-all text-left cursor-pointer"
                >
                  <QrCode className="w-4 h-4 text-[#C18749] shrink-0" />
                  <span className="text-xs font-bold leading-tight">Cartel QR</span>
                </button>
              )}
            </div>

            {/* Botón Cerrar Sesión */}
            <div className="pt-2 border-t border-[#E8D5B5]/60">
              <button
                onClick={handleLogout}
                className="w-full py-3 rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-extrabold text-xs flex items-center justify-center space-x-2 border border-rose-200 transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>Cerrar Sesión</span>
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
};

