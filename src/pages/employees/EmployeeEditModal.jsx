import Field from '../../components/ui/Field';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Button from '../../components/ui/Button';
import { SEED_POSITIONS, SEED_DEPARTMENTS } from '../../data/employees';

export default function EmployeeEditModal({
  employee,
  editForm,
  editError,
  submittingKey,
  onClose,
  onChange,
  onSubmit,
}) {
  if (!employee) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1f1712]/50 p-4">
      <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-[24px] bg-white p-6 shadow-2xl">
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#9a4f35]">Sửa nhân viên</p>
            <h3 className="mt-1 text-xl font-semibold text-[var(--hr-ink)]">{employee.HoTen || 'N/A'}</h3>
          </div>
          <button type="button" className="text-sm text-[var(--hr-muted)] hover:text-[var(--hr-ink)]" onClick={onClose}>
            Đóng
          </button>
        </div>

        {editError ? <div className="mb-4 rounded-xl bg-[#f3d9d2] px-3 py-2 text-sm text-[#8a3828]">{editError}</div> : null}

        <form className="grid gap-4 md:grid-cols-2" onSubmit={onSubmit}>
          <Field label="Mã nhân viên">
            <Input value={editForm.MaNhanVien} onChange={(event) => onChange({ MaNhanVien: event.target.value })} />
          </Field>
          <Field label="Họ tên">
            <Input value={editForm.HoTen} onChange={(event) => onChange({ HoTen: event.target.value })} />
          </Field>
          <Field label="Email">
            <Input type="email" value={editForm.Email} onChange={(event) => onChange({ Email: event.target.value })} />
          </Field>
          <Field label="Số điện thoại">
            <Input value={editForm.SDT} onChange={(event) => onChange({ SDT: event.target.value })} />
          </Field>
          <Field label="Ngày sinh">
            <Input type="date" value={editForm.NgaySinh} onChange={(event) => onChange({ NgaySinh: event.target.value })} />
          </Field>
          <Field label="Ngày vào làm">
            <Input type="date" value={editForm.NgayVaoLam} onChange={(event) => onChange({ NgayVaoLam: event.target.value })} />
          </Field>
          <Field label="Phòng ban">
            <Select
              value={editForm.MaPhongBan}
              onChange={(event) => onChange({ MaPhongBan: event.target.value })}
            >
              <option value="">-- Chọn phòng ban --</option>
              {SEED_DEPARTMENTS.filter(d => !employee.MaChiNhanh || d.MaChiNhanh === employee.MaChiNhanh).map((dept) => (
                <option key={dept.MaPhongBan} value={dept.MaPhongBan}>
                  {dept.TenPhongBan} ({dept.MaPhongBan})
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Chức vụ">
            <Select value={editForm.MaChucVu} onChange={(event) => onChange({ MaChucVu: event.target.value })}>
              <option value="">-- Chọn chức vụ --</option>
              {SEED_POSITIONS.map((pos) => (
                <option key={pos.MaChucVu} value={pos.MaChucVu}>
                  {pos.TenChucVu} ({pos.MaChucVu})
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Avatar (mock)">
            <Input type="file" accept="image/*" onChange={(event) => onChange({ avatarMock: event.target.files?.[0]?.name || '' })} />
          </Field>
          <Field label="Tệp avatar đã chọn">
            <Input value={editForm.avatarMock} readOnly />
          </Field>
          <div className="md:col-span-2 flex items-center justify-end gap-3">
            <Button type="button" variant="secondary" onClick={onClose}>
              Hủy
            </Button>
            <Button type="submit" variant="accent" loading={submittingKey === 'update-employee'}>
              Lưu thay đổi
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
