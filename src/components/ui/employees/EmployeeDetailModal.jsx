import React from 'react';
import Modal from '../Modal';
import StatusPill from '../StatusPill';
import { resolveEmployeeStatus } from './employeeUtils';
import { formatDateTime } from '../../../utils/format';

export default function EmployeeDetailModal({ employee, onClose }) {
  if (!employee) return null;

  return (
    <Modal
      isOpen={!!employee}
      onClose={onClose}
      title={`Chi tiết nhân viên: ${employee.HoTen || 'N/A'}`}
      maxWidth="max-w-2xl"
      padding="p-6"
      rounded="rounded-[24px]"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <p className="text-xs text-[var(--hr-muted)]">Mã nhân viên</p>
          <p className="font-medium text-[var(--hr-ink)]">{employee.MaNhanVien || 'N/A'}</p>
        </div>
        <div>
          <p className="text-xs text-[var(--hr-muted)]">Trạng thái</p>
          <div className="mt-1"><StatusPill status={resolveEmployeeStatus(employee)} /></div>
        </div>
        <div>
          <p className="text-xs text-[var(--hr-muted)]">Email</p>
          <p className="font-medium text-[var(--hr-ink)]">{employee.Email || 'N/A'}</p>
        </div>
        <div>
          <p className="text-xs text-[var(--hr-muted)]">Số điện thoại</p>
          <p className="font-medium text-[var(--hr-ink)]">{employee.SDT || 'N/A'}</p>
        </div>
        <div>
          <p className="text-xs text-[var(--hr-muted)]">Ngày sinh</p>
          <p className="font-medium text-[var(--hr-ink)]">{employee.NgaySinh ? formatDateTime(employee.NgaySinh) : 'N/A'}</p>
        </div>
        <div>
          <p className="text-xs text-[var(--hr-muted)]">Ngày vào làm</p>
          <p className="font-medium text-[var(--hr-ink)]">{employee.NgayVaoLam ? formatDateTime(employee.NgayVaoLam) : 'N/A'}</p>
        </div>
        <div>
          <p className="text-xs text-[var(--hr-muted)]">Chi nhánh</p>
          <p className="font-medium text-[var(--hr-ink)]">{employee.TenChiNhanh || employee.MaChiNhanh || 'N/A'}</p>
        </div>
        <div>
          <p className="text-xs text-[var(--hr-muted)]">Phòng ban</p>
          <p className="font-medium text-[var(--hr-ink)]">{employee.TenPhongBan || 'N/A'}</p>
        </div>
        <div>
          <p className="text-xs text-[var(--hr-muted)]">Chức vụ</p>
          <p className="font-medium text-[var(--hr-ink)]">{employee.TenChucVu || employee.MaChucVu || 'N/A'}</p>
        </div>
      </div>
    </Modal>
  );
}
