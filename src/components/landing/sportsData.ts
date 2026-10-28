export interface SportCapacity {
  title: string;
  iconName: string; // for custom SVG rendering or Lucide icon
}

export interface SportBenefitItem {
  title: string;
  description: string;
}

export interface SportDetailData {
  id: string; // 'running' | 'futbol' | 'tenis-padel' | 'ciclismo' | 'gimnasio-fuerza'
  badge: string;
  badgeIcon: string;
  title: string;
  introduction: string;
  heroImage: string;
  accentColor: string;
  capacities: {
    title: string;
    iconType: 'pelvis' | 'torso' | 'hips' | 'foot' | 'boots' | 'agility' | 'lateral' | 'rotation' | 'shoulders' | 'balance' | 'kinetic' | 'posture' | 'spine' | 'core' | 'alignment' | 'joints' | 'stability' | 'precision';
  }[];
  benefits: SportBenefitItem[];
  closing: {
    title: string;
    description: string;
    quote: string;
  };
}

export const SPORTS_DETAILS_DATA: Record<string, SportDetailData> = {
  running: {
    id: 'running',
    badge: 'Running',
    badgeIcon: 'running',
    title: 'Tu carrera, con más estabilidad.',
    introduction:
      'El Pilates puede complementar tu entrenamiento de running mediante ejercicios de control corporal, movilidad y fuerza adaptados a las exigencias de la carrera.',
    heroImage:
      'https://images.unsplash.com/photo-1486218119243-13883505764c?q=80&w=1200&auto=format&fit=crop',
    accentColor: '#5EBA8C',
    capacities: [
      { title: 'Estabilidad de la pelvis', iconType: 'pelvis' },
      { title: 'Control del tronco', iconType: 'torso' },
      { title: 'Movilidad de caderas', iconType: 'hips' },
      { title: 'Movilidad de tobillos y pies', iconType: 'foot' }
    ],
    benefits: [
      {
        title: 'Mayor control en cada zancada',
        description:
          'Trabajá la coordinación entre el tronco y la pelvis para acompañar los movimientos repetitivos de la carrera.'
      },
      {
        title: 'Movilidad para correr con comodidad',
        description:
          'Incorporá movimientos controlados que acompañen la movilidad necesaria de caderas y tobillos.'
      },
      {
        title: 'Un complemento para tus kilómetros',
        description:
          'Sumá una práctica diferente a tus sesiones de carrera, enfocada en el control corporal y la calidad del movimiento.'
      }
    ],
    closing: {
      title: 'Cada zancada empieza con el control de tu cuerpo.',
      description:
        'Adaptá tus clases a tu experiencia, tus objetivos y tu rutina de running.',
      quote:
        'No se trata solo de correr más, sino de complementar tu entrenamiento con movimiento consciente.'
    }
  },
  futbol: {
    id: 'futbol',
    badge: 'Fútbol',
    badgeIcon: 'futbol',
    title: 'Movete con control dentro y fuera de la cancha.',
    introduction:
      'El fútbol combina desplazamientos, aceleraciones, frenadas y movimientos en distintas direcciones. El Pilates puede complementar ese entrenamiento trabajando el control del cuerpo en movimiento.',
    heroImage:
      'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?q=80&w=1200&auto=format&fit=crop',
    accentColor: '#475B44',
    capacities: [
      { title: 'Control de apoyos', iconType: 'boots' },
      { title: 'Coordinación corporal', iconType: 'agility' },
      { title: 'Movilidad de caderas', iconType: 'hips' },
      { title: 'Control de movimientos laterales', iconType: 'lateral' }
    ],
    benefits: [
      {
        title: 'Control en los cambios de dirección',
        description:
          'Practicá movimientos controlados que acompañen las exigencias de girar, desplazarte y cambiar de posición.'
      },
      {
        title: 'Conciencia de los apoyos',
        description:
          'Trabajá la posición de las piernas y el control del cuerpo durante distintos movimientos.'
      },
      {
        title: 'Movilidad para las acciones del juego',
        description:
          'Incorporá ejercicios de movilidad adaptados a las necesidades de caderas y piernas.'
      }
    ],
    closing: {
      title: 'Prepará tu cuerpo para cada movimiento.',
      description:
        'Complementá tus prácticas en cancha con un trabajo corporal consciente y adaptado a vos.',
      quote: 'Cada movimiento cuenta, dentro y fuera de la cancha.'
    }
  },
  'tenis-padel': {
    id: 'tenis-padel',
    badge: 'Tenis y pádel',
    badgeIcon: 'racquet',
    title: 'Controlá cada golpe, acompañá cada movimiento.',
    introduction:
      'Los deportes de raqueta requieren rotaciones del tronco, desplazamientos rápidos y movimientos repetidos de brazos. El Pilates puede complementar la preparación de esas capacidades.',
    heroImage:
      'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?q=80&w=1200&auto=format&fit=crop',
    accentColor: '#8E654E',
    capacities: [
      { title: 'Rotación del tronco', iconType: 'rotation' },
      { title: 'Movilidad de hombros', iconType: 'shoulders' },
      { title: 'Equilibrio dinámico', iconType: 'balance' },
      { title: 'Coordinación entre segmentos corporales', iconType: 'kinetic' }
    ],
    benefits: [
      {
        title: 'Rotaciones más controladas',
        description:
          'Practicá movimientos del tronco con atención a la coordinación entre hombros, columna y pelvis.'
      },
      {
        title: 'Movilidad para los golpes',
        description:
          'Trabajá la movilidad de hombros y la coordinación del tren superior según tus necesidades.'
      },
      {
        title: 'Estabilidad durante los desplazamientos',
        description:
          'Incorporá ejercicios que desafíen el equilibrio mientras cambiás de posición y distribuís el peso corporal.'
      }
    ],
    closing: {
      title: 'Cada golpe también se construye desde el control corporal.',
      description:
        'Sumá una práctica complementaria a tus partidos y entrenamientos de tenis o pádel.',
      quote: 'Precisión en el movimiento, conciencia en cada golpe.'
    }
  },
  ciclismo: {
    id: 'ciclismo',
    badge: 'Ciclismo',
    badgeIcon: 'bike',
    title: 'Encontrá el equilibrio en cada kilómetro.',
    introduction:
      'Pasar muchas horas sobre la bicicleta implica mantener una posición sostenida y realizar movimientos repetitivos de las piernas. El Pilates puede acompañar tu preparación con trabajo postural y movilidad.',
    heroImage:
      'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?q=80&w=1200&auto=format&fit=crop',
    accentColor: '#5D707F',
    capacities: [
      { title: 'Control postural', iconType: 'posture' },
      { title: 'Movilidad de columna', iconType: 'spine' },
      { title: 'Movilidad de caderas', iconType: 'hips' },
      { title: 'Control de la zona media', iconType: 'core' }
    ],
    benefits: [
      {
        title: 'Atención a la postura',
        description:
          'Trabajá el control postural y la alineación corporal mediante ejercicios adaptados a tus necesidades.'
      },
      {
        title: 'Movilidad más allá de la bicicleta',
        description:
          'Incorporá movimientos de columna y caderas que complementen las posiciones sostenidas del ciclismo.'
      },
      {
        title: 'Variedad en tu preparación',
        description:
          'Alterná las sesiones de bicicleta con ejercicios controlados que aporten variedad a tu preparación física.'
      }
    ],
    closing: {
      title: 'Tu entrenamiento también necesita otros movimientos.',
      description:
        'Complementá tus recorridos con clases adaptadas a tus objetivos y a tu experiencia sobre la bicicleta.',
      quote:
        'Cada kilómetro es movimiento. Regalale a tu cuerpo nuevas formas de moverse.'
    }
  },
  'gimnasio-fuerza': {
    id: 'gimnasio-fuerza',
    badge: 'Gimnasio y fuerza',
    badgeIcon: 'dumbbell',
    title: 'Sumá control a cada repetición.',
    introduction:
      'El entrenamiento de fuerza forma parte de muchas rutinas. El Pilates puede complementarlo mediante ejercicios que priorizan la precisión, el control del movimiento y la movilidad.',
    heroImage:
      'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1200&auto=format&fit=crop',
    accentColor: '#4A5568',
    capacities: [
      { title: 'Control de la alineación corporal', iconType: 'alignment' },
      { title: 'Movilidad articular', iconType: 'joints' },
      { title: 'Estabilidad durante el movimiento', iconType: 'stability' },
      { title: 'Coordinación y precisión', iconType: 'precision' }
    ],
    benefits: [
      {
        title: 'Más atención a la técnica',
        description:
          'Explorá movimientos lentos y controlados que te ayuden a reconocer la posición y la alineación de tu cuerpo.'
      },
      {
        title: 'Movilidad como complemento',
        description:
          'Incorporá ejercicios de movilidad según las articulaciones y los movimientos que forman parte de tu rutina.'
      },
      {
        title: 'Variedad en tu preparación',
        description:
          'Combiná el trabajo con cargas con una práctica centrada en el control, la precisión y la conciencia corporal.'
      }
    ],
    closing: {
      title: 'La fuerza también se acompaña con control.',
      description:
        'Integrá el Pilates a tu rutina de gimnasio según tus objetivos, tu nivel y las actividades que realizás.',
      quote: 'Entrená la fuerza. Explorá el control. Movete con conciencia.'
    }
  }
};
