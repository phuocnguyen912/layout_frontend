import React from 'react';
import Field from '../Field';
import Select from '../Select';
import Button from '../Button';
import Alert from '../Alert';

export default function LeaveApprovalPanel({
  error,
  form,
  setForm,
  leaves,
  submitting,
  onSubmit,
}) {
  return (
    <div className="space-y-4">
      <p className="font-semibold text-[var(--hr-ink)]">Phê duyệt</p>
      {error && <Alert type="error" message={error} />}
      
      <Field label="Chọn đơn (Mã)">
        <Select 
          value={form.maNghiPhep} 
          onChange={(e) => setForm({ ...form, maNghiPhep: e.target.value })}
        >
          <option value="">-- Chọn đơn --</option>
          {leaves.map((l) => (
            <option key={l.MaNghiPhep} value={l.MaNghiPhep}>
              #{l.MaNghiPhep} - {l.MaNhanVien} ({l.TrangThai})
            </option>
          ))}
        </Select>
      </Field>
      
      <Field label="Trạng thái">
        <Select 
          value={form.trangThai} 
          onChange={(e) => setForm({ ...form, trangThai: e.target.value })}
        >
          <option value="DA_DUYET">Duyệt (DA_DUYET)</option>
          <option value="TU_CHOI">Từ chối (TU_CHOI)</option>
        </Select>
      </Field>
      
      <Button 
        variant="secondary" 
        className="w-full" 
        loading={submitting} 
        onClick={onSubmit}
      >
        Cập nhật trạng thái
      </Button>
    </div>
  );
}
