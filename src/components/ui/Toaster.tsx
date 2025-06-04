import React, { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { X, CheckCircle, AlertCircle, Info, XCircle } from 'lucide-react';
import { createPortal } from 'react-dom';
import { twMerge } from 'tailwind-merge';
import { motion, AnimatePresence } from 'framer-motion';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

interface ToasterContextType {
  toasts: Toast[];
  addToast: (message: string, type: ToastType, duration?: number) => void;
  removeToast: (id: string) => void;
}

const ToasterContext = createContext<ToasterContextType | undefined>(undefined);

export const useToaster = () => {
  const context = useContext(ToasterContext);
  if (!context) {
    throw new Error('useToaster must be used within ToasterProvider');
  }
  return context;
};

export const ToasterProvider = ({ children }: { children: ReactNode }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (message: string, type: ToastType, duration: number = 5000) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type, duration }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  return (
    <ToasterContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      <Toaster />
    </ToasterContext.Provider>
  );
};

const ToastIcon = ({ type }: { type: ToastType }) => {
  switch (type) {
    case 'success':
      return <CheckCircle className="w-5 h-5 text-success-500" />;
    case 'error':
      return <XCircle className="w-5 h-5 text-error-500" />;
    case 'info':
      return <Info className="w-5 h-5 text-primary-500" />;
    case 'warning':
      return <AlertCircle className="w-5 h-5 text-warning-500" />;
  }
};

const ToastItem = ({ toast, onRemove }: { toast: Toast; onRemove: () => void }) => {
  useEffect(() => {
    if (toast.duration) {
      const timer = setTimeout(() => {
        onRemove();
      }, toast.duration);
      return () => clearTimeout(timer);
    }
  }, [toast, onRemove]);

  const variants = {
    initial: { opacity: 0, y: 50, scale: 0.3 },
    animate: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, scale: 0.5, transition: { duration: 0.2 } }
  };

  const getBgColor = () => {
    switch (toast.type) {
      case 'success': return 'bg-success-50 border-success-200';
      case 'error': return 'bg-error-50 border-error-200';
      case 'info': return 'bg-primary-50 border-primary-200';
      case 'warning': return 'bg-warning-50 border-warning-200';
    }
  };

  return (
    <motion.div
      layout
      key={toast.id}
      variants={variants}
      initial="initial"
      animate="animate"
      exit="exit"
      className={twMerge(
        "flex items-start p-4 mb-3 rounded-lg shadow-md border",
        getBgColor()
      )}
    >
      <div className="flex-shrink-0 mr-3 mt-0.5">
        <ToastIcon type={toast.type} />
      </div>
      <div className="flex-grow mr-2">
        <p className="text-sm text-neutral-800">{toast.message}</p>
      </div>
      <button
        onClick={onRemove}
        className="flex-shrink-0 text-neutral-400 hover:text-neutral-500"
      >
        <X className="w-4 h-4" />
      </button>
    </motion.div>
  );
};

const Toaster = () => {
  const { toasts, removeToast } = useToaster();

  return createPortal(
    <div className="fixed top-4 right-4 z-50 w-full max-w-sm">
      <AnimatePresence>
        {toasts.map((toast) => (
          <ToastItem 
            key={toast.id} 
            toast={toast} 
            onRemove={() => removeToast(toast.id)} 
          />
        ))}
      </AnimatePresence>
    </div>,
    document.body
  );
};

export default ToasterProvider;