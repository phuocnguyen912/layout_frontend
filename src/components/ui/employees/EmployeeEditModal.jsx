import React, { useState, useEffect } from 'react';
import Field from '../Field';
import Input from '../Input';
import Select from '../Select';
import Button from '../Button';
import Modal from '../Modal';
import Alert from '../Alert';
import { SEED_POSITIONS, SEED_DEPARTMENTS } from '../../../data/employees';

export default function EmployeeEditModal({
  employee,
  editForm,
  editError,
  submittingKey,
  onClose,
  onChange,
  onSubmit,
}) {
  const [localError, setLocalError] = useState('');

  useEffect(() => {
    if (employee) setLocalError('');
  }, [employee]);

  if (!employee) return null;

  function validate(data) {
    if (!data.HoTen?.trim()) return 'Họ tên không được để trống.';
    
    if (data.Email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(data.Email)) return 'Địa chỉ email không hợp lệ.';
    }

    if (data.SDT) {
      const phoneRegex = /^0\d{9}$/;
      if (!phoneRegex.test(data.SDT)) return 'Số điện thoại phải bắt đầu bằng số 0 và có đúng 10 chữ số.';
    }

    if (!data.MaPhongBan?.trim()) return 'Vui lòng chọn phòng ban.';
    if (!data.MaChucVu?.trim()) return 'Vui lòng chọn chức vụ.';

    return '';
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    const err = validate(editForm);
    if (err) {
      setLocalError(err);
      return;
    }
    setLocalError('');
    onSubmit(event); // Re-pass the event to the parent handler
  };

  const handleFieldChange = (patch) => {
    const next = { ...editForm, ...patch };

    // Auto-assign branch when department is selected
    if (patch.MaPhongBan) {
      const dept = SEED_DEPARTMENTS.find(d => d.MaPhongBan === patch.MaPhongBan);
      if (dept && dept.MaChiNhanh) {
        next.MaChiNhanh = dept.MaChiNhanh;
      }
    }

    onChange(next);
  };

  return (
    <Modal
      isOpen={!!employee}
      onClose={onClose}
      title={`Sửa nhân viên: ${employee.HoTen || 'N/A'}`}
      maxWidth="max-w-3xl"
      padding="p-6"
      rounded="rounded-[24px]"
    >
      {(editError || localError) && (
        <Alert type="error" message={editError || localError} className="mb-4" />
      )}

      <form className="grid gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
        <Field label="Mã nhân viên (Không thể sửa)">
          <Input 
            value={editForm.MaNhanVien} 
            readOnly 
            className="bg-gray-50 opacity-70 cursor-not-allowed"
          />
        </Field>
        <Field label="Họ tên">
          <Input 
            value={editForm.HoTen} 
            onChange={(event) => handleFieldChange({ HoTen: event.target.value })} 
            required
          />
        </Field>
        <Field label="Email">
          <Input 
            type="email" 
            value={editForm.Email} 
            onChange={(event) => handleFieldChange({ Email: event.target.value })} 
          />
        </Field>
        <Field label="Số điện thoại">
          <Input 
            value={editForm.SDT} 
            onChange={(event) => handleFieldChange({ SDT: event.target.value })} 
          />
        </Field>
        <Field label="Ngày sinh">
          <Input 
            type="date" 
            value={editForm.NgaySinh} 
            onChange={(event) => handleFieldChange({ NgaySinh: event.target.value })} 
          />
        </Field>
        <Field label="Ngày vào làm">
          <Input 
            type="date" 
            value={editForm.NgayVaoLam} 
            onChange={(event) => handleFieldChange({ NgayVaoLam: event.target.value })} 
          />
        </Field>
        
        <Field label="Giới tính">
          <Select
            value={editForm.GioiTinh}
            onChange={(event) => handleFieldChange({ GioiTinh: event.target.value })}
          >
            <option value="Nam">Nam</option>
            <option value="Nữ">Nữ</option>
            <option value="Khác">Khác</option>
          </Select>
        </Field>

        <Field label="Chi nhánh">
          <Input 
            value={editForm.MaChiNhanh} 
            readOnly 
            className="bg-gray-50 opacity-70"
          />
        </Field>

        <Field label="Phòng ban">
          <Select
            value={editForm.MaPhongBan}
            onChange={(event) => handleFieldChange({ MaPhongBan: event.target.value })}
            required
          >
            <option value="">-- Chọn phòng ban --</option>
            {SEED_DEPARTMENTS.filter(d => !editForm.MaChiNhanh || d.MaChiNhanh === editForm.MaChiNhanh).map((dept) => (
              <option key={dept.MaPhongBan} value={dept.MaPhongBan}>
                {dept.TenPhongBan} ({dept.MaPhongBan})
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Chức vụ">
          <Select 
            value={editForm.MaChucVu} 
            onChange={(event) => handleFieldChange({ MaChucVu: event.target.value })}
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
        <Field label="Trạng thái">
          <Select
            value={editForm.TrangThai}
            onChange={(event) => handleFieldChange({ TrangThai: event.target.value })}
          >
            <option value="Đang làm việc">Đang làm việc</option>
            <option value="Nghỉ việc">Nghỉ việc</option>
            <option value="Tạm hoãn">Tạm hoãn</option>
          </Select>
        </Field>

        <div className="md:col-span-2 flex items-center justify-end gap-3 mt-4">
          <Button type="button" variant="secondary" onClick={onClose}>
            Hủy
          </Button>
          <Button type="submit" variant="accent" loading={submittingKey === 'update-employee'}>
            Lưu thay đổi
          </Button>
        </div>
      </form>
    </Modal>
  );
}
