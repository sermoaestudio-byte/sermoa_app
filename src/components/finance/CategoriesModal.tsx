import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Tag, Plus, Trash2, Check } from 'lucide-react';
import { useStudioStore } from '../../store/studioStore';
import { FinancialCategory, PaymentType } from '../../types';

interface CategoriesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PALETTE_COLORS = [
  '#6366f1', // Indigo
  '#a855f7', // Purple
  '#06b6d4', // Cyan
  '#f59e0b', // Amber
  '#10b981', // Emerald
  '#ec4899', // Pink
  '#ef4444', // Red
  '#3b82f6', // Blue
  '#64748b', // Slate
  '#475569', // Dark Slate
];

export const CategoriesModal: React.FC<CategoriesModalProps> = ({ isOpen, onClose }) => {
  const { financialCategories, createFinancialCategory, toggleFinancialCategory, deleteFinancialCategory } =
    useStudioStore();

  const [newCatName, setNewCatName] = useState('');
  const [newCatType, setNewCatType] = useState<PaymentType>('expense');
  const [selectedColor, setSelectedColor] = useState(PALETTE_COLORS[0]);

  if (!isOpen) return null;

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;

    createFinancialCategory({
      name: newCatName.trim(),
      type: newCatType,
      color: selectedColor,
      is_active: true,
    });

    setNewCatName('');
  };

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 bg-slate-950/60 backdrop-blur-xs animate-fade-in overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-md w-full max-h-[88vh] shadow-2xl border border-slate-100 flex flex-col my-auto overflow-hidden text-left">
        
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 shrink-0">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-brand-50 text-brand-700 flex items-center justify-center">
              <Tag className="w-4 h-4" />
            </div>
            <h3 className="text-base font-black text-slate-900 leading-tight">
              Categorías
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1 min-h-0 text-xs">
          
          <p className="text-slate-500 text-[11px] leading-relaxed">
            Organiza ingresos y gastos por categoría. Puedes crear categorías propias y archivar las que no uses.
          </p>

          {/* Create Category Form */}
          <form onSubmit={handleAddCategory} className="space-y-3 bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80">
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                placeholder="Nueva categoría..."
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
                className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
              <select
                value={newCatType}
                onChange={(e) => setNewCatType(e.target.value as PaymentType)}
                className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none"
              >
                <option value="expense">Gasto</option>
                <option value="income">Ingreso</option>
              </select>
              <button
                type="submit"
                disabled={!newCatName.trim()}
                className="px-4 py-2 bg-brand-olive hover:bg-brand-darkolive disabled:opacity-50 text-white font-extrabold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center space-x-1 shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Agregar</span>
              </button>
            </div>

            {/* Color Palette Selector */}
            <div className="flex items-center space-x-1.5 pt-1">
              <span className="text-[10px] text-slate-400 font-bold mr-1">Color:</span>
              {PALETTE_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setSelectedColor(c)}
                  className={`w-4 h-4 rounded-full transition-transform ${
                    selectedColor === c ? 'scale-125 ring-2 ring-slate-800 ring-offset-1' : 'hover:scale-110'
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </form>

          {/* List of Created Categories */}
          <div>
            <h4 className="font-extrabold text-slate-900 text-xs mb-3">
              Categorías creadas:
            </h4>

            <div className="divide-y divide-slate-100">
              {financialCategories.map((cat: FinancialCategory) => (
                <div
                  key={cat.id}
                  className={`py-3 flex items-center justify-between group transition-opacity ${
                    cat.is_active ? 'opacity-100' : 'opacity-40'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: cat.color || '#6366f1' }}
                    />
                    <span className="font-extrabold text-slate-800 text-xs">
                      {cat.name}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                        cat.type === 'income'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-slate-100 text-slate-600 border border-slate-200'
                      }`}
                    >
                      {cat.type === 'income' ? 'Ingreso' : 'Gasto'}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    {/* Toggle Switch */}
                    <button
                      type="button"
                      onClick={() => toggleFinancialCategory(cat.id)}
                      className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        cat.is_active ? 'bg-brand-olive' : 'bg-slate-300'
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                          cat.is_active ? 'translate-x-4' : 'translate-x-0'
                        }`}
                      />
                    </button>

                    {/* Delete Custom Category Button */}
                    <button
                      type="button"
                      onClick={() => deleteFinancialCategory(cat.id)}
                      className="opacity-0 group-hover:opacity-100 p-1 text-slate-300 hover:text-rose-600 rounded-md transition-opacity"
                      title="Eliminar categoría"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Pinned Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-end shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-extrabold shadow-sm transition-all"
          >
            Listo
          </button>
        </div>

      </div>
    </div>,
    document.body
  );
};
