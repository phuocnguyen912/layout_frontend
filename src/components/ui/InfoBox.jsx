import React from 'react';

export default function InfoBox({ title, children, className = '' }) {
  return (
    <div className={`rounded-2xl border border-[#eadbcc] bg-[#fbf5ee] px-4 py-3 ${className}`}>
      {title && (
        <p className="text-sm font-semibold text-[#4f433b]">{title}</p>
      )}
      <div className={`text-sm text-[var(--hr-muted)] ${title ? 'mt-1' : ''}`}>
        {children}
      </div>
    </div>
  );
}
