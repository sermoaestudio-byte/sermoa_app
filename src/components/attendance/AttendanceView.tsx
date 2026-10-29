import React, { useState, useMemo } from 'react';
import {
  ClipboardList,
  CheckCircle2,
  Clock,
  QrCode,
  Users,
  Camera,
  HelpCircle,
  ArrowLeft,
  Calendar,
  User as UserIcon,
  LogIn,
  Check,
  X,
  Search
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useStudioStore } from '../../store/studioStore';
import { toISODateString } from '../../utils/date';
import { Booking, ClassSchedule, Profile, AttendanceRecord } from '../../types';
import { QRScannerModal } from './QRScannerModal';
import { ModuleHelpDrawer } from '../common/ModuleHelpDrawer';

interface AttendanceViewProps {
  onNavigate?: (view: string) => void;
}

export const AttendanceView: React.FC<AttendanceViewProps> = ({ onNavigate }) => {
  const {
    getEnrichedClasses,
    bookings,
    profiles,
    branches,
    attendances,
    markAttendance,
    performQRCheckinWithGPS,
  } = useStudioStore();

  const todayDate = new Date();
  const todayStr = toISODateString(todayDate);

  // Friendly date in Spanish (e.g., "Jueves 29 de octubre")
  const formattedTodayDate = todayDate.toLocaleDateString('es-ES', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).replace(/^\w/, (c) => c.toUpperCase());

  const todayClasses = getEnrichedClasses()
    .filter((c) => {
      if (c.is_cancelled) return false;
      if (!c.is_recurring && c.date !== todayStr) return false;
      if (c.is_recurring && c.day_of_week !== todayDate.getDay()) return false;
      return true;
    })
    .sort((a, b) => a.start_time.localeCompare(b.start_time));

  const [selectedClassId, setSelectedClassId] = useState(todayClasses[0]?.id || '');
  const [showScannerModal, setShowScannerModal] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  // Date filter state: 'today' | '7days' | '30days' | 'custom'
  const [dateFilter, setDateFilter] = useState<'today' | '7days' | '30days' | 'custom'>('today');
  const [customDate, setCustomDate] = useState<string>(todayStr);

  // Student search filter state
  const [studentSearchQuery, setStudentSearchQuery] = useState('');
  const [selectedStudentFilter, setSelectedStudentFilter] = useState<{
    id: string;
    fullName: string;
    code: string;
  } | null>(null);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  // State to track the last scan result for "ÚLTIMO ESCANEO"
  const [lastScanRecord, setLastScanRecord] = useState<{
    studentId: string;
    classId?: string;
    timestamp: string;
    status: 'present';
  } | null>(null);

  const currentClass = todayClasses.find((c) => c.id === selectedClassId) || todayClasses[0];

  // State for detail modal (Foto 2)
  const [selectedDetailItem, setSelectedDetailItem] = useState<{
    studentName: string;
    studentLastName: string;
    studentCode: string;
    className: string;
    fullDateLabel: string;
    turnLabel: string;
    instructorName: string;
    timeLabel: string;
    status: string;
  } | null>(null);

  // Derive all registered attendances (from attendances store or attended bookings)
  const allAttendedList: {
    id: string;
    studentName: string;
    studentLastName: string;
    studentId: string;
    studentCode: string;
    className: string;
    instructorName: string;
    dateTimeLabel: string;
    fullDateLabel: string;
    turnLabel: string;
    timeLabel: string;
    status: string;
    timestamp: string;
    dateStr: string;
  }[] = [];

  // 1. From attendances
  attendances.forEach((att) => {
    const student = profiles.find((p) => p.id === att.student_id);
    const cls = getEnrichedClasses().find((c) => c.id === att.class_id);
    const dateObj = new Date(att.timestamp);
    const timeFormatted = !isNaN(dateObj.getTime())
      ? `${dateObj.getHours().toString().padStart(2, '0')}:${dateObj.getMinutes().toString().padStart(2, '0')} hs`
      : '07:00 hs';

    const dayName = !isNaN(dateObj.getTime())
      ? dateObj.toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'numeric' })
      : todayStr;

    const fullDate = !isNaN(dateObj.getTime())
      ? dateObj.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' }).replace(/^\w/, (c) => c.toUpperCase())
      : formattedTodayDate;

    const itemDateStr = !isNaN(dateObj.getTime()) ? toISODateString(dateObj) : todayStr;
    const turnFormatted = cls ? `${cls.start_time} a ${cls.end_time} hs` : '07:00 a 07:50 hs';

    allAttendedList.push({
      id: att.id,
      studentName: student?.first_name || 'Alumno',
      studentLastName: student?.last_name || '',
      studentId: att.student_id,
      studentCode: att.student_id.slice(-4),
      className: cls?.title || 'Pilates Reformer',
      instructorName: cls?.instructor ? `${cls.instructor.first_name} ${cls.instructor.last_name?.[0] ? cls.instructor.last_name[0] + '.' : ''}` : 'Maira M.',
      dateTimeLabel: `${dayName} • ${cls?.start_time || '07:00'} hs`,
      fullDateLabel: fullDate,
      turnLabel: turnFormatted,
      timeLabel: timeFormatted,
      status: 'Presente',
      timestamp: att.timestamp,
      dateStr: itemDateStr,
    });
  });

  // 2. From bookings marked attended if not already in attendances
  bookings
    .filter((b) => b.status === 'attended')
    .forEach((b) => {
      const alreadyAdded = allAttendedList.some((item) => item.studentId === b.student_id);
      if (!alreadyAdded) {
        const student = profiles.find((p) => p.id === b.student_id);
        const cls = getEnrichedClasses().find((c) => c.id === b.class_id);
        const dateFormatted = b.booking_date || todayStr;
        const turnFormatted = cls ? `${cls.start_time} a ${cls.end_time} hs` : '07:00 a 07:50 hs';
        allAttendedList.push({
          id: b.id,
          studentName: student?.first_name || 'Alumno',
          studentLastName: student?.last_name || '',
          studentId: b.student_id,
          studentCode: b.student_id.slice(-4),
          className: cls?.title || 'Pilates Reformer',
          instructorName: cls?.instructor ? `${cls.instructor.first_name} ${cls.instructor.last_name?.[0] ? cls.instructor.last_name[0] + '.' : ''}` : 'Maira M.',
          dateTimeLabel: `${dateFormatted} • ${cls?.start_time || '07:00'} hs`,
          fullDateLabel: formattedTodayDate,
          turnLabel: turnFormatted,
          timeLabel: `${cls?.start_time || '07:00'} hs`,
          status: 'Presente',
          timestamp: b.created_at || new Date().toISOString(),
          dateStr: b.booking_date || todayStr,
        });
      }
    });

  // Fallback demo rows to ensure the screen matches the visual demonstration if no DB data exists
  if (allAttendedList.length === 0) {
    allAttendedList.push(
      {
        id: 'demo-1',
        studentName: 'Paz',
        studentLastName: 'Rosas',
        studentId: '0124',
        studentCode: '0124',
        className: 'Pilates Reformer',
        instructorName: 'Maira M.',
        dateTimeLabel: 'jue, 29/10 • 08:00 hs',
        fullDateLabel: 'Jueves, 29 de octubre',
        turnLabel: '07:00 a 07:50 hs',
        timeLabel: '15:26 hs',
        status: 'Presente',
        timestamp: new Date().toISOString(),
        dateStr: todayStr,
      },
      {
        id: 'demo-2',
        studentName: 'Chloe',
        studentLastName: 'Tolosa Gonzalez',
        studentId: '0289',
        studentCode: '0289',
        className: 'Pilates Reformer',
        instructorName: 'Maira M.',
        dateTimeLabel: 'jue, 29/10 • 08:00 hs',
        fullDateLabel: 'Jueves, 29 de octubre',
        turnLabel: '08:00 a 08:50 hs',
        timeLabel: '07:55 hs',
        status: 'Presente',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        dateStr: todayStr,
      },
      {
        id: 'demo-3',
        studentName: 'Camila',
        studentLastName: 'Fernández',
        studentId: '0248',
        studentCode: '0248',
        className: 'Pilates Reformer',
        instructorName: 'Maira M.',
        dateTimeLabel: 'jue, 29/10 • 07:00 hs',
        fullDateLabel: 'Jueves, 29 de octubre',
        turnLabel: '07:00 a 07:50 hs',
        timeLabel: '06:56 hs',
        status: 'Presente',
        timestamp: new Date(Date.now() - 7200000).toISOString(),
        dateStr: todayStr,
      },
      {
        id: 'demo-4',
        studentName: 'Valentina',
        studentLastName: 'López',
        studentId: '0189',
        studentCode: '0189',
        className: 'Pilates Reformer',
        instructorName: 'Maira M.',
        dateTimeLabel: 'jue, 29/10 • 07:00 hs',
        fullDateLabel: 'Jueves, 29 de octubre',
        turnLabel: '07:00 a 07:50 hs',
        timeLabel: '07:02 hs',
        status: 'Presente',
        timestamp: new Date(Date.now() - 10800000).toISOString(),
        dateStr: todayStr,
      },
      {
        id: 'demo-5',
        studentName: 'Martina',
        studentLastName: 'Silva',
        studentId: '0312',
        studentCode: '0312',
        className: 'Pilates Reformer',
        instructorName: 'Maira M.',
        dateTimeLabel: 'jue, 29/10 • 08:00 hs',
        fullDateLabel: 'Jueves, 29 de octubre',
        turnLabel: '08:00 a 08:50 hs',
        timeLabel: '08:00 hs',
        status: 'Presente',
        timestamp: new Date(Date.now() - 14400000).toISOString(),
        dateStr: todayStr,
      },
      {
        id: 'demo-6',
        studentName: 'Sofía',
        studentLastName: 'Benítez',
        studentId: '0419',
        studentCode: '0419',
        className: 'Pilates Reformer',
        instructorName: 'Maira M.',
        dateTimeLabel: 'Ayer • 18:00 hs',
        fullDateLabel: 'Miércoles, 28 de octubre',
        turnLabel: '18:00 a 18:50 hs',
        timeLabel: '17:55 hs',
        status: 'Presente',
        timestamp: new Date(Date.now() - 86400000).toISOString(),
        dateStr: toISODateString(new Date(Date.now() - 86400000)),
      },
      {
        id: 'demo-7',
        studentName: 'Agustina',
        studentLastName: 'Romero',
        studentId: '0522',
        studentCode: '0522',
        className: 'Pilates Reformer',
        instructorName: 'Maira M.',
        dateTimeLabel: 'Hace 3 días • 10:00 hs',
        fullDateLabel: 'Lunes, 26 de octubre',
        turnLabel: '10:00 a 10:50 hs',
        timeLabel: '09:58 hs',
        status: 'Presente',
        timestamp: new Date(Date.now() - 86400000 * 3).toISOString(),
        dateStr: toISODateString(new Date(Date.now() - 86400000 * 3)),
      }
    );
  }

  // Real student list from profiles (client role)
  const allStudents = useMemo(() => {
    return profiles
      .filter((p) => p.role === 'client' && p.status === 'active')
      .map((p) => ({
        id: p.id,
        firstName: p.first_name,
        lastName: p.last_name,
        fullName: `${p.first_name} ${p.last_name}`,
        code: p.id.slice(-4),
        phone: p.phone,
      }));
  }, [profiles]);

  // Search suggestions: filter while typing (minimum 1 char)
  const studentSuggestions = useMemo(() => {
    const q = studentSearchQuery.trim().toLowerCase();
    if (!q) return [];
    return allStudents
      .filter((s) => s.fullName.toLowerCase().includes(q))
      .slice(0, 6);
  }, [allStudents, studentSearchQuery]);

  // Filter assistances according to selected date filter and student filter
  const filteredAttendances = allAttendedList.filter((item) => {
    // 1. Student filter
    if (selectedStudentFilter) {
      const matchId = item.studentId === selectedStudentFilter.id;
      const matchName = `${item.studentName} ${item.studentLastName}`.toLowerCase() === selectedStudentFilter.fullName.toLowerCase();
      if (!matchId && !matchName) return false;
    } else if (studentSearchQuery.trim()) {
      const q = studentSearchQuery.trim().toLowerCase();
      const studentFullName = `${item.studentName} ${item.studentLastName}`.toLowerCase();
      if (!studentFullName.includes(q)) return false;
    }

    // 2. Date filter (if a specific student is selected, we can still allow date ranges or show their full history)
    const itemDate = new Date(item.timestamp);
    const now = new Date();

    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const itemDayTime = new Date(itemDate.getFullYear(), itemDate.getMonth(), itemDate.getDate()).getTime();

    if (dateFilter === 'today') {
      return item.dateStr === todayStr || itemDayTime === startOfToday;
    }
    if (dateFilter === '7days') {
      const sevenDaysAgo = startOfToday - 7 * 24 * 60 * 60 * 1000;
      return itemDayTime >= sevenDaysAgo && itemDayTime <= startOfToday + 24 * 60 * 60 * 1000;
    }
    if (dateFilter === '30days') {
      const thirtyDaysAgo = startOfToday - 30 * 24 * 60 * 60 * 1000;
      return itemDayTime >= thirtyDaysAgo && itemDayTime <= startOfToday + 24 * 60 * 60 * 1000;
    }
    if (dateFilter === 'custom') {
      return item.dateStr === customDate;
    }
    return true;
  });

  // Single unified list of attendances
  const remainingAttendances = filteredAttendances;

  const handleScanSuccess = (studentId: string) => {
    setShowScannerModal(false);
    const stu = profiles.find((p) => p.id === studentId);
    const activeClass = currentClass || todayClasses[0];

    // Find if student has booking
    const studentBooking = bookings.find(
      (b) => b.student_id === studentId && b.class_id === activeClass?.id
    );

    if (studentBooking) {
      markAttendance(studentBooking.id, 'present');
    } else if (activeClass) {
      performQRCheckinWithGPS(studentId, activeClass.id);
    }

    setLastScanRecord({
      studentId,
      classId: activeClass?.id,
      timestamp: new Date().toISOString(),
      status: 'present',
    });

    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.7 },
    });
  };

  return (
    <div className="py-6 sm:py-8 animate-fade-in font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
          <div className="flex items-start space-x-3">
            {onNavigate && (
              <button
                onClick={() => onNavigate('dashboard')}
                className="p-2.5 bg-white border border-stone-200 hover:bg-stone-50 text-stone-700 rounded-2xl shadow-xs transition-colors shrink-0 mt-0.5"
                title="Volver al Inicio"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}
            <div>
              <div className="flex items-center space-x-2 text-[11px] font-bold uppercase tracking-wider text-stone-500 mb-1">
                <ClipboardList className="w-3.5 h-3.5 text-stone-600" />
                <span>OPERATIVA DIARIA</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
                Control de Asistencia
              </h1>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-3">

            <div className="flex items-center space-x-2.5">
              <button
                onClick={() => setShowHelp(true)}
                className="inline-flex items-center space-x-1.5 px-3.5 py-2 bg-white hover:bg-stone-50 text-stone-700 border border-stone-200 rounded-xl text-xs font-semibold shadow-xs transition-all"
                title="Ver ayuda"
              >
                <HelpCircle className="w-4 h-4 text-stone-400" />
                <span>Ayuda</span>
              </button>

              <button
                onClick={() => setShowScannerModal(true)}
                className="inline-flex items-center space-x-2 px-4 py-2.5 bg-[#405342] hover:bg-[#344436] text-white rounded-xl text-xs font-bold shadow-sm transition-all"
              >
                <Camera className="w-4 h-4" />
                <span>Escanear QR Alumno</span>
              </button>
            </div>
          </div>
        </div>

        {/* Sección: Consultar historial por alumno */}
        <div className="bg-white rounded-3xl border border-stone-200/80 p-5 sm:p-6 shadow-sm mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
            <div>
              <h2 className="text-sm font-bold text-stone-900 tracking-tight">
                Consultar historial por alumno
              </h2>
              <p className="text-xs text-stone-500">
                Buscá un alumno para consultar sus asistencias registradas
              </p>
            </div>
            {selectedStudentFilter && (
              <button
                onClick={() => {
                  setSelectedStudentFilter(null);
                  setStudentSearchQuery('');
                }}
                className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold self-start sm:self-auto transition-colors"
                title="Quitar filtro de alumno"
              >
                <span>Limpiar filtro de alumno</span>
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Search Input Container with Dropdown Suggestions */}
          <div className="relative">
            <div className="relative flex items-center">
              <Search className="w-4 h-4 text-stone-400 absolute left-4 pointer-events-none" />
              <input
                type="text"
                value={selectedStudentFilter ? selectedStudentFilter.fullName : studentSearchQuery}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => {
                  // Delay so clicks on dropdown items are registered
                  setTimeout(() => setIsSearchFocused(false), 200);
                }}
                onChange={(e) => {
                  if (selectedStudentFilter) {
                    setSelectedStudentFilter(null);
                  }
                  setStudentSearchQuery(e.target.value);
                }}
                placeholder="Buscar alumno por nombre y apellido..."
                className="w-full pl-11 pr-10 py-3 bg-stone-50/70 hover:bg-stone-50 focus:bg-white border border-stone-200/90 focus:border-[#54875e] rounded-2xl text-xs font-medium text-stone-800 placeholder-stone-400 transition-all focus:outline-none focus:ring-2 focus:ring-[#54875e]/20"
              />
              {(studentSearchQuery || selectedStudentFilter) && (
                <button
                  onClick={() => {
                    setStudentSearchQuery('');
                    setSelectedStudentFilter(null);
                  }}
                  className="absolute right-3.5 p-1 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-200/60 transition-colors"
                  title="Borrar búsqueda"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Suggestions Dropdown */}
            {isSearchFocused && studentSearchQuery.trim().length > 0 && !selectedStudentFilter && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl border border-stone-200 shadow-xl overflow-hidden z-30 animate-fade-in divide-y divide-stone-100">
                {studentSuggestions.length > 0 ? (
                  studentSuggestions.map((stu) => (
                    <div
                      key={stu.id}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        setSelectedStudentFilter({
                          id: stu.id,
                          fullName: stu.fullName,
                          code: stu.code,
                        });
                        setStudentSearchQuery('');
                        setIsSearchFocused(false);
                      }}
                      className="px-4 py-3 hover:bg-stone-50 cursor-pointer flex items-center justify-between transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center text-stone-500 font-bold text-xs shrink-0">
                          {stu.firstName[0]}{stu.lastName[0]}
                        </div>
                        <div>
                          <div className="text-xs font-bold text-stone-900">
                            {stu.fullName}
                          </div>
                          <div className="text-[11px] text-stone-400">
                            Alumno #{stu.code} {stu.phone ? `• ${stu.phone}` : ''}
                          </div>
                        </div>
                      </div>
                      <span className="text-[11px] font-semibold text-[#54875e] bg-[#54875e]/10 px-2.5 py-1 rounded-lg">
                        Ver historial
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="px-4 py-4 text-xs text-stone-400 text-center">
                    No se encontraron alumnos con "{studentSearchQuery}"
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Active Filter Pill */}
          {selectedStudentFilter && (
            <div className="mt-3 inline-flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200/60 text-emerald-900 text-xs">
              <span className="font-semibold">Filtrando por alumno:</span>
              <span className="font-bold">{selectedStudentFilter.fullName}</span>
              <span className="text-emerald-700/70">#{selectedStudentFilter.code}</span>
            </div>
          )}
        </div>

        {/* Panel "Últimas asistencias" */}
        <div className="bg-white rounded-3xl border border-stone-200/80 p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h3 className="text-base font-bold text-stone-900">
                Últimas asistencias
              </h3>
              <p className="text-xs text-stone-400 mt-0.5">
                {dateFilter === 'today' && 'Mostrando asistencias registradas del día de hoy'}
                {dateFilter === '7days' && 'Mostrando asistencias de los últimos 7 días'}
                {dateFilter === '30days' && 'Mostrando asistencias de los últimos 30 días'}
                {dateFilter === 'custom' && `Mostrando asistencias del ${customDate}`}
              </p>
            </div>

            {/* Date Filters Controls: HOY, 7 DÍAS, 30 DÍAS + Calendario */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex p-1 bg-stone-100/80 rounded-2xl border border-stone-200/60">
                <button
                  onClick={() => setDateFilter('today')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${dateFilter === 'today'
                    ? 'bg-white text-stone-900 shadow-xs'
                    : 'text-stone-500 hover:text-stone-800'
                    }`}
                >
                  HOY
                </button>
                <button
                  onClick={() => setDateFilter('7days')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${dateFilter === '7days'
                    ? 'bg-white text-stone-900 shadow-xs'
                    : 'text-stone-500 hover:text-stone-800'
                    }`}
                >
                  7 DÍAS
                </button>
                <button
                  onClick={() => setDateFilter('30days')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${dateFilter === '30days'
                    ? 'bg-white text-stone-900 shadow-xs'
                    : 'text-stone-500 hover:text-stone-800'
                    }`}
                >
                  30 DÍAS
                </button>
              </div>

              {/* Custom Date Picker (Calendario) */}
              <div className="relative inline-flex items-center">
                <div
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-2xl border text-xs font-semibold transition-all ${dateFilter === 'custom'
                    ? 'bg-[#54875e]/10 border-[#54875e] text-[#405342] ring-1 ring-[#54875e]/30'
                    : 'bg-white border-stone-200 text-stone-600 hover:border-stone-300'
                    }`}
                >
                  <Calendar className="w-3.5 h-3.5 text-stone-500 shrink-0" />
                  <input
                    type="date"
                    value={customDate}
                    onChange={(e) => {
                      if (e.target.value) {
                        setCustomDate(e.target.value);
                        setDateFilter('custom');
                      }
                    }}
                    className="bg-transparent border-none text-xs font-semibold text-stone-700 focus:outline-none cursor-pointer"
                    title="Seleccionar fecha en el calendario"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-stone-100 text-[10px] font-bold text-stone-400 uppercase tracking-wider">
                  <th className="pb-3 pr-4 font-semibold">ALUMNO</th>
                  <th className="pb-3 px-4 font-semibold">CLASE</th>
                  <th className="pb-3 px-4 font-semibold">FECHA / HORA</th>
                  <th className="pb-3 pl-4 text-right font-semibold">ESTADO</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {remainingAttendances.length > 0 ? (
                  remainingAttendances.map((item) => (
                    <tr
                      key={item.id}
                      onClick={() =>
                        setSelectedDetailItem({
                          studentName: item.studentName,
                          studentLastName: item.studentLastName,
                          studentCode: item.studentCode,
                          className: item.className,
                          fullDateLabel: item.fullDateLabel,
                          turnLabel: item.turnLabel,
                          instructorName: item.instructorName,
                          timeLabel: item.timeLabel,
                          status: item.status,
                        })
                      }
                      className="hover:bg-stone-50/80 cursor-pointer transition-colors group"
                      title="Ver detalle de asistencia"
                    >
                      <td className="py-4 pr-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-7 h-7 rounded-full bg-stone-100 group-hover:bg-stone-200/80 flex items-center justify-center text-stone-400 shrink-0 transition-colors">
                            <UserIcon className="w-4 h-4" />
                          </div>
                          <span className="font-bold text-stone-800 group-hover:text-stone-950 transition-colors">
                            {item.studentName} {item.studentLastName}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-stone-600 font-medium">
                        {item.className}
                      </td>
                      <td className="py-4 px-4 text-stone-500">
                        {item.dateTimeLabel}
                      </td>
                      <td className="py-4 pl-4 text-right">
                        <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-bold">
                          <Check className="w-3 h-3 stroke-[2.5]" />
                          <span>Presente</span>
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-stone-400">
                      No hay registros adicionales de asistencias registradas.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal Detalle de Asistencia (Foto 2) */}
        {selectedDetailItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-fade-in">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-stone-200/80 relative animate-scale-in">
              {/* Close Button */}
              <button
                onClick={() => setSelectedDetailItem(null)}
                className="absolute top-5 right-5 p-2 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-100 transition-colors"
                title="Cerrar"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Student Header */}
              <div className="flex items-center space-x-3.5 mb-6 pr-8">
                <div className="w-12 h-12 rounded-full bg-stone-100 border border-stone-200/80 flex items-center justify-center text-stone-500 shrink-0 shadow-inner">
                  <UserIcon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-stone-900 leading-tight">
                    {selectedDetailItem.studentName} {selectedDetailItem.studentLastName}
                  </h3>
                  <div className="flex items-center space-x-2 mt-0.5">
                    <span className="text-xs text-stone-400 font-medium">
                      Alumno #{selectedDetailItem.studentCode}
                    </span>
                    <span className="text-stone-300">•</span>
                    <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold">
                      <Check className="w-3 h-3 stroke-[2.5]" />
                      <span>{selectedDetailItem.status}</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Information Card exactly matching Foto 2 */}
              <div className="bg-white rounded-2xl border border-stone-100 shadow-xs divide-y divide-stone-100 text-xs">
                
                {/* CLASE DE HOY */}
                <div className="flex items-center justify-between py-3.5 px-4 sm:px-5">
                  <span className="flex items-center space-x-2.5 text-stone-500 font-semibold tracking-wider uppercase text-[11px]">
                    <Users className="w-4 h-4 text-stone-400" />
                    <span>CLASE DE HOY</span>
                  </span>
                  <span className="font-bold text-stone-900 text-sm">
                    {selectedDetailItem.className}
                  </span>
                </div>

                {/* FECHA */}
                <div className="flex items-center justify-between py-3.5 px-4 sm:px-5">
                  <span className="flex items-center space-x-2.5 text-stone-500 font-semibold tracking-wider uppercase text-[11px]">
                    <Calendar className="w-4 h-4 text-stone-400" />
                    <span>FECHA</span>
                  </span>
                  <span className="font-medium text-stone-800 text-sm">
                    {selectedDetailItem.fullDateLabel}
                  </span>
                </div>

                {/* TURNO */}
                <div className="flex items-center justify-between py-3.5 px-4 sm:px-5">
                  <span className="flex items-center space-x-2.5 text-stone-500 font-semibold tracking-wider uppercase text-[11px]">
                    <Clock className="w-4 h-4 text-stone-400" />
                    <span>TURNO</span>
                  </span>
                  <span className="font-medium text-stone-800 text-sm">
                    {selectedDetailItem.turnLabel}
                  </span>
                </div>

                {/* PROFESORA */}
                <div className="flex items-center justify-between py-3.5 px-4 sm:px-5">
                  <span className="flex items-center space-x-2.5 text-stone-500 font-semibold tracking-wider uppercase text-[11px]">
                    <UserIcon className="w-4 h-4 text-stone-400" />
                    <span>PROFESORA</span>
                  </span>
                  <span className="font-medium text-stone-800 text-sm">
                    {selectedDetailItem.instructorName}
                  </span>
                </div>

                {/* INGRESO */}
                <div className="flex items-center justify-between py-3.5 px-4 sm:px-5">
                  <span className="flex items-center space-x-2.5 text-stone-500 font-semibold tracking-wider uppercase text-[11px]">
                    <LogIn className="w-4 h-4 text-stone-400" />
                    <span>INGRESO</span>
                  </span>
                  <span className="font-bold text-stone-900 text-sm">
                    {selectedDetailItem.timeLabel}
                  </span>
                </div>

              </div>

              {/* Modal Footer */}
              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setSelectedDetailItem(null)}
                  className="px-5 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-bold transition-colors"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* QR Camera Scanner Modal */}
        {showScannerModal && (
          <QRScannerModal
            onClose={() => setShowScannerModal(false)}
            onScanSuccess={handleScanSuccess}
          />
        )}

        {/* Module Auto-Help Drawer */}
        <ModuleHelpDrawer
          isOpen={showHelp}
          moduleId="attendance"
          onClose={() => setShowHelp(false)}
        />

      </div>
    </div>
  );
};

