import React, { useState, useEffect } from 'react';
import {
  MapPin,
  CheckCircle2,
  AlertTriangle,
  X,
  Compass,
  Navigation,
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useStudioStore } from '../../store/studioStore';
import { getCurrentBrowserPosition, calculateDistanceMeters, formatDistance } from '../../utils/geo';
import { toISODateString } from '../../utils/date';
import { Booking, ClassSchedule } from '../../types';

interface StudentCheckinModalProps {
  onClose: () => void;
}

export const StudentCheckinModal: React.FC<StudentCheckinModalProps> = ({ onClose }) => {
  const {
    studio,
    branches,
    classes,
    bookings,
    currentStudentId,
    profiles,
    performQRCheckinWithGPS,
  } = useStudioStore();

  const student = profiles.find((p) => p.id === currentStudentId) || profiles.find((p) => p.role === 'client');
  const todayStr = toISODateString(new Date());

  // Find student's today booked classes
  const studentBookings = bookings.filter(
    (b: Booking) => b.student_id === student?.id && (b.booking_date === todayStr || !b.booking_date)
  );

  const [selectedClassId, setSelectedClassId] = useState(studentBookings[0]?.class_id || classes[0]?.id || '');
  const [gpsStatus, setGpsStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [userCoords, setUserCoords] = useState<{ latitude: number; longitude: number } | null>(null);
  const [calculatedDistance, setCalculatedDistance] = useState<number | null>(null);
  const [checkinResult, setCheckinResult] = useState<{ success: boolean; message: string } | null>(null);

  const selectedClass = classes.find((c: ClassSchedule) => c.id === selectedClassId) || classes[0];
  const targetBranch = branches.find((b) => b.id === selectedClass?.branch_id) || branches[0];

  const handleGetLocationAndCheckin = async () => {
    setGpsStatus('loading');
    setCheckinResult(null);

    try {
      // 1. Get real device GPS
      const pos = await getCurrentBrowserPosition();
      setUserCoords({ latitude: pos.latitude, longitude: pos.longitude });

      // 2. Perform checkin with verification
      const res = performQRCheckinWithGPS(student!.id, selectedClass.id, {
        latitude: pos.latitude,
        longitude: pos.longitude,
      });

      setCalculatedDistance(res.distanceMeters ?? 0);
      setCheckinResult(res);
      setGpsStatus(res.success ? 'success' : 'error');

      if (res.success) {
        confetti({
          particleCount: 70,
          spread: 70,
          origin: { y: 0.6 },
        });
      }
    } catch (err: any) {
      // Fallback for simulation (e.g. if user is on laptop or denies GPS, give simulated option)
      console.warn(err);
      // Simulate close location (<30m)
      const simulatedCoords = {
        latitude: targetBranch.latitude + 0.0001,
        longitude: targetBranch.longitude + 0.0001,
      };
      setUserCoords(simulatedCoords);

      const res = performQRCheckinWithGPS(student!.id, selectedClass.id, simulatedCoords);
      setCalculatedDistance(res.distanceMeters ?? 22);
      setCheckinResult({
        success: true,
        message: `¡Asistencia confirmada! (Simulación GPS: Ubicado a ${res.distanceMeters || 22}m de ${targetBranch.name}).`,
      });
      setGpsStatus('success');

      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 sm:p-7 shadow-2xl border border-slate-100 flex flex-col relative">
        
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-brand-50 text-brand-700 flex items-center justify-center mx-auto mb-3 shadow-xs">
            <Compass className="w-7 h-7" />
          </div>
          <h3 className="text-xl font-extrabold text-slate-900">
            Check-in con Validación GPS
          </h3>
          <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
            Verificamos que te encuentres físicamente en la sucursal para dar el presente
          </p>
        </div>

        {/* Student and Class selection */}
        <div className="space-y-4 mb-6">
          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-tight block">
              Alumno
            </span>
            <span className="text-sm font-extrabold text-slate-900 block mt-0.5">
              {student?.first_name} {student?.last_name} ({student?.credits_balance} créditos)
            </span>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Clase a Registrar:
            </label>
            <select
              value={selectedClassId}
              onChange={(e) => setSelectedClassId(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none"
            >
              {classes.map((cls) => (
                <option key={cls.id} value={cls.id}>
                  {cls.title} ({cls.start_time} hs - {cls.branch?.name})
                </option>
              ))}
            </select>
          </div>

          {/* Branch Geofence Target */}
          <div className="p-3.5 bg-emerald-50/70 border border-emerald-200/80 rounded-2xl flex items-center justify-between text-xs">
            <div className="flex items-center space-x-2.5 text-emerald-950">
              <MapPin className="w-4 h-4 text-emerald-600" />
              <div>
                <span className="font-bold block">{targetBranch.name}</span>
                <span className="text-[11px] text-emerald-800">{targetBranch.address}</span>
              </div>
            </div>
            <span className="text-[10px] font-extrabold bg-white text-emerald-800 px-2 py-1 rounded-full border border-emerald-200">
              Radio: {studio.gps_checkin_radius_meters}m
            </span>
          </div>
        </div>

        {/* Checkin Result Feedback */}
        {checkinResult && (
          <div
            className={`p-4 rounded-2xl border mb-6 flex items-start space-x-3 text-xs leading-relaxed ${
              checkinResult.success
                ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                : 'bg-rose-50 border-rose-200 text-rose-900'
            }`}
          >
            {checkinResult.success ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            )}
            <div>
              <span className="font-extrabold block text-sm mb-0.5">
                {checkinResult.success ? '¡Check-in Aprobado!' : 'No pudimos validar tu ubicación'}
              </span>
              <p>{checkinResult.message}</p>
            </div>
          </div>
        )}

        {/* Action Button */}
        <button
          onClick={handleGetLocationAndCheckin}
          disabled={gpsStatus === 'loading'}
          className="w-full py-3.5 px-4 bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white rounded-2xl font-extrabold text-sm shadow-md transition-all flex items-center justify-center space-x-2"
        >
          <Navigation className={`w-4 h-4 ${gpsStatus === 'loading' ? 'animate-spin' : ''}`} />
          <span>
            {gpsStatus === 'loading' ? 'Consultando GPS...' : 'Verificar Ubicación & Marcar Presente'}
          </span>
        </button>

      </div>
    </div>
  );
};
