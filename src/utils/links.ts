// ==============================================================================
// SERMOA APP - DYNAMIC URL & SHAREABLE LINKS GENERATOR (LOCAL & VERCEL AUTO-DETECTION)
// ==============================================================================

/**
 * Obtiene la URL base de forma 100% dinámica:
 * - En local: http://localhost:5173 o IP de red local
 * - En Vercel: https://tu-proyecto.vercel.app o dominio personalizado
 * - Con fallback seguro si no existe window
 */
export function getAppBaseUrl(): string {
  // 1. Si está definida una variable de entorno específica para el dominio
  if (typeof import.meta !== 'undefined' && import.meta.env?.VITE_APP_URL) {
    return import.meta.env.VITE_APP_URL.replace(/\/+$/, '');
  }

  // 2. Detección automática en el navegador (Localhost, IP de Red, o Vercel)
  if (typeof window !== 'undefined' && window.location && window.location.origin) {
    return window.location.origin;
  }

  // 3. Fallback de producción
  return 'https://sermoa.app';
}

/**
 * Enlace público para que nuevos alumnos se registren y completen su ficha médica
 */
export function getRegisterLink(): string {
  return `${getAppBaseUrl()}/#registro`;
}

/**
 * Enlace del Portal de Alumnos para reservas de clases, ver rutinas y estado de cuenta
 */
export function getPortalLink(): string {
  return `${getAppBaseUrl()}/#portal-alumno`;
}

/**
 * Enlace directo para login de profesores y administradores
 */
export function getLoginLink(): string {
  return `${getAppBaseUrl()}/#login`;
}

/**
 * Enlace para reservar clases directamente
 */
export function getBookingLink(studioSlug: string = 'sermoa'): string {
  return `${getAppBaseUrl()}/#reservar/${studioSlug}`;
}

/**
 * Enlace del código QR impreso en recepción para check-in con GPS
 */
export function getCheckinQRLink(studioSlug: string = 'sermoa', branchId?: string): string {
  const branchParam = branchId ? `?branch=${branchId}` : '';
  return `${getAppBaseUrl()}/#checkin/${studioSlug}${branchParam}`;
}

/**
 * Plantilla de texto lista para pegar en la biografía de Instagram
 */
export function getInstagramBioText(studioName: string = 'SERMOA App'): string {
  const regLink = getRegisterLink();
  return `✨ ${studioName} | Pilates Reformer & Movimiento Consciente\n📲 ¡Solicita tu ingreso y completa tu ficha médica aquí!\n👉 ${regLink}`;
}

/**
 * Plantilla de WhatsApp para enviar a alumnos activos
 */
export function getWhatsAppPortalInviteText(studioName: string = 'SERMOA App'): string {
  const portalLink = getPortalLink();
  return `¡Hola! 👋 Te invitamos a ingresar al Portal de Alumnos de *${studioName}* para reservar tus clases, ver tu saldo y consultar tus rutinas aquí: ${portalLink}`;
}
