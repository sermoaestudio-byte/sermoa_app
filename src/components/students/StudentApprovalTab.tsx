import React from 'react';
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  HeartPulse,
  Phone,
  Mail,
  User,
  MessageCircle,
  FileText
} from 'lucide-react';
import { Profile } from '../../types';
import { useStudioStore } from '../../store/studioStore';
import { openWhatsApp, formatWhatsAppTemplate } from '../../utils/whatsapp';

interface StudentApprovalTabProps {
  pendingStudents: Profile[];
  onSelectStudent: (student: Profile) => void;
}

export const StudentApprovalTab: React.FC<StudentApprovalTabProps> = ({
  pendingStudents,
  onSelectStudent,
}) => {
  const { studio, whatsappTemplates, approveStudentRegistration, rejectStudentRegistration } = useStudioStore();

  const handleApprove = (student: Profile) => {
    approveStudentRegistration(student.id, 1); // 1 clase de prueba/bienvenida asignada
  };

  const handleReject = (student: Profile) => {
    if (window.confirm(`¿Rechazar la solicitud de ${student.first_name} ${student.last_name}?`)) {
      rejectStudentRegistration(student.id);
    }
  };

  if (pendingStudents.length === 0) {
    return (
      <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 shadow-soft">
        <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h4 className="text-base font-extrabold text-slate-800">
          ¡No hay solicitudes pendientes de aprobación!
        </h4>
        <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
          Cuando nuevos alumnos completen el formulario de registro público, aparecerán aquí para que revises su ficha médica y habilites su acceso con 1 click.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center justify-between">
        <div className="flex items-center space-x-3 text-amber-900">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
          <p className="text-xs font-semibold">
            Tienes <strong>{pendingStudents.length} {pendingStudents.length === 1 ? 'solicitud' : 'solicitudes'}</strong> esperando tu aprobación. Revisa la declaración médica antes de autorizar el ingreso.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {pendingStudents.map((student) => {
          const med = student.medical_declaration;

          return (
            <div
              key={student.id}
              className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-soft hover:shadow-soft-lg transition-all flex flex-col justify-between"
            >
              <div>
                {/* Header info */}
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-700 font-bold text-sm flex items-center justify-center">
                      {student.first_name[0]}{student.last_name[0]}
                    </div>
                    <div>
                      <h4 className="font-extrabold text-slate-900 text-base">
                        {student.first_name} {student.last_name}
                      </h4>
                      <div className="flex items-center space-x-2 text-xs text-slate-400 mt-0.5">
                        <span>DNI: {student.id_number || 'N/A'}</span>
                        <span>•</span>
                        <span>{student.email}</span>
                      </div>
                    </div>
                  </div>

                  <span className="bg-amber-100 text-amber-800 text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase">
                    Pendiente
                  </span>
                </div>

                {/* Contact row */}
                <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 bg-slate-50 rounded-2xl p-3 mb-4">
                  <div className="flex items-center space-x-2">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>{student.phone}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    <span className="truncate">Emergencia: {student.emergency_contact_name || 'N/A'}</span>
                  </div>
                </div>

                {/* Medical Declaration Checklist */}
                <div className="bg-rose-50/50 border border-rose-100 rounded-2xl p-4 mb-4">
                  <div className="flex items-center space-x-2 text-xs font-bold text-rose-900 mb-2">
                    <HeartPulse className="w-4 h-4 text-rose-600" />
                    <span>Ficha Médica / Declaración Jurada</span>
                  </div>

                  <div className="space-y-1.5 text-xs text-slate-700">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">¿Posee lesiones o dolores?</span>
                      <span className={`font-bold ${med?.has_injuries ? 'text-rose-600' : 'text-emerald-600'}`}>
                        {med?.has_injuries ? `Sí: ${med.injuries_detail}` : 'No'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">¿Embarazo?</span>
                      <span className={`font-bold ${med?.is_pregnant ? 'text-rose-600' : 'text-emerald-600'}`}>
                        {med?.is_pregnant ? 'Sí (Pilates prenatal)' : 'No'}
                      </span>
                    </div>

                    {student.medical_notes && (
                      <div className="mt-2 pt-2 border-t border-rose-100/80 text-[11px] text-slate-600 italic">
                        "{student.medical_notes}"
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                <button
                  onClick={() => handleReject(student)}
                  className="px-4 py-2 text-rose-600 hover:bg-rose-50 rounded-xl text-xs font-bold transition-colors flex items-center space-x-1"
                >
                  <XCircle className="w-4 h-4" />
                  <span>Rechazar</span>
                </button>

                <button
                  onClick={() => handleApprove(student)}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-extrabold shadow-sm transition-all flex items-center space-x-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Aprobar & Notificar WhatsApp</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
