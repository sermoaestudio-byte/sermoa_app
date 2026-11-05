import React from 'react';
import {
  TbBodyScan,
  TbRotate2,
  TbShieldCheck,
  TbTarget,
  TbScale,
  TbStretching,
  TbRotateClockwise,
  TbWalk,
  TbShoe,
  TbActivity,
  TbArrowsLeftRight,
  TbRotate360,
  TbArrowsMaximize,
  TbVectorTriangle,
  TbYoga,
  TbWaveSine,
  TbFocusCentered
} from 'react-icons/tb';

interface SportIconProps {
  type: string;
  className?: string;
  color?: string;
}

/**
 * SportIcon - Iconografía profesional para Capacidades Deportivas / Biomecánicas
 * Integrada con la librería estándar Tabler Icons ('react-icons/tb')
 */
export const SportIcon: React.FC<SportIconProps> = ({
  type,
  className = 'w-7 h-7',
  color = '#5EBA8C'
}) => {
  const commonProps = {
    className,
    style: { color },
    strokeWidth: 1.75
  };

  switch (type) {
    // 1. Pelvis / Cadera
    case 'pelvis':
      return <TbScale {...commonProps} />;

    // 2. Torso / Tronco
    case 'torso':
      return <TbStretching {...commonProps} />;

    // 3. Caderas / Hips
    case 'hips':
      return <TbRotateClockwise {...commonProps} />;

    // 4. Tobillo y pie / Foot
    case 'foot':
      return <TbWalk {...commonProps} />;

    // 5. Apoyos / Botines (Fútbol)
    case 'boots':
      return <TbShoe {...commonProps} />;

    // 6. Agilidad / Coordinación
    case 'agility':
      return <TbActivity {...commonProps} />;

    // 7. Movimientos laterales
    case 'lateral':
      return <TbArrowsLeftRight {...commonProps} />;

    // 8. Rotación del tronco
    case 'rotation':
      return <TbRotate360 {...commonProps} />;

    // 9. Movilidad de hombros
    case 'shoulders':
      return <TbArrowsMaximize {...commonProps} />;

    // 10. Equilibrio dinámico
    case 'balance':
      return <TbScale {...commonProps} />;

    // 11. Coordinación intersegmentaria / Cadena cinética
    case 'kinetic':
      return <TbVectorTriangle {...commonProps} />;

    // 12. Control postural
    case 'posture':
      return <TbYoga {...commonProps} />;

    // 13. Movilidad de columna
    case 'spine':
      return <TbWaveSine {...commonProps} />;

    // 14. Control de zona media / Core
    case 'core':
      return <TbFocusCentered {...commonProps} />;

    // 15. Alineación corporal
    case 'alignment':
      return <TbBodyScan {...commonProps} />;

    // 16. Movilidad articular
    case 'joints':
      return <TbRotate2 {...commonProps} />;

    // 17. Estabilidad en movimiento
    case 'stability':
      return <TbShieldCheck {...commonProps} />;

    // 18. Coordinación y precisión
    case 'precision':
    default:
      return <TbTarget {...commonProps} />;
  }
};
