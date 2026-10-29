import React, { useState } from 'react';
import {
  Users,
  Clock,
  MapPin,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Plus,
  AlertCircle,
  CalendarDays,
  List,
  ListFilter,
  MessageCircle,
  CheckCircle2,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { ClassSchedule, Activity, Branch } from '../../types';
import { getWeekDates, toISODateString, MONTHS_SPANISH } from '../../utils/date';
import { useStudioStore } from '../../store/studioStore';
import { BulkEditClassesModal } from './BulkEditClassesModal';
import { useConfirm } from '../../contexts/ConfirmContext';

interface ClassCalendarProps {
  classes: any[];
  activities: Activity[];
  branches: Branch[];
  selectedBranchId: string;
  selectedActivityId: string;
  onSelectClass: (classItem: any, dateStr: string) => void;
  onCreateClass: () => void;
}

type CalendarViewMode = 'weekly' | 'list';

export const ClassCalendar: React.FC<ClassCalendarProps> = ({
  classes,
  activities,
  branches,
  selectedBranchId,
  selectedActivityId,
  onSelectClass,
  onCreateClass,
}) => {
  // View mode: Semanal o Lista (persisted in localStorage)
  const [viewMode, setViewMode] = useState<CalendarViewMode>(() => {
    try {
      const saved = localStorage.getItem('sermoa_classes_view_mode') as CalendarViewMode;
      if (saved && (saved === 'weekly' || saved === 'list')) {
        return saved;
      }
    } catch (e) {
      // Ignore localStorage errors
    }
    return 'weekly';
  });

  const handleSetViewMode = (mode: CalendarViewMode) => {
    setViewMode(mode);
    try {
      localStorage.setItem('sermoa_classes_view_mode', mode);
    } catch (e) {
      // Ignore localStorage errors
    }
  };

  // Expanded days state for List View (by dateStr, default all expanded)
  const [collapsedDays, setCollapsedDays] = useState<Record<string, boolean>>({});

  const toggleDayCollapse = (dateStr: string) => {
    setCollapsedDays((prev) => ({
      ...prev,
      [dateStr]: !prev[dateStr],
    }));
  };

  // Date States
  const [currentWeekDate, setCurrentWeekDate] = useState(new Date());
  const [selectedDayIndex, setSelectedDayIndex] = useState<number>(new Date().getDay());

  // Studio Store actions for bulk edit and DnD
  const { deleteClassesBatch, updateClassesBatch, updateClass, profiles } = useStudioStore();
  const { confirm } = useConfirm();

  // Drag and Drop Handlers
  const handleDragStart = (e: React.DragEvent, cls: any, originalDateStr: string) => {
    e.dataTransfer.setData('text/plain', JSON.stringify({ classId: cls.id, originalDateStr }));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = async (e: React.DragEvent, newDateStr: string) => {
    e.preventDefault();
    try {
      const data = e.dataTransfer.getData('text/plain');
      if (!data) return;
      const { classId, originalDateStr } = JSON.parse(data);
      if (originalDateStr === newDateStr) return;

      const isConfirmed = await confirm(`¿Estás seguro de que deseas mover esta clase a la nueva fecha?`, {
        title: 'Mover Clase',
        type: 'warning',
        confirmText: 'Mover Clase'
      });

      if (isConfirmed) {
        const [y, m, d] = newDateStr.split('-').map(Number);
        const dateObj = new Date(y, m - 1, d);
        
        updateClass(classId, {
          date: newDateStr,
          day_of_week: dateObj.getDay(),
        });
      }
    } catch (err) {
      console.error('Error parsing drop data:', err);
    }
  };

  // Multi-select States
  const [isMultiSelectMode, setIsMultiSelectMode] = useState(false);
  const [selectedClassIds, setSelectedClassIds] = useState<string[]>([]);
  const [showBulkEdit, setShowBulkEdit] = useState(false);

  const toggleClassSelection = (classId: string) => {
    setSelectedClassIds((prev) => 
      prev.includes(classId) ? prev.filter((id) => id !== classId) : [...prev, classId]
    );
  };

  const handleClassClick = (cls: any, dateStr: string) => {
    if (isMultiSelectMode) {
      toggleClassSelection(cls.id);
    } else {
      onSelectClass(cls, dateStr);
    }
  };

  const weekDays = getWeekDates(currentWeekDate);
  // Mon-Fri (1 to 5)
  const workDays = weekDays.filter((wd) => {
    const day = wd.date.getDay();
    return day >= 1 && day <= 5;
  });

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
    // If today is weekend (0=Sun or 6=Sat), default to Monday (1)
    const todayDay = now.getDay();
    const effectiveDay = todayDay >= 1 && todayDay <= 5 ? todayDay : 1;
    setSelectedDayIndex(effectiveDay);
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
        
        {/* Left: View Mode Pills (Semanal y Lista) */}
        <div className="flex items-center space-x-2">
          <div className="flex p-1 bg-slate-100/90 rounded-2xl border border-slate-200/60 shadow-inner">
            
            <button
              onClick={() => handleSetViewMode('weekly')}
              className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                viewMode === 'weekly'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <CalendarDays className="w-3.5 h-3.5 text-brand-600" />
              <span>Semanal</span>
            </button>

            <button
              onClick={() => handleSetViewMode('list')}
              className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                viewMode === 'list'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <List className="w-3.5 h-3.5 text-brand-600" />
              <span>Lista</span>
            </button>

          </div>
          
          <button
            onClick={() => {
              setIsMultiSelectMode(!isMultiSelectMode);
              if (isMultiSelectMode) setSelectedClassIds([]);
            }}
            className={`hidden lg:flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
              isMultiSelectMode 
                ? 'bg-brand-50 border-brand-200 text-brand-700' 
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Selección Múltiple</span>
          </button>
        </div>

        {/* Center: Date Range Navigator (for weekly & list) */}
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
            Semana del {workDays[0]?.dayNumber} al {workDays[workDays.length - 1]?.dayNumber} de{' '}
            {workDays[0]?.date.toLocaleString('es-ES', { month: 'long' })}
          </span>
        </div>

        {/* Right: New Class Button */}
        <button
          onClick={onCreateClass}
          className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-extrabold shadow-sm transition-all shrink-0 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Nueva Clase</span>
        </button>

      </div>

      {/* Bulk Action Bar (Top) */}
      {isMultiSelectMode && selectedClassIds.length > 0 && (
        <div className="bg-slate-900 px-6 py-3 border-b border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-4 animate-fade-in">
          <div className="flex items-center space-x-2 text-white font-bold whitespace-nowrap">
            <CheckCircle2 className="w-5 h-5 text-brand-400" />
            <span>{selectedClassIds.length} clases seleccionadas</span>
          </div>
          
          <div className="flex items-center gap-3 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
            <button
              onClick={() => setShowBulkEdit(true)}
              className="px-4 py-1.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold transition-colors whitespace-nowrap flex items-center space-x-1"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Editar Seleccionadas</span>
            </button>
            <button
              onClick={() => {
                if (confirm(`¿Estás seguro de que quieres eliminar ${selectedClassIds.length} clases? Esta acción no se puede deshacer.`)) {
                  deleteClassesBatch(selectedClassIds);
                  setIsMultiSelectMode(false);
                  setSelectedClassIds([]);
                }
              }}
              className="px-4 py-1.5 bg-rose-500 hover:bg-rose-600 text-white rounded-xl text-xs font-bold transition-colors whitespace-nowrap"
            >
              Eliminar
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 1. VISTA SEMANAL (WEEKLY VIEW - LUNES A VIERNES) */}
      {/* ========================================================================= */}
      {viewMode === 'weekly' && (
        <div className="p-4 sm:p-6 animate-fade-in">
          
          {/* Mobile Day Selector Tabs (Lunes a Viernes) */}
          <div className="flex md:hidden overflow-x-auto space-x-2 pb-4 mb-4 border-b border-slate-100 scrollbar-none">
            {workDays.map((wd) => {
              const dIndex = wd.date.getDay();
              const isSelected = selectedDayIndex === dIndex;
              const hasClasses = filteredClasses.some((c) => {
                if (c.day_of_week !== dIndex) return false;
                if (!c.is_recurring && c.date !== wd.dateStr) return false;
                return true;
              });

              return (
                <button
                  key={wd.dateStr}
                  onClick={() => setSelectedDayIndex(dIndex)}
                  className={`flex flex-col items-center py-2.5 px-3.5 rounded-2xl min-w-[64px] transition-all shrink-0 ${
                    isSelected
                      ? 'bg-brand-700 text-white shadow-md shadow-brand-700/20 ring-2 ring-brand-600/30'
                      : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <span className="text-[10px] font-bold uppercase tracking-wider">{wd.dayName.slice(0, 3)}</span>
                  <span className="text-sm font-extrabold mt-0.5">{wd.dayNumber}</span>
                  {hasClasses && (
                    <span className={`w-1.5 h-1.5 rounded-full mt-1 ${isSelected ? 'bg-emerald-300' : 'bg-brand-500'}`} />
                  )}
                </button>
              );
            })}
          </div>

          {/* Desktop 5-Column Grid (Lunes a Viernes) / Mobile Single Selected Day */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3.5">
            {workDays.map((wd) => {
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
                      ? 'bg-brand-50/40 border-brand-300/80 shadow-xs ring-1 ring-brand-400/20'
                      : 'bg-[#FAF8F5]/80 border-slate-200/70'
                  } ${!isSelectedOnMobile ? 'hidden md:flex' : 'flex'}`}
                >
                  {/* Day Column Header */}
                  <div className={`p-3 text-center border-b ${isToday ? 'border-brand-200/80 bg-brand-100/60' : 'border-slate-200/60 bg-white/60'}`}>
                    <span className={`text-[11px] font-extrabold uppercase tracking-wider block ${isToday ? 'text-brand-800' : 'text-slate-500'}`}>
                      {wd.dayName}
                    </span>
                    <span className={`text-base font-black inline-block mt-0.5 ${isToday ? 'text-brand-950 font-black' : 'text-slate-800'}`}>
                      {wd.dayNumber}
                    </span>
                  </div>

                  {/* Classes List */}
                  <div 
                    className="p-2.5 space-y-2.5 flex-1 min-h-[380px]"
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, wd.dateStr)}
                  >
                    {dayClasses.length > 0 ? (
                      dayClasses.map((cls) => {
                        const cellDateStr = wd.dateStr;
                        const enrolledCount = cls.bookings?.filter((b: any) => (b.status === 'confirmed' || b.status === 'attended') && (b.booking_date === cellDateStr || !b.booking_date)).length || 0;
                        const isFull = enrolledCount >= cls.max_capacity;

                        return (
                          <div
                            key={cls.id}
                            draggable
                            onDragStart={(e) => handleDragStart(e, cls, cellDateStr)}
                            onClick={() => handleClassClick(cls, cellDateStr)}
                            className={`bg-white rounded-2xl p-3.5 border shadow-soft hover:shadow-soft-lg hover:border-brand-400 hover:-translate-y-0.5 transition-all duration-150 cursor-grab active:cursor-grabbing group text-left relative overflow-hidden ${
                              isMultiSelectMode && selectedClassIds.includes(cls.id) ? 'border-brand-500 ring-2 ring-brand-500/20' : 'border-slate-200/80'
                            }`}
                          >
                            {/* Accent Bar */}
                            <div
                              className="absolute top-0 left-0 bottom-0 w-1 rounded-l-2xl"
                              style={{ backgroundColor: cls.color || '#54875e' }}
                            />

                            {/* Checkbox (if multi-select) */}
                            {isMultiSelectMode && (
                              <div className="absolute top-2.5 right-2.5 z-10">
                                <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${selectedClassIds.includes(cls.id) ? 'bg-brand-600 border-brand-600' : 'border-slate-300 bg-white'}`}>
                                  {selectedClassIds.includes(cls.id) && <CheckCircle2 className="w-3 h-3 text-white" />}
                                </div>
                              </div>
                            )}

                            {/* Time & Capacity Badge */}
                            <div className={`flex items-center justify-between pl-1 mb-1.5 ${isMultiSelectMode ? 'pr-5' : ''}`}>
                              <span className="text-xs font-black text-slate-900 flex items-center space-x-1 tracking-tight">
                                <Clock className="w-3.5 h-3.5 text-brand-600" />
                                <span>{cls.start_time}–{cls.end_time}</span>
                              </span>
                              <span
                                className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border transition-colors ${
                                  isFull
                                    ? 'bg-rose-50 border-rose-200 text-rose-700'
                                    : 'bg-brand-50/80 border-brand-200/60 text-brand-800'
                                }`}
                              >
                                {enrolledCount}/{cls.max_capacity} cupos
                              </span>
                            </div>

                            {/* Class Title / Discipline */}
                            <h4 className="font-extrabold text-[13px] text-slate-900 pl-1 group-hover:text-brand-700 transition-colors line-clamp-1 leading-snug">
                              {cls.title}
                            </h4>

                            {/* Instructor assigned */}
                            <div className="pl-1 mt-2 flex items-center justify-between text-xs text-slate-600 font-medium">
                              <span className="flex items-center space-x-1.5 truncate">
                                <span className="w-1.5 h-1.5 rounded-full bg-brand-500/70 shrink-0" />
                                <span className="truncate">
                                  {cls.instructor ? `${cls.instructor.first_name} ${cls.instructor.last_name || ''}`.trim() : 'Sin profesor'}
                                </span>
                              </span>
                              {cls.status && cls.status !== 'scheduled' && (
                                <span className="text-[10px] font-bold text-slate-400 capitalize shrink-0 ml-1">
                                  {cls.status === 'cancelled' ? 'Cancelada' : cls.status}
                                </span>
                              )}
                            </div>

                            {/* Waitlist Tag if present */}
                            {cls.waitlist && cls.waitlist.length > 0 && (
                              <div className="mt-2 pl-1 pt-1.5 border-t border-slate-100 flex items-center space-x-1 text-[10px] text-amber-700 font-bold">
                                <AlertCircle className="w-3 h-3 text-amber-500" />
                                <span>{cls.waitlist.length} en espera</span>
                              </div>
                            )}

                          </div>
                        );
                      })
                    ) : (
                      <div className="h-full flex flex-col items-center justify-center text-center p-4 text-slate-400 min-h-[140px]">
                        <span className="text-xs font-medium text-slate-400">Sin clases programadas</span>
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
      {/* 2. VISTA DE LISTA (VERTICAL LIST VIEW - LUNES A VIERNES) */}
      {/* ========================================================================= */}
      {viewMode === 'list' && (
        <div className="p-4 sm:p-6 animate-fade-in space-y-4">
          {workDays.map((wd) => {
            const dIndex = wd.date.getDay();
            const dayClasses = filteredClasses
              .filter((c) => {
                if (c.day_of_week !== dIndex) return false;
                if (!c.is_recurring && c.date !== wd.dateStr) return false;
                return true;
              })
              .sort((a, b) => a.start_time.localeCompare(b.start_time));

            const isToday = toISODateString(new Date()) === wd.dateStr;
            const isCollapsed = !!collapsedDays[wd.dateStr];
            const monthName = MONTHS_SPANISH[wd.date.getMonth()] || wd.date.toLocaleString('es-ES', { month: 'long' });

            return (
              <div
                key={wd.dateStr}
                className={`rounded-2xl border transition-all overflow-hidden bg-white ${
                  isToday
                    ? 'border-brand-300 shadow-sm ring-1 ring-brand-400/20'
                    : 'border-slate-200/80 shadow-xs'
                }`}
              >
                {/* Collapsible Header */}
                <button
                  type="button"
                  onClick={() => toggleDayCollapse(wd.dateStr)}
                  className={`w-full flex items-center justify-between px-4 sm:px-6 py-3.5 text-left transition-colors ${
                    isToday
                      ? 'bg-brand-50/70 hover:bg-brand-100/50'
                      : 'bg-slate-50/80 hover:bg-slate-100/70'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-2 h-2 rounded-full ${isToday ? 'bg-brand-600' : 'bg-slate-400'}`} />
                    <div>
                      <span className={`text-xs sm:text-sm font-black uppercase tracking-wider ${isToday ? 'text-brand-900' : 'text-slate-800'}`}>
                        {wd.dayName} {wd.dayNumber} DE {monthName.toUpperCase()}
                      </span>
                      {isToday && (
                        <span className="ml-2 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-brand-600 text-white">
                          Hoy
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <span className="text-xs font-bold text-slate-500">
                      {dayClasses.length} {dayClasses.length === 1 ? 'clase' : 'clases'}
                    </span>
                    <div className="p-1 text-slate-400 hover:text-slate-600 rounded-lg">
                      {isCollapsed ? (
                        <ChevronDown className="w-4 h-4" />
                      ) : (
                        <ChevronUp className="w-4 h-4" />
                      )}
                    </div>
                  </div>
                </button>

                {/* Day Classes Content */}
                {!isCollapsed && (
                  <div className="divide-y divide-slate-100 p-2 sm:p-3">
                    {dayClasses.length > 0 ? (
                      dayClasses.map((cls) => {
                        const cellDateStr = wd.dateStr;
                        const enrolledCount = cls.bookings?.filter((b: any) => (b.status === 'confirmed' || b.status === 'attended') && (b.booking_date === cellDateStr || !b.booking_date)).length || 0;
                        const isFull = enrolledCount >= cls.max_capacity;

                        return (
                          <div
                            key={cls.id}
                            onClick={() => handleClassClick(cls, cellDateStr)}
                            className={`p-3 sm:p-4 rounded-xl hover:bg-[#FAF8F5] transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 group relative border border-transparent hover:border-brand-200/70 ${
                              isMultiSelectMode && selectedClassIds.includes(cls.id) ? 'bg-brand-50/60 border-brand-300' : ''
                            }`}
                          >
                            {/* Checkbox (if multi-select) */}
                            {isMultiSelectMode && (
                              <div className="self-start sm:self-auto shrink-0 mr-1">
                                <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${selectedClassIds.includes(cls.id) ? 'bg-brand-600 border-brand-600' : 'border-slate-300 bg-white'}`}>
                                  {selectedClassIds.includes(cls.id) && <CheckCircle2 className="w-3 h-3 text-white" />}
                                </div>
                              </div>
                            )}

                            {/* Left: Time, Title, Instructor */}
                            <div className="flex items-start sm:items-center space-x-3.5 flex-1 min-w-0">
                              {/* Accent dot / bar */}
                              <div
                                className="w-2.5 h-2.5 rounded-full shrink-0 mt-1 sm:mt-0"
                                style={{ backgroundColor: cls.color || '#54875e' }}
                              />

                              {/* Horario */}
                              <div className="font-black text-slate-900 text-xs sm:text-sm tracking-tight shrink-0 min-w-[95px]">
                                {cls.start_time}–{cls.end_time}
                              </div>

                              <span className="text-slate-300 hidden sm:inline">|</span>

                              {/* Disciplina / Título */}
                              <div className="font-extrabold text-xs sm:text-sm text-slate-900 group-hover:text-brand-700 transition-colors truncate">
                                {cls.title}
                              </div>

                              <span className="text-slate-300 hidden sm:inline">|</span>

                              {/* Profesor */}
                              <div className="text-xs font-semibold text-slate-600 truncate">
                                {cls.instructor ? `${cls.instructor.first_name} ${cls.instructor.last_name || ''}`.trim() : 'Sin profesor'}
                              </div>

                              {cls.waitlist && cls.waitlist.length > 0 && (
                                <span className="text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full shrink-0">
                                  {cls.waitlist.length} en espera
                                </span>
                              )}
                            </div>

                            {/* Right: Cupos & Actions */}
                            <div className="flex items-center justify-between sm:justify-end space-x-3 shrink-0 pt-1 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                              <span
                                className={`text-xs font-extrabold px-2.5 py-1 rounded-full border ${
                                  isFull
                                    ? 'bg-rose-50 border-rose-200 text-rose-700'
                                    : 'bg-brand-50/80 border-brand-200/60 text-brand-800'
                                }`}
                              >
                                {enrolledCount}/{cls.max_capacity} cupos
                              </span>

                              <div className="p-1.5 bg-slate-50 group-hover:bg-brand-100 text-slate-400 group-hover:text-brand-800 rounded-xl transition-colors">
                                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                              </div>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="py-6 text-center text-slate-400">
                        <p className="text-xs font-medium text-slate-400">Sin clases programadas</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {showBulkEdit && (
        <BulkEditClassesModal
          selectedClassIds={selectedClassIds}
          onClose={() => setShowBulkEdit(false)}
          onSuccess={() => {
            setShowBulkEdit(false);
            setIsMultiSelectMode(false);
            setSelectedClassIds([]);
          }}
        />
      )}

    </div>
  );
};
