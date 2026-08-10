// ==============================================================================
// DATE & TIME HELPERS (SPANISH LOCALE)
// ==============================================================================

export const DAYS_SPANISH = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
export const DAYS_SPANISH_SHORT = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
export const MONTHS_SPANISH = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

/**
 * Obtiene la fecha en formato YYYY-MM-DD
 */
export function toISODateString(date: Date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/**
 * Formatea una fecha amigablemente (ej: "Lunes 10 de Agosto")
 */
export function formatFriendlyDate(dateStr: string): string {
  const [y, m, d] = dateStr.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  const dayName = DAYS_SPANISH[date.getDay()];
  const monthName = MONTHS_SPANISH[date.getMonth()];
  return `${dayName} ${d} de ${monthName}`;
}

/**
 * Obtiene los días de la semana actual a partir de una fecha dada
 */
export function getWeekDates(baseDate: Date = new Date()): { date: Date; dateStr: string; dayName: string; dayNumber: number; isToday: boolean }[] {
  const current = new Date(baseDate);
  const dayOfWeek = current.getDay(); // 0 is Sunday
  const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek; // Adjust so Monday is first
  
  const monday = new Date(current);
  monday.setDate(current.getDate() + mondayOffset);

  const todayStr = toISODateString(new Date());
  const week = [];

  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    const dateStr = toISODateString(d);
    week.push({
      date: d,
      dateStr,
      dayName: DAYS_SPANISH_SHORT[d.getDay()],
      dayNumber: d.getDate(),
      isToday: dateStr === todayStr,
    });
  }

  return week;
}

/**
 * Valida si la hora actual está dentro de la ventana de checkin permitida para una clase
 * (ej: desde 20 min antes hasta 15 min después del inicio)
 */
export function isCheckinTimeWindowOpen(
  classDateStr: string,
  startTimeStr: string,
  minutesBefore: number = 20,
  minutesAfter: number = 20
): { isOpen: boolean; message: string } {
  const [y, m, d] = classDateStr.split('-').map(Number);
  const [h, min] = startTimeStr.split(':').map(Number);
  
  const classStart = new Date(y, m - 1, d, h, min, 0);
  const windowStart = new Date(classStart.getTime() - minutesBefore * 60000);
  const windowEnd = new Date(classStart.getTime() + minutesAfter * 60000);
  const now = new Date();

  if (now < windowStart) {
    const diffMin = Math.round((windowStart.getTime() - now.getTime()) / 60000);
    return {
      isOpen: false,
      message: `El check-in se habilitará ${diffMin} minutos antes de la clase (${startTimeStr} hs).`,
    };
  }

  if (now > windowEnd) {
    return {
      isOpen: false,
      message: `La ventana de check-in para esta clase (${startTimeStr} hs) ha expirado.`,
    };
  }

  return {
    isOpen: true,
    message: 'Ventana de check-in abierta.',
  };
}
