import React from 'react';
import { Users, Calendar, UserCheck, Building2, HelpCircle } from 'lucide-react';
import { useStudioStore } from '../../store/studioStore';
import { toISODateString } from '../../utils/date';

interface StatCardsProps {
  onNavigate: (view: string) => void;
}

export const StatCards: React.FC<StatCardsProps> = ({ onNavigate }) => {
  const { profiles, classes, branches } = useStudioStore();
  const todayStr = toISODateString(new Date());

  const activeStudents = profiles.filter((p) => p.role === 'client' && p.status === 'active');
  const totalStudents = profiles.filter((p) => p.role === 'client').length;
  const classesToday = classes.filter((c) => !c.is_cancelled && (c.date === todayStr || c.day_of_week === new Date().getDay()));
  const instructorsCount = profiles.filter((p) => p.role === 'instructor' || p.role === 'admin').length;
  const branchesCount = branches.length;

  return (
    <section aria-labelledby="stat-summary-heading" className="mb-8">
      <div className="flex items-center space-x-2 text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-3.5">
        <span className="text-slate-500">📊</span>
        <h3 id="stat-summary-heading">Resumen de Estadísticas</h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        
        {/* Card 1: Alumnos Activos */}
        <button
          onClick={() => onNavigate('students')}
          className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-soft hover:shadow-soft-lg hover:border-blue-200 transition-all flex items-center justify-between text-left group"
        >
          <div className="flex items-center space-x-3.5">
            <div className="w-11 h-11 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-1">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-tight">Alumnos Activos</span>
                <HelpCircle className="w-3 h-3 text-slate-300" />
              </div>
              <div className="text-2xl font-extrabold text-slate-800 leading-tight mt-0.5">
                {activeStudents.length}
              </div>
              <span className="text-[11px] text-slate-400 font-medium">Total: {totalStudents}</span>
            </div>
          </div>
        </button>

        {/* Card 2: Clases Hoy */}
        <button
          onClick={() => onNavigate('classes')}
          className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-soft hover:shadow-soft-lg hover:border-emerald-200 transition-all flex items-center justify-between text-left group"
        >
          <div className="flex items-center space-x-3.5">
            <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-tight block">Clases Hoy</span>
              <div className="text-2xl font-extrabold text-slate-800 leading-tight mt-0.5">
                {classesToday.length}
              </div>
              <span className="text-[11px] text-slate-400 font-medium">Programadas</span>
            </div>
          </div>
        </button>

        {/* Card 3: Profesores */}
        <button
          onClick={() => onNavigate('instructors')}
          className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-soft hover:shadow-soft-lg hover:border-purple-200 transition-all flex items-center justify-between text-left group"
        >
          <div className="flex items-center space-x-3.5">
            <div className="w-11 h-11 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-tight block">Profesores</span>
              <div className="text-2xl font-extrabold text-slate-800 leading-tight mt-0.5">
                {instructorsCount}
              </div>
              <span className="text-[11px] text-slate-400 font-medium">Staff activo</span>
            </div>
          </div>
        </button>

        {/* Card 4: Sucursales */}
        <button
          onClick={() => onNavigate('branches')}
          className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-soft hover:shadow-soft-lg hover:border-amber-200 transition-all flex items-center justify-between text-left group"
        >
          <div className="flex items-center space-x-3.5">
            <div className="w-11 h-11 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-tight block">Sucursales</span>
              <div className="text-2xl font-extrabold text-slate-800 leading-tight mt-0.5">
                {branchesCount}
              </div>
              <span className="text-[11px] text-slate-400 font-medium">Sedes activas</span>
            </div>
          </div>
        </button>

      </div>
    </section>
  );
};
