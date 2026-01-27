'use client';

import { createContext, useContext, useState, useCallback } from 'react';
import { X } from 'lucide-react';

interface Toast {
    id: string;
    title: string;
    description?: string;
    variant?: 'default' | 'success' | 'error';
}

interface ToastContextType {
    toasts: Toast[];
    addToast: (toast: Omit<Toast, 'id'>) => void;
    removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const addToast = useCallback((toast: Omit<Toast, 'id'>) => {
        const id = Math.random().toString(36).substring(7);
        setToasts((prev) => [...prev, { ...toast, id }]);
        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, 5000);
    }, []);

    const removeToast = useCallback((id: string) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    return (
        <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
            {children}
        </ToastContext.Provider>
    );
}

export function useToast() {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
}

export function Toaster() {
    return <ToasterContent />;
}

function ToasterContent() {
    const { toasts, removeToast } = useToast();

    if (toasts.length === 0) return null;

    return (
        <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
            {toasts.map((toast) => (
                <div
                    key={toast.id}
                    className={`
            animate-slide-up p-4 rounded-xl shadow-lg min-w-[300px] backdrop-blur-lg
            ${toast.variant === 'error'
                            ? 'bg-red-500/90 text-white'
                            : toast.variant === 'success'
                                ? 'bg-green-500/90 text-white'
                                : 'bg-white/90 dark:bg-gray-800/90 text-gray-900 dark:text-white'
                        }
          `}
                >
                    <div className="flex items-start justify-between gap-2">
                        <div>
                            <p className="font-semibold">{toast.title}</p>
                            {toast.description && (
                                <p className="text-sm opacity-90 mt-1">{toast.description}</p>
                            )}
                        </div>
                        <button
                            onClick={() => removeToast(toast.id)}
                            className="opacity-70 hover:opacity-100 transition-opacity"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}
