import React from 'react';

interface SportPictogramProps {
  sportId: string;
  className?: string;
  color?: string; // Color principal del icono
  accentColor?: string; // Color de acento o complementario
}

/**
 * SportPictogram - Pictogramas minimalistas vectoriales en silueta / line art
 * Diseñados especialmente para la estética boutique y cálida de Sermoa.
 */
export const SportPictogram: React.FC<SportPictogramProps> = ({
  sportId,
  className = 'w-16 h-16',
  color = '#475B44',
  accentColor = '#C18749'
}) => {
  switch (sportId) {
    // 1. RUNNING / CARRERA
    case 'running':
      return (
        <svg
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
        >
          {/* Cabeza en movimiento */}
          <circle cx="36" cy="14" r="5" fill={color} />
          {/* Torso inclinado hacia adelante */}
          <path
            d="M33 19L29 32L37 36"
            stroke={color}
            strokeWidth="3.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Brazo anterior y posterior */}
          <path
            d="M31 23L41 26L45 22"
            stroke={color}
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M30 25L23 27L19 33"
            stroke={color}
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Pierna delantera flexionada */}
          <path
            d="M29 32L38 41L47 39"
            stroke={color}
            strokeWidth="3.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Pierna trasera impulsándose */}
          <path
            d="M29 32L21 40L14 49"
            stroke={color}
            strokeWidth="3.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Líneas sutiles de dinámica / movimiento consciente */}
          <path
            d="M11 39C14 39 17 41 19 41"
            stroke={accentColor}
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0.8"
          />
          <path
            d="M8 44C12 44 15 46 17 46"
            stroke={accentColor}
            strokeWidth="1.8"
            strokeLinecap="round"
            opacity="0.6"
          />
        </svg>
      );

    // 2. FÚTBOL
    case 'futbol':
      return (
        <svg
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
        >
          {/* Cabeza */}
          <circle cx="26" cy="14" r="5" fill={color} />
          {/* Torso en torsión / pase */}
          <path
            d="M26 19L28 32L22 36"
            stroke={color}
            strokeWidth="3.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Brazos equilibrando el cuerpo */}
          <path
            d="M26 23L16 22L12 28"
            stroke={color}
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M27 23L36 24L41 19"
            stroke={color}
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Pierna de apoyo */}
          <path
            d="M28 32L27 43L24 51"
            stroke={color}
            strokeWidth="3.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Pierna de impacto / pase */}
          <path
            d="M28 32L37 38L44 42"
            stroke={color}
            strokeWidth="3.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Balón estilizado en línea minimalista */}
          <circle cx="49" cy="47" r="5" stroke={accentColor} strokeWidth="2.4" />
          <path
            d="M49 42V52M44 47H54"
            stroke={accentColor}
            strokeWidth="1.5"
            strokeLinecap="round"
            opacity="0.7"
          />
        </svg>
      );

    // 3. TENIS Y PÁDEL
    case 'tenis-padel':
      return (
        <svg
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
        >
          {/* Cabeza */}
          <circle cx="28" cy="14" r="5" fill={color} />
          {/* Torso en rotación hacia el impacto */}
          <path
            d="M28 19L29 32"
            stroke={color}
            strokeWidth="3.2"
            strokeLinecap="round"
          />
          {/* Brazo que ejecuta el golpe con raqueta */}
          <path
            d="M28 22L37 20L44 14"
            stroke={color}
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Raqueta / Pala de pádel minimalista */}
          <ellipse
            cx="48"
            cy="11"
            rx="5.5"
            ry="4.5"
            transform="rotate(-25 48 11)"
            stroke={accentColor}
            strokeWidth="2.4"
          />
          <path
            d="M44 14L46 12.5"
            stroke={accentColor}
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          {/* Brazo libre de equilibrio */}
          <path
            d="M27 23L20 27L16 25"
            stroke={color}
            strokeWidth="2.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Piernas en posición de apoyo dinámico */}
          <path
            d="M29 32L36 41L40 50"
            stroke={color}
            strokeWidth="3.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M29 32L21 40L16 48"
            stroke={color}
            strokeWidth="3.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Pelota con halo de dinamismo */}
          <circle cx="53" cy="20" r="2.2" fill={accentColor} />
        </svg>
      );

    // 4. CICLISMO
    case 'ciclismo':
      return (
        <svg
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
        >
          {/* Rueda trasera */}
          <circle cx="16" cy="44" r="9" stroke={accentColor} strokeWidth="2.4" />
          {/* Rueda delantera */}
          <circle cx="48" cy="44" r="9" stroke={accentColor} strokeWidth="2.4" />
          {/* Cuadro minimalista de bicicleta */}
          <path
            d="M16 44L28 44L38 34L25 34L16 44Z"
            stroke={accentColor}
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <path
            d="M28 44L35 27L48 44"
            stroke={accentColor}
            strokeWidth="2"
            strokeLinejoin="round"
          />
          {/* Manubrio */}
          <path
            d="M34 27L37 24H41"
            stroke={accentColor}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Asiento */}
          <path
            d="M23 31H27"
            stroke={color}
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          {/* Ciclista: Cabeza */}
          <circle cx="34" cy="15" r="4.5" fill={color} />
          {/* Ciclista: Torso en postura aerodinámica / alineación */}
          <path
            d="M32 19L25 31"
            stroke={color}
            strokeWidth="3.2"
            strokeLinecap="round"
          />
          {/* Brazo al manubrio */}
          <path
            d="M31 21L37 25"
            stroke={color}
            strokeWidth="2.8"
            strokeLinecap="round"
          />
          {/* Pierna pedaleando */}
          <path
            d="M25 31L31 38L28 44"
            stroke={color}
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );

    // 5. GIMNASIO Y ENTRENAMIENTO DE FUERZA
    case 'gimnasio-fuerza':
    default:
      return (
        <svg
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
        >
          {/* Barra / Pesa kettlebell estilizada en la parte superior */}
          <path
            d="M12 20H52"
            stroke={accentColor}
            strokeWidth="2.6"
            strokeLinecap="round"
          />
          <rect x="9" y="16" width="3" height="8" rx="1.5" fill={accentColor} />
          <rect x="52" y="16" width="3" height="8" rx="1.5" fill={accentColor} />
          <rect x="13" y="17.5" width="2.5" height="5" rx="1" fill={accentColor} />
          <rect x="48.5" y="17.5" width="2.5" height="5" rx="1" fill={accentColor} />

          {/* Atleta en postura de control de fuerza / alineación */}
          <circle cx="32" cy="13" r="4.8" fill={color} />
          {/* Torso vertical alineado con la columna */}
          <path
            d="M32 18V33"
            stroke={color}
            strokeWidth="3.2"
            strokeLinecap="round"
          />
          {/* Brazos sujetando la barra con simetría */}
          <path
            d="M20 20L27 22L32 20L37 22L44 20"
            stroke={color}
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Piernas en sentadilla / apoyo firme */}
          <path
            d="M32 33L24 41L23 50"
            stroke={color}
            strokeWidth="3.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M32 33L40 41L41 50"
            stroke={color}
            strokeWidth="3.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Centro de gravedad / core estable */}
          <circle cx="32" cy="27" r="2" fill={accentColor} opacity="0.8" />
        </svg>
      );
  }
};
