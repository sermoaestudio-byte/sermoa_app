import React from 'react';
import {
  TbBallFootball,
  TbRun,
  TbBike,
  TbBarbell
} from 'react-icons/tb';

interface SportPictogramProps {
  sportId: string;
  className?: string;
  color?: string;
  accentColor?: string;
}

/**
 * SportPictogram - Iconografía profesional integrada desde 'react-icons' (Tabler Icons & Material Design)
 * Diseño estandarizado con amplia variedad y proporciones consistentes.
 */
export const SportPictogram: React.FC<SportPictogramProps> = ({
  sportId,
  className = 'w-10 h-10',
  color = '#475B44',
  accentColor = '#C18749'
}) => {
  const commonProps = {
    className,
    style: { color },
    strokeWidth: 1.5
  };

  switch (sportId) {
    // 1. FÚTBOL: Balón reglamentario de fútbol (Tabler Icons)
    case 'futbol':
      return <TbBallFootball {...commonProps} />;

    // 2. TENIS Y PÁDEL: Raqueta / Pala de pádel y pelota (sin marco)
    case 'tenis-padel':
      return (
        <svg
          viewBox="0 0 24 24"
          className={className}
          style={{ color }}
          fill="currentColor"
        >
          <path d="M19.52 2.49C17.18.15 12.9.62 9.97 3.55c-1.6 1.6-2.52 3.87-2.54 5.46-.02 1.58.26 3.89-1.35 5.5l-4.24 4.24 1.42 1.42 4.24-4.24c1.61-1.61 3.92-1.33 5.5-1.35s3.86-.94 5.46-2.54c2.92-2.93 3.4-7.21 1.06-9.55m-9.2 9.19c-1.53-1.53-1.05-4.61 1.06-6.72s5.18-2.59 6.72-1.06c1.53 1.53 1.05 4.61-1.06 6.72s-5.18 2.59-6.72 1.06M18 17c.53 0 1.04.21 1.41.59.78.78.78 2.05 0 2.83-.37.37-.88.58-1.41.58s-1.04-.21-1.41-.59c-.78-.78-.78-2.05 0-2.83.37-.37.88-.58 1.41-.58m0-2a3.998 3.998 0 0 0-2.83 6.83c.78.78 1.81 1.17 2.83 1.17a3.998 3.998 0 0 0 2.83-6.83A4 4 0 0 0 18 15" />
        </svg>
      );

    // 3. RUNNING: Atleta corredor en movimiento (Tabler Icons)
    case 'running':
      return <TbRun {...commonProps} />;

    // 4. CICLISMO: Bicicleta deportiva (Tabler Icons)
    case 'ciclismo':
      return <TbBike {...commonProps} />;

    // 5. GIMNASIO Y FUERZA: Barra con pesas / Mancuerna (Tabler Icons)
    case 'gimnasio-fuerza':
    default:
      return <TbBarbell {...commonProps} />;
  }
};
