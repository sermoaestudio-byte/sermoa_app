import React, { useState } from 'react';
import {
  Receipt,
  Download,
  Calendar,
  CreditCard,
  CheckCircle2,
  Clock,
  Sparkles,
  ChevronDown,
  ChevronUp,
  FileText,
  Building,
  ShieldCheck,
  User,
  Printer
} from 'lucide-react';
import { Profile, Studio, PaymentTransaction } from '../../types';
import { useStudioStore } from '../../store/studioStore';

interface StudentPaymentsTabProps {
  student: Profile;
  studio: Studio;
  onOpenBuyPack?: () => void;
}

export const StudentPaymentsTab: React.FC<StudentPaymentsTabProps> = ({
  student,
  studio,
  onOpenBuyPack,
}) => {
  const { payments } = useStudioStore();
  const [selectedReceipt, setSelectedReceipt] = useState<PaymentTransaction | null>(null);

  // Filtrar pagos completados de este alumno
  const studentPayments = payments.filter(
    (p) => p.student_id === student.id && p.payment_type === 'income'
  );

  const handlePrintReceipt = () => {
    window.print();
  };

  return (
    <div className="space-y-5 animate-fade-in pb-12">
      {/* Header Banner */}
      <div
        className="rounded-3xl p-6 text-[#F4E8D1] border border-[#E8D5B5] shadow-soft relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #44261B 0%, #5E612B 55%, #C18749 100%)',
        }}
      >
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-[10px] font-black uppercase tracking-widest text-[#E8D5B5] mb-1">
              <Receipt className="w-3.5 h-3.5 text-[#E8D5B5]" />
              <span>Historial & Comprobantes</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Mis Pagos & Membresías
            </h2>
            <p className="text-xs text-[#E8D5B5]/90 mt-1 max-w-md leading-relaxed">
              Consulta el detalle de tus compras de packs de clases y descarga tus comprobantes digitales oficiales.
            </p>
          </div>

          {onOpenBuyPack && (
            <button
              onClick={onOpenBuyPack}
              className="px-4 py-2.5 bg-[#F4E8D1] hover:bg-white text-[#44261B] text-xs font-black rounded-xl shadow-xs transition-all flex items-center justify-center space-x-2 shrink-0 cursor-pointer"
            >
              <CreditCard className="w-4 h-4 text-[#5E612B]" />
              <span>Comprar Nuevo Pack</span>
            </button>
          )}
        </div>
      </div>

      {/* Lista de Pagos / Comprobantes */}
      {studentPayments.length === 0 ? (
        <div className="bg-white rounded-3xl p-10 text-center border border-[#E8D5B5] shadow-soft space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-[#F4E8D1] text-[#5E612B] flex items-center justify-center mx-auto shadow-2xs border border-[#E8D5B5]">
            <Receipt className="w-7 h-7" />
          </div>
          <h3 className="text-base font-extrabold text-[#44261B]">
            Aún no tienes comprobantes registrados
          </h3>
          <p className="text-xs text-[#A68D74] max-w-sm mx-auto">
            Cuando abones un pack de clases vía Mercado Pago o en el estudio, aquí podrás ver y descargar tu comprobante de pago oficial.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-extrabold text-[#44261B]">
              Comprobantes emitidos ({studentPayments.length})
            </span>
            <span className="text-[11px] font-bold text-[#5E612B]">
              ✓ Todos acreditados
            </span>
          </div>

          {studentPayments.map((pay) => {
            const dateFormatted = new Date(pay.created_at).toLocaleDateString('es-AR', {
              day: '2-digit',
              month: 'long',
              year: 'numeric',
            });

            const methodLabel =
              pay.payment_method === 'mercadopago'
                ? 'Mercado Pago'
                : pay.payment_method === 'transfer'
                ? 'Transferencia bancaria'
                : pay.payment_method === 'cash'
                ? 'Efectivo en recepción'
                : pay.payment_method;

            return (
              <div
                key={pay.id}
                className="bg-white rounded-2xl p-4 sm:p-5 border border-[#E8D5B5] shadow-soft hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-start space-x-3.5">
                  <div className="w-11 h-11 rounded-2xl bg-[#eaede7] border border-[#cadbcd] text-[#5E612B] flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2 mb-0.5">
                      <h4 className="text-sm font-extrabold text-[#44261B]">
                        {pay.concept}
                      </h4>
                      <span className="bg-[#eaede7] text-[#5E612B] border border-[#cadbcd] text-[10px] font-black px-2 py-0.5 rounded-full uppercase">
                        Acreditado
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-[#A68D74]">
                      <span className="flex items-center space-x-1">
                        <Calendar className="w-3 h-3 text-[#5E612B]" />
                        <span>{dateFormatted}</span>
                      </span>
                      <span>•</span>
                      <span className="flex items-center space-x-1">
                        <CreditCard className="w-3 h-3 text-[#5E612B]" />
                        <span>{methodLabel}</span>
                      </span>
                      {pay.reference_code && (
                        <>
                          <span>•</span>
                          <span className="font-mono text-[10px] bg-[#FAF8F5] px-1.5 py-0.5 rounded border border-[#E8D5B5] text-[#44261B]">
                            Ref: {pay.reference_code}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end space-x-4 border-t sm:border-t-0 pt-3 sm:pt-0 border-[#E8D5B5]/60">
                  <div className="text-left sm:text-right">
                    <span className="text-[10px] uppercase font-bold text-[#A68D74] block">
                      Total Abonado
                    </span>
                    <span className="text-lg font-black text-[#5E612B] tracking-tight">
                      ${Number(pay.amount).toLocaleString('es-AR')} ARS
                    </span>
                  </div>

                  <button
                    onClick={() => setSelectedReceipt(pay)}
                    className="px-3.5 py-2 bg-[#FAF8F5] hover:bg-[#F4E8D1] text-[#44261B] border border-[#E8D5B5] rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 shadow-2xs cursor-pointer"
                  >
                    <FileText className="w-3.5 h-3.5 text-[#5E612B]" />
                    <span>Ver Comprobante</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal / Vista de Comprobante Oficial Imprimible */}
      {selectedReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-[#E8D5B5] overflow-hidden flex flex-col max-h-[90vh]">
            
            {/* Header Comprobante */}
            <div
              className="p-6 text-white text-center relative"
              style={{
                background: 'linear-gradient(135deg, #44261B 0%, #5E612B 70%, #C18749 100%)',
              }}
            >
              <div className="w-12 h-12 rounded-2xl bg-white/15 border border-white/30 flex items-center justify-center mx-auto mb-2 text-[#F4E8D1]">
                <Receipt className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-[#E8D5B5]">
                Comprobante Oficial de Pago
              </span>
              <h3 className="text-xl font-black mt-0.5">{studio.name}</h3>
              <p className="text-[11px] text-[#E8D5B5]/90">
                Pilates & Centro de Entrenamiento Integral
              </p>
            </div>

            {/* Cuerpo del Comprobante */}
            <div className="p-6 overflow-y-auto space-y-4 text-xs text-[#44261B] bg-[#FAF8F5]">
              {/* Monto destacado */}
              <div className="bg-white p-4 rounded-2xl border border-[#E8D5B5] text-center shadow-2xs">
                <span className="text-[10px] uppercase font-bold text-[#A68D74] block">
                  Monto Total Acreditado
                </span>
                <span className="text-3xl font-black text-[#5E612B] tracking-tight block my-0.5">
                  ${Number(selectedReceipt.amount).toLocaleString('es-AR')} ARS
                </span>
                <span className="inline-flex items-center space-x-1 text-[11px] font-extrabold text-[#5E612B] bg-[#eaede7] px-2.5 py-0.5 rounded-full border border-[#cadbcd] mt-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Pago Confirmado & Clases Habilitadas</span>
                </span>
              </div>

              {/* Datos de la Transacción */}
              <div className="bg-white p-4 rounded-2xl border border-[#E8D5B5] space-y-2.5 shadow-2xs">
                <div className="flex items-center justify-between border-b border-[#E8D5B5]/60 pb-2">
                  <span className="text-[#A68D74] font-medium">Concepto:</span>
                  <strong className="text-[#44261B] text-right font-extrabold">{selectedReceipt.concept}</strong>
                </div>

                <div className="flex items-center justify-between border-b border-[#E8D5B5]/60 pb-2">
                  <span className="text-[#A68D74] font-medium">Alumno / Titular:</span>
                  <strong className="text-[#44261B] font-bold">
                    {student.first_name} {student.last_name}
                  </strong>
                </div>

                {student.id_number && (
                  <div className="flex items-center justify-between border-b border-[#E8D5B5]/60 pb-2">
                    <span className="text-[#A68D74] font-medium">DNI:</span>
                    <span className="font-semibold">{student.id_number}</span>
                  </div>
                )}

                <div className="flex items-center justify-between border-b border-[#E8D5B5]/60 pb-2">
                  <span className="text-[#A68D74] font-medium">Fecha y hora:</span>
                  <span className="font-semibold">
                    {new Date(selectedReceipt.created_at).toLocaleString('es-AR')} hs
                  </span>
                </div>

                <div className="flex items-center justify-between border-b border-[#E8D5B5]/60 pb-2">
                  <span className="text-[#A68D74] font-medium">Canal de pago:</span>
                  <span className="font-bold text-[#5E612B] uppercase text-[11px]">
                    {selectedReceipt.payment_method === 'mercadopago' ? 'Mercado Pago Checkout' : selectedReceipt.payment_method}
                  </span>
                </div>

                {selectedReceipt.reference_code && (
                  <div className="flex items-center justify-between">
                    <span className="text-[#A68D74] font-medium">N° de Operación / Ref:</span>
                    <span className="font-mono text-[11px] font-bold text-[#44261B]">
                      {selectedReceipt.reference_code}
                    </span>
                  </div>
                )}
              </div>

              {/* Sello de Seguridad */}
              <div className="p-3 bg-white rounded-2xl border border-[#E8D5B5] flex items-center space-x-2.5 text-[11px] text-[#A68D74]">
                <ShieldCheck className="w-5 h-5 text-[#5E612B] shrink-0" />
                <span>
                  Comprobante emitido electrónicamente por el sistema de gestión de {studio.name}. Válido como constancia de acreditación de créditos.
                </span>
              </div>
            </div>

            {/* Acciones del Comprobante */}
            <div className="p-4 bg-white border-t border-[#E8D5B5] flex items-center justify-between space-x-2">
              <button
                onClick={handlePrintReceipt}
                className="px-4 py-2.5 bg-[#FAF8F5] hover:bg-[#F4E8D1] text-[#44261B] border border-[#E8D5B5] rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer"
              >
                <Printer className="w-4 h-4 text-[#5E612B]" />
                <span>Imprimir / PDF</span>
              </button>

              <button
                onClick={() => setSelectedReceipt(null)}
                className="px-5 py-2.5 bg-[#5E612B] hover:bg-[#44261B] text-[#F4E8D1] rounded-xl text-xs font-black transition-all cursor-pointer shadow-xs"
              >
                Cerrar
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

