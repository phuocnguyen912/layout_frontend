import Button from '../../components/ui/Button';

export default function EmployeeDeleteConfirmModal({ employee, submittingKey, onCancel, onConfirm }) {
  if (!employee) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1f1712]/50 p-4">
      <div className="w-full max-w-lg rounded-[24px] bg-white p-6 shadow-2xl">
        <h3 className="text-xl font-semibold text-[var(--hr-ink)]">Xác nhận chuyển nghỉ việc</h3>
        <p className="mt-3 text-sm text-[var(--hr-muted)]">
          Bạn chắc chắn muốn chuyển <strong>{employee.HoTen || employee.MaNhanVien}</strong> sang trạng thái nghỉ việc?
          Dữ liệu chấm công, lương, nghỉ phép vẫn được giữ lại an toàn.
        </p>
        <div className="mt-6 flex items-center justify-end gap-3">
          <Button type="button" variant="secondary" onClick={onCancel}>
            Hủy
          </Button>
          <Button type="button" variant="accent" loading={submittingKey === 'delete-employee'} onClick={onConfirm}>
            Xác nhận nghỉ việc
          </Button>
        </div>
      </div>
    </div>
  );
}

