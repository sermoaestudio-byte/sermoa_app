import React, { useState } from 'react';
import { BarChart3, TrendingUp, DollarSign, ArrowUpRight, ArrowDownLeft, Plus, Wallet, PieChart } from 'lucide-react';
import { useStudioStore } from '../../store/studioStore';

export const FinanceView: React.FC = () => {
  const { payments, studio } = useStudioStore();

  const totalIncome = payments
    .filter((p) => p.payment_type === 'income')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const totalExpenses = payments
    .filter((p) => p.payment_type === 'expense')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const netBalance = totalIncome - totalExpenses;
  const monthlyGoal = 250000;
  const goalProgress = Math.min(100, Math.round((totalIncome / monthlyGoal) * 100));

  // Payment methods breakdown
  const mpIncome = payments
    .filter((p) => p.payment_type === 'income' && p.payment_method === 'mercadopago')
    .reduce((a, b) => a + b.amount, 0);
  const transferIncome = payments
    .filter((p) => p.payment_type === 'income' && p.payment_method === 'transfer')
    .reduce((a, b) => a + b.amount, 0);
  const cashIncome = payments
    .filter((p) => p.payment_type === 'income' && p.payment_method === 'cash')
    .reduce((a, b) => a + b.amount, 0);

  return (
    <div className="py-6 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
              <BarChart3 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Estrategia & Marca</span>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Control Financiero & Métricas
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Seguimiento de ingresos, egresos, métodos de cobro y cumplimiento de metas del mes
            </p>
          </div>
        </div>

        {/* Top Financial KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
          
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-soft">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-tight">Ingresos del Mes</span>
              <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
                <ArrowUpRight className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-black text-slate-900">
              ${totalIncome.toLocaleString('es-AR')}
            </div>
            <span className="text-xs text-emerald-700 font-bold mt-1 block">+18% vs mes anterior</span>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-soft">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-tight">Gastos Operativos</span>
              <div className="p-2 rounded-xl bg-rose-50 text-rose-600">
                <ArrowDownLeft className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-black text-slate-900">
              ${totalExpenses.toLocaleString('es-AR')}
            </div>
            <span className="text-xs text-slate-400 font-medium mt-1 block">Mantenimiento y servicios</span>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-soft">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-tight">Balance Neto</span>
              <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
                <Wallet className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-black text-emerald-700">
              ${netBalance.toLocaleString('es-AR')}
            </div>
            <span className="text-xs text-slate-400 font-medium mt-1 block">Flujo de caja disponible</span>
          </div>

        </div>

        {/* Goal Progress & Payment Methods */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Monthly Target Progress */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-soft">
            <h3 className="text-base font-extrabold text-slate-900 mb-1">
              Meta de Facturación Mensual
            </h3>
            <p className="text-xs text-slate-500 mb-6">
              Objetivo fijado para el estudio: ${monthlyGoal.toLocaleString('es-AR')}
            </p>

            <div className="flex items-baseline justify-between text-xs mb-2 font-bold">
              <span className="text-slate-800">${totalIncome.toLocaleString('es-AR')} recaudados</span>
              <span className="text-emerald-700 font-extrabold text-sm">{goalProgress}% alcanzado</span>
            </div>

            <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden mb-4">
              <div
                className="bg-gradient-to-r from-brand-500 to-emerald-600 h-3 rounded-full transition-all duration-500"
                style={{ width: `${goalProgress}%` }}
              ></div>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              Faltan <strong>${Math.max(0, monthlyGoal - totalIncome).toLocaleString('es-AR')}</strong> para alcanzar el objetivo planificado del mes.
            </p>
          </div>

          {/* Payment Methods Breakdown */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-soft">
            <h3 className="text-base font-extrabold text-slate-900 mb-1">
              Cobros por Canal de Pago
            </h3>
            <p className="text-xs text-slate-500 mb-6">
              Distribución de ingresos según el medio elegido por los alumnos
            </p>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span className="text-slate-700">MercadoPago (Online)</span>
                  <span className="text-slate-900">${mpIncome.toLocaleString('es-AR')}</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-blue-500 h-2 rounded-full"
                    style={{ width: `${totalIncome > 0 ? (mpIncome / totalIncome) * 100 : 0}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span className="text-slate-700">Transferencias Bancarias</span>
                  <span className="text-slate-900">${transferIncome.toLocaleString('es-AR')}</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-emerald-500 h-2 rounded-full"
                    style={{ width: `${totalIncome > 0 ? (transferIncome / totalIncome) * 100 : 0}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span className="text-slate-700">Efectivo en Mostrador</span>
                  <span className="text-slate-900">${cashIncome.toLocaleString('es-AR')}</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-amber-500 h-2 rounded-full"
                    style={{ width: `${totalIncome > 0 ? (cashIncome / totalIncome) * 100 : 0}%` }}
                  ></div>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
