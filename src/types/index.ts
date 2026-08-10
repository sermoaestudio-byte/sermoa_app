// ==============================================================================
// SERMOA FIT / AGENDAFIT NEXT - DATA MODELS & TYPES (100% SUPABASE COMPATIBLE)
// ==============================================================================

export type UserRole = 'admin' | 'instructor' | 'client';
export type StudentStatus = 'active' | 'pending_approval' | 'inactive' | 'rejected';
export type BookingStatus = 'confirmed' | 'cancelled_by_user' | 'cancelled_by_admin' | 'attended' | 'no_show';
export type WaitlistStatus = 'waiting' | 'promoted' | 'expired' | 'cancelled';
export type PaymentType = 'income' | 'expense';
export type PaymentMethod = 'mercadopago' | 'cash' | 'transfer' | 'card';
export type PaymentStatus = 'completed' | 'pending' | 'refunded';
export type AttendanceStatus = 'present' | 'late' | 'absent_with_notice' | 'no_show';
export type CheckinMethod = 'qr_gps' | 'manual_instructor' | 'manual_admin' | 'kiosk_qr';

export interface Studio {
  id: string;
  name: string;
  slug: string;
  logo_url: string;
  phone: string;
  email: string;
  description: string;
  currency: string;
  cancellation_window_hours: number;
  gps_checkin_radius_meters: number;
  trial_days_remaining: number;
  plan_tier: 'STARTER' | 'PRO' | 'ENTERPRISE';
  plan_limits: {
    instructors_max: number;
    active_students_max: number;
    branches_max: number;
  };
  referral_stats: {
    available_balance: number;
    referred_count: number;
    target_count: number;
    link: string;
  };
}

export interface Branch {
  id: string;
  studio_id: string;
  name: string;
  address: string;
  city: string;
  phone: string;
  latitude: number;
  longitude: number;
  opening_hours: string;
  is_active: boolean;
  rooms: Room[];
}

export interface Room {
  id: string;
  branch_id: string;
  name: string;
  capacity: number;
}

export interface Activity {
  id: string;
  studio_id: string;
  name: string;
  description: string;
  color: string;
  default_duration_minutes: number;
  icon?: string;
}

export interface Profile {
  id: string;
  studio_id: string;
  auth_user_id?: string;
  role: UserRole;
  status: StudentStatus;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  avatar_url?: string;
  id_number?: string; // DNI / Documento
  birth_date?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  medical_notes?: string;
  has_medical_certificate?: boolean;
  medical_declaration?: {
    has_injuries: boolean;
    injuries_detail?: string;
    has_hypertension: boolean;
    is_pregnant: boolean;
    taking_medications: boolean;
    medications_detail?: string;
    has_cardiac_conditions: boolean;
  };
  credits_balance: number;
  debt_amount: number;
  preferred_branch_id?: string;
  created_at: string;
  updated_at: string;
  // Extras para profesores
  specialties?: string[];
  commission_per_class?: number;
  permissions?: {
    view_all_students?: boolean;
    manage_student_credits?: boolean;
    view_all_classes?: boolean;
    create_students?: boolean;
  };
}

export interface ClassSchedule {
  id: string;
  studio_id: string;
  branch_id: string;
  room_id: string;
  activity_id: string;
  instructor_id: string;
  title: string;
  day_of_week: number; // 0=Domingo, 1=Lunes, ... 6=Sábado
  start_time: string; // "08:00"
  end_time: string; // "09:00"
  date?: string; // "2026-08-10" para clases específicas
  max_capacity: number;
  is_recurring: boolean;
  is_cancelled: boolean;
  color: string;
  // Campos computados para frontend
  branch?: Branch;
  room?: Room;
  activity?: Activity;
  instructor?: Profile;
  enrolled_students_count?: number;
  waitlist_count?: number;
}

export interface Booking {
  id: string;
  class_id: string;
  student_id: string;
  booking_date: string; // "2026-08-10"
  status: BookingStatus;
  credit_deducted: boolean;
  created_at: string;
  cancelled_at?: string;
  // Expandidos
  student?: Profile;
  class_schedule?: ClassSchedule;
}

export interface WaitlistEntry {
  id: string;
  class_id: string;
  student_id: string;
  booking_date: string;
  position: number;
  status: WaitlistStatus;
  created_at: string;
  promoted_at?: string;
  // Expandidos
  student?: Profile;
  class_schedule?: ClassSchedule;
}

export interface CreditPack {
  id: string;
  studio_id: string;
  name: string;
  description: string;
  credits_count: number; // 8, 12, 999 (pase libre)
  price: number;
  validity_days: number;
  is_recurring_monthly: boolean;
  is_active: boolean;
  activity_ids?: string[]; // Si aplica a disciplinas específicas
  popular_badge?: boolean;
}

export interface StudentMembership {
  id: string;
  student_id: string;
  pack_id: string;
  pack_name: string;
  credits_total: number;
  credits_remaining: number;
  start_date: string;
  end_date: string;
  status: 'active' | 'expired' | 'consumed';
}

export interface PaymentTransaction {
  id: string;
  studio_id: string;
  student_id?: string;
  student_name?: string;
  pack_id?: string;
  amount: number;
  payment_type: PaymentType;
  payment_method: PaymentMethod;
  concept: string;
  status: PaymentStatus;
  reference_code: string;
  created_at: string;
}

export interface AttendanceRecord {
  id: string;
  booking_id: string;
  student_id: string;
  class_id: string;
  checkin_method: CheckinMethod;
  verified_latitude?: number;
  verified_longitude?: number;
  distance_meters?: number;
  status: AttendanceStatus;
  timestamp: string;
  student?: Profile;
  class_schedule?: ClassSchedule;
}

export interface Exercise {
  id: string;
  name: string;
  category: 'fuerza' | 'cardio' | 'flexibilidad' | 'core' | 'pilates';
  sets: number;
  reps: string; // ej: "12-15" o "45 seg"
  rest_seconds: number;
  springs_or_weight?: string; // ej: "1 Rojo + 1 Azul" o "Mancuernas 4kg"
  notes?: string;
  video_url?: string;
}

export interface Routine {
  id: string;
  studio_id: string;
  student_id?: string;
  student_ids?: string[]; // Asignación a múltiples alumnos
  instructor_id?: string;
  activity_id?: string;
  title: string;
  goal: string;
  level: 'principiante' | 'intermedio' | 'avanzado';
  duration_minutes?: number;
  days_per_week?: number;
  exercises: Exercise[];
  created_at: string;
  student?: Profile;
  instructor?: Profile;
}

export interface WhatsAppTemplate {
  id: string;
  studio_id: string;
  code: 'welcome_approved' | 'class_reminder' | 'waitlist_promoted' | 'debt_reminder' | 'booking_confirmed';
  title: string;
  template_text: string;
  is_active: boolean;
}
