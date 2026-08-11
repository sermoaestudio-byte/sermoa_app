import React, { useState, useEffect } from 'react';
import { useStudioStore } from './store/studioStore';
import { Navbar } from './components/layout/Navbar';
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
import { LoginView } from './components/auth/LoginView';
import { ResetPasswordView } from './components/auth/ResetPasswordView';
import { StudioQRPosterModal } from './components/checkin/StudioQRPosterModal';
import { AccessDeniedView } from './components/common/AccessDeniedView';
import { applyStudioTheme } from './utils/theme';
import { supabase, isSupabaseConfigured } from './lib/supabase';

export function App() {
  const { currentRole, studio, isAuthenticated, logout } = useStudioStore();
  const [currentView, setCurrentView] = useState('dashboard');
  const [showQRPoster, setShowQRPoster] = useState(false);

  // Apply dynamic brand theme to :root whenever studio colors change
  useEffect(() => {
    applyStudioTheme(studio.brand_colors);
  }, [studio.brand_colors]);

  // Listen for Supabase Password Recovery events
  useEffect(() => {
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
    // 1. Public Isolated Views
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
        />
      );
    }

    if (currentView === 'portal-alumno') {
      if (currentRole !== 'client') {
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

  const isIsolatedView = ['portal-alumno', 'registro', 'login'].includes(currentView);

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex flex-col font-sans selection:bg-brand-500 selection:text-white">
      
      {/* Top Navbar (hidden on student portal, isolated registration, and login) */}
      {!isIsolatedView && currentRole !== 'client' && (
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
      <div className="flex-1">
        {renderMainView()}
      </div>

      {/* Printable / Downloadable Studio QR Poster Modal */}
      {showQRPoster && (
        <StudioQRPosterModal onClose={() => setShowQRPoster(false)} />
      )}

    </div>
  );
}
export default App;
