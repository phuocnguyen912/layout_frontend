import React from 'react';
import { FileText } from 'lucide-react';
import Panel from '../Panel';
import Field from '../Field';
import Input from '../Input';
import Button from '../Button';

export default function ContractFormPanel({ form, setForm, onSubmit, submitting }) {
  return (
    <Panel title="Tạo hợp đồng local" subtitle="POST `/node/contracts`">
      <form
        className="grid gap-4 md:grid-cols-2"
        onSubmit={(event) => {
          event.preventDefault();
          onSubmit();
        }}
      >
        <Field label="Ma hop dong">
          <Input
            value={form.maHopDong}
            onChange={(event) => setForm({ ...form, maHopDong: event.target.value })}
            required
          />
        </Field>
        <Field label="Ma nhan vien">
          <Input
            value={form.maNhanVien}
            onChange={(event) => setForm({ ...form, maNhanVien: event.target.value })}
            required
          />
        </Field>
        <Field label="Loai hop dong">
          <Input
            value={form.maLoaiHopDong}
            onChange={(event) => setForm({ ...form, maLoaiHopDong: event.target.value })}
            required
          />
        </Field>
        <Field label="Trạng thái">
          <Input
            value={form.trangThai}
            onChange={(event) => setForm({ ...form, trangThai: event.target.value })}
          />
        </Field>
        <Field label="Ngày bắt đầu">
          <Input
            type="date"
            value={form.ngayBatDau}
            onChange={(event) => setForm({ ...form, ngayBatDau: event.target.value })}
          />
        </Field>
        <Field label="Ngày kết thúc">
          <Input
            type="date"
            value={form.ngayKetThuc}
            onChange={(event) => setForm({ ...form, ngayKetThuc: event.target.value })}
          />
        </Field>
        <Button
          type="submit"
          variant="accent"
          loading={submitting}
          className="md:col-span-2"
        >
          <FileText className="h-4 w-4" />
          Tạo hợp đồng
        </Button>
      </form>
    </Panel>
  );
}
