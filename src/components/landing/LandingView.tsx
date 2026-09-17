import React, { useEffect, useState } from 'react';
import { useStudioStore } from '../../store/studioStore';
import { ArrowRight, CheckCircle2, PlayCircle, Star, Instagram, Twitter, Facebook, Mail, MapPin, Phone } from 'lucide-react';

interface LandingViewProps {
  onNavigate: (view: string) => void;
}

export const LandingView: React.FC<LandingViewProps> = ({ onNavigate }) => {
  const { studio } = useStudioStore();
  const [activeSection, setActiveSection] = useState('');

  // Scroll spy effect
  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll('section[id]');
      let current = '';
      sections.forEach((section) => {
        const sectionTop = (section as HTMLElement).offsetTop;
        if (window.scrollY >= sectionTop - 150) {
          current = section.getAttribute('id') || '';
        }
      });
      setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Simple scroll reveal effect
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('opacity-100', 'translate-y-0');
          entry.target.classList.remove('opacity-0', 'translate-y-8');
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-white text-slate-800 font-sans selection:bg-brand-500 selection:text-white overflow-x-hidden">
      
      {/* 1. Header / Navbar */}
      <header className="fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-md z-50 border-b border-slate-100 transition-all">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo(0, 0)}>
            <img src="/logo-login.png" alt={studio.name} className="h-20 object-contain" />
          </div>

          <nav className="hidden md:flex items-center gap-8 font-medium text-sm text-slate-600">
            <a href="#about" className={`hover:text-brand-600 transition-colors ${activeSection === 'about' ? 'text-brand-600 font-bold border-b-2 border-brand-600 pb-1' : ''}`}>Nosotros</a>
            <a href="#benefits" className={`hover:text-brand-600 transition-colors ${activeSection === 'benefits' ? 'text-brand-600 font-bold border-b-2 border-brand-600 pb-1' : ''}`}>Beneficios</a>
            <a href="#programs" className={`hover:text-brand-600 transition-colors ${activeSection === 'programs' ? 'text-brand-600 font-bold border-b-2 border-brand-600 pb-1' : ''}`}>Programas</a>
            <a href="#trainers" className={`hover:text-brand-600 transition-colors ${activeSection === 'trainers' ? 'text-brand-600 font-bold border-b-2 border-brand-600 pb-1' : ''}`}>Staff</a>
          </nav>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => {
                onNavigate('login');
                window.location.hash = '#login';
              }}
              className="text-sm font-bold text-white bg-brand-600 hover:bg-brand-700 px-6 py-2.5 rounded-full transition-all hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
            >
              Empezar
            </button>
          </div>
        </div>
      </header>

      <main className="pt-20">
        
        {/* 2. Hero Section */}
        <section className="relative px-6 pt-12 pb-24 md:pt-20 md:pb-32 overflow-hidden">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            <div className="relative z-10 reveal opacity-0 translate-y-8 transition-all duration-1000">
              <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-slate-900 leading-[1.1] mb-6">
                Fortalece tu Core, <br/>
                <span className="text-brand-600">Empodera tu Mente</span>
              </h1>
              <p className="text-lg text-slate-600 mb-8 max-w-lg leading-relaxed">
                Experimenta una forma consciente de moverte. Fortalece tu cuerpo, mejora tu flexibilidad y encuentra tu equilibrio interior.
              </p>
            </div>

            <div className="relative reveal opacity-0 translate-y-8 transition-all duration-1000 delay-200">
              <div className="aspect-[4/5] md:aspect-square rounded-[2.5rem] overflow-hidden shadow-2xl relative">
                <img 
                  src="https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=1400&auto=format&fit=crop" 
                  alt="Pilates Session" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
              </div>
            </div>

          </div>
        </section>

        {/* 3. About Section */}
        <section id="about" className="py-24 bg-slate-50">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div className="order-2 lg:order-1 relative reveal opacity-0 translate-y-8 transition-all duration-1000">
                <div className="aspect-[3/2] rounded-3xl overflow-hidden shadow-lg">
                  <img src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=1200&auto=format&fit=crop" alt="Yoga Balance" className="w-full h-full object-cover" />
                </div>
              </div>
              <div className="order-1 lg:order-2 reveal opacity-0 translate-y-8 transition-all duration-1000 delay-200">
                <span className="text-brand-600 font-bold tracking-widest text-sm uppercase mb-4 block">Sobre Nosotros</span>
                <h2 className="text-4xl font-bold text-slate-900 mb-6 leading-tight">Más Que Movimiento,<br/>Es Equilibrio.</h2>
                <p className="text-slate-600 text-lg mb-8 leading-relaxed">
                  Ayudamos a las personas a reconectar con sus cuerpos a través de la práctica consciente, combinando fuerza, control y calma. Cada sesión está diseñada para honrar tu viaje único, ya sea que estés construyendo una base o profundizando tu práctica.
                </p>
                <button className="px-8 py-3 bg-brand-600 hover:bg-brand-700 text-white rounded-full font-bold transition-all shadow-md">
                  Conoce Más
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* 4. Benefits Section */}
        <section id="benefits" className="py-24">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16 reveal opacity-0 translate-y-8 transition-all duration-1000">
              <span className="text-brand-600 font-bold tracking-widest text-sm uppercase mb-4 block">Beneficios</span>
              <h2 className="text-4xl font-bold text-slate-900 mb-4">Los Beneficios de Moverte a Conciencia</h2>
              <p className="text-slate-600 max-w-2xl mx-auto">Cada clase está diseñada para mejorar tu forma de moverte, respirar y sentirte por dentro y por fuera.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { title: 'Mejora de Postura', desc: 'Realinea tu cuerpo y muévete con gracia y confianza en la vida diaria.' },
                { title: 'Fuerza del Core', desc: 'Construye una base poderosa que soporta cada movimiento que haces.' },
                { title: 'Alivio del Estrés', desc: 'Libera tensiones y encuentra la calma mediante el movimiento consciente.' },
                { title: 'Mayor Enfoque', desc: 'Agudiza tu claridad mental conectando mente y cuerpo.' },
                { title: 'Mejor Flexibilidad', desc: 'Muévete más libremente con un rango de movimiento mejorado.' },
                { title: 'Equilibrio Corporal', desc: 'Armoniza fuerza, movilidad y estabilidad para un cuerpo equilibrado.' }
              ].map((benefit, i) => (
                <div key={i} className="p-8 rounded-3xl bg-white border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 reveal opacity-0 translate-y-8" style={{ transitionDelay: `${i * 100}ms` }}>
                  <div className="w-12 h-12 bg-brand-50 rounded-2xl flex items-center justify-center mb-6 text-brand-600">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">{benefit.title}</h3>
                  <p className="text-slate-600 leading-relaxed">{benefit.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 5. Programs Section */}
        <section id="programs" className="py-24 bg-slate-900 text-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16 reveal opacity-0 translate-y-8 transition-all duration-1000">
              <span className="text-brand-400 font-bold tracking-widest text-sm uppercase mb-4 block">Programas</span>
              <h2 className="text-4xl font-bold mb-4">Clases para Cada Cuerpo</h2>
              <p className="text-slate-400 max-w-2xl mx-auto">Ya seas principiante o avanzado, tenemos clases que se adaptan a tu ritmo y objetivos.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { level: 'Principiante', name: 'Flujo Inicial', desc: 'Introducción a la alineación y la respiración perfecta para iniciar en Pilates.' },
                { level: 'Intermedio', name: 'Esculpir el Core', desc: 'Fortalece el centro con ejercicios de precisión y construye resistencia.' },
                { level: 'Todos los Niveles', name: 'Movimiento Mindful', desc: 'Conecta cuerpo y mente mediante secuencias fluidas que aumentan la consciencia.' },
                { level: 'Avanzado', name: 'Equilibrio Avanzado', desc: 'Mayor control y resistencia, desafiando tu estabilidad.' }
              ].map((prog, i) => (
                <div key={i} className="p-8 rounded-3xl bg-slate-800/50 border border-slate-700 hover:bg-slate-800 transition-colors reveal opacity-0 translate-y-8" style={{ transitionDelay: `${i * 150}ms` }}>
                  <span className="inline-block py-1 px-3 rounded-full bg-brand-900/50 text-brand-300 text-xs font-bold uppercase mb-4">
                    {prog.level}
                  </span>
                  <h3 className="text-2xl font-bold mb-3">{prog.name}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{prog.desc}</p>
                </div>
              ))}
            </div>
            
            <div className="mt-12 text-center reveal opacity-0 translate-y-8 transition-all duration-1000 delay-500">
              <button 
                onClick={() => {
                  onNavigate('login');
                  window.location.hash = '#login';
                }}
                className="px-8 py-3 bg-brand-600 hover:bg-brand-500 text-white rounded-full font-bold transition-all"
              >
                Explorar Todas las Clases
              </button>
            </div>
          </div>
        </section>

        {/* 6. Testimonials */}
        <section className="py-24 bg-slate-50">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16 reveal opacity-0 translate-y-8 transition-all duration-1000">
              <span className="text-brand-600 font-bold tracking-widest text-sm uppercase mb-4 block">Testimonios</span>
              <h2 className="text-4xl font-bold text-slate-900 mb-4">Personas Reales, Transformaciones Reales</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { name: 'Sofía Martínez', role: 'Alumna hace 1 año', text: '"Después de años de dolor de espalda, finalmente encontré alivio. Mi enfoque hacia el bienestar ha cambiado por completo."' },
                { name: 'Laura Gómez', role: 'Alumna hace 6 meses', text: '"Los instructores aquí realmente se preocupan. Cada clase se siente personal, logrando apoyo incondicional."' },
                { name: 'Carlos Ruiz', role: 'Alumno hace 2 años', text: '"Fui con miedo de no tener elasticidad, pero el progreso que he notado en tan pocos meses es simplemente increíble."' }
              ].map((test, i) => (
                <div key={i} className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 reveal opacity-0 translate-y-8" style={{ transitionDelay: `${i * 200}ms` }}>
                  <div className="flex gap-1 text-brand-500 mb-6">
                    {[...Array(5)].map((_, j) => <Star key={j} className="w-5 h-5 fill-current" />)}
                  </div>
                  <p className="text-slate-600 italic mb-8">{test.text}</p>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-brand-100 rounded-full flex items-center justify-center text-brand-700 font-bold text-lg">
                      {test.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-bold text-slate-900">{test.name}</div>
                      <div className="text-sm text-slate-500">{test.role}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 7. Instructors / Experts */}
        <section id="trainers" className="py-24">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16 reveal opacity-0 translate-y-8 transition-all duration-1000">
              <span className="text-brand-600 font-bold tracking-widest text-sm uppercase mb-4 block">Staff</span>
              <h2 className="text-4xl font-bold text-slate-900 mb-4">Guiados por Expertos Certificados</h2>
              <p className="text-slate-600 max-w-2xl mx-auto">Nuestros instructores traen experiencia, empatía y precisión a cada clase.</p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {[
                'https://images.unsplash.com/photo-1594381898411-846e7d193883?q=80&w=800&auto=format&fit=crop',
                'https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?q=80&w=800&auto=format&fit=crop',
                'https://images.unsplash.com/photo-1603988363607-e1e4a66962c6?q=80&w=800&auto=format&fit=crop',
                'https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=800&auto=format&fit=crop'
              ].map((img, i) => (
                <div key={i} className="aspect-[3/4] rounded-2xl overflow-hidden reveal opacity-0 translate-y-8" style={{ transitionDelay: `${i * 150}ms` }}>
                  <img src={img} alt="Instructor" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
                </div>
              ))}
            </div>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="bg-slate-950 text-slate-300 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-2 mb-6">
                {studio.logo_url ? (
                  <img src={studio.logo_url} alt={studio.name} className="h-20 object-contain brightness-0 invert" />
                ) : (
                  <span className="text-2xl font-black tracking-tight text-white">{studio.name}</span>
                )}
              </div>
              <p className="text-slate-400 max-w-sm mb-6 leading-relaxed">
                MÁS MOVIMIENTO, MÁS VIDA. Brindando un enfoque consciente e instructores certificados. Te ayudamos a encontrar un núcleo más fuerte, un cuerpo más sano y una mente en equilibrio.
              </p>
              <div className="flex gap-4">
                <a href="#" className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center hover:bg-brand-600 hover:text-white transition-colors"><Instagram className="w-5 h-5" /></a>
                <a href="#" className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center hover:bg-brand-600 hover:text-white transition-colors"><Twitter className="w-5 h-5" /></a>
                <a href="#" className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center hover:bg-brand-600 hover:text-white transition-colors"><Facebook className="w-5 h-5" /></a>
              </div>
            </div>
            
            <div>
              <h4 className="text-white font-bold mb-6">Explorar</h4>
              <ul className="space-y-4">
                <li><a href="#about" className="hover:text-brand-400 transition-colors">Sobre Nosotros</a></li>
                <li><a href="#benefits" className="hover:text-brand-400 transition-colors">Beneficios</a></li>
                <li><a href="#programs" className="hover:text-brand-400 transition-colors">Programas</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-6">Contacto</h4>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-brand-500 shrink-0" />
                  <span>Av. Principal 123, Ciudad, CP 1000</span>
                </li>
                <li className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-brand-500 shrink-0" />
                  <span>+1 234 567 890</span>
                </li>
                <li className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-brand-500 shrink-0" />
                  <span>hola@sermoa.com</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-500">
            <p>© {new Date().getFullYear()} {studio.name}. Todos los derechos reservados.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-white transition-colors">Política de Privacidad</a>
              <a href="#" className="hover:text-white transition-colors">Términos de Servicio</a>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
};
