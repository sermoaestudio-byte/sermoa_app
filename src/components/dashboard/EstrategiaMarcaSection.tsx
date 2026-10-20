import React from 'react';
import { Settings, BarChart3, ShieldCheck } from 'lucide-react';
import { useStudioStore } from '../../store/studioStore';

interface EstrategiaMarcaSectionProps {
  onNavigate: (view: string) => void;
}

export const EstrategiaMarcaSection: React.FC<EstrategiaMarcaSectionProps> = ({ onNavigate }) => {
  const { currentRole } = useStudioStore();

  if (currentRole !== 'admin') {
    return null;
  }
  return (
    <section aria-labelledby="estrategia-marca-heading" className="mb-10">
      
      {/* Section Header */}
      <div className="flex items-center space-x-2 text-base font-extrabold text-[#1F2933] mb-4">
        <span className="text-stone-500">⚙️</span>
        <h3 id="estrategia-marca-heading">Configuración & Finanzas</h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        
        {/* Card: Configuración del estudio */}
        <button
          onClick={() => onNavigate('settings')}
          className="bg-[#FAF8F5] rounded-2xl p-5 border border-[#E8DFD1] shadow-soft hover:shadow-soft-lg hover:border-[#D6CAB7] transition-all text-left group"
        >
          <div className="w-11 h-11 rounded-2xl bg-[#EFE9DF] text-[#1F2933] flex items-center justify-center mb-3.5 group-hover:scale-105 transition-transform">
            <Settings className="w-5 h-5" />
          </div>
          <h5 className="font-extrabold text-[#1F2933] text-base">Configuración del estudio</h5>
          <p className="text-xs text-stone-500 font-medium mt-1">
            Gestiona la marca, políticas de cancelación, radio GPS y plantillas de WhatsApp
          </p>
        </button>

        {/* Card: Control financiero */}
        <button
          onClick={() => onNavigate('finance')}
          className="bg-[#FAF8F5] rounded-2xl p-5 border border-[#E8DFD1] shadow-soft hover:shadow-soft-lg hover:border-[#5EBA8C]/50 transition-all text-left group"
        >
          <div className="w-11 h-11 rounded-2xl bg-[#5EBA8C]/20 text-[#2B6D4E] flex items-center justify-center mb-3.5 group-hover:scale-105 transition-transform">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div className="flex items-center space-x-2">
            <h5 className="font-extrabold text-[#1F2933] text-base">Control financiero & Caja</h5>
            <span className="bg-[#5EBA8C]/20 text-[#2B6D4E] text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase">
              Activo
            </span>
          </div>
          <p className="text-xs text-stone-500 font-medium mt-1">
            Registro de cobros, pagos de profesores, egresos y balances de ingresos
          </p>
        </button>

      </div>
    </section>
  );
};
