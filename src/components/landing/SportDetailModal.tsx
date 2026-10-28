import React, { useEffect } from 'react';
import {
  X,
  Check,
  ArrowRight
} from 'lucide-react';
import { SportDetailData, SPORTS_DETAILS_DATA } from './sportsData';
import { SportIcon } from './SportIcon';
import { SportPictogram } from './SportPictogram';

interface SportDetailModalProps {
  sportId: string | null;
  onClose: () => void;
  onNavigateToRegister?: () => void;
}

export const SportDetailModal: React.FC<SportDetailModalProps> = ({
  sportId,
  onClose,
  onNavigateToRegister
}) => {
  if (!sportId || !SPORTS_DETAILS_DATA[sportId]) return null;

  const sport: SportDetailData = SPORTS_DETAILS_DATA[sportId];

  // Cerrar con Escape y bloquear scroll del body mientras el modal esté abierto
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 md:p-8 bg-stone-900/60 backdrop-blur-sm animate-fade-in overflow-y-auto"
      onClick={onClose}
    >
      {/* Contenedor del Modal */}
      <div
        className="bg-[#FDFBF7] border border-[#EAE2D5] rounded-[2rem] sm:rounded-[2.5rem] max-w-3xl w-full my-auto shadow-2xl overflow-hidden relative text-stone-800 font-sans selection:bg-[#475B44] selection:text-white max-h-[92vh] flex flex-col animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Botón flotante para cerrar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-30 w-10 h-10 rounded-full bg-white/90 hover:bg-white text-stone-600 hover:text-stone-900 border border-[#EAE2D5] flex items-center justify-center transition-all shadow-sm active:scale-90"
          aria-label="Cerrar modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Contenido scrolleable interno con estética impecable */}
        <div className="overflow-y-auto px-5 sm:px-8 py-6 sm:py-8 space-y-8 sm:space-y-10 custom-scrollbar">

          {/* ============================================================ */}
          {/* A. ENCABEZADO PRINCIPAL (Pictograma Minimalista en Silueta)  */}
          {/* ============================================================ */}
          <section className="relative pt-2">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8 items-center">
              
              {/* Columna Izquierda: Badge, Título e Introducción */}
              <div className="md:col-span-7 flex flex-col items-start pr-0 md:pr-2">
                
                {/* Badge con píldora verde salvia */}
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#5EBA8C]/15 text-[#3D7A5C] text-xs font-semibold mb-4 shadow-xs">
                  <span className="w-2 h-2 rounded-full bg-[#5EBA8C]" />
                  <span className="tracking-wide">{sport.badge}</span>
                </div>

                {/* Título elegante serif */}
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif text-stone-900 mb-3.5 leading-tight tracking-tight">
                  {sport.title}
                </h2>

                {/* Introducción prudente */}
                <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">
                  {sport.introduction}
                </p>
              </div>

              {/* Columna Derecha: Pictograma minimalista en silueta con contenedor circular / cuadrado suave */}
              <div className="md:col-span-5 relative flex justify-center">
                <div className="absolute -top-3 -right-3 w-48 h-48 bg-[#5EBA8C]/15 rounded-full blur-2xl pointer-events-none" />
                
                <div className="relative w-full max-w-[220px] aspect-square rounded-[2rem] bg-gradient-to-br from-[#FAF8F5] to-[#F5F2EB] border border-[#E8DFD1] shadow-md flex flex-col items-center justify-center p-6 group">
                  <div className="w-24 h-24 rounded-full bg-[#F5F2EB] border border-[#E8DFD1] shadow-xs flex items-center justify-center p-4 relative overflow-hidden mb-2">
                    <div className="absolute inset-0 bg-[#5EBA8C]/10 rounded-full blur-xs pointer-events-none" />
                    <SportPictogram
                      sportId={sport.id}
                      className="w-16 h-16 relative z-10 transition-transform duration-500 group-hover:scale-105"
                      color="#475B44"
                      accentColor="#C18749"
                    />
                  </div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#475B44]">
                    Movimiento Consciente
                  </span>
                </div>
              </div>

            </div>
          </section>


          {/* ============================================================ */}
          {/* B. CAPACIDADES A TRABAJAR (4 tarjetas con iconos lineales)  */}
          {/* ============================================================ */}
          <section>
            <div className="mb-4">
              <span className="text-[11px] font-bold tracking-widest text-[#475B44] uppercase block">
                CAPACIDADES A TRABAJAR
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {sport.capacities.map((cap, idx) => (
                <div
                  key={idx}
                  className="bg-[#FAF8F5] border border-[#EAE2D5] rounded-2xl p-4 flex flex-col items-center text-center justify-between shadow-xs hover:border-[#D6CAB7] transition-all group"
                >
                  {/* Icono lineal orgánico */}
                  <div className="w-12 h-12 rounded-xl bg-white border border-[#EAE2D5]/70 flex items-center justify-center mb-3 shadow-xs group-hover:scale-105 transition-transform">
                    <SportIcon type={cap.iconType} className="w-6 h-6" color="#5EBA8C" />
                  </div>

                  <span className="text-xs font-semibold text-stone-800 leading-snug">
                    {cap.title}
                  </span>
                </div>
              ))}
            </div>
          </section>


          {/* ============================================================ */}
          {/* C. BLOQUE DE BENEFICIOS ("¿Cómo te beneficia?")             */}
          {/* ============================================================ */}
          <section className="bg-[#FAF8F5] border border-[#EAE2D5] rounded-3xl p-5 sm:p-7 shadow-xs relative overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              
              {/* Lista con checkmarks */}
              <div className="md:col-span-8">
                <h3 className="text-xl sm:text-2xl font-serif text-stone-900 mb-5 tracking-tight">
                  ¿Cómo te beneficia?
                </h3>

                <div className="space-y-4">
                  {sport.benefits.map((benefit, bIdx) => (
                    <div key={bIdx} className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-[#475B44] text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                        <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                      </div>

                      <div className="flex-1">
                        <h4 className="text-xs sm:text-sm font-semibold text-stone-900 mb-0.5">
                          {benefit.title}
                        </h4>
                        <p className="text-xs text-stone-600 leading-relaxed">
                          {benefit.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Frase editorial a la derecha */}
              <div className="md:col-span-4 flex items-center justify-center pt-4 md:pt-0 border-t md:border-t-0 md:border-l border-[#EAE2D5]/70 md:pl-5">
                <div className="relative text-center md:text-left">
                  <p className="font-serif italic text-sm sm:text-base text-stone-600 leading-snug">
                    "{sport.closing.quote}"
                  </p>
                  <div className="w-12 h-0.5 bg-[#475B44]/30 mt-2.5 mx-auto md:mx-0 rounded-full" />
                </div>
              </div>

            </div>
          </section>


          {/* ============================================================ */}
          {/* D. CIERRE ("PILATES EN TU ENTRENAMIENTO")                   */}
          {/* ============================================================ */}
          <section className="bg-[#FAF8F5] border border-[#EAE2D5] rounded-2xl sm:rounded-3xl p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
            
            <div className="flex items-center gap-4 w-full sm:w-auto">
              {/* Icono de postura consciente */}
              <div className="w-12 h-12 rounded-xl bg-white border border-[#EAE2D5] flex items-center justify-center shrink-0 text-[#475B44] shadow-xs">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
                  <circle cx="12" cy="5" r="2.5" />
                  <path d="M5 19l4-3 3-5 5 2 3 6" />
                  <path d="M9 11l-3 4" />
                  <path d="M12 11v6" />
                </svg>
              </div>

              <div>
                <span className="text-[10px] font-bold tracking-widest text-[#475B44] uppercase block mb-0.5">
                  PILATES EN TU ENTRENAMIENTO
                </span>
                <h4 className="text-sm sm:text-base font-serif text-stone-900 font-semibold mb-0.5">
                  {sport.closing.title}
                </h4>
                <p className="text-xs text-stone-600 leading-relaxed">
                  {sport.closing.description}
                </p>
              </div>
            </div>

            {/* Acción de cierre */}
            {onNavigateToRegister ? (
              <button
                onClick={() => {
                  onClose();
                  onNavigateToRegister();
                }}
                className="w-full sm:w-auto px-4 py-2.5 rounded-full bg-[#475B44] hover:bg-[#384836] text-white text-xs font-semibold transition-all shadow-sm hover:shadow flex items-center justify-center gap-1.5 active:scale-95 shrink-0"
              >
                <span>Quiero sumarme</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={onClose}
                className="w-9 h-9 rounded-full bg-[#475B44] text-white hover:bg-[#384836] flex items-center justify-center shrink-0 transition-transform active:scale-95 shadow-sm"
                title="Cerrar"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            )}

          </section>

        </div>
      </div>
    </div>
  );
};
