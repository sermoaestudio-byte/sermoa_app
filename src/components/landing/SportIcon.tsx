import React from 'react';

interface SportIconProps {
  type: string;
  className?: string;
  color?: string;
}

export const SportIcon: React.FC<SportIconProps> = ({ type, className = 'w-7 h-7', color = '#5EBA8C' }) => {
  switch (type) {
    // 1. Pelvis / Cadera
    case 'pelvis':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <path d="M5 6c0 3 2 5 4 5s3-1 3-3-1-3-3-3-4 1-4 1z" />
          <path d="M19 6c0 3-2 5-4 5s-3-1-3-3 1-3 3-3 4 1 4 1z" />
          <path d="M9 11c0 4 2 7 3 7s3-3 3-7" />
          <path d="M12 4v4" />
          <circle cx="12" cy="18" r="1" fill={color} />
        </svg>
      );

    // 2. Torso / Tronco
    case 'torso':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <path d="M7 4h10l-1 8c-.5 3-2.5 5-4 5s-3.5-2-4-5L7 4z" />
          <path d="M9 9h6" />
          <circle cx="12" cy="12" r="1.5" fill={color} />
          <path d="M6 4c-1 0-2 .5-2 1.5s1 2.5 2 2.5" />
          <path d="M18 4c1 0 2 .5 2 1.5s-1 2.5-2 2.5" />
        </svg>
      );

    // 3. Caderas / Hips
    case 'hips':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <path d="M6 19l4-12 2 3-1 9" />
          <path d="M18 19l-4-12-2 3 1 9" />
          <path d="M9 7h6" />
          <circle cx="10" cy="7" r="1.5" />
          <circle cx="14" cy="7" r="1.5" />
        </svg>
      );

    // 4. Tobillo y pie / Foot
    case 'foot':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <path d="M9 4v7c0 1.5.5 2.5 2 3l7 1.5c1 .2 1.8 1.1 1.8 2.1 0 1.3-1.1 2.4-2.4 2.4H6.5C5.1 20 4 18.9 4 17.5c0-1.8 1.2-3.3 3-3.5L9 13.5V4z" />
          <circle cx="9" cy="4" r="1" />
        </svg>
      );

    // 5. Apoyos / Botines (Fútbol)
    case 'boots':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <path d="M4 15l2-8h4l1 4h5c2 0 4 1.5 4 4v1H4v-1z" />
          <path d="M6 16v2" />
          <path d="M10 16v2" />
          <path d="M15 16v2" />
          <path d="M18 16v2" />
        </svg>
      );

    // 6. Agilidad / Coordinación
    case 'agility':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <circle cx="12" cy="5" r="2.5" />
          <path d="M8 12l4-2 3 2 4 4" />
          <path d="M9 14l-3 6" />
          <path d="M14 14l2 6" />
          <path d="M5 9l3 3" />
        </svg>
      );

    // 7. Movimientos laterales
    case 'lateral':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <path d="M8 12l-4 0 3-3m-3 3l3 3" />
          <path d="M16 12l4 0-3-3m3 3l-3 3" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      );

    // 8. Rotación del tronco
    case 'rotation':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
          <path d="M3 3v5h5" />
          <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
          <path d="M21 21v-5h-5" />
          <circle cx="12" cy="12" r="2" />
        </svg>
      );

    // 9. Movilidad de hombros
    case 'shoulders':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <circle cx="12" cy="6" r="2" />
          <path d="M5 11c1.5-2 4-3 7-3s5.5 1 7 3" />
          <path d="M5 11l2 6" />
          <path d="M19 11l-2 6" />
          <circle cx="6" cy="11" r="1.5" />
          <circle cx="18" cy="11" r="1.5" />
        </svg>
      );

    // 10. Equilibrio dinámico
    case 'balance':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <circle cx="12" cy="5" r="2" />
          <path d="M4 11h16" />
          <path d="M12 7v10" />
          <path d="M9 20l3-3 3 3" />
          <circle cx="5" cy="11" r="1" />
          <circle cx="19" cy="11" r="1" />
        </svg>
      );

    // 11. Coordinación intersegmentaria / Cadena cinética
    case 'kinetic':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <circle cx="6" cy="6" r="2.5" />
          <circle cx="18" cy="8" r="2.5" />
          <circle cx="12" cy="18" r="2.5" />
          <path d="M8.2 7.1l7.6 1.4" strokeDasharray="2 2" />
          <path d="M16.5 10.2l-3.3 5.7" strokeDasharray="2 2" />
          <path d="M7.4 8.2l3.4 7.6" strokeDasharray="2 2" />
        </svg>
      );

    // 12. Control postural
    case 'posture':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <circle cx="12" cy="4" r="2" />
          <path d="M12 6v14" />
          <path d="M8 10h8" />
          <path d="M9 20h6" />
          <circle cx="12" cy="11" r="1" fill={color} />
          <circle cx="12" cy="15" r="1" fill={color} />
        </svg>
      );

    // 13. Movilidad de columna
    case 'spine':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <path d="M12 3c-1.5 2-1.5 4 0 6s1.5 4 0 6-1.5 4 0 6" />
          <circle cx="12" cy="4" r="1.2" fill={color} />
          <circle cx="12" cy="9" r="1.2" fill={color} />
          <circle cx="12" cy="15" r="1.2" fill={color} />
          <circle cx="12" cy="20" r="1.2" fill={color} />
        </svg>
      );

    // 14. Control de zona media / Core
    case 'core':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <circle cx="12" cy="12" r="7" />
          <circle cx="12" cy="12" r="3" />
          <path d="M12 5v2" />
          <path d="M12 17v2" />
          <path d="M5 12h2" />
          <path d="M17 12h2" />
        </svg>
      );

    // 15. Alineación corporal
    case 'alignment':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <line x1="12" y1="2" x2="12" y2="22" strokeDasharray="3 3" />
          <circle cx="12" cy="5" r="2" />
          <path d="M9 11h6" />
          <path d="M10 17h4" />
        </svg>
      );

    // 16. Movilidad articular
    case 'joints':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <circle cx="7" cy="7" r="3" />
          <circle cx="17" cy="17" r="3" />
          <path d="M9.5 9.5l5 5" />
          <path d="M14 7a5 5 0 0 1 3 3" />
          <path d="M7 14a5 5 0 0 0 3 3" />
        </svg>
      );

    // 17. Estabilidad en movimiento
    case 'stability':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <path d="M12 2l7 4v6c0 5-3.5 9.5-7 10-3.5-.5-7-5-7-10V6l7-4z" />
          <circle cx="12" cy="12" r="2.5" />
        </svg>
      );

    // 18. Coordinación y precisión
    case 'precision':
    default:
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <circle cx="12" cy="12" r="8" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="12" cy="12" r="1.5" fill={color} />
        </svg>
      );
  }
};
