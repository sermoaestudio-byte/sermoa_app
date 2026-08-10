import React from 'react';
import {
  X,
  BookOpen,
  HelpCircle,
  CheckCircle2,
  AlertCircle,
  Lightbulb,
  ArrowRight,
  Smartphone,
  ShieldCheck,
  Calendar,
  Users,
  MessageCircle,
  Sparkles,
  QrCode
} from 'lucide-react';

export type HelpModuleId =
  | 'students'
  | 'classes'
  | 'attendance'
  | 'instructors'
  | 'branches'
  | 'routines'
  | 'history'
  | 'pricing'
  | 'finance'
  | 'settings'
  | 'checkin';

interface ModuleHelpGuide {
  title: string;
  subtitle: string;
  badge: string;
  summary: string;
  steps: {
    title: string;
    description: string;
    tip?: string;
  }[];
  faqs: {
    question: string;
    answer: string;
  }[];
}

const HELP_GUIDES: Record<HelpModuleId, ModuleHelpGuide> = {
  students: {
    title: 'Guía del Módulo de Alumnos & CRM',
    subtitle: 'Flujo de registro, aprobación médica y gestión de créditos',
    badge: 'Gestión de Alumnos',
    summary: 'Aprende cómo funciona el circuito completo desde que un alumno se registra hasta que comienza a reservar clases en tu estudio.',
    steps: [
      {
        title: '1. Registro Público del Alumno',
        description: 'El alumno ingresa al link público del estudio (ej. sermoa.app/#registro) y completa sus datos personales junto con la Declaración Jurada de Salud (lesiones, embarazo, apto físico).',
        tip: 'No requiere descargar aplicaciones pesadas; funciona directo en cualquier celular.',
      },
      {
        title: '2. Bandeja de Solicitudes Pendientes',
        description: 'Toda nueva solicitud ingresa en la pestaña "Solicitudes Pendientes" para que el administrador revise la ficha médica antes de autorizar el ingreso.',
      },
      {
        title: '3. Aprobación en 1 Click y WhatsApp',
        description: 'Al pulsar "Aprobar & Notificar", el alumno pasa a estado Activo, se le cargan sus créditos iniciales y se dispara automáticamente el mensaje de bienvenida por WhatsApp con su acceso directo.',
      },
      {
        title: '4. Ficha 360° del Alumno',
        description: 'Haz click en cualquier alumno de la lista para abrir su panel lateral: ver historial de asistencias, cargar packs de créditos, registrar cobros y contactarlo por WhatsApp con un click.',
      },
    ],
    faqs: [
      {
        question: '¿Qué pasa si un alumno tiene deuda?',
        answer: 'Aparecerá destacado con un badge rojo "Con Deuda" y en la pestaña de filtros. Puedes registrar pagos parciales o totales desde su ficha lateral.',
      },
      {
        question: '¿Cómo renueva créditos un alumno?',
        answer: 'Desde su ficha en el botón "+ Cargar Pack", seleccionas el abono deseado y el medio de pago (MercadoPago, Efectivo o Transferencia).',
      },
    ],
  },
  classes: {
    title: 'Guía de Clases, Reservas & Lista de Espera',
    subtitle: 'Programación de horarios y sistema automático de cupos',
    badge: 'Clases & Reservas',
    summary: 'Conoce cómo configurar tus horarios semanales, gestionar cupos y cómo funciona el sistema de cola automático cuando una clase se llena.',
    steps: [
      {
        title: '1. Creación de Clases (Grilla, Rango o Manual)',
        description: 'Pulsa en "+ Nueva Clase" para definir clases recurrentes o únicas. Puedes utilizar la Grilla semanal interactiva, generar bloques automáticos por Rango o definir horarios Manuales.',
      },
      {
        title: '2. Vistas Semanal, Diaria y Tabla',
        description: 'Alterna entre la vista Semanal (7 columnas), Diaria (cronograma detallado con barra de ocupación) o Tabla (listado rápido con buscador integrado).',
      },
      {
        title: '3. Sistema de Cola en Lista de Espera',
        description: 'Si una clase llega a su capacidad máxima (ej. 12/12), los nuevos alumnos entran en Lista de Espera por orden de llegada (Posición #1, #2...).',
      },
      {
        title: '4. Auto-Promoción por WhatsApp al Cancelar',
        description: 'Si un alumno confirmado cancela con anticipación, el sistema libera la vacante y envía un WhatsApp al alumno #1 con un botón para confirmar su cupo o ceder el lugar al siguiente.',
      },
    ],
    faqs: [
      {
        question: '¿Cuánto tiempo tiene el alumno para aceptar el cupo liberado?',
        answer: 'De forma predeterminada cuenta con 30 minutos. Si no confirma, el sistema avisa automáticamente a la Posición #2.',
      },
      {
        question: '¿Qué sucede con los créditos al cancelar a tiempo?',
        answer: 'Si el alumno cancela dentro del margen permitido (ej. 2 horas antes), el crédito se le reintegra automáticamente.',
      },
    ],
  },
  attendance: {
    title: 'Guía de Pasar Lista & Asistencia QR',
    subtitle: 'Control de presencia y validación anti-fraude',
    badge: 'Pasar Lista',
    summary: 'Registra la asistencia diaria de tus alumnos con 1 click o utilizando el escáner de códigos QR de recepción con geolocalización.',
    steps: [
      {
        title: '1. Marcado Manual Rápido',
        description: 'En el listado de clases del día, marca "Presente" o "Ausente" para cada alumno inscripto con un solo toque.',
      },
      {
        title: '2. Escáner de Pase Digital QR',
        description: 'Haz click en "Escanear QR Alumno" para abrir la cámara de recepción y validar la credencial que el alumno muestra en su pantalla.',
      },
      {
        title: '3. Check-in Autónomo con GPS Anti-Fraude',
        description: 'El alumno puede escanear el cartel QR ubicado en la recepción de tu estudio. El sistema valida sus coordenadas GPS (<75 metros) para evitar check-ins falsos desde su casa.',
      },
    ],
    faqs: [
      {
        question: '¿Dónde descargo el cartel QR para la recepción?',
        answer: 'Desde el botón "Cartel QR" en la barra superior del panel puedes previsualizarlo e imprimirlo en formato A4 listo para colgar.',
      },
    ],
  },
  instructors: {
    title: 'Guía de Profesores & Staff',
    subtitle: 'Gestión de instructores y permisos especiales',
    badge: 'Profesores',
    summary: 'Administra a tu equipo de trabajo, asigna especialidades, comisiones por clase y configura permisos de acceso al portal.',
    steps: [
      {
        title: '1. Alta de Nuevo Profesor',
        description: 'Pulsa "+ Nuevo Profesor", completa sus datos de acceso y teléfono para habilitar su ingreso al Portal del Profesor.',
      },
      {
        title: '2. Configuración de Permisos Especiales',
        description: 'Habilita facultades adicionales según el rol: ver todos los alumnos, gestionar créditos manuales, ver todas las clases o dar de alta nuevos alumnos.',
      },
      {
        title: '3. Asignación a Clases',
        description: 'Al crear o editar horarios, vincula al profesor correspondiente para que la clase figure en su agenda diaria.',
      },
    ],
    faqs: [
      {
        question: '¿Qué ve el profesor al iniciar sesión?',
        answer: 'De forma predeterminada solo visualiza su propia agenda de clases del día, sus alumnos inscriptos y la opción de pasar lista.',
      },
    ],
  },
  branches: {
    title: 'Guía de Sucursales & Sedes',
    subtitle: 'Configuración física, salas y radio GPS',
    badge: 'Sucursales',
    summary: 'Administra tus sedes operativas, define salas de pilates/fitness y ajusta el radio de geolocalización para el check-in.',
    steps: [
      {
        title: '1. Configuración de Sede',
        description: 'Define la dirección física, teléfono de contacto y horarios de apertura de cada sucursal.',
      },
      {
        title: '2. Coordenadas GPS para Check-in',
        description: 'Establece la latitud y longitud exactas para delimitar el área donde los alumnos pueden validar su presencia.',
      },
      {
        title: '3. Creación de Salas',
        description: 'Asigna salas físicas con capacidades individuales (ej: Sala Reformer - 12 camas, Sala Yoga - 20 personas).',
      },
    ],
    faqs: [
      {
        question: '¿Puedo tener múltiples sucursales?',
        answer: 'Sí, la plataforma es multi-sede y permite filtrar clases, alumnos y reportes por cada sucursal.',
      },
    ],
  },
  routines: {
    title: 'Guía de Rutinas & Planes',
    subtitle: 'Prescripción de entrenamientos personalizados',
    badge: 'Rutinas',
    summary: 'Crea y asigna rutinas de entrenamiento con series, repeticiones y niveles para que tus alumnos las sigan desde su app.',
    steps: [
      {
        title: '1. Creación del Plan de Rutina',
        description: 'Define el nombre, objetivo (fuerza, postura, flexibilidad) y nivel de dificultad.',
      },
      {
        title: '2. Agregado de Ejercicios',
        description: 'Ingresa los ejercicios con series, repeticiones o tiempo de descanso.',
      },
      {
        title: '3. Asignación al Alumno',
        description: 'Vincula la rutina al perfil del alumno para que pueda visualizarla desde su portal.',
      },
    ],
    faqs: [
      {
        question: '¿El alumno puede marcar ejercicios completados?',
        answer: 'Sí, desde la vista Alumno puede consultar su rutina asignada y seguir las indicaciones del profesor.',
      },
    ],
  },
  history: {
    title: 'Guía de Historial de Movimientos',
    subtitle: 'Auditoría de compras, recargas y exportación a Excel',
    badge: 'Historial',
    summary: 'Consulta el registro inmutable de todas las transacciones financieras y descarga reportes en CSV para tu contador.',
    steps: [
      {
        title: '1. Libro Diario de Transacciones',
        description: 'Visualiza en tiempo real cada compra de pack, ajuste de crédito o pago registrado.',
      },
      {
        title: '2. Filtros por Período y Estado',
        description: 'Filtra transacciones por medio de pago (MercadoPago, Transferencia, Efectivo) o por alumno.',
      },
      {
        title: '3. Exportación a CSV',
        description: 'Haz click en "Exportar CSV" para descargar la planilla compatible con Excel o Google Sheets con 1 click.',
      },
    ],
    faqs: [
      {
        question: '¿Quedan registradas las modificaciones de créditos?',
        answer: 'Sí, cualquier ajuste manual realizado por el administrador o profesor queda asentado con fecha y responsable.',
      },
    ],
  },
  pricing: {
    title: 'Guía de Packs de Créditos & Tarifas',
    subtitle: 'Catálogo de planes, abonos y vigencias',
    badge: 'Packs de Créditos',
    summary: 'Estructura tu oferta comercial: define abonos mensuales, paquetes de clases sueltas y días de vigencia.',
    steps: [
      {
        title: '1. Creación de Packs',
        description: 'Define la cantidad de clases/créditos (ej: Pase Libre, 8 Clases, 12 Clases) y el precio en tu moneda local.',
      },
      {
        title: '2. Días de Vigencia',
        description: 'Configura la fecha de caducidad de los créditos (ej: 30 días) para fomentar la asistencia regular.',
      },
      {
        title: '3. Asignación Directa',
        description: 'Los packs creados aparecen automáticamente disponibles en la ficha del alumno para su cobro.',
      },
    ],
    faqs: [
      {
        question: '¿Qué pasa cuando expira la vigencia del pack?',
        answer: 'El sistema notifica al alumno que su abono está próximo a vencer para que realice la renovación.',
      },
    ],
  },
  finance: {
    title: 'Guía de Control Financiero',
    subtitle: 'Métricas de ingresos, egresos y medios de pago',
    badge: 'Control Financiero',
    summary: 'Supervisa la rentabilidad de tu estudio con gráficos de facturación, desglose de cobros y cumplimiento de metas.',
    steps: [
      {
        title: '1. Resumen de Facturación',
        description: 'Revisa el total de ingresos cobrados, saldo pendiente de cobro y egresos del mes.',
      },
      {
        title: '2. Desglose por Medio de Pago',
        description: 'Analiza qué porcentaje de pagos ingresa por MercadoPago, transferencia bancaria o efectivo.',
      },
      {
        title: '3. Meta Mensual',
        description: 'Establece un objetivo de facturación mensual y sigue el porcentaje de avance en tiempo real.',
      },
    ],
    faqs: [
      {
        question: '¿Se pueden registrar gastos del estudio?',
        answer: 'Sí, puedes asentar egresos (mantenimiento, alquiler, insumos) para calcular el balance neto real.',
      },
    ],
  },
  settings: {
    title: 'Guía de Configuración & Plantillas WhatsApp',
    subtitle: 'Ajustes de marca, políticas de cancelación y mensajes dinámicos',
    badge: 'Configuración',
    summary: 'Personaliza los datos de tu estudio, la ventana horaria de cancelación de turnos y las plantillas automáticas de WhatsApp.',
    steps: [
      {
        title: '1. Perfil del Estudio & Slug',
        description: 'Configura el nombre de tu centro, logo, teléfono oficial y enlace público personalizado (sermoa.app/sermoa).',
      },
      {
        title: '2. Ventana de Cancelación',
        description: 'Establece con cuántas horas de anticipación un alumno puede cancelar su turno recuperando el crédito (ej: 2 horas).',
      },
      {
        title: '3. Plantillas Dinámicas de WhatsApp',
        description: 'Edita los textos automáticos de Bienvenida, Recordatorio de Clase Hoy, Aviso de Cupo en Espera y Cobranzas con variables dinámicas ({{nombre}}, {{clase}}, {{horario}}).',
      },
    ],
    faqs: [
      {
        question: '¿Cómo pruebo una plantilla de WhatsApp?',
        answer: 'En la pestaña Plantillas de WhatsApp cuentas con un botón de vista previa y un botón "Probar Envío" que abre un mensaje de prueba en WhatsApp Web/Móvil.',
      },
    ],
  },
  checkin: {
    title: 'Guía del Check-in Inteligente con GPS',
    subtitle: 'Cartel QR de recepción y validación de presencia',
    badge: 'Check-in QR',
    summary: 'Asegura que los alumnos registren su presencia únicamente al estar físicamente en la recepción del estudio.',
    steps: [
      {
        title: '1. Imprimir Cartel de Recepción',
        description: 'Abre el modal de Cartel QR y pulsa "Imprimir Cartel". Colócalo en el mostrador o puerta de entrada de tu sede.',
      },
      {
        title: '2. Escaneo por el Alumno',
        description: 'El alumno abre la cámara de su celular o el lector de su App SERMOA y escanea el código.',
      },
      {
        title: '3. Validación GPS Automática',
        description: 'El sistema calcula la distancia con la fórmula Haversine. Si está a menos de 75 metros, valida el check-in y dispara la confirmación de asistencia.',
      },
    ],
    faqs: [
      {
        question: '¿Qué pasa si el alumno escanea el QR desde su casa?',
        answer: 'El validador de geolocalización detecta que está fuera del radio de 75 metros y bloquea el check-in con una advertencia.',
      },
    ],
  },
};

interface ModuleHelpDrawerProps {
  isOpen: boolean;
  moduleId: HelpModuleId;
  onClose: () => void;
}

export const ModuleHelpDrawer: React.FC<ModuleHelpDrawerProps> = ({
  isOpen,
  moduleId,
  onClose,
}) => {
  if (!isOpen) return null;

  const guide = HELP_GUIDES[moduleId] || HELP_GUIDES.students;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-xs animate-fade-in flex justify-end">
      <div className="bg-white w-full max-w-lg h-full shadow-2xl flex flex-col animate-fade-in border-l border-slate-200">
        
        {/* Drawer Header */}
        <div className="p-6 border-b border-slate-100 flex items-start justify-between bg-slate-50/80">
          <div className="flex items-start space-x-3.5 pr-4">
            <div className="w-11 h-11 rounded-2xl bg-brand-50 text-brand-700 flex items-center justify-center font-bold text-lg shrink-0 shadow-xs border border-brand-100">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-brand-700 bg-brand-100/60 px-2 py-0.5 rounded-full border border-brand-200">
                {guide.badge}
              </span>
              <h3 className="text-lg font-black text-slate-900 mt-1 leading-snug">
                {guide.title}
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                {guide.subtitle}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Scrollable Content */}
        <div className="p-6 space-y-6 flex-1 overflow-y-auto scrollbar-none text-xs">
          
          {/* Summary Box */}
          <div className="p-4 bg-brand-50/50 border border-brand-100/80 rounded-2xl flex items-start space-x-3">
            <Sparkles className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" />
            <p className="text-slate-700 leading-relaxed font-semibold">
              {guide.summary}
            </p>
          </div>

          {/* Step-by-Step Flow */}
          <div className="space-y-4">
            <h4 className="font-extrabold text-slate-900 text-sm flex items-center space-x-2">
              <span className="text-slate-500">📌</span>
              <span>Flujo de Trabajo Paso a Paso</span>
            </h4>

            <div className="space-y-3">
              {guide.steps.map((step, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-soft space-y-1.5"
                >
                  <h5 className="font-extrabold text-slate-900 text-xs text-brand-800">
                    {step.title}
                  </h5>
                  <p className="text-slate-600 text-[11px] leading-relaxed">
                    {step.description}
                  </p>
                  {step.tip && (
                    <div className="pt-2 border-t border-slate-100 flex items-center space-x-1.5 text-[10px] text-brand-700 font-bold">
                      <Lightbulb className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                      <span>{step.tip}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* FAQs */}
          {guide.faqs && guide.faqs.length > 0 && (
            <div className="space-y-3 pt-2">
              <h4 className="font-extrabold text-slate-900 text-sm flex items-center space-x-2">
                <span className="text-slate-500">❓</span>
                <span>Preguntas Frecuentes</span>
              </h4>

              <div className="space-y-2.5">
                {guide.faqs.map((faq, i) => (
                  <div
                    key={i}
                    className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/60 space-y-1"
                  >
                    <div className="font-bold text-slate-800 text-xs">
                      {faq.question}
                    </div>
                    <div className="text-slate-600 text-[11px] leading-relaxed">
                      {faq.answer}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Drawer Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
          <span className="text-[11px] text-slate-400 font-medium">
            Centro de Ayuda SERMOA App
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-xs"
          >
            Entendido
          </button>
        </div>

      </div>
    </div>
  );
};
