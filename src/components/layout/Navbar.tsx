import React, { useState } from 'react';
import {
  Calendar,
  Users,
  ClipboardList,
  UserCheck,
  MapPin,
  Dumbbell,
  Wallet,
  Settings,
  Ticket,
  BarChart3,
  HelpCircle,
  Bell,
  Copy,
  Check,
  ChevronDown,
  ExternalLink,
  ShieldCheck,
  QrCode,
  Menu,
  X,
  Smartphone,
  Share2,
  LogOut
} from 'lucide-react';
import { useStudioStore } from '../../store/studioStore';
import { StudioLinksModal } from '../common/StudioLinksModal';
import { getRegisterLink } from '../../utils/links';
import { useConfirm } from '../../contexts/ConfirmContext';

interface NavbarProps {
  currentView: string;
  onNavigate: (view: string) => void;
  onOpenQRPoster: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, onNavigate, onOpenQRPoster }) => {
  const { studio, profiles, currentRole, currentUser, logout } = useStudioStore();
  const { confirm } = useConfirm();
  const [copiedLink, setCopiedLink] = useState(false);
  const [showLinksModal, setShowLinksModal] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const pendingStudents = profiles.filter((p) => p.status === 'pending_approval');
  const userProfile = currentUser || profiles.find((p) => p.role === 'admin') || profiles[0];

  const handleCopyLink = () => {
    const bookingUrl = getRegisterLink();
    navigator.clipboard.writeText(bookingUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleNavClick = (view: string) => {
    onNavigate(view);
    setOpenDropdown(null);
    setShowMobileMenu(false);
  };

  return (
    <header className="sticky top-0 z-40 backdrop-blur-md border-b border-[#E8D5B5] bg-[#FAF8F5]/95 shadow-xs transition-colors">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* LEFT: Brand Logo (visible en pantallas móviles/tablets donde la barra lateral se oculta) */}
          <div className="flex items-center space-x-3 sm:space-x-6">
            
            {/* Studio Logo Badge & Name en Mobile */}
            <button
              onClick={() => handleNavClick('dashboard')}
              className="flex lg:hidden items-center space-x-2.5 group focus:outline-none shrink-0"
            >
              <div className="w-10 h-10 flex items-center justify-center group-hover:scale-105 transition-transform shrink-0">
                <img src={studio.logo_url || '/logo.png'} alt={studio.name} className="w-full h-full object-contain" />
              </div>
              <div className="text-left">
                <span className="font-black text-[#1F2933] text-sm tracking-tight block leading-none">
                  {studio.name || 'Sermoa'}
                </span>
                <span className="text-[9px] text-stone-500 font-bold uppercase tracking-wider block mt-0.5">
                  Más movimiento, más vida
                </span>
              </div>
            </button>

            {/* Desktop Navigation Links (Configuración & Caja) */}
            <nav className="hidden lg:flex items-center space-x-1">

              {/* Dropdown: Estrategia & Configuración (Solo Administradores) */}
              {currentRole === 'admin' && (
                <div className="relative">
                  <button
                    onClick={() => setOpenDropdown(openDropdown === 'estrategia' ? null : 'estrategia')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all ${
                      ['settings', 'finance'].includes(currentView)
                        ? 'bg-[#1F2933] text-white font-extrabold'
                        : 'text-stone-700 hover:text-[#1F2933] hover:bg-[#EFE9DF]'
                    }`}
                  >
                    <Settings className="w-3.5 h-3.5 text-stone-500" />
                    <span>Configuración & Caja</span>
                    <ChevronDown className={`w-3 h-3 text-stone-400 transition-transform ${openDropdown === 'estrategia' ? 'rotate-180' : ''}`} />
                  </button>

                  {openDropdown === 'estrategia' && (
                    <div className="absolute left-0 mt-2 w-64 bg-[#FAF8F5] rounded-2xl shadow-xl border border-[#E8DFD1] py-2 z-50 animate-fade-in">
                      <button
                        onClick={() => handleNavClick('settings')}
                        className="w-full px-4 py-2.5 text-left text-xs text-stone-700 hover:bg-[#EFE9DF] flex items-center space-x-3 transition-colors"
                      >
                        <Settings className="w-4 h-4 text-stone-600" />
                        <div>
                          <div className="font-bold text-stone-800">Configuración del estudio</div>
                          <div className="text-[10px] text-stone-500">Marca, políticas y WhatsApp</div>
                        </div>
                      </button>

                      <button
                        onClick={() => handleNavClick('finance')}
                        className="w-full px-4 py-2.5 text-left text-xs text-stone-700 hover:bg-[#EFE9DF] flex items-center space-x-3 transition-colors"
                      >
                        <BarChart3 className="w-4 h-4 text-[#5EBA8C]" />
                        <div>
                          <div className="flex items-center space-x-1.5">
                            <span className="font-bold text-stone-800">Control financiero & Caja</span>
                          </div>
                          <div className="text-[10px] text-stone-500">Ingresos, egresos y métricas</div>
                        </div>
                      </button>
                    </div>
                  )}
                </div>
              )}

            </nav>
          </div>

          {/* RIGHT: Actions, Link Button, Notifications & Profile */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            
            {/* Quick Action: Cartel QR */}
            <button
              onClick={onOpenQRPoster}
              className="hidden sm:inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-stone-700 bg-[#EFE9DF]/80 hover:bg-[#E5DDCF] border border-[#DDD3C2] transition-colors shrink-0"
              title="Ver o imprimir Cartel QR"
            >
              <QrCode className="w-3.5 h-3.5 text-[#1F2933]" />
              <span className="hidden md:inline">Cartel QR</span>
            </button>

            {/* Studio Links Center Button */}
            <button
              onClick={() => setShowLinksModal(true)}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-[#1F2933] bg-[#F7C59F]/60 hover:bg-[#F7C59F] border border-[#E8B48B] shadow-xs transition-all shrink-0"
              title="Ver y copiar enlaces para Instagram Bio y WhatsApp"
            >
              <Share2 className="w-3.5 h-3.5 text-[#1F2933]" />
              <span className="hidden sm:inline text-[11px]">Links para Redes</span>
            </button>

            {/* Notifications Bell */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-full transition-colors relative"
                title="Notificaciones"
              >
                <Bell className="w-4 h-4" />
                {pendingStudents.length > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white"></span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-slate-100 p-4 z-50 animate-fade-in">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-2.5">
                    <span className="font-extrabold text-xs text-slate-800">Notificaciones</span>
                    <span className="text-[10px] text-brand-600 font-bold cursor-pointer">Marcar leídas</span>
                  </div>
                  {pendingStudents.length > 0 ? (
                    <div className="space-y-2">
                      {pendingStudents.map((stu) => (
                        <div
                          key={stu.id}
                          onClick={() => {
                            handleNavClick('students');
                            setShowNotifications(false);
                          }}
                          className="p-2.5 bg-amber-50/80 border border-amber-200 rounded-xl cursor-pointer hover:bg-amber-100/80 transition-colors"
                        >
                          <div className="flex items-center justify-between text-[11px] font-bold text-amber-900">
                            <span>Solicitud de Registro</span>
                            <span className="text-[9px] text-amber-700">Nuevo</span>
                          </div>
                          <p className="text-[11px] text-amber-800 mt-0.5">
                            <strong>{stu.first_name} {stu.last_name}</strong> completó su registro.
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400 py-3 text-center">Sin notificaciones pendientes.</p>
                  )}
                </div>
              )}
            </div>

            {/* Role Badge */}
            <div className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-purple-100 text-purple-800 border border-purple-200 shrink-0">
              <span>{currentRole === 'admin' ? 'Admin' : currentRole === 'instructor' ? 'Profesor' : 'Alumno'}</span>
            </div>

            {/* User Avatar & Menu */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-1.5 p-1 rounded-full hover:bg-[#EFE9DF] transition-colors focus:outline-none"
              >
                <div className="w-8 h-8 rounded-full bg-[#1F2933] text-[#FAF8F5] flex items-center justify-center font-bold text-xs uppercase shadow-xs">
                  {userProfile?.first_name?.[0] || 'U'}{userProfile?.last_name?.[0] || ''}
                </div>
                <ChevronDown className="w-3 h-3 text-stone-400 hidden sm:block" />
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-52 bg-[#FAF8F5] rounded-2xl shadow-xl border border-[#E8DFD1] py-2 z-50 animate-fade-in text-xs font-semibold">
                  <div className="px-4 py-2 border-b border-[#E8DFD1] mb-1">
                    <p className="font-extrabold text-[#1F2933]">{userProfile?.first_name} {userProfile?.last_name}</p>
                    <p className="text-[10px] text-stone-500">{userProfile?.email}</p>
                  </div>
                  <button
                    onClick={() => { handleNavClick('settings'); setShowUserMenu(false); }}
                    className="w-full px-4 py-2 text-left text-stone-700 hover:bg-[#EFE9DF] flex items-center space-x-2"
                  >
                    <Settings className="w-3.5 h-3.5 text-stone-400" />
                    <span>Configuración</span>
                  </button>
                  <button
                    onClick={() => { handleNavClick('portal-alumno'); setShowUserMenu(false); }}
                    className="w-full px-4 py-2 text-left text-[#1F2933] hover:bg-[#EFE9DF] flex items-center space-x-2 font-bold"
                  >
                    <Smartphone className="w-3.5 h-3.5 text-[#5EBA8C]" />
                    <span>Ver App Alumno</span>
                  </button>
                  <div className="border-t border-[#E8DFD1] mt-1 pt-1">
                    <button
                      onClick={async () => {
                        setShowUserMenu(false);
                        const isConfirmed = await confirm('¿Estás seguro de que quieres cerrar sesión?', {
                          title: 'Cerrar Sesión',
                          type: 'warning',
                          confirmText: 'Sí, Cerrar Sesión'
                        });
                        if (isConfirmed) {
                          logout();
                          window.location.hash = '';
                        }
                      }}
                      className="w-full px-4 py-2 text-left text-rose-600 hover:bg-rose-50 flex items-center space-x-2 font-extrabold transition-colors"
                    >
                      <LogOut className="w-3.5 h-3.5 text-rose-500" />
                      <span>Cerrar Sesión</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Hamburger Menu Toggle */}
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="lg:hidden p-2 text-stone-600 hover:text-stone-900 hover:bg-[#EFE9DF] rounded-xl transition-colors"
            >
              {showMobileMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {showMobileMenu && (
        <div className="lg:hidden bg-[#FAF8F5] border-b border-[#E8DFD1] px-4 pt-2 pb-6 space-y-2 animate-fade-in shadow-xl">
          <div className="text-[11px] font-extrabold uppercase tracking-wider text-stone-400 px-3 py-1">
            Navegación
          </div>
          <button
            onClick={() => handleNavClick('dashboard')}
            className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-stone-800 hover:bg-[#EFE9DF]"
          >
            Inicio
          </button>
          <button
            onClick={() => handleNavClick('classes')}
            className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-slate-800 hover:bg-slate-50 flex items-center space-x-2"
          >
            <Calendar className="w-4 h-4 text-brand-600" />
            <span>Clases y reservas</span>
          </button>
          <button
            onClick={() => handleNavClick('students')}
            className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-slate-800 hover:bg-slate-50 flex items-center justify-between"
          >
            <div className="flex items-center space-x-2">
              <Users className="w-4 h-4 text-blue-500" />
              <span>Alumnos</span>
            </div>
            {pendingStudents.length > 0 && (
              <span className="bg-amber-100 text-amber-800 text-[10px] px-2 py-0.5 rounded-full font-bold">
                {pendingStudents.length} pendientes
              </span>
            )}
          </button>
          <button
            onClick={() => handleNavClick('attendance')}
            className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-slate-800 hover:bg-slate-50 flex items-center space-x-2"
          >
            <ClipboardList className="w-4 h-4 text-rose-500" />
            <span>Pasar lista</span>
          </button>
          <button
            onClick={() => handleNavClick('instructors')}
            className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-slate-800 hover:bg-slate-50 flex items-center space-x-2"
          >
            <UserCheck className="w-4 h-4 text-purple-500" />
            <span>Profesores</span>
          </button>
          <button
            onClick={() => handleNavClick('branches')}
            className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-slate-800 hover:bg-slate-50 flex items-center space-x-2"
          >
            <MapPin className="w-4 h-4 text-amber-500" />
            <span>Sucursales & GPS</span>
          </button>
          <button
            onClick={() => handleNavClick('routines')}
            className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-slate-800 hover:bg-slate-50 flex items-center space-x-2"
          >
            <Dumbbell className="w-4 h-4 text-cyan-600" />
            <span>Rutinas & Planes</span>
          </button>
          {currentRole === 'admin' && (
            <>
              <button
                onClick={() => handleNavClick('finance')}
                className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-slate-800 hover:bg-slate-50 flex items-center space-x-2"
              >
                <BarChart3 className="w-4 h-4 text-brand-600" />
                <span>Control financiero</span>
              </button>
              <button
                onClick={() => handleNavClick('settings')}
                className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-slate-800 hover:bg-slate-50 flex items-center space-x-2"
              >
                <Settings className="w-4 h-4 text-slate-600" />
                <span>Configuración & WhatsApp</span>
              </button>
            </>
          )}
          <button
            onClick={() => handleNavClick('portal-alumno')}
            className="w-full text-left px-3 py-2.5 rounded-xl text-xs font-extrabold bg-brand-50 text-brand-700 flex items-center space-x-2"
          >
            <Smartphone className="w-4 h-4" />
            <span>Abrir Vista Alumno</span>
          </button>
          <div className="border-t border-slate-100 pt-2 mt-1">
            <button
              onClick={async () => {
                setShowMobileMenu(false);
                const isConfirmed = await confirm('¿Estás seguro de que quieres cerrar sesión?', {
                  title: 'Cerrar Sesión',
                  type: 'warning',
                  confirmText: 'Sí, Cerrar Sesión'
                });
                if (isConfirmed) {
                  handleNavClick('login');
                }
              }}
              className="w-full text-left px-3 py-2 rounded-xl text-xs font-extrabold text-rose-600 hover:bg-rose-50 flex items-center space-x-2 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Cerrar Sesión</span>
            </button>
          </div>
        </div>
      )}

      {/* Studio Links Center Modal */}
      {showLinksModal && (
        <StudioLinksModal
          onClose={() => setShowLinksModal(false)}
          onOpenQRPoster={onOpenQRPoster}
        />
      )}

    </header>
  );
};
