import React from 'react';
import Panel from '../Panel';
import Field from '../Field';
import Input from '../Input';
import Button from '../Button';

export default function ContractTypeFormPanel({ form, setForm, onSubmit, submitting }) {
  return (
    <Panel title="Tạo loại hợp đồng" subtitle="Quản lý các loại hợp đồng lao động.">
      <form
        className="grid gap-4 md:grid-cols-2"
        onSubmit={(event) => {
          event.preventDefault();
          onSubmit();
        }}
      >
        <Field label="Mã loại HĐ">
          <Input 
            value={form.maLoaiHopDong} 
            onChange={(event) => setForm({ ...form, maLoaiHopDong: event.target.value })} 
            required 
          />
        </Field>
        <Field label="Tên loại HĐ">
          <Input 
            value={form.tenLoaiHopDong} 
            onChange={(event) => setForm({ ...form, tenLoaiHopDong: event.target.value })} 
            required 
          />
        </Field>
        <Field label="Thời hạn (tháng)">
          <Input 
            type="number" 
            value={form.thoiHanThang} 
            onChange={(event) => setForm({ ...form, thoiHanThang: event.target.value })} 
            placeholder="Để trống nếu vô thời hạn" 
            className="md:col-span-2" 
          />
        </Field>
        <Button 
          type="submit" 
          variant="accent" 
          loading={submitting} 
          className="md:col-span-2"
        >
          Tạo loại hợp đồng
        </Button>
      </form>
    </Panel>
  );
}
