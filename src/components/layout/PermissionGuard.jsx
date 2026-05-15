import React from 'react';
import Panel from '../ui/Panel';

export default function PermissionGuard({ 
  hasPermission, 
  title = "Không có quyền truy cập", 
  subtitle = "Vui lòng kiểm tra lại profile của bạn.",
  description = "Bạn không có quyền xem nội dung này với profile hiện tại.",
  children 
}) {
  if (!hasPermission) {
    return (
      <Panel title={title} subtitle={subtitle}>
        <p className="text-sm text-[var(--hr-muted)]">
          {description}
        </p>
      </Panel>
    );
  }

  return children;
}
