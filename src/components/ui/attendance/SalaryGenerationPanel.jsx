import React from 'react';
import Field from '../Field';
import Input from '../Input';
import Button from '../Button';
import Alert from '../Alert';
import EmployeeSelect from '../employees/EmployeeSelect';
import { formatCurrency } from '../../../utils/format';

export default function SalaryGenerationPanel({
  error,
  result,
  form,
  setForm,
  employees,
  submitting,
  onSubmit,
}) {
  return (
    <div className="space-y-4">
      {error && <Alert type="error" message={error} />}
      {result && (
        <Alert type="success">
          <div className="text-sm">
            <p className="font-bold">Tổng lương: {formatCurrency(result.tongLuong)}</p>
            <p>Số ngày công: {result.soNgayCong}</p>
          </div>
        </Alert>
      )}
      
      <EmployeeSelect 
        employees={employees} 
        value={form.maNhanVien} 
        onChange={(val) => setForm({ ...form, maNhanVien: val })} 
      />
      
      <div className="grid grid-cols-2 gap-2">
        <Field label="Tháng">
          <Input 
            type="number" 
            value={form.thang} 
            onChange={(e) => setForm({ ...form, thang: e.target.value })} 
          />
        </Field>
        <Field label="Năm">
          <Input 
            type="number" 
            value={form.nam} 
            onChange={(e) => setForm({ ...form, nam: e.target.value })} 
          />
        </Field>
      </div>
      
      <div className="grid grid-cols-3 gap-2">
        <Field label="Phụ cấp">
          <Input 
            type="number" 
            value={form.phuCap} 
            onChange={(e) => setForm({ ...form, phuCap: e.target.value })} 
          />
        </Field>
        <Field label="Thưởng">
          <Input 
            type="number" 
            value={form.thuong} 
            onChange={(e) => setForm({ ...form, thuong: e.target.value })} 
          />
        </Field>
        <Field label="Khấu trừ">
          <Input 
            type="number" 
            value={form.khauTru} 
            onChange={(e) => setForm({ ...form, khauTru: e.target.value })} 
          />
        </Field>
      </div>
      
      <Button 
        variant="accent" 
        className="w-full" 
        loading={submitting} 
        onClick={onSubmit}
      >
        Tính lương
      </Button>
    </div>
  );
}
