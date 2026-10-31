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
      <div className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-[#44261B]/60 backdrop-blur-sm animate-fade-in">
        <div className="bg-[#FAF8F5] w-full max-w-3xl rounded-3xl shadow-2xl border border-[#E8D5B5] overflow-hidden flex flex-col max-h-[90vh]">
          
          {/* Header */}
          <div 
            className="p-6 text-[#F4E8D1] flex items-center justify-between shrink-0 relative overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, #44261B 0%, #5E612B 60%, #C18749 100%)',
            }}
          >
            <div className="relative z-10">
              <div className="flex items-center space-x-2 text-[10px] uppercase font-bold tracking-widest text-[#E8D5B5] mb-1">
                <Ticket className="w-3.5 h-3.5 text-[#E8D5B5]" />
                <span>Packs de Clases & Membresías</span>
              </div>
              <h2 className="text-xl font-extrabold text-[#F4E8D1]">
                Elige tu Pack en {studio.name}
              </h2>
              <p className="text-xs text-[#E8D5B5]/90 mt-0.5">
                Selecciona la opción que mejor se adapte a tu ritmo de entrenamiento
              </p>
            </div>

            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-[#E8D5B5] hover:text-white flex items-center justify-center transition-all shrink-0 z-10 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Grid de Packs */}
          <div className="p-6 overflow-y-auto flex-1 bg-[#FAF8F5]">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {activePacks.map((pack) => (
                <div
                  key={pack.id}
                  className={`bg-white rounded-2xl p-5 border transition-all flex flex-col justify-between relative cursor-pointer hover:scale-[1.02] ${
                    pack.popular_badge
                      ? 'border-[#5E612B] shadow-md ring-2 ring-[#5E612B]/20'
                      : 'border-[#E8D5B5] hover:border-[#5E612B]/60 shadow-xs'
                  }`}
                  onClick={() => handleSelectPack(pack)}
                >
                  {pack.popular_badge && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#5E612B] text-[#F4E8D1] font-extrabold text-[9px] uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-xs flex items-center space-x-1">
                      <Sparkles className="w-2.5 h-2.5" />
                      <span>Más Elegido</span>
                    </span>
                  )}

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold text-[#5E612B] bg-[#eaede7] border border-[#cadbcd] px-2.5 py-0.5 rounded-full">
                        {pack.is_recurring_monthly ? 'Mensual' : 'Flexible'}
                      </span>
                      <div className="flex items-center space-x-1 text-[11px] text-[#A68D74] font-medium">
                        <Clock className="w-3 h-3 text-[#A68D74]" />
                        <span>{pack.validity_days}d</span>
                      </div>
                    </div>

                    <h3 className="font-extrabold text-[#44261B] text-base mb-1">{pack.name}</h3>
                    <p className="text-[11px] text-[#A68D74] mb-4 line-clamp-2 leading-relaxed">
                      {pack.description}
                    </p>

                    <div className="mb-4">
                      <div className="flex items-baseline space-x-1">
                        <span className="text-2xl font-black text-[#44261B] tracking-tight">
                          ${Number(pack.price).toLocaleString('es-AR')}
                        </span>
                        <span className="text-[10px] text-[#A68D74] font-bold uppercase">ARS</span>
                      </div>
                      <span className="text-[11px] font-bold text-[#5E612B] block mt-0.5">
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
                    className="w-full py-2.5 bg-[#44261B] hover:bg-[#5E612B] text-[#F4E8D1] text-xs font-bold rounded-xl transition-all shadow-xs flex items-center justify-center space-x-1.5 cursor-pointer"
                  >
                    <span>Abonar Pack</span>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Footer Seguro */}
          <div className="px-6 py-3.5 bg-white border-t border-[#E8D5B5] flex items-center justify-between text-[11px] text-[#A68D74]">
            <div className="flex items-center space-x-1.5 text-[#5E612B] font-medium">
              <ShieldCheck className="w-4 h-4 text-[#5E612B]" />
              <span>Transacciones seguras vía Mercado Pago</span>
            </div>
            <button
              onClick={onClose}
              className="font-bold text-[#A68D74] hover:text-[#44261B] transition-colors cursor-pointer"
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
