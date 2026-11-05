import React from 'react';
import { useStudioStore } from '../../store/studioStore';
import { StatCards } from './StatCards';
import { TodayClassesSection } from './TodayClassesSection';

interface DashboardViewProps {
  onNavigate: (view: string) => void;
  onOpenQRPoster: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onNavigate,
}) => {
  const { profiles, currentUser } = useStudioStore();
  const adminProfile = profiles.find((p) => p.role === 'admin') || profiles[0];
  const displayName = currentUser?.first_name || adminProfile?.first_name || 'Admin';

  return (
    <div className="py-6 sm:py-8 animate-fade-in">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-[#1F2933] tracking-tight">
              Bienvenido Profe <span className="text-[#3F4E5B]">{displayName}</span>.
            </h1>
            <p className="text-xs text-stone-500 font-medium mt-0.5">
              Panel central de control y operativa diaria de clases.
            </p>
          </div>
        </div>

        {/* Main Content: Totalizadores & Clases de Hoy (Ancho completo) */}
        <main className="w-full space-y-6">
          {/* 1. Stat Cards (Totalizadores) */}
          <StatCards onNavigate={onNavigate} />

          {/* 2. Clases de Hoy & Asistencia / Check-in QR en vivo */}
          <TodayClassesSection onNavigate={onNavigate} />
        </main>

      </div>
    </div>
  );
};
