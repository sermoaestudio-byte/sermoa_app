import React, { useState } from 'react';
import { X, Ticket, Check, Sparkles, Clock, ShieldCheck } from 'lucide-react';
import { useStudioStore } from '../../store/studioStore';
import { CreditPack, Profile } from '../../types';
import { MercadoPagoModal } from './MercadoPagoModal';

interface BuyPackModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: Profile | null;
  onSuccess?: (credits: number) => void;
}

export const BuyPackModal: React.FC<BuyPackModalProps> = ({
  isOpen,
  onClose,
  student,
  onSuccess,
}) => {
  const { creditPacks, studio } = useStudioStore();
  const [selectedPack, setSelectedPack] = useState<CreditPack | null>(null);
  const [isMPModalOpen, setIsMPModalOpen] = useState(false);

  if (!isOpen) return null;

  const activePacks = creditPacks.filter((p) => p.is_active !== false);

  const handleSelectPack = (pack: CreditPack) => {
    setSelectedPack(pack);
    setIsMPModalOpen(true);
  };

  const handlePaymentSuccess = (credits: number) => {
    setIsMPModalOpen(false);
    if (onSuccess) {
      onSuccess(credits);
    }
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
        <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[90vh]">
          
          {/* Header */}
          <div className="p-6 bg-slate-900 text-white flex items-center justify-between shrink-0 relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex items-center space-x-2 text-[10px] uppercase font-bold tracking-widest text-emerald-400 mb-1">
                <Ticket className="w-3.5 h-3.5" />
                <span>Packs de Clases & Membresías</span>
              </div>
              <h2 className="text-xl font-extrabold text-white">
                Elige tu Pack en {studio.name}
              </h2>
              <p className="text-xs text-slate-300 mt-0.5">
                Selecciona la opción que mejor se adapte a tu ritmo de entrenamiento
              </p>
            </div>

            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center transition-all shrink-0 z-10"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Grid de Packs */}
          <div className="p-6 overflow-y-auto flex-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {activePacks.map((pack) => (
                <div
                  key={pack.id}
                  className={`bg-white rounded-2xl p-5 border transition-all flex flex-col justify-between relative cursor-pointer hover:scale-[1.02] ${
                    pack.popular_badge
                      ? 'border-brand-500 shadow-soft-lg ring-2 ring-brand-500/20'
                      : 'border-slate-200 hover:border-slate-300 shadow-soft'
                  }`}
                  onClick={() => handleSelectPack(pack)}
                >
                  {pack.popular_badge && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-brand-600 text-white font-extrabold text-[9px] uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-xs flex items-center space-x-1">
                      <Sparkles className="w-2.5 h-2.5" />
                      <span>Más Elegido</span>
                    </span>
                  )}

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full">
                        {pack.is_recurring_monthly ? 'Mensual' : 'Flexible'}
                      </span>
                      <div className="flex items-center space-x-1 text-[11px] text-slate-400 font-medium">
                        <Clock className="w-3 h-3" />
                        <span>{pack.validity_days}d</span>
                      </div>
                    </div>

                    <h3 className="font-extrabold text-slate-900 text-base mb-1">{pack.name}</h3>
                    <p className="text-[11px] text-slate-500 mb-4 line-clamp-2 leading-relaxed">
                      {pack.description}
                    </p>

                    <div className="mb-4">
                      <div className="flex items-baseline space-x-1">
                        <span className="text-2xl font-black text-slate-900 tracking-tight">
                          ${Number(pack.price).toLocaleString('es-AR')}
                        </span>
                        <span className="text-[10px] text-slate-400 font-bold uppercase">ARS</span>
                      </div>
                      <span className="text-[11px] font-bold text-emerald-600 block mt-0.5">
                        {pack.credits_count === 999 ? 'Pase Ilimitado' : `${pack.credits_count} clases`}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectPack(pack);
                    }}
                    className="w-full py-2.5 bg-slate-900 hover:bg-black text-white text-xs font-bold rounded-xl transition-all shadow-xs flex items-center justify-center space-x-1.5"
                  >
                    <span>Abonar Pack</span>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Footer Seguro */}
          <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <div className="flex items-center space-x-1.5 text-emerald-700 font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Transacciones seguras vía Mercado Pago</span>
            </div>
            <button
              onClick={onClose}
              className="font-bold text-slate-400 hover:text-slate-700 transition-colors"
            >
              Cerrar
            </button>
          </div>

        </div>
      </div>

      {/* Modal Embebido de Mercado Pago con el Payment Brick */}
      {selectedPack && student && (
        <MercadoPagoModal
          isOpen={isMPModalOpen}
          onClose={() => setIsMPModalOpen(false)}
          pack={selectedPack}
          userId={student.id}
          userEmail={student.email}
          userName={`${student.first_name} ${student.last_name}`}
          onPaymentSuccess={handlePaymentSuccess}
        />
      )}
    </>
  );
};
