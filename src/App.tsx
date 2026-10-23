import React, { useState, useEffect } from 'react';
import { useStudioStore } from './store/studioStore';
import { Navbar } from './components/layout/Navbar';
import { SidebarLeft } from './components/layout/SidebarLeft';
import { DashboardView } from './components/dashboard/DashboardView';
import { ClassesView } from './components/classes/ClassesView';
import { StudentsView } from './components/students/StudentsView';
import { AttendanceView } from './components/attendance/AttendanceView';
import { InstructorsView } from './components/instructors/InstructorsView';
import { BranchesView } from './components/branches/BranchesView';
import { RoutinesView } from './components/routines/RoutinesView';
import { HistoryView } from './components/history/HistoryView';
import { FinanceView } from './components/finance/FinanceView';
import { SettingsView } from './components/settings/SettingsView';
import { StudentPortalView } from './components/portal/StudentPortalView';
import { StudentRegisterView } from './components/portal/StudentRegisterView';
import { LandingView } from './components/landing/LandingView';
import { LoginView } from './components/auth/LoginView';
import { ResetPasswordView } from './components/auth/ResetPasswordView';
import { StudioQRPosterModal } from './components/checkin/StudioQRPosterModal';
import { AccessDeniedView } from './components/common/AccessDeniedView';
import { applyStudioTheme } from './utils/theme';
import { supabase, isSupabaseConfigured } from './lib/supabase';

export function App() {
  const { currentRole, studio, isAuthenticated, isInitialized, logout, updateStudioSettings } = useStudioStore();
  const [currentView, setCurrentView] = useState('dashboard');
  const [showQRPoster, setShowQRPoster] = useState(false);

  // Apply dynamic brand theme to :root whenever studio colors change
  useEffect(() => {
    if (studio?.brand_colors) {
      applyStudioTheme(studio.brand_colors);
    }
  }, [studio]);

  // Listen for Supabase Password Recovery events
  useEffect(() => {
    // Check if URL has recovery tokens/params instantly
    const hashStr = window.location.hash;
    const searchStr = window.location.search;
    if (hashStr.includes('type=recovery') || searchStr.includes('type=recovery')) {
      setCurrentView('actualizar-clave');
    }

    if (isSupabaseConfigured) {
      const { data: authListener } = supabase.auth.onAuthStateChange((event) => {
        if (event === 'PASSWORD_RECOVERY') {
          setCurrentView('actualizar-clave');
          window.location.hash = '#actualizar-clave';
        }
      });
      return () => authListener.subscription.unsubscribe();
    }
  }, []);

  // Hash-based route listener for direct links with security routing
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '').toLowerCase();
      if (!hash) return;

      if (hash === 'registro') {
        setCurrentView('registro');
      } else if (hash === 'login') {
        setCurrentView('login');
      } else if (hash === 'actualizar-clave') {
        setCurrentView('actualizar-clave');
      } else if (hash.startsWith('reservar') || hash === 'portal-alumno') {
        setCurrentView('portal-alumno');
      } else if (['dashboard', 'classes', 'clases', 'students', 'alumnos', 'attendance', 'asistencias', 'instructors', 'profesores', 'branches', 'sucursales', 'routines', 'rutinas', 'history', 'historial', 'finance', 'finanzas', 'settings', 'configuracion'].includes(hash)) {
        // Map Spanish aliases to internal view keys
        const viewMap: Record<string, string> = {
          clases: 'classes',
          alumnos: 'students',
          asistencias: 'attendance',
          profesores: 'instructors',
          sucursales: 'branches',
          rutinas: 'routines',
          historial: 'history',
          finanzas: 'finance',
          configuracion: 'settings',
        };
        setCurrentView(viewMap[hash] || hash);
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Strict Role & URL Security Guard
  const renderMainView = () => {
    // 0. Wait for initialization (prevents flash of Landing Page for logged-in users)
    if (!isInitialized) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
          <div className="flex flex-col items-center space-y-4">
            <div className="w-12 h-12 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-slate-500 font-medium">Cargando...</p>
          </div>
        </div>
      );
    }

    // 1. Public Isolated Views
    if (currentView === 'intro' || currentView === 'landing') {
      return (
        <LandingView
          onNavigate={(view) => {
            setCurrentView(view);
            window.location.hash = `#${view}`;
          }}
        />
      );
    }

    if (currentView === 'registro') {
      return (
        <div className="py-8 px-4">
          <StudentRegisterView onGoToLogin={() => setCurrentView('login')} />
        </div>
      );
    }

    if (currentView === 'actualizar-clave') {
      return (
        <ResetPasswordView 
          onSuccess={() => {
            setCurrentView('login');
            window.location.hash = '#login';
          }}
        />
      );
    }

    if (currentView === 'login') {
      return (
        <LoginView
          onLoginSuccess={(role) => {
            if (role === 'client') {
              setCurrentView('portal-alumno');
              window.location.hash = '#portal-alumno';
            } else {
              setCurrentView('dashboard');
              window.location.hash = '#dashboard';
            }
          }}
          onGoToRegister={() => {
            setCurrentView('registro');
            window.location.hash = '#registro';
          }}
          onGoToLanding={() => {
            setCurrentView('landing');
            window.location.hash = '#landing';
          }}
        />
      );
    }

    if (currentView === 'portal-alumno') {
      if (!isAuthenticated) {
        return (
          <AccessDeniedView
            requiredRole="client"
            onNavigate={(view) => {
              setCurrentView(view);
              window.location.hash = `#${view}`;
            }}
          />
        );
      }
      return <StudentPortalView />;
    }

    // 1.5 General Unauthenticated Guard
    if (!isAuthenticated && !['login', 'registro', 'actualizar-clave'].includes(currentView)) {
      return (
        <LandingView
          onNavigate={(view) => {
            setCurrentView(view);
            window.location.hash = `#${view}`;
          }}
        />
      );
    }

    // 2. Client (Alumno) Security Guard: Block any internal dashboard or management views
    if (currentRole === 'client') {
      return (
        <AccessDeniedView
          requiredRole="admin"
          onNavigate={(view) => {
            setCurrentView(view);
            window.location.hash = `#${view}`;
          }}
        />
      );
    }

    // 3. Instructor (Profesor) Security Guard: Block Finance and Settings views
    if (currentRole === 'instructor' && (currentView === 'finance' || currentView === 'settings')) {
      return (
        <AccessDeniedView
          requiredRole="admin"
          onNavigate={(view) => {
            setCurrentView(view);
            window.location.hash = `#${view}`;
          }}
        />
      );
    }

    // 4. Authorized Internal Views
    switch (currentView) {
      case 'dashboard':
        return (
          <DashboardView
            onNavigate={(view) => {
              setCurrentView(view);
              window.location.hash = `#${view}`;
            }}
            onOpenQRPoster={() => setShowQRPoster(true)}
          />
        );
      case 'classes':
        return <ClassesView onNavigate={(view) => setCurrentView(view)} />;
      case 'students':
        return <StudentsView onNavigate={(view) => setCurrentView(view)} />;
      case 'attendance':
        return <AttendanceView onNavigate={(view) => setCurrentView(view)} />;
      case 'instructors':
        return <InstructorsView onNavigate={(view) => setCurrentView(view)} />;
      case 'branches':
        return <BranchesView onNavigate={(view) => setCurrentView(view)} />;
      case 'routines':
        return <RoutinesView onNavigate={(view) => setCurrentView(view)} />;
      case 'history':
        return <HistoryView onNavigate={(view) => setCurrentView(view)} />;
      case 'finance':
        return <FinanceView onNavigate={(view) => setCurrentView(view)} />;
      case 'settings':
        return <SettingsView onNavigate={(view) => setCurrentView(view)} />;
      default:
        return (
          <DashboardView
            onNavigate={(view) => {
              setCurrentView(view);
              window.location.hash = `#${view}`;
            }}
            onOpenQRPoster={() => setShowQRPoster(true)}
          />
        );
    }
  };

  const isIsolatedView = ['intro', 'landing', 'portal-alumno', 'registro', 'login', 'actualizar-clave'].includes(currentView);

  const showSidebar = !isIsolatedView && currentRole !== 'client' && isAuthenticated;

  return (
    <div className={`min-h-screen relative overflow-x-hidden flex font-sans selection:bg-[#E8D5B5] selection:text-[#44261B] ${
      currentRole === 'instructor' 
        ? 'bg-[#F5F2EB] text-[#44261B]' 
        : 'bg-[#F5F2EB] text-[#44261B]'
    }`}>
      {/* Decorative Silhouette Watermark in Background & Watercolor wash for instructor */}
      {showSidebar && (
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
          {/* Silhouette on the right */}
          <div className="absolute inset-y-0 right-0 flex items-center justify-end pr-4 sm:pr-8 pointer-events-none">
            <img
              src="/pilates-silhouette.png"
              alt=""
              className="w-[300px] sm:w-[460px] md:w-[540px] max-w-none opacity-[0.14] select-none mix-blend-multiply translate-x-12 sm:translate-x-16 translate-y-4"
            />
          </div>

          {/* Watercolor wash and organic contour lines when in instructor mode */}
          {currentRole === 'instructor' && (
            <>
              <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-gradient-to-br from-[#E8D5B5]/50 via-[#F4E8D1]/40 to-transparent blur-3xl" />
              <div className="absolute top-1/3 -right-24 w-80 h-80 rounded-full bg-gradient-to-bl from-[#C18749]/30 via-[#D98E2A]/20 to-transparent blur-3xl" />
              <div className="absolute -bottom-20 right-10 w-96 h-96 rounded-full bg-gradient-to-tr from-[#B74E2A]/25 via-[#CB563C]/15 to-[#E8D5B5]/20 blur-3xl" />
              <div className="absolute bottom-10 left-1/4 w-72 h-72 rounded-full bg-gradient-to-r from-[#5E612B]/20 to-[#E8D5B5]/30 blur-2xl" />

              <svg className="absolute inset-0 w-full h-full opacity-35" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M 850,-50 C 920,80 820,180 890,320 C 940,420 1020,480 1150,520"
                  fill="none"
                  stroke="#C18749"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
                <path
                  d="M 920,-30 C 960,110 870,220 940,360 C 990,460 1060,510 1200,540"
                  fill="none"
                  stroke="#B74E2A"
                  strokeWidth="1.2"
                  strokeOpacity="0.6"
                  strokeLinecap="round"
                />
                <path
                  d="M -50,650 C 120,620 220,740 180,850 C 140,950 260,990 420,960"
                  fill="none"
                  stroke="#5E612B"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
                <path
                  d="M -30,700 C 160,670 240,790 200,890 C 170,970 300,1030 460,990"
                  fill="none"
                  stroke="#4E7E7E"
                  strokeWidth="1.2"
                  strokeOpacity="0.5"
                  strokeLinecap="round"
                />
              </svg>

              <div className="absolute inset-0 instructor-watermark pointer-events-none" />
            </>
          )}
        </div>
      )}

      {/* 1. Left Navbar Sidebar (fijo a la izquierda con Operativa Diaria) */}
      {showSidebar && (
        <div className="hidden lg:block shrink-0 relative z-10">
          <SidebarLeft
            currentView={currentView}
            onNavigate={(view) => {
              setCurrentView(view);
              window.location.hash = `#${view}`;
            }}
          />
        </div>
      )}

      {/* 2. Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 relative z-10">
        {/* Top Navbar */}
        {showSidebar && (
          <Navbar
            currentView={currentView}
            onNavigate={(view) => {
              setCurrentView(view);
              window.location.hash = `#${view}`;
            }}
            onOpenQRPoster={() => setShowQRPoster(true)}
          />
        )}

        {/* Main View Render */}
        <div className="flex-1 min-w-0">
          {renderMainView()}
        </div>
      </div>

      {/* Printable / Downloadable Studio QR Poster Modal */}
      {showQRPoster && (
        <StudioQRPosterModal onClose={() => setShowQRPoster(false)} />
      )}

    </div>
  );
}
export default App;
