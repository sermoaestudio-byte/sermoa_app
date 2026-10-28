import React, { useEffect, useState } from 'react';
import { useStudioStore } from '../../store/studioStore';
import { SportDetailModal } from './SportDetailModal';
import { SportPictogram } from './SportPictogram';
import { SPORTS_DETAILS_DATA } from './sportsData';
import {
  CheckCircle2,
  Sparkles,
  Heart,
  ShieldCheck,
  Users,
  Clock,
  MapPin,
  Phone,
  Mail,
  Instagram,
  Facebook,
  ArrowRight,
  Feather,
  Activity,
  Compass,
  Check,
  ChevronRight,
  Info,
  X
} from 'lucide-react';

interface LandingViewProps {
  onNavigate: (view: string) => void;
}

interface DisciplineModalData {
  title: string;
  badge: string;
  description: string;
  benefits: string[];
  duration: string;
  groupSize: string;
  level: string;
  image: string;
}

export const LandingView: React.FC<LandingViewProps> = ({ onNavigate }) => {
  const { studio } = useStudioStore();
  const [activeSection, setActiveSection] = useState('');
  const [selectedDiscipline, setSelectedDiscipline] = useState<DisciplineModalData | null>(null);
  const [activeSportModal, setActiveSportModal] = useState<string | null>(null);

  const openLogin = () => {
    onNavigate('login');
    window.location.hash = '#login';
  };

  const openRegister = () => {
    onNavigate('registro');
    window.location.hash = '#registro';
  };

  // Scroll spy effect
  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll('section[id]');
      let current = '';
      sections.forEach((section) => {
        const sectionTop = (section as HTMLElement).offsetTop;
        if (window.scrollY >= sectionTop - 180) {
          current = section.getAttribute('id') || '';
        }
      });
      setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Simple reveal on scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('opacity-100', 'translate-y-0');
            entry.target.classList.remove('opacity-0', 'translate-y-8');
          }
        });
      },
      { threshold: 0.08 }
    );

    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const disciplines: DisciplineModalData[] = [
    {
      title: 'Pilates Reformer',
      badge: 'Grupos reducidos · Máx 5 personas',
      duration: '50-60 min',
      groupSize: 'Máximo 5 personas',
      level: 'Todos los niveles',
      image: '/hero-studio.jpg',
      description: 'El método clásico llevado a su máxima expresión en máquinas reformer de última generación con muelles ajustables. Desarrolla fuerza profunda en el centro (core), tonifica la musculatura alargándola y protege la columna con una alineación asistida impecable.',
      benefits: ['Alineación anatómica precisa con asistencia de resortes', 'Tonificación profunda sin impacto articular', 'Corrección postural inmediata y alivio lumbar']
    },
    {
      title: 'Pilates Mat & Funcional',
      badge: 'Grupos reducidos · Máx 10 personas',
      duration: '60 min',
      groupSize: 'Máximo 10 personas',
      level: 'Todos los niveles',
      image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=1200&auto=format&fit=crop',
      description: 'Sesiones sobre colchoneta que combinan el control motor y la respiración con implementos de resistencia (aros mágicos, bandas elásticas, pelotas de estabilidad y pesas ligeras). Un trabajo integral que potencia la fuerza funcional para tu día a día.',
      benefits: ['Dominio y control del propio peso corporal', 'Incremento sustancial de la estabilidad lumbo-pélvica', 'Variedad dinámica constante en cada sesión']
    },
    {
      title: 'Yoga & Consciencia Corporal',
      badge: 'Grupos reducidos · Máx 10 personas',
      duration: '60 min',
      groupSize: 'Máximo 10 personas',
      level: 'Todos los niveles',
      image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=1200&auto=format&fit=crop',
      description: 'Prácticas conscientes que integran secuencias fluidas (Vinyasa), posturas reconstituyentes (Hatha) y ejercicios guiados de respiración profunda (Pranayama) y meditación. Ideal para calmar el sistema nervioso y desbloquear articulaciones.',
      benefits: ['Calma mental y reducción comprobada de cortisol', 'Apertura de caderas, hombros y mayor elasticidad', 'Reconexión con la respiración diafragmática']
    },
    {
      title: 'Yoga Aéreo',
      badge: 'Grupos reducidos · Máx 6 personas',
      duration: '60 min',
      groupSize: 'Máximo 6 personas',
      level: 'Inicial a Intermedio',
      image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=1200&auto=format&fit=crop',
      description: 'Una experiencia transformadora en hamacas de tela suspendidas del techo. Permite descomprimir las vértebras gracias a la gravedad cero, facilita inversiones seguras y aporta una sensación inigualable de libertad, ligereza y concentración.',
      benefits: ['Descompresión vertebral y alivio de presión discal', 'Fortalecimiento de tren superior y core profundo', 'Superación de límites en un entorno de soporte seguro']
    }
  ];

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-stone-800 font-sans selection:bg-[#475B44] selection:text-white overflow-x-hidden antialiased">

      {/* 1. HEADER / NAVBAR */}
      <header className="fixed top-0 left-0 right-0 bg-[#FDFBF7]/90 backdrop-blur-md z-50 border-b border-[#EAE2D5]/70 transition-all">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">

          {/* Logo */}
          <div
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <img
              src="/logo-login.png"
              alt={studio?.name || 'Sermoa Estudio'}
              className="h-14 sm:h-16 w-auto object-contain transition-transform group-hover:scale-105"
            />
          </div>

          {/* Menú de navegación desktop */}
          <nav className="hidden lg:flex items-center gap-8 font-medium text-sm text-stone-600">
            <a
              href="#filosofia"
              className={`transition-colors hover:text-[#475B44] ${activeSection === 'filosofia' ? 'text-[#475B44] font-semibold' : ''}`}
            >
              Nosotros
            </a>
            <a
              href="#disciplinas"
              className={`transition-colors hover:text-[#475B44] ${activeSection === 'disciplinas' ? 'text-[#475B44] font-semibold' : ''}`}
            >
              Disciplinas
            </a>
            <a
              href="#beneficios"
              className={`transition-colors hover:text-[#475B44] ${activeSection === 'beneficios' ? 'text-[#475B44] font-semibold' : ''}`}
            >
              Beneficios
            </a>
            <a
              href="#contacto"
              className={`transition-colors hover:text-[#475B44] ${activeSection === 'contacto' ? 'text-[#475B44] font-semibold' : ''}`}
            >
              Contacto
            </a>
          </nav>

          {/* Botones de acción solicitados */}
          <div className="flex items-center gap-3 sm:gap-4">
            <button
              onClick={openLogin}
              className="text-xs sm:text-sm font-semibold text-stone-700 hover:text-stone-900 bg-transparent hover:bg-stone-200/50 border border-stone-300 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full transition-all active:scale-95 shadow-sm"
            >
              Tengo usuario
            </button>
            <button
              onClick={openRegister}
              className="text-xs sm:text-sm font-semibold text-white bg-[#475B44] hover:bg-[#384836] px-4 sm:px-6 py-2 sm:py-2.5 rounded-full shadow-md hover:shadow-lg transition-all active:scale-95 flex items-center gap-1.5"
            >
              <span>Quiero registrarme</span>

            </button>
          </div>

        </div>
      </header>

      <main className="pt-20">

        {/* 2. HERO SECTION ENVOLVENTE */}
        <section className="relative px-4 sm:px-6 pt-6 pb-12 sm:pb-16 max-w-7xl mx-auto">
          <div className="relative rounded-3xl sm:rounded-[2.5rem] overflow-hidden shadow-2xl min-h-[440px] sm:min-h-[540px] md:min-h-[600px] flex items-end">

            {/* Foto panorámica de alta calidad del estudio */}
            <img
              src="/hero-studio.jpg"
              alt="Estudio de Pilates Sermoa"
              className="absolute inset-0 w-full h-full object-cover object-center scale-100 filter brightness-95"
            />

            {/* Overlay gradiente envolvente cálido y orgánico */}
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-stone-900/50 to-stone-950/20" />
            <div className="absolute inset-0 bg-gradient-to-r from-stone-950/60 via-transparent to-stone-950/30" />

            {/* Contenido sobre la imagen */}
            <div className="relative z-10 p-6 sm:p-10 md:p-16 max-w-3xl text-white">



              <h1 className="text-3xl sm:text-5xl md:text-6xl font-light tracking-tight leading-[1.15] mb-4 text-stone-50">
                Más que movimiento, <br />
                <span className="font-serif italic font-normal text-[#E8DCC4]">es equilibrio.</span>
              </h1>

              <p className="text-sm sm:text-base text-stone-200/90 max-w-xl leading-relaxed mb-6 font-light">

                Bienvenidos a nuestro Studio..
              </p>



            </div>

          </div>
        </section>


        {/* 3. NARRATIVA Y DESCRIPCIÓN PRINCIPAL (Texto exacto solicitado por el usuario) */}
        <section id="filosofia" className="py-12 sm:py-20 px-6 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">

            {/* Texto de introducción */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 text-xs font-bold tracking-widest text-[#475B44] uppercase">
                <Feather className="w-4 h-4" />
                <span>¿Quienes somos? </span>
              </div>

              <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif text-stone-900 leading-tight">
                Cuidamos de tu salud <br className="hidden sm:inline" />
                <span className="italic font-normal text-[#5A6D56]">física y emocional.</span>
              </h2>

              <p className="text-stone-700 text-base sm:text-lg leading-relaxed">
                En <strong>Sermoa</strong> nuestro objetivo es acompañarte a mejorar tu postura, fortalecer tu musculatura, liberar tensiones y reconectar contigo a través de la práctica. En definitiva: <em>ayudarte a ganar calidad de vida</em>. Para ofrecerte siempre la máxima excelencia, nos mantenemos en constante formación e innovación.
              </p>

              <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
                Mantenemos nuestras sesiones dinámicas y efectivas incorporando continuamente nuevas técnicas, aparatos y elementos que aportan variedad, seguridad y calidad a tu práctica.
              </p>
            </div>

            {/* Tarjeta destacada: Atención personalizada y grupos reducidos */}
            <div className="lg:col-span-5">
              <div className="bg-[#FAF8F5] border border-[#EAE2D5] rounded-3xl p-6 sm:p-8 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#475B44]/5 rounded-bl-full pointer-events-none" />

                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-2xl bg-[#475B44]/10 text-[#475B44] flex items-center justify-center">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-stone-900 text-lg leading-snug">
                      Atención personalizada y grupos reducidos
                    </h3>
                    <p className="text-xs text-stone-500">Progreso seguro, cercano y constante</p>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-stone-600 mb-6 leading-relaxed">
                  Nos importa conocer las capacidades y metas de cada alumno para garantizar un progreso seguro, cercano y constante en cada sesión
                </p>

                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#F4EFE6]/60 border border-[#E8DFD1]">
                    <div className="flex items-center gap-3">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#8E654E]" />
                      <span className="text-sm font-medium text-stone-800">Pilates Reformer</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-[#EAE2D5] flex items-center justify-between text-xs text-stone-500">

                  <span className="font-medium text-[#475B44]">Ambiente climatizado</span>
                </div>

              </div>
            </div>

          </div>
        </section>


        {/* 5. TARJETAS DE BENEFICIOS - PILATES COMO COMPLEMENTO DEPORTIVO */}
        <section id="beneficios" className="py-16 sm:py-24 max-w-7xl mx-auto px-6 relative overflow-hidden">

          {/* Figuras geométricas y manchas orgánicas flotantes de fondo */}
          <div className="absolute top-1/4 -left-20 w-80 h-80 bg-[#5EBA8C]/10 rounded-full blur-3xl pointer-events-none animate-pulse-glow" />
          <div className="absolute bottom-10 -right-20 w-96 h-96 bg-[#F7C59F]/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute top-10 right-1/3 w-64 h-64 bg-[#1F2933]/5 rounded-full blur-2xl pointer-events-none" />

          <div className="text-center max-w-3xl mx-auto mb-16 relative z-10">
            <span className="text-xs font-bold tracking-widest text-[#475B44] uppercase block mb-2">
              Beneficios
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif text-stone-900 mb-4 tracking-tight">
              PILATES COMO COMPLEMENTO DEPORTIVO
            </h2>
            <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
              Cada deporte exige capacidades diferentes. El Pilates puede ayudarte a trabajar el control corporal, la movilidad y la estabilidad como complemento de tu actividad habitual.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 relative z-10">
            {[
              {
                id: 'futbol',
                title: 'Fútbol',
                capacities: ['Coordinación', 'Equilibrio', 'Control corporal'],
                desc: 'Complementá tu entrenamiento trabajando la coordinación, la estabilidad y el control del movimiento para acompañar los apoyos, los desplazamientos y los cambios de dirección propios del juego.',
                accentColor: '#475B44',
                image: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?q=80&w=800&auto=format&fit=crop',
                bgGradient: 'from-[#475B44]/15 via-[#475B44]/5 to-transparent'
              },
              {
                id: 'tenis-padel',
                title: 'Tenis y pádel',
                capacities: ['Rotación', 'Estabilidad', 'Movilidad'],
                desc: 'Trabajá el control del tronco durante los movimientos rotacionales, el equilibrio en los desplazamientos y la movilidad de hombros y caderas para complementar los gestos propios de los deportes de raqueta.',
                accentColor: '#8E654E',
                image: 'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?q=80&w=800&auto=format&fit=crop',
                bgGradient: 'from-[#8E654E]/15 via-[#8E654E]/5 to-transparent'
              },
              {
                id: 'running',
                title: 'Running',
                capacities: ['Estabilidad de pelvis', 'Control del tronco', 'Movilidad'],
                desc: 'Complementá tus kilómetros con ejercicios orientados al control corporal, la estabilidad de la zona media y la movilidad de caderas y tobillos, adaptados a tus necesidades como corredor.',
                accentColor: '#5EBA8C',
                image: 'https://images.unsplash.com/photo-1486218119243-13883505764c?q=80&w=800&auto=format&fit=crop',
                bgGradient: 'from-[#5EBA8C]/15 via-[#5EBA8C]/5 to-transparent'
              },
              {
                id: 'ciclismo',
                title: 'Ciclismo',
                capacities: ['Postura', 'Estabilidad del core', 'Movilidad'],
                desc: 'Sumá a tus salidas en bicicleta un trabajo de control postural, estabilidad del tronco y movilidad de caderas que complemente las exigencias de pasar tiempo sobre la bicicleta.',
                accentColor: '#5D707F',
                image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?q=80&w=800&auto=format&fit=crop',
                bgGradient: 'from-[#5D707F]/15 via-[#5D707F]/5 to-transparent'
              },
              {
                id: 'gimnasio-fuerza',
                title: 'Gimnasio y fuerza',
                capacities: ['Movilidad', 'Estabilidad', 'Control del movimiento'],
                desc: 'Complementá tus entrenamientos de fuerza con ejercicios de Pilates orientados a la movilidad, la estabilidad y el control corporal, según tus objetivos y necesidades.',
                accentColor: '#1F2933',
                image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=800&auto=format&fit=crop',
                bgGradient: 'from-[#1F2933]/15 via-[#1F2933]/5 to-transparent'
              }
            ].map((sport, i) => (
              <div
                key={i}
                onClick={() => setActiveSportModal(sport.id)}
                className="bg-[#FAF8F5] border border-[#EAE2D5] rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl hover:border-[#D6CAB7] transition-all duration-500 flex flex-col group hover:-translate-y-1.5 relative cursor-pointer"
              >
                {/* Degradé reactivo con hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${sport.bgGradient} opacity-20 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none z-10`} />

                {/* Pictograma minimalista en silueta (Sport Pictogram / Line Art) */}
                <div className="relative pt-7 pb-4 px-6 flex items-center justify-between border-b border-[#EAE2D5]/70 bg-gradient-to-b from-[#FAF8F5] to-[#F5F2EB]/50">
                  {/* Contenedor circular suave aesthetic con el pictograma vectorial */}
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#F5F2EB] border border-[#E8DFD1] shadow-xs flex items-center justify-center p-3 transition-transform duration-500 group-hover:scale-105 group-hover:shadow-md relative overflow-hidden">
                      {/* Resplandor sutil oliva/cálido de fondo */}
                      <div className="absolute inset-0 bg-[#5EBA8C]/10 rounded-full blur-xs pointer-events-none" />
                      <SportPictogram
                        sportId={sport.id}
                        className="w-10 h-10 sm:w-12 sm:h-12 relative z-10 transition-transform duration-500 group-hover:rotate-2"
                        color="#475B44"
                        accentColor="#C18749"
                      />
                    </div>

                    <div>
                      <span className="text-[10px] font-bold tracking-widest text-[#475B44] uppercase block mb-0.5">
                        DISCIPLINA
                      </span>
                      <h3 className="text-xl sm:text-2xl font-bold font-serif text-stone-900 tracking-tight">
                        {sport.title}
                      </h3>
                    </div>
                  </div>

                  <span className="text-[11px] font-semibold px-3 py-1.5 rounded-full bg-white/90 text-[#475B44] border border-[#E8DFD1] shadow-2xs group-hover:bg-[#475B44] group-hover:text-white transition-all shrink-0">
                    Saber más →
                  </span>
                </div>

                {/* Contenido de la tarjeta */}
                <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between relative z-20">
                  <div>
                    {/* Capacidades físicas que se trabajan con Pilates */}
                    <div className="mb-4">
                      <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block mb-2">
                        Capacidades:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {sport.capacities.map((cap, cIdx) => (
                          <span
                            key={cIdx}
                            className="text-xs font-semibold px-2.5 py-1 rounded-full border transition-colors"
                            style={{
                              backgroundColor: `${sport.accentColor}10`,
                              borderColor: `${sport.accentColor}25`,
                              color: sport.accentColor === '#FAF8F5' ? '#1F2933' : sport.accentColor
                            }}
                          >
                            {cap}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Descripción breve del complemento */}
                    <p className="text-stone-600 text-xs sm:text-sm leading-relaxed mb-4">
                      {sport.desc}
                    </p>
                  </div>

                  {/* Botón y barra inferior con toque de color */}
                  <div className="pt-4 border-t border-[#EAE2D5]/70 flex items-center justify-between">

                    <div
                      className="h-1.5 w-6 group-hover:w-12 rounded-full transition-all duration-500"
                      style={{ backgroundColor: sport.accentColor }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>


        {/* 6. BANNER DE LLAMADA A LA ACCIÓN CON COLOR CONTRASTADO */}
        <section className="px-4 sm:px-6 py-12 max-w-7xl mx-auto">
          <div className="bg-[#384836] text-stone-100 rounded-3xl sm:rounded-[2.5rem] p-8 sm:p-14 md:p-16 relative overflow-hidden shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="absolute -top-24 -right-24 w-80 h-80 bg-white/5 rounded-full pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-black/10 rounded-full pointer-events-none" />

            <div className="relative z-10 max-w-xl text-center md:text-left">
              <span className="text-xs font-bold tracking-widest uppercase text-[#D2DECF] block mb-2">
                Empieza hoy
              </span>
              <h2 className="text-2xl sm:text-4xl font-serif text-white mb-4 leading-snug">
                ¿Listo para transformar tu bienestar y calidad de vida?
              </h2>
              <p className="text-stone-300 text-sm sm:text-base leading-relaxed">
                Regístrate en nuestro portal de alumnos para elegir tus días, horarios y disciplinas preferidas.
              </p>
            </div>

            <div className="relative z-10 flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
              <button
                onClick={openRegister}
                className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-[#FAF8F5] text-stone-900 hover:bg-white text-sm font-semibold shadow-lg hover:shadow-xl transition-all active:scale-95 text-center"
              >
                Quiero registrarme
              </button>

            </div>
          </div>
        </section>

      </main>


      {/* 7. FOOTER ELEGANTE */}
      <footer id="contacto" className="bg-[#1C211D] text-stone-300 pt-16 pb-12 mt-16 border-t border-stone-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">

            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-2 mb-6">
                <img
                  src="/logo-login.png"
                  alt={studio?.name || 'Sermoa'}
                  className="h-16 w-auto object-contain brightness-0 invert"
                />
              </div>

              <div className="flex gap-3">
                <a
                  href="#"
                  className="w-9 h-9 rounded-full bg-stone-800/80 flex items-center justify-center hover:bg-[#475B44] text-stone-300 hover:text-white transition-colors"
                >
                  <Instagram className="w-4 h-4" />
                </a>
                <a
                  href="#"
                  className="w-9 h-9 rounded-full bg-stone-800/80 flex items-center justify-center hover:bg-[#475B44] text-stone-300 hover:text-white transition-colors"
                >
                  <Facebook className="w-4 h-4" />
                </a>
              </div>
            </div>


            <div>
              <h4 className="text-stone-100 font-semibold mb-4 text-sm tracking-wide">Contacto</h4>
              <ul className="space-y-3 text-sm text-stone-400">
                <li className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-[#758E72] shrink-0 mt-0.5" />
                  <span>Córdoba, Argentina</span>
                </li>
                <li className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-[#758E72] shrink-0" />
                  <span>Atención por WhatsApp y recepción</span>
                </li>
                <li className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-[#758E72] shrink-0" />
                  <span>contacto@sermoapilates.com</span>
                </li>
              </ul>
            </div>

          </div>

          <div className="pt-8 border-t border-stone-800/80 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-stone-500">
            <p>© {new Date().getFullYear()} {studio?.name || 'Sermoa Estudio'}. Todos los derechos reservados.</p>
            <div className="flex gap-4">
            </div>
          </div>
        </div>
      </footer>


      {/* MODAL DETALLE DE DISCIPLINA */}
      {selectedDiscipline && (
        <div
          className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setSelectedDiscipline(null)}
        >
          <div
            className="bg-[#FAF8F5] border border-[#EAE2D5] rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedDiscipline(null)}
              className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-stone-900/60 text-white flex items-center justify-center hover:bg-stone-900 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="relative h-48">
              <img
                src={selectedDiscipline.image}
                alt={selectedDiscipline.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 to-transparent flex items-end p-6">
                <div>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#475B44] text-white inline-block mb-1">
                    {selectedDiscipline.groupSize}
                  </span>
                  <h3 className="text-2xl font-serif text-white font-medium">
                    {selectedDiscipline.title}
                  </h3>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <p className="text-sm text-stone-700 leading-relaxed">
                {selectedDiscipline.description}
              </p>

              <div>
                <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider mb-2">
                  Beneficios Clave:
                </h4>
                <ul className="space-y-2">
                  {selectedDiscipline.benefits.map((b, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-stone-600">
                      <Check className="w-4 h-4 text-[#475B44] shrink-0 mt-0.5" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-4 border-t border-[#EAE2D5] flex items-center justify-end gap-3">
                <button
                  onClick={() => setSelectedDiscipline(null)}
                  className="px-4 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900 rounded-full"
                >
                  Cerrar
                </button>
                <button
                  onClick={() => {
                    setSelectedDiscipline(null);
                    openRegister();
                  }}
                  className="px-5 py-2 text-xs font-semibold text-white bg-[#475B44] hover:bg-[#384836] rounded-full shadow-md"
                >
                  Inscribirme
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* MODAL DE DETALLE DE DEPORTE (PILATES COMO COMPLEMENTO DEPORTIVO) */}
      <SportDetailModal
        sportId={activeSportModal}
        onClose={() => setActiveSportModal(null)}
        onNavigateToRegister={openRegister}
      />

    </div>
  );
};
