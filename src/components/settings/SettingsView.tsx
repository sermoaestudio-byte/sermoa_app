import React, { useState } from 'react';
import {
  Settings,
  ShieldCheck,
  MessageCircle,
  Save,
  Check,
  MapPin,
  Compass,
  Globe,
  ArrowLeft,
  Palette,
  Image as ImageIcon,
  Sparkles,
  Eye,
  RefreshCw
} from 'lucide-react';
import { useStudioStore } from '../../store/studioStore';
import { WhatsAppTemplatesTab } from './WhatsAppTemplatesTab';
import { applyStudioTheme } from '../../utils/theme';
import { getRegisterLink } from '../../utils/links';
import { toISODateString } from '../../utils/date';
import {
  Users,
  Calendar,
  Copy,
  QrCode,
  Share2,
  ExternalLink,
  Ticket,
  BarChart3
} from 'lucide-react';

interface SettingsViewProps {
  onNavigate?: (view: string) => void;
  onOpenQRPoster?: () => void;
}

const COLOR_PRESETS = [
  { name: 'Verde SERMOA Olive', hex: '#54875e', desc: 'Pilates Reformer & Salud' },
  { name: 'Lavanda Wellness', hex: '#8b5cf6', desc: 'Yoga & Meditación' },
  { name: 'Azul Océano', hex: '#0284c7', desc: 'Estudio & Fuerza' },
  { name: 'Rose Gold & Blush', hex: '#e11d48', desc: 'Boutique & Barre' },
  { name: 'Terracota Energía', hex: '#ea580c', desc: 'Funcional & Movimiento' },
  { name: 'Minimal Charcoal', hex: '#18181b', desc: 'Elegante & Premium' },
  { name: 'Verde Bosque', hex: '#15803d', desc: 'Natural & Orgánico' },
  { name: 'Dorado Warm Amber', hex: '#d97706', desc: 'Cálido & Exclusivo' },
];

const LOGO_PRESETS = [
  {
    name: 'Logo Local (Recomendado)',
    url: '/logo.png',
  },
  {
    name: 'Pilates Silueta',
    url: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=150&auto=format&fit=crop&q=80',
  },
  {
    name: 'Wellness & Yoga',
    url: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=150&auto=format&fit=crop&q=80',
  },
  {
    name: 'Fuerza & Fitness',
    url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=150&auto=format&fit=crop&q=80',
  },
  {
    name: 'Zen Balance',
    url: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=150&auto=format&fit=crop&q=80',
  },
];

export const SettingsView: React.FC<SettingsViewProps> = ({ onNavigate, onOpenQRPoster }) => {
  const { studio, profiles, branches, classes, bookings, currentRole, updateStudioSettings } = useStudioStore();
  const [copiedLink, setCopiedLink] = useState(false);
  const todayStr = toISODateString(new Date());
  const activeStudentsCount = profiles.filter((p) => p.role === 'client' && p.status === 'active').length;
  const instructorsCount = profiles.filter((p) => p.role === 'instructor' || p.is_instructor).length;
  const todayClasses = classes.filter((c) => !c.is_cancelled && (c.date === todayStr || c.day_of_week === new Date().getDay()));
  const todayBookings = bookings.filter((b) => b.booking_date === todayStr && b.status === 'confirmed');
  const registrationLink = getRegisterLink();

  const handleCopyRegistrationLink = () => {
    navigator.clipboard.writeText(registrationLink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };
  const [activeTab, setActiveTab] = useState<'general' | 'branding' | 'whatsapp'>('general');

  // General & GPS State
  const [name, setName] = useState(studio.name);
  const [slug, setSlug] = useState(studio.slug);
  const [phone, setPhone] = useState(studio.phone);
  const [email, setEmail] = useState(studio.email);
  const [cancellationHours, setCancellationHours] = useState(studio.cancellation_window_hours);
  const [gpsRadius, setGpsRadius] = useState(studio.gps_checkin_radius_meters);

  // Branding & Identity State
  const [logoUrl, setLogoUrl] = useState(studio.logo_url || LOGO_PRESETS[0].url);
  const [primaryColor, setPrimaryColor] = useState(studio.brand_colors?.primary || '#54875e');
  const [secondaryColor, setSecondaryColor] = useState(studio.brand_colors?.secondary || '#1e293b');

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleColorChange = (hex: string) => {
    setPrimaryColor(hex);
    applyStudioTheme({ primary: hex, secondary: secondaryColor });
  };

  const handleSecondaryColorChange = (hex: string) => {
    setSecondaryColor(hex);
    applyStudioTheme({ primary: primaryColor, secondary: hex });
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateStudioSettings({
      name,
      slug,
      phone,
      email,
      logo_url: logoUrl,
      brand_colors: {
        primary: primaryColor,
        secondary: secondaryColor,
      },
      cancellation_window_hours: cancellationHours,
      gps_checkin_radius_meters: gpsRadius,
    });
    applyStudioTheme({ primary: primaryColor, secondary: secondaryColor });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="py-6 sm:py-8 animate-fade-in">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start space-x-3">
            {onNavigate && (
              <button
                onClick={() => onNavigate('dashboard')}
                className="p-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-2xl shadow-xs transition-colors shrink-0 mt-0.5"
                title="Volver al Inicio"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}
            <div>
              <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                <Settings className="w-3.5 h-3.5 text-slate-500" />
                <span>Estrategia & Marca</span>
              </div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                Configuración del Estudio
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Personaliza la identidad visual, colores de marca, logo, reglas de reserva y mensajes de WhatsApp
              </p>
            </div>
          </div>

          {savedSuccess && (
            <div className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-2 shadow-xs animate-fade-in">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>¡Configuración guardada con éxito!</span>
            </div>
          )}
        </div>

        
        {/* OPERATIVA & ESTRATEGIA: ESTADO DEL ESTUDIO, REDES Y CARTEL QR */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

          {/* 1. Estado del Estudio */}
          <div className="bg-[#FAF8F5] rounded-3xl p-5 border border-[#E8DFD1] shadow-soft flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-extrabold text-[#1F2933]">Estado del Estudio</span>
                  <span className="bg-[#5EBA8C]/20 text-[#2B6D4E] font-extrabold text-[10px] px-2 py-0.5 rounded-full border border-[#5EBA8C]/40">
                    Activo
                  </span>
                </div>
                <span className="text-xs font-bold text-stone-400">
                  {todayClasses.length} clases hoy
                </span>
              </div>

              <div className="bg-[#F5F1EB] rounded-2xl p-3 border border-[#E8DFD1] space-y-2 mb-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-stone-500 font-medium flex items-center space-x-1.5">
                    <Users className="w-3.5 h-3.5 text-[#1F2933]" />
                    <span>Alumnos Activos</span>
                  </span>
                  <span className="font-extrabold text-[#1F2933]">{activeStudentsCount}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-stone-500 font-medium flex items-center space-x-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#C18749]" />
                    <span>Equipo Docente</span>
                  </span>
                  <span className="font-extrabold text-[#1F2933]">{instructorsCount} profesores</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-stone-500 font-medium flex items-center space-x-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#5EBA8C]" />
                    <span>Turnos Confirmados</span>
                  </span>
                  <span className="font-extrabold text-[#2B6D4E]">{todayBookings.length} reservas</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                type="button"
                onClick={() => onNavigate && onNavigate('classes')}
                className="py-2 px-3 bg-[#EFE9DF] hover:bg-[#E5DDCF] text-[#1F2933] rounded-xl text-xs font-bold transition-colors text-center"
              >
                Ver Horarios
              </button>
              <button
                type="button"
                onClick={() => onNavigate && onNavigate('attendance')}
                className="py-2 px-3 bg-[#EFE9DF] hover:bg-[#E5DDCF] text-[#1F2933] rounded-xl text-xs font-bold transition-colors text-center"
              >
                Pasar Lista
              </button>
            </div>
          </div>

          {/* 2. Link de Alta & Redes Sociales */}
          <div className="bg-[#FAF8F5] rounded-3xl p-5 border border-[#E8DFD1] shadow-soft flex flex-col justify-between">
            <div>
              <div className="flex items-start space-x-3 mb-2">
                <div className="p-2 rounded-xl bg-[#F7C59F]/40 text-[#8C502E] border border-[#F7C59F]">
                  <Share2 className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#8C502E] bg-[#F7C59F]/40 px-2 py-0.5 rounded-full">
                    Inscripciones & Redes
                  </span>
                  <h4 className="font-extrabold text-[#1F2933] text-sm mt-1">
                    Link de Alta para Alumnos
                  </h4>
                </div>
              </div>

              <div className="p-2 bg-[#F5F1EB] rounded-xl border border-[#E8DFD1] text-[11px] font-mono text-[#1F2933] truncate mb-2">
                {registrationLink}
              </div>
            </div>

            <div className="space-y-2 pt-1">
              <button
                type="button"
                onClick={handleCopyRegistrationLink}
                className="w-full py-2 px-3 rounded-xl bg-[#1F2933] hover:bg-[#32404E] text-white text-xs font-extrabold flex items-center justify-center space-x-1.5 transition-all shadow-xs"
              >
                {copiedLink ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>¡Link Copiado!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copiar Enlace de Inscripción</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => onNavigate && onNavigate('portal-alumno')}
                className="w-full py-1.5 px-3 rounded-xl border border-[#D6CAB7] hover:bg-[#EFE9DF] text-stone-700 text-xs font-bold flex items-center justify-center space-x-1.5 transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5 text-stone-500" />
                <span>Previsualizar Portal Alumno</span>
              </button>
            </div>
          </div>

          {/* 3. Cartel QR & Accesos de Gestión */}
          <div className="bg-[#FAF8F5] rounded-3xl p-5 border border-[#E8DFD1] shadow-soft flex flex-col justify-between">
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <div className="p-2 rounded-xl bg-[#5EBA8C]/20 text-[#2B6D4E] border border-[#5EBA8C]/40">
                  <QrCode className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-extrabold text-[#1F2933] text-sm">
                    Difusión & Cartelería
                  </h4>
                  <p className="text-[11px] text-stone-500">Cartel QR para recepción y mesón de entrada</p>
                </div>
              </div>

              <button
                type="button"
                onClick={onOpenQRPoster}
                className="w-full py-2.5 px-3 bg-[#5EBA8C]/20 hover:bg-[#5EBA8C]/30 text-[#2B6D4E] border border-[#5EBA8C]/40 rounded-xl text-xs font-extrabold flex items-center justify-center space-x-2 transition-all mt-2"
              >
                <QrCode className="w-4 h-4" />
                <span>Ver / Imprimir Cartel QR</span>
              </button>
            </div>

            <div className="border-t border-[#E8DFD1] pt-3 mt-3 grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => onNavigate && onNavigate('packs')}
                className="py-2 px-2.5 bg-white hover:bg-[#F5F1EB] border border-[#E8DFD1] rounded-xl text-xs font-extrabold text-[#1F2933] flex items-center justify-center space-x-1.5 transition-colors"
              >
                <Ticket className="w-3.5 h-3.5 text-purple-600" />
                <span>Packs</span>
              </button>
              <button
                type="button"
                onClick={() => onNavigate && onNavigate('finance')}
                className="py-2 px-2.5 bg-white hover:bg-[#F5F1EB] border border-[#E8DFD1] rounded-xl text-xs font-extrabold text-[#1F2933] flex items-center justify-center space-x-1.5 transition-colors"
              >
                <BarChart3 className="w-3.5 h-3.5 text-[#5EBA8C]" />
                <span>Caja & Finanzas</span>
              </button>
            </div>
          </div>

        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-2 border-b border-slate-200/80 pb-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('general')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all shrink-0 ${
              activeTab === 'general'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
            }`}
          >
            Ajustes Generales & GPS
          </button>

          <button
            onClick={() => setActiveTab('branding')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all shrink-0 flex items-center space-x-1.5 ${
              activeTab === 'branding'
                ? 'bg-brand-600 text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
            }`}
          >
            <Palette className="w-3.5 h-3.5" />
            <span>Colores & Logo del Negocio</span>
          </button>

          <button
            onClick={() => setActiveTab('whatsapp')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all shrink-0 flex items-center space-x-1.5 ${
              activeTab === 'whatsapp'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
            }`}
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>Plantillas de WhatsApp</span>
          </button>
        </div>

        {/* Tab 1: WhatsApp */}
        {activeTab === 'whatsapp' && <WhatsAppTemplatesTab />}

        {/* Tab 2: Colores & Logo (Branding) */}
        {activeTab === 'branding' && (
          <form onSubmit={handleSaveSettings} className="space-y-6 max-w-4xl">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Left Column: Color & Logo Pickers */}
              <div className="lg:col-span-2 space-y-6">
                
                {/* 1. Logo Configuration */}
                <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-soft space-y-4">
                  <div className="flex items-center space-x-2 text-xs font-extrabold uppercase tracking-wider text-slate-500">
                    <ImageIcon className="w-4 h-4 text-brand-600" />
                    <span>1. Logo del Negocio</span>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      URL de la Imagen del Logo
                    </label>
                    <input
                      type="url"
                      required
                      placeholder="https://tu-estudio.com/logo.png"
                      value={logoUrl}
                      onChange={(e) => setLogoUrl(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                    />
                    <p className="text-[11px] text-slate-400 mt-1">
                      Pega el link directo a tu logotipo en formato PNG o JPG.
                    </p>
                  </div>

                  {/* Preset Logos */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-2">
                      O elige uno de nuestros logos de muestra:
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {LOGO_PRESETS.map((preset, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setLogoUrl(preset.url)}
                          className={`p-2 rounded-2xl border text-center transition-all flex flex-col items-center space-y-1.5 ${
                            logoUrl === preset.url
                              ? 'border-brand-500 bg-brand-50/50 ring-2 ring-brand-500/20'
                              : 'border-slate-200 hover:bg-slate-50'
                          }`}
                        >
                          <img
                            src={preset.url}
                            alt={preset.name}
                            className="w-10 h-10 rounded-xl object-cover shadow-2xs border border-slate-100"
                          />
                          <span className="text-[10px] font-bold text-slate-700 truncate w-full">
                            {preset.name}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 2. Color Scheme Configuration */}
                <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-soft space-y-5">
                  <div className="flex items-center space-x-2 text-xs font-extrabold uppercase tracking-wider text-slate-500">
                    <Palette className="w-4 h-4 text-brand-600" />
                    <span>2. Colores Distintivos de la Marca</span>
                  </div>

                  {/* Color Pickers Inputs */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Primary Color */}
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
                      <label className="block text-xs font-extrabold text-slate-800">
                        Color Primario (Botones & Acciones)
                      </label>
                      <div className="flex items-center space-x-3">
                        <input
                          type="color"
                          value={primaryColor}
                          onChange={(e) => handleColorChange(e.target.value)}
                          className="w-11 h-11 rounded-xl border border-slate-300 cursor-pointer p-0.5 bg-white shrink-0"
                        />
                        <div className="flex-1">
                          <input
                            type="text"
                            value={primaryColor}
                            onChange={(e) => handleColorChange(e.target.value)}
                            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-mono text-xs font-bold text-slate-800 uppercase focus:outline-none focus:ring-2 focus:ring-brand-500"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Secondary Color */}
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
                      <label className="block text-xs font-extrabold text-slate-800">
                        Color Secundario / Oscuro
                      </label>
                      <div className="flex items-center space-x-3">
                        <input
                          type="color"
                          value={secondaryColor}
                          onChange={(e) => handleSecondaryColorChange(e.target.value)}
                          className="w-11 h-11 rounded-xl border border-slate-300 cursor-pointer p-0.5 bg-white shrink-0"
                        />
                        <div className="flex-1">
                          <input
                            type="text"
                            value={secondaryColor}
                            onChange={(e) => handleSecondaryColorChange(e.target.value)}
                            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-mono text-xs font-bold text-slate-800 uppercase focus:outline-none focus:ring-2 focus:ring-brand-500"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Preset Palettes */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-2.5">
                      Paletas de Colores Rápidas Recomendadas:
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                      {COLOR_PRESETS.map((preset, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleColorChange(preset.hex)}
                          className={`p-2.5 rounded-2xl border text-left transition-all flex items-center space-x-2.5 ${
                            primaryColor.toLowerCase() === preset.hex.toLowerCase()
                              ? 'border-brand-500 bg-brand-50/40 ring-2 ring-brand-500/20'
                              : 'border-slate-200 hover:bg-slate-50'
                          }`}
                        >
                          <div
                            className="w-7 h-7 rounded-xl shrink-0 shadow-2xs border border-black/10"
                            style={{ backgroundColor: preset.hex }}
                          />
                          <div className="truncate">
                            <span className="text-[11px] font-extrabold text-slate-800 block truncate">
                              {preset.name}
                            </span>
                            <span className="text-[9px] text-slate-400 block truncate">
                              {preset.desc}
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                </div>

              </div>

              {/* Right Column: Live Brand Preview Card */}
              <div className="space-y-4">
                <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-soft sticky top-24 space-y-4">
                  <div className="flex items-center space-x-2 text-xs font-extrabold uppercase tracking-wider text-slate-500">
                    <Eye className="w-4 h-4 text-brand-600" />
                    <span>Vista Previa en Vivo</span>
                  </div>

                  {/* Simulated App Card with Dynamic Brand Colors */}
                  <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200/80 space-y-4 text-center">
                    <div className="relative mx-auto w-16 h-16 rounded-2xl bg-white p-1.5 shadow-md border border-slate-100 flex items-center justify-center">
                      <img
                        src={logoUrl}
                        alt="Logo Preview"
                        className="w-full h-full object-cover rounded-xl"
                        onError={(e) => {
                          (e.target as any).src = LOGO_PRESETS[0].url;
                        }}
                      />
                    </div>

                    <div>
                      <h4 className="font-extrabold text-slate-900 text-base">{name || 'Mi Estudio'}</h4>
                      <span
                        className="inline-block mt-1 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full text-white shadow-2xs"
                        style={{ backgroundColor: primaryColor }}
                      >
                        Estudio Oficial
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      Así lucirán los botones y elementos interactivos en el portal de alumnos y en la app.
                    </p>

                    <button
                      type="button"
                      className="w-full py-2.5 px-4 rounded-xl text-white font-extrabold text-xs shadow-md transition-transform hover:scale-[1.02]"
                      style={{ backgroundColor: primaryColor }}
                    >
                      Reservar Clase
                    </button>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full py-3 bg-slate-900 hover:bg-black text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center justify-center space-x-2"
                    >
                      <Save className="w-4 h-4" />
                      <span>Guardar Identidad de Marca</span>
                    </button>
                  </div>
                </div>
              </div>

            </div>
          </form>
        )}

        {/* Tab 3: Ajustes Generales & GPS */}
        {activeTab === 'general' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-soft max-w-3xl">
            <form onSubmit={handleSaveSettings} className="space-y-6">
              
              {/* Studio Info */}
              <div>
                <h3 className="text-base font-extrabold text-slate-900 mb-1">Información del Estudio</h3>
                <p className="text-xs text-slate-400 mb-4">Datos de contacto y link público del estudio</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Nombre del Estudio
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Enlace / Slug Público
                    </label>
                    <div className="flex items-center">
                      <span className="bg-slate-100 border border-r-0 border-slate-200 px-3 py-2.5 rounded-l-xl text-xs text-slate-500 font-mono">
                        sermoa.app/
                      </span>
                      <input
                        type="text"
                        required
                        value={slug}
                        onChange={(e) => setSlug(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-r-xl text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Teléfono de Contacto / WhatsApp
                    </label>
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Email de Notificaciones
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
                    />
                  </div>
                </div>
              </div>

              {/* Security & Policies */}
              <div className="pt-6 border-t border-slate-100">
                <h3 className="text-base font-extrabold text-slate-900 mb-1">
                  Políticas de Reserva & Geofencing GPS
                </h3>
                <p className="text-xs text-slate-400 mb-4">
                  Reglas anti-fraude y tiempos límite para el funcionamiento automático
                </p>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Límite de Cancelación Anticipada (Horas)
                    </label>
                    <div className="flex items-center space-x-3">
                      <input
                        type="number"
                        min="1"
                        max="24"
                        value={cancellationHours}
                        onChange={(e) => setCancellationHours(Number(e.target.value))}
                        className="w-24 px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-800 focus:outline-none"
                      />
                      <span className="text-xs text-slate-500">
                        horas antes del turno para recuperar el crédito de la clase
                      </span>
                    </div>
                  </div>

                  {/* GPS Radius Setting */}
                  <div className="p-4 bg-emerald-50/60 border border-emerald-200 rounded-2xl">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <Compass className="w-4 h-4 text-emerald-600" />
                        <span className="text-xs font-extrabold text-emerald-950">
                          Radio Máximo de Validación GPS para Check-in
                        </span>
                      </div>
                      <span className="text-xs font-extrabold text-emerald-700 bg-white px-2.5 py-0.5 rounded-full border border-emerald-200">
                        {gpsRadius} metros
                      </span>
                    </div>
                    <input
                      type="range"
                      min="25"
                      max="300"
                      step="5"
                      value={gpsRadius}
                      onChange={(e) => setGpsRadius(Number(e.target.value))}
                      className="w-full accent-emerald-600 cursor-pointer"
                    />
                    <p className="text-[11px] text-emerald-800 mt-2">
                      Si el alumno escanea el QR a más de <strong>{gpsRadius} metros</strong> de la sucursal, el sistema rechazará la asistencia para evitar fraude desde el hogar.
                    </p>
                  </div>
                </div>
              </div>

              {/* Submit */}
              <div className="pt-6 border-t border-slate-100 flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-brand-600 hover:bg-brand-700 text-white text-xs font-extrabold rounded-xl shadow-sm transition-all flex items-center space-x-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>Guardar Cambios</span>
                </button>
              </div>

            </form>
          </div>
        )}

      </div>
    </div>
  );
};
