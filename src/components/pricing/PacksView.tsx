import React, { useState } from 'react';
import { Ticket, Plus, Check, Zap, Sparkles, Clock } from 'lucide-react';
import { useStudioStore } from '../../store/studioStore';

export const PacksView: React.FC = () => {
  const { creditPacks, studio } = useStudioStore();

  return (
    <div className="py-6 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
              <Ticket className="w-3.5 h-3.5 text-purple-600" />
              <span>Estrategia & Marca</span>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Packs de Créditos & Membresías
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Configura las tarifas, cantidad de clases, vencimientos y planes mensuales
            </p>
          </div>
        </div>

        {/* Packs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {creditPacks.map((pack) => (
            <div
              key={pack.id}
              className={`bg-white rounded-3xl p-6 sm:p-7 border transition-all flex flex-col justify-between relative ${
                pack.popular_badge
                  ? 'border-brand-500 shadow-soft-lg ring-2 ring-brand-500/20'
                  : 'border-slate-200/80 shadow-soft hover:shadow-soft-lg'
              }`}
            >
              {pack.popular_badge && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-brand-600 text-white font-extrabold text-[10px] uppercase tracking-wider px-3 py-1 rounded-full shadow-sm flex items-center space-x-1">
                  <Sparkles className="w-3 h-3" />
                  <span>Más Elegido</span>
                </span>
              )}

              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full">
                    {pack.is_recurring_monthly ? 'Mensual Recurrente' : 'Pack Flexible'}
                  </span>
                  <div className="flex items-center space-x-1 text-xs text-slate-400 font-medium">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{pack.validity_days} días vigencia</span>
                  </div>
                </div>

                <h3 className="font-extrabold text-slate-900 text-lg mb-1.5">{pack.name}</h3>
                <p className="text-xs text-slate-500 mb-6 leading-relaxed">{pack.description}</p>

                {/* Price Display */}
                <div className="mb-6 pb-6 border-b border-slate-100">
                  <div className="flex items-baseline space-x-1">
                    <span className="text-3xl font-black text-slate-900">
                      ${pack.price.toLocaleString('es-AR')}
                    </span>
                    <span className="text-xs text-slate-400 font-semibold uppercase">
                      / {pack.credits_count === 999 ? 'mes ilimitado' : `${pack.credits_count} clases`}
                    </span>
                  </div>
                </div>

                {/* Features */}
                <ul className="space-y-2.5 text-xs text-slate-600 mb-6">
                  <li className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{pack.credits_count === 999 ? 'Pase libre a todas las clases' : `${pack.credits_count} créditos para reservar`}</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Válido en cualquiera de nuestras sucursales</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Cancelación anticipada sin perder crédito</span>
                  </li>
                </ul>
              </div>

              <button className="w-full py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-xs rounded-xl border border-slate-200 transition-colors">
                Editar Tarifas
              </button>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};
