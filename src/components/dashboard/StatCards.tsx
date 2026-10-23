import React from 'react';
import { Users, Calendar, UserCheck, Building2, HelpCircle } from 'lucide-react';
import { useStudioStore } from '../../store/studioStore';
import { toISODateString } from '../../utils/date';

interface StatCardsProps {
  onNavigate: (view: string) => void;
}

export const StatCards: React.FC<StatCardsProps> = ({ onNavigate }) => {
  const { profiles, classes, branches, bookings, currentRole } = useStudioStore();
  const todayStr = toISODateString(new Date());

  const isInstructor = currentRole === 'instructor';

  // Clases válidas de hoy
  const classesToday = classes.filter(
    (c) => !c.is_cancelled && (c.date === todayStr || c.day_of_week === new Date().getDay())
  );
  const classesTodayIds = new Set(classesToday.map((c) => c.id));

  // Reservas activas de hoy (gente con turno hoy)
  const todayActiveBookings = bookings.filter(
    (b) =>
      classesTodayIds.has(b.class_id) &&
      (b.booking_date === todayStr || !b.booking_date) &&
      b.status !== 'cancelled_by_user' &&
      b.status !== 'cancelled_by_admin'
  );
  const totalStudentsToday = todayActiveBookings.length;

  // Total de alumnos únicos inscriptos en clases
  const activeBookingsAll = bookings.filter(
    (b) => b.status !== 'cancelled_by_user' && b.status !== 'cancelled_by_admin'
  );
  const enrolledStudentIds = new Set(activeBookingsAll.map((b) => b.student_id));
  const totalEnrolledStudents = enrolledStudentIds.size;

  // Estadísticas para Admin
  const activeStudents = profiles.filter((p) => p.role === 'client' && p.status === 'active');
  const totalStudents = profiles.filter((p) => p.role === 'client').length;
  const instructorsCount = profiles.filter((p) => p.role === 'instructor' || p.is_instructor).length;
  const branchesCount = branches.length;

  return (
    <section aria-labelledby="stat-summary-heading" className="mb-8">


      <div className={`grid gap-4 ${isInstructor ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-4'}`}>

        {/* Card 1: Total de Alumnos */}
        <button
          onClick={() => onNavigate('students')}
          className="bg-white rounded-2xl p-4 sm:p-5 border border-[#E8D5B5] shadow-soft hover:shadow-soft-lg hover:border-[#5E612B]/40 transition-all flex items-center justify-between text-left group cursor-pointer"
        >
          <div className="flex items-center space-x-3.5">
            <div className="w-11 h-11 rounded-2xl bg-[#F4E8D1] border border-[#E8D5B5] text-[#5E612B] flex items-center justify-center group-hover:scale-105 transition-transform shadow-xs">
              <Users className="w-5 h-5 text-[#5E612B]" />
            </div>
            <div>
              <div className="flex items-center space-x-1">
                <span className="text-xs font-bold text-[#A68D74] uppercase tracking-tight">
                  {isInstructor ? 'TOTAL DE ALUMNOS' : 'Alumnos Activos'}
                </span>
                <HelpCircle className="w-3 h-3 text-[#A68D74]" />
              </div>
              <div className="text-2xl font-extrabold text-[#44261B] leading-tight mt-0.5">
                {isInstructor ? totalEnrolledStudents : activeStudents.length}
              </div>
              <span className="text-[11px] text-[#A68D74] font-medium">
                {isInstructor ? 'Inscriptos a clases' : `Total: ${totalStudents}`}
              </span>
            </div>
          </div>
        </button>

        {/* Card 2: Clases Hoy & Gente en el día */}
        <button
          onClick={() => onNavigate('classes')}
          className="bg-white rounded-2xl p-4 sm:p-5 border border-[#E8D5B5] shadow-soft hover:shadow-soft-lg hover:border-[#5E612B]/40 transition-all flex items-center justify-between text-left group cursor-pointer"
        >
          <div className="flex items-center space-x-3.5">
            <div className="w-11 h-11 rounded-2xl bg-[#eaede7] border border-[#cadbcd] text-[#5E612B] flex items-center justify-center group-hover:scale-105 transition-transform">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-[#A68D74] uppercase tracking-tight block">
                {isInstructor ? 'ALUMNOS DE HOY' : 'Clases Hoy'}
              </span>
              <div className="text-2xl font-extrabold text-[#44261B] leading-tight mt-0.5">
                {isInstructor ? totalStudentsToday : classesToday.length}
              </div>
              <span className="text-[11px] text-[#A68D74] font-medium">
                {isInstructor ? `${classesToday.length} turnos programados` : 'Programadas'}
              </span>
            </div>
          </div>
        </button>

        {/* Card 3: Profesores (solo Admin) */}
        {!isInstructor && (
          <button
            onClick={() => onNavigate('instructors')}
            className="bg-white rounded-2xl p-4 sm:p-5 border border-[#E8D5B5] shadow-soft hover:shadow-soft-lg hover:border-[#C18749]/50 transition-all flex items-center justify-between text-left group cursor-pointer"
          >
            <div className="flex items-center space-x-3.5">
              <div className="w-11 h-11 rounded-2xl bg-[#F4E8D1] border border-[#E8D5B5] text-[#C18749] flex items-center justify-center group-hover:scale-105 transition-transform">
                <UserCheck className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-[#A68D74] uppercase tracking-tight block">Profesores</span>
                <div className="text-2xl font-extrabold text-[#44261B] leading-tight mt-0.5">
                  {instructorsCount}
                </div>
                <span className="text-[11px] text-[#A68D74] font-medium">Staff activo</span>
              </div>
            </div>
          </button>
        )}

        {/* Card 4: Sucursales (solo Admin) */}
        {!isInstructor && (
          <button
            onClick={() => onNavigate('branches')}
            className="bg-white rounded-2xl p-4 sm:p-5 border border-[#E8DFD1] shadow-soft hover:shadow-soft-lg hover:border-[#5E612B]/40 transition-all flex items-center justify-between text-left group cursor-pointer"
          >
            <div className="flex items-center space-x-3.5">
              <div className="w-11 h-11 rounded-2xl bg-[#FAF8F5] border border-[#E8D5B5] text-[#44261B] flex items-center justify-center group-hover:scale-105 transition-transform">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-[#A68D74] uppercase tracking-tight block">Sucursales</span>
                <div className="text-2xl font-extrabold text-[#44261B] leading-tight mt-0.5">
                  {branchesCount}
                </div>
                <span className="text-[11px] text-[#A68D74] font-medium">Sedes activas</span>
              </div>
            </div>
          </button>
        )}

      </div>
    </section>
  );
};
