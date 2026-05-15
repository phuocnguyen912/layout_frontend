import React from 'react';
import Field from '../Field';
import Select from '../Select';
import Input from '../Input';

export default function EmployeeSelect({ value, onChange, employees, label = 'Mã nhân viên' }) {
  if (!employees || employees.length === 0) {
    return (
      <Field label={label}>
        <Input value={value} onChange={onChange} placeholder="Nhập mã nhân viên" />
      </Field>
    );
  }
  
  return (
    <Field label={label}>
      <Select value={value} onChange={onChange}>
        <option value="">-- Chọn nhân viên --</option>
        {employees.map((e) => (
          <option key={e.MaNhanVien} value={e.MaNhanVien}>
            {e.MaNhanVien} — {e.HoTen}
          </option>
        ))}
      </Select>
    </Field>
  );
}
