import React, { useState } from 'react';
import { Wallet, Download, Search, Filter, ArrowUpRight, ArrowDownLeft, Clock, ArrowLeft } from 'lucide-react';
import { useStudioStore } from '../../store/studioStore';
import { exportToCSV } from '../../utils/export';

interface HistoryViewProps {
  onNavigate?: (view: string) => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({ onNavigate }) => {
  const { payments } = useStudioStore();
  const [search, setSearch] = useState('');

  const filteredPayments = payments.filter((p) =>
    p.concept.toLowerCase().includes(search.toLowerCase()) ||
    (p.student_name && p.student_name.toLowerCase().includes(search.toLowerCase())) ||
    p.reference_code.toLowerCase().includes(search.toLowerCase())
  );

  const handleExportCSV = () => {
    exportToCSV('historial_movimientos_sermoa', filteredPayments);
  };

  return (
    <div className="py-6 sm:py-8 animate-fade-in">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
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
                <Wallet className="w-3.5 h-3.5 text-emerald-600" />
                <span>Operativa Diaria</span>
              </div>
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                Historial de Movimientos & Auditoría
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Registro completo de compras, reservas, ingresos y devoluciones
              </p>
            </div>
          </div>

          <button
            onClick={handleExportCSV}
            className="inline-flex items-center space-x-2 px-4 py-2.5 bg-slate-900 hover:bg-black text-white rounded-xl text-xs font-extrabold shadow-sm transition-all self-start sm:self-center"
          >
            <Download className="w-4 h-4" />
            <span>Descargar CSV</span>
          </button>
        </div>

        {/* Search and Table */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-soft overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-slate-100">
            <div className="relative max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar por concepto, alumno o comprobante..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 text-slate-400 font-bold uppercase text-[10px] tracking-wider border-b border-slate-100">
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
                      No hay transacciones registradas.
                    </td>
                  </tr>
                ) : (
                  filteredPayments.map((tx) => (
                    <tr key={tx.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-6 py-4 text-slate-500 font-medium">
                        {new Date(tx.created_at).toLocaleDateString('es-AR')}
                      </td>
                      <td className="px-6 py-4 font-bold text-slate-900">
                        {tx.concept}
                      </td>
                      <td className="px-6 py-4">
                        {tx.student_name || 'Estudio / General'}
                      </td>
                      <td className="px-6 py-4">
                        <span className="capitalize font-semibold text-slate-600">
                          {tx.payment_method}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-mono text-[11px] text-slate-500">
                        {tx.reference_code}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span
                          className={`font-extrabold text-sm ${
                            tx.payment_type === 'income' ? 'text-emerald-700' : 'text-rose-600'
                          }`}
                        >
                          {tx.payment_type === 'income' ? '+' : '-'}${tx.amount.toLocaleString('es-AR')}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};
