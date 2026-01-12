
import React, { useEffect } from 'react';

export type ToastType = 'success' | 'error' | 'info';

interface ToastProps {
  message: string;
  type: ToastType;
  onClose: () => void;
  duration?: number;
}

const Toast: React.FC<ToastProps> = ({ message, type, onClose, duration = 4000 }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const icons = {
    success: <svg className="h-5 w-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>,
    error: <svg className="h-5 w-5 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>,
    info: <svg className="h-5 w-5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  };

  const bgClasses = {
    success: 'bg-emerald-50 border-emerald-100 shadow-emerald-100',
    error: 'bg-rose-50 border-rose-100 shadow-rose-100',
    info: 'bg-indigo-50 border-indigo-100 shadow-indigo-100',
  };

  return (
    <div className={`fixed top-6 right-6 z-[100] flex items-center gap-4 px-5 py-4 rounded-2xl border glass shadow-2xl animate-scale-in ${bgClasses[type]}`}>
      <div className="flex-shrink-0">{icons[type]}</div>
      <p className="text-sm font-bold text-slate-800 tracking-tight">{message}</p>
      <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors ml-2">
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
      </button>
    </div>
  );
};

export default Toast;
