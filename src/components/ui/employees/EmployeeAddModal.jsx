import { useState, useEffect } from 'react';
import { UserPlus } from 'lucide-react';
import Field from '../Field';
import Input from '../Input';
import Select from '../Select';
import Button from '../Button';
import Modal from '../Modal';
import Alert from '../Alert';
import { SEED_POSITIONS, SEED_DEPARTMENTS } from '../../../data/employees';

const defaultEmployeeForm = {
  maNhanVien: '',
  hoTen: '',
  ngaySinh: '',
  gioiTinh: 'Nam',
  sdt: '',
  email: '',
  maPhongBan: '',
  maChucVu: '',
  ngayVaoLam: '',
  maChiNhanh: '',
};

export default function EmployeeAddModal({
  isOpen,
  onClose,
  onSubmit,
  submittingKey,
  initialMaChiNhanh = '',
  branches = [],
  isNode = false,
  existingIds = [],
}) {
  const [form, setForm] = useState(defaultEmployeeForm);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      let nextId = '';
      if (existingIds && existingIds.length > 0) {
        const nvIds = existingIds
          .filter((id) => id && id.startsWith('NV'))
          .map((id) => parseInt(id.replace('NV', ''), 10))
          .filter((num) => !isNaN(num));
        const maxId = nvIds.length > 0 ? Math.max(...nvIds) : 0;
        nextId = `NV${(maxId + 1).toString().padStart(3, '0')}`;
      } else if (existingIds) {
        // Neu mang rong nhung ton tai (lan dau tao)
        nextId = 'NV001';
      }

      setForm({ ...defaultEmployeeForm, maChiNhanh: initialMaChiNhanh, maNhanVien: nextId });
      setError('');
    }
  }, [isOpen, initialMaChiNhanh, existingIds]);

  if (!isOpen) return null;

  function validate(data) {
    if (!data.maNhanVien?.trim()) return 'Mã nhân viên không được để trống.';
    if (data.maNhanVien.trim().length > 10) return 'Mã nhân viên tối đa 10 ký tự.';
    
    if (!data.hoTen?.trim()) return 'Họ tên không được để trống.';

    if (!data.ngaySinh) return 'Vui lòng chọn ngày sinh.';
    const birthDate = new Date(data.ngaySinh);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    if (age < 18) return 'Nhân viên phải từ 18 tuổi trở lên.';

    if (data.sdt) {
      const phoneRegex = /^0\d{9}$/;
      if (!phoneRegex.test(data.sdt)) return 'Số điện thoại phải bắt đầu bằng số 0 và có đúng 10 chữ số.';
    }

    if (data.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(data.email)) return 'Địa chỉ email không hợp lệ.';
    }

    if (!data.maPhongBan?.trim()) return 'Vui lòng chọn phòng ban.';
    
    if (!data.maChucVu?.trim()) return 'Vui lòng chọn chức vụ.';

    if (!data.maChiNhanh?.trim()) return 'Mã chi nhánh không xác định.';
    
    return '';
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    const err = validate(form);
    if (err) {
      setError(err);
      return;
    }
    setError('');
    onSubmit(form);
  };

  const handleChange = (patch) => {
    setForm((prev) => {
      const next = { ...prev, ...patch };
      
      // Auto-assign branch when department is selected
      if (patch.maPhongBan) {
        const dept = SEED_DEPARTMENTS.find(d => d.MaPhongBan === patch.maPhongBan);
        if (dept && dept.MaChiNhanh) {
          next.maChiNhanh = dept.MaChiNhanh;
        }
      }

      return next;
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Tạo hồ sơ nhân sự mới"
      maxWidth="max-w-3xl"
      padding="p-6"
      rounded="rounded-[24px]"
    >
      {error && <Alert type="error" message={error} className="mb-4" />}

        <form className="grid gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
          {/* Thông tin định danh */}
          <Field label="Mã nhân viên">
            <Input
              value={form.maNhanVien}
              onChange={(e) => handleChange({ maNhanVien: e.target.value })}
              placeholder="VD: NV001"
              required
            />
          </Field>
          <Field label="Họ tên">
            <Input
              value={form.hoTen}
              onChange={(e) => handleChange({ hoTen: e.target.value })}
              placeholder="VD: Nguyễn Văn A"
              required
            />
          </Field>

          {/* Chi nhánh & Phòng ban (Quan trọng nhất cho Publisher) */}
          <Field label="Chi nhánh">
            {isNode ? (
              <Input
                value={form.maChiNhanh}
                readOnly
                className="bg-gray-50 opacity-70"
              />
            ) : (
              <Select
                value={form.maChiNhanh}
                onChange={(e) => handleChange({ maChiNhanh: e.target.value })}
                required
              >
                <option value="">-- Chọn chi nhánh --</option>
                {branches.map((b) => (
                  <option key={b.MaChiNhanh} value={b.MaChiNhanh}>
                    {b.TenChiNhanh} ({b.MaChiNhanh})
                  </option>
                ))}
              </Select>
            )}
          </Field>

          <Field label="Phòng ban">
            <Select
              value={form.maPhongBan}
              onChange={(e) => handleChange({ maPhongBan: e.target.value })}
              required
            >
              <option value="">-- Chọn phòng ban --</option>
              {SEED_DEPARTMENTS
                .filter(d => !form.maChiNhanh || d.MaChiNhanh === form.maChiNhanh)
                .map((dept) => (
                  <option key={dept.MaPhongBan} value={dept.MaPhongBan}>
                    {dept.TenPhongBan} ({dept.MaPhongBan})
                  </option>
                ))
              }
            </Select>
          </Field>

          <Field label="Chức vụ">
            <Select
              value={form.maChucVu}
              onChange={(e) => handleChange({ maChucVu: e.target.value })}
              required
            >
              <option value="">-- Chọn chức vụ --</option>
              {SEED_POSITIONS.map((pos) => (
                <option key={pos.MaChucVu} value={pos.MaChucVu}>
                  {pos.TenChucVu} ({pos.MaChucVu})
                </option>
              ))}
            </Select>
          </Field>

          <Field label="Ngày vào làm">
            <Input
              type="date"
              value={form.ngayVaoLam}
              onChange={(e) => handleChange({ ngayVaoLam: e.target.value })}
            />
          </Field>

          {/* Thông tin cá nhân */}
          <Field label="Ngày sinh">
            <Input
              type="date"
              value={form.ngaySinh}
              onChange={(e) => handleChange({ ngaySinh: e.target.value })}
            />
          </Field>
          <Field label="Giới tính">
            <Select
              value={form.gioiTinh}
              onChange={(e) => handleChange({ gioiTinh: e.target.value })}
            >
              <option value="Nam">Nam</option>
              <option value="Nữ">Nữ</option>
              <option value="Khác">Khác</option>
            </Select>
          </Field>
          <Field label="Số điện thoại">
            <Input
              value={form.sdt}
              onChange={(e) => handleChange({ sdt: e.target.value })}
              placeholder="09xxx..."
            />
          </Field>
          <Field label="Email">
            <Input
              type="email"
              value={form.email}
              onChange={(e) => handleChange({ email: e.target.value })}
              placeholder="example@company.com"
            />
          </Field>

          <div className="md:col-span-2 flex items-center justify-end gap-3 mt-4">
            <Button type="button" variant="secondary" onClick={onClose}>
              Hủy
            </Button>
            <Button
              type="submit"
              variant="accent"
              loading={submittingKey === 'create-employee'}
            >
              <UserPlus className="h-4 w-4" />
              Thêm mới
            </Button>
          </div>
        </form>
    </Modal>
  );
}
