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
  AttendanceStatus,
  CheckinMethod,
  Routine,
  WhatsAppTemplate,
  UserRole,
  FinancialCategory,
  FinancialMonthlyGoals,
} from '../types';
import { toISODateString } from '../utils/date';
import { isWithinGeofence } from '../utils/geo';
import { formatWhatsAppTemplate, openWhatsApp } from '../utils/whatsapp';
import { getPortalLink } from '../utils/links';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

const STORAGE_KEY = 'sermoa_app_clean_v4';

// Helper to generate RFC4122 compliant UUID v4 for PostgreSQL / Supabase
export function generateUUID(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// Initial UUIDs
const DEFAULT_STUDIO_ID = '11111111-1111-4111-8111-111111111111';
const DEFAULT_BRANCH_ID = '22222222-2222-4222-8222-222222222222';
const DEFAULT_ADMIN_ID = '33333333-3333-4333-8333-333333333333';

const initialStudio: Studio = {
  id: DEFAULT_STUDIO_ID,
  name: 'SERMOA App',
  slug: 'sermoa',
  logo_url: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=150&auto=format&fit=crop&q=80',
  brand_colors: {
    primary: '#4d5d43',
    secondary: '#2d3827',
    accent: '#738a65',
  },
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

const initialBranches: Branch[] = [];

const initialActivities: Activity[] = [
  {
    id: generateUUID(),
    studio_id: DEFAULT_STUDIO_ID,
    name: 'Pilates Reformer',
    description: 'Trabajo integral de tonificación, postura y flexibilidad en reformer.',
    color: '#4d5d43',
    default_duration_minutes: 60,
  },
  {
    id: generateUUID(),
    studio_id: DEFAULT_STUDIO_ID,
    name: 'Yoga Vinyasa Flow',
    description: 'Fluidez, respiración consciente y fuerza postural.',
    color: '#8b5cf6',
    default_duration_minutes: 60,
  },
  {
    id: generateUUID(),
    studio_id: DEFAULT_STUDIO_ID,
    name: 'Entrenamiento Funcional',
    description: 'Circuitos de fuerza, estabilidad y capacidad cardiovascular.',
    color: '#f59e0b',
    default_duration_minutes: 50,
  },
];

const initialProfiles: Profile[] = [
  {
    id: DEFAULT_ADMIN_ID,
    studio_id: DEFAULT_STUDIO_ID,
    role: 'admin',
    status: 'active',
    first_name: 'Jonathan',
    last_name: 'Leguizamon',
    email: 'joni0627@gmail.com',
    phone: '3512409232',
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
    id: generateUUID(),
    studio_id: DEFAULT_STUDIO_ID,
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
    id: generateUUID(),
    studio_id: DEFAULT_STUDIO_ID,
    name: 'Pack 12 Clases / Mes',
    description: 'Ideal para entrenar 3 veces por semana. Máxima flexibilidad.',
    credits_count: 12,
    price: 42000,
    validity_days: 30,
    is_recurring_monthly: true,
    is_active: true,
  },
  {
    id: generateUUID(),
    studio_id: DEFAULT_STUDIO_ID,
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
    id: generateUUID(),
    studio_id: DEFAULT_STUDIO_ID,
    code: 'welcome_approved',
    title: 'Bienvenida & Aprobación de Cuenta',
    template_text: '¡Hola {{nombre}}! 👋 Te damos la bienvenida a {{estudio}}. Tu cuenta ha sido aprobada con éxito ✅. Ya puedes ingresar a reservar tus clases desde este enlace: {{link}} ¡Te esperamos!',
    is_active: true,
  },
  {
    id: generateUUID(),
    studio_id: DEFAULT_STUDIO_ID,
    code: 'class_reminder',
    title: 'Recordatorio de Clase Hoy',
    template_text: '¡Hola {{nombre}}! 👋 Te recordamos tu clase de *{{clase}}* hoy a las *{{horario}} hs* en *{{sede}}*. Por favor recuerda llegar 5 minutos antes para el check-in. Si necesitas cancelar, hazlo desde: {{link}}',
    is_active: true,
  },
  {
    id: generateUUID(),
    studio_id: DEFAULT_STUDIO_ID,
    code: 'waitlist_promoted',
    title: 'Cupo Liberado en Lista de Espera',
    template_text: '¡Buenas noticias {{nombre}}! 🎉 Se liberó un cupo para la clase de *{{clase}}* del día *{{fecha}}* a las *{{horario}} hs*. Tu reserva ha sido confirmada automáticamente. ¡Nos vemos en el estudio!',
    is_active: true,
  },
  {
    id: generateUUID(),
    studio_id: DEFAULT_STUDIO_ID,
    code: 'debt_reminder',
    title: 'Recordatorio de Cuota / Saldo',
    template_text: 'Hola {{nombre}}, te escribimos de {{estudio}} para recordarte que posees un saldo pendiente de ${{monto}}. Puedes abonarlo por transferencia o MercadoPago desde tu panel: {{link}} ¡Muchas gracias!',
    is_active: true,
  },
];

const initialRoutines: Routine[] = [];
const initialAttendances: AttendanceRecord[] = [];

const initialFinancialCategories: FinancialCategory[] = [
  { id: generateUUID(), studio_id: DEFAULT_STUDIO_ID, name: 'Alquiler', type: 'expense', color: '#6366f1', is_active: true },
  { id: generateUUID(), studio_id: DEFAULT_STUDIO_ID, name: 'Sueldos Profesores', type: 'expense', color: '#a855f7', is_active: true },
  { id: generateUUID(), studio_id: DEFAULT_STUDIO_ID, name: 'Servicios (Luz, Agua, Internet)', type: 'expense', color: '#06b6d4', is_active: true },
  { id: generateUUID(), studio_id: DEFAULT_STUDIO_ID, name: 'Mantenimiento & Reformers', type: 'expense', color: '#f59e0b', is_active: true },
  { id: generateUUID(), studio_id: DEFAULT_STUDIO_ID, name: 'Marketing & Publicidad', type: 'expense', color: '#ec4899', is_active: true },
  { id: generateUUID(), studio_id: DEFAULT_STUDIO_ID, name: 'Venta de Pack / Membresía', type: 'income', color: '#10b981', is_active: true },
  { id: generateUUID(), studio_id: DEFAULT_STUDIO_ID, name: 'Clase Suelta / Prueba', type: 'income', color: '#3b82f6', is_active: true },
  { id: generateUUID(), studio_id: DEFAULT_STUDIO_ID, name: 'Ingreso manual', type: 'income', color: '#10b981', is_active: true },
];

const initialFinancialGoals: FinancialMonthlyGoals = {
  id: generateUUID(),
  studio_id: DEFAULT_STUDIO_ID,
  month: new Date().getMonth() + 1,
  year: new Date().getFullYear(),
  avg_class_price: 9000,
  operational_be_amount: 0,
  cash_be_amount: 0,
  target_sales_amount: 2300000,
  operating_days: 24,
};

// Global Memory State
let state: any = {
  studio: initialStudio,
  branches: initialBranches,
  activities: initialActivities,
  profiles: initialProfiles,
  classes: initialClasses,
  bookings: initialBookings,
  waitlist: initialWaitlist,
  creditPacks: initialCreditPacks,
  payments: initialPayments,
  financialCategories: initialFinancialCategories,
  financialGoals: initialFinancialGoals,
  whatsappTemplates: initialWhatsAppTemplates,
  routines: initialRoutines,
  attendances: initialAttendances,
  isAuthenticated: false,
  currentUser: null as Profile | null,
  currentRole: 'admin' as UserRole,
  currentStudentId: DEFAULT_ADMIN_ID,
  currentInstructorId: DEFAULT_ADMIN_ID,
};

// Load saved local cache on first load
try {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    const parsed = JSON.parse(saved);
    state = { ...state, ...parsed };
  }
} catch (e) {
  console.warn('Could not read state from localStorage', e);
}

const listeners = new Set<() => void>();

function setState(updater: any) {
  const nextState = typeof updater === 'function' ? updater(state) : updater;
  state = nextState;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.warn('Could not persist state to localStorage', e);
  }
  listeners.forEach((l) => l());
}

// Background Synchronization from Supabase
let isSyncing = false;
async function syncFromSupabase() {
  if (!isSupabaseConfigured || isSyncing) return;
  isSyncing = true;

  try {
    // 1. Studio check & seed
    const { data: studiosData, error: studioErr } = await supabase.from('studios').select('*').limit(1);
    let currentStudio = state.studio;
    if (!studioErr && studiosData && studiosData.length > 0) {
      currentStudio = { ...state.studio, ...studiosData[0] };
    } else {
      await supabase.from('studios').upsert({
        id: state.studio.id,
        name: state.studio.name,
        slug: state.studio.slug,
        brand_colors: state.studio.brand_colors,
        phone: state.studio.phone,
        email: state.studio.email,
        is_active: true,
      });
    }

    // 2. Fetch Profiles
    const { data: profilesData } = await supabase.from('profiles').select('*');
    // 3. Fetch Branches
    const { data: branchesData } = await supabase.from('branches').select('*');
    // 4. Fetch Activities
    const { data: activitiesData } = await supabase.from('activities').select('*');
    // 5. Fetch Classes
    const { data: classesData } = await supabase.from('classes').select('*');
    // 6. Fetch Credit Packs
    const { data: packsData } = await supabase.from('credit_packs').select('*');
    // 7. Fetch Bookings
    const { data: bookingsData } = await supabase.from('bookings').select('*');
    // 8. Fetch Attendances
    const { data: attendancesData } = await supabase.from('attendances').select('*');
    // 9. Fetch Payments
    const { data: paymentsData } = await supabase.from('payments').select('*').order('created_at', { ascending: false });
    // 10. Fetch Categories
    const { data: categoriesData } = await supabase.from('financial_categories').select('*');
    // 11. Fetch Goals
    const { data: goalsData } = await supabase.from('financial_monthly_goals').select('*').limit(1);

    setState((prev: any) => ({
      ...prev,
      studio: currentStudio || prev.studio,
      profiles: profilesData && profilesData.length > 0 ? profilesData : prev.profiles,
      branches: branchesData && branchesData.length > 0 ? branchesData : prev.branches,
      activities: activitiesData && activitiesData.length > 0 ? activitiesData : prev.activities,
      classes: classesData && classesData.length > 0 ? classesData : prev.classes,
      creditPacks: packsData && packsData.length > 0 ? packsData : prev.creditPacks,
      bookings: bookingsData && bookingsData.length > 0 ? bookingsData : prev.bookings,
      attendances: attendancesData && attendancesData.length > 0 ? attendancesData : prev.attendances,
      payments: paymentsData && paymentsData.length > 0 ? paymentsData : prev.payments,
      financialCategories: categoriesData && categoriesData.length > 0 ? categoriesData : prev.financialCategories,
      financialGoals: goalsData && goalsData.length > 0 ? goalsData[0] : prev.financialGoals,
    }));
  } catch (err) {
    console.error('Error syncing data from Supabase:', err);
  } finally {
    isSyncing = false;
  }
}

// React Hook
export function useStudioStore() {
  const syncStore = useSyncExternalStore(
    (callback) => {
      listeners.add(callback);
      return () => listeners.delete(callback);
    },
    () => state
  );

  useEffect(() => {
    syncFromSupabase();
  }, []);

  // Computed Getters
  const getEnrichedClasses = (): ClassSchedule[] => {
    return state.classes.map((cls: ClassSchedule) => {
      const branch = state.branches.find((b: Branch) => b.id === cls.branch_id);
      const room = branch?.rooms?.find((r) => r.id === cls.room_id) || { name: 'Sala Principal' };
      const instructor = state.profiles.find((p: Profile) => p.id === cls.instructor_id);
      const activity = state.activities.find((a: Activity) => a.id === cls.activity_id);
      const confirmedBookings = state.bookings.filter(
        (b: Booking) => b.class_id === cls.id && b.status === 'confirmed'
      );
      const waitlistCount = state.waitlist.filter((w: WaitlistEntry) => w.class_id === cls.id).length;

      return {
        ...cls,
        branch,
        room,
        instructor,
        activity,
        bookings_count: confirmedBookings.length,
        waitlist_count: waitlistCount,
        is_full: confirmedBookings.length >= cls.max_capacity,
      };
    });
  };

  const getEnrichedBookings = (studentId?: string): Booking[] => {
    const list = studentId
      ? state.bookings.filter((b: Booking) => b.student_id === studentId)
      : state.bookings;

    return list
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

  const loginWithSupabase = async (
    email: string,
    password?: string
  ): Promise<{
    success: boolean;
    role?: UserRole;
    message?: string;
    status?: string;
  }> => {
    const cleanEmail = email.trim().toLowerCase();

    // 1. Try to find user in local state or Supabase profiles table
    let matchedProfile = state.profiles.find(
      (p: Profile) => p.email && p.email.toLowerCase() === cleanEmail
    );

    if (!matchedProfile && isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .ilike('email', cleanEmail)
          .limit(1);

        if (!error && data && data.length > 0) {
          matchedProfile = data[0] as Profile;
          setState((prev: any) => ({
            ...prev,
            profiles: [matchedProfile, ...prev.profiles.filter((p: Profile) => p.id !== matchedProfile?.id)],
          }));
        }
      } catch (err) {
        console.error('Error buscando perfil en Supabase:', err);
      }
    }

    // 2. Admin Demo shortcut fallback
    if (!matchedProfile && (cleanEmail === 'admin@sermoa.app' || cleanEmail === 'admin')) {
      const adminProfile = state.profiles.find((p: Profile) => p.role === 'admin') || {
        id: DEFAULT_ADMIN_ID,
        studio_id: state.studio.id,
        role: 'admin' as UserRole,
        status: 'active' as const,
        first_name: 'Administrador',
        last_name: 'SERMOA',
        email: 'admin@sermoa.app',
        phone: '+54 9 11 5555 0199',
        credits_balance: 999,
        debt_amount: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      setState((prev: any) => ({
        ...prev,
        isAuthenticated: true,
        currentUser: adminProfile,
        currentRole: 'admin',
        currentStudentId: adminProfile.id,
        currentInstructorId: adminProfile.id,
      }));

      return { success: true, role: 'admin' };
    }

    if (!matchedProfile) {
      return {
        success: false,
        message: 'No existe una cuenta registrada con este correo. Si eres nuevo, completa tu solicitud de registro.',
      };
    }

    // 3. Status validations
    if (matchedProfile.status === 'pending_approval') {
      return {
        success: false,
        status: 'pending_approval',
        message: 'Tu solicitud de alta está pendiente de revisión médica por el administrador. Te avisaremos por WhatsApp en cuanto sea aprobada.',
      };
    }

    if (matchedProfile.status === 'inactive' || matchedProfile.status === 'rejected') {
      return {
        success: false,
        status: matchedProfile.status,
        message: 'Tu cuenta se encuentra pausada o inactiva. Comunícate con la administración.',
      };
    }

    // 4. Supabase Auth authentication if available
    if (isSupabaseConfigured && password) {
      try {
        const { error: authErr } = await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password,
        });
        if (authErr) {
          console.warn('Supabase Auth response:', authErr.message);
        }
      } catch (e) {
        console.warn('Auth check error:', e);
      }
    }

    // 5. Update authenticated session in store
    setState((prev: any) => ({
      ...prev,
      isAuthenticated: true,
      currentUser: matchedProfile,
      currentRole: matchedProfile.role,
      currentStudentId: matchedProfile.id,
      currentInstructorId: matchedProfile.id,
    }));

    return {
      success: true,
      role: matchedProfile.role,
    };
  };

  const logout = async () => {
    if (isSupabaseConfigured) {
      try {
        await supabase.auth.signOut();
      } catch (e) {
        console.warn('Error en Supabase signOut:', e);
      }
    }

    setState((prev: any) => ({
      ...prev,
      isAuthenticated: false,
      currentUser: null,
      currentRole: 'client',
      currentStudentId: '',
    }));
  };

  // Student Registration & Approval
  const submitStudentRegistration = (newStudentData: Partial<Profile>) => {
    const id = generateUUID();
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

    if (isSupabaseConfigured) {
      supabase.from('profiles').insert({
        id,
        studio_id: state.studio.id,
        role: 'client',
        status: 'pending_approval',
        first_name: newStudent.first_name,
        last_name: newStudent.last_name,
        email: newStudent.email,
        phone: newStudent.phone,
        id_number: newStudent.id_number,
        medical_notes: newStudent.medical_notes,
        has_medical_certificate: newStudent.has_medical_certificate,
        medical_declaration: newStudent.medical_declaration,
        credits_balance: 0,
        debt_amount: 0,
        preferred_branch_id: newStudent.preferred_branch_id,
      }).then(({ error }) => {
        if (error) console.error('Error insertando alumno en Supabase:', error);
      });
    }

    return newStudent;
  };

  const approveStudentRegistration = (studentId: string, initialCredits: number = 1) => {
    const student = state.profiles.find((p: Profile) => p.id === studentId);
    if (!student) return;

    const updatedCredits = (student.credits_balance || 0) + initialCredits;

    setState((prev: any) => ({
      ...prev,
      profiles: prev.profiles.map((p: Profile) =>
        p.id === studentId
          ? {
              ...p,
              status: 'active' as const,
              credits_balance: updatedCredits,
              updated_at: new Date().toISOString(),
            }
          : p
      ),
    }));

    if (isSupabaseConfigured) {
      supabase.from('profiles').update({
        status: 'active',
        credits_balance: updatedCredits,
      }).eq('id', studentId).then(({ error }) => {
        if (error) console.error('Error aprobando alumno en Supabase:', error);
      });
    }

    // Trigger WhatsApp welcome message
    const welcomeTpl = state.whatsappTemplates.find((t: WhatsAppTemplate) => t.code === 'welcome_approved');
    if (welcomeTpl && student.phone) {
      const text = formatWhatsAppTemplate(welcomeTpl.template_text, {
        nombre: student.first_name,
        estudio: state.studio.name,
        link: getPortalLink(),
      });
      openWhatsApp(student.phone, text);
    }
  };

  const rejectStudentRegistration = (studentId: string) => {
    setState((prev: any) => ({
      ...prev,
      profiles: prev.profiles.map((p: Profile) =>
        p.id === studentId ? { ...p, status: 'inactive' as const, updated_at: new Date().toISOString() } : p
      ),
    }));

    if (isSupabaseConfigured) {
      supabase.from('profiles').update({
        status: 'inactive',
      }).eq('id', studentId).then(({ error }) => {
        if (error) console.error('Error rechazando alumno en Supabase:', error);
      });
    }
  };

  const updateStudent = (id: string, updatedData: Partial<Profile>) => {
    setState((prev: any) => ({
      ...prev,
      profiles: prev.profiles.map((p: Profile) =>
        p.id === id ? { ...p, ...updatedData, updated_at: new Date().toISOString() } : p
      ),
    }));

    if (isSupabaseConfigured) {
      supabase.from('profiles').update({
        first_name: updatedData.first_name,
        last_name: updatedData.last_name,
        email: updatedData.email,
        phone: updatedData.phone,
        id_number: updatedData.id_number,
        medical_notes: updatedData.medical_notes,
        has_medical_certificate: updatedData.has_medical_certificate,
        credits_balance: updatedData.credits_balance,
        debt_amount: updatedData.debt_amount,
        status: updatedData.status,
        preferred_branch_id: updatedData.preferred_branch_id,
        updated_at: new Date().toISOString(),
      }).eq('id', id).then(({ error }) => {
        if (error) console.error('Error actualizando alumno en Supabase:', error);
      });
    }
  };

  const deleteStudent = (id: string) => {
    setState((prev: any) => ({
      ...prev,
      profiles: prev.profiles.filter((p: Profile) => p.id !== id),
      bookings: prev.bookings.filter((b: Booking) => b.student_id !== id),
      waitlist: prev.waitlist.filter((w: WaitlistEntry) => w.student_id !== id),
    }));

    if (isSupabaseConfigured) {
      supabase.from('profiles').delete().eq('id', id).then(({ error }) => {
        if (error) console.error('Error eliminando alumno en Supabase:', error);
      });
    }
  };

  const addInstructor = (staffData: {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    password?: string;
    role?: UserRole;
    specialties?: string[];
    permissions?: {
      view_all_students?: boolean;
      manage_student_credits?: boolean;
      view_all_classes?: boolean;
      create_students?: boolean;
    };
  }) => {
    const id = generateUUID();
    const role: UserRole = staffData.role || 'instructor';
    const newStaff: Profile = {
      id,
      studio_id: state.studio.id,
      role,
      status: 'active',
      first_name: staffData.first_name,
      last_name: staffData.last_name,
      email: staffData.email,
      phone: staffData.phone,
      credits_balance: role === 'admin' ? 999 : 0,
      debt_amount: 0,
      specialties: staffData.specialties || ['Pilates Reformer', 'Entrenamiento Funcional'],
      permissions: role === 'admin' ? {
        view_all_students: true,
        manage_student_credits: true,
        view_all_classes: true,
        create_students: true,
      } : staffData.permissions || {
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
      profiles: [...prev.profiles, newStaff],
    }));

    if (isSupabaseConfigured) {
      supabase.from('profiles').insert({
        id,
        studio_id: state.studio.id,
        role: newStaff.role,
        status: 'active',
        first_name: newStaff.first_name,
        last_name: newStaff.last_name,
        email: newStaff.email,
        phone: newStaff.phone,
        credits_balance: newStaff.credits_balance,
        debt_amount: 0,
        specialties: newStaff.specialties,
        permissions: newStaff.permissions,
      }).then(({ error }) => {
        if (error) console.error('Error agregando staff en Supabase:', error);
      });
    }

    return newStaff;
  };

  const updateInstructor = (id: string, updatedData: Partial<Profile>) => {
    setState((prev: any) => ({
      ...prev,
      profiles: prev.profiles.map((p: Profile) =>
        p.id === id ? { ...p, ...updatedData, updated_at: new Date().toISOString() } : p
      ),
    }));

    if (isSupabaseConfigured) {
      supabase.from('profiles').update(updatedData).eq('id', id).then(({ error }) => {
        if (error) console.error('Error actualizando staff en Supabase:', error);
      });
    }
  };

  const deleteInstructor = (id: string) => {
    setState((prev: any) => ({
      ...prev,
      profiles: prev.profiles.filter((p: Profile) => p.id !== id),
      classes: prev.classes.map((c: ClassSchedule) =>
        c.instructor_id === id ? { ...c, instructor_id: prev.profiles[0]?.id || '' } : c
      ),
    }));

    if (isSupabaseConfigured) {
      supabase.from('profiles').delete().eq('id', id).then(({ error }) => {
        if (error) console.error('Error eliminando profesor en Supabase:', error);
      });
    }
  };

  // Branch / Sede Actions (CRUD)
  const createBranch = (branchData: {
    name: string;
    address: string;
    city?: string;
    phone?: string;
    opening_hours?: string;
    latitude?: number;
    longitude?: number;
    rooms?: { name: string; capacity: number }[];
  }) => {
    const newBranchId = generateUUID();
    const newBranch: Branch = {
      id: newBranchId,
      studio_id: state.studio.id,
      name: branchData.name,
      address: branchData.address,
      city: branchData.city || 'Buenos Aires',
      phone: branchData.phone || '',
      latitude: branchData.latitude || -34.5885,
      longitude: branchData.longitude || -58.4233,
      opening_hours: branchData.opening_hours || 'Lun a Vie 08:00 a 20:00 hs',
      is_active: true,
      rooms: (branchData.rooms && branchData.rooms.length > 0
        ? branchData.rooms
        : [{ name: 'Sala Principal', capacity: 10 }]
      ).map((r) => ({
        id: generateUUID(),
        branch_id: newBranchId,
        name: r.name,
        capacity: r.capacity || 10,
      })),
    };

    setState((prev: any) => ({
      ...prev,
      branches: [newBranch, ...prev.branches],
    }));

    if (isSupabaseConfigured) {
      supabase.from('branches').insert({
        id: newBranchId,
        studio_id: state.studio.id,
        name: newBranch.name,
        address: newBranch.address,
        city: newBranch.city,
        phone: newBranch.phone,
        latitude: newBranch.latitude,
        longitude: newBranch.longitude,
        is_active: true,
      }).then(({ error }) => {
        if (error) console.error('Error creando sucursal en Supabase:', error);
      });
    }

    return newBranch;
  };

  const updateBranch = (id: string, branchData: Partial<Branch>) => {
    setState((prev: any) => ({
      ...prev,
      branches: prev.branches.map((b: Branch) => (b.id === id ? { ...b, ...branchData } : b)),
    }));

    if (isSupabaseConfigured) {
      supabase.from('branches').update({
        name: branchData.name,
        address: branchData.address,
        city: branchData.city,
        phone: branchData.phone,
      }).eq('id', id).then(({ error }) => {
        if (error) console.error('Error actualizando sucursal en Supabase:', error);
      });
    }
  };

  const deleteBranch = (id: string) => {
    setState((prev: any) => ({
      ...prev,
      branches: prev.branches.filter((b: Branch) => b.id !== id),
    }));

    if (isSupabaseConfigured) {
      supabase.from('branches').delete().eq('id', id).then(({ error }) => {
        if (error) console.error('Error eliminando sucursal en Supabase:', error);
      });
    }
  };

  // Classes & Bookings Actions
  const createClass = (newClass: Partial<ClassSchedule>) => {
    createClassesBatch([newClass]);
  };

  const createClassesBatch = (newClasses: Partial<ClassSchedule>[]) => {
    const items: ClassSchedule[] = newClasses.map((nc) => ({
      id: generateUUID(),
      studio_id: state.studio.id,
      branch_id: nc.branch_id || state.branches[0]?.id || DEFAULT_BRANCH_ID,
      room_id: nc.room_id || state.branches[0]?.rooms[0]?.id,
      activity_id: nc.activity_id || state.activities[0]?.id,
      instructor_id: nc.instructor_id || state.profiles[0]?.id,
      title: nc.title || 'Nueva Clase',
      day_of_week: nc.day_of_week ?? new Date().getDay(),
      start_time: nc.start_time || '10:00',
      end_time: nc.end_time || '11:00',
      date: nc.date || todayStr,
      max_capacity: nc.max_capacity || 12,
      credit_cost: nc.credit_cost || 1.0,
      single_class_price: nc.single_class_price || 6500,
      is_recurring: nc.is_recurring ?? true,
      is_cancelled: false,
      color: nc.color || '#54875e',
    }));

    setState((prev: any) => ({
      ...prev,
      classes: [...prev.classes, ...items],
    }));

    if (isSupabaseConfigured) {
      supabase.from('classes').insert(
        items.map((c) => ({
          id: c.id,
          studio_id: c.studio_id,
          branch_id: c.branch_id,
          room_id: c.room_id,
          activity_id: c.activity_id,
          instructor_id: c.instructor_id,
          title: c.title,
          day_of_week: c.day_of_week,
          start_time: c.start_time,
          end_time: c.end_time,
          date: c.date,
          max_capacity: c.max_capacity,
          credit_cost: c.credit_cost,
          single_class_price: c.single_class_price,
          is_recurring: c.is_recurring,
          color: c.color,
          is_active: true,
        }))
      ).then(({ error }) => {
        if (error) console.error('Error insertando clases en Supabase:', error);
      });
    }
  };

  const deleteClass = (classId: string) => {
    setState((prev: any) => ({
      ...prev,
      classes: prev.classes.filter((c: ClassSchedule) => c.id !== classId),
      bookings: prev.bookings.filter((b: Booking) => b.class_id !== classId),
      waitlist: prev.waitlist.filter((w: WaitlistEntry) => w.class_id !== classId),
    }));

    if (isSupabaseConfigured) {
      supabase.from('classes').delete().eq('id', classId).then(({ error }) => {
        if (error) console.error('Error eliminando clase en Supabase:', error);
      });
    }
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
      return { success: false, isWaitlist: false, message: 'Ya tienes una reserva confirmada para este turno.' };
    }

    const currentBookings = state.bookings.filter(
      (b: Booking) => b.class_id === classId && b.booking_date === bookingDate && b.status === 'confirmed'
    );

    // If Class is Full -> Add to Waitlist
    if (currentBookings.length >= classSchedule.max_capacity) {
      const waitlistId = generateUUID();
      const waitlistEntry: WaitlistEntry = {
        id: waitlistId,
        studio_id: state.studio.id,
        class_id: classId,
        student_id: studentId,
        request_date: bookingDate,
        position: state.waitlist.filter((w: WaitlistEntry) => w.class_id === classId).length + 1,
        status: 'waiting',
        created_at: new Date().toISOString(),
      };

      setState((prev: any) => ({
        ...prev,
        waitlist: [...prev.waitlist, waitlistEntry],
      }));

      if (isSupabaseConfigured) {
        supabase.from('waitlist').insert({
          id: waitlistId,
          studio_id: state.studio.id,
          class_id: classId,
          student_id: studentId,
          request_date: bookingDate,
          position: waitlistEntry.position,
          status: 'waiting',
        }).then(({ error }) => {
          if (error) console.error('Error insertando en waitlist de Supabase:', error);
        });
      }

      return {
        success: true,
        isWaitlist: true,
        message: `La clase está completa. Has quedado en posición #${waitlistEntry.position} en la Lista de Espera.`,
      };
    }

    // Deduct Credit
    if (student.credits_balance < 1) {
      return {
        success: false,
        isWaitlist: false,
        message: 'No dispones de créditos suficientes. Por favor adquiere un pack de clases.',
      };
    }

    const bookingId = generateUUID();
    const newBooking: Booking = {
      id: bookingId,
      studio_id: state.studio.id,
      class_id: classId,
      student_id: studentId,
      booking_date: bookingDate,
      start_time: classSchedule.start_time,
      status: 'confirmed',
      created_at: new Date().toISOString(),
    };

    const newCredits = Math.max(0, student.credits_balance - 1);

    setState((prev: any) => ({
      ...prev,
      bookings: [newBooking, ...prev.bookings],
      profiles: prev.profiles.map((p: Profile) =>
        p.id === studentId ? { ...p, credits_balance: newCredits } : p
      ),
    }));

    if (isSupabaseConfigured) {
      supabase.from('bookings').insert({
        id: bookingId,
        studio_id: state.studio.id,
        class_id: classId,
        student_id: studentId,
        booking_date: bookingDate,
        start_time: classSchedule.start_time,
        status: 'confirmed',
      }).then(({ error }) => {
        if (error) console.error('Error insertando reserva en Supabase:', error);
      });

      supabase.from('profiles').update({
        credits_balance: newCredits,
      }).eq('id', studentId).then(({ error }) => {
        if (error) console.error('Error actualizando créditos en Supabase:', error);
      });
    }

    return {
      success: true,
      isWaitlist: false,
      message: '¡Reserva confirmada con éxito!',
    };
  };

  const cancelBooking = (bookingId: string) => {
    const booking = state.bookings.find((b: Booking) => b.id === bookingId);
    if (!booking) return;

    // Refund credit
    const student = state.profiles.find((p: Profile) => p.id === booking.student_id);
    const restoredCredits = (student?.credits_balance || 0) + 1;

    setState((prev: any) => ({
      ...prev,
      bookings: prev.bookings.map((b: Booking) =>
        b.id === bookingId ? { ...b, status: 'cancelled_in_time' as const } : b
      ),
      profiles: prev.profiles.map((p: Profile) =>
        p.id === booking.student_id ? { ...p, credits_balance: restoredCredits } : p
      ),
    }));

    if (isSupabaseConfigured) {
      supabase.from('bookings').update({
        status: 'cancelled_in_time',
      }).eq('id', bookingId).then(({ error }) => {
        if (error) console.error('Error cancelando reserva en Supabase:', error);
      });

      supabase.from('profiles').update({
        credits_balance: restoredCredits,
      }).eq('id', booking.student_id).then(({ error }) => {
        if (error) console.error('Error restaurando créditos en Supabase:', error);
      });
    }
  };

  // Attendance & Check-in
  const performQRCheckinWithGPS = (
    studentId: string,
    classId: string,
    userCoords?: { latitude: number; longitude: number }
  ): { success: boolean; message: string; distanceMeters?: number; verifiedByGps: boolean } => {
    // Find booking
    const booking = state.bookings.find(
      (b: Booking) => b.class_id === classId && b.student_id === studentId && (b.booking_date === todayStr || !b.booking_date)
    );

    const branch = state.branches[0] || { latitude: -34.5885, longitude: -58.4233, name: 'Sede Principal' };
    let isGeoVerified = false;
    let distanceMeters = 0;

    if (userCoords && branch.latitude && branch.longitude) {
      const allowedRadius = state.studio.gps_checkin_radius_meters || 75;
      const geores = isWithinGeofence(
        userCoords.latitude,
        userCoords.longitude,
        branch.latitude,
        branch.longitude,
        allowedRadius
      );
      isGeoVerified = geores.isInside;
      distanceMeters = geores.distanceMeters;
    }

    const attendanceId = generateUUID();
    const attendance: AttendanceRecord = {
      id: attendanceId,
      booking_id: booking?.id || generateUUID(),
      class_id: classId,
      student_id: studentId,
      status: 'present',
      checkin_method: 'qr_gps',
      distance_meters: distanceMeters,
      verified_latitude: userCoords?.latitude,
      verified_longitude: userCoords?.longitude,
      timestamp: new Date().toISOString(),
    };

    setState((prev: any) => ({
      ...prev,
      bookings: booking
        ? prev.bookings.map((b: Booking) => (b.id === booking.id ? { ...b, status: 'attended' as const } : b))
        : prev.bookings,
      attendances: [attendance, ...prev.attendances],
    }));

    if (isSupabaseConfigured) {
      supabase.from('attendances').insert({
        id: attendanceId,
        studio_id: state.studio.id,
        booking_id: attendance.booking_id,
        class_id: classId,
        student_id: studentId,
        attendance_date: todayStr,
        status: 'present',
        checkin_method: 'qr_code',
        checkin_time: attendance.timestamp,
        verified_by_gps: isGeoVerified,
      }).then(({ error }) => {
        if (error) console.error('Error guardando asistencia en Supabase:', error);
      });

      if (booking) {
        supabase.from('bookings').update({ status: 'attended' }).eq('id', booking.id);
      }
    }

    return {
      success: true,
      message: isGeoVerified
        ? `¡Check-in validado con GPS (${distanceMeters}m de la sede)!`
        : '¡Check-in completado exitosamente!',
      distanceMeters,
      verifiedByGps: isGeoVerified,
    };
  };

  const markAttendance = (bookingId: string, status: 'present' | 'late' | 'no_show' | 'absent_with_notice') => {
    const booking = state.bookings.find((b: Booking) => b.id === bookingId);
    if (!booking) return;

    const attendanceId = generateUUID();
    const attendance: AttendanceRecord = {
      id: attendanceId,
      booking_id: bookingId,
      class_id: booking.class_id,
      student_id: booking.student_id,
      status: status as AttendanceStatus,
      checkin_method: 'manual_instructor',
      timestamp: new Date().toISOString(),
    };

    setState((prev: any) => ({
      ...prev,
      bookings: prev.bookings.map((b: Booking) =>
        b.id === bookingId ? { ...b, status: status === 'present' ? ('attended' as const) : ('no_show' as const) } : b
      ),
      attendances: [attendance, ...prev.attendances],
    }));

    if (isSupabaseConfigured) {
      supabase.from('attendances').insert({
        id: attendanceId,
        studio_id: state.studio.id,
        booking_id: bookingId,
        class_id: booking.class_id,
        student_id: booking.student_id,
        attendance_date: booking.booking_date,
        status,
        checkin_method: 'manual',
        checkin_time: attendance.timestamp,
      }).then(({ error }) => {
        if (error) console.error('Error insertando asistencia manual en Supabase:', error);
      });
    }
  };

  // Payments & Financial Ledger Actions
  const addTransaction = (
    tx: Partial<PaymentTransaction>,
    creditsToAdd: number = 0
  ) => {
    const newTxId = generateUUID();
    const newTx: PaymentTransaction = {
      id: newTxId,
      studio_id: state.studio.id,
      student_id: tx.student_id,
      student_name: tx.student_name,
      pack_id: tx.pack_id,
      amount: tx.amount || 0,
      payment_type: tx.payment_type || 'income',
      payment_method: tx.payment_method || 'cash',
      concept: tx.concept || 'Cobro general',
      category: tx.category || (tx.payment_type === 'expense' ? 'Gasto Operativo' : 'Cuota / Pack'),
      notes: tx.notes || '',
      status: tx.status || 'completed',
      reference_code: tx.reference_code || `REC-${Date.now().toString().slice(-6)}`,
      created_at: tx.created_at || new Date().toISOString(),
    };

    setState((prev: any) => {
      let updatedProfiles = prev.profiles;
      if (tx.student_id && tx.payment_type === 'income') {
        updatedProfiles = prev.profiles.map((p: Profile) =>
          p.id === tx.student_id
            ? {
                ...p,
                credits_balance: (p.credits_balance || 0) + (creditsToAdd || 0),
                debt_amount: Math.max(0, (p.debt_amount || 0) - (tx.amount || 0)),
              }
            : p
        );
      }

      return {
        ...prev,
        payments: [newTx, ...prev.payments],
        profiles: updatedProfiles,
      };
    });

    if (isSupabaseConfigured) {
      supabase.from('payments').insert({
        id: newTxId,
        studio_id: state.studio.id,
        student_id: newTx.student_id,
        student_name: newTx.student_name,
        pack_id: newTx.pack_id,
        amount: newTx.amount,
        currency: 'ARS',
        payment_type: newTx.payment_type,
        payment_method: newTx.payment_method,
        concept: newTx.concept,
        category: newTx.category,
        reference_code: newTx.reference_code,
        notes: newTx.notes,
        status: 'completed',
        created_at: newTx.created_at,
      }).then(({ error }) => {
        if (error) console.error('Error insertando pago en Supabase:', error);
      });

      if (tx.student_id && tx.payment_type === 'income') {
        const student = state.profiles.find((p: Profile) => p.id === tx.student_id);
        if (student) {
          supabase.from('profiles').update({
            credits_balance: (student.credits_balance || 0) + (creditsToAdd || 0),
            debt_amount: Math.max(0, (student.debt_amount || 0) - (tx.amount || 0)),
          }).eq('id', tx.student_id).then(({ error }) => {
            if (error) console.error('Error actualizando deuda/créditos en Supabase:', error);
          });
        }
      }
    }

    return newTx;
  };

  const deleteTransaction = (id: string) => {
    setState((prev: any) => ({
      ...prev,
      payments: prev.payments.filter((p: PaymentTransaction) => p.id !== id),
    }));

    if (isSupabaseConfigured) {
      supabase.from('payments').delete().eq('id', id).then(({ error }) => {
        if (error) console.error('Error eliminando pago en Supabase:', error);
      });
    }
  };

  const updateTransaction = (id: string, updatedData: Partial<PaymentTransaction>) => {
    setState((prev: any) => ({
      ...prev,
      payments: prev.payments.map((p: PaymentTransaction) =>
        p.id === id ? { ...p, ...updatedData } : p
      ),
    }));

    if (isSupabaseConfigured) {
      supabase.from('payments').update(updatedData).eq('id', id).then(({ error }) => {
        if (error) console.error('Error actualizando pago en Supabase:', error);
      });
    }
  };

  // Financial Categories Actions
  const createFinancialCategory = (category: Partial<FinancialCategory>) => {
    const id = generateUUID();
    const newCat: FinancialCategory = {
      id,
      studio_id: state.studio.id,
      name: category.name || 'Nueva Categoría',
      type: category.type || 'expense',
      color: category.color || (category.type === 'income' ? '#10b981' : '#6366f1'),
      is_active: true,
    };

    setState((prev: any) => ({
      ...prev,
      financialCategories: [...prev.financialCategories, newCat],
    }));

    if (isSupabaseConfigured) {
      supabase.from('financial_categories').insert({
        id,
        studio_id: state.studio.id,
        name: newCat.name,
        type: newCat.type,
        color: newCat.color,
        is_active: true,
      }).then(({ error }) => {
        if (error) console.error('Error creando categoría en Supabase:', error);
      });
    }

    return newCat;
  };

  const toggleFinancialCategory = (id: string) => {
    const cat = state.financialCategories.find((c: FinancialCategory) => c.id === id);
    const nextActive = cat ? !cat.is_active : true;

    setState((prev: any) => ({
      ...prev,
      financialCategories: prev.financialCategories.map((c: FinancialCategory) =>
        c.id === id ? { ...c, is_active: nextActive } : c
      ),
    }));

    if (isSupabaseConfigured) {
      supabase.from('financial_categories').update({
        is_active: nextActive,
      }).eq('id', id).then(({ error }) => {
        if (error) console.error('Error toggling categoría en Supabase:', error);
      });
    }
  };

  const deleteFinancialCategory = (id: string) => {
    setState((prev: any) => ({
      ...prev,
      financialCategories: prev.financialCategories.filter((c: FinancialCategory) => c.id !== id),
    }));

    if (isSupabaseConfigured) {
      supabase.from('financial_categories').delete().eq('id', id).then(({ error }) => {
        if (error) console.error('Error eliminando categoría en Supabase:', error);
      });
    }
  };

  // Financial Monthly Goals Actions
  const updateFinancialGoals = (goals: Partial<FinancialMonthlyGoals>) => {
    const updatedGoals = {
      ...state.financialGoals,
      ...goals,
    };

    setState((prev: any) => ({
      ...prev,
      financialGoals: updatedGoals,
    }));

    if (isSupabaseConfigured) {
      supabase.from('financial_monthly_goals').upsert({
        studio_id: state.studio.id,
        month: updatedGoals.month || new Date().getMonth() + 1,
        year: updatedGoals.year || new Date().getFullYear(),
        avg_class_price: updatedGoals.avg_class_price,
        operational_be_amount: updatedGoals.operational_be_amount,
        cash_be_amount: updatedGoals.cash_be_amount,
        target_sales_amount: updatedGoals.target_sales_amount,
        operating_days: updatedGoals.operating_days,
      }).then(({ error }) => {
        if (error) console.error('Error guardando objetivos en Supabase:', error);
      });
    }
  };

  // Credit pack purchase
  const purchaseCreditPack = (studentId: string, packId: string, paymentMethod: PaymentMethod = 'mercadopago') => {
    const student = state.profiles.find((p: Profile) => p.id === studentId);
    const pack = state.creditPacks.find((cp: CreditPack) => cp.id === packId);
    if (!student || !pack) return;

    addTransaction(
      {
        student_id: studentId,
        student_name: `${student.first_name} ${student.last_name}`,
        pack_id: packId,
        amount: pack.price,
        payment_type: 'income',
        payment_method: paymentMethod,
        concept: `Compra: ${pack.name}`,
      },
      pack.credits_count
    );
  };

  // Studio Settings Update
  const updateStudioSettings = (updated: Partial<Studio>) => {
    setState((prev: any) => ({
      ...prev,
      studio: { ...prev.studio, ...updated },
    }));

    if (isSupabaseConfigured) {
      supabase.from('studios').update({
        name: updated.name,
        brand_colors: updated.brand_colors,
        phone: updated.phone,
        email: updated.email,
        address: updated.address,
        cuit_tax_id: updated.cuit_tax_id,
        booking_window_days: updated.booking_window_days,
        cancellation_window_hours: updated.cancellation_window_hours,
        gps_checkin_radius_meters: updated.gps_checkin_radius_meters,
      }).eq('id', state.studio.id).then(({ error }) => {
        if (error) console.error('Error actualizando estudio en Supabase:', error);
      });
    }
  };

  const updateWhatsAppTemplate = (id: string, newText: string) => {
    setState((prev: any) => ({
      ...prev,
      whatsappTemplates: prev.whatsappTemplates.map((t: WhatsAppTemplate) =>
        t.id === id ? { ...t, template_text: newText } : t
      ),
    }));

    if (isSupabaseConfigured) {
      supabase.from('whatsapp_templates').update({
        message: newText,
      }).eq('id', id).then(({ error }) => {
        if (error) console.error('Error actualizando plantilla en Supabase:', error);
      });
    }
  };

  // Routine Actions
  const createRoutine = (routineData: Partial<Routine>) => {
    const id = generateUUID();
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

    if (isSupabaseConfigured) {
      supabase.from('routines').insert({
        id,
        studio_id: state.studio.id,
        student_id: newRoutine.student_id,
        instructor_id: newRoutine.instructor_id,
        title: newRoutine.title,
        description: newRoutine.goal,
        level: newRoutine.level,
        exercises: newRoutine.exercises,
        is_active: true,
      }).then(({ error }) => {
        if (error) console.error('Error creando rutina en Supabase:', error);
      });
    }

    return newRoutine;
  };

  const updateRoutine = (id: string, updatedData: Partial<Routine>) => {
    setState((prev: any) => ({
      ...prev,
      routines: prev.routines.map((r: Routine) =>
        r.id === id ? { ...r, ...updatedData } : r
      ),
    }));

    if (isSupabaseConfigured) {
      supabase.from('routines').update(updatedData).eq('id', id).then(({ error }) => {
        if (error) console.error('Error actualizando rutina en Supabase:', error);
      });
    }
  };

  const deleteRoutine = (id: string) => {
    setState((prev: any) => ({
      ...prev,
      routines: prev.routines.filter((r: Routine) => r.id !== id),
    }));

    if (isSupabaseConfigured) {
      supabase.from('routines').delete().eq('id', id).then(({ error }) => {
        if (error) console.error('Error eliminando rutina en Supabase:', error);
      });
    }
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
      financialCategories: initialFinancialCategories,
      financialGoals: initialFinancialGoals,
      whatsappTemplates: initialWhatsAppTemplates,
      routines: initialRoutines,
      attendances: initialAttendances,
      currentRole: 'admin',
      currentStudentId: DEFAULT_ADMIN_ID,
      currentInstructorId: DEFAULT_ADMIN_ID,
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
    financialCategories: state.financialCategories || initialFinancialCategories,
    financialGoals: state.financialGoals || initialFinancialGoals,
    whatsappTemplates: state.whatsappTemplates,
    routines: state.routines,
    attendances: state.attendances,
    isAuthenticated: state.isAuthenticated,
    currentUser: state.currentUser,
    currentRole: state.currentRole,
    currentStudentId: state.currentStudentId,
    currentInstructorId: state.currentInstructorId,
    // Computed Getters
    getEnrichedClasses,
    getEnrichedBookings,
    // Actions
    setRole,
    setCurrentStudentId,
    loginWithSupabase,
    logout,
    submitStudentRegistration,
    approveStudentRegistration,
    rejectStudentRegistration,
    updateStudent,
    deleteStudent,
    addInstructor,
    updateInstructor,
    deleteInstructor,
    createBranch,
    updateBranch,
    deleteBranch,
    createClass,
    createClassesBatch,
    deleteClass,
    bookClass,
    cancelBooking,
    performQRCheckinWithGPS,
    markAttendance,
    addTransaction,
    deleteTransaction,
    updateTransaction,
    createFinancialCategory,
    toggleFinancialCategory,
    deleteFinancialCategory,
    updateFinancialGoals,
    purchaseCreditPack,
    updateStudioSettings,
    updateWhatsAppTemplate,
    createRoutine,
    updateRoutine,
    deleteRoutine,
    resetToDemoData,
  };
}
