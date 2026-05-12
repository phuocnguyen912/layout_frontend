import StatusPill from '../../components/ui/StatusPill';
import { resolveEmployeeStatus } from './employeeUtils';
import { formatDateTime } from '../../utils/format';

export default function EmployeeDetailModal({ employee, onClose }) {
  if (!employee) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1f1712]/50 p-4">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-[24px] bg-white p-6 shadow-2xl">
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#9a4f35]">Chi tiết nhân viên</p>
            <h3 className="mt-1 text-xl font-semibold text-[var(--hr-ink)]">{employee.HoTen || 'N/A'}</h3>
          </div>
          <button type="button" className="text-sm text-[var(--hr-muted)] hover:text-[var(--hr-ink)]" onClick={onClose}>
            Đóng
          </button>
        </div>
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
      </div>
    </div>
  );
}
