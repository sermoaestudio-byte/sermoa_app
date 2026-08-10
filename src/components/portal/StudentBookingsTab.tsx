import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowRight,
  XCircle,
  MessageCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Booking, WaitlistEntry, ClassSchedule, Profile } from '../../types';
import { useStudioStore } from '../../store/studioStore';
import { ConfirmDialog } from '../common/ConfirmDialog';

interface StudentBookingsTabProps {
  student: Profile;
}

export const StudentBookingsTab: React.FC<StudentBookingsTabProps> = ({ student }) => {
  const { bookings, waitlist, classes, branches, cancelBooking } = useStudioStore();

  const [bookingToCancel, setBookingToCancel] = useState<string | null>(null);
  const [promotedOffer, setPromotedOffer] = useState<{
    classId: string;
    className: string;
    time: string;
    branchName: string;
  } | null>(null);

  const myBookings = bookings.filter((b: Booking) => b.student_id === student.id && b.status === 'confirmed');
  const myWaitlist = waitlist.filter((w: WaitlistEntry) => w.student_id === student.id && w.status === 'waiting');

  const handleConfirmCancel = () => {
    if (bookingToCancel) {
      cancelBooking(bookingToCancel);
      setBookingToCancel(null);
    }
  };

  const handleAcceptPromotedSpot = () => {
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 },
    });
    alert('¡Excelente! Tu cupo ha sido confirmado exitosamente.');
    setPromotedOffer(null);
  };

  const handleDeclinePromotedSpot = () => {
    alert('Has cedido tu lugar. El sistema le avisará automáticamente al siguiente alumno en la fila.');
    setPromotedOffer(null);
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto my-6 animate-fade-in">
      
      {/* Promoted Waitlist Spot Alert Box (Simulated WhatsApp Invitation Link) */}
      {promotedOffer && (
        <div className="p-5 bg-gradient-to-r from-brand-50 to-emerald-50 border-2 border-brand-500 rounded-3xl shadow-soft animate-fade-in space-y-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-2">
              <span className="p-2 bg-brand-600 text-white rounded-xl shadow-xs">
                <Sparkles className="w-4 h-4" />
              </span>
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-brand-700 bg-brand-100 px-2 py-0.5 rounded-full">
                  ¡Cupo Liberado en Lista de Espera!
                </span>
                <h4 className="text-base font-black text-slate-900 mt-0.5">
                  {promotedOffer.className}
                </h4>
              </div>
            </div>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            Se liberó una vacante para tu turno ({promotedOffer.time} en {promotedOffer.branchName}). Tienes <strong>30 minutos</strong> para confirmar o ceder tu lugar al siguiente alumno en la cola.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
            <button
              onClick={handleAcceptPromotedSpot}
              className="py-2.5 px-4 bg-brand-600 hover:bg-brand-700 text-white text-xs font-black rounded-2xl shadow-sm flex items-center justify-center space-x-1.5 transition-all"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Aceptar y Confirmar Cupo</span>
            </button>

            <button
              onClick={handleDeclinePromotedSpot}
              className="py-2.5 px-4 bg-white hover:bg-rose-50 border border-rose-200 text-rose-700 text-xs font-extrabold rounded-2xl flex items-center justify-center space-x-1.5 transition-all"
            >
              <XCircle className="w-4 h-4" />
              <span>No puedo ir (Ceder lugar)</span>
            </button>
          </div>
        </div>
      )}

      {/* Upcoming Confirmed Bookings */}
      <div>
        <h3 className="text-base font-extrabold text-slate-900 mb-3 flex items-center space-x-2">
          <Calendar className="w-4 h-4 text-brand-600" />
          <span>Mis Turnos Reservados ({myBookings.length})</span>
        </h3>

        {myBookings.length === 0 ? (
          <div className="p-8 bg-white rounded-3xl border border-slate-200 text-center text-xs text-slate-400">
            No tienes turnos reservados actualmente.
          </div>
        ) : (
          <div className="space-y-3">
            {myBookings.map((b) => {
              const cls = classes.find((c: ClassSchedule) => c.id === b.class_id);
              const branch = branches.find((item) => item.id === cls?.branch_id);

              return (
                <div
                  key={b.id}
                  className="bg-white rounded-3xl p-5 border border-slate-200 shadow-soft flex items-center justify-between gap-4"
                >
                  <div>
                    <span
                      className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full text-white inline-block mb-1 shadow-xs"
                      style={{ backgroundColor: cls?.color || '#54875e' }}
                    >
                      {cls?.title}
                    </span>
                    <div className="text-xs font-bold text-slate-800 flex items-center space-x-2 mt-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{cls?.start_time} a {cls?.end_time} hs • Fecha: {b.booking_date}</span>
                    </div>
                    <div className="text-[11px] text-slate-400 flex items-center space-x-1.5 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-300" />
                      <span>{branch?.name}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => setBookingToCancel(b.id)}
                    className="px-3.5 py-1.5 text-rose-600 hover:bg-rose-50 border border-rose-200 rounded-xl text-xs font-bold transition-colors"
                  >
                    Cancelar
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Waitlist Section */}
      {myWaitlist.length > 0 && (
        <div>
          <h3 className="text-base font-extrabold text-slate-900 mb-3 flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-amber-600" />
            <span>En Lista de Espera ({myWaitlist.length})</span>
          </h3>

          <div className="space-y-3">
            {myWaitlist.map((w) => {
              const cls = classes.find((c: ClassSchedule) => c.id === w.class_id);
              const branch = branches.find((item) => item.id === cls?.branch_id);

              return (
                <div
                  key={w.id}
                  className="bg-amber-50/70 rounded-3xl p-5 border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-extrabold text-slate-900 text-sm">
                        {cls?.title}
                      </span>
                      <span className="bg-amber-200 text-amber-900 font-extrabold text-[10px] px-2 py-0.5 rounded-full">
                        Posición #{w.position} en la fila
                      </span>
                    </div>
                    <span className="text-xs text-slate-600 mt-1 block">
                      ⏰ {cls?.start_time} hs • {branch?.name}. Te llegará un WhatsApp automático si se libera un cupo.
                    </span>
                  </div>

                  {/* Simulator button */}
                  <button
                    onClick={() =>
                      setPromotedOffer({
                        classId: cls?.id || '',
                        className: cls?.title || 'Pilates Reformer',
                        time: `${cls?.start_time} hs`,
                        branchName: branch?.name || 'Sede Palermo',
                      })
                    }
                    className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs self-start sm:self-auto"
                  >
                    Simular Aviso WhatsApp
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Confirmation Dialog for Cancellation */}
      <ConfirmDialog
        isOpen={!!bookingToCancel}
        title="¿Deseas cancelar esta reserva?"
        message="Si cancelas con anticipación, tu crédito será reembolsado automáticamente y el lugar se le ofrecerá al siguiente alumno en lista de espera."
        confirmText="Confirmar Cancelación"
        cancelText="Volver"
        variant="danger"
        onConfirm={handleConfirmCancel}
        onCancel={() => setBookingToCancel(null)}
      />

    </div>
  );
};
