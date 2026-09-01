import React, { useState } from 'react';
import {
  Users,
  Clock,
  MapPin,
  ChevronLeft,
  ChevronRight,
  Plus,
  AlertCircle,
  Calendar as CalendarIcon,
  CalendarDays,
  ListFilter,
  Table as TableIcon,
  Search,
  MessageCircle,
  CheckCircle2,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { ClassSchedule, Activity, Branch } from '../../types';
import { getWeekDates, toISODateString } from '../../utils/date';

interface ClassCalendarProps {
  classes: any[];
  activities: Activity[];
  branches: Branch[];
  selectedBranchId: string;
  selectedActivityId: string;
  onSelectClass: (classItem: any, dateStr: string) => void;
  onCreateClass: () => void;
}

type CalendarViewMode = 'weekly' | 'daily' | 'table';

export const ClassCalendar: React.FC<ClassCalendarProps> = ({
  classes,
  activities,
  branches,
  selectedBranchId,
  selectedActivityId,
  onSelectClass,
  onCreateClass,
}) => {
  // View mode: Semanal, Diaria, Tabla
  const [viewMode, setViewMode] = useState<CalendarViewMode>('weekly');

  // Date States
  const [currentWeekDate, setCurrentWeekDate] = useState(new Date());
  const [selectedDayIndex, setSelectedDayIndex] = useState<number>(new Date().getDay());
  const [selectedDateDaily, setSelectedDateDaily] = useState<Date>(new Date());
  const [tableSearch, setTableSearch] = useState('');

  const weekDays = getWeekDates(currentWeekDate);

  // Navigation handlers
  const handlePrevWeek = () => {
    const d = new Date(currentWeekDate);
    d.setDate(d.getDate() - 7);
    setCurrentWeekDate(d);
  };

  const handleNextWeek = () => {
    const d = new Date(currentWeekDate);
    d.setDate(d.getDate() + 7);
    setCurrentWeekDate(d);
  };

  const handleToday = () => {
    const now = new Date();
    setCurrentWeekDate(now);
    setSelectedDayIndex(now.getDay());
    setSelectedDateDaily(now);
  };

  const handlePrevDay = () => {
    const d = new Date(selectedDateDaily);
    d.setDate(d.getDate() - 1);
    setSelectedDateDaily(d);
  };

  const handleNextDay = () => {
    const d = new Date(selectedDateDaily);
    d.setDate(d.getDate() + 1);
    setSelectedDateDaily(d);
  };

  // Filter classes by branch and activity
  const filteredClasses = classes.filter((c) => {
    if (selectedBranchId && c.branch_id !== selectedBranchId) return false;
    if (selectedActivityId && c.activity_id !== selectedActivityId) return false;
    return true;
  });

  const daysLabels = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 shadow-soft overflow-hidden">
      
      {/* Top Header: View Mode Switcher & Date Navigators */}
      <div className="p-4 sm:p-6 border-b border-slate-100 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        
        {/* Left: View Mode Pills */}
        <div className="flex items-center space-x-2">
          <div className="flex p-1 bg-slate-100/90 rounded-2xl border border-slate-200/60 shadow-inner">
            
            <button
              onClick={() => setViewMode('weekly')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                viewMode === 'weekly'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <CalendarDays className="w-3.5 h-3.5 text-brand-600" />
              <span>Semanal</span>
            </button>

            <button
              onClick={() => setViewMode('daily')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                viewMode === 'daily'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <CalendarIcon className="w-3.5 h-3.5 text-amber-500" />
              <span>Diaria</span>
            </button>

            <button
              onClick={() => setViewMode('table')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                viewMode === 'table'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <TableIcon className="w-3.5 h-3.5 text-blue-500" />
              <span>Tabla</span>
            </button>

          </div>
        </div>

        {/* Center: Date Range Navigator (for weekly & daily) */}
        {viewMode === 'weekly' && (
          <div className="flex items-center space-x-2.5">
            <button
              onClick={handleToday}
              className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Hoy
            </button>
            <div className="flex items-center space-x-1">
              <button
                onClick={handlePrevWeek}
                className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
                title="Semana anterior"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={handleNextWeek}
                className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
                title="Semana siguiente"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            <span className="text-xs sm:text-sm font-extrabold text-slate-800">
              Semana del {weekDays[0].dayNumber} al {weekDays[6].dayNumber} de{' '}
              {weekDays[0].date.toLocaleString('es-ES', { month: 'long' })}
            </span>
          </div>
        )}

        {viewMode === 'daily' && (
          <div className="flex items-center space-x-2.5">
            <button
              onClick={handleToday}
              className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Hoy
            </button>
            <div className="flex items-center space-x-1">
              <button
                onClick={handlePrevDay}
                className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
                title="Día anterior"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={handleNextDay}
                className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
                title="Día siguiente"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            <span className="text-xs sm:text-sm font-extrabold text-slate-800 capitalize">
              {selectedDateDaily.toLocaleDateString('es-ES', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
              })}
            </span>
          </div>
        )}

        {viewMode === 'table' && (
          <div className="relative w-full lg:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar por clase o profesor..."
              value={tableSearch}
              onChange={(e) => setTableSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
        )}

        {/* Right: New Class Button */}
        <button
          onClick={onCreateClass}
          className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-extrabold shadow-sm transition-all shrink-0 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Nueva Clase</span>
        </button>

      </div>

      {/* ========================================================================= */}
      {/* 1. VISTA SEMANAL (WEEKLY VIEW) */}
      {/* ========================================================================= */}
      {viewMode === 'weekly' && (
        <div className="p-4 sm:p-6 animate-fade-in">
          
          {/* Mobile Day Selector Tabs */}
          <div className="flex md:hidden overflow-x-auto space-x-2 pb-4 mb-4 border-b border-slate-100 scrollbar-none">
            {weekDays.map((wd) => {
              const dIndex = wd.date.getDay();
              const isSelected = selectedDayIndex === dIndex;
              const hasClasses = filteredClasses.some((c) => c.day_of_week === dIndex);

              return (
                <button
                  key={wd.dateStr}
                  onClick={() => setSelectedDayIndex(dIndex)}
                  className={`flex flex-col items-center py-2 px-3 rounded-2xl min-w-[64px] transition-all shrink-0 ${
                    isSelected
                      ? 'bg-slate-900 text-white shadow-md'
                      : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <span className="text-[10px] font-bold uppercase">{wd.dayName.slice(0, 3)}</span>
                  <span className="text-sm font-extrabold mt-0.5">{wd.dayNumber}</span>
                  {hasClasses && (
                    <span className={`w-1.5 h-1.5 rounded-full mt-1 ${isSelected ? 'bg-emerald-400' : 'bg-brand-500'}`} />
                  )}
                </button>
              );
            })}
          </div>

          {/* Desktop 7-Column Grid / Mobile Single Selected Day */}
          <div className="grid grid-cols-1 md:grid-cols-7 gap-3">
            {weekDays.map((wd) => {
              const dIndex = wd.date.getDay();
              const dayClasses = filteredClasses
                .filter((c) => {
                  if (c.day_of_week !== dIndex) return false;
                  if (!c.is_recurring && c.date !== wd.dateStr) return false;
                  return true;
                })
                .sort((a, b) => a.start_time.localeCompare(b.start_time));

              const isToday = toISODateString(new Date()) === wd.dateStr;
              const isSelectedOnMobile = selectedDayIndex === dIndex;

              return (
                <div
                  key={wd.dateStr}
                  className={`flex flex-col rounded-2xl border transition-all ${
                    isToday
                      ? 'bg-emerald-50/30 border-emerald-200/80 shadow-xs'
                      : 'bg-slate-50/60 border-slate-200/60'
                  } ${!isSelectedOnMobile ? 'hidden md:flex' : 'flex'}`}
                >
                  {/* Day Column Header */}
                  <div className={`p-3 text-center border-b ${isToday ? 'border-emerald-200 bg-emerald-100/50' : 'border-slate-200/60'}`}>
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 block">
                      {wd.dayName}
                    </span>
                    <span className={`text-base font-black inline-block mt-0.5 ${isToday ? 'text-emerald-900' : 'text-slate-800'}`}>
                      {wd.dayNumber}
                    </span>
                  </div>

                  {/* Classes List */}
                  <div className="p-2 space-y-2.5 flex-1 min-h-[380px]">
                    {dayClasses.length > 0 ? (
                      dayClasses.map((cls) => {
                        const cellDateStr = wd.dateStr;
                        const enrolledCount = cls.bookings?.filter((b: any) => (b.status === 'confirmed' || b.status === 'attended') && (b.booking_date === cellDateStr || !b.booking_date)).length || 0;
                        const isFull = enrolledCount >= cls.max_capacity;

                        return (
                          <div
                            key={cls.id}
                            onClick={() => onSelectClass(cls, cellDateStr)}
                            className="bg-white rounded-2xl p-3 border border-slate-200/80 shadow-soft hover:shadow-soft-lg hover:border-brand-300 transition-all cursor-pointer group text-left relative overflow-hidden"
                          >
                            {/* Color Accent Bar */}
                            <div
                              className="absolute top-0 left-0 bottom-0 w-1 rounded-l-2xl"
                              style={{ backgroundColor: cls.color || '#54875e' }}
                            />

                            {/* Time & Capacity Badge */}
                            <div className="flex items-center justify-between pl-1.5 mb-1.5">
                              <span className="text-[11px] font-extrabold text-slate-900 flex items-center space-x-1">
                                <Clock className="w-3 h-3 text-slate-400" />
                                <span>{cls.start_time} - {cls.end_time}</span>
                              </span>
                              <span
                                className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded-md ${
                                  isFull
                                    ? 'bg-rose-100 text-rose-800'
                                    : 'bg-slate-100 text-slate-700'
                                }`}
                              >
                                {enrolledCount}/{cls.max_capacity}
                              </span>
                            </div>

                            {/* Class Title */}
                            <h4 className="font-extrabold text-xs text-slate-900 pl-1.5 group-hover:text-brand-700 transition-colors line-clamp-1">
                              {cls.title}
                            </h4>

                            {/* Instructor & Branch */}
                            <div className="pl-1.5 mt-2 flex items-center justify-between text-[10px] text-slate-500 font-medium">
                              <span>{cls.instructor?.first_name} {cls.instructor?.last_name?.[0]}.</span>
                              <span className="text-slate-400 truncate max-w-[70px]">{cls.branch?.name}</span>
                            </div>

                            {/* Waitlist Tag if present */}
                            {cls.waitlist && cls.waitlist.length > 0 && (
                              <div className="mt-2 pl-1.5 pt-1.5 border-t border-slate-100 flex items-center space-x-1 text-[10px] text-amber-700 font-bold">
                                <AlertCircle className="w-3 h-3 text-amber-500" />
                                <span>{cls.waitlist.length} en espera</span>
                              </div>
                            )}

                          </div>
                        );
                      })
                    ) : (
                      <div className="h-full flex flex-col items-center justify-center text-center p-4 text-slate-400">
                        <span className="text-xs font-semibold">Sin clases</span>
                      </div>
                    )}
                  </div>

                </div>
              );
            })}
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. VISTA DIARIA (DAILY TIMELINE VIEW) */}
      {/* ========================================================================= */}
      {viewMode === 'daily' && (
        <div className="p-4 sm:p-6 animate-fade-in space-y-4">
          
          {/* Day Header Summary */}
          <div className="flex items-center justify-between bg-slate-50 p-4 rounded-2xl border border-slate-200/60">
            <div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Cronograma del Día</span>
              <h3 className="text-base sm:text-lg font-black text-slate-900 capitalize">
                {selectedDateDaily.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
              </h3>
            </div>
            <div className="text-right">
              <span className="text-xs font-extrabold text-brand-700 bg-brand-50 border border-brand-200 px-3 py-1.5 rounded-xl">
                {filteredClasses.filter((c) => {
                  if (c.day_of_week !== selectedDateDaily.getDay()) return false;
                  const dateStr = toISODateString(selectedDateDaily);
                  if (!c.is_recurring && c.date !== dateStr) return false;
                  return true;
                }).length} clases programadas
              </span>
            </div>
          </div>

          {/* Timeline List of Classes for Selected Day */}
          {(() => {
            const dateStr = toISODateString(selectedDateDaily);
            const dayClasses = filteredClasses
              .filter((c) => {
                if (c.day_of_week !== selectedDateDaily.getDay()) return false;
                if (!c.is_recurring && c.date !== dateStr) return false;
                return true;
              })
              .sort((a, b) => a.start_time.localeCompare(b.start_time));

            if (dayClasses.length === 0) {
              return (
                <div className="py-16 text-center text-slate-400 bg-slate-50/50 rounded-3xl border border-dashed border-slate-200">
                  <CalendarDays className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                  <p className="text-sm font-bold text-slate-600">No hay clases programadas para este día</p>
                  <button
                    onClick={onCreateClass}
                    className="mt-3 px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
                  >
                    + Programar Clase
                  </button>
                </div>
              );
            }

            return (
              <div className="space-y-3">
                {dayClasses.map((cls) => {
                  const enrolled = cls.bookings?.filter((b: any) => (b.status === 'confirmed' || b.status === 'attended') && (b.booking_date === dateStr || !b.booking_date)) || [];
                  const enrolledCount = enrolled.length;
                  const isFull = enrolledCount >= cls.max_capacity;
                  const fillPercentage = Math.min(100, Math.round((enrolledCount / cls.max_capacity) * 100));

                  return (
                    <div
                      key={cls.id}
                      onClick={() => onSelectClass(cls, dateStr)}
                      className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-soft hover:shadow-soft-lg hover:border-brand-300 transition-all cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4 group"
                    >
                      {/* Left: Time & Class Info */}
                      <div className="flex items-start space-x-4">
                        <div
                          className="w-16 h-16 rounded-2xl flex flex-col items-center justify-center text-white font-extrabold shrink-0 shadow-sm"
                          style={{ backgroundColor: cls.color || '#54875e' }}
                        >
                          <span className="text-xs leading-none">{cls.start_time}</span>
                          <span className="text-[10px] font-normal opacity-80 mt-1">a {cls.end_time}</span>
                        </div>

                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="text-base font-black text-slate-900 group-hover:text-brand-700 transition-colors">
                              {cls.title}
                            </span>
                            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                              {cls.activity?.name || 'Pilates'}
                            </span>
                          </div>

                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 font-semibold mt-1.5">
                            <span className="flex items-center space-x-1">
                              <Users className="w-3.5 h-3.5 text-purple-500" />
                              <span>Prof. {cls.instructor?.first_name} {cls.instructor?.last_name}</span>
                            </span>
                            <span className="flex items-center space-x-1">
                              <MapPin className="w-3.5 h-3.5 text-amber-500" />
                              <span>{cls.branch?.name} ({cls.room?.name || 'Sala 1'})</span>
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Right: Enrolled Progress Bar & Quick Action */}
                      <div className="flex items-center space-x-4 shrink-0">
                        
                        {/* Occupancy Indicator */}
                        <div className="w-40 text-right">
                          <div className="flex items-center justify-between text-xs font-bold mb-1">
                            <span className="text-slate-400">Cupos</span>
                            <span className={isFull ? 'text-rose-600 font-extrabold' : 'text-slate-800'}>
                              {enrolledCount} / {cls.max_capacity}
                            </span>
                          </div>
                          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all ${
                                isFull ? 'bg-rose-500' : 'bg-brand-600'
                              }`}
                              style={{ width: `${fillPercentage}%` }}
                            />
                          </div>
                          {cls.waitlist && cls.waitlist.length > 0 && (
                            <span className="text-[10px] text-amber-700 font-extrabold block mt-1">
                              ⚠️ {cls.waitlist.length} en lista de espera
                            </span>
                          )}
                        </div>

                        {/* Arrow Action Button */}
                        <div className="p-2.5 bg-slate-50 group-hover:bg-brand-50 group-hover:text-brand-700 text-slate-400 rounded-2xl transition-colors">
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                        </div>

                      </div>

                    </div>
                  );
                })}
              </div>
            );
          })()}

        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. VISTA TABLA (TABLE / DATA LIST VIEW) */}
      {/* ========================================================================= */}
      {viewMode === 'table' && (
        <div className="p-4 sm:p-6 animate-fade-in">
          
          {(() => {
            const tableData = filteredClasses.filter((c) => {
              if (!tableSearch) return true;
              const q = tableSearch.toLowerCase();
              return (
                c.title.toLowerCase().includes(q) ||
                c.instructor?.first_name.toLowerCase().includes(q) ||
                c.instructor?.last_name.toLowerCase().includes(q) ||
                c.branch?.name.toLowerCase().includes(q)
              );
            });

            if (tableData.length === 0) {
              return (
                <div className="py-16 text-center text-slate-400">
                  <p className="text-sm font-bold text-slate-600">No se encontraron clases con los filtros aplicados.</p>
                </div>
              );
            }

            return (
              <div className="border border-slate-200/80 rounded-2xl overflow-x-auto scrollbar-none">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-slate-50/90 text-slate-600 font-extrabold text-[11px] uppercase tracking-wider border-b border-slate-200">
                    <tr>
                      <th className="py-3 px-4">Día</th>
                      <th className="py-3 px-4">Horario</th>
                      <th className="py-3 px-4">Clase / Disciplina</th>
                      <th className="py-3 px-4">Profesor</th>
                      <th className="py-3 px-4">Sucursal / Sala</th>
                      <th className="py-3 px-4 text-center">Ocupación</th>
                      <th className="py-3 px-4 text-center">Espera</th>
                      <th className="py-3 px-4 text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                    {tableData.map((cls) => {
                      const nextOccurrence = getNextOccurrenceStr(cls);
                      const enrolled = cls.bookings?.filter((b: any) => (b.status === 'confirmed' || b.status === 'attended') && (b.booking_date === nextOccurrence || !b.booking_date)) || [];
                      const enrolledCount = enrolled.length;
                      const isFull = enrolledCount >= cls.max_capacity;

                      return (
                        <tr
                          key={cls.id}
                          onClick={() => onSelectClass(cls, nextOccurrence)}
                          className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                        >
                          <td className="py-3.5 px-4 font-black text-slate-900">
                            {daysLabels[cls.day_of_week]}
                          </td>

                          <td className="py-3.5 px-4 font-extrabold text-slate-800">
                            {cls.start_time} - {cls.end_time}
                          </td>

                          <td className="py-3.5 px-4">
                            <div className="flex items-center space-x-2">
                              <span
                                className="w-2.5 h-2.5 rounded-full shrink-0"
                                style={{ backgroundColor: cls.color || '#54875e' }}
                              />
                              <span className="font-extrabold text-slate-900">{cls.title}</span>
                            </div>
                          </td>

                          <td className="py-3.5 px-4">
                            {cls.instructor?.first_name} {cls.instructor?.last_name}
                          </td>

                          <td className="py-3.5 px-4 text-slate-500 font-medium">
                            {cls.branch?.name} • {cls.room?.name || 'Sala 1'}
                          </td>

                          <td className="py-3.5 px-4 text-center">
                            <span
                              className={`px-2.5 py-1 rounded-full font-extrabold text-[10px] ${
                                isFull
                                  ? 'bg-rose-100 text-rose-800'
                                  : 'bg-emerald-100 text-emerald-800'
                              }`}
                            >
                              {enrolledCount} / {cls.max_capacity}
                            </span>
                          </td>

                          <td className="py-3.5 px-4 text-center">
                            {cls.waitlist && cls.waitlist.length > 0 ? (
                              <span className="px-2 py-0.5 rounded-full font-extrabold text-[10px] bg-amber-100 text-amber-800">
                                {cls.waitlist.length}
                              </span>
                            ) : (
                              <span className="text-slate-300">-</span>
                            )}
                          </td>

                          <td className="py-3.5 px-4 text-right">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onSelectClass(cls);
                              }}
                              className="px-3 py-1 bg-slate-100 hover:bg-brand-50 hover:text-brand-700 text-slate-700 rounded-xl text-xs font-bold transition-colors"
                            >
                              Ver detalle
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            );
          })()}

        </div>
      )}

    </div>
  );
};
