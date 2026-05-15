import React from 'react';
import { X } from 'lucide-react';

export default function Modal({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  maxWidth = 'max-w-2xl', 
  padding = 'p-8',
  rounded = 'rounded-[32px]'
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1f1712]/50 p-4 backdrop-blur-sm">
      <div className={`w-full ${maxWidth} ${rounded} bg-white ${padding} shadow-2xl relative overflow-hidden`}>
        {title && (
          <div className="mb-6 flex items-center justify-between">
            <h3 className="text-xl font-semibold text-[var(--hr-ink)]">{title}</h3>
            {onClose && (
              <button 
                onClick={onClose}
                className="rounded-full p-2 text-[var(--hr-muted)] hover:bg-[#fbf5ee] transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
        )}
        {children}
      </div>
    </div>
  );
}
