import React from 'react';
import { getInitials } from '../../../utils/format';

export default function Avatar({ name, size = 'md', className = '' }) {
  const sizeClasses = {
    sm: 'h-8 w-8 text-xs',
    md: 'h-9 w-9 text-sm',
    lg: 'h-11 w-11 text-base',
  };

  return (
    <div className={`flex flex-shrink-0 items-center justify-center rounded-xl bg-[#ecd7cb] font-semibold text-[#8a3828] ${sizeClasses[size]} ${className}`}>
      {getInitials(name)}
    </div>
  );
}
