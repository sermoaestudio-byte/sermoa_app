import React, { useEffect, useState } from 'react';
import { useStudioStore } from '../../store/studioStore';
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

  const openLogin = () => {
    onNavigate('login');
    window.location.hash = '#login';
  };

  const openRegister = () => {
    onNavigate('registro');
    window.location.hash = '#registro';
  };

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
                En <strong>Sermoa</strong> nuestro objetivo es acompañarte a mejorar tu postura, fortalecer tu musculatura, liberar tensiones y reconectar contigo a través del Yoga, Pilates y la Meditación. En definitiva: <em>ayudarte a ganar calidad de vida</em>. Para ofrecerte siempre la máxima excelencia, nos mantenemos en constante formación e innovación.
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
                  Nos importa conocer las capacidades y metas de cada alumno para garantizar un progreso seguro y constante. Por eso, nuestras clases se imparten en grupos reducidos:
                </p>

                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#F4EFE6]/60 border border-[#E8DFD1]">
                    <div className="flex items-center gap-3">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#475B44]" />
                      <span className="text-sm font-medium text-stone-800">Pilates y Yoga</span>
                    </div>
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#475B44]/10 text-[#475B44]">
                      máximo 10 personas
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#F4EFE6]/60 border border-[#E8DFD1]">
                    <div className="flex items-center gap-3">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#8E654E]" />
                      <span className="text-sm font-medium text-stone-800">Pilates Reformer</span>
                    </div>
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#8E654E]/10 text-[#8E654E]">
                      máximo 5 personas
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#F4EFE6]/60 border border-[#E8DFD1]">
                    <div className="flex items-center gap-3">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#5D707F]" />
                      <span className="text-sm font-medium text-stone-800">Yoga Aéreo</span>
                    </div>
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#5D707F]/10 text-[#5D707F]">
                      máximo 6 personas
                    </span>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-[#EAE2D5] flex items-center justify-between text-xs text-stone-500">

                  <span className="font-medium text-[#475B44]">Ambiente climatizado</span>
                </div>

              </div>
            </div>

          </div>
        </section>


        {/* 4. NUESTRAS DISCIPLINAS */}
        <section id="disciplinas" className="py-16 sm:py-24 bg-[#F5F1EB] border-y border-[#EAE2D5]">
          <div className="max-w-7xl mx-auto px-6">

            <div className="text-center max-w-2xl mx-auto mb-14">
              <span className="text-xs font-bold tracking-widest text-[#475B44] uppercase block mb-2">
                Nuestras Disciplinas
              </span>
              <h2 className="text-3xl sm:text-4xl font-serif text-stone-900 mb-4">
                Encuentra la práctica adecuada para ti
              </h2>
              <p className="text-stone-600 text-sm sm:text-base">
                Clases guiadas por profesionales certificados, adaptadas tanto a quienes se inician como a practicantes avanzados.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
              {disciplines.map((d, i) => (
                <div
                  key={i}
                  className="bg-[#FAF8F5] rounded-3xl overflow-hidden border border-[#E8DFD1] shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group hover:-translate-y-1"
                >
                  {/* Foto de la disciplina */}
                  <div className="relative h-48 sm:h-52 overflow-hidden">
                    <img
                      src={d.image}
                      alt={d.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-900/60 via-transparent to-transparent" />

                    {/* Badges superiores */}
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">

                      <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-[#475B44] text-white">
                        {d.level}
                      </span>
                    </div>

                    <div className="absolute bottom-3 left-3 right-3">

                    </div>
                  </div>

                  {/* Cuerpo de la tarjeta */}
                  <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-xl font-semibold text-stone-900 mb-2 font-serif">
                        {d.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-stone-600 line-clamp-3 leading-relaxed mb-4">
                        {d.description}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-[#EAE2D5] flex items-center justify-between">
                      <button
                        onClick={() => setSelectedDiscipline(d)}
                        className="text-xs font-semibold text-[#475B44] hover:text-[#334231] flex items-center gap-1 group/btn"
                      >
                        <span>Saber más</span>
                        <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-0.5" />
                      </button>


                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </section>


        {/* 5. TARJETAS DE BENEFICIOS (Diseño cálido, dinámico y con figuras geométricas orgánicas) */}
        <section id="beneficios" className="py-16 sm:py-24 max-w-7xl mx-auto px-6 relative overflow-hidden">

          {/* Figuras geométricas y manchas orgánicas flotantes de fondo */}
          <div className="absolute top-1/4 -left-20 w-80 h-80 bg-[#5EBA8C]/10 rounded-full blur-3xl pointer-events-none animate-pulse-glow" />
          <div className="absolute bottom-10 -right-20 w-96 h-96 bg-[#F7C59F]/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute top-10 right-1/3 w-64 h-64 bg-[#1F2933]/5 rounded-full blur-2xl pointer-events-none" />

          <div className="text-center max-w-2xl mx-auto mb-16 relative z-10">
            <span className="text-xs font-bold tracking-widest text-[#475B44] uppercase block mb-2">
              Bienestar Integral
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif text-stone-900 mb-4">
              Los beneficios de moverte a conciencia
            </h2>
            <p className="text-stone-600 text-sm sm:text-base">
              Cada sesión está planificada para impactar de forma positiva y medible en tu salud corporal y mental.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 relative z-10">
            {[
              {
                icon: Feather,
                title: 'Mejora de Postura',
                desc: 'Realinea tu columna, elimina sobrecargas lumbares y cervicales, y muévete con soltura y presencia en tu día a día.',
                accentColor: '#5EBA8C',
                shapeType: 'leaf',
                badgeText: 'Alineación Natural',
                bgGradient: 'from-[#5EBA8C]/15 via-[#5EBA8C]/5 to-transparent'
              },
              {
                icon: Activity,
                title: 'Fuerza Profunda del Core',
                desc: 'Construye un centro fuerte y reactivo que protege tus articulaciones y brinda estabilidad a cada uno de tus movimientos.',
                accentColor: '#1F2933',
                shapeType: 'arch',
                badgeText: 'Centro Fuerte',
                bgGradient: 'from-[#1F2933]/10 via-[#1F2933]/5 to-transparent'
              },
              {
                icon: Heart,
                title: 'Liberación de Tensiones',
                desc: 'A través de la respiración profunda y el trabajo fascial, disuelve el estrés acumulado y equilibra tu sistema nervioso.',
                accentColor: '#F7C59F',
                shapeType: 'circle',
                badgeText: 'Calma & Relax',
                bgGradient: 'from-[#F7C59F]/25 via-[#F7C59F]/5 to-transparent'
              },
              {
                icon: Compass,
                title: 'Flexibilidad & Movilidad',
                desc: 'Desbloquea rangos articulares sanos sin forzar, ganando una sensación de ligereza y agilidad perdurable.',
                accentColor: '#475B44',
                shapeType: 'wave',
                badgeText: 'Rango Articular',
                bgGradient: 'from-[#475B44]/15 via-[#475B44]/5 to-transparent'
              },
              {
                icon: Users,
                title: 'Atención Individualizada',
                desc: 'Supervisión atenta a tus necesidades, adaptando los ejercicios si tienes lesiones, molestias o metas concretas.',
                accentColor: '#F7C59F',
                shapeType: 'pill',
                badgeText: 'Grupos Reducidos',
                bgGradient: 'from-[#F7C59F]/20 via-[#F7C59F]/5 to-transparent'
              },
              {
                icon: ShieldCheck,
                title: 'Equilibrio Físico & Mental',
                desc: 'Un espacio seguro donde desconectar de la rutina para reconectar con tus sensaciones y tu propia energía.',
                accentColor: '#5EBA8C',
                shapeType: 'diamond',
                badgeText: 'Salud Integral',
                bgGradient: 'from-[#5EBA8C]/20 via-[#5EBA8C]/5 to-transparent'
              }
            ].map((b, i) => {
              const IconComponent = b.icon;
              return (
                <div
                  key={i}
                  className="bg-[#FAF8F5] border border-[#EAE2D5] rounded-3xl p-7 sm:p-8 shadow-sm hover:shadow-2xl hover:border-[#D6CAB7] transition-all duration-500 flex flex-col justify-between group hover:-translate-y-2 relative overflow-hidden"
                >
                  {/* Degradé suave reactivo con el hover */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${b.bgGradient} opacity-30 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none`} />

                  {/* Figura geométrica y orgánica decorativa en la esquina superior derecha */}
                  <div className="absolute -top-6 -right-6 w-24 h-24 rounded-bl-[2.5rem] rounded-tr-3xl transition-all duration-700 pointer-events-none group-hover:scale-125 group-hover:rotate-12 opacity-40 group-hover:opacity-85 flex items-center justify-center"
                    style={{ backgroundColor: `${b.accentColor}18` }}
                  >
                    <div
                      className="w-10 h-10 rounded-full transition-transform duration-500 group-hover:scale-110"
                      style={{ backgroundColor: `${b.accentColor}25` }}
                    />
                  </div>

                  <div className="relative z-10">

                    {/* Contenedor del Icono con animación flotante */}
                    <div className="flex items-center justify-between mb-6">
                      <div
                        className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-xs transition-all duration-500 group-hover:scale-110 group-hover:shadow-md"
                        style={{
                          backgroundColor: `${b.accentColor}15`,
                          color: b.accentColor === '#FAF8F5' ? '#1F2933' : b.accentColor
                        }}
                      >
                        <IconComponent className="w-6 h-6 transition-transform duration-500 group-hover:rotate-6" />
                      </div>

                      <span
                        className="text-[11px] font-semibold tracking-wide px-3 py-1 rounded-full border transition-all duration-300"
                        style={{
                          backgroundColor: `${b.accentColor}10`,
                          borderColor: `${b.accentColor}25`,
                          color: b.accentColor === '#FAF8F5' ? '#1F2933' : b.accentColor
                        }}
                      >
                        {b.badgeText}
                      </span>
                    </div>

                    <h3 className="text-xl font-semibold text-stone-900 mb-3 font-serif group-hover:text-[#1F2933] transition-colors">
                      {b.title}
                    </h3>

                    <p className="text-stone-600 text-sm leading-relaxed">
                      {b.desc}
                    </p>
                  </div>

                  {/* Barra inferior de progreso / toque de color orgánico */}
                  <div className="mt-6 pt-4 border-t border-[#EAE2D5]/70 flex items-center justify-between relative z-10">

                    <div
                      className="h-1.5 w-6 group-hover:w-16 rounded-full transition-all duration-500"
                      style={{ backgroundColor: b.accentColor }}
                    />
                  </div>

                </div>
              );
            })}
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

    </div>
  );
};
