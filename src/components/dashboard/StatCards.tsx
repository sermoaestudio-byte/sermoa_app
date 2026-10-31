import React from 'react';
import { Users, Calendar, UserCheck, Building2, HelpCircle } from 'lucide-react';
import { useStudioStore } from '../../store/studioStore';
import { toISODateString } from '../../utils/date';

interface StatCardsProps {
  onNavigate: (view: string) => void;
}

export const StatCards: React.FC<StatCardsProps> = ({ onNavigate }) => {
  const { profiles, classes, branches, bookings, currentRole, currentUser } = useStudioStore();
  const todayStr = toISODateString(new Date());

  const isInstructor = currentRole === 'instructor';

  // Obtener el ID del instructor activo
  const instructorProfile = profiles.find((p) => p.role === 'instructor' || p.is_instructor);
  const activeInstructorId = (isInstructor && currentUser?.id)
    ? currentUser.id
    : (instructorProfile?.id || '');

  // Clases asignadas a dicho profesor (o todas las clases si no hay filtro de ID)
  const instructorAssignedClasses = isInstructor && activeInstructorId
    ? classes.filter((c) => !c.is_cancelled && c.instructor_id === activeInstructorId)
    : classes.filter((c) => !c.is_cancelled);

  const totalAssignedSlots = isInstructor
    ? instructorAssignedClasses.length
    : classes.filter((c) => !c.is_cancelled).length;

  const assignedClassesIds = new Set(instructorAssignedClasses.map((c) => c.id));

  // Clases válidas de hoy del profesor
  const classesToday = instructorAssignedClasses.filter(
    (c) => c.date === todayStr || c.day_of_week === new Date().getDay()
  );
  const classesTodayIds = new Set(classesToday.map((c) => c.id));

  // Alumnos que han seleccionado algún turno de hoy para dicho profesor
  const instructorTodayBookings = bookings.filter(
    (b) =>
      classesTodayIds.has(b.class_id) &&
      (b.booking_date === todayStr || !b.booking_date) &&
      b.status !== 'cancelled_by_user' &&
      b.status !== 'cancelled_by_admin'
  );
  // Alumnos únicos de hoy para dicho profesor
  const instructorTodayStudents = new Set(instructorTodayBookings.map((b) => b.student_id)).size;

  // Estadísticas para Admin
  const activeStudents = profiles.filter((p) => p.role === 'client' && p.status === 'active');
  const totalStudents = profiles.filter((p) => p.role === 'client').length;
  const instructorsCount = profiles.filter((p) => p.role === 'instructor' || p.is_instructor).length;
  const branchesCount = branches.length;

  return (
    <section aria-labelledby="stat-summary-heading" className="mb-8">


      <div className={`grid gap-3 sm:gap-4 ${isInstructor ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-2 sm:grid-cols-2 xl:grid-cols-4'}`}>

        {/* Card 1: Total de Turnos Asignados (en profesor) / Alumnos Activos (en admin) */}
        <button
          onClick={() => onNavigate('classes')}
          className="bg-white rounded-2xl p-3.5 sm:p-4 border border-[#E8D5B5] shadow-soft hover:shadow-soft-lg hover:border-[#5E612B]/40 transition-all text-left group cursor-pointer w-full min-w-0 overflow-hidden"
        >
          <div className="flex items-center space-x-3 min-w-0 w-full">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-[#F4E8D1] border border-[#E8D5B5] text-[#5E612B] flex items-center justify-center group-hover:scale-105 transition-transform shadow-xs shrink-0">
              {isInstructor ? (
                <Calendar className="w-5 h-5 text-[#5E612B]" />
              ) : (
                <Users className="w-5 h-5 text-[#5E612B]" />
              )}
            </div>
            <div className="min-w-0 flex-1 overflow-hidden">
              <div className="flex items-center space-x-1 min-w-0">
                <span className="text-[10px] sm:text-xs font-bold text-[#A68D74] uppercase tracking-tight truncate block">
                  {isInstructor ? 'TOTAL TURNOS ASIGNADOS' : 'Alumnos Activos'}
                </span>
                <HelpCircle className="w-3 h-3 text-[#A68D74] shrink-0" />
              </div>
              <div className="text-xl sm:text-2xl font-black text-[#44261B] leading-tight mt-0.5 truncate">
                {isInstructor ? totalAssignedSlots : activeStudents.length}
              </div>
              <span className="text-[10px] sm:text-[11px] text-[#A68D74] font-medium truncate block">
                {isInstructor ? `${classesToday.length} turnos hoy` : `Total: ${totalStudents}`}
              </span>
            </div>
          </div>
        </button>

        {/* Card 2: Alumnos Hoy (en profesor) / Clases Hoy (en admin) */}
        <button
          onClick={() => onNavigate(isInstructor ? 'attendance' : 'classes')}
          className="bg-white rounded-2xl p-3.5 sm:p-4 border border-[#E8D5B5] shadow-soft hover:shadow-soft-lg hover:border-[#5E612B]/40 transition-all text-left group cursor-pointer w-full min-w-0 overflow-hidden"
        >
          <div className="flex items-center space-x-3 min-w-0 w-full">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-[#eaede7] border border-[#cadbcd] text-[#5E612B] flex items-center justify-center group-hover:scale-105 transition-transform shadow-xs shrink-0">
              {isInstructor ? (
                <Users className="w-5 h-5 text-[#5E612B]" />
              ) : (
                <Calendar className="w-5 h-5 text-[#5E612B]" />
              )}
            </div>
            <div className="min-w-0 flex-1 overflow-hidden">
              <span className="text-[10px] sm:text-xs font-bold text-[#A68D74] uppercase tracking-tight block truncate">
                {isInstructor ? 'ALUMNOS HOY' : 'Clases Hoy'}
              </span>
              <div className="text-xl sm:text-2xl font-black text-[#44261B] leading-tight mt-0.5 truncate">
                {isInstructor ? instructorTodayStudents : classesToday.length}
              </div>
              <span className="text-[10px] sm:text-[11px] text-[#A68D74] font-medium truncate block">
                {isInstructor ? `${instructorTodayBookings.length} reservas registradas` : 'Programadas'}
              </span>
            </div>
          </div>
        </button>

        {/* Card 3: Profesores (solo Admin) */}
        {!isInstructor && (
          <button
            onClick={() => onNavigate('instructors')}
            className="bg-white rounded-2xl p-3.5 sm:p-4 border border-[#E8D5B5] shadow-soft hover:shadow-soft-lg hover:border-[#C18749]/50 transition-all text-left group cursor-pointer w-full min-w-0 overflow-hidden"
          >
            <div className="flex items-center space-x-3 min-w-0 w-full">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-[#F4E8D1] border border-[#E8D5B5] text-[#C18749] flex items-center justify-center group-hover:scale-105 transition-transform shadow-xs shrink-0">
                <UserCheck className="w-5 h-5" />
              </div>
              <div className="min-w-0 flex-1 overflow-hidden">
                <span className="text-[10px] sm:text-xs font-bold text-[#A68D74] uppercase tracking-tight block truncate">
                  Profesores
                </span>
                <div className="text-xl sm:text-2xl font-black text-[#44261B] leading-tight mt-0.5 truncate">
                  {instructorsCount}
                </div>
                <span className="text-[10px] sm:text-[11px] text-[#A68D74] font-medium truncate block">
                  Staff activo
                </span>
              </div>
            </div>
          </button>
        )}

        {/* Card 4: Sucursales (solo Admin) */}
        {!isInstructor && (
          <button
            onClick={() => onNavigate('branches')}
            className="bg-white rounded-2xl p-3.5 sm:p-4 border border-[#E8DFD1] shadow-soft hover:shadow-soft-lg hover:border-[#5E612B]/40 transition-all text-left group cursor-pointer w-full min-w-0 overflow-hidden"
          >
            <div className="flex items-center space-x-3 min-w-0 w-full">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-[#FAF8F5] border border-[#E8D5B5] text-[#44261B] flex items-center justify-center group-hover:scale-105 transition-transform shadow-xs shrink-0">
                <Building2 className="w-5 h-5" />
              </div>
              <div className="min-w-0 flex-1 overflow-hidden">
                <span className="text-[10px] sm:text-xs font-bold text-[#A68D74] uppercase tracking-tight block truncate">
                  Sucursales
                </span>
                <div className="text-xl sm:text-2xl font-black text-[#44261B] leading-tight mt-0.5 truncate">
                  {branchesCount}
                </div>
                <span className="text-[10px] sm:text-[11px] text-[#A68D74] font-medium truncate block">
                  Sedes activas
                </span>
              </div>
            </div>
          </button>
        )}

      </div>
    </section>
  );
};
