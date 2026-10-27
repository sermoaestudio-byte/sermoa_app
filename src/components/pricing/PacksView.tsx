import React, { useState } from 'react';
import { Ticket, Plus, Check, Zap, Sparkles, Clock, Edit2, Trash2, Eye, EyeOff, X, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { useStudioStore } from '../../store/studioStore';
import { CreditPack } from '../../types';

export const PacksView: React.FC = () => {
  const { creditPacks, createCreditPack, updateCreditPack, deleteCreditPack } = useStudioStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPack, setEditingPack] = useState<CreditPack | null>(null);

  // Form state
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [creditsCount, setCreditsCount] = useState<number>(8);
  const [price, setPrice] = useState<number>(32000);
  const [validityDays, setValidityDays] = useState<number>(30);
  const [isPopular, setIsPopular] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [isRecurring, setIsRecurring] = useState(false);
  const [saving, setSaving] = useState(false);

  const openCreateModal = () => {
    setEditingPack(null);
    setName('');
    setDescription('');
    setCreditsCount(8);
    setPrice(32000);
    setValidityDays(30);
    setIsPopular(false);
    setIsActive(true);
    setIsRecurring(false);
    setIsModalOpen(true);
  };

  const openEditModal = (pack: CreditPack) => {
    setEditingPack(pack);
    setName(pack.name);
    setDescription(pack.description || '');
    setCreditsCount(pack.credits_count);
    setPrice(pack.price);
    setValidityDays(pack.validity_days);
    setIsPopular(!!pack.popular_badge);
    setIsActive(pack.is_active !== false);
    setIsRecurring(!!pack.is_recurring_monthly);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingPack) {
        await updateCreditPack(editingPack.id, {
          name,
          description,
          credits_count: Number(creditsCount),
          price: Number(price),
          validity_days: Number(validityDays),
          popular_badge: isPopular,
          is_active: isActive,
          is_recurring_monthly: isRecurring,
        });
      } else {
        await createCreditPack({
          name,
          description,
          credits_count: Number(creditsCount),
          price: Number(price),
          validity_days: Number(validityDays),
          popular_badge: isPopular,
          is_active: isActive,
          is_recurring_monthly: isRecurring,
        });
      }
      setIsModalOpen(false);
    } catch (err) {
      console.error('Error guardando pack:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, packName: string) => {
    if (confirm(`¿Estás seguro de eliminar el pack "${packName}"? Esta acción no se puede deshacer.`)) {
      await deleteCreditPack(id);
    }
  };

  const togglePackStatus = async (pack: CreditPack) => {
    await updateCreditPack(pack.id, {
      is_active: !pack.is_active,
    });
  };

  return (
    <div className="py-6 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-purple-700 bg-purple-50 px-3 py-1 rounded-full w-fit mb-2">
              <Ticket className="w-3.5 h-3.5 text-purple-600" />
              <span>Maestro de Packs & Membresías</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Packs de Créditos & Tarifas
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
              Crea y administra los paquetes que tus alumnos podrán adquirir al registrarse o desde su pase digital mediante Mercado Pago.
            </p>
          </div>

          <button
            onClick={openCreateModal}
            className="inline-flex items-center justify-center space-x-2 px-5 py-3 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-extrabold text-xs shadow-md shadow-brand-600/20 transition-all cursor-pointer hover:scale-[1.02]"
          >
            <Plus className="w-4 h-4" />
            <span>Crear Nuevo Pack</span>
          </button>
        </div>

        {/* Packs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {creditPacks.map((pack) => {
            const isPackActive = pack.is_active !== false;

            return (
              <div
                key={pack.id}
                className={`bg-white rounded-3xl p-6 sm:p-7 border transition-all flex flex-col justify-between relative ${
                  !isPackActive
                    ? 'opacity-60 border-slate-200 bg-slate-50/50'
                    : pack.popular_badge
                    ? 'border-brand-500 shadow-soft-lg ring-2 ring-brand-500/20'
                    : 'border-slate-200/80 shadow-soft hover:shadow-soft-lg'
                }`}
              >
                {pack.popular_badge && isPackActive && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-brand-600 text-white font-extrabold text-[10px] uppercase tracking-wider px-3 py-1 rounded-full shadow-sm flex items-center space-x-1">
                    <Sparkles className="w-3 h-3" />
                    <span>Más Recomendado</span>
                  </span>
                )}

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-1.5">
                      <span className={`text-[11px] font-extrabold px-2.5 py-0.5 rounded-full ${
                        isPackActive ? 'text-purple-700 bg-purple-50' : 'text-slate-500 bg-slate-200'
                      }`}>
                        {pack.credits_count === 999 ? 'Pase Libre' : `${pack.credits_count} Clases`}
                      </span>
                      {!isPackActive && (
                        <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">
                          Pausado
                        </span>
                      )}
                    </div>

                    <div className="flex items-center space-x-1 text-xs text-slate-400 font-medium">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{pack.validity_days} días vigencia</span>
                    </div>
                  </div>

                  <h3 className="font-extrabold text-slate-900 text-lg mb-1.5">{pack.name}</h3>
                  <p className="text-xs text-slate-500 mb-6 leading-relaxed min-h-[36px]">
                    {pack.description || 'Sin descripción ingresada.'}
                  </p>

                  {/* Price Display */}
                  <div className="mb-6 pb-6 border-b border-slate-100">
                    <div className="flex items-baseline space-x-1">
                      <span className="text-3xl font-black text-slate-900">
                        ${Number(pack.price).toLocaleString('es-AR')}
                      </span>
                      <span className="text-xs text-slate-400 font-semibold uppercase">
                        ARS / {pack.credits_count === 999 ? 'mes ilimitado' : `${pack.credits_count} créditos`}
                      </span>
                    </div>
                  </div>

                  {/* Features */}
                  <ul className="space-y-2.5 text-xs text-slate-600 mb-6">
                    <li className="flex items-center space-x-2">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{pack.credits_count === 999 ? 'Acceso libre a cualquier clase' : `${pack.credits_count} créditos acreditados automáticamente`}</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Integrado con Checkout de Mercado Pago</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Válido por {pack.validity_days} días a partir del pago</span>
                    </li>
                  </ul>
                </div>

                {/* Actions */}
                <div className="pt-2 border-t border-slate-100 flex items-center space-x-2">
                  <button
                    onClick={() => openEditModal(pack)}
                    className="flex-1 py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-xs rounded-xl border border-slate-200 transition-colors flex items-center justify-center space-x-1.5 cursor-pointer"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Editar Tarifa</span>
                  </button>

                  <button
                    onClick={() => togglePackStatus(pack)}
                    title={isPackActive ? 'Pausar venta del pack' : 'Activar pack'}
                    className={`p-2.5 rounded-xl border transition-colors cursor-pointer ${
                      isPackActive
                        ? 'text-slate-400 hover:text-amber-600 hover:bg-amber-50 border-slate-200'
                        : 'text-emerald-600 bg-emerald-50 border-emerald-200'
                    }`}
                  >
                    {isPackActive ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>

                  <button
                    onClick={() => handleDelete(pack.id, pack.name)}
                    title="Eliminar pack"
                    className="p-2.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl border border-slate-200 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal: Crear / Editar Pack */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
            <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-100 overflow-hidden animate-scale-up">
              
              {/* Modal Header */}
              <div className="p-6 bg-slate-900 text-white flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 rounded-xl bg-purple-600/30 border border-purple-500/40 flex items-center justify-center text-purple-300">
                    <Ticket className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-base">
                      {editingPack ? 'Editar Pack de Clases' : 'Nuevo Pack de Clases'}
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      Configura el precio, créditos y vigencia para Mercado Pago
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setIsModalOpen(false)}
                  className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                
                {/* Nombre */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Nombre del Pack *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej: Pack 8 Clases / Mes"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  />
                </div>

                {/* Descripción */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Descripción
                  </label>
                  <input
                    type="text"
                    placeholder="Ej: Ideal para entrenar 2 veces por semana. Válido por 30 días."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  />
                </div>

                {/* Créditos y Precio */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Cantidad de Clases (Créditos) *
                    </label>
                    <input
                      type="number"
                      required
                      min={1}
                      max={999}
                      value={creditsCount}
                      onChange={(e) => setCreditsCount(Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:ring-2 focus:ring-brand-500 focus:outline-none"
                    />
                    <span className="text-[10px] text-slate-400 mt-0.5 block">Usa 999 para pase ilimitado</span>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Precio en ARS ($) *
                    </label>
                    <input
                      type="number"
                      required
                      min={100}
                      step={500}
                      value={price}
                      onChange={(e) => setPrice(Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:ring-2 focus:ring-brand-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Vigencia */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Vigencia en Días *
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    max={365}
                    value={validityDays}
                    onChange={(e) => setValidityDays(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  />
                  <span className="text-[10px] text-slate-400 mt-0.5 block">Común: 30 días para planes mensuales, 15 días para clases sueltas</span>
                </div>

                {/* Opciones */}
                <div className="pt-2 border-t border-slate-100 space-y-2">
                  <label className="flex items-center space-x-2 text-xs font-medium text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isPopular}
                      onChange={(e) => setIsPopular(e.target.checked)}
                      className="rounded text-brand-600 w-4 h-4"
                    />
                    <span>Destacar como "Más Elegido / Recomendado"</span>
                  </label>

                  <label className="flex items-center space-x-2 text-xs font-medium text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isActive}
                      onChange={(e) => setIsActive(e.target.checked)}
                      className="rounded text-brand-600 w-4 h-4"
                    />
                    <span>Pack activo y disponible para alumnos</span>
                  </label>
                </div>

                {/* Buttons */}
                <div className="pt-4 flex items-center justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    Cancelar
                  </button>

                  <button
                    type="submit"
                    disabled={saving}
                    className="px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-extrabold shadow-md transition-all cursor-pointer disabled:opacity-50"
                  >
                    {saving ? 'Guardando...' : editingPack ? 'Guardar Cambios' : 'Crear Pack'}
                  </button>
                </div>

              </form>

            </div>
          </div>
        )}

      </div>
    </div>
  );
};
