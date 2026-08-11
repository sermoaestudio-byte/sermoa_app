import React, { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  DollarSign,
  ArrowUpRight,
  ArrowDownLeft,
  Plus,
  Wallet,
  Scale,
  PieChart,
  ArrowLeft,
  Search,
  Filter,
  Trash2,
  Calendar,
  CreditCard,
  Building,
  User,
  Share2,
  FileSpreadsheet,
  Receipt,
  CheckCircle2,
  Clock,
  History,
  AlertCircle,
  Tag,
  ExternalLink,
  Target,
  ChevronRight,
  Info,
  Sparkles,
  Download,
  Save,
  Check,
  ShieldAlert
} from 'lucide-react';
import { useStudioStore } from '../../store/studioStore';
import { PaymentMethod, PaymentTransaction, PaymentType, Profile } from '../../types';
import { NewTransactionModal } from './NewTransactionModal';
import { CategoriesModal } from './CategoriesModal';
import { ConfirmDialog } from '../common/ConfirmDialog';

interface FinanceViewProps {
  onNavigate?: (view: string) => void;
}

export const FinanceView: React.FC<FinanceViewProps> = ({ onNavigate }) => {
  const {
    payments,
    profiles,
    classes,
    attendances,
    studio,
    financialCategories,
    financialGoals,
    currentRole,
    deleteTransaction,
    updateFinancialGoals,
  } = useStudioStore();

  if (currentRole !== 'admin') {
    return (
      <div className="py-16 px-4 max-w-xl mx-auto text-center animate-fade-in">
        <div className="bg-white p-8 sm:p-12 rounded-3xl border border-slate-200 shadow-soft space-y-4">
          <div className="w-16 h-16 rounded-3xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto shadow-xs border border-rose-100">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-extrabold text-slate-900">
            Módulo Exclusivo para Administradores
          </h2>
          <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
            El control financiero, la caja, el registro de egresos y las métricas de facturación están restringidos únicamente a usuarios con perfil de <strong>Administrador</strong>.
          </p>
          <div className="pt-3">
            {onNavigate && (
              <button
                onClick={() => onNavigate('dashboard')}
                className="px-6 py-2.5 bg-brand-600 hover:bg-brand-700 text-white text-xs font-extrabold rounded-xl transition-all shadow-xs"
              >
                Volver al Panel Principal
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  const students = profiles.filter((p: Profile) => p.role === 'client');

  // Modals state
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [modalDefaultType, setModalDefaultType] = useState<PaymentType>('income');
  const [showCategoriesModal, setShowCategoriesModal] = useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState<PaymentTransaction | null>(null);

  // Search & Filter state for movements
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');

  // Monthly Goals Form State
  const [avgClassPrice, setAvgClassPrice] = useState<number>(financialGoals?.avg_class_price || 9000);
  const [operationalBE, setOperationalBE] = useState<number>(financialGoals?.operational_be_amount || 0);
  const [cashBE, setCashBE] = useState<number>(financialGoals?.cash_be_amount || 0);
  const [targetSales, setTargetSales] = useState<number>(financialGoals?.target_sales_amount || 2300000);
  const [operatingDays, setOperatingDays] = useState<number>(financialGoals?.operating_days || 24);
  const [goalsSavedSuccess, setGoalsSavedSuccess] = useState(false);

  // Current Month String
  const currentDate = new Date();
  const currentMonthName = currentDate.toLocaleDateString('es-AR', { month: 'long', year: 'numeric' });

  // Financial Calculations
  const totalIncome = payments
    .filter((p) => p.payment_type === 'income')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const totalExpenses = payments
    .filter((p) => p.payment_type === 'expense')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const netBalance = totalIncome - totalExpenses;

  // Student Debt & Collection States
  const activeStudentsWithCredits = students.filter(
    (s) => (s.credits_balance || 0) > 2 && (s.debt_amount || 0) === 0
  );
  const expiringSoonStudents = students.filter(
    (s) => (s.credits_balance || 0) > 0 && (s.credits_balance || 0) <= 2 && (s.debt_amount || 0) === 0
  );
  const activeDebtors = students.filter(
    (s) => (s.debt_amount || 0) > 0 && (s.debt_amount || 0) < 50000
  );
  const historicDebtors = students.filter((s) => (s.debt_amount || 0) >= 50000);

  // Monthly Goals Computations
  const safeAvgPrice = avgClassPrice > 0 ? avgClassPrice : 1;
  const classesNeededForOpBE = operationalBE > 0 ? Math.ceil(operationalBE / safeAvgPrice) : 0;
  const classesNeededForCashBE = cashBE > 0 ? Math.ceil(cashBE / safeAvgPrice) : 0;

  // Attendance & Classes counts
  const totalAttendedClasses = attendances.filter((a) => a.status === 'present').length;
  const totalOfferedSpots = classes.reduce((sum, c) => sum + (c.max_capacity || 10), 0);
  const realOccupancy =
    totalOfferedSpots > 0 ? Math.round((totalAttendedClasses / totalOfferedSpots) * 100) : 0;

  // Categories Breakdown Data
  const expensesByCategory = financialCategories
    .filter((c) => c.type === 'expense')
    .map((cat) => {
      const amount = payments
        .filter((p) => p.payment_type === 'expense' && (p.category === cat.name || p.category_id === cat.id))
        .reduce((sum, p) => sum + p.amount, 0);
      return {
        ...cat,
        amount,
        percentage: totalExpenses > 0 ? Math.round((amount / totalExpenses) * 100) : 0,
      };
    })
    .filter((c) => c.amount > 0);

  const incomeByCategory = financialCategories
    .filter((c) => c.type === 'income')
    .map((cat) => {
      const amount = payments
        .filter((p) => p.payment_type === 'income' && (p.category === cat.name || p.category_id === cat.id))
        .reduce((sum, p) => sum + p.amount, 0);
      return {
        ...cat,
        amount,
        percentage: totalIncome > 0 ? Math.round((amount / totalIncome) * 100) : 0,
      };
    })
    .filter((c) => c.amount > 0);

  // Filtered Payments
  const filteredPayments = payments.filter((tx) => {
    const matchesType = filterType === 'all' || tx.payment_type === filterType;
    const matchesCategory = filterCategory === 'all' || tx.category === filterCategory;
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      !query ||
      tx.concept.toLowerCase().includes(query) ||
      (tx.student_name && tx.student_name.toLowerCase().includes(query)) ||
      (tx.reference_code && tx.reference_code.toLowerCase().includes(query)) ||
      (tx.category && tx.category.toLowerCase().includes(query));

    return matchesType && matchesCategory && matchesSearch;
  });

  const handleOpenIncomeModal = () => {
    setModalDefaultType('income');
    setShowTransactionModal(true);
  };

  const handleOpenExpenseModal = () => {
    setModalDefaultType('expense');
    setShowTransactionModal(true);
  };

  const handleConfirmDelete = () => {
    if (transactionToDelete) {
      deleteTransaction(transactionToDelete.id);
      setTransactionToDelete(null);
    }
  };

  const handleSaveGoals = (e: React.FormEvent) => {
    e.preventDefault();
    updateFinancialGoals({
      avg_class_price: Number(avgClassPrice),
      operational_be_amount: Number(operationalBE),
      cash_be_amount: Number(cashBE),
      target_sales_amount: Number(targetSales),
      operating_days: Number(operatingDays),
    });
    setGoalsSavedSuccess(true);
    setTimeout(() => setGoalsSavedSuccess(false), 2500);
  };

  const handleExportExcel = () => {
    if (payments.length === 0) {
      alert('No hay movimientos para exportar.');
      return;
    }

    const headers = ['Fecha', 'Comprobante', 'Tipo', 'Concepto', 'Alumno/Detalle', 'Categoria', 'Metodo', 'Monto'];
    const rows = payments.map((p) => [
      new Date(p.created_at).toLocaleDateString('es-AR'),
      p.reference_code || '',
      p.payment_type === 'income' ? 'Ingreso' : 'Egreso',
      `"${p.concept.replace(/"/g, '""')}"`,
      `"${(p.student_name || '').replace(/"/g, '""')}"`,
      `"${(p.category || '').replace(/"/g, '""')}"`,
      p.payment_method,
      p.amount,
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `movimientos_financieros_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="py-6 sm:py-8 animate-fade-in">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* TOP KPI CARDS (Image 1 Header) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* 1. Facturación del mes */}
          <div className="bg-white rounded-3xl p-5 border-l-4 border-l-blue-500 border border-slate-200/80 shadow-soft flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-500 block mb-1">
                Facturación del mes
              </span>
              <div className="text-2xl font-black text-slate-900 leading-tight">
                {totalIncome.toLocaleString('es-AR')} ARS
              </div>
              <span className="text-[11px] font-bold text-slate-400 mt-1 flex items-center space-x-1">
                <span>↘ 0.0%</span>
              </span>
            </div>
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-base shadow-xs">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>

          {/* 2. Gastos del mes */}
          <div className="bg-white rounded-3xl p-5 border-l-4 border-l-orange-500 border border-slate-200/80 shadow-soft flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-500 block mb-1">
                Gastos del mes
              </span>
              <div className="text-2xl font-black text-slate-900 leading-tight">
                {totalExpenses.toLocaleString('es-AR')} ARS
              </div>
              <span className="text-[11px] font-bold text-slate-400 mt-1 flex items-center space-x-1">
                <span>↗ 0.0%</span>
              </span>
            </div>
            <div className="w-10 h-10 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center font-bold text-base shadow-xs">
              <Wallet className="w-5 h-5" />
            </div>
          </div>

          {/* 3. Ganancia estimada */}
          <div className="bg-white rounded-3xl p-5 border-l-4 border-l-emerald-500 border border-slate-200/80 shadow-soft flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-500 block mb-1">
                Ganancia estimada
              </span>
              <div
                className={`text-2xl font-black leading-tight ${
                  netBalance >= 0 ? 'text-emerald-700' : 'text-rose-600'
                }`}
              >
                {netBalance.toLocaleString('es-AR')} ARS
              </div>
              <span className="text-[11px] font-bold text-slate-400 mt-1 flex items-center space-x-1">
                <span>↘ 0.0%</span>
              </span>
            </div>
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-base shadow-xs">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>

          {/* 4. PE Caja */}
          <div className="bg-white rounded-3xl p-5 border-l-4 border-l-purple-500 border border-slate-200/80 shadow-soft flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-500 block mb-1">
                PE caja
              </span>
              <div className="text-xl font-black text-slate-900 leading-tight">
                {cashBE > 0 ? `$${cashBE.toLocaleString('es-AR')}` : 'Sin configurar'}
              </div>
              <span className="text-[11px] font-bold text-slate-400 mt-1 block">
                {cashBE > 0 ? `${classesNeededForCashBE} clases necesarias` : 'Sin configurar'}
              </span>
            </div>
            <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold text-base shadow-xs">
              <Scale className="w-5 h-5" />
            </div>
          </div>

        </div>

        {/* ESTADO DE COBROS (Image 1 Section) */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-soft space-y-4">
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <Receipt className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-black text-slate-900 leading-none">
                  Estado de cobros
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Resumen actual de alumnos al día y con pago pendiente.
                </p>
              </div>
            </div>

            {onNavigate && (
              <button
                onClick={() => onNavigate('students')}
                className="text-xs font-extrabold text-blue-600 hover:text-blue-700 flex items-center space-x-1 group"
              >
                <span>Ver listado de alumnos</span>
                <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </button>
            )}
          </div>

          {/* 4 Status Blocks */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            
            {/* Alumnos al día */}
            <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200/80 space-y-1">
              <div className="flex items-center space-x-1.5 text-xs font-bold text-emerald-900">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Alumnos al día</span>
              </div>
              <div className="text-2xl font-black text-emerald-800">
                {activeStudentsWithCredits.length}
              </div>
            </div>

            {/* Vencen pronto */}
            <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-200/80 space-y-1">
              <div className="flex items-center space-x-1.5 text-xs font-bold text-blue-900">
                <Calendar className="w-3.5 h-3.5 text-blue-600" />
                <span>Vencen pronto</span>
              </div>
              <div className="text-2xl font-black text-blue-800">
                {expiringSoonStudents.length}
              </div>
              <p className="text-[10px] text-blue-700 font-medium">
                Siguen al día · vencen en los próximos 7 días
              </p>
            </div>

            {/* Deudores activos */}
            <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/80 space-y-1">
              <div className="flex items-center space-x-1.5 text-xs font-bold text-amber-900">
                <Clock className="w-3.5 h-3.5 text-amber-600" />
                <span>Deudores activos</span>
              </div>
              <div className="text-2xl font-black text-amber-800">
                {activeDebtors.length}
              </div>
              <p className="text-[10px] text-amber-700 font-medium">
                Atraso de hasta 30 días
              </p>
            </div>

            {/* Deudores históricos */}
            <div className="p-4 rounded-2xl bg-rose-50/60 border border-rose-200/80 space-y-1">
              <div className="flex items-center space-x-1.5 text-xs font-bold text-rose-900">
                <History className="w-3.5 h-3.5 text-rose-600" />
                <span>Deudores históricos</span>
              </div>
              <div className="text-2xl font-black text-rose-800">
                {historicDebtors.length}
              </div>
              <p className="text-[10px] text-rose-700 font-medium">
                Atraso de más de 30 días
              </p>
            </div>

          </div>

          <div className="pt-2 text-xs text-slate-500 font-medium">
            {activeDebtors.length === 0 && historicDebtors.length === 0 ? (
              <span className="text-slate-400">No hay alumnos con pago pendiente.</span>
            ) : (
              <span className="text-amber-800 font-bold">
                Hay {activeDebtors.length + historicDebtors.length} alumnos con saldos por regularizar.
              </span>
            )}
          </div>

        </div>

        {/* BANNER META MENSUAL (Image 1 Banner) */}
        <div className="p-4 bg-amber-50/80 border border-amber-200/90 rounded-2xl flex items-center justify-between">
          <div className="flex items-center space-x-2 text-xs font-extrabold text-amber-950">
            <Target className="w-4 h-4 text-amber-600" />
            <span>🎯 Meta mensual:</span>
            <span className="font-medium text-amber-800">
              {targetSales > 0
                ? `Objetivo $${targetSales.toLocaleString('es-AR')} · Recaudado: ${Math.min(
                    100,
                    Math.round((totalIncome / targetSales) * 100)
                  )}%`
                : 'Configure la meta en Objetivos del mes (abajo)'}
            </span>
          </div>
        </div>

        {/* MOVIMIENTOS DEL MES & TABLA (Image 1 Movements Section) */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-soft space-y-5">
          
          {/* Header with 4 actions */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center space-x-2 text-xs font-bold text-slate-500 mb-1">
                <Receipt className="w-4 h-4 text-slate-600" />
                <span>Libro Diario</span>
              </div>
              <h2 className="text-xl font-black text-slate-900 tracking-tight">
                Movimientos del mes
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Pagos de alumnos, gastos e ingresos que registres en el mes.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {/* Exportar Excel */}
              <button
                onClick={handleExportExcel}
                className="px-3.5 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors flex items-center space-x-1.5 shadow-2xs"
              >
                <Download className="w-3.5 h-3.5 text-slate-500" />
                <span>Exportar Excel</span>
              </button>

              {/* Categorías */}
              <button
                onClick={() => setShowCategoriesModal(true)}
                className="px-3.5 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors flex items-center space-x-1.5 shadow-2xs"
              >
                <Tag className="w-3.5 h-3.5 text-slate-500" />
                <span>Categorías</span>
              </button>

              {/* + Ingreso */}
              <button
                onClick={handleOpenIncomeModal}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold rounded-xl shadow-xs transition-all flex items-center space-x-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Ingreso</span>
              </button>

              {/* + Egreso */}
              <button
                onClick={handleOpenExpenseModal}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-extrabold rounded-xl shadow-xs transition-all flex items-center space-x-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Egreso</span>
              </button>
            </div>
          </div>

          {/* Filters Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            
            {/* Type Filters */}
            <div className="flex items-center space-x-1.5 w-full sm:w-auto">
              <button
                onClick={() => setFilterType('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  filterType === 'all'
                    ? 'bg-slate-900 text-white shadow-2xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                Todos ({payments.length})
              </button>
              <button
                onClick={() => setFilterType('income')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1 ${
                  filterType === 'income'
                    ? 'bg-emerald-600 text-white shadow-2xs'
                    : 'text-emerald-700 hover:bg-emerald-50'
                }`}
              >
                <span>Ingresos (+)</span>
              </button>
              <button
                onClick={() => setFilterType('expense')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1 ${
                  filterType === 'expense'
                    ? 'bg-rose-600 text-white shadow-2xs'
                    : 'text-rose-700 hover:bg-rose-50'
                }`}
              >
                <span>Egresos (-)</span>
              </button>
            </div>

            {/* Category and Search */}
            <div className="flex items-center space-x-2 w-full sm:w-auto">
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none"
              >
                <option value="all">Todas las Categorías</option>
                {financialCategories.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name} ({c.type === 'income' ? 'Ingreso' : 'Gasto'})
                  </option>
                ))}
              </select>

              <div className="relative flex-1 sm:w-60">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Buscar movimiento..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
            </div>

          </div>

          {/* Movements Table */}
          {filteredPayments.length === 0 ? (
            <div className="py-12 text-center text-slate-400 border border-dashed border-slate-200 rounded-2xl">
              <Receipt className="w-8 h-8 mx-auto text-slate-300 mb-2" />
              <p className="text-xs font-bold text-slate-600">No hay movimientos registrados este mes</p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Usa los botones <strong>+ Ingreso</strong> o <strong>+ Egreso</strong> para asentar los cobros y gastos.
              </p>
            </div>
          ) : (
            <div className="border border-slate-200/80 rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50/80 text-slate-500 font-extrabold uppercase text-[10px] tracking-wider border-b border-slate-100">
                    <tr>
                      <th className="py-3 px-4">Fecha & Ref</th>
                      <th className="py-3 px-4">Concepto / Alumno</th>
                      <th className="py-3 px-4">Categoría</th>
                      <th className="py-3 px-4">Medio</th>
                      <th className="py-3 px-4 text-right">Monto</th>
                      <th className="py-3 px-4 text-center">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                    {filteredPayments.map((tx) => (
                      <tr key={tx.id} className="hover:bg-slate-50/70 transition-colors">
                        
                        <td className="py-3 px-4 whitespace-nowrap">
                          <div className="flex items-center space-x-2">
                            <div
                              className={`w-6 h-6 rounded-lg flex items-center justify-center text-white shrink-0 ${
                                tx.payment_type === 'income' ? 'bg-emerald-600' : 'bg-rose-600'
                              }`}
                            >
                              {tx.payment_type === 'income' ? (
                                <ArrowUpRight className="w-3.5 h-3.5" />
                              ) : (
                                <ArrowDownLeft className="w-3.5 h-3.5" />
                              )}
                            </div>
                            <div>
                              <span className="font-bold text-slate-900 block text-xs">
                                {new Date(tx.created_at).toLocaleDateString('es-AR', {
                                  day: '2-digit',
                                  month: 'short',
                                })}
                              </span>
                              <span className="font-mono text-[9px] text-slate-400 block">
                                {tx.reference_code || 'SIN-REF'}
                              </span>
                            </div>
                          </div>
                        </td>

                        <td className="py-3 px-4">
                          <div>
                            <span className="font-bold text-slate-900 block text-xs">
                              {tx.concept}
                            </span>
                            {tx.student_name && (
                              <span className="text-[11px] text-slate-500 flex items-center space-x-1 mt-0.5">
                                <User className="w-3 h-3 text-slate-400" />
                                <span>{tx.student_name}</span>
                              </span>
                            )}
                          </div>
                        </td>

                        <td className="py-3 px-4">
                          <span className="inline-block px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200/60">
                            {tx.category || (tx.payment_type === 'income' ? 'Ingreso' : 'Gasto')}
                          </span>
                        </td>

                        <td className="py-3 px-4 whitespace-nowrap">
                          <span className="text-xs font-semibold text-slate-600 capitalize">
                            {tx.payment_method}
                          </span>
                        </td>

                        <td className="py-3 px-4 text-right whitespace-nowrap">
                          <span
                            className={`text-sm font-black ${
                              tx.payment_type === 'income' ? 'text-emerald-700' : 'text-rose-600'
                            }`}
                          >
                            {tx.payment_type === 'income' ? '+' : '-'}${tx.amount.toLocaleString('es-AR')}
                          </span>
                        </td>

                        <td className="py-3 px-4 text-center">
                          <button
                            onClick={() => setTransactionToDelete(tx)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                            title="Eliminar movimiento"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>

                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>

        {/* GRAFICOS DE CATEGORIAS (Image 3 Section) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Gastos por categoría */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-soft space-y-4">
            <h3 className="text-base font-black text-slate-900 tracking-tight">
              Gastos por categoría
            </h3>

            {expensesByCategory.length === 0 ? (
              <div className="h-44 border border-dashed border-slate-200 rounded-2xl flex items-center justify-center text-xs text-slate-400">
                <span>Sin datos este mes</span>
              </div>
            ) : (
              <div className="space-y-3 pt-1">
                {expensesByCategory.map((cat) => (
                  <div key={cat.id}>
                    <div className="flex justify-between text-xs font-bold mb-1">
                      <span className="flex items-center space-x-2 text-slate-700">
                        <span
                          className="w-2.5 h-2.5 rounded-full inline-block"
                          style={{ backgroundColor: cat.color }}
                        />
                        <span>{cat.name}</span>
                      </span>
                      <span className="text-slate-900">${cat.amount.toLocaleString('es-AR')} ({cat.percentage}%)</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div
                        className="h-2 rounded-full"
                        style={{ width: `${cat.percentage}%`, backgroundColor: cat.color }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Ingresos por categoría */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-soft space-y-4">
            <h3 className="text-base font-black text-slate-900 tracking-tight">
              Ingresos por categoría
            </h3>

            {incomeByCategory.length === 0 ? (
              <div className="h-44 border border-dashed border-slate-200 rounded-2xl flex items-center justify-center text-xs text-slate-400">
                <span>Sin ingresos este mes</span>
              </div>
            ) : (
              <div className="space-y-3 pt-1">
                {incomeByCategory.map((cat) => (
                  <div key={cat.id}>
                    <div className="flex justify-between text-xs font-bold mb-1">
                      <span className="flex items-center space-x-2 text-slate-700">
                        <span
                          className="w-2.5 h-2.5 rounded-full inline-block"
                          style={{ backgroundColor: cat.color }}
                        />
                        <span>{cat.name}</span>
                      </span>
                      <span className="text-slate-900">${cat.amount.toLocaleString('es-AR')} ({cat.percentage}%)</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div
                        className="h-2 rounded-full"
                        style={{ width: `${cat.percentage}%`, backgroundColor: cat.color }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* PLAN Y PROGRESO DEL MES (Image 4 Section) */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-soft space-y-6">
          
          <div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">
              Plan y progreso del mes
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* COLUMNA 1: OBJETIVOS */}
            <div className="space-y-4 bg-slate-50/60 p-5 rounded-2xl border border-slate-200/80">
              <div>
                <h4 className="font-extrabold text-slate-900 text-sm">Objetivos</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Valores para <strong>{currentMonthName}</strong>. Puedes definir metas distintas cada mes.
                </p>
              </div>

              <form onSubmit={handleSaveGoals} className="space-y-3.5 text-xs">
                {/* Precio promedio por clase */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-bold text-slate-700">Precio promedio por clase</label>
                    <button
                      type="button"
                      onClick={() => setAvgClassPrice(9000)}
                      className="text-[10px] font-bold text-blue-600 hover:underline"
                    >
                      Sugerir precio
                    </button>
                  </div>
                  <input
                    type="number"
                    placeholder="Ej. 9000"
                    value={avgClassPrice}
                    onChange={(e) => setAvgClassPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>

                {/* PE operativo ($) */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-bold text-slate-700">PE operativo ($)</label>
                    <button
                      type="button"
                      onClick={() => setOperationalBE(totalExpenses)}
                      className="text-[10px] font-bold text-blue-600 hover:underline"
                    >
                      Usar gastos operativos
                    </button>
                  </div>
                  <input
                    type="number"
                    placeholder="0"
                    value={operationalBE}
                    onChange={(e) => setOperationalBE(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>

                {/* PE caja ($) */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-bold text-slate-700">PE caja ($)</label>
                    <button
                      type="button"
                      onClick={() => setCashBE(totalExpenses)}
                      className="text-[10px] font-bold text-blue-600 hover:underline"
                    >
                      Usar gastos del mes
                    </button>
                  </div>
                  <input
                    type="number"
                    placeholder="Todo lo que sale de caja"
                    value={cashBE}
                    onChange={(e) => setCashBE(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>

                {/* Venta mensual objetivo */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Venta mensual objetivo
                  </label>
                  <input
                    type="number"
                    placeholder="Ej. 23000000"
                    value={targetSales}
                    onChange={(e) => setTargetSales(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>

                {/* Días operativos */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Días operativos (opcional)
                  </label>
                  <input
                    type="number"
                    placeholder="Ej. 24"
                    value={operatingDays}
                    onChange={(e) => setOperatingDays(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-slate-900 hover:bg-black text-white font-extrabold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center space-x-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{goalsSavedSuccess ? '¡Guardado!' : 'Guardar Objetivos'}</span>
                </button>
              </form>
            </div>

            {/* COLUMNA 2: TU NEGOCIO EN CLASES */}
            <div className="space-y-4 bg-slate-50/60 p-5 rounded-2xl border border-slate-200/80 flex flex-col justify-between">
              <div>
                <h4 className="font-extrabold text-slate-900 text-sm mb-3">
                  Tu negocio en clases
                </h4>

                {avgClassPrice <= 0 ? (
                  <div className="p-3 bg-amber-50 border border-amber-200 text-amber-900 rounded-xl text-xs font-semibold mb-3">
                    Configura el precio promedio por clase para ver cuántas clases necesitas vender.
                  </div>
                ) : null}

                {classes.length === 0 ? (
                  <div className="p-3 bg-slate-100/80 border border-slate-200 text-slate-500 rounded-xl text-xs mb-4">
                    No hay clases programadas este mes. Las métricas de ocupación aparecerán cuando tengas clases en el calendario.
                  </div>
                ) : null}

                <div className="space-y-3 text-xs">
                  <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                    <span className="font-bold text-slate-600 uppercase text-[10px]">Métrica</span>
                    <span className="font-bold text-slate-600 uppercase text-[10px]">Resultado Aproximado</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-slate-700">Precio promedio por clase</span>
                    <span className="font-black text-slate-900">
                      {avgClassPrice > 0 ? `$${avgClassPrice.toLocaleString('es-AR')}` : 'Sin configurar'}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-slate-700">Punto de equilibrio operativo</span>
                    <span className="font-black text-slate-900">
                      {operationalBE > 0 && avgClassPrice > 0
                        ? `${classesNeededForOpBE} clases`
                        : 'Configura PE operativo y precio'}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-slate-700">Punto de equilibrio de caja</span>
                    <span className="font-black text-slate-900">
                      {cashBE > 0 && avgClassPrice > 0
                        ? `${classesNeededForCashBE} clases`
                        : 'Configura PE caja'}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-slate-700">Ocupación requerida para PE</span>
                    <span className="font-black text-slate-900">
                      {totalOfferedSpots > 0 && classesNeededForOpBE > 0
                        ? `${Math.round((classesNeededForOpBE / totalOfferedSpots) * 100)}%`
                        : '—'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200/80 text-[11px] text-slate-400">
                * Estimación automática basada en tus turnos y costos mensuales.
              </div>
            </div>

            {/* COLUMNA 3: ¿CÓMO VAS? */}
            <div className="space-y-4 bg-slate-50/60 p-5 rounded-2xl border border-slate-200/80 flex flex-col justify-between">
              <div>
                <h4 className="font-extrabold text-slate-900 text-sm mb-4">
                  ¿Cómo vas?
                </h4>

                <div className="space-y-4 text-xs">
                  <div>
                    <span className="text-slate-500 font-medium block text-[11px]">
                      Clases atendidas
                    </span>
                    <span className="text-2xl font-black text-slate-900">
                      {totalAttendedClasses}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-500 font-medium block text-[11px]">
                      Ocupación real
                    </span>
                    <span className="text-2xl font-black text-slate-900">
                      {totalOfferedSpots > 0 ? `${realOccupancy}%` : '—'}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-500 font-medium block text-[11px]">
                      Facturación acumulada
                    </span>
                    <span className="text-2xl font-black text-emerald-700">
                      ${totalIncome.toLocaleString('es-AR')}
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200/80 text-[11px] text-slate-400">
                {currentDate.getDate()} días transcurridos de {operatingDays} días hábiles (lun–sáb)
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* Categories Modal Drawer */}
      <CategoriesModal
        isOpen={showCategoriesModal}
        onClose={() => setShowCategoriesModal(false)}
      />

      {/* New Transaction Modal */}
      <NewTransactionModal
        isOpen={showTransactionModal}
        onClose={() => setShowTransactionModal(false)}
        defaultType={modalDefaultType}
      />

      {/* Delete Movement Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!transactionToDelete}
        title="¿Eliminar movimiento de caja?"
        message={`Se eliminará el registro "${transactionToDelete?.concept}" por un importe de $${transactionToDelete?.amount.toLocaleString('es-AR')}.`}
        confirmText="Sí, Eliminar"
        cancelText="Conservar"
        variant="danger"
        onConfirm={handleConfirmDelete}
        onCancel={() => setTransactionToDelete(null)}
      />

    </div>
  );
};
