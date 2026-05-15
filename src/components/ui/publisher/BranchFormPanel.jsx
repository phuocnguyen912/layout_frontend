import React from 'react';
import Panel from '../Panel';
import Field from '../Field';
import Input from '../Input';
import Button from '../Button';

export default function BranchFormPanel({ form, setForm, onSubmit, submitting }) {
  return (
    <Panel title="Tạo chi nhánh" subtitle="Thêm chi nhánh mới vào hệ thống.">
      <form
        className="grid gap-4 md:grid-cols-2"
        onSubmit={(event) => {
          event.preventDefault();
          onSubmit();
        }}
      >
        <Field label="Mã chi nhánh">
          <Input 
            value={form.maChiNhanh} 
            onChange={(event) => setForm({ ...form, maChiNhanh: event.target.value })} 
            required 
          />
        </Field>
        <Field label="Tên chi nhánh">
          <Input 
            value={form.tenChiNhanh} 
            onChange={(event) => setForm({ ...form, tenChiNhanh: event.target.value })} 
            required 
          />
        </Field>
        <Field label="Địa chỉ" >
          <Input 
            value={form.diaChi} 
            onChange={(event) => setForm({ ...form, diaChi: event.target.value })} 
            className="md:col-span-2" 
          />
        </Field>
        <Button 
          type="submit" 
          variant="accent" 
          loading={submitting} 
          className="md:col-span-2"
        >
          Tạo chi nhánh
        </Button>
      </form>
    </Panel>
  );
}
