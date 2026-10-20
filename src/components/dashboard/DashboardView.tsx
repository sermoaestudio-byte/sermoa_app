import React from 'react';
import { Copy, Check, ExternalLink, Sparkles } from 'lucide-react';
import { useStudioStore } from '../../store/studioStore';
import { StatCards } from './StatCards';
import { TodayClassesSection } from './TodayClassesSection';
import { EstrategiaMarcaSection } from './EstrategiaMarcaSection';
import { SidebarRight } from '../layout/SidebarRight';
import { getRegisterLink } from '../../utils/links';

interface DashboardViewProps {
  onNavigate: (view: string) => void;
  onOpenQRPoster: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onNavigate,
  onOpenQRPoster,
}) => {
  const { studio, profiles, currentUser, currentRole } = useStudioStore();
  const [copied, setCopied] = React.useState(false);
  const adminProfile = profiles.find((p) => p.role === 'admin') || profiles[0];
  const displayName = currentUser?.first_name || adminProfile?.first_name || 'Admin';

  const handleCopyLink = () => {
    const bookingUrl = getRegisterLink();
    navigator.clipboard.writeText(bookingUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="py-6 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-2">
          <div>

            <h1 className="text-xl sm:text-2xl font-extrabold text-[#1F2933] tracking-tight">
              Bienvenido Profe {' '}
              <span className="text-[#3F4E5B]">{displayName}</span>.
            </h1>
          </div>
        </div>

        {/* Layout Grid (Main 2/3 Content + 1/3 Sidebar) */}
        <div className="flex flex-col lg:flex-row gap-8 items-start">

          {/* Main Column */}
          <main className="flex-1 w-full min-w-0">
            {/* 1. Stat Cards */}
            <StatCards onNavigate={onNavigate} />

            {/* 2. Clases de Hoy & Asistencia / Check-in QR en vivo */}
            <TodayClassesSection onNavigate={onNavigate} />

            {/* 3. Estrategia & Marca Section (solo visible para admin) */}
            <EstrategiaMarcaSection onNavigate={onNavigate} />
          </main>

          {/* Right Column: Plan Usage, Limits, Referrals & Help */}
          <SidebarRight onNavigate={onNavigate} />

        </div>

      </div>
    </div>
  );
};
