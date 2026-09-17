import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Save, Layers } from 'lucide-react';
import { useStudioStore } from '../../store/studioStore';

interface BulkEditClassesModalProps {
  selectedClassIds: string[];
  onClose: () => void;
  onSuccess: () => void;
}

export const BulkEditClassesModal: React.FC<BulkEditClassesModalProps> = ({ selectedClassIds, onClose, onSuccess }) => {
  const { profiles, updateClassesBatch } = useStudioStore();

  const [editData, setEditData] = useState({
    title: '',
    instructor_id: '',
    max_capacity: '',
    date: '',
    start_time: '',
    end_time: '',
  });

  const handleSave = () => {
    // Only send fields that have a value
    const dataToUpdate: any = {};
    if (editData.title.trim()) dataToUpdate.title = editData.title;
    if (editData.instructor_id) dataToUpdate.instructor_id = editData.instructor_id;
    if (editData.max_capacity) dataToUpdate.max_capacity = Number(editData.max_capacity);
    if (editData.date) {
      dataToUpdate.date = editData.date;
      const [y, m, d] = editData.date.split('-').map(Number);
      const dateObj = new Date(y, m - 1, d);
      dataToUpdate.day_of_week = dateObj.getDay();
    }
    if (editData.start_time) dataToUpdate.start_time = editData.start_time;
    if (editData.end_time) dataToUpdate.end_time = editData.end_time;

    if (Object.keys(dataToUpdate).length > 0) {
      updateClassesBatch(selectedClassIds, dataToUpdate);
    }
    onSuccess();
  };

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-100 flex flex-col">
        
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-100 flex items-start justify-between">
          <div>
            <div className="flex items-center space-x-2 text-brand-600 mb-1">
              <Layers className="w-5 h-5" />
              <span className="text-xs font-extrabold uppercase tracking-wider">Edición Masiva</span>
            </div>
            <h3 className="text-xl font-extrabold text-slate-900">Editar {selectedClassIds.length} Clases</h3>
            <p className="text-xs text-slate-500 mt-1">
              Solo se actualizarán los campos que modifiques aquí. Los campos vacíos mantendrán su valor original.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Título de la Clase (Opcional)</label>
            <input
              type="text"
              placeholder="Ej: Pilates Inicial"
              value={editData.title}
              onChange={(e) => setEditData({ ...editData, title: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Profesor (Opcional)</label>
            <select
              value={editData.instructor_id}
              onChange={(e) => setEditData({ ...editData, instructor_id: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <option value="">Sin Cambios...</option>
              {profiles.filter(p => p.role === 'instructor' || p.is_instructor).map(p => (
                <option key={p.id} value={p.id}>{p.first_name} {p.last_name}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Capacidad Máxima (Opcional)</label>
              <input
                type="number"
                min="1"
                placeholder="Sin Cambios..."
                value={editData.max_capacity}
                onChange={(e) => setEditData({ ...editData, max_capacity: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
            
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Fecha (Opcional)</label>
              <input
                type="date"
                value={editData.date}
                onChange={(e) => setEditData({ ...editData, date: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Hora de Inicio (Opcional)</label>
              <input
                type="time"
                value={editData.start_time}
                onChange={(e) => setEditData({ ...editData, start_time: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Hora de Fin (Opcional)</label>
              <input
                type="time"
                value={editData.end_time}
                onChange={(e) => setEditData({ ...editData, end_time: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-6 border-t border-slate-100 bg-slate-50 rounded-b-3xl flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl shadow-sm transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold rounded-xl shadow-sm transition-colors flex items-center space-x-1.5"
          >
            <Save className="w-4 h-4" />
            <span>Aplicar Cambios a {selectedClassIds.length} clases</span>
          </button>
        </div>

      </div>
    </div>,
    document.body
  );
};
