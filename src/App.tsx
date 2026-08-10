import React, { useState, useEffect } from 'react';
import { useStudioStore } from './store/studioStore';
import { Navbar } from './components/layout/Navbar';
import { RoleSwitcher } from './components/layout/RoleSwitcher';
import { DashboardView } from './components/dashboard/DashboardView';
import { ClassesView } from './components/classes/ClassesView';
import { StudentsView } from './components/students/StudentsView';
import { AttendanceView } from './components/attendance/AttendanceView';
import { InstructorsView } from './components/instructors/InstructorsView';
import { BranchesView } from './components/branches/BranchesView';
import { RoutinesView } from './components/routines/RoutinesView';
import { HistoryView } from './components/history/HistoryView';
import { PacksView } from './components/pricing/PacksView';
import { FinanceView } from './components/finance/FinanceView';
import { SettingsView } from './components/settings/SettingsView';
import { StudentPortalView } from './components/portal/StudentPortalView';
import { StudioQRPosterModal } from './components/checkin/StudioQRPosterModal';

export function App() {
  const { currentRole } = useStudioStore();
  const [currentView, setCurrentView] = useState('dashboard');
  const [showQRPoster, setShowQRPoster] = useState(false);

  // Hash-based route listener for direct links like #reservar/slug or #portal-alumno
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash.startsWith('reservar') || hash === 'portal-alumno') {
        setCurrentView('portal-alumno');
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const renderMainView = () => {
    switch (currentView) {
      case 'dashboard':
        return (
          <DashboardView
            onNavigate={(view) => setCurrentView(view)}
            onOpenQRPoster={() => setShowQRPoster(true)}
          />
        );
      case 'classes':
        return <ClassesView />;
      case 'students':
        return <StudentsView />;
      case 'attendance':
        return <AttendanceView />;
      case 'instructors':
        return <InstructorsView />;
      case 'branches':
        return <BranchesView />;
      case 'routines':
        return <RoutinesView />;
      case 'history':
        return <HistoryView />;
      case 'pricing':
        return <PacksView />;
      case 'finance':
        return <FinanceView />;
      case 'settings':
        return <SettingsView />;
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

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex flex-col font-sans selection:bg-brand-500 selection:text-white">
      
      {/* Top Navbar (hidden on student portal for clean mobile-first app experience) */}
      {currentView !== 'portal-alumno' && (
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

      {/* Floating Role Switcher Pill */}
      <RoleSwitcher onNavigate={(view) => setCurrentView(view)} />

      {/* Printable / Downloadable Studio QR Poster Modal */}
      {showQRPoster && (
        <StudioQRPosterModal onClose={() => setShowQRPoster(false)} />
      )}

    </div>
  );
}

export default App;
