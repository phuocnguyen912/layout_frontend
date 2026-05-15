import React from 'react';
import Field from '../Field';
import Input from '../Input';
import Button from '../Button';
import Alert from '../Alert';
import EmployeeSelect from '../employees/EmployeeSelect';
import { formatDateTime } from '../../../utils/format';

export default function AttendanceFormPanel({
  title,
  error,
  result,
  form,
  setForm,
  employees,
  submitting,
  onSubmit,
  buttonText,
  buttonVariant = 'accent',
  timeLabel = 'Giờ',
  resultKey = 'GioVao',
  resultPrefix = 'Vào lúc: ',
}) {
  return (
    <div className="space-y-4">
      <p className="font-semibold text-[var(--hr-ink)]">{title}</p>
      {error && <Alert type="error" message={error} />}
      {result && <Alert type="success" message={`${resultPrefix}${formatDateTime(result[resultKey])}`} />}
      
      <EmployeeSelect 
        employees={employees} 
        value={form.maNhanVien} 
        onChange={(val) => setForm({ ...form, maNhanVien: val })} 
      />
      
      <Field label="Ngày">
        <Input 
          type="date" 
          value={form.ngay} 
          onChange={(e) => setForm({ ...form, ngay: e.target.value })} 
        />
      </Field>
      
      <Field label={timeLabel}>
        <Input 
          type="time" 
          step="1" 
          value={form.gio} 
          onChange={(e) => setForm({ ...form, gio: e.target.value })} 
        />
      </Field>
      
      <Button 
        variant={buttonVariant} 
        className="w-full" 
        loading={submitting} 
        onClick={onSubmit}
      >
        {buttonText}
      </Button>
    </div>
  );
}
