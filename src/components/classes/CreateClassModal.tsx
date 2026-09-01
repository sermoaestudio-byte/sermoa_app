import React, { useState, useEffect } from 'react';
import {
  X,
  Plus,
  Trash2,
  Calendar,
  Clock,
  HelpCircle,
  CheckSquare,
  Square,
  Sparkles,
  Info
} from 'lucide-react';
import { useStudioStore } from '../../store/studioStore';
import { ClassSchedule } from '../../types';

interface CreateClassModalProps {
  onClose: () => void;
}

type ScheduleMode = 'grilla' | 'rango' | 'manual';

interface ManualSlot {
  id: string;
  startTime: string;
  endTime: string;
  title: string;
  description: string;
}

// Reusable Tooltip Component for Help Icons
const FieldHelp: React.FC<{ text: string }> = ({ text }) => {
  const [show, setShow] = useState(false);

  return (
    <div className="relative inline-flex items-center ml-1">
      <button
        type="button"
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        onClick={() => setShow(!show)}
        className="text-slate-400 hover:text-slate-600 focus:outline-none transition-colors"
        aria-label="Ayuda"
      >
        <HelpCircle className="w-3.5 h-3.5" />
      </button>

      {show && (
        <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-56 p-2.5 bg-slate-900 text-white text-[11px] font-normal leading-tight rounded-xl shadow-xl z-50 animate-fade-in pointer-events-none">
          <div className="relative">
            {text}
            {/* Arrow pointer */}
            <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-0.5 border-4 border-transparent border-t-slate-900" />
          </div>
        </div>
      )}
    </div>
  );
};

export const CreateClassModal: React.FC<CreateClassModalProps> = ({ onClose }) => {
  const { branches, profiles, activities, createClassesBatch } = useStudioStore();
  const instructors = profiles.filter((p) => p.role === 'instructor' || p.role === 'admin');

  // 1. Tipo de Clase
  const [classType, setClassType] = useState<'recurring' | 'single'>('recurring');
  const [singleDate, setSingleDate] = useState(new Date().toISOString().split('T')[0]);

  // 2. Sucursal & Profesor
  const [branchId, setBranchId] = useState(branches[0]?.id || '');
  const [instructorId, setInstructorId] = useState(instructors[0]?.id || '');
  const [activityId, setActivityId] = useState(activities[0]?.id || '');

  // 3. Rango de Fechas & Feriados
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [includeHolidays, setIncludeHolidays] = useState(true);

  // 4. Días de la Semana
  // 1=Lunes, 2=Martes, 3=Miércoles, 4=Jueves, 5=Viernes, 6=Sábado, 0=Domingo
  const [selectedDays, setSelectedDays] = useState<number[]>([1, 3, 5]); // Default Lun, Mié, Vie

  // 5. Modo de Horarios (Grilla / Por Rango / Manual)
  const [scheduleMode, setScheduleMode] = useState<ScheduleMode>('grilla');

  // If classType changes to 'single' and mode is 'grilla', auto-switch to 'rango'
  useEffect(() => {
    if (classType === 'single' && scheduleMode === 'grilla') {
      setScheduleMode('rango');
    }
  }, [classType, scheduleMode]);

  // Fields for Grilla & Por Rango
  const [commonTitle, setCommonTitle] = useState('Pilates Reformer');
  const [commonDescription, setCommonDescription] = useState('');
  const [classDurationMinutes, setClassDurationMinutes] = useState<number | ''>(60);
  const [intervalStep, setIntervalStep] = useState('1 Hora');

  // Grilla state: matrix of selected [dayIndex-hourString]
  const [gridSelection, setGridSelection] = useState<Record<string, boolean>>({
    '1-08:00': true,
    '3-08:00': true,
    '5-08:00': true,
    '1-18:00': true,
    '3-18:00': true,
    '5-18:00': true,
  });

  // Por Rango state
  const [rangeStartTime, setRangeStartTime] = useState('08:00');
  const [rangeEndTime, setRangeEndTime] = useState('12:00');

  // Manual state
  const [manualSlots, setManualSlots] = useState<ManualSlot[]>([
    {
      id: 'slot-1',
      startTime: '08:00',
      endTime: '09:00',
      title: 'Pilates Reformer Matutino',
      description: '',
    },
  ]);

  // 6. Capacidad, Créditos y Tarifario
  const [maxCapacity, setMaxCapacity] = useState<number | ''>(12);
  const [creditCost, setCreditCost] = useState(1.0);
  const [singleClassPrice, setSingleClassPrice] = useState<number>(6500);
  const [allowPrivateBookings, setAllowPrivateBookings] = useState(false);
  const [allowCustomBookings, setAllowCustomBookings] = useState(false);

  const daysList = [
    { label: 'Lunes', dayIndex: 1 },
    { label: 'Martes', dayIndex: 2 },
    { label: 'Miércoles', dayIndex: 3 },
    { label: 'Jueves', dayIndex: 4 },
    { label: 'Viernes', dayIndex: 5 },
    { label: 'Sábado', dayIndex: 6 },
    { label: 'Domingo', dayIndex: 0 },
  ];

  const gridHours = [
    '07:00', '08:00', '09:00', '10:00', '11:00', '12:00',
    '13:00', '14:00', '15:00', '16:00', '17:00', '18:00',
    '19:00', '20:00', '21:00'
  ];

  const toggleDay = (dayIndex: number) => {
    if (selectedDays.includes(dayIndex)) {
      setSelectedDays(selectedDays.filter((d) => d !== dayIndex));
    } else {
      setSelectedDays([...selectedDays, dayIndex]);
    }
  };

  const toggleGridCell = (dayIndex: number, hourStr: string) => {
    const key = `${dayIndex}-${hourStr}`;
    setGridSelection((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const addManualSlot = () => {
    setManualSlots([
      ...manualSlots,
      {
        id: `slot-${Date.now()}`,
        startTime: '10:00',
        endTime: '11:00',
        title: commonTitle || 'Clase',
        description: '',
      },
    ]);
  };

  const removeManualSlot = (id: string) => {
    if (manualSlots.length <= 1) return;
    setManualSlots(manualSlots.filter((s) => s.id !== id));
  };

  const updateManualSlot = (id: string, field: keyof ManualSlot, value: string) => {
    setManualSlots(
      manualSlots.map((s) => (s.id === id ? { ...s, [field]: value } : s))
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const selectedBranch = branches.find((b) => b.id === branchId) || branches[0];
    const roomId = selectedBranch?.rooms[0]?.id || 'room-1';
    const act = activities.find((a) => a.id === activityId);
    const color = act?.color || '#54875e';

    const classesToCreate: Partial<ClassSchedule>[] = [];

    if (classType === 'recurring' && scheduleMode === 'grilla') {
      // Create a class for each checked grid cell
      for (const [key, isChecked] of Object.entries(gridSelection)) {
        if (!isChecked) continue;
        const [dayStr, start] = key.split('-');
        const dIndex = parseInt(dayStr, 10);

        // Compute end time based on duration
        const [h, m] = start.split(':').map(Number);
        const endMinutes = h * 60 + m + (Number(classDurationMinutes) || 60);
        const endH = String(Math.floor(endMinutes / 60)).padStart(2, '0');
        const endM = String(endMinutes % 60).padStart(2, '0');
        const end = `${endH}:${endM}`;

        classesToCreate.push({
          title: commonTitle || act?.name || 'Clase',
          activity_id: activityId,
          branch_id: branchId,
          room_id: roomId,
          instructor_id: instructorId,
          day_of_week: dIndex,
          start_time: start,
          end_time: end,
          max_capacity: Number(maxCapacity) || 12,
          single_class_price: singleClassPrice,
          is_recurring: true,
          color,
        });
      }
    } else if (scheduleMode === 'rango') {
      // Generate slots between rangeStartTime and rangeEndTime for each selected day
      const [startH, startM] = rangeStartTime.split(':').map(Number);
      const [endH, endM] = rangeEndTime.split(':').map(Number);

      const startTotal = startH * 60 + startM;
      const endTotal = endH * 60 + endM;

      const days = classType === 'single' ? [new Date(singleDate + 'T12:00:00').getDay()] : selectedDays;

      const duration = Number(classDurationMinutes) || 60;
      for (let curr = startTotal; curr + duration <= endTotal; curr += duration) {
        const slotStartH = String(Math.floor(curr / 60)).padStart(2, '0');
        const slotStartM = String(curr % 60).padStart(2, '0');
        const slotEndH = String(Math.floor((curr + duration) / 60)).padStart(2, '0');
        const slotEndM = String((curr + duration) % 60).padStart(2, '0');

        const start = `${slotStartH}:${slotStartM}`;
        const end = `${slotEndH}:${slotEndM}`;

        for (const dIndex of days) {
          classesToCreate.push({
            title: commonTitle || act?.name || 'Clase',
            activity_id: activityId,
            branch_id: branchId,
            room_id: roomId,
            instructor_id: instructorId,
            day_of_week: dIndex,
            start_time: start,
            end_time: end,
            max_capacity: Number(maxCapacity) || 12,
            single_class_price: singleClassPrice,
            is_recurring: classType === 'recurring',
            date: classType === 'single' ? singleDate : undefined,
            color,
          });
        }
      }
    } else {
      // Manual slots across selected days
      const days = classType === 'single' ? [new Date(singleDate + 'T12:00:00').getDay()] : selectedDays;

      for (const slot of manualSlots) {
        for (const dIndex of days) {
          classesToCreate.push({
            title: slot.title || commonTitle || act?.name || 'Clase',
            activity_id: activityId,
            branch_id: branchId,
            room_id: roomId,
            instructor_id: instructorId,
            day_of_week: dIndex,
            start_time: slot.startTime,
            end_time: slot.endTime,
            max_capacity: Number(maxCapacity) || 12,
            single_class_price: singleClassPrice,
            is_recurring: classType === 'recurring',
            date: classType === 'single' ? singleDate : undefined,
            color,
          });
        }
      }
    }

    if (classesToCreate.length === 0) {
      alert('Por favor selecciona al menos un día y horario para crear la clase.');
      return;
    }

    createClassesBatch(classesToCreate);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-100 flex flex-col">
        
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-20">
          <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Nueva Clase
          </h3>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 flex-1 text-xs">
          
          {/* 1. Tipo de Clase (Radio Buttons) */}
          <div>
            <label className="block font-bold text-slate-700 mb-2">
              <span className="text-rose-500 mr-1">*</span>Tipo de Clase
            </label>
            <div className="flex items-center space-x-6">
              <label className="flex items-center space-x-2 cursor-pointer font-semibold text-slate-800">
                <input
                  type="radio"
                  name="classType"
                  value="recurring"
                  checked={classType === 'recurring'}
                  onChange={() => setClassType('recurring')}
                  className="w-4 h-4 text-brand-olive focus:ring-brand-olive"
                />
                <span>Clase Recurrente</span>
              </label>

              <label className="flex items-center space-x-2 cursor-pointer font-semibold text-slate-800">
                <input
                  type="radio"
                  name="classType"
                  value="single"
                  checked={classType === 'single'}
                  onChange={() => {
                    setClassType('single');
                    if (scheduleMode === 'grilla') setScheduleMode('manual');
                  }}
                  className="w-4 h-4 text-brand-olive focus:ring-brand-olive"
                />
                <span>Clase Única</span>
              </label>
            </div>

            {classType === 'single' && (
              <div className="mt-3 p-3 bg-slate-50 rounded-2xl border border-slate-200/80 animate-fade-in max-w-xs">
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  Fecha de la Clase Única:
                </label>
                <input
                  type="date"
                  value={singleDate}
                  onChange={(e) => setSingleDate(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800"
                />
              </div>
            )}
          </div>

          {/* 2. Sucursal */}
          <div>
            <label className="block font-bold text-slate-700 mb-1.5">
              <span className="text-rose-500 mr-1">*</span>Sucursal
            </label>
            <select
              value={branchId}
              onChange={(e) => setBranchId(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              {branches.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name} ({b.address})
                </option>
              ))}
            </select>
          </div>

          {/* 3. Profesor(es) & Disciplina */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1.5">
                <span className="text-rose-500 mr-1">*</span>Profesor(es)
              </label>
              <select
                value={instructorId}
                onChange={(e) => setInstructorId(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                {instructors.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.first_name} {p.last_name} ({p.role === 'admin' ? 'Dueño / Instructor' : 'Staff'})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1.5">
                <span className="text-rose-500 mr-1">*</span>Disciplina
              </label>
              <select
                value={activityId}
                onChange={(e) => {
                  setActivityId(e.target.value);
                  const act = activities.find((a) => a.id === e.target.value);
                  if (act) setCommonTitle(act.name);
                }}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                {activities.map((act) => (
                  <option key={act.id} value={act.id}>
                    {act.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 4. Rango de Fechas (Opcional) & Feriados */}
          {classType === 'recurring' && (
            <div className="space-y-3">
              <div>
                <div className="flex items-center font-bold text-slate-700 mb-1.5">
                  <span>Rango de Fechas (Opcional)</span>
                  <FieldHelp text="Define el período en el cual estará activa la recurrencia de estas clases. Si lo dejas vacío, se mantendrán activas indefinidamente." />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="date"
                    placeholder="Fecha inicial"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-700"
                  />
                  <input
                    type="date"
                    placeholder="Fecha final"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-700"
                  />
                </div>
              </div>

              {/* Incluir feriados */}
              <label className="flex items-center space-x-2 cursor-pointer text-slate-700 font-semibold pt-1">
                <input
                  type="checkbox"
                  checked={includeHolidays}
                  onChange={(e) => setIncludeHolidays(e.target.checked)}
                  className="rounded text-brand-olive focus:ring-brand-olive w-4 h-4"
                />
                <span className="flex items-center">
                  <span>Incluir feriados en las clases recurrentes</span>
                  <FieldHelp text="Si está marcado, las clases recurrentes se programarán normalmente incluso los días feriados nacionales." />
                </span>
              </label>
            </div>
          )}

          {/* 5. Días de la Semana */}
          {classType === 'recurring' && (
            <div>
              <label className="block font-bold text-slate-700 mb-2">
                <span className="text-rose-500 mr-1">*</span>Días de la Semana
              </label>
              <div className="flex flex-wrap gap-4">
                {daysList.map((d) => (
                  <label
                    key={d.dayIndex}
                    className="flex items-center space-x-2 cursor-pointer text-xs font-semibold text-slate-800 select-none"
                  >
                    <input
                      type="checkbox"
                      checked={selectedDays.includes(d.dayIndex)}
                      onChange={() => toggleDay(d.dayIndex)}
                      className="rounded text-brand-olive focus:ring-brand-olive w-4 h-4"
                    />
                    <span>{d.label}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* 6. Horarios * (Grilla / Por Rango / Manual) */}
          <div className="pt-2">
            <div className="flex items-center justify-between mb-3">
              <label className="font-extrabold text-slate-800 text-sm">
                Horarios <span className="text-rose-500">*</span>
              </label>

              {/* Tabs Switcher: Grilla (Hidden on 'single' class type) | Por Rango | Manual */}
              <div className="flex p-0.5 bg-slate-100 rounded-xl border border-slate-200">
                {/* Grilla Option (Only shown for Recurring Classes) */}
                {classType === 'recurring' && (
                  <button
                    type="button"
                    onClick={() => setScheduleMode('grilla')}
                    className={`px-3 py-1 rounded-lg font-bold text-xs transition-all ${
                      scheduleMode === 'grilla'
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    Grilla
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => setScheduleMode('rango')}
                  className={`px-3 py-1 rounded-lg font-bold text-xs transition-all ${
                    scheduleMode === 'rango'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Por Rango
                </button>

                <button
                  type="button"
                  onClick={() => setScheduleMode('manual')}
                  className={`px-3 py-1 rounded-lg font-bold text-xs transition-all ${
                    scheduleMode === 'manual'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Manual
                </button>
              </div>
            </div>

            {/* MODE 1: GRILLA (Only when classType is recurring) */}
            {classType === 'recurring' && scheduleMode === 'grilla' && (
              <div className="bg-slate-50/80 rounded-2xl p-4 sm:p-5 border border-slate-200/80 space-y-4 animate-fade-in">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      TÍTULO (OPCIONAL)
                    </label>
                    <input
                      type="text"
                      placeholder="Ej: Pilates Reformer"
                      value={commonTitle}
                      onChange={(e) => setCommonTitle(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      DESCRIPCIÓN (OPCIONAL)
                    </label>
                    <input
                      type="text"
                      placeholder="Breve descripción o nivel..."
                      value={commonDescription}
                      onChange={(e) => setCommonDescription(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <div className="flex items-center mb-1">
                      <span className="text-[11px] font-bold text-slate-600">
                        DURACIÓN DE CADA CLASE (MINUTOS)
                      </span>
                      <FieldHelp text="Tiempo en minutos de duración de cada sesión (ej. 60 min para clases de una hora)." />
                    </div>
                    <input
                      type="number"
                      min="15"
                      max="180"
                      step="5"
                      value={classDurationMinutes}
                      onChange={(e) => setClassDurationMinutes(e.target.value === '' ? '' : Number(e.target.value))}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800"
                    />
                  </div>

                  <div>
                    <div className="flex items-center mb-1">
                      <span className="text-[11px] font-bold text-slate-600">
                        INTERVALO DE HORARIOS
                      </span>
                      <FieldHelp text="Espaciado de tiempo entre los inicios de cada clase disponible en la grilla." />
                    </div>
                    <select
                      value={intervalStep}
                      onChange={(e) => setIntervalStep(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800"
                    >
                      <option value="1 Hora">1 Hora</option>
                      <option value="45 Minutos">45 Minutos</option>
                      <option value="30 Minutos">30 Minutos</option>
                    </select>
                  </div>
                </div>

                {/* Grid Table */}
                <div>
                  <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                    <span>SELECCIONA LOS HORARIOS EN LA GRILLA</span>
                  </div>

                  <div className="border border-slate-200 rounded-2xl bg-white overflow-x-auto max-h-60">
                    <table className="w-full text-center text-xs">
                      <thead className="bg-slate-50 text-slate-600 font-extrabold text-[10px] sticky top-0 border-b border-slate-200 z-10">
                        <tr>
                          <th className="py-2.5 px-3 text-left">🕒 HORA</th>
                          <th className="py-2.5 px-2">LUN</th>
                          <th className="py-2.5 px-2">MAR</th>
                          <th className="py-2.5 px-2">MIÉ</th>
                          <th className="py-2.5 px-2">JUE</th>
                          <th className="py-2.5 px-2">VIE</th>
                          <th className="py-2.5 px-2">SÁB</th>
                          <th className="py-2.5 px-2">DOM</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-slate-700">
                        {gridHours.map((hour) => (
                          <tr key={hour} className="hover:bg-slate-50/80 transition-colors">
                            <td className="py-2 px-3 text-left font-bold text-slate-700 text-xs">
                              {hour} hs
                            </td>
                            {daysList.map((d) => {
                              const key = `${d.dayIndex}-${hour}`;
                              const isChecked = !!gridSelection[key];

                              return (
                                <td key={d.dayIndex} className="py-2 px-2">
                                  <input
                                    type="checkbox"
                                    checked={isChecked}
                                    onChange={() => toggleGridCell(d.dayIndex, hour)}
                                    className="rounded text-brand-olive focus:ring-brand-olive w-4 h-4 cursor-pointer"
                                  />
                                </td>
                              );
                            })}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>
            )}

            {/* MODE 2: POR RANGO */}
            {scheduleMode === 'rango' && (
              <div className="bg-slate-50/80 rounded-2xl p-4 sm:p-5 border border-slate-200/80 space-y-4 animate-fade-in">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      DE (HORA INICIO)
                    </label>
                    <input
                      type="time"
                      value={rangeStartTime}
                      onChange={(e) => setRangeStartTime(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      A (HORA FIN)
                    </label>
                    <input
                      type="time"
                      value={rangeEndTime}
                      onChange={(e) => setRangeEndTime(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      TÍTULO (OPCIONAL)
                    </label>
                    <input
                      type="text"
                      placeholder="Ej: Pilates Reformer"
                      value={commonTitle}
                      onChange={(e) => setCommonTitle(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      DESCRIPCIÓN (OPCIONAL)
                    </label>
                    <input
                      type="text"
                      placeholder="Descripción de la clase..."
                      value={commonDescription}
                      onChange={(e) => setCommonDescription(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center mb-1">
                    <span className="text-[11px] font-bold text-slate-600">
                      DURACIÓN DE CADA CLASE (MINUTOS)
                    </span>
                    <FieldHelp text="Tiempo en minutos de duración de cada sesión (ej. 60 min para clases de una hora)." />
                  </div>
                  <input
                    type="number"
                    min="15"
                    max="180"
                    step="5"
                    value={classDurationMinutes}
                    onChange={(e) => setClassDurationMinutes(Number(e.target.value))}
                    className="w-full max-w-xs px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800"
                  />
                  <p className="text-[11px] text-slate-400 mt-2 flex items-center space-x-1">
                    <Info className="w-3.5 h-3.5 text-brand-600" />
                    <span>Los horarios se generarán automáticamente dividiendo el rango ingresado.</span>
                  </p>
                </div>
              </div>
            )}

            {/* MODE 3: MANUAL */}
            {scheduleMode === 'manual' && (
              <div className="bg-slate-50/80 rounded-2xl p-4 sm:p-5 border border-slate-200/80 space-y-4 animate-fade-in">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-slate-700">
                    {manualSlots.length} horario{manualSlots.length > 1 ? 's' : ''} definido{manualSlots.length > 1 ? 's' : ''}
                  </span>
                  <button
                    type="button"
                    onClick={addManualSlot}
                    className="inline-flex items-center space-x-1 px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 shadow-xs"
                  >
                    <Plus className="w-3.5 h-3.5 text-brand-600" />
                    <span>Agregar horario</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {manualSlots.map((slot, index) => (
                    <div
                      key={slot.id}
                      className="p-4 bg-white rounded-2xl border border-slate-200 space-y-3 shadow-xs relative"
                    >
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-bold text-slate-600 mb-1">
                            <span className="text-rose-500 mr-1">*</span>Hora inicio
                          </label>
                          <input
                            type="time"
                            value={slot.startTime}
                            onChange={(e) => updateManualSlot(slot.id, 'startTime', e.target.value)}
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-slate-600 mb-1">
                            <span className="text-rose-500 mr-1">*</span>Hora fin
                          </label>
                          <input
                            type="time"
                            value={slot.endTime}
                            onChange={(e) => updateManualSlot(slot.id, 'endTime', e.target.value)}
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-bold text-slate-600 mb-1">
                            Título (opcional)
                          </label>
                          <input
                            type="text"
                            placeholder="Título de la clase..."
                            value={slot.title}
                            onChange={(e) => updateManualSlot(slot.id, 'title', e.target.value)}
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-600 mb-1">
                            Descripción (opcional)
                          </label>
                          <input
                            type="text"
                            placeholder="Descripción..."
                            value={slot.description}
                            onChange={(e) => updateManualSlot(slot.id, 'description', e.target.value)}
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800"
                          />
                        </div>
                      </div>

                      {manualSlots.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeManualSlot(slot.id)}
                          className="text-rose-600 hover:text-rose-700 text-xs font-bold flex items-center space-x-1 pt-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Eliminar este horario</span>
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 7. Capacidad máxima de alumnos */}
          <div>
            <div className="flex items-center font-bold text-slate-700 mb-1.5">
              <span><span className="text-rose-500 mr-1">*</span>Capacidad máxima de alumnos</span>
              <FieldHelp text="Cantidad máxima de cupos disponibles por clase. Una vez llena, los siguientes alumnos entrarán automáticamente en Lista de Espera." />
            </div>
            <input
              type="number"
              min="1"
              max="100"
              required
              value={maxCapacity}
              onChange={(e) => setMaxCapacity(e.target.value === '' ? '' : Number(e.target.value))}
              className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-extrabold text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          {/* 8. Configuración de Créditos */}
          <div className="pt-2 space-y-3">
            <h4 className="font-extrabold text-slate-900 text-sm">
              Configuración de Créditos
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <div className="flex items-center font-bold text-slate-700 mb-1.5">
                  <span><span className="text-rose-500 mr-1">*</span>Costo en créditos (Reserva normal)</span>
                  <FieldHelp text="Cantidad de créditos que se descontarán del paquete del alumno al reservar esta clase (por defecto 1.0 crédito)." />
                </div>
                <input
                  type="number"
                  step="0.5"
                  min="0.5"
                  max="10"
                  value={creditCost}
                  onChange={(e) => setCreditCost(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-extrabold text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div>
                <div className="flex items-center font-bold text-slate-700 mb-1.5">
                  <span>Tarifa Clase Suelta ($ ARS)</span>
                  <FieldHelp text="Precio de referencia para cobrar la clase suelta o sin pack a un alumno." />
                </div>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">
                    $
                  </span>
                  <input
                    type="number"
                    min="0"
                    step="100"
                    placeholder="Ej: 6500"
                    value={singleClassPrice}
                    onChange={(e) => setSingleClassPrice(Number(e.target.value))}
                    className="w-full pl-8 pr-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-black text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2 pt-1">
              <label className="flex items-center space-x-2 cursor-pointer font-semibold text-slate-700">
                <input
                  type="checkbox"
                  checked={allowPrivateBookings}
                  onChange={(e) => setAllowPrivateBookings(e.target.checked)}
                  className="rounded text-brand-olive focus:ring-brand-olive w-4 h-4"
                />
                <span className="flex items-center">
                  <span>Permitir reservas privadas</span>
                  <FieldHelp text="Permite que un alumno reserve la clase completa de forma exclusiva para él o su grupo abonando el valor correspondiente." />
                </span>
              </label>

              <label className="flex items-center space-x-2 cursor-pointer font-semibold text-slate-700">
                <input
                  type="checkbox"
                  checked={allowCustomBookings}
                  onChange={(e) => setAllowCustomBookings(e.target.checked)}
                  className="rounded text-brand-olive focus:ring-brand-olive w-4 h-4"
                />
                <span className="flex items-center">
                  <span>Permitir reservas personalizadas (con profesor adicional)</span>
                  <FieldHelp text="Permite habilitar clases personalizadas o individuales asignando un profesor adicional o tarifa especial." />
                </span>
              </label>
            </div>
          </div>

          {/* Modal Actions Footer */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-brand-olive hover:bg-brand-darkolive text-white text-xs font-extrabold shadow-sm transition-all"
            >
              Crear
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
