import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { QRCodeSVG } from 'qrcode.react';
import { X, Printer, Download, ShieldCheck, MapPin, Sparkles } from 'lucide-react';
import { useStudioStore } from '../../store/studioStore';
import { getCheckinQRLink } from '../../utils/links';

interface StudioQRPosterModalProps {
  onClose: () => void;
}

export const StudioQRPosterModal: React.FC<StudioQRPosterModalProps> = ({ onClose }) => {
  const { studio, branches } = useStudioStore();
  const [selectedBranchId, setSelectedBranchId] = useState(branches[0]?.id || '');

  const currentBranch = branches.find((b) => b.id === selectedBranchId) || branches[0];
  const qrCheckinUrl = getCheckinQRLink(studio.slug, currentBranch?.id);

  const handlePrint = () => {
    window.print();
  };

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-3xl max-w-xl w-full max-h-[95vh] overflow-y-auto shadow-2xl border border-slate-100 flex flex-col">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10 print:hidden">
          <div>
            <h3 className="text-lg font-extrabold text-slate-900">Cartel QR para Recepción</h3>
            <p className="text-xs text-slate-400">Imprime y coloca este código en la entrada de tu estudio</p>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Branch Selector (Screen only) */}
        <div className="px-6 pt-4 print:hidden">
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            Selecciona la Sucursal para este cartel:
          </label>
          <select
            value={selectedBranchId}
            onChange={(e) => setSelectedBranchId(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none"
          >
            {branches.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name} ({b.address})
              </option>
            ))}
          </select>
        </div>

        {/* Printable Poster Container */}
        <div className="p-8 flex justify-center">
          <div className="w-full max-w-md bg-gradient-to-b from-slate-50 to-white border-4 border-slate-900 rounded-3xl p-8 text-center shadow-lg print:border-2 print:shadow-none">
            
            {/* Studio Branding */}
            <div className="w-14 h-14 rounded-full bg-brand-800 text-white font-extrabold text-xl flex items-center justify-center mx-auto mb-3 shadow-md">
              <span>Ai</span>
            </div>

            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              {studio.name}
            </h2>
            <p className="text-xs font-bold text-brand-700 mt-0.5 flex items-center justify-center space-x-1">
              <MapPin className="w-3.5 h-3.5" />
              <span>{currentBranch?.name} • {currentBranch?.address}</span>
            </p>

            <div className="my-6 p-6 bg-white rounded-3xl border-2 border-dashed border-slate-300 inline-block shadow-inner">
              <QRCodeSVG
                value={qrCheckinUrl}
                size={210}
                level="H"
                includeMargin={true}
              />
            </div>

            <div className="bg-brand-50 border border-brand-200 rounded-2xl p-4 mb-4">
              <h4 className="font-extrabold text-brand-900 text-sm mb-1">
                ¡Registra tu Asistencia!
              </h4>
              <p className="text-xs text-brand-800 leading-relaxed font-medium">
                1. Abre la cámara de tu celular y escanea el código.<br />
                2. Confirma tu turno con validación de presencia GPS.
              </p>
            </div>

            {/* Anti-fraud GPS Badge */}
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 bg-slate-100 rounded-full text-[10px] font-bold text-slate-600">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Validación de Geolocalización Activa (&lt;{studio.gps_checkin_radius_meters}m)</span>
            </div>

          </div>
        </div>

        {/* Modal Footer (Screen only) */}
        <div className="p-6 border-t border-slate-100 flex items-center justify-between print:hidden">
          <span className="text-xs text-slate-400 font-medium">
            Formato listo para imprimir en hoja A4 o exhibir en mostrador
          </span>

          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors"
            >
              Cerrar
            </button>
            <button
              onClick={handlePrint}
              className="px-5 py-2 bg-slate-900 hover:bg-black text-white rounded-xl text-xs font-extrabold shadow-sm transition-all flex items-center space-x-1.5"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimir Cartel</span>
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};
