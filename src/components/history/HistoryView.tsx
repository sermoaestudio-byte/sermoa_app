import React, { useState } from 'react';
import {
  Wallet,
  Download,
  Search,
  Filter,
  ArrowUpRight,
  ArrowDownLeft,
  Clock,
  ArrowLeft,
  User,
  Building,
  CheckCircle2,
  FileSpreadsheet
} from 'lucide-react';
import { useStudioStore } from '../../store/studioStore';
import { exportToCSV } from '../../utils/export';

interface HistoryViewProps {
  onNavigate?: (view: string) => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({ onNavigate }) => {
  const { payments, profiles } = useStudioStore();
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'students' | 'fixed' | 'expenses'>('all');

  const filteredPayments = payments.filter((p) => {
    const student = profiles.find((prof) => prof.id === p.student_id);
    const resolvedStudentName = p.student_name || (student ? `${student.first_name} ${student.last_name}` : '');
    
    // Filtro por tipo
    if (filterType === 'students' && (p.payment_type !== 'income' || (!p.student_id && !resolvedStudentName))) {
      return false;
    }
    if (filterType === 'fixed' && !p.notes?.includes('[PAGO FIJO]') && !p.category?.toLowerCase().includes('fijo') && !p.category?.toLowerCase().includes('alquiler') && !p.category?.toLowerCase().includes('sueldo')) {
      return false;
    }
    if (filterType === 'expenses' && p.payment_type !== 'expense') {
      return false;
    }

    const q = search.toLowerCase();
    return (
      !q ||
      p.concept.toLowerCase().includes(q) ||
      resolvedStudentName.toLowerCase().includes(q) ||
      (p.reference_code && p.reference_code.toLowerCase().includes(q)) ||
      (p.payment_method && p.payment_method.toLowerCase().includes(q)) ||
      (p.category && p.category.toLowerCase().includes(q))
    );
  });

  const handleExportCSV = () => {
    exportToCSV('historial_movimientos_sermoa', filteredPayments);
  };

  return (
    <div className="py-6 sm:py-8 animate-fade-in">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start space-x-3">
            {onNavigate && (
              <button
                onClick={() => onNavigate('dashboard')}
                className="p-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-2xl shadow-xs transition-colors shrink-0 mt-0.5 cursor-pointer"
                title="Volver al Inicio"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}
            <div>
              <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                <Wallet className="w-3.5 h-3.5 text-emerald-600" />
                <span>Auditoría & Finanzas</span>
              </div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                Historial de Movimientos
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Registro cronológico completo de cobros de packs, ingresos y egresos del estudio.
              </p>
            </div>
          </div>

          <button
            onClick={handleExportCSV}
            className="inline-flex items-center space-x-2 px-4 py-2.5 bg-slate-900 hover:bg-black text-white rounded-xl text-xs font-extrabold shadow-sm transition-all self-start sm:self-center cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Descargar CSV</span>
          </button>
        </div>

        {/* Search, Filters and Table */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-soft overflow-hidden space-y-4">
          
          <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar por alumno, concepto o comprobante..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#5E612B]"
              />
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
              <button
                type="button"
                onClick={() => setFilterType('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  filterType === 'all'
                    ? 'bg-slate-900 text-white shadow-2xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                Todos ({payments.length})
              </button>
              <button
                type="button"
                onClick={() => setFilterType('students')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1 cursor-pointer ${
                  filterType === 'students'
                    ? 'bg-emerald-700 text-white shadow-2xs'
                    : 'text-emerald-800 hover:bg-emerald-50'
                }`}
              >
                <span>Cobros a Alumnos</span>
              </button>
              <button
                type="button"
                onClick={() => setFilterType('fixed')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1 cursor-pointer ${
                  filterType === 'fixed'
                    ? 'bg-[#5E612B] text-white shadow-2xs'
                    : 'text-[#5E612B] hover:bg-[#FAF8F5]'
                }`}
              >
                <span>Pagos Fijos</span>
              </button>
              <button
                type="button"
                onClick={() => setFilterType('expenses')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1 cursor-pointer ${
                  filterType === 'expenses'
                    ? 'bg-rose-600 text-white shadow-2xs'
                    : 'text-rose-700 hover:bg-rose-50'
                }`}
              >
                <span>Egresos</span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 text-slate-500 font-extrabold uppercase text-[10px] tracking-wider border-b border-slate-100">
                <tr>
                  <th className="px-6 py-3.5">Fecha</th>
                  <th className="px-6 py-3.5">Concepto</th>
                  <th className="px-6 py-3.5">Alumno / Destinatario</th>
                  <th className="px-6 py-3.5">Método de Pago</th>
                  <th className="px-6 py-3.5">Comprobante</th>
                  <th className="px-6 py-3.5 text-right">Monto</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {filteredPayments.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                      No se encontraron transacciones con el filtro actual.
                    </td>
                  </tr>
                ) : (
                  filteredPayments.map((tx) => {
                    const student = profiles.find((prof) => prof.id === tx.student_id);
                    const studentName = tx.student_name || (student ? `${student.first_name} ${student.last_name}` : null);
                    const isFixed = tx.notes?.includes('[PAGO FIJO]') || tx.category?.toLowerCase().includes('fijo');

                    return (
                      <tr key={tx.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="px-6 py-4 text-slate-500 font-medium whitespace-nowrap">
                          {new Date(tx.created_at).toLocaleDateString('es-AR', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </td>

                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                            <span className="font-bold text-slate-900">{tx.concept}</span>
                            {isFixed && (
                              <span className="bg-[#5E612B]/15 text-[#5E612B] text-[9px] font-extrabold px-1.5 py-0.5 rounded-md border border-[#5E612B]/30 uppercase shrink-0">
                                Fijo
                              </span>
                            )}
                          </div>
                          {tx.category && (
                            <span className="text-[10px] text-stone-400 block mt-0.5">
                              {tx.category}
                            </span>
                          )}
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap">
                          {studentName ? (
                            <div className="flex items-center space-x-2">
                              <div className="w-6 h-6 rounded-full bg-[#E8D5B5] text-[#44261B] text-[10px] font-black flex items-center justify-center shrink-0">
                                {studentName.slice(0, 2).toUpperCase()}
                              </div>
                              <div>
                                <span className="font-extrabold text-[#1F2933] block">
                                  {studentName}
                                </span>
                                <span className="text-[9px] text-emerald-700 font-bold">
                                  Alumno SERMOA
                                </span>
                              </div>
                            </div>
                          ) : (
                            <span className="text-slate-400 italic text-[11px]">
                              {isFixed ? 'Estudio SERMOA' : 'General'}
                            </span>
                          )}
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="capitalize font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200/60">
                            {tx.payment_method === 'mercadopago' ? 'Mercado Pago' : tx.payment_method}
                          </span>
                        </td>

                        <td className="px-6 py-4 font-mono text-[11px] text-slate-500 whitespace-nowrap">
                          {tx.reference_code || 'SIN-REF'}
                        </td>

                        <td className="px-6 py-4 text-right whitespace-nowrap">
                          <span
                            className={`font-black text-sm ${
                              tx.payment_type === 'income' ? 'text-emerald-700' : 'text-rose-600'
                            }`}
                          >
                            {tx.payment_type === 'income' ? '+' : '-'}${tx.amount.toLocaleString('es-AR')}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};
