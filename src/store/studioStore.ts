// ==============================================================================
// SERMOA FIT / AGENDAFIT NEXT - CENTRAL REACTIVE STORE (ZUSTAND PATTERN / REACT HOOK)
// ==============================================================================

import { useState, useEffect, useSyncExternalStore } from 'react';
import {
  Studio,
  Branch,
  Activity,
  Profile,
  ClassSchedule,
  Booking,
  WaitlistEntry,
  CreditPack,
  PaymentTransaction,
  PaymentMethod,
  AttendanceRecord,
  Routine,
  WhatsAppTemplate,
  UserRole,
} from '../types';
import { toISODateString } from '../utils/date';
import { isWithinGeofence } from '../utils/geo';
import { formatWhatsAppTemplate, openWhatsApp } from '../utils/whatsapp';

const STORAGE_KEY = 'sermoa_app_production_clean_v1';

// Initial Mock Data
const initialStudio: Studio = {
  id: 'studio-1',
  name: 'SERMOA App',
  slug: 'sermoa',
  logo_url: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=150&auto=format&fit=crop&q=80',
  phone: '5491155550199',
  email: 'contacto@sermoa.com',
  description: 'Gestión integral de turnos y actividades para centros de entrenamiento.',
  currency: 'ARS',
  cancellation_window_hours: 2,
  gps_checkin_radius_meters: 75,
  trial_days_remaining: 365,
  plan_tier: 'ENTERPRISE',
  plan_limits: {
    instructors_max: 999,
    active_students_max: 9999,
    branches_max: 99,
  },
  referral_stats: {
    available_balance: 0,
    referred_count: 0,
    target_count: 3,
    link: 'https://sermoa.app',
  },
};

const initialBranches: Branch[] = [
  {
    id: 'branch-1',
    studio_id: 'studio-1',
    name: 'Sede Principal',
    address: 'Av. Libertador 1200, CABA',
    city: 'Buenos Aires',
    phone: '+54 11 5555-0199',
    latitude: -34.5885,
    longitude: -58.4233,
    opening_hours: 'Lun a Vie 07:00 a 21:00 hs | Sáb 09:00 a 14:00 hs',
    is_active: true,
    rooms: [
      { id: 'room-1', branch_id: 'branch-1', name: 'Sala Reformer', capacity: 10 },
      { id: 'room-2', branch_id: 'branch-1', name: 'Sala Mat & Yoga', capacity: 12 },
    ],
  },
];

const initialActivities: Activity[] = [
  {
    id: 'act-1',
    studio_id: 'studio-1',
    name: 'Pilates Reformer',
    description: 'Trabajo integral de tonificación, postura y flexibilidad en reformer.',
    color: '#54875e',
    default_duration_minutes: 60,
  },
  {
    id: 'act-2',
    studio_id: 'studio-1',
    name: 'Yoga Vinyasa Flow',
    description: 'Fluidez, respiración consciente y fuerza postural.',
    color: '#8b5cf6',
    default_duration_minutes: 60,
  },
  {
    id: 'act-3',
    studio_id: 'studio-1',
    name: 'Entrenamiento Funcional',
    description: 'Circuitos de fuerza, estabilidad y capacidad cardiovascular.',
    color: '#f59e0b',
    default_duration_minutes: 50,
  },
];

const initialProfiles: Profile[] = [
  // Administrador Principal del Estudio
  {
    id: 'prof-admin',
    studio_id: 'studio-1',
    role: 'admin',
    status: 'active',
    first_name: 'Jonathan',
    last_name: 'Leguizamon',
    email: 'joni0627@gmail.com',
    phone: '5491155550199',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    credits_balance: 999,
    debt_amount: 0,
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-08-10T00:00:00Z',
    specialties: ['Pilates Reformer Master', 'Biomecánica'],
    commission_per_class: 4500,
  },
];

const todayStr = toISODateString(new Date());

const initialClasses: ClassSchedule[] = [];

const initialBookings: Booking[] = [];

const initialWaitlist: WaitlistEntry[] = [];

const initialCreditPacks: CreditPack[] = [
  {
    id: 'pack-1',
    studio_id: 'studio-1',
    name: 'Pack 8 Clases / Mes',
    description: 'Ideal para entrenar 2 veces por semana. Válido por 30 días.',
    credits_count: 8,
    price: 32000,
    validity_days: 30,
    is_recurring_monthly: true,
    is_active: true,
    popular_badge: true,
  },
  {
    id: 'pack-2',
    studio_id: 'studio-1',
    name: 'Pack 12 Clases / Mes',
    description: 'Ideal para entrenar 3 veces por semana. Máxima flexibilidad.',
    credits_count: 12,
    price: 42000,
    validity_days: 30,
    is_recurring_monthly: true,
    is_active: true,
  },
  {
    id: 'pack-3',
    studio_id: 'studio-1',
    name: 'Clase Suelta / Prueba',
    description: '1 crédito para conocer el estudio o tomar una clase puntual.',
    credits_count: 1,
    price: 6500,
    validity_days: 15,
    is_recurring_monthly: false,
    is_active: true,
  },
];

const initialPayments: PaymentTransaction[] = [];

const initialWhatsAppTemplates: WhatsAppTemplate[] = [
  {
    id: 'wapp-1',
    studio_id: 'studio-1',
    code: 'welcome_approved',
    title: 'Bienvenida & Aprobación de Cuenta',
    template_text: '¡Hola {{nombre}}! 👋 Te damos la bienvenida a {{estudio}}. Tu cuenta ha sido aprobada con éxito ✅. Ya puedes ingresar a reservar tus clases desde este enlace: {{link}} ¡Te esperamos!',
    is_active: true,
  },
  {
    id: 'wapp-2',
    studio_id: 'studio-1',
    code: 'class_reminder',
    title: 'Recordatorio de Clase Hoy',
    template_text: '¡Hola {{nombre}}! 👋 Te recordamos tu clase de *{{clase}}* hoy a las *{{horario}} hs* en *{{sede}}*. Por favor recuerda llegar 5 minutos antes para el check-in. Si necesitas cancelar, hazlo desde: {{link}}',
    is_active: true,
  },
  {
    id: 'wapp-3',
    studio_id: 'studio-1',
    code: 'waitlist_promoted',
    title: 'Cupo Liberado en Lista de Espera',
    template_text: '¡Buenas noticias {{nombre}}! 🎉 Se liberó un cupo para la clase de *{{clase}}* del día *{{fecha}}* a las *{{horario}} hs*. Tu reserva ha sido confirmada automáticamente. ¡Nos vemos en el estudio!',
    is_active: true,
  },
  {
    id: 'wapp-4',
    studio_id: 'studio-1',
    code: 'debt_reminder',
    title: 'Recordatorio de Cuota / Saldo',
    template_text: 'Hola {{nombre}}, te escribimos de {{estudio}} para recordarte que posees un saldo pendiente de ${{monto}}. Puedes abonarlo por transferencia o MercadoPago desde tu panel: {{link}} ¡Muchas gracias!',
    is_active: true,
  },
  {
    id: 'wapp-5',
    studio_id: 'studio-1',
    code: 'booking_confirmed',
    title: 'Confirmación de Turno Reservado',
    template_text: '¡Reserva confirmada {{nombre}}! 🧘‍♀️ Tienes tu lugar guardado para *{{clase}}* el *{{fecha}}* a las *{{horario}} hs* en *{{sede}}*. Tus créditos restantes: {{creditos}}.',
    is_active: true,
  },
];

const initialRoutines: Routine[] = [];

const initialAttendances: AttendanceRecord[] = [];

// Load persisted state or initial
function loadInitialState() {
  const defaultState = {
    studio: initialStudio,
    branches: initialBranches,
    activities: initialActivities,
    profiles: initialProfiles,
    classes: initialClasses,
    bookings: initialBookings,
    waitlist: initialWaitlist,
    creditPacks: initialCreditPacks,
    payments: initialPayments,
    whatsappTemplates: initialWhatsAppTemplates,
    routines: initialRoutines,
    attendances: initialAttendances,
    currentRole: 'admin' as UserRole,
    currentStudentId: 'stu-1', // Alumno activo para simular vista alumno
    currentInstructorId: 'prof-admin',
  };

  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      return {
        ...defaultState,
        ...parsed,
        routines: parsed.routines && parsed.routines.length > 0 ? parsed.routines : initialRoutines,
      };
    } catch (e) {
      console.error('Failed to parse saved state, using initial mock data', e);
    }
  }
  return defaultState;
}

// Global Singleton Reactive Store State
let globalStoreState = loadInitialState();
const storeListeners = new Set<() => void>();

function setGlobalStoreState(updater: any) {
  globalStoreState = typeof updater === 'function' ? updater(globalStoreState) : updater;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(globalStoreState));
  } catch (e) {
    console.error('Failed to save state to localStorage', e);
  }
  storeListeners.forEach((listener) => listener());
}

export function useStudioStore() {
  const state = useSyncExternalStore(
    (callback) => {
      storeListeners.add(callback);
      return () => {
        storeListeners.delete(callback);
      };
    },
    () => globalStoreState
  );

  const setState = setGlobalStoreState;

  // Helpers to get enriched objects
  const getEnrichedClasses = (): ClassSchedule[] => {
    return state.classes.map((cls: ClassSchedule) => {
      const branch = state.branches.find((b: Branch) => b.id === cls.branch_id);
      const room = branch?.rooms?.find((r) => r.id === cls.room_id);
      const activity = state.activities.find((a: Activity) => a.id === cls.activity_id);
      const instructor = state.profiles.find((p: Profile) => p.id === cls.instructor_id);
      const enrolledCount = state.bookings.filter(
        (b: Booking) => b.class_id === cls.id && b.status === 'confirmed'
      ).length;
      const waitlistCount = state.waitlist.filter(
        (w: WaitlistEntry) => w.class_id === cls.id && w.status === 'waiting'
      ).length;

      return {
        ...cls,
        branch,
        room,
        activity,
        instructor,
        enrolled_students_count: enrolledCount,
        waitlist_count: waitlistCount,
      };
    });
  };

  const getEnrichedBookings = (filterDate?: string): Booking[] => {
    return state.bookings
      .filter((b: Booking) => !filterDate || b.booking_date === filterDate)
      .map((b: Booking) => {
        const student = state.profiles.find((p: Profile) => p.id === b.student_id);
        const classItem = getEnrichedClasses().find((c) => c.id === b.class_id);
        return {
          ...b,
          student,
          class_schedule: classItem,
        };
      });
  };

  // Actions
  const setRole = (role: UserRole) => {
    setState((prev: any) => ({ ...prev, currentRole: role }));
  };

  const setCurrentStudentId = (id: string) => {
    setState((prev: any) => ({ ...prev, currentStudentId: id }));
  };

  // Student Registration & Approval
  const submitStudentRegistration = (newStudentData: Partial<Profile>) => {
    const id = `stu-req-${Date.now()}`;
    const newStudent: Profile = {
      id,
      studio_id: state.studio.id,
      role: 'client',
      status: 'pending_approval',
      first_name: newStudentData.first_name || '',
      last_name: newStudentData.last_name || '',
      email: newStudentData.email || '',
      phone: newStudentData.phone || '',
      id_number: newStudentData.id_number || '',
      birth_date: newStudentData.birth_date || '',
      emergency_contact_name: newStudentData.emergency_contact_name || '',
      emergency_contact_phone: newStudentData.emergency_contact_phone || '',
      medical_notes: newStudentData.medical_notes || '',
      has_medical_certificate: !!newStudentData.has_medical_certificate,
      medical_declaration: newStudentData.medical_declaration,
      credits_balance: 0,
      debt_amount: 0,
      preferred_branch_id: newStudentData.preferred_branch_id || state.branches[0]?.id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    setState((prev: any) => ({
      ...prev,
      profiles: [newStudent, ...prev.profiles],
    }));

    return newStudent;
  };

  const approveStudentRegistration = (studentId: string, initialCredits: number = 1) => {
    const student = state.profiles.find((p: Profile) => p.id === studentId);
    if (!student) return;

    setState((prev: any) => ({
      ...prev,
      profiles: prev.profiles.map((p: Profile) =>
        p.id === studentId
          ? {
              ...p,
              status: 'active' as const,
              credits_balance: p.credits_balance + initialCredits,
              updated_at: new Date().toISOString(),
            }
          : p
      ),
    }));

    // Trigger WhatsApp welcome message
    const welcomeTpl = state.whatsappTemplates.find((t: WhatsAppTemplate) => t.code === 'welcome_approved');
    if (welcomeTpl && student.phone) {
      const text = formatWhatsAppTemplate(welcomeTpl.template_text, {
        nombre: student.first_name,
        estudio: state.studio.name,
        link: `${window.location.origin}/#portal-alumno`,
      });
      openWhatsApp(student.phone, text);
    }
  };

  const rejectStudentRegistration = (studentId: string) => {
    setState((prev: any) => ({
      ...prev,
      profiles: prev.profiles.map((p: Profile) =>
        p.id === studentId ? { ...p, status: 'rejected' as const, updated_at: new Date().toISOString() } : p
      ),
    }));
  };

  const addInstructor = (instructorData: {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    password?: string;
    permissions?: {
      view_all_students?: boolean;
      manage_student_credits?: boolean;
      view_all_classes?: boolean;
      create_students?: boolean;
    };
  }) => {
    const id = `inst-${Date.now()}`;
    const newInstructor: Profile = {
      id,
      studio_id: state.studio.id,
      role: 'instructor',
      status: 'active',
      first_name: instructorData.first_name,
      last_name: instructorData.last_name,
      email: instructorData.email,
      phone: instructorData.phone,
      credits_balance: 0,
      debt_amount: 0,
      specialties: ['Pilates Reformer', 'Entrenamiento Funcional'],
      permissions: instructorData.permissions || {
        view_all_students: false,
        manage_student_credits: false,
        view_all_classes: false,
        create_students: false,
      },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    setState((prev: any) => ({
      ...prev,
      profiles: [...prev.profiles, newInstructor],
    }));

    return newInstructor;
  };

  const updateInstructor = (id: string, updatedData: Partial<Profile>) => {
    setState((prev: any) => ({
      ...prev,
      profiles: prev.profiles.map((p: Profile) =>
        p.id === id ? { ...p, ...updatedData, updated_at: new Date().toISOString() } : p
      ),
    }));
  };

  const deleteInstructor = (id: string) => {
    setState((prev: any) => ({
      ...prev,
      profiles: prev.profiles.filter((p: Profile) => p.id !== id),
      classes: prev.classes.map((c: ClassSchedule) =>
        c.instructor_id === id ? { ...c, instructor_id: prev.profiles[0]?.id || '' } : c
      ),
    }));
  };

  // Classes & Bookings Actions
  const createClass = (newClass: Partial<ClassSchedule>) => {
    createClassesBatch([newClass]);
  };

  const createClassesBatch = (newClasses: Partial<ClassSchedule>[]) => {
    const timestamp = Date.now();
    const items: ClassSchedule[] = newClasses.map((nc, idx) => ({
      id: `class-${timestamp}-${idx}`,
      studio_id: state.studio.id,
      branch_id: nc.branch_id || state.branches[0].id,
      room_id: nc.room_id || state.branches[0].rooms[0]?.id || 'room-1',
      activity_id: nc.activity_id || state.activities[0].id,
      instructor_id: nc.instructor_id || state.profiles[0].id,
      title: nc.title || 'Nueva Clase',
      day_of_week: nc.day_of_week ?? new Date().getDay(),
      start_time: nc.start_time || '10:00',
      end_time: nc.end_time || '11:00',
      date: nc.date || todayStr,
      max_capacity: nc.max_capacity || 12,
      is_recurring: nc.is_recurring ?? true,
      is_cancelled: false,
      color: nc.color || '#54875e',
    }));

    setState((prev: any) => ({
      ...prev,
      classes: [...prev.classes, ...items],
    }));
  };

  const deleteClass = (classId: string) => {
    setState((prev: any) => ({
      ...prev,
      classes: prev.classes.filter((c: ClassSchedule) => c.id !== classId),
      bookings: prev.bookings.filter((b: Booking) => b.class_id !== classId),
      waitlist: prev.waitlist.filter((w: WaitlistEntry) => w.class_id !== classId),
    }));
  };

  const bookClass = (classId: string, studentId: string, bookingDate: string = todayStr): { success: boolean; isWaitlist: boolean; message: string } => {
    const student = state.profiles.find((p: Profile) => p.id === studentId);
    const classSchedule = state.classes.find((c: ClassSchedule) => c.id === classId);

    if (!student || !classSchedule) {
      return { success: false, isWaitlist: false, message: 'Datos inválidos.' };
    }

    // Check if already booked
    const existing = state.bookings.find(
      (b: Booking) => b.class_id === classId && b.student_id === studentId && b.booking_date === bookingDate && b.status === 'confirmed'
    );
    if (existing) {
      return { success: false, isWaitlist: false, message: 'Ya tienes una reserva confirmada para esta clase.' };
    }

    // Check capacity
    const currentEnrolled = state.bookings.filter(
      (b: Booking) => b.class_id === classId && b.booking_date === bookingDate && b.status === 'confirmed'
    ).length;

    if (currentEnrolled >= classSchedule.max_capacity) {
      // Add to Waitlist
      const currentWaitlistCount = state.waitlist.filter(
        (w: WaitlistEntry) => w.class_id === classId && w.booking_date === bookingDate && w.status === 'waiting'
      ).length;

      const waitlistEntry: WaitlistEntry = {
        id: `wait-${Date.now()}`,
        class_id: classId,
        student_id: studentId,
        booking_date: bookingDate,
        position: currentWaitlistCount + 1,
        status: 'waiting',
        created_at: new Date().toISOString(),
      };

      setState((prev: any) => ({
        ...prev,
        waitlist: [...prev.waitlist, waitlistEntry],
      }));

      return {
        success: true,
        isWaitlist: true,
        message: `Clase completa. Has ingresado a la Lista de Espera en la posición #${waitlistEntry.position}.`,
      };
    }

    // Check credits
    if (student.credits_balance <= 0) {
      return { success: false, isWaitlist: false, message: 'No dispones de créditos suficientes para reservar esta clase.' };
    }

    // Confirm Booking & Deduct Credit
    const booking: Booking = {
      id: `book-${Date.now()}`,
      class_id: classId,
      student_id: studentId,
      booking_date: bookingDate,
      status: 'confirmed',
      credit_deducted: true,
      created_at: new Date().toISOString(),
    };

    setState((prev: any) => ({
      ...prev,
      bookings: [...prev.bookings, booking],
      profiles: prev.profiles.map((p: Profile) =>
        p.id === studentId ? { ...p, credits_balance: Math.max(0, p.credits_balance - 1) } : p
      ),
    }));

    return { success: true, isWaitlist: false, message: '¡Reserva confirmada con éxito!' };
  };

  const cancelBooking = (bookingId: string) => {
    const booking = state.bookings.find((b: Booking) => b.id === bookingId);
    if (!booking) return;

    // Refund credit
    setState((prev: any) => {
      const updatedBookings = prev.bookings.map((b: Booking) =>
        b.id === bookingId ? { ...b, status: 'cancelled_by_user' as const, cancelled_at: new Date().toISOString() } : b
      );

      const updatedProfiles = prev.profiles.map((p: Profile) =>
        p.id === booking.student_id && booking.credit_deducted ? { ...p, credits_balance: p.credits_balance + 1 } : p
      );

      // Check if there is someone in waitlist to auto-promote
      const nextInWaitlist = prev.waitlist
        .filter((w: WaitlistEntry) => w.class_id === booking.class_id && w.booking_date === booking.booking_date && w.status === 'waiting')
        .sort((a: WaitlistEntry, b: WaitlistEntry) => a.position - b.position)[0];

      let newBookings = updatedBookings;
      let updatedWaitlist = prev.waitlist;

      if (nextInWaitlist) {
        // Promote student to confirmed booking
        const promotedBooking: Booking = {
          id: `book-promoted-${Date.now()}`,
          class_id: booking.class_id,
          student_id: nextInWaitlist.student_id,
          booking_date: booking.booking_date,
          status: 'confirmed',
          credit_deducted: true,
          created_at: new Date().toISOString(),
        };

        newBookings = [...newBookings, promotedBooking];
        updatedWaitlist = prev.waitlist.map((w: WaitlistEntry) =>
          w.id === nextInWaitlist.id ? { ...w, status: 'promoted' as const, promoted_at: new Date().toISOString() } : w
        );

        // Notify promoted student via WhatsApp
        const student = prev.profiles.find((p: Profile) => p.id === nextInWaitlist.student_id);
        const classItem = prev.classes.find((c: ClassSchedule) => c.id === booking.class_id);
        const tpl = prev.whatsappTemplates.find((t: WhatsAppTemplate) => t.code === 'waitlist_promoted');
        if (tpl && student?.phone && classItem) {
          const msg = formatWhatsAppTemplate(tpl.template_text, {
            nombre: student.first_name,
            clase: classItem.title,
            fecha: booking.booking_date,
            horario: classItem.start_time,
          });
          openWhatsApp(student.phone, msg);
        }
      }

      return {
        ...prev,
        bookings: newBookings,
        profiles: updatedProfiles,
        waitlist: updatedWaitlist,
      };
    });
  };

  // Checkin & Attendance (with GPS validation)
  const performQRCheckinWithGPS = (
    studentId: string,
    classId: string,
    userCoords?: { latitude: number; longitude: number }
  ): { success: boolean; message: string; distanceMeters?: number } => {
    const student = state.profiles.find((p: Profile) => p.id === studentId);
    const classSchedule = state.classes.find((c: ClassSchedule) => c.id === classId);
    if (!student || !classSchedule) {
      return { success: false, message: 'Datos no encontrados.' };
    }

    const branch = state.branches.find((b: Branch) => b.id === classSchedule.branch_id);
    let distanceMeters = 0;

    if (userCoords && branch) {
      const geoCheck = isWithinGeofence(
        userCoords.latitude,
        userCoords.longitude,
        branch.latitude,
        branch.longitude,
        state.studio.gps_checkin_radius_meters
      );
      distanceMeters = geoCheck.distanceMeters;

      if (!geoCheck.isInside) {
        return {
          success: false,
          distanceMeters,
          message: `Ubicación fuera de rango: Te encuentras a ${distanceMeters}m de la sucursal (máximo permitido: ${state.studio.gps_checkin_radius_meters}m). Debes estar físicamente en el estudio para registrar asistencia.`,
        };
      }
    }

    // Find or create booking
    let booking = state.bookings.find(
      (b: Booking) => b.class_id === classId && b.student_id === studentId && b.booking_date === todayStr
    );

    const newAttendance: AttendanceRecord = {
      id: `att-${Date.now()}`,
      booking_id: booking?.id || `book-${Date.now()}`,
      student_id: studentId,
      class_id: classId,
      checkin_method: 'qr_gps',
      verified_latitude: userCoords?.latitude,
      verified_longitude: userCoords?.longitude,
      distance_meters: distanceMeters,
      status: 'present',
      timestamp: new Date().toISOString(),
    };

    setState((prev: any) => ({
      ...prev,
      attendances: [newAttendance, ...prev.attendances],
      bookings: booking
        ? prev.bookings.map((b: Booking) => (b.id === booking!.id ? { ...b, status: 'attended' as const } : b))
        : prev.bookings,
    }));

    return {
      success: true,
      distanceMeters,
      message: `¡Asistencia confirmada! Check-in validado exitosamente a ${distanceMeters}m del estudio.`,
    };
  };

  // Roll-Call (Pasar Lista manual)
  const markAttendance = (bookingId: string, status: 'present' | 'late' | 'absent_with_notice' | 'no_show') => {
    const booking = state.bookings.find((b: Booking) => b.id === bookingId);
    if (!booking) return;

    const newAttendance: AttendanceRecord = {
      id: `att-manual-${Date.now()}`,
      booking_id: bookingId,
      student_id: booking.student_id,
      class_id: booking.class_id,
      checkin_method: 'manual_instructor',
      status,
      timestamp: new Date().toISOString(),
    };

    setState((prev: any) => ({
      ...prev,
      attendances: [newAttendance, ...prev.attendances.filter((a: AttendanceRecord) => a.booking_id !== bookingId)],
      bookings: prev.bookings.map((b: Booking) =>
        b.id === bookingId ? { ...b, status: status === 'present' || status === 'late' ? 'attended' : 'no_show' } : b
      ),
    }));
  };

  // Financial Transactions
  const addTransaction = (tx: Partial<PaymentTransaction>) => {
    const newTx: PaymentTransaction = {
      id: `pay-${Date.now()}`,
      studio_id: state.studio.id,
      student_id: tx.student_id,
      student_name: tx.student_name,
      amount: tx.amount || 0,
      payment_type: tx.payment_type || 'income',
      payment_method: tx.payment_method || 'mercadopago',
      concept: tx.concept || 'Cobro de cuota',
      status: 'completed',
      reference_code: tx.reference_code || `TX-${Date.now().toString().slice(-6)}`,
      created_at: new Date().toISOString(),
    };

    setState((prev: any) => ({
      ...prev,
      payments: [newTx, ...prev.payments],
    }));
  };

  // Credit pack purchase
  const purchaseCreditPack = (studentId: string, packId: string, paymentMethod: PaymentMethod = 'mercadopago') => {
    const student = state.profiles.find((p: Profile) => p.id === studentId);
    const pack = state.creditPacks.find((cp: CreditPack) => cp.id === packId);
    if (!student || !pack) return;

    addTransaction({
      student_id: studentId,
      student_name: `${student.first_name} ${student.last_name}`,
      pack_id: packId,
      amount: pack.price,
      payment_type: 'income',
      payment_method: paymentMethod,
      concept: `Compra: ${pack.name}`,
    });

    setState((prev: any) => ({
      ...prev,
      profiles: prev.profiles.map((p: Profile) =>
        p.id === studentId
          ? {
              ...p,
              credits_balance: p.credits_balance + pack.credits_count,
              debt_amount: 0,
            }
          : p
      ),
    }));
  };

  // Settings update
  const updateStudioSettings = (updated: Partial<Studio>) => {
    setState((prev: any) => ({
      ...prev,
      studio: { ...prev.studio, ...updated },
    }));
  };

  const updateWhatsAppTemplate = (id: string, newText: string) => {
    setState((prev: any) => ({
      ...prev,
      whatsappTemplates: prev.whatsappTemplates.map((t: WhatsAppTemplate) =>
        t.id === id ? { ...t, template_text: newText } : t
      ),
    }));
  };

  // Routine Actions
  const createRoutine = (routineData: Partial<Routine>) => {
    const id = `routine-${Date.now()}`;
    const newRoutine: Routine = {
      id,
      studio_id: state.studio.id,
      title: routineData.title || 'Nueva Rutina',
      goal: routineData.goal || 'Entrenamiento general',
      level: routineData.level || 'intermedio',
      duration_minutes: routineData.duration_minutes || 45,
      days_per_week: routineData.days_per_week || 2,
      activity_id: routineData.activity_id || state.activities[0]?.id,
      instructor_id: routineData.instructor_id || state.profiles[0]?.id,
      student_id: routineData.student_id,
      student_ids: routineData.student_ids || (routineData.student_id ? [routineData.student_id] : []),
      exercises: routineData.exercises || [],
      created_at: new Date().toISOString(),
    };

    setState((prev: any) => ({
      ...prev,
      routines: [newRoutine, ...prev.routines],
    }));

    return newRoutine;
  };

  const updateRoutine = (id: string, updatedData: Partial<Routine>) => {
    setState((prev: any) => ({
      ...prev,
      routines: prev.routines.map((r: Routine) =>
        r.id === id ? { ...r, ...updatedData } : r
      ),
    }));
  };

  const deleteRoutine = (id: string) => {
    setState((prev: any) => ({
      ...prev,
      routines: prev.routines.filter((r: Routine) => r.id !== id),
    }));
  };

  // Reset to initial mock data
  const resetToDemoData = () => {
    localStorage.removeItem(STORAGE_KEY);
    setState({
      studio: initialStudio,
      branches: initialBranches,
      activities: initialActivities,
      profiles: initialProfiles,
      classes: initialClasses,
      bookings: initialBookings,
      waitlist: initialWaitlist,
      creditPacks: initialCreditPacks,
      payments: initialPayments,
      whatsappTemplates: initialWhatsAppTemplates,
      routines: initialRoutines,
      attendances: initialAttendances,
      currentRole: 'admin',
      currentStudentId: 'stu-1',
      currentInstructorId: 'prof-admin',
    });
  };

  return {
    studio: state.studio,
    branches: state.branches,
    activities: state.activities,
    profiles: state.profiles,
    classes: state.classes,
    bookings: state.bookings,
    waitlist: state.waitlist,
    creditPacks: state.creditPacks,
    payments: state.payments,
    whatsappTemplates: state.whatsappTemplates,
    routines: state.routines,
    attendances: state.attendances,
    currentRole: state.currentRole,
    currentStudentId: state.currentStudentId,
    currentInstructorId: state.currentInstructorId,
    // Computed Getters
    getEnrichedClasses,
    getEnrichedBookings,
    // Actions
    setRole,
    setCurrentStudentId,
    submitStudentRegistration,
    approveStudentRegistration,
    rejectStudentRegistration,
    addInstructor,
    updateInstructor,
    deleteInstructor,
    createClass,
    createClassesBatch,
    deleteClass,
    bookClass,
    cancelBooking,
    performQRCheckinWithGPS,
    markAttendance,
    addTransaction,
    purchaseCreditPack,
    updateStudioSettings,
    updateWhatsAppTemplate,
    createRoutine,
    updateRoutine,
    deleteRoutine,
    resetToDemoData,
  };
}
