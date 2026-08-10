import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { ShieldCheck, User, Sparkles, Navigation } from 'lucide-react';
import { Profile, Studio } from '../../types';

interface StudentDigitalPassProps {
  student: Profile;
  studio: Studio;
  onOpenCheckinGPS: () => void;
}

export const StudentDigitalPass: React.FC<StudentDigitalPassProps> = ({
  student,
  studio,
  onOpenCheckinGPS,
}) => {
  const qrPassPayload = JSON.stringify({
    student_id: student.id,
    dni: student.id_number,
    token: `PASS-${student.id}-${Date.now().toString().slice(-4)}`,
  });

  return (
    <div className="max-w-sm mx-auto bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-soft text-center animate-fade-in my-6">
      
      {/* Badge */}
      <span className="text-[10px] font-extrabold uppercase tracking-wider text-brand-700 bg-brand-50 px-3 py-1 rounded-full border border-brand-200">
        Pase Digital de Acceso
      </span>

      {/* Student Name */}
      <div className="mt-4 mb-2">
        <h3 className="text-xl font-extrabold text-slate-900">
          {student.first_name} {student.last_name}
        </h3>
        <p className="text-xs text-slate-400">DNI: {student.id_number || '38.921.450'}</p>
      </div>

      {/* Credits Card */}
      <div className="bg-emerald-50 border border-emerald-200/80 rounded-2xl p-3.5 my-4">
        <span className="text-[11px] font-bold text-emerald-800 uppercase block">Saldo Actual</span>
        <span className="text-2xl font-black text-emerald-950 block mt-0.5">
          {student.credits_balance} clases disponibles
        </span>
      </div>

      {/* Personal QR */}
      <div className="p-4 bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl inline-block my-2 shadow-inner">
        <QRCodeSVG
          value={qrPassPayload}
          size={180}
          level="H"
          includeMargin={true}
        />
      </div>

      <p className="text-[11px] text-slate-400 mt-2">
        Muestra este pase al profesor o en la recepción al llegar al estudio.
      </p>

      {/* GPS Self Check-in option */}
      <div className="mt-6 pt-4 border-t border-slate-100">
        <button
          onClick={onOpenCheckinGPS}
          className="w-full py-3 bg-brand-olive hover:bg-brand-darkolive text-white text-xs font-extrabold rounded-2xl shadow-sm transition-all flex items-center justify-center space-x-2"
        >
          <Navigation className="w-4 h-4" />
          <span>Hacer Check-in con GPS</span>
        </button>
      </div>

    </div>
  );
};
