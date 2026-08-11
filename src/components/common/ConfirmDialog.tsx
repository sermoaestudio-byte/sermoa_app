import React from 'react';
import { AlertTriangle, Info, CheckCircle2, Trash2, X } from 'lucide-react';

export interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'primary' | 'success';
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  title,
  message,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  variant = 'danger',
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  const getVariantStyles = () => {
    switch (variant) {
      case 'danger':
        return {
          icon: <Trash2 className="w-6 h-6 text-rose-600" />,
          iconBg: 'bg-rose-100',
          confirmBtn: 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-600/20',
          titleColor: 'text-rose-950',
        };
      case 'warning':
        return {
          icon: <AlertTriangle className="w-6 h-6 text-amber-600" />,
          iconBg: 'bg-amber-100',
          confirmBtn: 'bg-amber-600 hover:bg-amber-700 text-white shadow-amber-600/20',
          titleColor: 'text-amber-950',
        };
      case 'success':
        return {
          icon: <CheckCircle2 className="w-6 h-6 text-emerald-600" />,
          iconBg: 'bg-emerald-100',
          confirmBtn: 'bg-brand-olive hover:bg-brand-darkolive text-white shadow-brand-600/20',
          titleColor: 'text-slate-900',
        };
      case 'primary':
      default:
        return {
          icon: <Info className="w-6 h-6 text-brand-600" />,
          iconBg: 'bg-brand-100',
          confirmBtn: 'bg-brand-600 hover:bg-brand-700 text-white shadow-brand-600/20',
          titleColor: 'text-slate-900',
        };
    }
  };

  const styles = getVariantStyles();

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 animate-fade-in relative">
        
        {/* Close Button */}
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Content */}
        <div className="flex items-start space-x-4 mb-5">
          <div className={`w-12 h-12 rounded-2xl ${styles.iconBg} flex items-center justify-center shrink-0 shadow-xs`}>
            {styles.icon}
          </div>
          <div className="pr-4">
            <h3 className={`text-base font-extrabold ${styles.titleColor} tracking-tight`}>
              {title}
            </h3>
            <p className="text-xs text-slate-500 mt-1.5 leading-relaxed font-normal">
              {message}
            </p>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`px-5 py-2 rounded-xl text-xs font-extrabold shadow-sm transition-all ${styles.confirmBtn}`}
          >
            {confirmText}
          </button>
        </div>

      </div>
    </div>
  );
};
