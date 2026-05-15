import { useEffect, useMemo, useState } from 'react';
import { Plus, RefreshCw, Save } from 'lucide-react';
import SectionHeader from '../components/ui/SectionHeader';
import Panel from '../components/ui/Panel';
import Field from '../components/ui/Field';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import DataTable from '../components/ui/DataTable';

const emptyForm = { maChucVu: '', tenChucVu: '', heSoLuong: '' };

export default function Positions({
  isPublisher,
  publisherApi,
  nodeApi,
  publisherData,
  runAction,
  submittingKey,
}) {
  const [form, setForm] = useState(emptyForm);
  const [nodePositions, setNodePositions] = useState([]);
  const [loadingNode, setLoadingNode] = useState(false);
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState('');

  const rows = useMemo(
    () => (isPublisher ? publisherData.positions || [] : nodePositions),
    [isPublisher, nodePositions, publisherData.positions],
  );

  async function loadNodePositions() {
    if (!nodeApi) return;
    setLoadingNode(true);
    setError('');
    try {
      const result = await nodeApi.listPositions();
      setNodePositions(result || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingNode(false);
    }
  }

  useEffect(() => {
    if (!isPublisher) loadNodePositions();
  }, [isPublisher]);

  function resetForm() {
    setForm(emptyForm);
    setEditingId('');
  }

  function validate() {
    if (!form.maChucVu.trim()) return 'Mã chức vụ không được để trống.';
    if (!form.tenChucVu.trim()) return 'Tên chức vụ không được để trống.';
    if (form.heSoLuong && Number(form.heSoLuong) <= 0) return 'Hệ số lương phải lớn hơn 0.';
    return '';
  }

  function submitPosition(event) {
    event.preventDefault();
    const message = validate();
    if (message) {
      setError(message);
      return;
    }

    setError('');
    const body = {
      maChucVu: form.maChucVu.trim(),
      tenChucVu: form.tenChucVu.trim(),
      heSoLuong: form.heSoLuong ? Number(form.heSoLuong) : undefined,
    };

    const action = editingId
      ? () => publisherApi.updatePosition(editingId, {
        tenChucVu: body.tenChucVu,
        heSoLuong: body.heSoLuong,
      })
      : () => publisherApi.createPosition(body);

    runAction(editingId ? 'update-position' : 'create-position', action, resetForm);
  }

  return (
    <>
      <SectionHeader
        eyebrow="Chức vụ"
        title="Quản lý chức vụ"
        description={isPublisher ? 'Tạo và cập nhật chức vụ dùng chung toàn hệ thống.' : 'Xem danh mục chức vụ đã đồng bộ về chi nhánh.'}
      />

      {error && <div className="rounded-2xl bg-[#f3d9d2] px-4 py-3 text-sm text-[#8a3828]">{error}</div>}

      <div className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
        <Panel
          title={isPublisher ? (editingId ? 'Cập nhật chức vụ' : 'Tạo chức vụ') : 'Danh mục đồng bộ'}
          subtitle={isPublisher ? 'Publisher là nơi quản lý danh mục chức vụ.' : 'Chi nhánh chỉ đọc danh mục này sau khi đồng bộ.'}
        >
          {isPublisher ? (
            <form className="grid gap-4" onSubmit={submitPosition}>
              <Field label="Mã chức vụ">
                <Input
                  value={form.maChucVu}
                  onChange={(event) => setForm({ ...form, maChucVu: event.target.value })}
                  disabled={Boolean(editingId)}
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
                  min="0"
                  value={form.heSoLuong}
                  onChange={(event) => setForm({ ...form, heSoLuong: event.target.value })}
                />
              </Field>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button
                  type="submit"
                  variant="accent"
                  loading={submittingKey === 'create-position' || submittingKey === 'update-position'}
                  className="flex-1"
                >
                  {editingId ? <Save className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                  {editingId ? 'Lưu thay đổi' : 'Tạo chức vụ'}
                </Button>
                {editingId ? (
                  <Button type="button" variant="secondary" onClick={resetForm}>
                    Hủy
                  </Button>
                ) : null}
              </div>
            </form>
          ) : (
            <Button variant="secondary" loading={loadingNode} onClick={loadNodePositions}>
              <RefreshCw className="h-4 w-4" />
              Tải lại danh mục
            </Button>
          )}
        </Panel>

        <Panel title="Danh sách chức vụ" subtitle={`${rows.length} chức vụ`}>
          <DataTable
            columns={[
              { key: 'MaChucVu', label: 'Mã' },
              { key: 'TenChucVu', label: 'Tên chức vụ' },
              { key: 'HeSoLuong', label: 'Hệ số lương' },
              ...(isPublisher ? [{
                key: 'actions',
                label: 'Thao tác',
                render: (row) => (
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => {
                      setEditingId(row.MaChucVu);
                      setForm({
                        maChucVu: row.MaChucVu || '',
                        tenChucVu: row.TenChucVu || '',
                        heSoLuong: row.HeSoLuong ?? '',
                      });
                    }}
                  >
                    Sửa
                  </Button>
                ),
              }] : []),
            ]}
            rows={rows}
          />
        </Panel>
      </div>
    </>
  );
}
