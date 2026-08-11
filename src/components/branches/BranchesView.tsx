import React, { useState } from 'react';
import {
  MapPin,
  Building2,
  Plus,
  Compass,
  Clock,
  Navigation,
  Edit2,
  Trash2,
  ArrowLeft,
  HelpCircle,
  Sparkles
} from 'lucide-react';
import { useStudioStore } from '../../store/studioStore';
import { Branch } from '../../types';
import { BranchModal } from './BranchModal';
import { ConfirmDialog } from '../common/ConfirmDialog';
import { ModuleHelpDrawer } from '../common/ModuleHelpDrawer';

interface BranchesViewProps {
  onNavigate?: (view: string) => void;
}

export const BranchesView: React.FC<BranchesViewProps> = ({ onNavigate }) => {
  const { branches, studio, deleteBranch } = useStudioStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [branchToEdit, setBranchToEdit] = useState<Branch | null>(null);
  const [showHelp, setShowHelp] = useState(false);

  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    confirmText: string;
    variant?: 'danger' | 'warning' | 'primary';
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    confirmText: '',
    variant: 'danger',
    onConfirm: () => {},
  });

  const handleOpenCreate = () => {
    setBranchToEdit(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (branch: Branch) => {
    setBranchToEdit(branch);
    setIsModalOpen(true);
  };

  const handleDelete = (branch: Branch) => {
    setConfirmDialog({
      isOpen: true,
      title: '¿Eliminar Sucursal?',
      message: `¿Estás seguro de que deseas eliminar la sucursal "${branch.name}"? Esta acción no se puede deshacer.`,
      confirmText: 'Eliminar Sucursal',
      variant: 'danger',
      onConfirm: () => {
        deleteBranch(branch.id);
        setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
      },
    });
  };

  return (
    <div className="py-6 sm:py-8 animate-fade-in">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Header Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          <div className="flex items-start space-x-3">
            {onNavigate && (
              <button
                onClick={() => onNavigate('dashboard')}
                className="p-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-2xl shadow-xs transition-colors shrink-0 mt-0.5"
                title="Volver al Inicio"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}

            <div>
              <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                <MapPin className="w-3.5 h-3.5 text-amber-500" />
                <span>Operativa Diaria</span>
              </div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                Sucursales & Salas Físicas
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Configura tus ubicaciones físicas, salas de equipamiento y coordenadas GPS para check-in
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2.5 flex-wrap">
            {/* Help Button */}
            <button
              onClick={() => setShowHelp(true)}
              className="px-3 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold shadow-xs flex items-center space-x-1.5 transition-colors"
            >
              <HelpCircle className="w-3.5 h-3.5 text-amber-600" />
              <span>Ayuda</span>
            </button>

            {/* Create Branch Button */}
            <button
              onClick={handleOpenCreate}
              className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-extrabold shadow-md shadow-amber-600/20 flex items-center space-x-1.5 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Nueva Sucursal</span>
            </button>
          </div>

        </div>

        {/* Empty State */}
        {branches.length === 0 && (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-soft space-y-4 my-8">
            <div className="w-16 h-16 rounded-3xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto shadow-xs border border-amber-100">
              <Building2 className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900">
                Aún no has creado sucursales
              </h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
                Registra tu primera sede para definir las salas, cantidad de camas/cupos y ubicación GPS para los alumnos.
              </p>
            </div>
            <button
              onClick={handleOpenCreate}
              className="px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-2xl text-xs font-extrabold shadow-md shadow-amber-600/20 inline-flex items-center space-x-2 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Crear Primera Sucursal</span>
            </button>
          </div>
        )}

        {/* Branches Grid */}
        {branches.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {branches.map((branch) => (
              <div
                key={branch.id}
                className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-soft hover:shadow-soft-lg transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Top Badge & Name & Actions */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center space-x-3.5">
                      <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold shrink-0">
                        <Building2 className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-lg font-extrabold text-slate-900">{branch.name}</h3>
                        <p className="text-xs text-slate-500 font-medium">{branch.address}, {branch.city}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-1.5">
                      <button
                        onClick={() => handleOpenEdit(branch)}
                        className="p-2 text-slate-400 hover:text-amber-700 hover:bg-amber-50 rounded-xl transition-colors"
                        title="Editar sucursal"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(branch)}
                        className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                        title="Eliminar sucursal"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Operating hours */}
                  <div className="bg-slate-50 rounded-2xl p-3.5 mb-4 text-xs text-slate-600 space-y-1.5">
                    <div className="flex items-center space-x-2">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span className="font-semibold">{branch.opening_hours}</span>
                    </div>
                    {branch.phone && (
                      <div className="flex items-center space-x-2">
                        <Navigation className="w-3.5 h-3.5 text-slate-400" />
                        <span>Teléfono: {branch.phone}</span>
                      </div>
                    )}
                  </div>

                  {/* Rooms List */}
                  <div className="mb-4">
                    <h4 className="text-xs font-extrabold text-slate-700 uppercase tracking-tight mb-2">
                      Salas & Capacidad
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {branch.rooms.map((room) => (
                        <div
                          key={room.id}
                          className="p-3 bg-slate-50/80 rounded-xl border border-slate-200/60 flex items-center justify-between text-xs"
                        >
                          <span className="font-bold text-slate-800">{room.name}</span>
                          <span className="text-[11px] font-extrabold text-brand-700 bg-brand-50 px-2 py-0.5 rounded-full">
                            {room.capacity} alumnos
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* GPS Coordinates Badge */}
                  <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-2xl p-3.5 flex items-center justify-between text-xs text-emerald-950">
                    <div className="flex items-center space-x-2">
                      <Compass className="w-4 h-4 text-emerald-600" />
                      <div>
                        <span className="font-bold block">Geolocalización GPS Activa</span>
                        <span className="text-[11px] text-emerald-700 font-mono">
                          Lat: {branch.latitude?.toFixed(4)}, Lon: {branch.longitude?.toFixed(4)}
                        </span>
                      </div>
                    </div>

                    <span className="bg-white text-emerald-800 font-extrabold text-[10px] px-2.5 py-1 rounded-full border border-emerald-200">
                      Radio: {studio.gps_checkin_radius_meters}m
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* Create / Edit Modal */}
      <BranchModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        branchToEdit={branchToEdit}
      />

      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title={confirmDialog.title}
        message={confirmDialog.message}
        confirmText={confirmDialog.confirmText}
        variant={confirmDialog.variant}
        onConfirm={confirmDialog.onConfirm}
        onCancel={() => setConfirmDialog((prev) => ({ ...prev, isOpen: false }))}
      />

      {/* Help Drawer */}
      <ModuleHelpDrawer
        isOpen={showHelp}
        onClose={() => setShowHelp(false)}
        moduleId="branches"
      />

    </div>
  );
};
