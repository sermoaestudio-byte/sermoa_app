// ==============================================================================
// WHATSAPP LINK & TEMPLATE GENERATOR
// ==============================================================================

/**
 * Reemplaza variables dinámicas en una plantilla de WhatsApp
 * Ej: {{nombre}}, {{clase}}, {{horario}}, {{sede}}, {{estudio}}, {{link}}
 */
export function formatWhatsAppTemplate(
  template: string,
  variables: Record<string, string>
): string {
  let result = template;
  for (const [key, value] of Object.entries(variables)) {
    const regex = new RegExp(`{{\\s*${key}\\s*}}`, 'gi');
    result = result.replace(regex, value || '');
  }
  return result;
}

/**
 * Limpia y normaliza el número de teléfono para WhatsApp (ej: 5491112345678)
 */
export function normalizePhoneForWhatsApp(phone: string): string {
  // Elimina caracteres no numéricos
  let clean = phone.replace(/\D/g, '');
  
  // Si comienza con 0 en Argentina, ajusta
  if (clean.startsWith('0')) {
    clean = clean.substring(1);
  }
  
  // Si no tiene código de país, asume Argentina (+54 9)
  if (clean.length === 10 && !clean.startsWith('54')) {
    clean = '549' + clean;
  }
  
  return clean;
}

/**
 * Genera el enlace directo wa.me con mensaje codificado
 */
export function createWhatsAppUrl(phone: string, message: string): string {
  const cleanPhone = normalizePhoneForWhatsApp(phone);
  const encodedText = encodeURIComponent(message);
  return `https://wa.me/${cleanPhone}?text=${encodedText}`;
}

/**
 * Abre directamente WhatsApp Web o App en una pestaña nueva
 */
export function openWhatsApp(phone: string, message: string): void {
  const url = createWhatsAppUrl(phone, message);
  window.open(url, '_blank', 'noopener,noreferrer');
}
