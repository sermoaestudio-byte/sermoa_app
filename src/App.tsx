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
import { StudioQRPosterModal } from './components/checkin/StudioQRPosterModal';
import { applyStudioTheme } from './utils/theme';

export function App() {
  const { currentRole, studio } = useStudioStore();
  const [currentView, setCurrentView] = useState('dashboard');
  const [showQRPoster, setShowQRPoster] = useState(false);

  // Apply dynamic brand theme to :root whenever studio colors change
  useEffect(() => {
    applyStudioTheme(studio.brand_colors);
  }, [studio.brand_colors]);

  // Hash-based route listener for direct links like #registro, #login, #reservar or #portal-alumno
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash === 'registro') {
        setCurrentView('registro');
      } else if (hash === 'login') {
        setCurrentView('login');
      } else if (hash.startsWith('reservar') || hash === 'portal-alumno') {
        setCurrentView('portal-alumno');
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Auth & Role Guard: Ensure students only access their portal, registration, or login
  useEffect(() => {
    if (currentRole === 'client') {
      if (currentView !== 'portal-alumno' && currentView !== 'registro' && currentView !== 'login') {
        setCurrentView('portal-alumno');
      }
    }
  }, [currentRole, currentView]);

  const renderMainView = () => {
    switch (currentView) {
      case 'registro':
        return (
          <div className="py-8 px-4">
            <StudentRegisterView onGoToLogin={() => setCurrentView('login')} />
          </div>
        );
      case 'login':
        return (
          <LoginView
            onLoginSuccess={(role) => {
              if (role === 'client') {
                setCurrentView('portal-alumno');
              } else {
                setCurrentView('dashboard');
              }
            }}
            onGoToRegister={() => setCurrentView('registro')}
          />
        );
      case 'dashboard':
        return (
          <DashboardView
            onNavigate={(view) => setCurrentView(view)}
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
      case 'portal-alumno':
        return <StudentPortalView />;
      default:
        return (
          <DashboardView
            onNavigate={(view) => setCurrentView(view)}
            onOpenQRPoster={() => setShowQRPoster(true)}
          />
        );
    }
  };

  const isIsolatedView = ['portal-alumno', 'registro', 'login'].includes(currentView);

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex flex-col font-sans selection:bg-brand-500 selection:text-white">
      
      {/* Top Navbar (hidden on student portal, isolated registration, and login) */}
      {!isIsolatedView && (
        <Navbar
          currentView={currentView}
          onNavigate={(view) => setCurrentView(view)}
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
