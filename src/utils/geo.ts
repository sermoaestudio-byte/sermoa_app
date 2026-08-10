// ==============================================================================
// GEOFENCING & GPS DISTANCE CALCULATOR (HAVERSINE FORMULA)
// ==============================================================================

/**
 * Calcula la distancia en metros entre dos coordenadas geográficas
 */
export function calculateDistanceMeters(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371e3; // Radio de la Tierra en metros
  const phi1 = (lat1 * Math.PI) / 180;
  const phi2 = (lat2 * Math.PI) / 180;
  const deltaPhi = ((lat2 - lat1) * Math.PI) / 180;
  const deltaLambda = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
    Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return Math.round(R * c);
}

/**
 * Verifica si las coordenadas del usuario están dentro del radio permitido de la sucursal
 */
export function isWithinGeofence(
  userLat: number,
  userLon: number,
  branchLat: number,
  branchLon: number,
  allowedRadiusMeters: number = 75
): { isInside: boolean; distanceMeters: number } {
  const distanceMeters = calculateDistanceMeters(userLat, userLon, branchLat, branchLon);
  return {
    isInside: distanceMeters <= allowedRadiusMeters,
    distanceMeters,
  };
}

/**
 * Formatea una distancia en metros o kilómetros para mostrar amigablemente
 */
export function formatDistance(meters: number): string {
  if (meters < 1000) {
    return `${meters} metros`;
  }
  return `${(meters / 1000).toFixed(2)} km`;
}

/**
 * Obtiene la posición GPS actual del navegador con Promesa
 */
export function getCurrentBrowserPosition(): Promise<{ latitude: number; longitude: number; accuracy: number }> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('La geolocalización no está soportada por este navegador o dispositivo.'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
        });
      },
      (error) => {
        let msg = 'No se pudo obtener tu ubicación GPS.';
        if (error.code === error.PERMISSION_DENIED) {
          msg = 'Permiso de ubicación denegado. Activa el GPS para poder registrar tu presencia en el estudio.';
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          msg = 'Información de ubicación no disponible en este momento.';
        } else if (error.code === error.TIMEOUT) {
          msg = 'Tiempo de espera agotado al consultar la ubicación.';
        }
        reject(new Error(msg));
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  });
}
