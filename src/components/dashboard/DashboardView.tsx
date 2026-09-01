import React from 'react';
import { Copy, Check, ExternalLink, Sparkles } from 'lucide-react';
import { useStudioStore } from '../../store/studioStore';
import { StatCards } from './StatCards';
import { OperativaDiariaSection } from './OperativaDiariaSection';
import { EstrategiaMarcaSection } from './EstrategiaMarcaSection';
import { CheckinPromoBanner } from './CheckinPromoBanner';
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
  const { studio, profiles, currentUser } = useStudioStore();
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
        
        {/* Page Header (Matching screenshot 1 exactly) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-2">
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
              <span className="text-sm">⊞</span>
              <span>Panel de Administración</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Resumen y accesos rápidos para la gestión diaria de{' '}
              <span className="text-brand-700">{displayName}</span>.
            </h1>
          </div>

          {/* Quick Copy Link Button */}
          <button
            onClick={handleCopyLink}
            className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold border border-slate-200 shadow-sm transition-all hover:border-slate-300 self-start sm:self-center"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700">¡Link Copiado!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-500" />
                <span>Copiar link de reserva para alumnos</span>
                <ExternalLink className="w-3 h-3 text-slate-400" />
              </>
            )}
          </button>
        </div>

        {/* Layout Grid (Main 2/3 Content + 1/3 Sidebar) */}
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* Main Column */}
          <main className="flex-1 w-full min-w-0">
            {/* 1. Stat Cards */}
            <StatCards onNavigate={onNavigate} />

            {/* 2. Operativa Diaria Section */}
            <OperativaDiariaSection onNavigate={onNavigate} />

            {/* 3. Estrategia & Marca Section */}
            <EstrategiaMarcaSection onNavigate={onNavigate} />

            {/* 4. Checkin Promo Banner & Onboarding */}
            <CheckinPromoBanner
              onOpenQRPoster={onOpenQRPoster}
              onNavigate={onNavigate}
            />
          </main>

          {/* Right Column: Plan Usage, Limits, Referrals & Help */}
          <SidebarRight onNavigate={onNavigate} />

        </div>

      </div>
    </div>
  );
};
