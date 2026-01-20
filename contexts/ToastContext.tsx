"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react";

type ToastType = "success" | "error" | "info" | "warning";

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return context;
};

interface ToastProviderProps {
  children: ReactNode;
}

export const ToastProvider = ({ children }: ToastProviderProps) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (message: string, type: ToastType = "info") => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast: Toast = { id, message, type };

    setToasts((prev) => [...prev, newToast]);

    // Auto remove after 5 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 5000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  const getToastIcon = (type: ToastType) => {
    switch (type) {
      case "success":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "error":
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      case "warning":
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      default:
        return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  const getToastStyles = (type: ToastType) => {
    switch (type) {
      case "success":
        return "border-l-4 border-green-500 bg-green-50";
      case "error":
        return "border-l-4 border-red-500 bg-red-50";
      case "warning":
        return "border-l-4 border-yellow-500 bg-yellow-50";
      default:
        return "border-l-4 border-blue-500 bg-blue-50";
    }
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {/* Toast Container */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 300, scale: 0.3 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{
                opacity: 0,
                x: 300,
                scale: 0.5,
                transition: { duration: 0.2 },
              }}
              className={`
                flex items-center gap-3 p-4 rounded-lg shadow-lg max-w-sm
                ${getToastStyles(toast.type)}
              `}
            >
              {getToastIcon(toast.type)}
              <p className="text-sm font-medium text-dark-green flex-1">
                {toast.message}
              </p>
              <button
                onClick={() => removeToast(toast.id)}
                className="text-dark-green/50 hover:text-dark-green transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};
