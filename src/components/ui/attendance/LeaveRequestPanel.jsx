import React from 'react';
import Field from '../Field';
import Input from '../Input';
import Button from '../Button';
import Alert from '../Alert';
import EmployeeSelect from '../employees/EmployeeSelect';

export default function LeaveRequestPanel({
  error,
  created,
  form,
  setForm,
  employees,
  submitting,
  onSubmit,
}) {
  return (
    <div className="space-y-4">
      <p className="font-semibold text-[var(--hr-ink)]">Tạo đơn nghỉ</p>
      {error && <Alert type="error" message={error} />}
      {created && <Alert type="success" message={`Đã tạo đơn #${created.maNghiPhep}`} />}
      
      <EmployeeSelect 
        employees={employees} 
        value={form.maNhanVien} 
        onChange={(val) => setForm({ ...form, maNhanVien: val })} 
      />
      
      <div className="grid grid-cols-2 gap-2">
        <Field label="Từ ngày">
          <Input 
            type="date" 
            value={form.tuNgay} 
            onChange={(e) => setForm({ ...form, tuNgay: e.target.value })} 
          />
        </Field>
        <Field label="Đến ngày">
          <Input 
            type="date" 
            value={form.denNgay} 
            onChange={(e) => setForm({ ...form, denNgay: e.target.value })} 
          />
        </Field>
      </div>
      
      <Field label="Lý do">
        <Input 
          value={form.lyDo} 
          onChange={(e) => setForm({ ...form, lyDo: e.target.value })} 
          placeholder="Lý do nghỉ..." 
        />
      </Field>
      
      <Button 
        variant="accent" 
        className="w-full" 
        loading={submitting} 
        onClick={onSubmit}
      >
        Gửi đơn
      </Button>
    </div>
  );
}
