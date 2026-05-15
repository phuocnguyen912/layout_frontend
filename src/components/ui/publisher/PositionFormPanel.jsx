import React from 'react';
import Panel from '../Panel';
import Field from '../Field';
import Input from '../Input';
import Button from '../Button';

export default function PositionFormPanel({ form, setForm, onSubmit, submitting }) {
  return (
    <Panel title="Tạo chức vụ" subtitle="Khai báo chức vụ và hệ số lương.">
      <form
        className="grid gap-4 md:grid-cols-2"
        onSubmit={(event) => {
          event.preventDefault();
          onSubmit();
        }}
      >
        <Field label="Mã chức vụ">
          <Input 
            value={form.maChucVu} 
            onChange={(event) => setForm({ ...form, maChucVu: event.target.value })} 
            required 
          />
        </Field>
        <Field label="Tên chức vụ">
          <Input 
            value={form.tenChucVu} 
            onChange={(event) => setForm({ ...form, tenChucVu: event.target.value })} 
            required 
          />
        </Field>
        <Field label="Hệ số lương">
          <Input 
            type="number" 
            step="0.1" 
            value={form.heSoLuong} 
            onChange={(event) => setForm({ ...form, heSoLuong: event.target.value })} 
            className="md:col-span-2" 
          />
        </Field>
        <Button 
          type="submit" 
          variant="accent" 
          loading={submitting} 
          className="md:col-span-2"
        >
          Tạo chức vụ
        </Button>
      </form>
    </Panel>
  );
}
