import React from 'react';
import { Settings, Ticket, BarChart3 } from 'lucide-react';

interface EstrategiaMarcaSectionProps {
  onNavigate: (view: string) => void;
}

export const EstrategiaMarcaSection: React.FC<EstrategiaMarcaSectionProps> = ({ onNavigate }) => {
  return (
    <section aria-labelledby="estrategia-marca-heading" className="mb-10">
      
      {/* Section Header */}
      <div className="flex items-center space-x-2 text-base font-extrabold text-slate-800 mb-4">
        <span className="text-slate-600">⚙️</span>
        <h3 id="estrategia-marca-heading">Estrategia & Marca</h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        
        {/* Card: Configuración del estudio */}
        <button
          onClick={() => onNavigate('settings')}
          className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-soft hover:shadow-soft-lg hover:border-slate-300 transition-all text-left group"
        >
          <div className="w-11 h-11 rounded-2xl bg-slate-100 text-slate-700 flex items-center justify-center mb-3.5 group-hover:scale-105 transition-transform">
            <Settings className="w-5 h-5" />
          </div>
          <h5 className="font-extrabold text-slate-800 text-base">Configuración del estudio</h5>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Gestiona tu marca, políticas y WhatsApp
          </p>
        </button>

        {/* Card: Packs de créditos */}
        <button
          onClick={() => onNavigate('pricing')}
          className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-soft hover:shadow-soft-lg hover:border-purple-200 transition-all text-left group"
        >
          <div className="w-11 h-11 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mb-3.5 group-hover:scale-105 transition-transform">
            <Ticket className="w-5 h-5" />
          </div>
          <h5 className="font-extrabold text-slate-800 text-base">Packs de créditos</h5>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Gestiona planes, tarifas y vigencias
          </p>
        </button>

        {/* Card: Control financiero */}
        <button
          onClick={() => onNavigate('finance')}
          className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-soft hover:shadow-soft-lg hover:border-emerald-200 transition-all text-left group"
        >
          <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3.5 group-hover:scale-105 transition-transform">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div className="flex items-center space-x-2">
            <h5 className="font-extrabold text-slate-800 text-base">Control financiero</h5>
            <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase">
              Nuevo
            </span>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Ingresos, gastos y metas del mes
          </p>
        </button>

      </div>
    </section>
  );
};
