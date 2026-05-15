import React from 'react';
import Panel from '../Panel';
import Field from '../Field';
import Input from '../Input';
import Select from '../Select';
import Button from '../Button';

export default function AccountFormPanel({ 
  form, 
  setForm, 
  onSubmit, 
  submitting, 
  branches 
}) {
  return (
    <Panel title="Tạo tài khoản" subtitle="Cấp quyền truy cập cho nhân sự mới.">
      <form
        className="grid gap-4 md:grid-cols-2"
        onSubmit={(event) => {
          event.preventDefault();
          onSubmit();
        }}
      >
        <Field label="Username">
          <Input 
            value={form.username} 
            onChange={(event) => setForm({ ...form, username: event.target.value })} 
            required 
          />
        </Field>
        <Field label="Password">
          <Input 
            type="password" 
            value={form.password} 
            onChange={(event) => setForm({ ...form, password: event.target.value })} 
            required 
          />
        </Field>
        <Field label="Quyền">
          <Select 
            value={form.maRole} 
            onChange={(event) => setForm({ ...form, maRole: event.target.value })}
          >
            <option value="publisher_admin">Publisher Admin</option>
            <option value="node_admin">Node Admin</option>
            <option value="hr_manager">HR Manager</option>
            <option value="staff">Staff</option>
            <option value="viewer">Viewer</option>
          </Select>
        </Field>
        <Field label="Chi nhánh">
          <Select 
            value={form.maChiNhanh} 
            onChange={(event) => setForm({ ...form, maChiNhanh: event.target.value })}
          >
            <option value="">-- Trung tâm (Global) --</option>
            {branches.map((b) => (
              <option key={b.MaChiNhanh} value={b.MaChiNhanh}>{b.TenChiNhanh}</option>
            ))}
          </Select>
        </Field>
        <Button 
          type="submit" 
          variant="accent" 
          loading={submitting} 
          className="md:col-span-2"
        >
          Tạo tài khoản
        </Button>
      </form>
    </Panel>
  );
}
