import React from 'react';
import {
  Home,
  Calendar,
  Clock,
  Dumbbell,
  MapPin,
  ShoppingBag,
  Activity,
  Award,
  Users,
  CreditCard,
  QrCode,
  LogOut,
  User,
  Instagram,
  MessageCircle,
  X,
  Sparkles,
  ChevronRight,
  TrendingUp,
  RefreshCw,
} from 'lucide-react';
import { Profile, Studio } from '../../types';

interface StudentSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  student: Profile | null;
  studio: Studio;
  activeTab: 'home' | 'my_profile' | 'schedule' | 'my_bookings' | 'my_routines' | 'register';
  onSelectTab: (tab: 'home' | 'my_profile' | 'schedule' | 'my_bookings' | 'my_routines' | 'register') => void;
  onLogout: () => void;
  studentsList: Profile[];
  currentStudentId: string;
  onSelectStudent: (id: string) => void;
}

export const StudentSidebar: React.FC<StudentSidebarProps> = ({
  isOpen,
  onClose,
  student,
  studio,
  activeTab,
  onSelectTab,
  onLogout,
  studentsList,
  currentStudentId,
  onSelectStudent,
}) => {
  if (!isOpen) return null;

  const menuItems = [
    {
      id: 'home',
      label: 'Inicio',
      icon: Home,
      action: () => {
        onSelectTab('home');
        onClose();
      },
      active: activeTab === 'home',
    },
    {
      id: 'my_profile',
      label: 'MI PERFIL (Credencial & Plan)',
      icon: User,
      badge: 'Pase',
      action: () => {
        onSelectTab('my_profile');
        onClose();
      },
      active: activeTab === 'my_profile',
    },
    {
      id: 'schedule',
      label: 'Reserva de clases',
      icon: Calendar,
      action: () => {
        onSelectTab('schedule');
        onClose();
      },
      active: activeTab === 'schedule',
    },
    {
      id: 'my_bookings',
      label: 'Mis Turnos & Horarios',
      icon: Clock,
      action: () => {
        onSelectTab('my_bookings');
        onClose();
      },
      active: activeTab === 'my_bookings',
    },
    {
      id: 'my_routines',
      label: 'Mi Rutina & Entrenamiento',
      icon: Dumbbell,
      action: () => {
        onSelectTab('my_routines');
        onClose();
      },
      active: activeTab === 'my_routines',
    },
    {
      id: 'branches',
      label: 'Sucursales',
      icon: MapPin,
      badge: 'Sede Central',
      action: () => {
        alert('Sucursal Principal Sermoa: Calle 9 de Julio 450, Centro.');
        onClose();
      },
    },
    {
      id: 'community',
      label: 'Entrená acompañado',
      icon: Users,
      action: () => {
        const link = window.location.origin + '/portal';
        navigator.clipboard?.writeText(link);
        alert('¡Enlace de invitación copiado! Compartilo con tu amiga/amigo para sumar puntos.');
        onClose();
      },
    },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-fade-in">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
      />

      {/* Drawer Panel Left */}
      <div className="absolute inset-y-0 left-0 max-w-full flex pr-10">
        <div className="w-screen max-w-xs sm:max-w-sm bg-[#FAF8F5] shadow-2xl flex flex-col border-r border-[#E8D5B5]">
          
          {/* Header Drawer (Fondo Chocolate Cálido estilo foto) */}
          <div className="p-5 sm:p-6 bg-[#44261B] text-[#F4E8D1] relative">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-1.5 text-[#F4E8D1]/70 hover:text-white rounded-xl transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Profile Avatar & Greeting */}
            <div className="flex items-center space-x-3.5 pr-6">
              <div className="w-14 h-14 rounded-2xl bg-[#5E612B] border-2 border-[#E8D5B5] overflow-hidden flex-shrink-0 flex items-center justify-center shadow-md">
                {student?.avatar_url ? (
                  <img
                    src={student.avatar_url}
                    alt={student.first_name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-7 h-7 text-[#F4E8D1]" />
                )}
              </div>
              <div className="min-w-0">
                <span className="text-xs text-[#E8D5B5] font-semibold block">¡Hola</span>
                <h3 className="text-lg font-black text-white truncate leading-tight">
                  {student?.first_name || 'Alumno'}! 👋
                </h3>
                <span className="text-[11px] text-[#F4E8D1]/80 font-medium">
                  {student?.credits_balance === 999 ? 'Pase Libre' : `${student?.credits_balance ?? 0} clases`}
                </span>
              </div>
            </div>

            {/* Sub-actions Row (Tu perfil / Salir) */}
            <div className="flex items-center justify-between border-t border-white/15 mt-4 pt-3.5 text-xs font-bold text-[#E8D5B5]">
              <button
                onClick={() => {
                  onSelectTab('my_profile');
                  onClose();
                }}
                className="hover:text-white transition-colors flex items-center space-x-1.5 cursor-pointer"
              >
                <User className="w-3.5 h-3.5 text-[#D98E2A]" />
                <span>MI PERFIL</span>
              </button>

              <button
                onClick={() => {
                  onLogout();
                  onClose();
                }}
                className="hover:text-[#CB563C] text-[#F4E8D1]/80 transition-colors flex items-center space-x-1.5 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Salir</span>
              </button>
            </div>

            {/* Redes Sociales del Estudio */}
            <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-[#F4E8D1]/70">
              <span>Visitanos en:</span>
              <div className="flex items-center space-x-3">
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noreferrer"
                  className="p-1 hover:text-[#D98E2A] transition-colors"
                >
                  <Instagram className="w-4 h-4" />
                </a>
                <a
                  href={`https://wa.me/${studio.phone || '5493512409232'}`}
                  target="_blank"
                  rel="noreferrer"
                  className="p-1 hover:text-[#5E612B] transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

          {/* Selector de emulación para testing rápido */}
          {studentsList.length > 0 && (
            <div className="p-3 bg-[#F4E8D1]/60 border-b border-[#E8D5B5] flex items-center justify-between">
              <span className="text-[10px] font-black uppercase text-[#5E612B] tracking-wider">
                Cambiar Alumno:
              </span>
              <select
                value={currentStudentId}
                onChange={(e) => onSelectStudent(e.target.value)}
                className="text-xs bg-white border border-[#E8D5B5] rounded-lg px-2 py-1 text-[#44261B] font-bold focus:outline-none max-w-[170px]"
              >
                {studentsList.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.first_name} {s.last_name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Menu Items List (Estilo exacto Foto 4) */}
          <div className="flex-1 overflow-y-auto p-3 space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={item.action}
                  className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs font-bold transition-all text-left cursor-pointer ${
                    item.active
                      ? 'bg-[#5E612B] text-[#F4E8D1] shadow-xs'
                      : 'text-[#44261B] hover:bg-[#F4E8D1]/60'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon
                      className={`w-4 h-4 ${
                        item.active ? 'text-[#F4E8D1]' : 'text-[#5E612B]'
                      }`}
                    />
                    <span className="tracking-tight">{item.label}</span>
                  </div>

                  {item.badge ? (
                    <span className="text-[9px] uppercase font-black px-2 py-0.5 rounded-full bg-[#E8D5B5] text-[#44261B]">
                      {item.badge}
                    </span>
                  ) : (
                    <ChevronRight className="w-3.5 h-3.5 opacity-40" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Footer Version Info */}
          <div className="p-4 bg-[#F4E8D1]/40 border-t border-[#E8D5B5] text-center text-[10px] text-[#A68D74] font-medium">
            <span>Sermoa Fit Studio • Versión 2.0</span>
          </div>
        </div>
      </div>
    </div>
  );
};
