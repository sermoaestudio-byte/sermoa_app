import React, { useState } from 'react';
import { Calendar, Filter, Plus, Building2, Tag, HelpCircle } from 'lucide-react';
import { useStudioStore } from '../../store/studioStore';
import { ClassCalendar } from './ClassCalendar';
import { ClassDetailModal } from './ClassDetailModal';
import { CreateClassModal } from './CreateClassModal';
import { ModuleHelpDrawer } from '../common/ModuleHelpDrawer';
import { ClassSchedule } from '../../types';

export const ClassesView: React.FC = () => {
  const { getEnrichedClasses, activities, branches } = useStudioStore();
  const classes = getEnrichedClasses();

  const [selectedBranchId, setSelectedBranchId] = useState('');
  const [selectedActivityId, setSelectedActivityId] = useState('');
  const [selectedClass, setSelectedClass] = useState<ClassSchedule | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  return (
    <div className="py-6 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header with Title & Filters */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
              <Calendar className="w-3.5 h-3.5 text-brand-600" />
              <span>Operativa Diaria</span>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Clases y Reservas
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Gestiona los horarios, cupos y listas de espera de todas tus sedes
            </p>
          </div>

          {/* Filters & Actions */}
          <div className="flex flex-wrap items-center gap-2.5">
            
            {/* Branch Filter */}
            <div className="flex items-center bg-white border border-slate-200 rounded-xl px-3 py-1.5 shadow-xs">
              <Building2 className="w-3.5 h-3.5 text-slate-400 mr-2" />
              <select
                value={selectedBranchId}
                onChange={(e) => setSelectedBranchId(e.target.value)}
                className="text-xs font-semibold text-slate-700 bg-transparent focus:outline-none"
              >
                <option value="">Todas las sucursales</option>
                {branches.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Activity Filter */}
            <div className="flex items-center bg-white border border-slate-200 rounded-xl px-3 py-1.5 shadow-xs">
              <Tag className="w-3.5 h-3.5 text-slate-400 mr-2" />
              <select
                value={selectedActivityId}
                onChange={(e) => setSelectedActivityId(e.target.value)}
                className="text-xs font-semibold text-slate-700 bg-transparent focus:outline-none"
              >
                <option value="">Todas las disciplinas</option>
                {activities.map((act) => (
                  <option key={act.id} value={act.id}>
                    {act.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Help Button */}
            <button
              onClick={() => setShowHelp(true)}
              className="inline-flex items-center space-x-1.5 px-3 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold shadow-xs transition-all"
              title="Ver guía de Clases y Lista de Espera"
            >
              <HelpCircle className="w-4 h-4 text-brand-600" />
              <span>Ayuda</span>
            </button>

            {/* Create Class Button */}
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center space-x-1.5 px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-extrabold shadow-sm transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Nueva Clase</span>
            </button>

          </div>
        </div>

        {/* Calendar Grid */}
        <ClassCalendar
          classes={classes}
          activities={activities}
          branches={branches}
          selectedBranchId={selectedBranchId}
          selectedActivityId={selectedActivityId}
          onSelectClass={(cls) => setSelectedClass(cls)}
          onCreateClass={() => setShowCreateModal(true)}
        />

        {/* Modals */}
        {selectedClass && (
          <ClassDetailModal
            classItem={selectedClass}
            onClose={() => setSelectedClass(null)}
          />
        )}

        {showCreateModal && (
          <CreateClassModal onClose={() => setShowCreateModal(false)} />
        )}

        {/* Help Drawer */}
        <ModuleHelpDrawer
          isOpen={showHelp}
          moduleId="classes"
          onClose={() => setShowHelp(false)}
        />

      </div>
    </div>
  );
};
