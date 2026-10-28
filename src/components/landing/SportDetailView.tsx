import React, { useEffect } from 'react';
import {
  ArrowLeft,
  Check,
  ArrowRight,
  Sparkles,
  Heart
} from 'lucide-react';
import { SportDetailData, SPORTS_DETAILS_DATA } from './sportsData';
import { SportIcon } from './SportIcon';

interface SportDetailViewProps {
  sportId: string;
  onBack: () => void;
  onNavigateToRegister?: () => void;
}

export const SportDetailView: React.FC<SportDetailViewProps> = ({
  sportId,
  onBack,
  onNavigateToRegister
}) => {
  const sport: SportDetailData = SPORTS_DETAILS_DATA[sportId] || SPORTS_DETAILS_DATA.running;

  // Scroll to top when view opens
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [sportId]);

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-stone-800 font-sans selection:bg-[#475B44] selection:text-white antialiased pb-20">

      {/* Barra superior de navegación / volver */}
      <header className="sticky top-0 left-0 right-0 bg-[#FDFBF7]/90 backdrop-blur-md z-40 border-b border-[#EAE2D5]/70 py-4 px-6">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-stone-600 hover:text-stone-900 bg-white/80 hover:bg-white border border-[#EAE2D5] px-4 py-2 rounded-full transition-all shadow-xs active:scale-95 group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5 text-[#475B44]" />
            <span>Volver a Beneficios</span>
          </button>

          <span className="text-xs font-semibold text-stone-500 hidden sm:inline-block">
            Pilates como Complemento Deportivo
          </span>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-5 sm:px-8 pt-8 sm:pt-12">

        {/* ============================================================ */}
        {/* A. ENCABEZADO PRINCIPAL                                      */}
        {/* ============================================================ */}
        <section className="relative mb-14 sm:mb-20">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            
            {/* Columna Izquierda: Badge, Título e Introducción */}
            <div className="md:col-span-7 flex flex-col items-start">
              
              {/* Badge con icono y nombre del deporte */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#5EBA8C]/15 text-[#3D7A5C] text-xs font-semibold mb-6 shadow-xs">
                <span className="w-2 h-2 rounded-full bg-[#5EBA8C] animate-pulse" />
                <span className="tracking-wide">{sport.badge}</span>
              </div>

              {/* Título elegante serif */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif text-stone-900 mb-5 leading-tight tracking-tight">
                {sport.title}
              </h1>

              {/* Introducción prudente */}
              <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
                {sport.introduction}
              </p>
            </div>

            {/* Columna Derecha: Fotografía destacada con fondo curvo orgánico */}
            <div className="md:col-span-5 relative flex justify-center">
              {/* Mancha orgánica de fondo sutil detrás de la foto */}
              <div className="absolute -top-4 -right-4 sm:-right-8 w-64 h-64 sm:w-72 sm:h-72 bg-[#5EBA8C]/10 rounded-full blur-2xl pointer-events-none" />
              
              <div className="relative w-full max-w-sm aspect-[4/5] rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden shadow-xl border border-[#EAE2D5]/80 bg-stone-100">
                <img
                  src={sport.heroImage}
                  alt={sport.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/25 via-transparent to-transparent pointer-events-none" />
              </div>
            </div>

          </div>
        </section>


        {/* ============================================================ */}
        {/* B. CAPACIDADES A TRABAJAR                                    */}
        {/* ============================================================ */}
        <section className="mb-14 sm:mb-20">
          <div className="mb-6">
            <span className="text-[11px] sm:text-xs font-bold tracking-widest text-[#475B44] uppercase block">
              CAPACIDADES A TRABAJAR
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            {sport.capacities.map((cap, idx) => (
              <div
                key={idx}
                className="bg-[#FAF8F5] border border-[#EAE2D5] rounded-3xl p-5 sm:p-6 flex flex-col items-center text-center justify-between shadow-xs hover:shadow-md hover:border-[#D6CAB7] transition-all group hover:-translate-y-1"
              >
                {/* Contenedor del icono lineal orgánico */}
                <div className="w-14 h-14 rounded-2xl bg-white/90 border border-[#EAE2D5]/60 flex items-center justify-center mb-4 shadow-xs group-hover:scale-105 transition-transform">
                  <SportIcon type={cap.iconType} className="w-7 h-7" color="#5EBA8C" />
                </div>

                <span className="text-xs sm:text-sm font-semibold text-stone-800 leading-snug">
                  {cap.title}
                </span>
              </div>
            ))}
          </div>
        </section>


        {/* ============================================================ */}
        {/* C. BLOQUE DE BENEFICIOS                                      */}
        {/* ============================================================ */}
        <section className="bg-[#FAF8F5] border border-[#EAE2D5] rounded-[2rem] p-6 sm:p-10 md:p-12 mb-14 sm:mb-20 shadow-sm relative overflow-hidden">
          
          {/* Mancha decorativa interior */}
          <div className="absolute -top-16 -right-16 w-56 h-56 bg-[#5EBA8C]/5 rounded-full pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            
            {/* Lista de beneficios (8 cols en desktop) */}
            <div className="lg:col-span-8">
              <h2 className="text-2xl sm:text-3xl font-serif text-stone-900 mb-8 tracking-tight">
                ¿Cómo te beneficia?
              </h2>

              <div className="space-y-6">
                {sport.benefits.map((benefit, bIdx) => (
                  <div key={bIdx} className="flex items-start gap-4">
                    {/* Checkmark circular verde salvia */}
                    <div className="w-7 h-7 rounded-full bg-[#475B44] text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                      <Check className="w-4 h-4 stroke-[2.5]" />
                    </div>

                    <div className="flex-1">
                      <h3 className="text-sm sm:text-base font-semibold text-stone-900 mb-1">
                        {benefit.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                        {benefit.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Frase decorativa manuscrita/editorial en columna lateral */}
            <div className="lg:col-span-4 flex items-center justify-center pt-4 lg:pt-0 border-t lg:border-t-0 lg:border-l border-[#EAE2D5]/70 lg:pl-6">
              <div className="relative text-center lg:text-left max-w-xs transform lg:rotate-1">
                <p className="font-serif italic text-base sm:text-lg text-stone-600/90 leading-snug">
                  "{sport.closing.quote}"
                </p>
                <div className="w-16 h-0.5 bg-[#475B44]/30 mt-3 mx-auto lg:mx-0 rounded-full" />
              </div>
            </div>

          </div>
        </section>


        {/* ============================================================ */}
        {/* D. CIERRE / BANNER INFERIOR                                  */}
        {/* ============================================================ */}
        <section className="bg-[#FAF8F5] border border-[#EAE2D5] rounded-3xl sm:rounded-[2rem] p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
          
          <div className="flex items-center gap-5 sm:gap-6 w-full sm:w-auto">
            {/* Icono artístico de figura Pilates / Estiramiento */}
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white/95 border border-[#EAE2D5] flex items-center justify-center shrink-0 text-[#475B44] shadow-xs">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
                {/* Figura en postura consciente / estiramiento */}
                <circle cx="12" cy="5" r="2.5" />
                <path d="M5 19l4-3 3-5 5 2 3 6" />
                <path d="M9 11l-3 4" />
                <path d="M12 11v6" />
              </svg>
            </div>

            <div>
              <span className="text-[10px] sm:text-xs font-bold tracking-widest text-[#475B44] uppercase block mb-1">
                PILATES EN TU ENTRENAMIENTO
              </span>
              <h3 className="text-base sm:text-xl font-serif text-stone-900 font-semibold mb-1">
                {sport.closing.title}
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed max-w-xl">
                {sport.closing.description}
              </p>
            </div>
          </div>

          {/* Botón visual interactivo para ir al registro o volver a beneficios */}
          {onNavigateToRegister ? (
            <button
              onClick={onNavigateToRegister}
              className="w-full sm:w-auto px-5 py-3 rounded-full bg-[#475B44] hover:bg-[#384836] text-white text-xs sm:text-sm font-semibold transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 group active:scale-95 shrink-0"
            >
              <span>Quiero sumarme</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
          ) : (
            <button
              onClick={onBack}
              className="w-12 h-12 rounded-full bg-[#475B44] text-white hover:bg-[#384836] flex items-center justify-center shrink-0 transition-transform active:scale-95 shadow-md group"
              title="Volver a Beneficios"
            >
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-0.5" />
            </button>
          )}

        </section>

      </main>

    </div>
  );
};
