import React, { useState } from 'react';
import { Settings, ShieldCheck, MessageCircle, Save, Check, MapPin, Compass, Globe } from 'lucide-react';
import { useStudioStore } from '../../store/studioStore';
import { WhatsAppTemplatesTab } from './WhatsAppTemplatesTab';

export const SettingsView: React.FC = () => {
  const { studio, updateStudioSettings } = useStudioStore();
  const [activeTab, setActiveTab] = useState<'general' | 'whatsapp'>('general');

  const [name, setName] = useState(studio.name);
  const [slug, setSlug] = useState(studio.slug);
  const [phone, setPhone] = useState(studio.phone);
  const [email, setEmail] = useState(studio.email);
  const [cancellationHours, setCancellationHours] = useState(studio.cancellation_window_hours);
  const [gpsRadius, setGpsRadius] = useState(studio.gps_checkin_radius_meters);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveGeneral = (e: React.FormEvent) => {
    e.preventDefault();
    updateStudioSettings({
      name,
      slug,
      phone,
      email,
      cancellation_window_hours: cancellationHours,
      gps_checkin_radius_meters: gpsRadius,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  return (
    <div className="py-6 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
              <Settings className="w-3.5 h-3.5 text-slate-500" />
              <span>Estrategia & Marca</span>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Configuración del Estudio
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Personaliza tu marca, reglas de cancelación, validación GPS y mensajes de WhatsApp
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-2 mb-6 border-b border-slate-200/80 pb-2">
          <button
            onClick={() => setActiveTab('general')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all ${
              activeTab === 'general'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
            }`}
          >
            Ajustes Generales & GPS
          </button>

          <button
            onClick={() => setActiveTab('whatsapp')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center space-x-1.5 ${
              activeTab === 'whatsapp'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
            }`}
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>Plantillas de WhatsApp</span>
          </button>
        </div>

        {activeTab === 'whatsapp' ? (
          <WhatsAppTemplatesTab />
        ) : (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-soft max-w-3xl">
            <form onSubmit={handleSaveGeneral} className="space-y-6">
              
              {/* Studio Info */}
              <div>
                <h3 className="text-base font-extrabold text-slate-900 mb-1">Identidad de Marca</h3>
                <p className="text-xs text-slate-400 mb-4">Información visible para tus alumnos</p>

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
                  {savedSuccess ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                  <span>{savedSuccess ? '¡Cambios Guardados!' : 'Guardar Cambios'}</span>
                </button>
              </div>

            </form>
          </div>
        )}

      </div>
    </div>
  );
};
