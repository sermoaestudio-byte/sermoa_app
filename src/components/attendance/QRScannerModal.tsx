import React, { useState } from 'react';
import { X, Camera, QrCode, CheckCircle2, User, Sparkles } from 'lucide-react';
import { useStudioStore } from '../../store/studioStore';

interface QRScannerModalProps {
  onClose: () => void;
  onScanSuccess: (studentId: string) => void;
}

export const QRScannerModal: React.FC<QRScannerModalProps> = ({ onClose, onScanSuccess }) => {
  const { profiles } = useStudioStore();
  const activeStudents = profiles.filter((p) => p.role === 'client' && p.status === 'active');
  const [selectedStudentId, setSelectedStudentId] = useState(activeStudents[0]?.id || '');
  const [isScanning, setIsScanning] = useState(true);

  const handleSimulateScan = () => {
    if (!selectedStudentId) return;
    onScanSuccess(selectedStudentId);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 flex flex-col items-center text-center relative">
        
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-14 h-14 rounded-2xl bg-brand-50 text-brand-700 flex items-center justify-center mb-3">
          <Camera className="w-7 h-7" />
        </div>

        <h3 className="text-lg font-extrabold text-slate-900">
          Escáner de Pase Digital QR
        </h3>
        <p className="text-xs text-slate-400 mt-1 max-w-xs">
          Apunta la cámara al código QR que el alumno tiene en su teléfono
        </p>

        {/* Camera Viewfinder Simulation */}
        <div className="w-64 h-64 my-6 bg-slate-900 rounded-3xl border-2 border-brand-500 relative flex items-center justify-center overflow-hidden shadow-inner">
          <div className="absolute inset-4 border border-dashed border-white/30 rounded-2xl pointer-events-none"></div>
          
          {/* Laser scanning line animation */}
          <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-brand-400 to-transparent absolute top-1/2 -translate-y-1/2 animate-pulse-glow"></div>

          <QrCode className="w-28 h-28 text-white/20" />
        </div>

        {/* Quick Simulator Picker */}
        <div className="w-full bg-slate-50 p-4 rounded-2xl border border-slate-200/80 mb-4 text-left">
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            Simular lectura de alumno:
          </label>
          <select
            value={selectedStudentId}
            onChange={(e) => setSelectedStudentId(e.target.value)}
            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none"
          >
            {activeStudents.map((stu) => (
              <option key={stu.id} value={stu.id}>
                {stu.first_name} {stu.last_name} ({stu.phone})
              </option>
            ))}
          </select>
        </div>

        <div className="w-full flex space-x-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSimulateScan}
            className="flex-1 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-extrabold shadow-sm transition-all"
          >
            Validar Ingreso
          </button>
        </div>

      </div>
    </div>
  );
};
