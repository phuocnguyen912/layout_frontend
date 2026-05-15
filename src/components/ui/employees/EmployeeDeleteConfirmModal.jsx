import React from 'react';
import ConfirmModal from '../ConfirmModal';

export default function EmployeeDeleteConfirmModal({ employee, submittingKey, onCancel, onConfirm }) {
  if (!employee) return null;

  return (
    <ConfirmModal
      isOpen={!!employee}
      onClose={onCancel}
      onConfirm={onConfirm}
      title="Xác nhận chuyển nghỉ việc"
      message={(
        <>
          Bạn chắc chắn muốn chuyển <strong>{employee.HoTen || employee.MaNhanVien}</strong> sang trạng thái nghỉ việc?
          Dữ liệu chấm công, lương, nghỉ phép vẫn được giữ lại an toàn.
        </>
      )}
      confirmText="Xác nhận nghỉ việc"
      variant="accent"
      loading={submittingKey === 'delete-employee'}
    />
  );
}

