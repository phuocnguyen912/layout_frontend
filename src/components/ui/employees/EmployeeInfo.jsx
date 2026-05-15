import React from 'react';
import Avatar from './Avatar';

export default function EmployeeInfo({ 
  name, 
  subtext, 
  avatarSize = 'md',
  className = ''
}) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <Avatar name={name} size={avatarSize} />
      <div>
        <p className="font-semibold text-[var(--hr-ink)] leading-tight">{name || 'N/A'}</p>
        {subtext && (
          <p className="text-xs text-[var(--hr-muted)] mt-0.5">{subtext}</p>
        )}
      </div>
    </div>
  );
}
