import React from 'react';
import { AlertCircle, CheckCircle, Info, XCircle } from 'lucide-react';

const icons = {
  success: <CheckCircle className="h-5 w-5 text-emerald-600" />,
  error: <XCircle className="h-5 w-5 text-rose-600" />,
  warning: <AlertCircle className="h-5 w-5 text-amber-600" />,
  info: <Info className="h-5 w-5 text-sky-600" />,
};

const styles = {
  success: 'bg-emerald-50 border-emerald-100 text-emerald-900',
  error: 'bg-rose-50 border-rose-100 text-rose-900',
  warning: 'bg-amber-50 border-amber-100 text-amber-900',
  info: 'bg-sky-50 border-sky-100 text-sky-900',
};

export default function Alert({ type = 'info', message, children, className = '' }) {
  return (
    <div className={`flex items-start gap-3 rounded-2xl border p-4 ${styles[type]} ${className}`}>
      <div className="mt-0.5 flex-shrink-0">
        {icons[type]}
      </div>
      <div className="flex-1 text-sm leading-relaxed">
        {message || children}
      </div>
    </div>
  );
}
