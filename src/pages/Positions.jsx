import { useEffect, useMemo, useState } from 'react';
import { BriefcaseBusiness, Edit3, Save } from 'lucide-react';
import SectionHeader from '../components/ui/SectionHeader';
import Panel from '../components/ui/Panel';
import Field from '../components/ui/Field';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import DataTable from '../components/ui/DataTable';
import StatCard from '../components/ui/StatCard';

const emptyForm = {
  maChucVu: '',
  tenChucVu: '',
  heSoLuong: '',
};

function normalizePosition(item) {
  return {
    maChucVu: item.MaChucVu || item.maChucVu || '',
    tenChucVu: item.TenChucVu || item.tenChucVu || '',
    heSoLuong: item.HeSoLuong ?? item.heSoLuong ?? '',
  };
}

export default function Positions({
  isPublisher,
  publisherApi,
  nodeApi,
  publisherData,
  runAction,
  submittingKey,
}) {
  const [nodePositions, setNodePositions] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingCode, setEditingCode] = useState('');
  const [editForm, setEditForm] = useState(emptyForm);

  useEffect(() => {
    if (!isPublisher && nodeApi?.listPositions) {
      nodeApi.listPositions().then(setNodePositions).catch(() => setNodePositions([]));
    }
  }, [isPublisher, nodeApi]);

  const positions = useMemo(
    () => (isPublisher ? publisherData?.positions || [] : nodePositions).map(normalizePosition),
    [isPublisher, nodePositions, publisherData?.positions],
  );

  const avgCoefficient = positions.length
    ? positions.reduce((sum, item) => sum + Number(item.heSoLuong || 0), 0) / positions.length
    : 0;

  const submitCreate = () => {
    if (!publisherApi?.createPosition) return;
    runAction(
      'create-position',
      () =>
        publisherApi.createPosition({
          maChucVu: form.maChucVu.trim(),
          tenChucVu: form.tenChucVu.trim(),
          heSoLuong: form.heSoLuong ? Number(form.heSoLuong) : undefined,
        }),
      () => setForm(emptyForm),
    );
  };

  const startEdit = (position) => {
    setEditingCode(position.maChucVu);
    setEditForm({
      maChucVu: position.maChucVu,
      tenChucVu: position.tenChucVu,
      heSoLuong: position.heSoLuong,
    });
  };

  const submitEdit = () => {
    if (!publisherApi?.updatePosition || !editingCode) return;
    runAction(
      'update-position',
      () =>
        publisherApi.updatePosition(editingCode, {
          tenChucVu: editForm.tenChucVu.trim(),
          heSoLuong: editForm.heSoLuong ? Number(editForm.heSoLuong) : undefined,
        }),
      () => {
        setEditingCode('');
        setEditForm(emptyForm);
      },
    );
  };

  const columns = [
    { key: 'maChucVu', label: 'Mã chức vụ' },
    {
      key: 'tenChucVu',
      label: 'Tên chức vụ',
      render: (row) =>
        editingCode === row.maChucVu ? (
          <Input
            value={editForm.tenChucVu}
            onChange={(event) => setEditForm((prev) => ({ ...prev, tenChucVu: event.target.value }))}
            required
          />
        ) : (
          <span className="font-semibold text-[var(--hr-ink)]">{row.tenChucVu}</span>
        ),
    },
    {
      key: 'heSoLuong',
      label: 'Hệ số lương',
      render: (row) =>
        editingCode === row.maChucVu ? (
          <Input
            type="number"
            step="0.1"
            value={editForm.heSoLuong}
            onChange={(event) => setEditForm((prev) => ({ ...prev, heSoLuong: event.target.value }))}
          />
        ) : (
          Number(row.heSoLuong || 0).toFixed(2)
        ),
    },
    {
      key: 'actions',
      label: 'Thao tác',
      render: (row) =>
        isPublisher ? (
          editingCode === row.maChucVu ? (
            <div className="flex gap-2">
              <Button
                type="button"
                variant="accent"
                loading={submittingKey === 'update-position'}
                onClick={submitEdit}
              >
                <Save className="h-4 w-4" />
                Lưu
              </Button>
              <Button type="button" variant="secondary" onClick={() => setEditingCode('')}>
                Hủy
              </Button>
            </div>
          ) : (
            <Button type="button" variant="secondary" onClick={() => startEdit(row)}>
              <Edit3 className="h-4 w-4" />
              Sửa
            </Button>
          )
        ) : (
          <span className="text-sm text-[var(--hr-muted)]">Đồng bộ từ Publisher</span>
        ),
    },
  ];

  return (
    <>
      <SectionHeader
        eyebrow="Positions"
        title="Quản lý chức vụ"
        description="Chức vụ là dữ liệu dùng chung trên Publisher. Node chỉ đọc bản sao local sau khi đồng bộ."
      />

      <div className="grid gap-4 md:grid-cols-2">
        <StatCard title="Tổng chức vụ" value={positions.length} hint="Đang hiển thị" icon={BriefcaseBusiness} tone="slate" />
        <StatCard title="Hệ số trung bình" value={avgCoefficient.toFixed(2)} hint="Dùng để tính lương cơ bản" icon={BriefcaseBusiness} tone="emerald" />
      </div>

      {isPublisher ? (
        <Panel title="Tạo chức vụ" subtitle="Khai báo chức vụ dùng chung cho toàn hệ thống.">
          <form
            className="grid gap-4 md:grid-cols-3"
            onSubmit={(event) => {
              event.preventDefault();
              submitCreate();
            }}
          >
            <Field label="Mã chức vụ">
              <Input value={form.maChucVu} onChange={(event) => setForm({ ...form, maChucVu: event.target.value })} required />
            </Field>
            <Field label="Tên chức vụ">
              <Input value={form.tenChucVu} onChange={(event) => setForm({ ...form, tenChucVu: event.target.value })} required />
            </Field>
            <Field label="Hệ số lương">
              <Input type="number" step="0.1" value={form.heSoLuong} onChange={(event) => setForm({ ...form, heSoLuong: event.target.value })} />
            </Field>
            <Button type="submit" variant="accent" loading={submittingKey === 'create-position'} className="md:col-span-3">
              Tạo chức vụ
            </Button>
          </form>
        </Panel>
      ) : null}

      <Panel title="Danh sách chức vụ" subtitle={isPublisher ? 'Dữ liệu dùng chung trên Publisher.' : 'Dữ liệu chức vụ đã đồng bộ về chi nhánh.'}>
        <DataTable columns={columns} rows={positions.map((item) => ({ ...item, id: item.maChucVu }))} emptyText="Chưa có chức vụ" />
      </Panel>
    </>
  );
}
