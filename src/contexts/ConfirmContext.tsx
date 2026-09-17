import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { AlertTriangle, Info, X } from 'lucide-react';

type ConfirmType = 'danger' | 'warning' | 'info';

interface ConfirmOptions {
  title?: string;
  type?: ConfirmType;
  confirmText?: string;
  cancelText?: string;
}

interface ConfirmContextType {
  confirm: (message: string, options?: ConfirmOptions) => Promise<boolean>;
}

const ConfirmContext = createContext<ConfirmContextType | undefined>(undefined);

export const useConfirm = () => {
  const context = useContext(ConfirmContext);
  if (!context) {
    throw new Error('useConfirm must be used within a ConfirmProvider');
  }
  return context;
};

export const ConfirmProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [options, setOptions] = useState<ConfirmOptions>({});
  const [resolvePromise, setResolvePromise] = useState<(value: boolean) => void>();

  const confirm = useCallback((msg: string, opts: ConfirmOptions = {}) => {
    setMessage(msg);
    setOptions({
      title: opts.title || 'Confirmar Acción',
      type: opts.type || 'warning',
      confirmText: opts.confirmText || 'Aceptar',
      cancelText: opts.cancelText || 'Cancelar',
    });
    setIsOpen(true);
    
    return new Promise<boolean>((resolve) => {
      setResolvePromise(() => resolve);
    });
  }, []);

  const handleClose = (value: boolean) => {
    setIsOpen(false);
    if (resolvePromise) {
      resolvePromise(value);
    }
  };

  const getTypeStyles = (type: ConfirmType) => {
    switch (type) {
      case 'danger':
        return {
          icon: <AlertTriangle className="w-6 h-6 text-rose-600" />,
          bg: 'bg-rose-100',
          btn: 'bg-rose-600 hover:bg-rose-700 text-white',
        };
      case 'warning':
        return {
          icon: <AlertTriangle className="w-6 h-6 text-amber-600" />,
          bg: 'bg-amber-100',
          btn: 'bg-amber-600 hover:bg-amber-700 text-white',
        };
      case 'info':
      default:
        return {
          icon: <Info className="w-6 h-6 text-brand-600" />,
          bg: 'bg-brand-100',
          btn: 'bg-brand-600 hover:bg-brand-700 text-white',
        };
    }
  };

  const styles = getTypeStyles(options.type || 'warning');

  return (
    <ConfirmContext.Provider value={{ confirm }}>
      {children}
      
      {isOpen && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden animate-slide-up">
            <div className="p-5 flex items-start space-x-4">
              <div className={`p-2 rounded-full flex-shrink-0 ${styles.bg}`}>
                {styles.icon}
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-slate-800">
                  {options.title}
                </h3>
                <p className="mt-2 text-sm text-slate-600 whitespace-pre-wrap">
                  {message}
                </p>
              </div>
            </div>
            <div className="px-5 py-4 bg-slate-50 flex justify-end space-x-3 border-t border-slate-100">
              <button
                onClick={() => handleClose(false)}
                className="px-4 py-2 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-200 transition-colors"
              >
                {options.cancelText}
              </button>
              <button
                onClick={() => handleClose(true)}
                className={`px-4 py-2 rounded-xl text-sm font-bold transition-colors ${styles.btn}`}
              >
                {options.confirmText}
              </button>
            </div>
          </div>
        </div>
      )}
    </ConfirmContext.Provider>
  );
};
